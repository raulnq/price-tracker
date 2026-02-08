import { Hono } from 'hono';
import { stores } from './store.js';
import { StatusCodes } from 'http-status-codes';
import { zValidator } from '#/validator.js';
import { client } from '#/database/client.js';
import { eq } from 'drizzle-orm';
import { storeSchema } from './schemas.js';
import { notFoundError } from '#/extensions.js';

const schema = storeSchema.pick({ storeId: true });

export const getRoute = new Hono().get(
  '/:storeId',
  zValidator('param', schema),
  async c => {
    const { storeId } = c.req.valid('param');
    const [store] = await client
      .select()
      .from(stores)
      .where(eq(stores.storeId, storeId))
      .limit(1);
    if (!store) {
      return notFoundError(c, `Store ${storeId} not found`);
    }
    return c.json(store, StatusCodes.OK);
  }
);
