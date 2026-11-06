import { describe, it, expect } from 'vitest';
import { isEmergency } from '../src/domain/guardrails.js';

describe('guardrails', () => {
  it('flags emergencies', () => {
    expect(isEmergency('my baby is not breathing')).toBe(true);
    expect(isEmergency('bacche ko saans nahi aa rahi')).toBe(true);
  });
  it('does not flag normal concerns', () => {
    expect(isEmergency('my toddler has a mild cold')).toBe(false);
  });
});
