import { Hono } from 'hono';
import { products, priceHistories, productSchema } from './product.js';
import { StatusCodes } from 'http-status-codes';
import { paginationSchema, createPage } from '@/types/pagination.js';
import { zValidator } from '@hono/zod-validator';

const paramSchema = productSchema.pick({ productId: true });

export const listPriceHistoriesRoute = new Hono().get(
  '/:productId/prices',
  zValidator('param', paramSchema),
  zValidator('query', paginationSchema),
  async c => {
    const { productId } = c.req.valid('param');
    const { pageNumber, pageSize } = c.req.valid('query');

    const product = products.find(p => p.productId === productId);
    if (!product) {
      return c.json(
        { message: `Product ${productId} not found` },
        StatusCodes.NOT_FOUND
      );
    }

    const filteredPriceHistories = priceHistories.filter(
      ph => ph.productId === productId
    );

    const totalCount = filteredPriceHistories.length;
    const startIndex = (pageNumber - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const page = filteredPriceHistories.slice(startIndex, endIndex);
    return c.json(
      createPage(page, totalCount, pageNumber, pageSize),
      StatusCodes.OK
    );
  }
);
