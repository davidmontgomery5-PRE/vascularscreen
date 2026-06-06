import type { StudyScore } from '../engine/score';
import { STUDIES } from '../data/studies';
import { VERDICT_ICONS } from '../data/scorecard.config';

interface Props {
  scores: StudyScore[];
  onReset: () => void;
}

const pillClass: Record<string, string> = {
  green: 'bg-emerald-100 text-emerald-800 border-emerald-300',
  yellow: 'bg-amber-100 text-amber-800 border-amber-300',
  red: 'bg-rose-100 text-rose-800 border-rose-300',
};

export function TopBar({ scores, onReset }: Props) {
  return (
    <header className="sticky top-0 z-10 border-b border-slate-200 bg-white px-4 py-3 shadow-sm">
      <div className="mx-auto flex max-w-6xl flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-900 font-bold text-white">
            VS
          </div>
          <div>
            <h1 className="text-base font-semibold text-slate-900">Vascular Screening Scorecard</h1>
            <p className="text-xs text-slate-500">Point-of-care decision support</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {scores.map((s) => {
            const meta = STUDIES.find((x) => x.id === s.study)!;
            return (
              <span
                key={s.study}
                className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-medium ${pillClass[s.verdict]}`}
                aria-label={`${meta.label}: ${s.verdict}`}
              >
                <span aria-hidden>{VERDICT_ICONS[s.verdict]}</span>
                {meta.shortLabel}
                <span className="font-mono text-[10px] opacity-70">{s.finalScore}</span>
              </span>
            );
          })}
          <button
            onClick={onReset}
            className="rounded-md border border-slate-300 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50"
          >
            New Patient
          </button>
        </div>
      </div>
    </header>
  );
}
