import { Hono } from 'hono';
import { products } from './product.js';
import { StatusCodes } from 'http-status-codes';

export const listRoute = new Hono().get('/', async c => {
  const { pageNumber, pageSize, name, storeId } = c.req.query();
  const pn = parseInt(pageNumber || '1', 10);
  const pz = parseInt(pageSize || '10', 10);
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
  const startIndex = (pn - 1) * pz;
  const endIndex = startIndex + pz;
  const page = filteredProducts.slice(startIndex, endIndex);

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
});
