import { Hono } from 'hono';
import { v7 } from 'uuid';
import { StatusCodes } from 'http-status-codes';
import { products, productSchema } from './product.js';
import { zValidator } from '@hono/zod-validator';

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
