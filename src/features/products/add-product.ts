import { Hono } from 'hono';
import { v7 } from 'uuid';
import { StatusCodes } from 'http-status-codes';
import { products, type Product } from './product.js';

export const addRoute = new Hono().post('/', async c => {
  const { storeId, name, url, currency } = await c.req.json();

  const product: Product = {
    storeId,
    productId: v7(),
    name,
    url,
    currency,
  };

  products.push(product);
  return c.json(product, StatusCodes.CREATED);
});
