import { test, describe, beforeEach } from 'node:test';
import assert from 'node:assert';
import { testClient } from 'hono/testing';
import { app } from '#/app.js';
import { StatusCodes } from 'http-status-codes';
import {
  addProduct,
  laptop,
  addPriceHistory,
  deleteOldPriceHistories,
  listPriceHistories,
} from './products-dsl.js';
import { addStore, wallmart } from '../stores/stores-dsl.js';

describe('Delete Old Price Histories Endpoint', async () => {
  const store = await addStore(wallmart());
  let productId: string;

  beforeEach(async () => {
    const product = await addProduct(laptop(store.storeId));
    assert.ok('productId' in product);
    productId = product.productId;
  });

  test('should delete price histories older than specified days', async () => {
    await addPriceHistory(productId, { price: 100 });
    await addPriceHistory(productId, { price: 150 });

    const result = await deleteOldPriceHistories(productId, 0);

    const remaining = await listPriceHistories(productId, {
      pageNumber: 1,
      pageSize: 10,
    });

    assert.ok(result.deletedCount >= 2);
    assert.strictEqual(remaining.items.length, 0);
  });

  test('should only delete old price histories with days parameter', async () => {
    await addPriceHistory(productId, { price: 100 });
    await addPriceHistory(productId, { price: 150 });

    const result = await deleteOldPriceHistories(productId, 365);

    const remaining = await listPriceHistories(productId, {
      pageNumber: 1,
      pageSize: 10,
    });

    assert.strictEqual(result.deletedCount, 0);
    assert.strictEqual(remaining.items.length, 2);
  });

  test('should use default 30 days when not specified', async () => {
    await addPriceHistory(productId, { price: 100 });
    await addPriceHistory(productId, { price: 150 });

    const result = await deleteOldPriceHistories(productId);

    const remaining = await listPriceHistories(productId, {
      pageNumber: 1,
      pageSize: 10,
    });

    assert.strictEqual(result.deletedCount, 0);
    assert.strictEqual(remaining.items.length, 2);
  });

  test('should return 404 for non-existent product', async () => {
    const nonExistentProductId = '01940b6d-1234-7890-abcd-ef1234567890';
    const client = testClient(app);
    const response = await client.api.products[':productId'].prices.$delete({
      param: { productId: nonExistentProductId },
      query: {},
    });

    assert.strictEqual(response.status, StatusCodes.NOT_FOUND);
  });
});
