import { describe, it, expect } from 'vitest';
import { SqliteQueryRepository } from '../src/repositories/sqliteQueryRepository.js';

const result = (urgency, category) => ({ urgency, category, summary: 's', advice: ['a'], redFlags: [], disclaimer: 'd' });

describe('SqliteQueryRepository', () => {
  it('saves and lists queries', async () => {
    const repo = new SqliteQueryRepository(':memory:');
    await repo.save({ concern: 'fever', ageMonths: 10, result: result('instant', 'Fever') });
    const items = await repo.list();
    expect(items).toHaveLength(1);
    expect(items[0].result.category).toBe('Fever');
  });

  it('aggregates stats and merges category casing', async () => {
    const repo = new SqliteQueryRepository(':memory:');
    await repo.save({ concern: 'a', ageMonths: 1, result: result('instant', 'Fever') });
    await repo.save({ concern: 'b', ageMonths: 2, result: result('see_doctor', 'fever ') });
    await repo.save({ concern: 'c', ageMonths: 3, result: result('instant', 'Sleep') });
    const stats = await repo.stats();
    expect(stats.total).toBe(3);
    expect(stats.byCategory[0]).toEqual({ label: 'fever', count: 2 });
  });
});
