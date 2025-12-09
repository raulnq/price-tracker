import { Hono } from 'hono';
import { v7 } from 'uuid';
import { StatusCodes } from 'http-status-codes';
import { stores } from './store.js';

export const addRoute = new Hono().post('/', async c => {
  const { name, url } = await c.req.json();
  const store = { name, url, storeId: v7() };
  stores.push(store);
  return c.json(store, StatusCodes.CREATED);
});
