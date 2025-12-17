import { test, describe } from 'node:test';
import {
  addProduct,
  listProducts,
  laptop,
  phone,
  assertProduct,
} from './products-dsl.js';
import { addStore, wallmart } from '../stores/stores-dsl.js';
import { assertPage } from '../assertions.js';

describe('List Products Endpoint', () => {
  test('should filter products by name', async () => {
    const store = await addStore(wallmart());
    const product = await addProduct(laptop(store.storeId));
    const page = await listProducts({
      pageNumber: 1,
      pageSize: 10,
      name: product.name,
    });

    assertPage(page).hasItemsCount(1);
    assertProduct(page.items[0]).isTheSameOf(product);
  });

  test('should filter products by storeId', async () => {
    const store = await addStore(wallmart());
    const product = await addProduct(phone(store.storeId));

    const page = await listProducts({
      pageNumber: 1,
      pageSize: 10,
      storeId: store.storeId,
    });

    assertPage(page).hasItemsCount(1);
    assertProduct(page.items[0]).isTheSameOf(product);
  });

  test('should return empty items when no products match filter', async () => {
    const store = await addStore(wallmart());
    await addProduct(laptop(store.storeId));

    const page = await listProducts({
      name: 'nonexistent-product-xyz',
      pageNumber: 1,
      pageSize: 10,
    });

    assertPage(page).hasEmptyResult();
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

    assertPage(page).hasItemsCount(1);
    assertProduct(page.items[0]).isTheSameOf(product);
  });
});
