import { Hono } from 'hono';
import { v7 } from 'uuid';
import { StatusCodes } from 'http-status-codes';
import { products, productSchema } from './product.js';
import { zValidator } from '@/utils/validation.js';
import { stores } from '@/features/stores/store.js';
import { createResourceNotFoundPD } from '@/utils/problem-document.js';

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
    const data = c.req.valid('json');

    const store = stores.find(s => s.storeId === data.storeId);
    if (!store) {
      return c.json(
        createResourceNotFoundPD(c.req.path, `Store ${data.storeId} not found`),
        StatusCodes.NOT_FOUND
      );
    }

    const product = {
      ...data,
      productId: v7(),
    };

    products.push(product);
    return c.json(product, StatusCodes.CREATED);
  }
);
