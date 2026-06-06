import { describe, expect, it } from 'vitest';
import { scoreAll } from './score';
import { buildSummary } from './summary';

describe('summary builder', () => {
  it('produces a chart note with benign language and a behavioral talking point', () => {
    const scores = scoreAll({
      activeIds: ['age_65', 'male_sex', 'smoker_former', 'awv'],
      payor: 'medicare_traditional',
    });
    const summary = buildSummary(scores, 'medicare_traditional');

    expect(summary.recommended.map((s) => s.study)).toContain('aaa');
    expect(summary.chartNote).toContain('VASCULAR HEALTH ASSESSMENT');
    expect(summary.chartNote).toContain('Recommended at this visit');
    expect(summary.chartNote).toContain('abdominal vessel wellness scan');
    expect(summary.chartNote).toContain('Talking point:');
    expect(summary.chartNote).toContain('Very likely covered');
    expect(summary.chartNote).not.toMatch(/aneurysm|stroke|atherosclerosis|blockage/i);
  });

  it('falls back to a no-studies-indicated note when nothing is selected', () => {
    const scores = scoreAll({ activeIds: [], payor: 'unknown' });
    const summary = buildSummary(scores, 'unknown');
    expect(summary.recommended).toHaveLength(0);
    expect(summary.conditional).toHaveLength(0);
    expect(summary.chartNote).toContain('No additional non-invasive vascular studies indicated');
  });

  it('flags decline risk for screening on regional commercial', () => {
    const scores = scoreAll({
      activeIds: ['age_65', 'male_sex', 'smoker_former'],
      payor: 'commercial_regional',
    });
    const aaa = scores.find((s) => s.study === 'aaa')!;
    expect(['unlikely', 'uncertain']).toContain(aaa.coverageLikelihood);
  });

  it('flags Medicare AAA SBE as very likely covered', () => {
    const scores = scoreAll({
      activeIds: ['age_65', 'male_sex', 'smoker_former', 'awv'],
      payor: 'medicare_traditional',
    });
    const aaa = scores.find((s) => s.study === 'aaa')!;
    expect(aaa.coverageLikelihood).toBe('very_likely');
  });

  it('flags symptomatic LE PAD on large commercial as very likely covered', () => {
    const scores = scoreAll({
      activeIds: ['claudication'],
      payor: 'commercial_large',
    });
    const le = scores.find((s) => s.study === 'le')!;
    expect(le.coverageLikelihood).toBe('very_likely');
  });
});
