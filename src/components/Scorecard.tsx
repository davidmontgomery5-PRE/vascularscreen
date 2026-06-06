import { useMemo, useState } from 'react';
import { CRITERIA, type CriterionGroup } from '../data/criteria';
import { PAYORS, type PayorId } from '../data/payors';
import { scoreAll } from '../engine/score';
import { CriterionChip } from './CriterionChip';
import { StudyBreakdownCard } from './StudyBreakdownCard';
import { STUDIES } from '../data/studies';
import { VERDICT_ICONS } from '../data/scorecard.config';

interface Props {
  activeIds: string[];
  payor: PayorId;
  aaaPriorSbe: boolean;
  onToggle: (id: string) => void;
  onPayorChange: (p: PayorId) => void;
  onAaaPriorSbeChange: (v: boolean) => void;
}

const GROUPS: { id: CriterionGroup; label: string }[] = [
  { id: 'risk', label: 'Risk Factors' },
  { id: 'symptom', label: 'Symptoms' },
  { id: 'trigger', label: 'Screening Triggers' },
];

export function Scorecard({
  activeIds,
  payor,
  aaaPriorSbe,
  onToggle,
  onPayorChange,
  onAaaPriorSbeChange,
}: Props) {
  const [copyState, setCopyState] = useState<'idle' | 'copied'>('idle');

  const scores = useMemo(
    () => scoreAll({ activeIds, payor, aaaPriorSbe }),
    [activeIds, payor, aaaPriorSbe],
  );

  const handleCopy = async () => {
    const note = buildNote(scores, payor);
    try {
      await navigator.clipboard.writeText(note);
      setCopyState('copied');
      setTimeout(() => setCopyState('idle'), 1500);
    } catch {
      // fallback: silent — modern browsers should support clipboard in secure contexts
    }
  };

  return (
    <div className="mx-auto grid max-w-6xl gap-6 px-4 py-6 lg:grid-cols-[1fr_360px]">
      <div className="space-y-6">
        {GROUPS.map((g) => (
          <section key={g.id} className="rounded-lg border border-slate-200 bg-white p-4">
            <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-600">
              {g.label}
            </h2>
            <div className="flex flex-wrap gap-2">
              {CRITERIA.filter((c) => c.group === g.id).map((c) => (
                <CriterionChip
                  key={c.id}
                  criterion={c}
                  active={activeIds.includes(c.id)}
                  onToggle={onToggle}
                />
              ))}
            </div>
          </section>
        ))}

        <section className="rounded-lg border border-slate-200 bg-white p-4">
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-600">
            Insurance
          </h2>
          <div className="flex flex-wrap gap-2">
            {PAYORS.map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => onPayorChange(p.id)}
                aria-pressed={payor === p.id}
                className={`rounded-full border px-3 py-1.5 text-sm ${
                  payor === p.id
                    ? 'border-slate-900 bg-slate-900 text-white'
                    : 'border-slate-300 bg-white text-slate-700 hover:bg-slate-50'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
          <label className="mt-3 flex items-center gap-2 text-xs text-slate-600">
            <input
              type="checkbox"
              checked={aaaPriorSbe}
              onChange={(e) => onAaaPriorSbeChange(e.target.checked)}
              className="h-4 w-4 rounded border-slate-300"
            />
            Patient has already used Medicare AAA SBE benefit
          </label>
        </section>
      </div>

      <aside className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-600">
            Per-study verdict
          </h2>
          <button
            onClick={handleCopy}
            className="rounded-md border border-slate-300 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50"
          >
            {copyState === 'copied' ? 'Copied!' : 'Copy to note'}
          </button>
        </div>
        {scores.map((s) => (
          <StudyBreakdownCard key={s.study} score={s} />
        ))}
      </aside>
    </div>
  );
}

function buildNote(scores: ReturnType<typeof scoreAll>, payor: PayorId): string {
  const payorMeta = PAYORS.find((p) => p.id === payor)!;
  const lines: string[] = [
    'VASCULAR SCREENING DECISION SUPPORT',
    `Payor: ${payorMeta.label}`,
    '',
  ];
  for (const s of scores) {
    const meta = STUDIES.find((m) => m.id === s.study)!;
    lines.push(
      `${VERDICT_ICONS[s.verdict]} ${meta.label} — ${s.verdict.toUpperCase()} (score ${s.finalScore})`,
    );
    if (s.gateReason) lines.push(`  Note: ${s.gateReason}`);
    if (s.topContributors.length) {
      lines.push(`  Factors: ${s.topContributors.map((c) => c.label).join('; ')}`);
    }
    if (s.suggestedCpt.length) lines.push(`  CPT: ${s.suggestedCpt.join(', ')}`);
    if (s.suggestedIcd10.length) {
      lines.push(`  ICD-10: ${s.suggestedIcd10.slice(0, 4).join(', ')}`);
    }
    lines.push('');
  }
  lines.push('Decision-support only. Verify coverage with the patient\'s plan.');
  return lines.join('\n');
}
