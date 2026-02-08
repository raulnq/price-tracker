import { Hono } from 'hono';
import { v7 } from 'uuid';
import { StatusCodes } from 'http-status-codes';
import { products } from './product.js';
import { zValidator } from '#/validator.js';
import { stores } from '#/features/stores/store.js';
import { client } from '#/database/client.js';
import { eq } from 'drizzle-orm';
import { addProductSchema } from './schemas.js';
import { notFoundError } from '#/extensions.js';

export const addRoute = new Hono().post(
  '/',
  zValidator('json', addProductSchema),
  async c => {
    const data = c.req.valid('json');

    const [store] = await client
      .select()
      .from(stores)
      .where(eq(stores.storeId, data.storeId))
      .limit(1);
    if (!store) {
      return notFoundError(c, `Store ${data.storeId} not found`);
    }

    const [product] = await client
      .insert(products)
      .values({ ...data, productId: v7() })
      .returning();

    return c.json(product, StatusCodes.CREATED);
  }
);
