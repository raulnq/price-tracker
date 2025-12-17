import { serve } from '@hono/node-server';
import { ENV } from '@/env.js';
import { app } from './app.js';
import { logger } from '@/utils/logger.js';

process.on('uncaughtException', err => {
  logger.fatal({ err }, 'Uncaught exception');
  process.exit(1);
});

const server = serve(
  {
    fetch: app.fetch,
    port: ENV.PORT,
  },
  info => {
    logger.info(
      { port: info.port, env: ENV.NODE_ENV },
      `Server is running on http://localhost:${info.port}`
    );
  }
);

process.on('unhandledRejection', (err: Error) => {
  logger.fatal({ err }, 'Unhandled rejection');
  server.close(() => {
    process.exit(1);
  });
});
