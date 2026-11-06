import { Router } from 'express';
import { triageLimiter } from '../middleware/rateLimit.js';

export function createTriageRoutes(controller) {
  const router = Router();
  router.post('/triage', triageLimiter, controller.create);
  return router;
}
