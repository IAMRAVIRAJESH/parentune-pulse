import Anthropic from '@anthropic-ai/sdk';
import { TRIAGE_SYSTEM_PROMPT } from './triagePrompt.js';
import { parseJson } from './parseJson.js';

export class ClaudeProvider {
  constructor({ apiKey, model }) {
    if (!apiKey) throw new Error('ANTHROPIC_API_KEY is missing in server/.env');
    this.client = new Anthropic({ apiKey });
    this.model = model;
  }

  async triage({ concern, ageMonths }) {
    const message = await this.client.messages.create({
      model: this.model,
      max_tokens: 800,
      system: TRIAGE_SYSTEM_PROMPT,
      messages: [
        {
          role: 'user',
          content: `Child age: ${ageMonths} months\nParent's concern:\n<concern>\n${concern}\n</concern>`,
        },
      ],
    });
    const text = message.content
      .filter((block) => block.type === 'text')
      .map((block) => block.text)
      .join('');
    return parseJson(text);
  }
}
