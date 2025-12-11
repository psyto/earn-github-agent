import express, { Express } from 'express';
import { githubReviewRouter } from './routes/github';

export function createServer(): Express {
  const app = express();

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Health check
  app.get('/health', (_req, res) => {
    res.json({ status: 'ok', service: 'earn-agent' });
  });

  // GitHub review routes
  app.use('/api/github', githubReviewRouter);

  return app;
}

