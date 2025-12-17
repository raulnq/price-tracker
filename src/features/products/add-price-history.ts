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
import { z } from 'zod';

const paramSchema = productSchema.pick({ productId: true });
const bodySchema = priceHistorySchema.pick({ price: true });
export type AddPriceHistory = z.infer<typeof bodySchema>;
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

    const priceHistory = await client.transaction(async tx => {
      const [priceHistory] = await tx
        .insert(priceHistories)
        .values({
          priceHistoryId: v7(),
          productId,
          timestamp,
          price: price,
        })
        .returning();

      const currentPrice = product.currentPrice;
      let priceChangePercentage = 0;
      if (
        currentPrice !== null &&
        currentPrice !== undefined &&
        currentPrice > 0
      ) {
        priceChangePercentage = ((price - currentPrice) / currentPrice) * 100;
      }

      await tx
        .update(products)
        .set({
          currentPrice: price,
          priceChangePercentage,
          lastUpdated: timestamp,
        })
        .where(eq(products.productId, productId));

      return priceHistory;
    });

    return c.json(priceHistory, StatusCodes.CREATED);
  }
);
