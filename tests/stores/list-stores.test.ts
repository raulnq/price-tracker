import { test, describe } from 'node:test';
import { addStore, assertStore, listStores, wallmart } from './stores-dsl.js';
import { assertPage } from '../assertions.js';

describe('List Stores Endpoint', () => {
  test('should filter stores by name', async () => {
    const store = await addStore(wallmart());

    const page = await listStores({
      name: store.name,
      pageSize: 10,
      pageNumber: 1,
    });

    assertPage(page).hasItemsCount(1);
    assertStore(page.items[0]).isTheSameOf(store);
  });

  test('should return empty items when no stores match filter', async () => {
    const page = await listStores({
      name: 'nonexistent-store-xyz',
      pageSize: 10,
      pageNumber: 1,
    });

    assertPage(page).hasEmptyResult();
  });
});
