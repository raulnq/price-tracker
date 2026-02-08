import { clerkMiddleware, getAuth } from '@hono/clerk-auth';
import { createMiddleware } from 'hono/factory';
import { ENV } from '../env.js';
import { unauthorizedError } from '#/extensions.js';

export { clerkMiddleware, getAuth };

export const requireAuth = createMiddleware(async (c, next) => {
  if (ENV.NODE_ENV === 'test') {
    await next();
    return;
  }

  const auth = getAuth(c);
  if (!auth?.userId) {
    return unauthorizedError(c);
  }
  await next();
});
