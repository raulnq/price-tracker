import { Hono } from 'hono';
import { products } from './product.js';
import { StatusCodes } from 'http-status-codes';

export const getRoute = new Hono().get('/:productId', async c => {
  const productId = c.req.param('productId');
  const product = products.find(p => p.productId === productId);
  if (!product) {
    return c.json(
      { message: `Product ${productId} not found` },
      StatusCodes.NOT_FOUND
    );
  }
  return c.json(product, StatusCodes.OK);
});
