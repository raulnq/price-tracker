import { test, describe } from 'node:test';
import {
  addProduct,
  getProduct,
  laptop,
  assertProduct,
} from './products-dsl.js';
import { addStore, wallmart } from '../stores/stores-dsl.js';
import {
  createValidationError,
  validationError,
  createNotFoundError,
} from '../errors.js';

describe('Get Product Endpoint', () => {
  test('should get an existing product by ID', async () => {
    const store = await addStore(wallmart());
    const createdProduct = await addProduct(laptop(store.storeId));
    const retrievedProduct = await getProduct(createdProduct.productId);
    assertProduct(retrievedProduct).isTheSameOf(createdProduct);
  });

  test('should return 404 for non-existent product', async () => {
    const nonExistentId = '01940b6d-1234-7890-abcd-ef1234567890';
    await getProduct(
      nonExistentId,
      createNotFoundError(`Product ${nonExistentId} not found`)
    );
  });

  test('should reject invalid UUID format', async () => {
    await getProduct(
      'invalid-uuid',
      createValidationError([validationError.invalidUuid('productId')])
    );
  });

  test('should reject empty productId', async () => {
    await getProduct(
      '',
      createValidationError([validationError.invalidUuid('productId')])
    );
  });
});
