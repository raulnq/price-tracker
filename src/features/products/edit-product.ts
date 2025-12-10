import { Hono } from 'hono';
import { products } from './product.js';
import { StatusCodes } from 'http-status-codes';

export const editRoute = new Hono().put('/:productId', async c => {
  const productId = c.req.param('productId');
  const { name, url, currency } = await c.req.json();

  const product = products.find(p => p.productId === productId);
  if (!product) {
    return c.json(
      { message: `Product ${productId} not found` },
      StatusCodes.NOT_FOUND
    );
  }

  product.name = name;
  product.url = url;
  product.currency = currency;

  return c.json(product, StatusCodes.OK);
});
