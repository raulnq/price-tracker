import { test, describe } from 'node:test';
import { addStore, assertStore, getStore, wallmart } from './stores-dsl.js';
import {
  createNotFoundError,
  createValidationError,
  validationError,
} from '../errors.js';

describe('Get Store Endpoint', () => {
  test('should get an existing store by ID', async () => {
    const createdStore = await addStore(wallmart());
    const retrievedStore = await getStore(createdStore.storeId);
    assertStore(retrievedStore).isTheSameOf(createdStore);
  });

  test('should return 404 for non-existent store', async () => {
    const nonExistentId = '01940b6d-1234-7890-abcd-ef1234567890';
    await getStore(
      nonExistentId,
      createNotFoundError(`Store ${nonExistentId} not found`)
    );
  });

  test('should reject invalid UUID format', async () => {
    await getStore(
      'invalid-uuid',
      createValidationError([validationError.invalidUuid('storeId')])
    );
  });

  test('should reject empty storeId', async () => {
    await getStore(
      '',
      createValidationError([validationError.invalidUuid('storeId')])
    );
  });
});
