import { Hono } from 'hono';
import { products, priceHistories } from './product.js';
import { StatusCodes } from 'http-status-codes';

export const listPriceHistoriesRoute = new Hono().get(
  '/:productId/prices',
  async c => {
    const productId = c.req.param('productId');
    const { pageNumber, pageSize } = c.req.query();
    const pn = parseInt(pageNumber || '1', 10);
    const pz = parseInt(pageSize || '10', 10);

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
    const startIndex = (pn - 1) * pz;
    const endIndex = startIndex + pz;
    const page = filteredPriceHistories.slice(startIndex, endIndex);

    return c.json(
      {
        items: page,
        pageNumber: pn,
        pageSize: pz,
        totalPages: Math.ceil(totalCount / pz),
        totalCount,
      },
      StatusCodes.OK
    );
  }
);
