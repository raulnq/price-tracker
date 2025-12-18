import { ENV } from '@/env.js';
import { logger } from '@/utils/logger.js';
import cron from 'node-cron';
import { scrapeProducts } from './features/scraper/scraper.js';

process.on('uncaughtException', err => {
  logger.fatal({ err }, 'Uncaught exception');
  process.exit(1);
});

logger.info(
  { env: ENV.NODE_ENV, cron: ENV.CRON_EXPRESSION },
  'Starting scheduler'
);

if (!ENV.GEMINI_API_KEY) {
  logger.warn('GEMINI_API_KEY not set, scraper not started');
  process.exit(1);
}

if (!ENV.GEMINI_MODEL) {
  logger.warn('GEMINI_MODEL not set, scraper not started');
  process.exit(1);
}

const cronExpression = ENV.CRON_EXPRESSION;

if (!cron.validate(ENV.CRON_EXPRESSION)) {
  logger.error(
    { cronExpression },
    'Invalid cron expression, scraper not started'
  );
  process.exit(1);
}

let isRunning = false;

const scheduledTask = cron.schedule(cronExpression, task);

logger.info({ cronExpression }, 'Scheduler started');

async function gracefulShutdown(signal: string): Promise<void> {
  logger.info({ signal }, 'Received shutdown signal');
  scheduledTask?.stop();
  logger.info('Scheduler stopped');
  process.exit(0);
}

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

process.on('unhandledRejection', (err: Error) => {
  logger.fatal({ err }, 'Unhandled rejection');
  process.exit(1);
});

async function task(): Promise<void> {
  if (isRunning) {
    logger.warn('Task already running, skipping this execution');
    return;
  }

  isRunning = true;
  const startTime = Date.now();

  try {
    logger.info('Starting task');

    const results = await scrapeProducts();

    const duration = Date.now() - startTime;
    const successful = results.filter(r => r.success).length;
    const failed = results.filter(r => !r.success).length;

    logger.info(
      {
        durationMs: duration,
        total: results.length,
        successful,
        failed,
      },
      'Task completed'
    );
  } catch (error) {
    logger.error({ error }, 'Task failed');
  } finally {
    isRunning = false;
  }
}
