import type { StudyScore } from '../engine/score';
import { STUDIES } from '../data/studies';
import { BrandMark, BrandWordmark } from './BrandMark';

interface Props {
  scores: StudyScore[];
  onReset: () => void;
}

const dotClass: Record<string, string> = {
  green: 'bg-emerald-500',
  yellow: 'bg-amber-500',
  red: 'bg-rose-500',
};

const pillClass: Record<string, string> = {
  green: 'bg-emerald-50 text-emerald-800 border-emerald-200',
  yellow: 'bg-amber-50 text-amber-800 border-amber-200',
  red: 'bg-rose-50 text-rose-800 border-rose-200',
};

export function TopBar({ scores, onReset }: Props) {
  return (
    <header className="sticky top-0 z-20 border-b border-slate-200/70 bg-white/75 backdrop-blur-lg">
      <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <BrandMark className="h-10 w-10 shrink-0 text-brand-navy" />
          <div className="leading-tight">
            <BrandWordmark className="block text-base text-brand-navy" />
            <p className="text-[11px] text-slate-500">
              Vascular Screening Scorecard
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto sm:overflow-visible">
          <div className="flex shrink-0 flex-wrap items-center gap-1.5">
            {scores.map((s) => {
              const meta = STUDIES.find((x) => x.id === s.study)!;
              return (
                <span
                  key={s.study}
                  className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-medium transition ${pillClass[s.verdict]}`}
                  aria-label={`${meta.label}: ${s.verdict}`}
                >
                  <span className={`h-1.5 w-1.5 rounded-full ${dotClass[s.verdict]}`} aria-hidden />
                  {meta.shortLabel}
                  <span className="font-mono text-[10px] tabular-nums opacity-70">{s.finalScore}</span>
                </span>
              );
            })}
          </div>
          <button
            onClick={onReset}
            className="ml-1 shrink-0 rounded-lg border border-brand-navy/20 bg-white px-3 py-1.5 text-xs font-medium text-brand-navy transition hover:border-brand-navy/40 hover:bg-brand-navy-tint active:scale-[0.98]"
          >
            New Patient
          </button>
        </div>
      </div>
    </header>
  );
}
