import { Hono } from 'hono';
import { products } from './product.js';
import { stores } from '#/features/stores/store.js';
import { StatusCodes } from 'http-status-codes';
import { createPage } from '#/pagination.js';
import { zValidator } from '#/validator.js';
import { client } from '#/database/client.js';
import { like, count, SQL, and, eq } from 'drizzle-orm';
import { listProductsSchema } from './schemas.js';

export const listRoute = new Hono().get(
  '/',
  zValidator('query', listProductsSchema),
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
