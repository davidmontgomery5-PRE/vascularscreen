import type { StudyScore } from '../engine/score';
import { STUDIES } from '../data/studies';
import { VERDICT_ICONS, VERDICT_LABELS } from '../data/scorecard.config';

interface Props {
  score: StudyScore;
}

const verdictClass: Record<string, string> = {
  green: 'border-emerald-300 bg-emerald-50',
  yellow: 'border-amber-300 bg-amber-50',
  red: 'border-rose-300 bg-rose-50',
};

const verdictText: Record<string, string> = {
  green: 'text-emerald-900',
  yellow: 'text-amber-900',
  red: 'text-rose-900',
};

export function StudyBreakdownCard({ score }: Props) {
  const meta = STUDIES.find((s) => s.id === score.study)!;
  return (
    <article className={`rounded-lg border p-4 ${verdictClass[score.verdict]}`}>
      <header className="flex items-start justify-between gap-2">
        <div>
          <h3 className={`text-sm font-semibold ${verdictText[score.verdict]}`}>{meta.label}</h3>
          <p className={`text-xs ${verdictText[score.verdict]}`}>
            <span aria-hidden className="mr-1">{VERDICT_ICONS[score.verdict]}</span>
            {VERDICT_LABELS[score.verdict]}
          </p>
        </div>
        <div className="text-right">
          <div className="font-mono text-lg font-semibold text-slate-900">{score.finalScore}</div>
          <div className="font-mono text-[10px] text-slate-500">
            {score.clinicalScore} × {score.payorMultiplier}
          </div>
        </div>
      </header>

      {score.gateReason && (
        <p className="mt-2 text-xs italic text-slate-700">{score.gateReason}</p>
      )}

      {score.topContributors.length > 0 && (
        <div className="mt-3">
          <div className="text-[10px] font-semibold uppercase tracking-wide text-slate-500">
            Top contributors
          </div>
          <ul className="mt-1 space-y-0.5 text-xs text-slate-700">
            {score.topContributors.map((c) => (
              <li key={c.id}>
                {c.label} <span className="font-mono text-slate-500">+{c.points}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="mt-3 grid grid-cols-2 gap-3 text-xs">
        <div>
          <div className="text-[10px] font-semibold uppercase tracking-wide text-slate-500">CPT</div>
          <div className="font-mono text-slate-700">{score.suggestedCpt.join(', ') || '—'}</div>
        </div>
        <div>
          <div className="text-[10px] font-semibold uppercase tracking-wide text-slate-500">ICD-10</div>
          <div className="font-mono text-slate-700">
            {score.suggestedIcd10.slice(0, 4).join(', ') || '—'}
          </div>
        </div>
      </div>

      <p className="mt-3 text-[11px] italic text-slate-600">{score.payorNote}</p>
    </article>
  );
}
