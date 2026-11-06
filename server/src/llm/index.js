import { MockProvider } from './mockProvider.js';
import { ClaudeProvider } from './claudeProvider.js';
import { GeminiProvider } from './geminiProvider.js';
import { env } from '../config/env.js';

export function createLlmProvider(name) {
  switch (name) {
    case 'gemini':
      return new GeminiProvider({ apiKey: env.geminiApiKey, model: env.geminiModel });
    case 'claude':
      return new ClaudeProvider({ apiKey: env.anthropicApiKey, model: env.anthropicModel });
    case 'mock':
    default:
      return new MockProvider();
  }
}
