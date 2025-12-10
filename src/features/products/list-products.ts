import { Hono } from 'hono';
import { products } from './product.js';
import { StatusCodes } from 'http-status-codes';
import { paginationSchema, createPage } from '@/types/pagination.js';
import { z } from 'zod';
import { zValidator } from '@hono/zod-validator';

const schema = paginationSchema.extend({
  name: z.string().optional(),
  storeId: z.uuidv7().optional(),
});

export const listRoute = new Hono().get(
  '/',
  zValidator('query', schema),
  async c => {
    const { pageNumber, pageSize, name, storeId } = c.req.valid('query');
    let filteredProducts = products;

    if (name) {
      filteredProducts = filteredProducts.filter(product =>
        product.name.toLowerCase().includes(name.toLowerCase())
      );
    }

    if (storeId) {
      filteredProducts = filteredProducts.filter(
        product => product.storeId === storeId
      );
    }

    const totalCount = filteredProducts.length;
    const startIndex = (pageNumber - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const page = filteredProducts.slice(startIndex, endIndex);
    return c.json(
      createPage(page, totalCount, pageNumber, pageSize),
      StatusCodes.OK
    );
  }
);
