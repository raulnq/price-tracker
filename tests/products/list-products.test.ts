import { test, describe } from 'node:test';
import { addProduct, listProducts, laptop, phone } from './products-dsl.js';
import { addStore, wallmart } from '../stores/stores-dsl.js';
import { type Store } from '@/features/stores/store.js';
import assert from 'node:assert';

describe('List Products Endpoint', () => {
  test('should filter products by name', async () => {
    const store = await addStore(wallmart());
    const product = await addProduct(laptop(store.storeId));
    const page = await listProducts({
      pageNumber: 1,
      pageSize: 10,
      name: product.name,
    });

    assert.ok(page);
    assert.ok(page.items.length >= 1);
  });

  test('should filter products by storeId', async () => {
    const store = (await addStore(wallmart())) as Store;
    await addProduct(phone(store.storeId));

    const page = await listProducts({
      pageNumber: 1,
      pageSize: 10,
      storeId: store.storeId,
    });

    assert.ok(page);
    assert.ok(page.items.length >= 1);
  });

  test('should return empty items when no products match filter', async () => {
    const store = await addStore(wallmart());
    await addProduct(laptop(store.storeId));

    const page = await listProducts({
      name: 'nonexistent-product-xyz',
      pageNumber: 1,
      pageSize: 10,
    });

    assert.ok(page);
    assert.strictEqual(page.items.length, 0);
    assert.strictEqual(page.totalCount, 0);
    assert.strictEqual(page.totalPages, 0);
  });

  test('should handle multiple filters together', async () => {
    const store = await addStore(wallmart());
    const product = await addProduct(laptop(store.storeId));

    const page = await listProducts({
      name: product.name,
      storeId: store.storeId,
      pageNumber: 1,
      pageSize: 10,
    });

    assert.ok(page);
    assert.ok(page.items.length >= 1);
  });
});
