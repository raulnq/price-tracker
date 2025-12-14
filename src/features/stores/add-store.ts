import { Hono } from 'hono';
import { v7 } from 'uuid';
import { StatusCodes } from 'http-status-codes';
import { stores, storeSchema } from './store.js';
import { zValidator } from '@/utils/validation.js';
import { client } from '@/database/client.js';

const schema = storeSchema.omit({ storeId: true });

export const addRoute = new Hono().post(
  '/',
  zValidator('json', schema),
  async c => {
    const data = c.req.valid('json');
    const [store] = await client
      .insert(stores)
      .values({ ...data, storeId: v7() })
      .returning();
    return c.json(store, StatusCodes.CREATED);
  }
);
