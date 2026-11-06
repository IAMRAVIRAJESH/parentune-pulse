// Models sometimes wrap JSON in text or code fences. Extract the first JSON object.
export function parseJson(text) {
  const start = text.indexOf('{');
  const end = text.lastIndexOf('}');
  if (start === -1 || end === -1 || end < start) {
    throw new Error('LLM did not return JSON');
  }
  return JSON.parse(text.slice(start, end + 1));
}
