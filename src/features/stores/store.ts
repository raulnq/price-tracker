import { z } from 'zod';
import { varchar, pgSchema, uuid } from 'drizzle-orm/pg-core';

export const storeSchema = z.object({
  storeId: z.uuidv7(),
  name: z.string().min(1).max(1024),
  url: z.url().min(1).max(2048),
});

export type Store = z.infer<typeof storeSchema>;

const dbSchema = pgSchema('price_tracker');

export const stores = dbSchema.table('stores', {
  storeId: uuid('storeid').primaryKey(),
  name: varchar('name', { length: 1024 }).notNull(),
  url: varchar('url', { length: 2048 }).notNull(),
});
