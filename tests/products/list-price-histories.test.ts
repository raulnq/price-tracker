import { test, describe } from 'node:test';
import {
  addProduct,
  laptop,
  addPriceHistory,
  listPriceHistories,
  newPriceHistory,
  assertPriceHistory,
} from './products-dsl.js';
import { addStore, wallmart } from '../stores/stores-dsl.js';
import { assertPage } from '../assertions.js';

describe('List Price Histories Endpoint', async () => {
  const store = await addStore(wallmart());

  test('should return empty list when product has no price history', async () => {
    const product = await addProduct(laptop(store.storeId));
    const result = await listPriceHistories(product.productId, {
      pageNumber: 1,
      pageSize: 10,
    });

    assertPage(result).hasEmptyResult();
  });

  test('should return price histories for a product', async () => {
    const product = await addProduct(laptop(store.storeId));

    const priceHistory = await addPriceHistory(
      product.productId,
      newPriceHistory()
    );

    const result = await listPriceHistories(product.productId, {
      pageNumber: 1,
      pageSize: 10,
    });

    assertPage(result).hasItemsCount(1);
    assertPriceHistory(result.items[0]).isTheSameOf(priceHistory);
  });
});
