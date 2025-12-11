import { z } from 'zod';

export const productSchema = z.object({
  storeId: z.uuidv7(),
  productId: z.uuidv7(),
  name: z.string().min(1).max(1024),
  url: z.url().min(1).max(2048),
  currentPrice: z.number().positive().optional(),
  priceChangePercentage: z.number().optional(),
  lastUpdated: z.coerce.date().optional(),
  currency: z.enum(['PEN', 'USD']),
});

export type Product = z.infer<typeof productSchema>;

export const products: Product[] = [];

export const priceHistorySchema = z.object({
  productId: z.uuidv7(),
  priceHistoryId: z.uuidv7(),
  timestamp: z.coerce.date(),
  price: z.number().positive(),
});

export type PriceHistory = z.infer<typeof priceHistorySchema>;

export const priceHistories: PriceHistory[] = [];
