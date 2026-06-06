import { useMemo } from 'react';
import { CRITERIA, type CriterionGroup } from '../data/criteria';
import { PAYORS, type PayorId } from '../data/payors';
import { scoreAll } from '../engine/score';
import { CriterionChip } from './CriterionChip';
import { StudyBreakdownCard } from './StudyBreakdownCard';
import { Summary } from './Summary';

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
  const scores = useMemo(
    () => scoreAll({ activeIds, payor, aaaPriorSbe }),
    [activeIds, payor, aaaPriorSbe],
  );

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

      <aside className="space-y-4">
        <Summary scores={scores} payor={payor} />
        <div>
          <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-slate-600">
            Per-study detail
          </h2>
          <div className="space-y-3">
            {scores.map((s) => (
              <StudyBreakdownCard key={s.study} score={s} />
            ))}
          </div>
        </div>
      </aside>
    </div>
  );
}
