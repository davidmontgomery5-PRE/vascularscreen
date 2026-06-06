import type { StudyScore } from '../engine/score';
import { STUDIES } from '../data/studies';

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
    <header className="sticky top-0 z-20 border-b border-slate-200/70 bg-white/70 backdrop-blur-lg">
      <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-indigo-500 via-violet-500 to-fuchsia-500 text-white shadow-md shadow-indigo-500/20">
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
            </svg>
          </div>
          <div>
            <h1 className="text-base font-semibold tracking-tight text-slate-900">
              Vascular Screening Scorecard
            </h1>
            <p className="text-[11px] text-slate-500">Point-of-care decision support</p>
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
            className="ml-1 shrink-0 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 transition hover:border-slate-400 hover:bg-slate-50 active:scale-[0.98]"
          >
            New Patient
          </button>
        </div>
      </div>
    </header>
  );
}
