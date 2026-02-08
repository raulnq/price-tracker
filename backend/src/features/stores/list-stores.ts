import { Hono } from 'hono';
import { stores } from './store.js';
import { StatusCodes } from 'http-status-codes';
import { createPage } from '#/pagination.js';
import { zValidator } from '#/validator.js';
import { client } from '#/database/client.js';
import { like, count, SQL, and } from 'drizzle-orm';
import { listStoresSchema } from './schemas.js';

export const listRoute = new Hono().get(
  '/',
  zValidator('query', listStoresSchema),
  async c => {
    const { pageNumber, pageSize, name } = c.req.valid('query');
    const filters: SQL[] = [];
    const offset = (pageNumber - 1) * pageSize;
    if (name) filters.push(like(stores.name, `%${name}%`));

    const [{ totalCount }] = await client
      .select({ totalCount: count() })
      .from(stores)
      .where(and(...filters));

    const items = await client
      .select()
      .from(stores)
      .where(and(...filters))
      .limit(pageSize)
      .offset(offset);
    return c.json(
      createPage(items, totalCount, pageNumber, pageSize),
      StatusCodes.OK
    );
  }
);
