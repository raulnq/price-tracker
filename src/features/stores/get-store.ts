import { Hono } from 'hono';
import { stores, storeSchema } from './store.js';
import { StatusCodes } from 'http-status-codes';
import { zValidator } from '@hono/zod-validator';

const schema = storeSchema.pick({ storeId: true });

export const getRoute = new Hono().get(
  '/:storeId',
  zValidator('param', schema),
  async c => {
    const { storeId } = c.req.valid('param');
    const store = stores.find(s => s.storeId === storeId);
    if (!store) {
      return c.json(
        { message: `Store ${storeId} not found` },
        StatusCodes.NOT_FOUND
      );
    }
    return c.json(store, StatusCodes.OK);
  }
);
