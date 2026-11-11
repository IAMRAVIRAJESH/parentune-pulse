import { describe, it, expect } from 'vitest';
import { isEmergency } from '../src/domain/guardrails.js';

const emergencies = [
  'my baby is not breathing',
  'baby is struggling to breathe',
  'he turned blue',
  'she is unresponsive',
  "baby won't wake up",
  'child is having a seizure',
  'baby swallowed a button battery',
  "bleeding won't stop",
  'face swelling after eating peanuts',
  'baby fell in water',
  'bacche ko saans nahi aa rahi',
  'bacha behosh ho gaya',
  'bache ko daura pad raha hai',
  'bacha neela pad gaya',
  'gale mein kuch phans gaya',
  'khoon nahi ruk raha',
  'bacche ne zeher kha liya',
  'बच्चा सांस नहीं ले रहा',
];

const notEmergencies = [
  'my toddler has a mild cold',
  'baby is breathing fine but has a runny nose',
  'bacha khana nahi kha raha',
  'bacha raat ke dauran baar baar uthta hai',
  'fever not responding to medicine',
  'my daughter is limping since morning',
];

describe('emergency guardrails', () => {
  it.each(emergencies)('flags: %s', (text) => {
    expect(isEmergency(text)).toBe(true);
  });
  it.each(notEmergencies)('does not flag: %s', (text) => {
    expect(isEmergency(text)).toBe(false);
  });
});
