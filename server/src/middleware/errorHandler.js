import { ZodError } from 'zod';

export function errorHandler(err, _req, res, _next) {
  if (err instanceof ZodError) {
    return res.status(400).json({ error: 'Invalid input', details: err.issues });
  }
  if (err.status === 429) {
    return res.status(429).json({ error: 'Too many requests right now. Please try again in a minute.' });
  }
  if (err.upstream) {
    return res.status(503).json({ error: 'The AI service is busy right now. Please try again in a moment.' });
  }
  console.error(err);
  res.status(500).json({ error: 'Something went wrong' });
}