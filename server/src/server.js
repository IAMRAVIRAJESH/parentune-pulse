import { env } from './config/env.js';
import { createApp } from './app.js';
import { createLlmProvider } from './llm/index.js';
import { QueryRepository } from './repositories/queryRepository.js';
import { TriageService } from './services/triageService.js';

const triageService = new TriageService({
  llm: createLlmProvider(env.llmProvider),
  repository: new QueryRepository(),
});

createApp({ triageService, corsOrigin: env.corsOrigin }).listen(env.port, () => {
  console.log(`Pulse server running on http://localhost:${env.port} (llm: ${env.llmProvider})`);
});
