import { describe, expect, it } from 'vitest';
import { scoreStudy, scoreAll } from './score';
import { VERDICT_THRESHOLDS } from '../data/scorecard.config';

describe('scoring engine', () => {
  it('produces GREEN for 68 y/o male ever-smoker at AWV on Traditional Medicare → AAA', () => {
    const result = scoreStudy('aaa', {
      activeIds: ['age_65', 'male_sex', 'smoker_former', 'awv'],
      payor: 'medicare_traditional',
    });
    expect(result.verdict).toBe('green');
    expect(result.finalScore).toBeGreaterThanOrEqual(VERDICT_THRESHOLDS.green);
    expect(result.suggestedCpt).toContain('76706');
  });

  it('produces YELLOW for diabetic with diminished pulses on large commercial → LE', () => {
    const result = scoreStudy('le', {
      activeIds: ['dm', 'diminished_pulses'],
      payor: 'commercial_large',
    });
    expect(result.verdict).toBe('yellow');
    expect(result.finalScore).toBeGreaterThanOrEqual(VERDICT_THRESHOLDS.yellow);
    expect(result.finalScore).toBeLessThan(VERDICT_THRESHOLDS.green);
  });

  it('hard-gates carotid screening for asymptomatic patient with no risk factors', () => {
    const result = scoreStudy('carotid', {
      activeIds: [],
      payor: 'commercial_large',
    });
    expect(result.verdict).toBe('red');
    expect(result.gateReason).toMatch(/USPSTF/);
  });

  it('hard-gates venous duplex without symptoms', () => {
    const result = scoreStudy('venous', {
      activeIds: ['age_65', 'obesity'],
      payor: 'commercial_large',
    });
    expect(result.verdict).toBe('red');
    expect(result.gateReason).toMatch(/Venous/);
  });

  it('hard-gates repeat AAA SBE under Medicare', () => {
    const result = scoreStudy('aaa', {
      activeIds: ['age_65', 'male_sex', 'smoker_former', 'awv'],
      payor: 'medicare_traditional',
      aaaPriorSbe: true,
    });
    expect(result.verdict).toBe('red');
    expect(result.gateReason).toMatch(/once-in-lifetime/);
  });

  it('applies the symptom multiplier when any active criterion is flagged symptomatic', () => {
    const sym = scoreStudy('le', {
      activeIds: ['claudication'],
      payor: 'medicare_traditional',
    });
    expect(sym.payorMultiplier).toBeCloseTo(1.2);
  });

  it('applies the screening multiplier when no symptom is active', () => {
    const screen = scoreStudy('aaa', {
      activeIds: ['age_65', 'male_sex'],
      payor: 'commercial_large',
    });
    expect(screen.payorMultiplier).toBeCloseTo(0.7);
  });

  it('weights commercial Medicare and large commercial more heavily than regional', () => {
    const ids = ['claudication'];
    const ma = scoreStudy('le', { activeIds: ids, payor: 'medicare_advantage' });
    const large = scoreStudy('le', { activeIds: ids, payor: 'commercial_large' });
    const regional = scoreStudy('le', { activeIds: ids, payor: 'commercial_regional' });
    expect(ma.finalScore).toBeGreaterThan(regional.finalScore);
    expect(large.finalScore).toBeGreaterThan(regional.finalScore);
  });

  it('scoreAll returns one entry per study type', () => {
    const all = scoreAll({ activeIds: [], payor: 'unknown' });
    expect(all.map((s) => s.study)).toEqual(['carotid', 'aaa', 'le', 'renal', 'venous']);
  });

  it('suggests supporting ICD-10 codes from active criteria', () => {
    const result = scoreStudy('le', {
      activeIds: ['claudication', 'dm'],
      payor: 'commercial_large',
    });
    expect(result.suggestedIcd10.length).toBeGreaterThan(0);
    expect(result.suggestedIcd10).toContain('I70.211');
  });
});
