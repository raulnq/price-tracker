import { test, describe } from 'node:test';
import {
  addProduct,
  assertProduct,
  editProduct,
  laptop,
  phone,
} from './products-dsl.js';
import { addStore, wallmart } from '../stores/stores-dsl.js';
import { type Product } from '@/features/products/product.js';
import {
  emptyText,
  bigText,
  createValidationError,
  validationError,
  createNotFoundError,
} from '../errors.js';
import type { EditProduct } from '@/features/products/edit-product.js';

describe('Edit Product Endpoint', async () => {
  const store = await addStore(wallmart());
  test('should edit an existing product with valid data', async () => {
    const product = await addProduct(laptop(store.storeId));
    const input = phone(store.storeId);
    const newProduct = await editProduct(product.productId, input);
    assertProduct(newProduct)
      .hasCurrency(input.currency)
      .hasName(input.name)
      .hasUrl(input.url);
  });

  describe('Property validations', () => {
    const testCases = [
      {
        name: 'should reject empty product name',
        input: (product: Product) => ({
          name: emptyText,
          url: product.url,
          currency: product.currency,
        }),
        expectedError: createValidationError([
          validationError.tooSmall('name', 1),
        ]),
      },
      {
        name: 'should reject product name longer than 1024 characters',
        input: (product: Product) => ({
          name: bigText(1025),
          url: product.url,
          currency: product.currency,
        }),
        expectedError: createValidationError([
          validationError.tooBig('name', 1024),
        ]),
      },
      {
        name: 'should reject missing product name',
        input: (product: Product) =>
          ({
            url: product.url,
            currency: product.currency,
          }) as EditProduct,
        expectedError: createValidationError([
          validationError.requiredString('name'),
        ]),
      },
      {
        name: 'should reject empty product URL',
        input: (product: Product) => ({
          name: product.name,
          url: emptyText,
          currency: product.currency,
        }),
        expectedError: createValidationError([
          validationError.invalidUrl('url'),
        ]),
      },
      {
        name: 'should reject product URL longer than 2048 characters',
        input: (product: Product) => ({
          name: product.name,
          url: `https://www.example.com/laptop/${bigText(2048)}`,
          currency: product.currency,
        }),
        expectedError: createValidationError([
          validationError.tooBig('url', 2048),
        ]),
      },
      {
        name: 'should reject invalid URL format',
        input: (product: Product) => ({
          name: product.name,
          url: 'not-a-valid-url',
          currency: product.currency,
        }),
        expectedError: createValidationError([
          validationError.invalidUrl('url'),
        ]),
      },
      {
        name: 'should reject missing product URL',
        input: (product: Product) =>
          ({
            name: product.name,
            currency: product.currency,
          }) as EditProduct,
        expectedError: createValidationError([
          validationError.requiredString('url'),
        ]),
      },
      {
        name: 'should reject empty product currency',
        input: (product: Product) => ({
          name: product.name,
          url: product.url,
          currency: emptyText,
        }),
        expectedError: createValidationError([
          validationError.tooSmall('currency', 3),
        ]),
      },
      {
        name: 'should reject product currency longer than 3 characters',
        input: (product: Product) => ({
          name: product.name,
          url: product.url,
          currency: bigText(4),
        }),
        expectedError: createValidationError([
          validationError.tooBig('currency', 3),
        ]),
      },
      {
        name: 'should reject missing product currency',
        input: (product: Product) =>
          ({
            url: product.url,
            name: product.name,
          }) as EditProduct,
        expectedError: createValidationError([
          validationError.requiredString('currency'),
        ]),
      },
    ];

    for (const { name, input, expectedError } of testCases) {
      test(name, async () => {
        const product = await addProduct(laptop(store.storeId));
        await editProduct(product.productId, input(product), expectedError);
      });
    }
  });

  test('should return 404 for non-existent product', async () => {
    const nonExistentId = '01940b6d-1234-7890-abcd-ef1234567890';
    await editProduct(
      nonExistentId,
      laptop(store.storeId),
      createNotFoundError(`Product ${nonExistentId} not found`)
    );
  });

  test('should reject invalid UUID format', async () => {
    await editProduct(
      'invalid-uuid',
      laptop(store.storeId),
      createValidationError([validationError.invalidUuid('productId')])
    );
  });
});
