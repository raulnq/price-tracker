import { z } from 'zod';

export const storeSchema = z.object({
  storeId: z.uuidv7(),
  name: z.string().min(1).max(1024),
  url: z.url().min(1).max(2048),
});

export type Store = z.infer<typeof storeSchema>;

export const stores: Store[] = [];
