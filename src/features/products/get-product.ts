import { Hono } from 'hono';
import { products, productSchema } from './product.js';
import { StatusCodes } from 'http-status-codes';
import { zValidator } from '@hono/zod-validator';

const schema = productSchema.pick({ productId: true });

export const getRoute = new Hono().get(
  '/:productId',
  zValidator('param', schema),
  async c => {
    const { productId } = c.req.valid('param');
    const product = products.find(p => p.productId === productId);
    if (!product) {
      return c.json(
        { message: `Product ${productId} not found` },
        StatusCodes.NOT_FOUND
      );
    }
    return c.json(product, StatusCodes.OK);
  }
);
