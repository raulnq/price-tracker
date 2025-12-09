import { Hono } from 'hono';
import { stores } from './store.js';
import { StatusCodes } from 'http-status-codes';

export const listRoute = new Hono().get('/', async c => {
  const { pageNumber, pageSize, name } = c.req.query();
  const pn = parseInt(pageNumber || '1', 10);
  const pz = parseInt(pageSize || '10', 10);
  let filteredStores = stores;

  if (name) {
    filteredStores = stores.filter(store =>
      store.name.toLowerCase().includes(name.toLowerCase())
    );
  }
  const totalCount = filteredStores.length;
  const startIndex = (pn - 1) * pz;
  const endIndex = startIndex + pz;
  const page = filteredStores.slice(startIndex, endIndex);
  return c.json(
    {
      items: page,
      pageNumber: pn,
      pageSize: pz,
      totalPages: Math.ceil(totalCount / pz),
      totalCount,
    },
    StatusCodes.OK
  );
});
