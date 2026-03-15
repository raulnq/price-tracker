import { Hono } from 'hono';
import { products, priceHistories } from './product.js';
import { zValidator } from '#/validator.js';
import { client } from '#/database/client.js';
import { eq, lt } from 'drizzle-orm';
import { productSchema, type Product } from './schemas.js';
import { notFoundError } from '#/extensions.js';
import { z } from 'zod';

const paramSchema = productSchema.pick({ productId: true });

const querySchema = z.object({
  days: z.coerce.number().int().min(0).optional().default(30),
});

export const deleteOldPriceHistoriesRoute = new Hono().delete(
  '/:productId/prices',
  zValidator('param', paramSchema),
  zValidator('query', querySchema),
  async c => {
    const { productId } = c.req.valid('param');
    const { days } = c.req.valid('query');

    const [product] = await client
      .select()
      .from(products)
      .where(eq(products.productId, productId))
      .limit(1);

    if (!product) {
      return notFoundError(c, `Product ${productId} not found`);
    }

    const result = await deleteOldPriceHistories(product, days);

    return c.json({ deletedCount: result.deletedCount });
  }
);

export interface DeleteOldPriceHistoriesResult {
  deletedCount: number;
}

export const deleteOldPriceHistories = async (
  product: Product,
  days: number
): Promise<DeleteOldPriceHistoriesResult> => {
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - days);

  const result = await client
    .delete(priceHistories)
    .where(
      eq(priceHistories.productId, product.productId) &&
        lt(priceHistories.timestamp, cutoffDate)
    )
    .returning({ deletedId: priceHistories.priceHistoryId });

  return { deletedCount: result.length };
};
