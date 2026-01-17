import { clerkMiddleware, getAuth } from '@hono/clerk-auth';
import { createMiddleware } from 'hono/factory';
import { ENV } from '../env.js';
import { createUnauthorizedPD } from '../utils/problem-document.js';
import { StatusCodes } from 'http-status-codes';

export { clerkMiddleware, getAuth };

export const requireAuth = createMiddleware(async (c, next) => {
  if (ENV.NODE_ENV === 'test') {
    await next();
    return;
  }

  const auth = getAuth(c);
  if (!auth?.userId) {
    const pd = createUnauthorizedPD(c.req.path);
    return c.json(pd, StatusCodes.UNAUTHORIZED);
  }
  await next();
});
