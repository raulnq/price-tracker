import { Hono } from 'hono';
import { stores } from './store.js';
import { StatusCodes } from 'http-status-codes';
import { paginationSchema, createPage } from '@/types/pagination.js';
import { z } from 'zod';
import { zValidator } from '@/utils/validation.js';

const schema = paginationSchema.extend({
  name: z.string().optional(),
});

export const listRoute = new Hono().get(
  '/',
  zValidator('query', schema),
  async c => {
    const { pageNumber, pageSize, name } = c.req.valid('query');
    const pn = pageNumber;
    const pz = pageSize;
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
    return c.json(createPage(page, totalCount, pn, pz), StatusCodes.OK);
  }
);
