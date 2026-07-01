import express, { type Express } from 'express';
import { playersRouter } from './routes/players.route';
import { createDependenciesContainer, type Dependencies } from '../dependencies.container';
import { errorHandler } from './middleware/error-handler.middleware';
import { rateLimiter } from './middleware/rate-limiter.middleware';

const createApp = (dependencies: Dependencies): Express => {
  const app = express();

  app.use(express.json());
  app.use(rateLimiter);
  app.use(playersRouter(dependencies));
  app.use(errorHandler(dependencies.logger));

  return app;
};

const app = createApp(createDependenciesContainer());

export { app, createApp };
