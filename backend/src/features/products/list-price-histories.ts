import { Hono } from 'hono';
import { products, priceHistories } from './product.js';
import { StatusCodes } from 'http-status-codes';
import { paginationSchema, createPage } from '#/pagination.js';
import { zValidator } from '#/validator.js';
import { client } from '#/database/client.js';
import { eq, count, desc } from 'drizzle-orm';
import { productSchema } from './schemas.js';
import { notFoundError } from '#/extensions.js';
const paramSchema = productSchema.pick({ productId: true });

export const listPriceHistoriesRoute = new Hono().get(
  '/:productId/prices',
  zValidator('param', paramSchema),
  zValidator('query', paginationSchema),
  async c => {
    const { productId } = c.req.valid('param');
    const { pageNumber, pageSize } = c.req.valid('query');
    const offset = (pageNumber - 1) * pageSize;

    const existing = await client
      .select()
      .from(products)
      .where(eq(products.productId, productId))
      .limit(1);

    if (existing.length === 0) {
      return notFoundError(c, `Product ${productId} not found`);
    }

    const [{ totalCount }] = await client
      .select({ totalCount: count() })
      .from(priceHistories)
      .where(eq(priceHistories.productId, productId));

    const items = await client
      .select()
      .from(priceHistories)
      .where(eq(priceHistories.productId, productId))
      .orderBy(desc(priceHistories.timestamp))
      .limit(pageSize)
      .offset(offset);

    return c.json(
      createPage(items, totalCount, pageNumber, pageSize),
      StatusCodes.OK
    );
  }
);
