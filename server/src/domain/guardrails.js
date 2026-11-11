// Emergency phrases bypass the LLM completely and return a fixed "get help now" response.
// Design rule: a false alarm is acceptable, a missed emergency is not.
// Covers English, Hinglish (Roman script) and Hindi (Devanagari).
const EMERGENCY_PATTERNS = [
  // --- breathing ---
  /not breathing|stopped breathing|isn['’`]?t breathing|no longer breathing/,
  /(can['’`]?t|cannot|unable to) breathe/,
  /(struggling|gasping|difficulty|trouble|hard) (to |for |with )?(breath|breathe|breathing|air)/,
  /gasping/,
  /suffocat/,
  // --- colour change ---
  /turn(ed|ing|s)? blue|blue (lips|face|skin)|lips? (are |is |turned )?blue/,
  // --- consciousness ---
  /unconscious|unresponsive|passed out|fainted/,
  /(won['’`]?t|can['’`]?t|not|doesn['’`]?t|isn['’`]?t) wak(e|ing)( up)?/,
  /\b(went|gone|goes|become|became|is|feels?) (limp|floppy)\b/,
  // --- seizures ---
  /seizure|convulsion|convulsing|having (a )?fits?\b/,
  // --- choking, swallowing, poison ---
  /choking|choked|something stuck in (his|her|the) (throat|windpipe)/,
  /swallowed (a |an |the |some )?(button |coin |magnet|battery|batteries|poison|bleach|pesticide|kerosene|phenyl|detergent|medicine|pills|tablets)/,
  /(drank|ate|had) (kerosene|phenyl|bleach|pesticide|acid|poison)/,
  // --- bleeding ---
  /(severe|heavy|profuse|a lot of) bleeding|bleeding (a lot|heavily|won['’`]?t stop|is not stopping)|won['’`]?t stop bleeding/,
  // --- allergic reaction ---
  /anaphyla|(face|lips?|tongue|throat) (is |are )?(swelling|swollen)|swelling (of|in) (the |his |her )?(face|lips?|tongue|throat)/,
  // --- drowning ---
  /drown|fell (in|into) (the )?(water|pool|bucket|tub|well)/,

  // --- Hinglish (Roman script) ---
  /\bsa+ns? (nahi|nhi|nahin|band|ruk|rukk)/,
  /saans lene (me|mein) (dikkat|takleef|problem)/,
  /\b(behosh|bahosh|bejaan)\b|\bhosh (nahi|nhi)\b/,
  /\b(daura|daure|mirgi)\b|jhatke (aa|aane|lag)/,
  /neel[aie] (pad|ho)/,
  /gale (me|mein) .*(phans|atak|fas)/,
  /khoon .*(nahi|nhi) (ruk|band)|bahut (zyada )?khoon/,
  /\b(zeher|zehar|jahar)\b|nigal (li|liya|gaya|gayi)/,
  /paani (me|mein) (gir|doob)/,

  // --- Hindi (Devanagari) ---
  /सांस नहीं|साँस नहीं|सांस लेने में (दिक्कत|तकलीफ)/,
  /बेहोश|दौरा|मिर्गी/,
  /नीला पड|नीली पड|नीला हो/,
  /खून नहीं रुक|जहर|ज़हर|निगल/,
  /गले में .*(फंस|अटक)/,
];

export const EMERGENCY_RESPONSE = {
  urgency: 'emergency',
  category: 'Emergency',
  summary: 'This may be an emergency. Please get medical help right now.',
  advice: [
    'Call your local emergency number (112 in India) or go to the nearest hospital immediately.',
    'तुरंत 112 पर कॉल करें या नज़दीकी अस्पताल जाएं।',
    'Stay with your child and keep them calm. Do not give food, drink or medicine.',
  ],
  redFlags: [],
  disclaimer: 'This is not a medical diagnosis. Do not wait for an online response.',
};

export function isEmergency(text) {
  const normalized = String(text).toLowerCase().replace(/\s+/g, ' ');
  return EMERGENCY_PATTERNS.some((re) => re.test(normalized));
}
