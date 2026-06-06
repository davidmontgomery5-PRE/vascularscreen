import { useState } from 'react';
import { VERDICT_THRESHOLDS } from '../data/scorecard.config';

export function Legend() {
  const [open, setOpen] = useState(false);
  return (
    <section className="rounded-2xl border border-slate-200 bg-white/70 p-4 shadow-sm backdrop-blur">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="flex w-full items-center justify-between text-left"
      >
        <div className="flex items-center gap-2">
          <span className="grid h-7 w-7 place-items-center rounded-lg bg-gradient-to-br from-indigo-500 to-fuchsia-500 text-white">
            <svg viewBox="0 0 20 20" className="h-4 w-4" fill="currentColor" aria-hidden>
              <path d="M10 2a1 1 0 011 1v2.06a5.002 5.002 0 014 4H17a1 1 0 110 2h-2a5.002 5.002 0 01-4 4v2.06a1 1 0 11-2 0v-2.06a5.002 5.002 0 01-4-4H3a1 1 0 110-2h2a5.002 5.002 0 014-4V3a1 1 0 011-1z" />
            </svg>
          </span>
          <div>
            <div className="text-sm font-semibold text-slate-900">How scoring works</div>
            <div className="text-xs text-slate-500">
              Click any criterion → points add → payor adjusts → traffic light.
            </div>
          </div>
        </div>
        <span className="text-slate-400" aria-hidden>
          {open ? '−' : '+'}
        </span>
      </button>

      {open && (
        <div className="mt-4 grid gap-4 text-xs text-slate-700 sm:grid-cols-3">
          <div>
            <div className="mb-1 text-[10px] font-semibold uppercase tracking-wide text-slate-500">
              Verdict bands
            </div>
            <ul className="space-y-1.5">
              <li className="flex items-start gap-2">
                <span className="mt-0.5 inline-block h-2.5 w-2.5 shrink-0 rounded-full bg-emerald-500" />
                <span>
                  <strong>Green — score ≥ {VERDICT_THRESHOLDS.green}.</strong> Strong indication. Discuss and recommend.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-0.5 inline-block h-2.5 w-2.5 shrink-0 rounded-full bg-amber-500" />
                <span>
                  <strong>Yellow — score {VERDICT_THRESHOLDS.yellow}–{VERDICT_THRESHOLDS.green - 0.1}.</strong> Conditional. Offer if time/interest.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-0.5 inline-block h-2.5 w-2.5 shrink-0 rounded-full bg-rose-500" />
                <span>
                  <strong>Red — score &lt; {VERDICT_THRESHOLDS.yellow} or hard-gated.</strong> Not indicated; no discussion unless patient asks.
                </span>
              </li>
            </ul>
          </div>

          <div>
            <div className="mb-1 text-[10px] font-semibold uppercase tracking-wide text-slate-500">
              How the number is built
            </div>
            <ol className="list-decimal space-y-1 pl-4">
              <li>
                Each active chip adds its <span className="rounded bg-slate-100 px-1 font-mono text-[10px]">+N</span> points.
              </li>
              <li>
                Sum is multiplied by a payor factor: symptomatic indications get a boost
                (×1.0–1.2 on major payors); screening-only gets a discount (×0.4–0.85)
                because payors are stricter without a symptom.
              </li>
              <li>
                Hard gates override to red (e.g., once-in-lifetime Medicare AAA SBE already used; USPSTF-D carotid).
              </li>
            </ol>
          </div>

          <div>
            <div className="mb-1 text-[10px] font-semibold uppercase tracking-wide text-slate-500">
              Coverage likelihood
            </div>
            <ul className="space-y-1">
              <li><strong>Very likely covered</strong> — payor pathway is documented.</li>
              <li><strong>Likely covered</strong> — symptom present; verify benefits.</li>
              <li><strong>Uncertain</strong> — prior auth recommended.</li>
              <li><strong>Unlikely</strong> — expect denial; verify before ordering.</li>
            </ul>
          </div>
        </div>
      )}
    </section>
  );
}
