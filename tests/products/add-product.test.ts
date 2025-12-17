import { test, describe } from 'node:test';
import { addProduct, assertProduct, laptop } from './products-dsl.js';
import { addStore, wallmart } from '../stores/stores-dsl.js';
import {
  emptyText,
  bigText,
  createValidationError,
  validationError,
  createNotFoundError,
} from '../errors.js';

import type { AddProduct } from '@/features/products/add-product.js';

describe('Add Product Endpoint', async () => {
  const store = await addStore(wallmart());
  test('should create a new product with valid data', async () => {
    const input = laptop(store.storeId);
    const product = await addProduct(input);
    assertProduct(product)
      .hasStoreId(input.storeId)
      .hasName(input.name)
      .hasUrl(input.url)
      .hasCurrency(input.currency);
  });

  describe('Property validations', async () => {
    const nonExistentId = '01940b6d-1234-7890-abcd-ef1234567890';
    const testCases = [
      {
        name: 'should reject empty product name',
        input: laptop(store.storeId, { name: emptyText }),
        expectedError: createValidationError([
          validationError.tooSmall('name', 1),
        ]),
      },
      {
        name: 'should reject product name longer than 1024 characters',
        input: laptop(store.storeId, { name: bigText(1025) }),
        expectedError: createValidationError([
          validationError.tooBig('name', 1024),
        ]),
      },
      {
        name: 'should reject missing product name',
        input: {
          storeId: store.storeId,
          url: 'https://www.example.com/laptop',
          currency: 'USD',
        } as AddProduct,
        expectedError: createValidationError([
          validationError.requiredString('name'),
        ]),
      },
      {
        name: 'should reject empty product URL',
        input: laptop(store.storeId, { url: emptyText }),
        expectedError: createValidationError([
          validationError.invalidUrl('url'),
        ]),
      },
      {
        name: 'should reject invalid URL format',
        input: laptop(store.storeId, { url: 'not-a-valid-url' }),
        expectedError: createValidationError([
          validationError.invalidUrl('url'),
        ]),
      },
      {
        name: 'should reject URL longer than 2048 characters',
        input: laptop(store.storeId, {
          url: `https://www.example.com/laptop/${bigText(2048)}`,
        }),
        expectedError: createValidationError([
          validationError.tooBig('url', 2048),
        ]),
      },
      {
        name: 'should reject missing product url',
        input: laptop(store.storeId, { url: undefined }),
        expectedError: createValidationError([
          validationError.requiredString('url'),
        ]),
      },
      {
        name: 'should reject empty product currency',
        input: laptop(store.storeId, { currency: emptyText }),
        expectedError: createValidationError([
          validationError.tooSmall('currency', 3),
        ]),
      },
      {
        name: 'should reject product currency longer than 3 characters',
        input: laptop(store.storeId, { currency: bigText(4) }),
        expectedError: createValidationError([
          validationError.tooBig('currency', 3),
        ]),
      },
      {
        name: 'should reject missing product currency',
        input: laptop(store.storeId, { currency: undefined }),
        expectedError: createValidationError([
          validationError.requiredString('currency'),
        ]),
      },
      {
        name: 'should reject invalid storeId UUID format',
        input: laptop('invalid-uuid'),
        expectedError: createValidationError([
          validationError.invalidUuid('storeId'),
        ]),
      },
      {
        name: 'should return 404 for non-existent store',
        input: laptop(nonExistentId),
        expectedError: createNotFoundError(`Store ${nonExistentId} not found`),
      },
      {
        name: 'should reject missing storeId',
        input: laptop(store.storeId, { storeId: undefined }),
        expectedError: createValidationError([
          validationError.requiredString('storeId'),
        ]),
      },
    ];

    for (const { name, input, expectedError } of testCases) {
      test(name, async () => {
        await addProduct(input, expectedError);
      });
    }
  });
});
