import express from 'express';
import cors from 'cors';
import { createTriageController } from './controllers/triageController.js';
import { createTriageRoutes } from './routes/triageRoutes.js';
import { errorHandler } from './middleware/errorHandler.js';

// Dependencies are injected so tests can swap them.
export function createApp({ triageService, corsOrigin = '*' }) {
  const app = express();
  app.use(cors({ origin: corsOrigin }));
  app.use(express.json({ limit: '10kb' }));

  app.get('/health', (_req, res) => res.json({ ok: true }));
  app.use('/api', createTriageRoutes(createTriageController(triageService)));

  app.use(errorHandler);
  return app;
}
