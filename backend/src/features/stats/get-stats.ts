import { Hono } from 'hono';
import { products } from '#/features/products/product.js';
import { stores } from '#/features/stores/store.js';
import { StatusCodes } from 'http-status-codes';
import { z } from 'zod';
import { zValidator } from '#/utils/validation.js';
import { client } from '#/database/client.js';
import { count, and, lt, gt, gte, eq, desc } from 'drizzle-orm';
import { storeSchema } from '../stores/schemas.js';
import { productSchema } from '../products/schemas.js';

const schema = z.object({
  days: z.coerce.number().int().positive().optional().default(30),
  recentCount: z.coerce.number().int().positive().max(20).optional().default(5),
});

export type GetStats = z.infer<typeof schema>;

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const responseSchema = z.object({
  totalStores: z.number(),
  totalProducts: z.number(),
  priceDrops: z.number(),
  priceIncreases: z.number(),
  recentProducts: z.array(
    productSchema.extend({
      storeName: z.string(),
    })
  ),
  recentStores: z.array(storeSchema),
});

export type GetStatsResponse = z.infer<typeof responseSchema>;

export const getStatsRoute = new Hono().get(
  '/',
  zValidator('query', schema),
  async c => {
    const { days, recentCount } = c.req.valid('query');

    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);

    const [
      [{ totalStores }],
      [{ totalProducts }],
      [{ priceDrops }],
      [{ priceIncreases }],
      recentProducts,
      recentStores,
    ] = await Promise.all([
      client.select({ totalStores: count() }).from(stores),
      client.select({ totalProducts: count() }).from(products),
      client
        .select({ priceDrops: count() })
        .from(products)
        .where(
          and(
            lt(products.priceChangePercentage, 0),
            gte(products.lastUpdated, cutoffDate)
          )
        ),
      client
        .select({ priceIncreases: count() })
        .from(products)
        .where(
          and(
            gt(products.priceChangePercentage, 0),
            gte(products.lastUpdated, cutoffDate)
          )
        ),
      client
        .select({
          productId: products.productId,
          storeId: products.storeId,
          name: products.name,
          url: products.url,
          currentPrice: products.currentPrice,
          priceChangePercentage: products.priceChangePercentage,
          lastUpdated: products.lastUpdated,
          currency: products.currency,
          storeName: stores.name,
        })
        .from(products)
        .innerJoin(stores, eq(products.storeId, stores.storeId))
        .orderBy(desc(products.lastUpdated))
        .limit(recentCount),
      client
        .select({
          storeId: stores.storeId,
          name: stores.name,
          url: stores.url,
        })
        .from(stores)
        .orderBy(desc(stores.storeId))
        .limit(recentCount),
    ]);

    const response: GetStatsResponse = {
      totalStores,
      totalProducts,
      priceDrops,
      priceIncreases,
      recentProducts,
      recentStores,
    };

    return c.json(response, StatusCodes.OK);
  }
);
