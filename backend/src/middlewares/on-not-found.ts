import type { NotFoundHandler } from 'hono';
import { notFoundError } from '#/extensions.js';

export const onNotFound: NotFoundHandler = c => {
  return notFoundError(c, 'Resource not found');
};
