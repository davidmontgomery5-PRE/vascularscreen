import { describe, expect, it } from 'vitest';
import { scoreAll } from './score';
import { buildSummary } from './summary';

describe('summary builder', () => {
  it('emits a terse, payor-free chart note with coverage + dx lines', () => {
    const scores = scoreAll({
      activeIds: ['age_65', 'male_sex', 'smoker_former', 'awv'],
      payor: 'medicare_traditional',
    });
    const summary = buildSummary(scores, 'medicare_traditional');

    expect(summary.recommended.map((s) => s.study)).toContain('aaa');
    expect(summary.chartNote).toContain('Vascular screening reviewed.');
    expect(summary.chartNote).toContain('Recommended:');
    expect(summary.chartNote).toContain('AAA Ultrasound — Discussed; patient agreeable.');
    expect(summary.chartNote).toContain('Coverage: Very likely covered.');
    expect(summary.chartNote).toMatch(/Supporting dx:/);
    expect(summary.chartNote).not.toMatch(/Payor|Medicare|talking point|VASCULAR HEALTH/i);
    expect(summary.chartNote).not.toMatch(/aneurysm|stroke|atherosclerosis|blockage/i);
  });

  it('keeps the no-studies note to a single sentence', () => {
    const scores = scoreAll({ activeIds: [], payor: 'unknown' });
    const summary = buildSummary(scores, 'unknown');
    expect(summary.recommended).toHaveLength(0);
    expect(summary.conditional).toHaveLength(0);
    expect(summary.chartNote.split('\n').length).toBeLessThanOrEqual(2);
    expect(summary.chartNote).toContain('No vascular studies indicated');
  });

  it('uses different verbiage for optional studies', () => {
    const scores = scoreAll({
      activeIds: ['dm', 'diminished_pulses'],
      payor: 'commercial_large',
    });
    const summary = buildSummary(scores, 'commercial_large');
    expect(summary.conditional.length).toBeGreaterThan(0);
    expect(summary.chartNote).toContain('Discussed (optional):');
    expect(summary.chartNote).toContain('Offered; patient to consider.');
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
