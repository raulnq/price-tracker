import { Hono } from 'hono';
import { stores } from './store.js';
import { StatusCodes } from 'http-status-codes';

export const getRoute = new Hono().get('/:storeId', async c => {
  const storeId = c.req.param('storeId');
  const store = stores.find(s => s.storeId === storeId);
  if (!store) {
    return c.json(
      { message: `Store ${storeId} not found` },
      StatusCodes.NOT_FOUND
    );
  }
  return c.json(store, StatusCodes.OK);
});
