import { Hono } from 'hono';
import { products } from './product.js';
import { StatusCodes } from 'http-status-codes';
import { zValidator } from '#/validator.js';
import { client } from '#/database/client.js';
import { eq } from 'drizzle-orm';
import { editProductSchema, productSchema } from './schemas.js';
import { notFoundError } from '#/extensions.js';

const paramSchema = productSchema.pick({ productId: true });

export const editRoute = new Hono().put(
  '/:productId',
  zValidator('param', paramSchema),
  zValidator('json', editProductSchema),
  async c => {
    const { productId } = c.req.valid('param');
    const data = c.req.valid('json');

    const existing = await client
      .select()
      .from(products)
      .where(eq(products.productId, productId))
      .limit(1);

    if (existing.length === 0) {
      return notFoundError(c, `Product ${productId} not found`);
    }

    const [product] = await client
      .update(products)
      .set({ ...data, lastUpdated: new Date() })
      .where(eq(products.productId, productId))
      .returning();

    return c.json(product, StatusCodes.OK);
  }
);
