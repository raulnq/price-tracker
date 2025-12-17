import { ProblemDocument } from 'http-problem-details';
import { StatusCodes } from 'http-status-codes';

export const emptyText = '';

export const bigText = (length: number = 256): string => {
  return 'a'.repeat(length);
};

const tooBigString = (maxLength: number): string =>
  `Too big: expected string to have <=${maxLength} characters`;

const tooSmallString = (minLength: number): string =>
  `Too small: expected string to have >=${minLength} characters`;

export type ValidationError = {
  path: string;
  message: string;
  code: string;
};

export const createValidationError = (
  errors: ValidationError[]
): ProblemDocument => {
  return new ProblemDocument(
    {
      detail: 'The request contains invalid data',
      status: StatusCodes.BAD_REQUEST,
    },
    { errors }
  );
};

export const validationError = {
  tooSmall: (path: string, minLength: number): ValidationError => ({
    path,
    message: tooSmallString(minLength),
    code: 'too_small',
  }),
  tooBig: (path: string, maxLength: number): ValidationError => ({
    path,
    message: tooBigString(maxLength),
    code: 'too_big',
  }),
  requiredString: (path: string): ValidationError => ({
    path,
    message: 'Invalid input: expected string, received undefined',
    code: 'invalid_type',
  }),
  invalidUrl: (path: string): ValidationError => ({
    path,
    message: 'Invalid URL',
    code: 'invalid_format',
  }),
  invalidUuid: (path: string): ValidationError => ({
    path,
    message: 'Invalid UUID',
    code: 'invalid_format',
  }),
  notPositive: (path: string): ValidationError => ({
    path,
    message: 'Too small: expected number to be >0',
    code: 'too_small',
  }),
  requiredNumber: (path: string): ValidationError => ({
    path,
    message: 'Invalid input: expected number, received undefined',
    code: 'invalid_type',
  }),
};

export const createNotFoundError = (detail: string): ProblemDocument => {
  return new ProblemDocument({
    detail,
    status: StatusCodes.NOT_FOUND,
  });
};
