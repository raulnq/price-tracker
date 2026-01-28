import { Hono } from 'hono';
import { v7 } from 'uuid';
import { StatusCodes } from 'http-status-codes';
import { products, priceHistories } from './product.js';
import { zValidator } from '#/utils/validation.js';
import { createResourceNotFoundPD } from '#/utils/problem-document.js';
import { client } from '#/database/client.js';
import { eq } from 'drizzle-orm';
import {
  addPriceHistorySchema,
  productSchema,
  type PriceHistory,
  type Product,
} from './schemas.js';

const paramSchema = productSchema.pick({ productId: true });
export const addPriceHistoryRoute = new Hono().post(
  '/:productId/prices',
  zValidator('param', paramSchema),
  zValidator('json', addPriceHistorySchema),
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

    const result = await addPriceHistory(product, price);

    return c.json(result.priceHistory, StatusCodes.CREATED);
  }
);

export type AddPriceHistoryResult = {
  priceHistory: PriceHistory;
  priceChangePercentage: number;
  previousPrice: number | null;
};

export const addPriceHistory = async (
  product: Product,
  price: number
): Promise<AddPriceHistoryResult> => {
  const timestamp = new Date();
  const previousPrice = product.currentPrice;
  let priceChangePercentage = 0;
  const priceHistory = await client.transaction(async tx => {
    const [priceHistory] = await tx
      .insert(priceHistories)
      .values({
        priceHistoryId: v7(),
        productId: product.productId,
        timestamp,
        price: price,
      })
      .returning();

    if (previousPrice !== null && previousPrice > 0) {
      priceChangePercentage = ((price - previousPrice) / previousPrice) * 100;
    }

    await tx
      .update(products)
      .set({
        currentPrice: price,
        priceChangePercentage,
        lastUpdated: timestamp,
      })
      .where(eq(products.productId, product.productId));

    return priceHistory;
  });

  return {
    priceHistory,
    priceChangePercentage,
    previousPrice,
  };
};
