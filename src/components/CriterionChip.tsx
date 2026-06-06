import type { Criterion } from '../data/criteria';

interface Props {
  criterion: Criterion;
  active: boolean;
  onToggle: (id: string) => void;
}

export function CriterionChip({ criterion, active, onToggle }: Props) {
  const tooltipParts = [criterion.guidelineRef, criterion.payorNote].filter(Boolean);
  const tooltip = tooltipParts.join(' • ');

  return (
    <button
      type="button"
      onClick={() => onToggle(criterion.id)}
      aria-pressed={active}
      title={tooltip || undefined}
      className={`group inline-flex min-h-[40px] items-center gap-1.5 rounded-full border px-3.5 py-2 text-sm transition active:scale-[0.97] ${
        active
          ? 'border-indigo-500 bg-gradient-to-br from-slate-900 to-slate-800 text-white shadow-sm shadow-indigo-500/20'
          : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50'
      }`}
    >
      <span>{criterion.label}</span>
      <span
        className={`rounded-md px-1.5 py-0.5 font-mono text-[10px] tabular-nums ${
          active ? 'bg-white/15 text-white' : 'bg-slate-100 text-slate-500 group-hover:bg-slate-200'
        }`}
      >
        +{criterion.points}
      </span>
    </button>
  );
}
