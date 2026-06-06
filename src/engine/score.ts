import type { Criterion } from '../data/criteria';
import { CRITERIA } from '../data/criteria';
import type { StudyType } from '../data/studies';
import { STUDIES } from '../data/studies';
import { PAYORS, type PayorId } from '../data/payors';
import { VERDICT_THRESHOLDS, type Verdict } from '../data/scorecard.config';
import { evaluateHardGates } from './gates';

export interface StudyScore {
  study: StudyType;
  clinicalScore: number;
  payorMultiplier: number;
  finalScore: number;
  verdict: Verdict;
  topContributors: Criterion[];
  suggestedCpt: string[];
  suggestedIcd10: string[];
  payorNote: string;
  gateReason?: string;
}

export interface ScorecardInput {
  activeIds: string[];
  payor: PayorId;
  aaaPriorSbe?: boolean;
}

export function getCriterion(id: string): Criterion | undefined {
  return CRITERIA.find((c) => c.id === id);
}

function bandFor(score: number): Verdict {
  if (score >= VERDICT_THRESHOLDS.green) return 'green';
  if (score >= VERDICT_THRESHOLDS.yellow) return 'yellow';
  return 'red';
}

export function scoreStudy(study: StudyType, input: ScorecardInput): StudyScore {
  const active = input.activeIds
    .map(getCriterion)
    .filter((c): c is Criterion => Boolean(c))
    .filter((c) => c.studies.includes(study));

  const payor = PAYORS.find((p) => p.id === input.payor)!;
  const hasSymptom = active.some((c) => c.isSymptomatic);
  const covered = isCoveredIndication(study, input.payor, active);
  const payorMultiplier =
    hasSymptom || covered ? payor.symptomMultiplier : payor.screeningMultiplier;

  const clinicalScore = active.reduce((sum, c) => sum + c.points, 0);
  const rawFinal = clinicalScore * payorMultiplier;
  const finalScore = Math.round(rawFinal * 10) / 10;

  const gate = evaluateHardGates({
    study,
    active,
    payor: input.payor,
    aaaPriorSbe: Boolean(input.aaaPriorSbe),
  });

  const verdict: Verdict = gate.blocked ? 'red' : bandFor(finalScore);

  const topContributors = [...active]
    .sort((a, b) => b.points - a.points)
    .slice(0, 3);

  const studyMeta = STUDIES.find((s) => s.id === study)!;
  const suggestedCpt = uniq([
    ...studyMeta.cpt.slice(0, hasSymptom ? 1 : 2),
    ...active.flatMap((c) => c.cptSupported ?? []),
  ]);
  const suggestedIcd10 = uniq(active.flatMap((c) => c.icd10 ?? []));

  return {
    study,
    clinicalScore,
    payorMultiplier,
    finalScore,
    verdict,
    topContributors,
    suggestedCpt,
    suggestedIcd10,
    payorNote: payor.note,
    gateReason: gate.reason,
  };
}

export function scoreAll(input: ScorecardInput): StudyScore[] {
  return STUDIES.map((s) => scoreStudy(s.id, input));
}

function uniq<T>(arr: T[]): T[] {
  return Array.from(new Set(arr));
}

function isCoveredIndication(
  study: StudyType,
  payor: PayorId,
  active: Criterion[],
): boolean {
  const ids = new Set(active.map((c) => c.id));
  if (study === 'aaa' && payor === 'medicare_traditional') {
    const sbeEligible =
      ids.has('male_sex') &&
      ids.has('age_65') &&
      (ids.has('smoker_current') || ids.has('smoker_former')) &&
      ids.has('awv');
    if (sbeEligible) return true;
    if (ids.has('family_aaa') && ids.has('awv')) return true;
  }
  return false;
}
