import type {
  AddPriceHistory,
  ListPriceHistories,
  PriceHistory,
} from '#/features/products/schemas';
import { client } from '../../client-api';
import type { Page } from '#/pagination';

export async function listPriceHistory(
  productId: string,
  params?: ListPriceHistories,
  token?: string | null
): Promise<Page<PriceHistory>> {
  const response = await client.api.products[':productId'].prices.$get(
    {
      param: { productId },
      query: {
        pageNumber: params?.pageNumber?.toString(),
        pageSize: params?.pageSize?.toString(),
      },
    },
    { headers: token ? { Authorization: `Bearer ${token}` } : {} }
  );
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Failed to fetch price history');
  }
  const data = await response.json();
  return {
    ...data,
    items: data.items.map(item => ({
      ...item,
      timestamp: new Date(item.timestamp),
    })),
  };
}

export async function createPriceHistory(
  productId: string,
  data: AddPriceHistory,
  token?: string | null
): Promise<PriceHistory> {
  const response = await client.api.products[':productId'].prices.$post(
    {
      param: { productId },
      json: data,
    },
    { headers: token ? { Authorization: `Bearer ${token}` } : {} }
  );
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Failed to create price history');
  }
  const result = await response.json();
  return {
    ...result,
    timestamp: new Date(result.timestamp),
  };
}
