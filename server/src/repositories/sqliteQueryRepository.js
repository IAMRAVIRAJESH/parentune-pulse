import { DatabaseSync } from 'node:sqlite';
import { randomUUID } from 'node:crypto';
import { mkdirSync } from 'node:fs';
import { dirname } from 'node:path';

// Same interface as the in-memory repository, so services never know the difference.
export class SqliteQueryRepository {
  constructor(path = './data/pulse.db') {
    mkdirSync(dirname(path), { recursive: true });
    this.db = new DatabaseSync(path);
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS queries (
        id TEXT PRIMARY KEY,
        created_at TEXT NOT NULL,
        concern TEXT NOT NULL,
        age_months INTEGER NOT NULL,
        urgency TEXT NOT NULL,
        category TEXT NOT NULL,
        result_json TEXT NOT NULL
      );
      CREATE INDEX IF NOT EXISTS idx_queries_created ON queries(created_at);
    `);
  }

  async save({ concern, ageMonths, result }) {
    const item = { id: randomUUID(), createdAt: new Date().toISOString() };
    this.db
      .prepare(
        `INSERT INTO queries (id, created_at, concern, age_months, urgency, category, result_json)
         VALUES (?, ?, ?, ?, ?, ?, ?)`
      )
      .run(item.id, item.createdAt, concern, ageMonths, result.urgency, result.category, JSON.stringify(result));
    return item;
  }

  async list(limit = 50) {
    return this.db
      .prepare('SELECT * FROM queries ORDER BY created_at DESC LIMIT ?')
      .all(limit)
      .map((r) => ({
        id: r.id,
        createdAt: r.created_at,
        concern: r.concern,
        ageMonths: r.age_months,
        result: JSON.parse(r.result_json),
      }));
  }

  // Aggregates only. Raw parent concerns never leave the database through analytics.
  async stats() {
    const plain = (rows) => rows.map((r) => ({ ...r }));
    const total = this.db.prepare('SELECT COUNT(*) AS n FROM queries').get().n;
    const byUrgency = plain(
      this.db.prepare('SELECT urgency AS label, COUNT(*) AS count FROM queries GROUP BY urgency ORDER BY count DESC').all()
    );
    const byCategory = plain(
      this.db
        .prepare(
          `SELECT LOWER(TRIM(category)) AS label, COUNT(*) AS count
           FROM queries GROUP BY LOWER(TRIM(category)) ORDER BY count DESC LIMIT 8`
        )
        .all()
    );
    const perDay = plain(
      this.db
        .prepare(
          `SELECT substr(created_at, 1, 10) AS label, COUNT(*) AS count
           FROM queries GROUP BY substr(created_at, 1, 10) ORDER BY label DESC LIMIT 7`
        )
        .all()
    ).reverse();
    return { total, byUrgency, byCategory, perDay };
  }
}
