import { Hono } from 'hono';
import { v7 } from 'uuid';
import { StatusCodes } from 'http-status-codes';
import { products, priceHistories, type PriceHistory } from './product.js';

export const addPriceHistoryRoute = new Hono().post(
  '/:productId/prices',
  async c => {
    const productId = c.req.param('productId');
    const { price } = await c.req.json();

    const product = products.find(p => p.productId === productId);
    if (!product) {
      return c.json(
        { message: `Product ${productId} not found` },
        StatusCodes.NOT_FOUND
      );
    }

    const priceHistory: PriceHistory = {
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
