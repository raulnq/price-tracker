import { test, describe } from 'node:test';
import {
  addStore,
  editStore,
  wallmart,
  nike,
  assertStore,
} from './stores-dsl.js';
import { type Store } from '@/features/stores/store.js';
import {
  emptyText,
  bigText,
  createValidationError,
  validationError,
  createNotFoundError,
} from '../errors.js';
import type { EditStore } from '@/features/stores/edit-store.js';

describe('Edit Store Endpoint', () => {
  test('should edit an existing store with valid data', async () => {
    const store = await addStore(wallmart());
    const input = nike();
    const newStore = await editStore(store.storeId, input);
    assertStore(newStore).hasName(input.name).hasUrl(input.url);
  });

  describe('Property validations', async () => {
    const testCases = [
      {
        name: 'should reject empty store name',
        input: (store: Store) => ({ name: emptyText, url: store.url }),
        expectedError: createValidationError([
          validationError.tooSmall('name', 1),
        ]),
      },
      {
        name: 'should reject store name longer than 1024 characters',
        input: (store: Store) => ({ name: bigText(1025), url: store.url }),
        expectedError: createValidationError([
          validationError.tooBig('name', 1024),
        ]),
      },
      {
        name: 'should reject missing store name',
        input: (store: Store) => ({ url: store.url }) as EditStore,
        expectedError: createValidationError([
          validationError.requiredString('name'),
        ]),
      },
      {
        name: 'should reject empty store URL',
        input: (store: Store) => ({ name: store.name, url: emptyText }),
        expectedError: createValidationError([
          validationError.invalidUrl('url'),
        ]),
      },
      {
        name: 'should reject invalid URL format',
        input: (store: Store) => ({ name: store.name, url: 'not-a-valid-url' }),
        expectedError: createValidationError([
          validationError.invalidUrl('url'),
        ]),
      },
      {
        name: 'should reject URL longer than 2048 characters',
        input: (store: Store) => ({
          name: store.name,
          url: `https://www.walmart.com/${bigText(2048)}`,
        }),
        expectedError: createValidationError([
          validationError.tooBig('url', 2048),
        ]),
      },
      {
        name: 'should reject missing URL',
        input: (store: Store) => ({ name: store.name }) as EditStore,
        expectedError: createValidationError([
          validationError.requiredString('url'),
        ]),
      },
    ];
    for (const { name, input, expectedError } of testCases) {
      test(name, async () => {
        const store = await addStore(wallmart());
        await editStore(store.storeId, input(store), expectedError);
      });
    }
  });

  test('should return 404 for non-existent store', async () => {
    const nonExistentId = '01940b6d-1234-7890-abcd-ef1234567890';
    await editStore(
      nonExistentId,
      nike(),
      createNotFoundError(`Store ${nonExistentId} not found`)
    );
  });

  test('should reject invalid UUID format', async () => {
    await editStore(
      'invalid-uuid',
      nike(),
      createValidationError([validationError.invalidUuid('storeId')])
    );
  });
});
