import { COVERAGE_LABEL, type StudyScore } from '../engine/score';
import { STUDIES } from '../data/studies';
import { VERDICT_ICONS, VERDICT_LABELS } from '../data/scorecard.config';

interface Props {
  score: StudyScore;
}

const accentBorder: Record<string, string> = {
  green: 'border-l-emerald-500',
  yellow: 'border-l-amber-500',
  red: 'border-l-rose-500',
};

const accentText: Record<string, string> = {
  green: 'text-emerald-700',
  yellow: 'text-amber-700',
  red: 'text-rose-700',
};

const accentBg: Record<string, string> = {
  green: 'bg-emerald-50',
  yellow: 'bg-amber-50',
  red: 'bg-rose-50',
};

export function StudyBreakdownCard({ score }: Props) {
  const meta = STUDIES.find((s) => s.id === score.study)!;
  return (
    <article
      className={`rounded-xl border border-slate-200 border-l-4 bg-white p-4 shadow-sm ${accentBorder[score.verdict]}`}
    >
      <header className="flex items-start justify-between gap-2">
        <div>
          <h3 className="text-sm font-semibold tracking-tight text-slate-900">{meta.label}</h3>
          <p className={`mt-0.5 text-xs ${accentText[score.verdict]}`}>
            <span className={`mr-1 inline-grid h-4 w-4 place-items-center rounded-full text-[10px] ${accentBg[score.verdict]} ${accentText[score.verdict]}`}>
              {VERDICT_ICONS[score.verdict]}
            </span>
            {VERDICT_LABELS[score.verdict]}
          </p>
        </div>
        <div className="text-right">
          <div className="font-mono text-lg font-semibold tabular-nums text-slate-900">
            {score.finalScore}
          </div>
          <div className="font-mono text-[10px] tabular-nums text-slate-400">
            {score.clinicalScore} × {score.payorMultiplier}
          </div>
        </div>
      </header>

      {score.gateReason && (
        <p className="mt-2 rounded-md bg-slate-50 px-2 py-1.5 text-xs italic text-slate-600">
          {score.gateReason}
        </p>
      )}

      {score.topContributors.length > 0 && (
        <div className="mt-3">
          <div className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">
            Top contributors
          </div>
          <ul className="mt-1 space-y-0.5 text-xs text-slate-700">
            {score.topContributors.map((c) => (
              <li key={c.id} className="flex items-center justify-between">
                <span>{c.label}</span>
                <span className="font-mono tabular-nums text-slate-400">+{c.points}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="mt-3 grid grid-cols-2 gap-3 text-xs">
        <div>
          <div className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">CPT</div>
          <div className="font-mono tabular-nums text-slate-700">{score.suggestedCpt.join(', ') || '—'}</div>
        </div>
        <div>
          <div className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">ICD-10</div>
          <div className="font-mono tabular-nums text-slate-700">
            {score.suggestedIcd10.slice(0, 4).join(', ') || '—'}
          </div>
        </div>
      </div>

      <div className="mt-3 text-[11px] text-slate-700">
        <span className="font-semibold">Coverage: </span>
        <span>{COVERAGE_LABEL[score.coverageLikelihood]}</span>
      </div>
      <p className="mt-1 text-[11px] italic text-slate-500">{score.payorNote}</p>
    </article>
  );
}
