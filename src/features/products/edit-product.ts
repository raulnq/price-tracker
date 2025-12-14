import { Hono } from 'hono';
import { products, productSchema } from './product.js';
import { StatusCodes } from 'http-status-codes';
import { zValidator } from '@/utils/validation.js';
import { createResourceNotFoundPD } from '@/utils/problem-document.js';
import { client } from '@/database/client.js';
import { eq } from 'drizzle-orm';

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
    const data = c.req.valid('json');

    const existing = await client
      .select()
      .from(products)
      .where(eq(products.productId, productId))
      .limit(1);

    if (existing.length === 0) {
      return c.json(
        createResourceNotFoundPD(c.req.path, `Product ${productId} not found`),
        StatusCodes.NOT_FOUND
      );
    }

    const [product] = await client
      .update(products)
      .set({ ...data, lastUpdated: new Date() })
      .where(eq(products.productId, productId))
      .returning();

    return c.json(product, StatusCodes.OK);
  }
);
