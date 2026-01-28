import { paginationSchema } from '#/types/pagination.js';
import { z } from 'zod';

export const storeSchema = z.object({
  storeId: z.uuidv7(),
  name: z.string().min(1).max(1024),
  url: z.url().max(2048),
});

export type Store = z.infer<typeof storeSchema>;

export const addStoreSchema = storeSchema.omit({ storeId: true });

export type AddStore = z.infer<typeof addStoreSchema>;

export const editStoreSchema = storeSchema.pick({ name: true, url: true });

export type EditStore = z.infer<typeof editStoreSchema>;

export const listStoresSchema = paginationSchema.extend({
  name: z.string().optional(),
});

export type ListStores = z.infer<typeof listStoresSchema>;
