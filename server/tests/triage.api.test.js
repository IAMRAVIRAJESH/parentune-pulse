import { describe, it, expect } from 'vitest';
import request from 'supertest';
import { createApp } from '../src/app.js';
import { MockProvider } from '../src/llm/mockProvider.js';
import { QueryRepository } from '../src/repositories/queryRepository.js';
import { TriageService } from '../src/services/triageService.js';

const app = createApp({
  triageService: new TriageService({ llm: new MockProvider(), repository: new QueryRepository() }),
});

describe('POST /api/triage', () => {
  it('returns a triage result', async () => {
    const res = await request(app).post('/api/triage').send({ concern: 'mild fever', ageMonths: 14 });
    expect(res.status).toBe(201);
    expect(res.body.urgency).toBeDefined();
  });

  it('bypasses the LLM for emergencies', async () => {
    const res = await request(app).post('/api/triage').send({ concern: 'baby not breathing', ageMonths: 5 });
    expect(res.body.urgency).toBe('emergency');
  });

  it('rejects invalid input', async () => {
    const res = await request(app).post('/api/triage').send({ concern: '', ageMonths: -1 });
    expect(res.status).toBe(400);
  });
});
