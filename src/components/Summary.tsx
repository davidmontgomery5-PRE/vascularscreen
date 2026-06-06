import { useState } from 'react';
import { BLURBS } from '../data/blurbs';
import { STUDIES } from '../data/studies';
import { COVERAGE_LABEL, type StudyScore } from '../engine/score';
import { buildSummary } from '../engine/summary';
import type { PayorId } from '../data/payors';

interface Props {
  scores: StudyScore[];
  payor: PayorId;
}

const coverageClass: Record<string, string> = {
  very_likely: 'bg-emerald-50 text-emerald-800 border-emerald-200',
  likely: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  uncertain: 'bg-amber-50 text-amber-800 border-amber-200',
  unlikely: 'bg-rose-50 text-rose-800 border-rose-200',
};

export function Summary({ scores, payor }: Props) {
  const [copyState, setCopyState] = useState<'idle' | 'copied'>('idle');
  const summary = buildSummary(scores, payor);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(summary.chartNote);
      setCopyState('copied');
      setTimeout(() => setCopyState('idle'), 1500);
    } catch {
      // clipboard requires secure context — fail silently
    }
  };

  return (
    <section className="rounded-lg border border-slate-300 bg-white p-4 shadow-sm">
      <header className="mb-3 flex items-start justify-between gap-3">
        <div>
          <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-700">
            Visit summary
          </h2>
          <p className="text-xs text-slate-500">{summary.headline}</p>
        </div>
        <button
          onClick={handleCopy}
          className="rounded-md bg-slate-900 px-3 py-1.5 text-xs font-medium text-white hover:bg-slate-700"
        >
          {copyState === 'copied' ? 'Copied!' : 'Copy chart note'}
        </button>
      </header>

      {summary.recommended.length === 0 && summary.conditional.length === 0 ? (
        <p className="text-sm text-slate-600">
          No vascular studies indicated at this visit. Chart note will document the review.
        </p>
      ) : (
        <div className="space-y-3">
          {summary.recommended.map((s) => (
            <StudyTalking key={s.study} score={s} bandLabel="Recommend & order" />
          ))}
          {summary.conditional.map((s) => (
            <StudyTalking key={s.study} score={s} bandLabel="Offer if time / interest" />
          ))}
        </div>
      )}
    </section>
  );
}

function StudyTalking({ score, bandLabel }: { score: StudyScore; bandLabel: string }) {
  const meta = STUDIES.find((m) => m.id === score.study)!;
  const blurb = BLURBS[score.study];
  return (
    <div className="rounded-md border border-slate-200 p-3">
      <div className="flex items-start justify-between gap-2">
        <div>
          <div className="text-sm font-semibold text-slate-900">{meta.label}</div>
          <div className="text-[11px] uppercase tracking-wide text-slate-500">{bandLabel}</div>
        </div>
        <span
          className={`shrink-0 rounded-full border px-2 py-0.5 text-[10px] font-medium ${coverageClass[score.coverageLikelihood]}`}
        >
          {COVERAGE_LABEL[score.coverageLikelihood]}
        </span>
      </div>
      <p className="mt-2 text-sm italic text-slate-700">&ldquo;{blurb.talkingPoint}&rdquo;</p>
    </div>
  );
}
