import { Hono } from 'hono';
import { v7 } from 'uuid';
import { StatusCodes } from 'http-status-codes';
import { stores } from './store.js';
import { zValidator } from '#/utils/validation.js';
import { client } from '#/database/client.js';
import { addStoreSchema } from './schemas.js';

export const addRoute = new Hono().post(
  '/',
  zValidator('json', addStoreSchema),
  async c => {
    const data = c.req.valid('json');
    const [store] = await client
      .insert(stores)
      .values({ ...data, storeId: v7() })
      .returning();
    return c.json(store, StatusCodes.CREATED);
  }
);
