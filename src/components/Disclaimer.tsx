import { BrandMark, BrandWordmark } from './BrandMark';

export function Disclaimer() {
  return (
    <footer className="border-t border-slate-200 bg-white px-4 py-4 text-center text-xs text-slate-500">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-2">
        <div className="flex items-center gap-2 text-brand-navy">
          <BrandMark className="h-5 w-5" />
          <BrandWordmark className="text-sm" />
          <span className="text-brand-green">·</span>
          <span className="italic text-slate-500">wellness begins with PREvention</span>
        </div>
        <p>
          Decision-support only. Not a substitute for clinical judgment. Verify coverage with the
          patient&apos;s specific plan.
        </p>
      </div>
    </footer>
  );
}
