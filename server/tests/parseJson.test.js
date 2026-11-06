import { describe, it, expect } from 'vitest';
import { parseJson } from '../src/llm/parseJson.js';

describe('parseJson', () => {
  it('parses plain JSON', () => {
    expect(parseJson('{"a":1}')).toEqual({ a: 1 });
  });
  it('parses JSON wrapped in code fences', () => {
    expect(parseJson('```json\n{"a":1}\n```')).toEqual({ a: 1 });
  });
  it('throws when there is no JSON', () => {
    expect(() => parseJson('sorry')).toThrow();
  });
});
