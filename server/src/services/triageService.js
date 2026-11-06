import { triageInputSchema, triageResultSchema } from '../domain/schemas.js';
import { isEmergency, EMERGENCY_RESPONSE } from '../domain/guardrails.js';

export class TriageService {
  constructor({ llm, repository }) {
    this.llm = llm;
    this.repository = repository;
  }

  async triage(rawInput) {
    const input = triageInputSchema.parse(rawInput);

    const result = isEmergency(input.concern)
      ? EMERGENCY_RESPONSE
      : triageResultSchema.parse(await this.llm.triage(input));

    const saved = await this.repository.save({ ...input, result });
    return { id: saved.id, ...result };
  }

  async history() {
    return this.repository.list();
  }
}
