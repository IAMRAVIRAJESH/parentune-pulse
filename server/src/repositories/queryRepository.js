import { randomUUID } from 'node:crypto';

// In-memory for now. Same interface will be backed by SQLite later.
export class QueryRepository {
  #items = [];

  async save(record) {
    const item = { id: randomUUID(), createdAt: new Date().toISOString(), ...record };
    this.#items.push(item);
    return item;
  }

  async list() {
    return [...this.#items].reverse();
  }
}
