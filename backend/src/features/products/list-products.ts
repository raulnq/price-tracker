import { Hono } from 'hono';
import { products } from './product.js';
import { StatusCodes } from 'http-status-codes';
import { paginationSchema, createPage } from '@/types/pagination.js';
import { z } from 'zod';
import { zValidator } from '@/utils/validation.js';
import { client } from '@/database/client.js';
import { like, count, SQL, and, eq } from 'drizzle-orm';

const schema = paginationSchema.extend({
  name: z.string().optional(),
  storeId: z.uuidv7().optional(),
});
export type ListProducts = z.infer<typeof schema>;
export const listRoute = new Hono().get(
  '/',
  zValidator('query', schema),
  async c => {
    const { pageNumber, pageSize, name, storeId } = c.req.valid('query');
    const filters: SQL[] = [];
    const offset = (pageNumber - 1) * pageSize;

    if (name) filters.push(like(products.name, `%${name}%`));
    if (storeId) filters.push(eq(products.storeId, storeId));

    const [{ totalCount }] = await client
      .select({ totalCount: count() })
      .from(products)
      .where(and(...filters));

    const items = await client
      .select()
      .from(products)
      .where(and(...filters))
      .limit(pageSize)
      .offset(offset);

    return c.json(
      createPage(items, totalCount, pageNumber, pageSize),
      StatusCodes.OK
    );
  }
);
