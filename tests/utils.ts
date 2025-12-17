import assert from 'node:assert';
import { ProblemDocument } from 'http-problem-details';
import { StatusCodes } from 'http-status-codes';

export const assertStrictEqualProblemDocument = (
  actual: ProblemDocument,
  expected: ProblemDocument
): void => {
  assert.strictEqual(actual.status, expected.status);
  assert.strictEqual(actual.detail, expected.detail);
  if ('errors' in actual && 'errors' in expected) {
    assert.deepStrictEqual(actual['errors'], expected['errors']);
  }
};

export const emptyText = '';

export const bigText = (lenght: number = 256): string => {
  return 'a'.repeat(lenght);
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
  required: (path: string): ValidationError => ({
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
  invalidEnum: (path: string, options: string[]): ValidationError => ({
    path,
    message: `Invalid enum value. Expected ${options.join(' | ')}`,
    code: 'invalid_enum_value',
  }),
};

export const createNotFoundError = (detail: string): ProblemDocument => {
  return new ProblemDocument({
    detail,
    status: StatusCodes.NOT_FOUND,
  });
};

export const parseDatesFromJSON = <T>(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  json: any,
  dateFields: (keyof T)[]
): T => {
  const result = { ...json };
  for (const field of dateFields) {
    if (result[field]) {
      result[field] = new Date(result[field]);
    }
  }
  return result as T;
};
