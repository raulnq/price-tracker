export type Product = {
  storeId: string;
  productId: string;
  name: string;
  url: string;
  currentPrice?: number;
  priceChangePercentage?: number;
  lastUpdated?: Date;
  currency: 'PEN' | 'USD';
};

export const products: Product[] = [];

export type PriceHistory = {
  productId: string;
  priceHistoryId: string;
  timestamp: Date;
  price: number;
};

export const priceHistories: PriceHistory[] = [];
