import { varchar, pgSchema, uuid } from 'drizzle-orm/pg-core';

const dbSchema = pgSchema('price_tracker');

export const stores = dbSchema.table('stores', {
  storeId: uuid('storeid').primaryKey(),
  name: varchar('name', { length: 1024 }).notNull(),
  url: varchar('url', { length: 2048 }).notNull(),
});
