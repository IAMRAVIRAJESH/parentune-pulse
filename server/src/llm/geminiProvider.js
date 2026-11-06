import { TRIAGE_SYSTEM_PROMPT } from './triagePrompt.js';
import { parseJson } from './parseJson.js';

export class GeminiProvider {
  constructor({ apiKey, model }) {
    if (!apiKey) throw new Error('GEMINI_API_KEY is missing in server/.env');
    this.apiKey = apiKey;
    this.model = model;
  }

  async triage({ concern, ageMonths }) {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${this.model}:generateContent`;

    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-goog-api-key': this.apiKey },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: TRIAGE_SYSTEM_PROMPT }] },
        contents: [
          {
            role: 'user',
            parts: [
              { text: `Child age: ${ageMonths} months\nParent's concern:\n<concern>\n${concern}\n</concern>` },
            ],
          },
        ],
        generationConfig: { responseMimeType: 'application/json', maxOutputTokens: 2000, temperature: 0.3 },
      }),
    });

    if (!res.ok) {
      const err = new Error(`Gemini request failed (${res.status})`);
      err.status = res.status;
      throw err;
    }

    const data = await res.json();
    const text = (data.candidates?.[0]?.content?.parts ?? []).map((p) => p.text ?? '').join('');
    return parseJson(text);
  }
}
