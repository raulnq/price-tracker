import { test, describe } from 'node:test';
import { addStore, getStore, wallmart } from './stores-dsl.js';
import {
  createNotFoundError,
  createValidationError,
  validationError,
} from '../utils.js';
import assert from 'node:assert';

describe('Get Store Endpoint', () => {
  test('should get an existing store by ID', async () => {
    const createdStore = await addStore(wallmart());
    const retrievedStore = await getStore(createdStore.storeId);

    assert.strictEqual(retrievedStore.storeId, createdStore.storeId);
    assert.strictEqual(retrievedStore.name, createdStore.name);
    assert.strictEqual(retrievedStore.url, createdStore.url);
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
