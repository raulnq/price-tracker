import { Hono } from 'hono';
import { stores } from './store.js';
import { StatusCodes } from 'http-status-codes';

export const editRoute = new Hono().put('/:storeId', async c => {
  const storeId = c.req.param('storeId');
  const { name, url } = await c.req.json();
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
});
