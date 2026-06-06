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
  const toDiscuss = [...summary.recommended, ...summary.conditional];

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
    <section
      id="visit-summary"
      className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
    >
      <div className="bg-gradient-to-br from-indigo-50 via-white to-fuchsia-50 px-4 py-3">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="inline-grid h-5 w-5 place-items-center rounded-md bg-gradient-to-br from-indigo-500 to-fuchsia-500 text-white">
                <svg viewBox="0 0 20 20" className="h-3 w-3" fill="currentColor" aria-hidden>
                  <path d="M10 2l1.5 4.5L16 8l-4.5 1.5L10 14l-1.5-4.5L4 8l4.5-1.5L10 2z" />
                </svg>
              </span>
              <h2 className="text-sm font-semibold tracking-tight text-slate-900">
                Visit summary
              </h2>
            </div>
            <p className="mt-0.5 text-xs text-slate-500">{summary.headline}</p>
          </div>
          <button
            onClick={handleCopy}
            className="shrink-0 rounded-lg bg-slate-900 px-3 py-2 text-xs font-medium text-white shadow-sm transition hover:bg-slate-700 active:scale-[0.98]"
          >
            {copyState === 'copied' ? 'Copied!' : 'Copy chart note'}
          </button>
        </div>
      </div>

      <div className="px-4 pb-4 pt-3">
        {toDiscuss.length === 0 ? (
          <p className="text-sm text-slate-600">
            No vascular studies indicated at this visit.
          </p>
        ) : (
          <>
            <div className="space-y-2">
              {summary.recommended.map((s) => (
                <SummaryRow key={s.study} score={s} bandLabel="Recommend & order" />
              ))}
              {summary.conditional.map((s) => (
                <SummaryRow key={s.study} score={s} bandLabel="Offer if time / interest" />
              ))}
            </div>

            <div className="mt-4 border-t border-slate-200 pt-3">
              <h3 className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                <svg viewBox="0 0 20 20" className="h-3 w-3 text-indigo-500" fill="currentColor" aria-hidden>
                  <path d="M10 2l1.5 4.5L16 8l-4.5 1.5L10 14l-1.5-4.5L4 8l4.5-1.5L10 2z" />
                </svg>
                Provider talking points
              </h3>
              <div className="mt-2 space-y-2">
                {toDiscuss.map((s) => {
                  const meta = STUDIES.find((m) => m.id === s.study)!;
                  const blurb = BLURBS[s.study];
                  return (
                    <details
                      key={s.study}
                      className="group rounded-lg border border-slate-200 bg-slate-50/60 px-3 py-2 open:bg-white"
                    >
                      <summary className="flex cursor-pointer items-center justify-between text-xs font-medium text-slate-700">
                        <span>{meta.label}</span>
                        <span className="text-slate-400 transition group-open:rotate-180" aria-hidden>
                          ⌄
                        </span>
                      </summary>
                      <p className="mt-2 text-sm italic leading-relaxed text-slate-700">
                        &ldquo;{blurb.talkingPoint}&rdquo;
                      </p>
                    </details>
                  );
                })}
              </div>
            </div>
          </>
        )}
      </div>
    </section>
  );
}

function SummaryRow({ score, bandLabel }: { score: StudyScore; bandLabel: string }) {
  const meta = STUDIES.find((m) => m.id === score.study)!;
  return (
    <div className="flex items-start justify-between gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2.5">
      <div>
        <div className="text-sm font-medium text-slate-900">{meta.label}</div>
        <div className="text-[10px] uppercase tracking-wide text-slate-500">{bandLabel}</div>
      </div>
      <span
        className={`shrink-0 rounded-full border px-2 py-0.5 text-[10px] font-medium ${coverageClass[score.coverageLikelihood]}`}
      >
        {COVERAGE_LABEL[score.coverageLikelihood]}
      </span>
    </div>
  );
}
