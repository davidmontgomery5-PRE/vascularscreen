import type { Criterion } from '../data/criteria';
import type { StudyType } from '../data/studies';
import type { PayorId } from '../data/payors';

export interface GateInput {
  study: StudyType;
  active: Criterion[];
  payor: PayorId;
  aaaPriorSbe: boolean;
}

export interface GateResult {
  blocked: boolean;
  reason?: string;
}

export function evaluateHardGates(input: GateInput): GateResult {
  const { study, active, payor, aaaPriorSbe } = input;
  const activeIds = new Set(active.map((c) => c.id));
  const hasSymptom = active.some((c) => c.isSymptomatic);

  if (study === 'aaa' && payor === 'medicare_traditional' && aaaPriorSbe && !hasSymptom) {
    return {
      blocked: true,
      reason: 'Medicare AAA SBE is once-in-lifetime; prior SBE already used.',
    };
  }

  if (study === 'carotid' && !hasSymptom) {
    const hasRiskOrTrigger = active.some(
      (c) => c.group === 'risk' || c.group === 'trigger',
    );
    if (!hasRiskOrTrigger) {
      return {
        blocked: true,
        reason: 'USPSTF recommends against screening asymptomatic adults with no risk factors.',
      };
    }
  }

  if (study === 'venous' && !hasSymptom) {
    return {
      blocked: true,
      reason: 'Venous duplex not covered without symptoms or skin changes.',
    };
  }

  if (study === 'aaa' && !hasSymptom) {
    const eligible =
      activeIds.has('male_sex') && activeIds.has('age_65') &&
      (activeIds.has('smoker_current') || activeIds.has('smoker_former'));
    const hasFamily = activeIds.has('family_aaa');
    const hasAwv = activeIds.has('awv');
    if (payor === 'medicare_traditional' && !hasAwv && !hasFamily && !eligible) {
      return {
        blocked: true,
        reason: 'Medicare AAA SBE requires AWV/IPPE referral or family hx or qualifying demographics.',
      };
    }
  }

  return { blocked: false };
}
