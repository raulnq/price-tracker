import type { ErrorHandler } from 'hono';
import { logger } from '#/logger.js';
import { internalServerError } from '#/extensions.js';

export const onError: ErrorHandler = (_err, c) => {
  logger.error(_err, 'Unhandled error');
  return internalServerError(c, _err);
};
