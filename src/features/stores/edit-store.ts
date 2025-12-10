import { Hono } from 'hono';
import { StatusCodes } from 'http-status-codes';
import { stores, storeSchema } from './store.js';
import { zValidator } from '@hono/zod-validator';

const paramSchema = storeSchema.pick({ storeId: true });
const bodySchema = storeSchema.pick({ name: true, url: true });

export const editRoute = new Hono().put(
  '/:storeId',
  zValidator('param', paramSchema),
  zValidator('json', bodySchema),
  async c => {
    const { storeId } = c.req.valid('param');
    const { name, url } = c.req.valid('json');
    const store = stores.find(s => s.storeId === storeId);
    if (!store) {
      return c.json(
        { message: `Store ${storeId} not found` },
        StatusCodes.NOT_FOUND
      );
    }
    store.name = name;
    store.url = url;
    return c.json(store, StatusCodes.OK);
  }
);
