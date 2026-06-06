import { BLURBS } from '../data/blurbs';
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
  const chartNote = buildChartNote({
    recommended,
    conditional,
    notIndicated,
    payorLabel,
  });

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
  notIndicated: StudyScore[];
  payorLabel: string;
}): string {
  const { recommended, conditional, notIndicated, payorLabel } = args;
  const lines: string[] = [];

  lines.push('VASCULAR HEALTH ASSESSMENT');
  lines.push(`Payor reviewed: ${payorLabel}`);
  lines.push('');

  if (recommended.length === 0 && conditional.length === 0) {
    lines.push(
      'Vascular screening criteria reviewed today. No additional non-invasive vascular studies indicated at this visit. Will continue to monitor at routine follow-up.',
    );
  } else {
    lines.push(
      'Reviewed factors that inform when non-invasive vascular studies are appropriate. Based on today\'s discussion and current screening guidance:',
    );
    lines.push('');
  }

  if (recommended.length) {
    lines.push('Recommended at this visit:');
    for (const s of recommended) {
      writeStudyBlock(lines, s, /*recommended*/ true);
    }
  }

  if (conditional.length) {
    lines.push('Discussed as optional / patient interest:');
    for (const s of conditional) {
      writeStudyBlock(lines, s, /*recommended*/ false);
    }
  }

  if (notIndicated.length && (recommended.length || conditional.length)) {
    const labels = notIndicated.map(studyLabel).join(', ');
    lines.push(`Not pursued at this visit: ${labels}.`);
    lines.push('');
  }

  lines.push(
    'Patient verbalized understanding of the rationale and the painless, non-invasive nature of any recommended studies. Coverage expectations reviewed against the patient\'s plan; orders will be placed where appropriate.',
  );
  lines.push('');
  lines.push('— Decision-support tool used to organize discussion; clinical judgment applied.');

  return lines.join('\n');
}

function writeStudyBlock(lines: string[], s: StudyScore, recommended: boolean): void {
  const blurb = BLURBS[s.study];
  const meta = STUDIES.find((m) => m.id === s.study)!;
  const verb = recommended ? 'Recommended' : 'Offered';

  lines.push(`• ${meta.label} — ${blurb.benignName}`);
  lines.push(`  ${blurb.chartRationale}`);
  lines.push(`  Talking point: ${blurb.talkingPoint}`);
  lines.push(`  Coverage: ${COVERAGE_LABEL[s.coverageLikelihood]} (${s.payorNote})`);
  if (s.suggestedCpt.length) {
    lines.push(`  Suggested CPT: ${s.suggestedCpt.join(', ')}`);
  }
  if (s.suggestedIcd10.length) {
    lines.push(`  Supporting dx: ${s.suggestedIcd10.slice(0, 4).join(', ')}`);
  }
  lines.push(`  Plan: ${verb}; patient counseled and agreeable to proceed as discussed.`);
  lines.push('');
}
