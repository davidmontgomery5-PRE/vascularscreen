export type StudyType = 'carotid' | 'aaa' | 'le' | 'renal' | 'venous';

export interface Study {
  id: StudyType;
  label: string;
  shortLabel: string;
  cpt: string[];
}

export const STUDIES: Study[] = [
  { id: 'carotid', label: 'Carotid Duplex', shortLabel: 'Carotid', cpt: ['93880', '93882'] },
  { id: 'aaa', label: 'AAA Ultrasound', shortLabel: 'AAA', cpt: ['76706', '76770', '76775'] },
  { id: 'le', label: 'LE Arterial / ABI', shortLabel: 'LE PAD', cpt: ['93925', '93926', '93922', '93923'] },
  { id: 'renal', label: 'Renal Duplex', shortLabel: 'Renal', cpt: ['93975', '93976'] },
  { id: 'venous', label: 'Venous Duplex', shortLabel: 'Venous', cpt: ['93970', '93971'] },
];
