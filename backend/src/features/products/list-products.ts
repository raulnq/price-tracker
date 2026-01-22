import { Hono } from 'hono';
import { products, productSchema } from './product.js';
import { stores } from '#/features/stores/store.js';
import { StatusCodes } from 'http-status-codes';
import { paginationSchema, createPage } from '#/types/pagination.js';
import { z } from 'zod';
import { zValidator } from '#/utils/validation.js';
import { client } from '#/database/client.js';
import { like, count, SQL, and, eq } from 'drizzle-orm';

const schema = paginationSchema.extend({
  name: z.string().optional(),
  storeId: z.uuidv7().optional(),
});

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const responseSchema = productSchema.extend({
  storeName: z.string(),
});
export type ListProducts = z.infer<typeof schema>;

export type ListProductsResponse = z.infer<typeof responseSchema>;

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
      .select({
        productId: products.productId,
        storeId: products.storeId,
        storeName: stores.name,
        name: products.name,
        url: products.url,
        currentPrice: products.currentPrice,
        priceChangePercentage: products.priceChangePercentage,
        lastUpdated: products.lastUpdated,
        currency: products.currency,
      })
      .from(products)
      .innerJoin(stores, eq(products.storeId, stores.storeId))
      .where(and(...filters))
      .limit(pageSize)
      .offset(offset);

    return c.json(
      createPage(items, totalCount, pageNumber, pageSize),
      StatusCodes.OK
    );
  }
);
