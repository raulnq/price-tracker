import { Hono } from 'hono';
import { v7 } from 'uuid';
import { StatusCodes } from 'http-status-codes';
import {
  products,
  priceHistories,
  productSchema,
  priceHistorySchema,
} from './product.js';
import { zValidator } from '@/utils/validation.js';
import { createResourceNotFoundPD } from '@/utils/problem-document.js';
import { client } from '@/database/client.js';
import { eq } from 'drizzle-orm';

const paramSchema = productSchema.pick({ productId: true });
const bodySchema = priceHistorySchema.pick({ price: true });

export const addPriceHistoryRoute = new Hono().post(
  '/:productId/prices',
  zValidator('param', paramSchema),
  zValidator('json', bodySchema),
  async c => {
    const { productId } = c.req.valid('param');
    const { price } = c.req.valid('json');

    const [product] = await client
      .select()
      .from(products)
      .where(eq(products.productId, productId))
      .limit(1);

    if (!product) {
      return c.json(
        createResourceNotFoundPD(c.req.path, `Product ${productId} not found`),
        StatusCodes.NOT_FOUND
      );
    }

    const timestamp = new Date();
    const [priceHistory] = await client
      .insert(priceHistories)
      .values({
        priceHistoryId: v7(),
        productId,
        timestamp,
        price: price.toString(),
      })
      .returning();

    let priceChangePercentage = 0;
    if (product.currentPrice) {
      const currentPrice = product.currentPrice;
      if (currentPrice > 0) {
        const priceChange = price - currentPrice;
        priceChangePercentage = (priceChange / currentPrice) * 100;
      }
    }

    await client
      .update(products)
      .set({
        currentPrice: price,
        priceChangePercentage: priceChangePercentage,
        lastUpdated: timestamp,
      })
      .where(eq(products.productId, productId));

    return c.json(priceHistory, StatusCodes.CREATED);
  }
);
