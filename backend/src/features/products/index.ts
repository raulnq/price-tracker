import { Hono } from 'hono';
import { listRoute } from './list-products.js';
import { addRoute } from './add-product.js';
import { getRoute } from './get-product.js';
import { editRoute } from './edit-product.js';
import { addPriceHistoryRoute } from './add-price-history.js';
import { listPriceHistoriesRoute } from './list-price-histories.js';

export const productRoute = new Hono()
  .basePath('/products')
  .route('/', listRoute)
  .route('/', addRoute)
  .route('/', getRoute)
  .route('/', editRoute)
  .route('/', addPriceHistoryRoute)
  .route('/', listPriceHistoriesRoute);
