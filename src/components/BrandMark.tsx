interface Props {
  className?: string;
  title?: string;
}

export function BrandMark({ className, title = 'PREventClinic' }: Props) {
  return (
    <svg
      viewBox="0 0 100 100"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      role="img"
      aria-label={title}
    >
      <title>{title}</title>
      <line x1="50" y1="56" x2="50" y2="78" strokeWidth="9" />
      <line x1="50" y1="78" x2="38" y2="94" strokeWidth="8" />
      <line x1="50" y1="78" x2="62" y2="94" strokeWidth="8" />
      <line x1="50" y1="56" x2="30" y2="38" strokeWidth="8" />
      <line x1="50" y1="56" x2="70" y2="38" strokeWidth="8" />
      <line x1="30" y1="38" x2="18" y2="22" strokeWidth="6" />
      <line x1="30" y1="38" x2="34" y2="16" strokeWidth="6" />
      <line x1="70" y1="38" x2="82" y2="22" strokeWidth="6" />
      <line x1="70" y1="38" x2="66" y2="16" strokeWidth="6" />
      <line x1="18" y1="22" x2="10" y2="8" strokeWidth="4" />
      <line x1="18" y1="22" x2="22" y2="6" strokeWidth="4" />
      <line x1="82" y1="22" x2="90" y2="8" strokeWidth="4" />
      <line x1="82" y1="22" x2="78" y2="6" strokeWidth="4" />
    </svg>
  );
}

export function BrandWordmark({ className }: { className?: string }) {
  return (
    <span className={className}>
      <span className="font-bold tracking-tight">PRE</span>
      <span className="font-bold tracking-tight">vent</span>
      <span className="font-normal tracking-tight">Clinic</span>
    </span>
  );
}
