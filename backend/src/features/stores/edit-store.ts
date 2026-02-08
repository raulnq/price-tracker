import { Hono } from 'hono';
import { StatusCodes } from 'http-status-codes';
import { stores } from './store.js';
import { zValidator } from '#/validator.js';
import { client } from '#/database/client.js';
import { eq } from 'drizzle-orm';
import { editStoreSchema, storeSchema } from './schemas.js';
import { notFoundError } from '#/extensions.js';

const paramSchema = storeSchema.pick({ storeId: true });

export const editRoute = new Hono().put(
  '/:storeId',
  zValidator('param', paramSchema),
  zValidator('json', editStoreSchema),
  async c => {
    const { storeId } = c.req.valid('param');
    const data = c.req.valid('json');
    const existing = await client
      .select()
      .from(stores)
      .where(eq(stores.storeId, storeId))
      .limit(1);

    if (existing.length === 0) {
      return notFoundError(c, `Store ${storeId} not found`);
    }
    const [store] = await client
      .update(stores)
      .set(data)
      .where(eq(stores.storeId, storeId))
      .returning();
    return c.json(store, StatusCodes.OK);
  }
);
