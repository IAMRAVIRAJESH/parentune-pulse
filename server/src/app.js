import express from 'express';
import cors from 'cors';
import { createTriageController } from './controllers/triageController.js';
import { createTriageRoutes } from './routes/triageRoutes.js';
import { createAnalyticsRoutes } from './routes/analyticsRoutes.js';
import { createFeedbackRoutes } from './routes/feedbackRoutes.js';
import { errorHandler } from './middleware/errorHandler.js';

// Dependencies are injected so tests can swap them.
export function createApp({ triageService, analyticsService, feedbackService, corsOrigin = '*' }) {
  const app = express();
  app.set('trust proxy', 1); // correct client IPs behind Render/Netlify proxies
  app.use(cors({ origin: corsOrigin }));
  app.use(express.json({ limit: '10kb' }));

  app.get('/health', (_req, res) => res.json({ ok: true }));
  app.use('/api', createTriageRoutes(createTriageController(triageService)));
  if (analyticsService) app.use('/api', createAnalyticsRoutes(analyticsService));
  if (feedbackService) app.use('/api', createFeedbackRoutes(feedbackService));

  app.use(errorHandler);
  return app;
}
