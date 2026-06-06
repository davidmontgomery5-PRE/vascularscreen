export const VERDICT_THRESHOLDS = {
  green: 10,
  yellow: 5,
} as const;

export type Verdict = 'green' | 'yellow' | 'red';

export const VERDICT_LABELS: Record<Verdict, string> = {
  green: 'Strong indication — discuss and strongly recommend.',
  yellow: 'Conditional — discuss if time / patient interest.',
  red: 'Not indicated — no discussion unless patient requests.',
};

export const VERDICT_ICONS: Record<Verdict, string> = {
  green: '✓',
  yellow: '~',
  red: '✕',
};
