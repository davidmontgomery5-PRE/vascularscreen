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
      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm transition ${
        active
          ? 'border-slate-900 bg-slate-900 text-white shadow-sm'
          : 'border-slate-300 bg-white text-slate-700 hover:border-slate-400 hover:bg-slate-50'
      }`}
    >
      <span>{criterion.label}</span>
      <span
        className={`rounded px-1.5 py-0.5 font-mono text-[10px] ${
          active ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'
        }`}
      >
        +{criterion.points}
      </span>
    </button>
  );
}
