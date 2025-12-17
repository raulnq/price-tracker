import { test, describe } from 'node:test';
import { addStore, assertStore, wallmart } from './stores-dsl.js';
import {
  emptyText,
  bigText,
  createValidationError,
  validationError,
} from '../errors.js';
describe('Add Store Endpoint', () => {
  test('should create a new store with valid data', async () => {
    const input = wallmart();
    const store = await addStore(input);
    assertStore(store).hasName(input.name).hasUrl(input.url);
  });

  describe('Property validations', () => {
    const testCases = [
      {
        name: 'should reject empty store name',
        input: wallmart({ name: emptyText }),
        expectedError: createValidationError([
          validationError.tooSmall('name', 1),
        ]),
      },
      {
        name: 'should reject store name longer than 1024 characters',
        input: wallmart({ name: bigText(1025) }),
        expectedError: createValidationError([
          validationError.tooBig('name', 1024),
        ]),
      },
      {
        name: 'should reject missing store name',
        input: wallmart({ name: undefined }),
        expectedError: createValidationError([
          validationError.requiredString('name'),
        ]),
      },
      {
        name: 'should reject empty store URL',
        input: wallmart({ url: emptyText }),
        expectedError: createValidationError([
          validationError.invalidUrl('url'),
        ]),
      },
      {
        name: 'should reject invalid URL format',
        input: wallmart({ url: 'not-a-valid-url' }),
        expectedError: createValidationError([
          validationError.invalidUrl('url'),
        ]),
      },
      {
        name: 'should reject URL longer than 2048 characters',
        input: wallmart({
          url: `https://www.walmart.com/${bigText(2048)}`,
        }),
        expectedError: createValidationError([
          validationError.tooBig('url', 2048),
        ]),
      },
      {
        name: 'should reject missing URL',
        input: wallmart({ url: undefined }),
        expectedError: createValidationError([
          validationError.requiredString('url'),
        ]),
      },
    ];

    for (const { name, input, expectedError } of testCases) {
      test(name, async () => {
        await addStore(input, expectedError);
      });
    }
  });
});
