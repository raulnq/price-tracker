import { Hono } from 'hono';
import { products, priceHistories, productSchema } from './product.js';
import { StatusCodes } from 'http-status-codes';
import { paginationSchema, createPage } from '@/types/pagination.js';
import { zValidator } from '@/utils/validation.js';
import { createResourceNotFoundPD } from '@/utils/problem-document.js';
import { client } from '@/database/client.js';
import { eq, count } from 'drizzle-orm';

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
      return c.json(
        createResourceNotFoundPD(c.req.path, `Product ${productId} not found`),
        StatusCodes.NOT_FOUND
      );
    }

    const [{ totalCount }] = await client
      .select({ totalCount: count() })
      .from(priceHistories)
      .where(eq(priceHistories.productId, productId));

    const items = await client
      .select()
      .from(priceHistories)
      .where(eq(priceHistories.productId, productId))
      .orderBy(priceHistories.timestamp)
      .limit(pageSize)
      .offset(offset);

    return c.json(
      createPage(items, totalCount, pageNumber, pageSize),
      StatusCodes.OK
    );
  }
);
