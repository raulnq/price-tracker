import { Hono } from 'hono';
import { products, productSchema } from './product.js';
import { StatusCodes } from 'http-status-codes';
import { zValidator } from '@/utils/validation.js';
import { createResourceNotFoundPD } from '@/utils/problem-document.js';

const paramSchema = productSchema.pick({ productId: true });
const bodySchema = productSchema.pick({
  name: true,
  url: true,
  currency: true,
});

export const editRoute = new Hono().put(
  '/:productId',
  zValidator('param', paramSchema),
  zValidator('json', bodySchema),
  async c => {
    const { productId } = c.req.valid('param');
    const { name, url, currency } = c.req.valid('json');

    const product = products.find(p => p.productId === productId);
    if (!product) {
      return c.json(
        createResourceNotFoundPD(c.req.path, `Product ${productId} not found`),
        StatusCodes.NOT_FOUND
      );
    }

    product.name = name;
    product.url = url;
    product.currency = currency;
    product.lastUpdated = new Date();

    return c.json(product, StatusCodes.OK);
  }
);
