import { MockProvider } from './mockProvider.js';

// Claude provider gets added in the next step.
export function createLlmProvider(name) {
  switch (name) {
    case 'mock':
    default:
      return new MockProvider();
  }
}
