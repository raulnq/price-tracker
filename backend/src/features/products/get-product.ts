import { Hono } from 'hono';
import { products } from './product.js';
import { stores } from '#/features/stores/store.js';
import { StatusCodes } from 'http-status-codes';
import { zValidator } from '#/utils/validation.js';
import { createResourceNotFoundPD } from '#/utils/problem-document.js';
import { client } from '#/database/client.js';
import { eq } from 'drizzle-orm';
import { productSchema } from './schemas.js';

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
      return c.json(
        createResourceNotFoundPD(c.req.path, `Product ${productId} not found`),
        StatusCodes.NOT_FOUND
      );
    }
    return c.json(product, StatusCodes.OK);
  }
);
