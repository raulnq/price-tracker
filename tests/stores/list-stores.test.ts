import { test, describe } from 'node:test';
import { addStore, listStores, wallmart } from './stores-dsl.js';
import assert from 'node:assert';

describe('List Stores Endpoint', () => {
  test('should filter stores by name', async () => {
    const store = await addStore(wallmart());

    const page = await listStores({
      name: store.name,
      pageSize: 10,
      pageNumber: 1,
    });

    assert.ok(page);
    assert.ok(page.items.length >= 1);
  });

  test('should return empty items when no stores match filter', async () => {
    const page = await listStores({
      name: 'nonexistent-store-xyz',
      pageSize: 10,
      pageNumber: 1,
    });

    assert.ok(page);
    assert.strictEqual(page.items.length, 0);
    assert.strictEqual(page.totalCount, 0);
    assert.strictEqual(page.totalPages, 0);
  });
});
