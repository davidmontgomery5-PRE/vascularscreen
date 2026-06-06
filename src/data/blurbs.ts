import type { StudyType } from './studies';

export interface StudyBlurb {
  benignName: string;
  chartRationale: string;
  talkingPoint: string;
}

export const BLURBS: Record<StudyType, StudyBlurb> = {
  carotid: {
    benignName: 'neck vessel circulation study',
    chartRationale:
      'Reviewed circulation and discussed obtaining a baseline neck-vessel ultrasound as part of preventive cardiovascular care.',
    talkingPoint:
      'It\'s a quick, comfortable scan of the blood vessels in the neck — no needles, no radiation, about twenty minutes. For patients in your situation, having a baseline picture now is one of the simplest, most useful steps we can take together. Most people tell me they\'re glad we did it.',
  },
  aaa: {
    benignName: 'abdominal vessel wellness scan',
    chartRationale:
      'Discussed obtaining a baseline abdominal vessel ultrasound consistent with current preventive screening guidance.',
    talkingPoint:
      'Medicare actually built this scan into the wellness visit on purpose — they want us doing it for patients like you. It\'s painless, takes about twenty minutes, and it gives us a clean baseline so we can stay ahead of anything rather than catching up later.',
  },
  le: {
    benignName: 'leg circulation study',
    chartRationale:
      'Discussed a non-invasive lower-extremity circulation study to establish a baseline and confirm symmetry of blood flow.',
    talkingPoint:
      'Think of it as a circulation check for your legs — blood pressure cuffs and a small ultrasound, no needles, no dye. It tells us whether the numbers match how you feel, and it gives us a baseline. The patients who do it almost always say the same thing: nice to have the data.',
  },
  renal: {
    benignName: 'kidney circulation study',
    chartRationale:
      'Discussed a non-invasive renal vessel ultrasound to evaluate blood flow to the kidneys.',
    talkingPoint:
      'When the blood pressure has been a moving target, a quick look at the blood flow to the kidneys is one of the clearest ways to make sure we\'re treating the right cause — not just chasing numbers. It\'s a comfortable scan, no prep, no needles.',
  },
  venous: {
    benignName: 'vein flow study',
    chartRationale:
      'Discussed a non-invasive vein ultrasound to evaluate flow and clarify the source of symptoms.',
    talkingPoint:
      'A short, comfortable ultrasound of the veins usually gives us a clear answer in one visit. It helps us explain symptoms that can be hard to pin down otherwise — and once we know, we can actually do something about it.',
  },
};
