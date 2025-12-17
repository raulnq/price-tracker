import { test, describe } from 'node:test';
import {
  addProduct,
  laptop,
  addPriceHistory,
  getProduct,
  newPriceHistory,
  assertPriceHistory,
  assertProduct,
} from './products-dsl.js';
import { addStore, wallmart } from '../stores/stores-dsl.js';
import { createValidationError, validationError } from '../errors.js';
import type { AddPriceHistory } from '@/features/products/add-price-history.js';

describe('Add Price History Endpoint', async () => {
  const store = await addStore(wallmart());

  test('should create a new price history with valid data', async () => {
    const entry = newPriceHistory();
    const product = await addProduct(laptop(store.storeId));
    const priceHistory = await addPriceHistory(product.productId, entry);
    assertPriceHistory(priceHistory)
      .hasPrice(entry.price)
      .hasProductId(product.productId)
      .hasTimestamp()
      .hasPriceHistoryId();

    const productAfterFirst = await getProduct(product.productId);
    assertProduct(productAfterFirst)
      .hasCurrentPrice(entry.price)
      .hasPriceChangePercentage(0)
      .hasLastUpdated();
  });

  test('should calculate priceChangePercentage when adding second price', async () => {
    const product = await addProduct(laptop(store.storeId));

    await addPriceHistory(product.productId, { price: 100 });
    await addPriceHistory(product.productId, { price: 150 });

    const updatedProduct = await getProduct(product.productId);
    assertProduct(updatedProduct)
      .hasCurrentPrice(150)
      .hasPriceChangePercentage(50);
  });

  test('should calculate negative priceChangePercentage when price decreases', async () => {
    const product = await addProduct(laptop(store.storeId));

    await addPriceHistory(product.productId, { price: 200 });
    await addPriceHistory(product.productId, { price: 150 });

    const updatedProduct = await getProduct(product.productId);
    assertProduct(updatedProduct)
      .hasCurrentPrice(150)
      .hasPriceChangePercentage(-25);
  });

  describe('Property validations', async () => {
    const testCases = [
      {
        name: 'should reject zero price',
        input: { price: 0 },
        expectedError: createValidationError([
          validationError.notPositive('price'),
        ]),
      },
      {
        name: 'should reject negative price',
        input: { price: -10 },
        expectedError: createValidationError([
          validationError.notPositive('price'),
        ]),
      },
      {
        name: 'should reject missing price',
        input: {} as AddPriceHistory,
        expectedError: createValidationError([
          validationError.requiredNumber('price'),
        ]),
      },
    ];

    for (const { name, input, expectedError } of testCases) {
      test(name, async () => {
        const product = await addProduct(laptop(store.storeId));
        await addPriceHistory(product.productId, input, expectedError);
      });
    }
  });
});
