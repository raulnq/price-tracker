import { client } from '../../client-api';
import type {
  GetStats,
  GetStatsResponse,
} from '@price-tracker/backend/features/stats/get-stats';

export async function getStats(
  params?: Partial<GetStats>,
  token?: string | null
): Promise<GetStatsResponse> {
  const response = await client.api.stats.$get(
    {
      query: {
        days: params?.days?.toString(),
        recentCount: params?.recentCount?.toString(),
      },
    },
    { headers: token ? { Authorization: `Bearer ${token}` } : {} }
  );
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Failed to fetch stats');
  }

  const data = await response.json();

  return {
    ...data,
    recentProducts: data.recentProducts.map(product => ({
      ...product,
      lastUpdated: product.lastUpdated ? new Date(product.lastUpdated) : null,
    })),
  };
}

export type { GetStats, GetStatsResponse };
