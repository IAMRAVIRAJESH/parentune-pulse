import { z } from 'zod';

const feedbackSchema = z.object({
  id: z.string().uuid(),
  helpful: z.boolean(),
});

export class FeedbackService {
  constructor({ repository }) {
    this.repository = repository;
  }

  async submit(rawInput) {
    const { id, helpful } = feedbackSchema.parse(rawInput);
    const saved = await this.repository.saveFeedback(id, helpful);
    if (!saved) {
      const err = new Error('Query not found');
      err.status = 404;
      throw err;
    }
    return { ok: true };
  }
}
