import { env } from './config/env.js';
import { createApp } from './app.js';
import { createLlmProvider } from './llm/index.js';
import { SqliteQueryRepository } from './repositories/sqliteQueryRepository.js';
import { TriageService } from './services/triageService.js';
import { AnalyticsService } from './services/analyticsService.js';
import { FeedbackService } from './services/feedbackService.js';

const repository = new SqliteQueryRepository(env.dbPath);
const triageService = new TriageService({ llm: createLlmProvider(env.llmProvider), repository });
const analyticsService = new AnalyticsService({ repository });
const feedbackService = new FeedbackService({ repository });

createApp({ triageService, analyticsService, feedbackService, corsOrigin: env.corsOrigin }).listen(env.port, () => {
  console.log(`Pulse server running on http://localhost:${env.port} (llm: ${env.llmProvider})`);
});
