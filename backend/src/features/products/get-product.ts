import { Hono } from 'hono';
import { products } from './product.js';
import { stores } from '#/features/stores/store.js';
import { StatusCodes } from 'http-status-codes';
import { zValidator } from '#/validator.js';
import { client } from '#/database/client.js';
import { eq } from 'drizzle-orm';
import { productSchema } from './schemas.js';
import { notFoundError } from '#/extensions.js';

const schema = productSchema.pick({ productId: true });

export const getRoute = new Hono().get(
  '/:productId',
  zValidator('param', schema),
  async c => {
    const { productId } = c.req.valid('param');
    const [product] = await client
      .select({
        productId: products.productId,
        storeId: products.storeId,
        storeName: stores.name,
        storeUrl: stores.url,
        name: products.name,
        url: products.url,
        currentPrice: products.currentPrice,
        priceChangePercentage: products.priceChangePercentage,
        lastUpdated: products.lastUpdated,
        currency: products.currency,
      })
      .from(products)
      .innerJoin(stores, eq(products.storeId, stores.storeId))
      .where(eq(products.productId, productId))
      .limit(1);
    if (!product) {
      return notFoundError(c, `Product ${productId} not found`);
    }
    return c.json(product, StatusCodes.OK);
  }
);
