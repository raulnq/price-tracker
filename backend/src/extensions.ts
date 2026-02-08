import type { Context } from 'hono';
import { StatusCodes } from 'http-status-codes';
import type { z } from 'zod';
import { ProblemDocument } from 'http-problem-details';
import { ENV } from './env.js';

export const notFoundError = function (c: Context, detail: string) {
  return c.json(
    new ProblemDocument({
      type: '/problems/resource-not-found',
      title: 'Resource not found',
      status: StatusCodes.NOT_FOUND,
      detail: detail,
      instance: c.req.path,
    }),
    StatusCodes.NOT_FOUND
  );
};

export const validationError = function (
  c: Context,
  issues: z.core.$ZodIssue[]
) {
  return c.json(
    new ProblemDocument(
      {
        type: '/problems/validation-error',
        title: 'Validation Error',
        status: StatusCodes.BAD_REQUEST,
        detail: 'The request contains invalid data',
        instance: c.req.path,
      },
      {
        errors: issues.map(err => ({
          path: err.path.join('.'),
          message: err.message,
          code: err.code,
        })),
      }
    ),
    StatusCodes.BAD_REQUEST
  );
};

export const unauthorizedError = function (c: Context) {
  return c.json(
    new ProblemDocument({
      type: '/problems/unauthorized',
      title: 'Unauthorized',
      status: StatusCodes.UNAUTHORIZED,
      detail: 'Authentication is required to access this resource',
      instance: c.req.path,
    }),
    StatusCodes.UNAUTHORIZED
  );
};

export const forbiddenError = function (c: Context, detail?: string) {
  return c.json(
    new ProblemDocument({
      type: '/problems/forbidden',
      title: 'Forbidden',
      status: StatusCodes.FORBIDDEN,
      detail: detail ?? 'You do not have permission to access this resource',
      instance: c.req.path,
    }),
    StatusCodes.FORBIDDEN
  );
};

export const conflictError = function (c: Context, detail: string) {
  return c.json(
    new ProblemDocument({
      type: '/problems/conflict',
      title: 'Conflict',
      status: StatusCodes.CONFLICT,
      detail,
      instance: c.req.path,
    }),
    StatusCodes.CONFLICT
  );
};

export const internalServerError = function (c: Context, error?: Error) {
  const extensions =
    ENV.NODE_ENV === 'development' && error?.stack
      ? { stack: error.stack }
      : undefined;

  return c.json(
    new ProblemDocument(
      {
        type: '/problems/internal-server-error',
        title: 'Internal Server Error',
        status: StatusCodes.INTERNAL_SERVER_ERROR,
        detail: 'An unexpected error occurred',
        instance: c.req.path,
      },
      extensions
    ),
    StatusCodes.INTERNAL_SERVER_ERROR
  );
};
