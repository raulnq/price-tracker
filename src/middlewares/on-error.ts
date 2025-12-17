import { createInternalServerErrorPD } from '@/utils/problem-document.js';
import type { ErrorHandler } from 'hono';
import { StatusCodes } from 'http-status-codes';
import { logger } from '@/utils/logger.js';

export const onError: ErrorHandler = (_err, c) => {
  logger.error({ err: _err }, 'Unhandled error');
  return c.json(
    createInternalServerErrorPD(c.req.path, _err),
    StatusCodes.INTERNAL_SERVER_ERROR
  );
};
