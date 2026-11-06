// Emergency keywords bypass the LLM completely. Includes common Hinglish.
const EMERGENCY_PATTERNS = [
  /not breathing/i,
  /can'?t breathe/i,
  /difficulty breathing/i,
  /unconscious|unresponsive/i,
  /seizure|convulsion/i,
  /blue (lips|face)/i,
  /choking/i,
  /severe bleeding/i,
  /swallowed .*(battery|poison|medicine)/i,
  /saans nahi/i,
  /behosh/i,
  /daura/i,
];

export const EMERGENCY_RESPONSE = {
  urgency: 'emergency',
  category: 'Emergency',
  summary: 'This may be an emergency. Please get medical help right now.',
  advice: [
    'Call your local emergency number (112 in India) or go to the nearest hospital immediately.',
    'Stay with your child and keep them calm.',
  ],
  redFlags: [],
  disclaimer: 'This is not a medical diagnosis. Do not wait for an online response.',
};

export function isEmergency(text) {
  return EMERGENCY_PATTERNS.some((re) => re.test(text));
}
