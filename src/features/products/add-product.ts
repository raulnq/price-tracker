import { Hono } from 'hono';
import { v7 } from 'uuid';
import { StatusCodes } from 'http-status-codes';
import { products, productSchema } from './product.js';
import { zValidator } from '@hono/zod-validator';
import { stores } from '@/features/stores/store.js';

const schema = productSchema.omit({
  productId: true,
  currentPrice: true,
  priceChangePercentage: true,
  lastUpdated: true,
});

export const addRoute = new Hono().post(
  '/',
  zValidator('json', schema),
  async c => {
    const { storeId, name, url, currency } = c.req.valid('json');

    const store = stores.find(s => s.storeId === storeId);
    if (!store) {
      return c.json(
        { message: `Store ${storeId} not found` },
        StatusCodes.NOT_FOUND
      );
    }

    const product = {
      storeId,
      productId: v7(),
      name,
      url,
      currency,
    };

    products.push(product);
    return c.json(product, StatusCodes.CREATED);
  }
);
