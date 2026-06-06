export type PayorId =
  | 'medicare_traditional'
  | 'medicare_advantage'
  | 'commercial_large'
  | 'commercial_regional'
  | 'medicaid'
  | 'self_pay'
  | 'unknown';

export interface Payor {
  id: PayorId;
  label: string;
  symptomMultiplier: number;
  screeningMultiplier: number;
  note: string;
}

export const PAYORS: Payor[] = [
  {
    id: 'medicare_traditional',
    label: 'Traditional Medicare',
    symptomMultiplier: 1.2,
    screeningMultiplier: 0.6,
    note: 'Covers AAA SBE once-in-lifetime when IPPE/AWV-referred for eligible patients.',
  },
  {
    id: 'medicare_advantage',
    label: 'Medicare Advantage',
    symptomMultiplier: 1.15,
    screeningMultiplier: 0.8,
    note: 'Major commercial MA plans (UHC, Aetna, Humana, BCBS) — symptom-based requests favored.',
  },
  {
    id: 'commercial_large',
    label: 'Large Commercial PPO/HMO',
    symptomMultiplier: 1.1,
    screeningMultiplier: 0.7,
    note: 'UHC / Aetna / Cigna / BCBS / Humana commercial — medical necessity must be documented.',
  },
  {
    id: 'commercial_regional',
    label: 'Regional / Small Commercial',
    symptomMultiplier: 1.0,
    screeningMultiplier: 0.6,
    note: 'Local plan rules vary — verify benefits before scheduling.',
  },
  {
    id: 'medicaid',
    label: 'Medicaid',
    symptomMultiplier: 0.9,
    screeningMultiplier: 0.4,
    note: 'Prior authorization typically required; screening rarely covered.',
  },
  {
    id: 'self_pay',
    label: 'Self-pay',
    symptomMultiplier: 1.0,
    screeningMultiplier: 1.0,
    note: 'No payor barrier — patient is responsible; discuss cash price.',
  },
  {
    id: 'unknown',
    label: 'Unknown',
    symptomMultiplier: 0.85,
    screeningMultiplier: 0.85,
    note: 'Confirm coverage before ordering.',
  },
];

export const DEFAULT_PAYOR: PayorId = 'unknown';
