import { PAYORS, type PayorId } from '../data/payors';
import { STUDIES } from '../data/studies';
import { COVERAGE_LABEL, type StudyScore } from './score';

export interface Summary {
  recommended: StudyScore[];
  conditional: StudyScore[];
  notIndicated: StudyScore[];
  payorLabel: string;
  chartNote: string;
  headline: string;
}

export function buildSummary(scores: StudyScore[], payor: PayorId): Summary {
  const recommended = scores.filter((s) => s.verdict === 'green');
  const conditional = scores.filter((s) => s.verdict === 'yellow');
  const notIndicated = scores.filter((s) => s.verdict === 'red');
  const payorLabel = PAYORS.find((p) => p.id === payor)?.label ?? 'Unknown';

  const headline = buildHeadline(recommended, conditional);
  const chartNote = buildChartNote({ recommended, conditional });

  return { recommended, conditional, notIndicated, payorLabel, chartNote, headline };
}

function buildHeadline(green: StudyScore[], yellow: StudyScore[]): string {
  if (green.length === 0 && yellow.length === 0) {
    return 'No vascular studies indicated at this visit.';
  }
  const parts: string[] = [];
  if (green.length) {
    parts.push(
      `${green.length} recommended (${green.map((s) => studyLabel(s)).join(', ')})`,
    );
  }
  if (yellow.length) {
    parts.push(
      `${yellow.length} optional (${yellow.map((s) => studyLabel(s)).join(', ')})`,
    );
  }
  return parts.join(' • ');
}

function studyLabel(s: StudyScore): string {
  return STUDIES.find((m) => m.id === s.study)?.shortLabel ?? s.study;
}

function buildChartNote(args: {
  recommended: StudyScore[];
  conditional: StudyScore[];
}): string {
  const { recommended, conditional } = args;
  const lines: string[] = [];

  lines.push('Vascular screening reviewed.');

  if (recommended.length === 0 && conditional.length === 0) {
    lines.push('No vascular studies indicated at this visit.');
    return lines.join('\n');
  }

  if (recommended.length) {
    lines.push('');
    lines.push('Recommended:');
    for (const s of recommended) {
      writeStudyBlock(lines, s, /*recommended*/ true);
    }
  }

  if (conditional.length) {
    lines.push('');
    lines.push('Discussed (optional):');
    for (const s of conditional) {
      writeStudyBlock(lines, s, /*recommended*/ false);
    }
  }

  return lines.join('\n');
}

function writeStudyBlock(lines: string[], s: StudyScore, recommended: boolean): void {
  const meta = STUDIES.find((m) => m.id === s.study)!;
  const action = recommended
    ? 'Discussed; patient agreeable.'
    : 'Offered; patient to consider.';

  lines.push(`• ${meta.label} — ${action}`);
  lines.push(`  Coverage: ${COVERAGE_LABEL[s.coverageLikelihood]}.`);
  if (s.suggestedIcd10.length) {
    lines.push(`  Supporting dx: ${s.suggestedIcd10.slice(0, 4).join(', ')}.`);
  }
}
