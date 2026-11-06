import { Router } from 'express';

export function createAnalyticsRoutes(analyticsService) {
  const router = Router();
  router.get('/analytics', async (_req, res, next) => {
    try {
      res.json(await analyticsService.summary());
    } catch (err) {
      next(err);
    }
  });
  return router;
}
