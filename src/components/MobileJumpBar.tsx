import type { StudyScore } from '../engine/score';

interface Props {
  scores: StudyScore[];
}

export function MobileJumpBar({ scores }: Props) {
  const green = scores.filter((s) => s.verdict === 'green').length;
  const yellow = scores.filter((s) => s.verdict === 'yellow').length;
  const red = scores.filter((s) => s.verdict === 'red').length;

  const handleJump = () => {
    document.getElementById('visit-summary')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className="fixed inset-x-0 bottom-0 z-30 border-t border-slate-200/70 bg-white/90 px-4 py-2.5 shadow-[0_-2px_12px_rgba(15,23,42,0.06)] backdrop-blur-lg lg:hidden">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3">
        <div className="flex items-center gap-3 text-xs">
          <CountPill count={green} colorClass="bg-emerald-500" label="Rec" />
          <CountPill count={yellow} colorClass="bg-amber-500" label="Opt" />
          <CountPill count={red} colorClass="bg-rose-500" label="Not" />
        </div>
        <button
          onClick={handleJump}
          className="rounded-lg bg-gradient-to-br from-brand-navy to-brand-green px-3.5 py-2 text-xs font-semibold text-white shadow-sm shadow-brand-navy/30 active:scale-[0.97]"
        >
          View summary →
        </button>
      </div>
    </div>
  );
}

function CountPill({ count, colorClass, label }: { count: number; colorClass: string; label: string }) {
  return (
    <div className="flex items-center gap-1.5">
      <span className={`inline-block h-2 w-2 rounded-full ${colorClass}`} aria-hidden />
      <span className="font-mono text-sm font-semibold tabular-nums text-slate-800">{count}</span>
      <span className="text-[10px] uppercase tracking-wider text-slate-500">{label}</span>
    </div>
  );
}
