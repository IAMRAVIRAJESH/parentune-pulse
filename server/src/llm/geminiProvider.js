import { TRIAGE_SYSTEM_PROMPT } from './triagePrompt.js';
import { parseJson } from './parseJson.js';

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

function upstreamError(message, status) {
  const err = new Error(message);
  err.status = status;
  err.upstream = true;
  return err;
}

export class GeminiProvider {
  constructor({ apiKey, model }) {
    if (!apiKey) throw new Error('GEMINI_API_KEY is missing in server/.env');
    this.apiKey = apiKey.trim();
    // GEMINI_MODEL can be a comma-separated list: the first is tried first, the rest are fallbacks.
    this.models = String(model)
      .split(',')
      .map((m) => m.trim().replace(/^models\//, '').replace(/["'\s]/g, ''))
      .filter(Boolean);
    if (this.models.length === 0) throw new Error('GEMINI_MODEL is empty');
  }

  async triage(input) {
    let lastError;
    for (const model of this.models) {
      for (let attempt = 0; attempt < 2; attempt++) {
        try {
          return await this.#call(model, input);
        } catch (err) {
          lastError = err;
          if (err.status === 401 || err.status === 403) throw err; // bad key: no point retrying
          const retryable = err.status === 429 || err.status >= 500;
          if (!retryable) break; // 400/404 for this model: move to the next model
          await sleep(700);
        }
      }
    }
    throw lastError;
  }

  async #call(model, { concern, ageMonths }) {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`;

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
      console.error(`Gemini ${res.status} (${model}):`, body);
      throw upstreamError(`Gemini request failed (${res.status})`, res.status);
    }

    const data = await res.json();
    const candidate = data.candidates?.[0];
    const text = (candidate?.content?.parts ?? []).map((p) => p.text ?? '').join('');

    if (!text) {
      console.error(`Gemini (${model}) returned no text:`, JSON.stringify(data).slice(0, 500));
      throw upstreamError('Empty response from Gemini', 502);
    }

    try {
      return parseJson(text);
    } catch {
      console.error(`Gemini (${model}) invalid JSON. finishReason:`, candidate?.finishReason, text.slice(0, 300));
      throw upstreamError('Invalid JSON from Gemini', 502);
    }
  }
}