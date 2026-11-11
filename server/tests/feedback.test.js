import { describe, it, expect } from 'vitest';
import { randomUUID } from 'node:crypto';
import { SqliteQueryRepository } from '../src/repositories/sqliteQueryRepository.js';
import { FeedbackService } from '../src/services/feedbackService.js';

const result = { urgency: 'instant', category: 'Fever', summary: 's', advice: ['a'], redFlags: [], disclaimer: 'd' };

describe('feedback', () => {
  it('stores feedback and reports it in stats', async () => {
    const repository = new SqliteQueryRepository(':memory:');
    const service = new FeedbackService({ repository });
    const a = await repository.save({ concern: 'x', ageMonths: 5, result });
    const b = await repository.save({ concern: 'y', ageMonths: 6, result });
    await service.submit({ id: a.id, helpful: true });
    await service.submit({ id: b.id, helpful: false });
    expect((await repository.stats()).helpful).toEqual({ yes: 1, no: 1 });
  });

  it('lets a parent change their vote instead of double counting', async () => {
    const repository = new SqliteQueryRepository(':memory:');
    const service = new FeedbackService({ repository });
    const a = await repository.save({ concern: 'x', ageMonths: 5, result });
    await service.submit({ id: a.id, helpful: false });
    await service.submit({ id: a.id, helpful: true });
    expect((await repository.stats()).helpful).toEqual({ yes: 1, no: 0 });
  });

  it('rejects unknown ids with 404', async () => {
    const service = new FeedbackService({ repository: new SqliteQueryRepository(':memory:') });
    await expect(service.submit({ id: randomUUID(), helpful: true })).rejects.toMatchObject({ status: 404 });
  });
});
