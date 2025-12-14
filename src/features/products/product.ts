import { z } from 'zod';
import {
  varchar,
  pgSchema,
  uuid,
  numeric,
  timestamp,
} from 'drizzle-orm/pg-core';
import { stores } from '@/features/stores/store.js';

export const productSchema = z.object({
  storeId: z.uuidv7(),
  productId: z.uuidv7(),
  name: z.string().min(1).max(1024),
  url: z.url().max(2048),
  currentPrice: z.number().positive().nullable(),
  priceChangePercentage: z.number().nullable(),
  lastUpdated: z.coerce.date().nullable(),
  currency: z.string().length(3),
});

export type Product = z.infer<typeof productSchema>;

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

export const priceHistorySchema = z.object({
  productId: z.uuidv7(),
  priceHistoryId: z.uuidv7(),
  timestamp: z.coerce.date(),
  price: z.number().positive(),
});

export type PriceHistory = z.infer<typeof priceHistorySchema>;

export const priceHistories = dbSchema.table('price_histories', {
  priceHistoryId: uuid('pricehistoryid').primaryKey(),
  productId: uuid('productid')
    .notNull()
    .references(() => products.productId),
  timestamp: timestamp('timestamp', { mode: 'date' }).notNull(),
  price: numeric('price', { precision: 10, scale: 2 }).notNull(),
});
