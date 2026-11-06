import { Router } from 'express';

export function createTriageRoutes(controller) {
  const router = Router();
  router.post('/triage', controller.create);
  router.get('/history', controller.history);
  return router;
}
