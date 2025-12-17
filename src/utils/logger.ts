import pino from 'pino';
import * as pinoSeq from 'pino-seq';
import { ENV } from '@/env.js';

function createLogger() {
  if (ENV.SEQ_URL) {
    const stream = pinoSeq.createStream({
      serverUrl: ENV.SEQ_URL,
    });
    return pino({ level: ENV.LOG_LEVEL }, stream);
  }

  return pino({
    level: ENV.LOG_LEVEL,
    transport: {
      target: 'pino-pretty',
      options: {
        colorize: true,
        translateTime: 'SYS:standard',
        ignore: 'pid,hostname',
      },
    },
  });
}

export const logger = createLogger();
