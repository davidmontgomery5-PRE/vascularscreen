import { useMemo } from 'react';
import { CRITERIA, type CriterionGroup } from '../data/criteria';
import { PAYORS, type PayorId } from '../data/payors';
import { scoreAll } from '../engine/score';
import { CriterionChip } from './CriterionChip';
import { Legend } from './Legend';
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
    <div className="mx-auto grid max-w-6xl gap-6 px-4 py-6 pb-24 lg:grid-cols-[1fr_380px] lg:pb-6">
      <div className="space-y-5">
        <Legend />
        {GROUPS.map((g) => (
          <section key={g.id} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
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

        <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
            Insurance
          </h2>
          <div className="flex flex-wrap gap-2">
            {PAYORS.map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => onPayorChange(p.id)}
                aria-pressed={payor === p.id}
                className={`min-h-[40px] rounded-full border px-3.5 py-2 text-sm transition active:scale-[0.97] ${
                  payor === p.id
                    ? 'border-brand-green bg-gradient-to-br from-brand-navy to-brand-navy-dark text-white shadow-sm shadow-brand-navy/30'
                    : 'border-slate-200 bg-white text-slate-700 hover:border-brand-navy/30 hover:bg-brand-navy-tint'
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
              className="h-4 w-4 rounded border-slate-300 text-brand-navy focus:ring-brand-navy"
            />
            Patient has already used Medicare AAA SBE benefit
          </label>
        </section>
      </div>

      <aside className="space-y-4 lg:sticky lg:top-24 lg:self-start">
        <Summary scores={scores} payor={payor} />
        <div>
          <h2 className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
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
