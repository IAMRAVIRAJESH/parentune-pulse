import { Router } from 'express';
import { feedbackLimiter } from '../middleware/rateLimit.js';

export function createFeedbackRoutes(feedbackService) {
  const router = Router();
  router.post('/feedback', feedbackLimiter, async (req, res, next) => {
    try {
      res.status(201).json(await feedbackService.submit(req.body));
    } catch (err) {
      next(err);
    }
  });
  return router;
}
