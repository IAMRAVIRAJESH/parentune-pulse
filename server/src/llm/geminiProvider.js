import { TRIAGE_SYSTEM_PROMPT } from './triagePrompt.js';
import { parseJson } from './parseJson.js';

function upstreamError(message, status) {
  const err = new Error(message);
  err.status = status;
  err.upstream = true;
  return err;
}

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
        generationConfig: { responseMimeType: 'application/json', maxOutputTokens: 4000, temperature: 0.3 },
      }),
    });

    if (!res.ok) {
      const body = (await res.text()).slice(0, 500);
      console.error(`Gemini ${res.status}:`, body);
      throw upstreamError(`Gemini request failed (${res.status})`, res.status);
    }

    const data = await res.json();
    const candidate = data.candidates?.[0];
    const text = (candidate?.content?.parts ?? []).map((p) => p.text ?? '').join('');

    if (!text) {
      console.error('Gemini returned no text:', JSON.stringify(data).slice(0, 500));
      throw upstreamError('Empty response from Gemini', 502);
    }

    try {
      return parseJson(text);
    } catch {
      console.error('Gemini returned invalid JSON. finishReason:', candidate?.finishReason, text.slice(0, 300));
      throw upstreamError('Invalid JSON from Gemini', 502);
    }
  }
}