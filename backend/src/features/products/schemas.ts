import { paginationSchema } from '#/pagination.js';
import { z } from 'zod';

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

export const addProductSchema = productSchema.omit({
  productId: true,
  currentPrice: true,
  priceChangePercentage: true,
  lastUpdated: true,
});
export type AddProduct = z.infer<typeof addProductSchema>;

export const editProductSchema = productSchema.pick({
  name: true,
  url: true,
  currency: true,
});
export type EditProduct = z.infer<typeof editProductSchema>;

export const getProductResponseSchema = productSchema.extend({
  storeName: z.string(),
  storeUrl: z.url(),
});

export type GetProductResponse = z.infer<typeof getProductResponseSchema>;

export const listProductsResponseSchema = productSchema.extend({
  storeName: z.string(),
});

export const listProductsSchema = paginationSchema.extend({
  name: z.string().optional(),
  storeId: z.uuidv7().optional(),
});

export type ListProducts = z.infer<typeof listProductsSchema>;

export type ListProductsResponse = z.infer<typeof listProductsResponseSchema>;

export const priceHistorySchema = z.object({
  productId: z.uuidv7(),
  priceHistoryId: z.uuidv7(),
  timestamp: z.coerce.date(),
  price: z.number().positive(),
});

export type PriceHistory = z.infer<typeof priceHistorySchema>;

export const addPriceHistorySchema = priceHistorySchema.pick({ price: true });
export type AddPriceHistory = z.infer<typeof addPriceHistorySchema>;

export type ListPriceHistories = z.infer<typeof paginationSchema>;
