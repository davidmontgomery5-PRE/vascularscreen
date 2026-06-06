import { useState } from 'react';

interface Props {
  className?: string;
  title?: string;
}

export function BrandMark({ className, title = 'PREventClinic' }: Props) {
  const [pngFailed, setPngFailed] = useState(false);

  if (!pngFailed) {
    return (
      <img
        src="/logo.png"
        alt={title}
        className={className}
        onError={() => setPngFailed(true)}
        draggable={false}
      />
    );
  }

  return <InlineMark className={className} title={title} />;
}

function InlineMark({ className, title }: { className?: string; title: string }) {
  return (
    <svg
      viewBox="0 0 100 100"
      className={className}
      fill="currentColor"
      role="img"
      aria-label={title}
    >
      <title>{title}</title>
      <g stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" fill="none">
        <line x1="50" y1="93" x2="50" y2="99" strokeWidth="4" />
        <path d="M50 86 Q36 92 34 80" strokeWidth="7" />
        <path d="M50 86 Q64 92 66 80" strokeWidth="7" />
        <line x1="50" y1="86" x2="50" y2="62" strokeWidth="9" />
        <path d="M50 62 Q40 58 30 50" strokeWidth="8" />
        <path d="M50 62 Q60 58 70 50" strokeWidth="8" />
        <path d="M30 50 Q18 54 8 48" strokeWidth="5" />
        <path d="M70 50 Q82 54 92 48" strokeWidth="5" />
        <path d="M30 50 Q22 34 18 18" strokeWidth="6" />
        <path d="M70 50 Q78 34 82 18" strokeWidth="6" />
        <path d="M30 50 Q34 32 38 14" strokeWidth="5" />
        <path d="M70 50 Q66 32 62 14" strokeWidth="5" />
        <line x1="18" y1="18" x2="10" y2="6" strokeWidth="3.5" />
        <line x1="82" y1="18" x2="90" y2="6" strokeWidth="3.5" />
        <line x1="38" y1="14" x2="40" y2="3" strokeWidth="3.5" />
        <line x1="62" y1="14" x2="60" y2="3" strokeWidth="3.5" />
        <line x1="50" y1="62" x2="48" y2="38" strokeWidth="4" />
        <line x1="50" y1="62" x2="52" y2="38" strokeWidth="4" />
        <line x1="48" y1="38" x2="46" y2="22" strokeWidth="3" />
        <line x1="52" y1="38" x2="54" y2="22" strokeWidth="3" />
      </g>
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
