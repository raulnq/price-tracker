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

const paramSchema = productSchema.pick({ productId: true });
const bodySchema = priceHistorySchema.pick({ price: true });

export const addPriceHistoryRoute = new Hono().post(
  '/:productId/prices',
  zValidator('param', paramSchema),
  zValidator('json', bodySchema),
  async c => {
    const { productId } = c.req.valid('param');
    const { price } = c.req.valid('json');

    const product = products.find(p => p.productId === productId);
    if (!product) {
      return c.json(
        createResourceNotFoundPD(c.req.path, `Product ${productId} not found`),
        StatusCodes.NOT_FOUND
      );
    }

    const priceHistory = {
      productId,
      priceHistoryId: v7(),
      timestamp: new Date(),
      price,
    };

    priceHistories.push(priceHistory);

    if (product.currentPrice && product.currentPrice > 0) {
      const priceChange = price - product.currentPrice;
      product.priceChangePercentage =
        (priceChange / product.currentPrice) * 100;
    } else {
      product.priceChangePercentage = 0;
    }

    product.currentPrice = price;
    product.lastUpdated = priceHistory.timestamp;

    return c.json(priceHistory, StatusCodes.CREATED);
  }
);
