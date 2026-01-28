import {
  varchar,
  pgSchema,
  uuid,
  numeric,
  timestamp,
} from 'drizzle-orm/pg-core';
import { stores } from '#/features/stores/store.js';

const dbSchema = pgSchema('price_tracker');

export const products = dbSchema.table('products', {
  productId: uuid('productid').primaryKey(),
  storeId: uuid('storeid')
    .notNull()
    .references(() => stores.storeId),
  name: varchar('name', { length: 1024 }).notNull(),
  url: varchar('url', { length: 2048 }).notNull(),
  currentPrice: numeric('currentprice', {
    precision: 10,
    scale: 2,
    mode: 'number',
  }),
  priceChangePercentage: numeric('pricechangepercentage', {
    precision: 5,
    scale: 2,
    mode: 'number',
  }),
  lastUpdated: timestamp('lastupdated', { mode: 'date' }),
  currency: varchar('currency', { length: 3 }).notNull(),
});

export const priceHistories = dbSchema.table('price_histories', {
  priceHistoryId: uuid('pricehistoryid').primaryKey(),
  productId: uuid('productid')
    .notNull()
    .references(() => products.productId),
  timestamp: timestamp('timestamp', { mode: 'date' }).notNull(),
  price: numeric('price', {
    precision: 10,
    scale: 2,
    mode: 'number',
  }).notNull(),
});
