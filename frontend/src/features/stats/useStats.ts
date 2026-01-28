import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@clerk/clerk-react';
import { getStats } from './stats';
import type { GetStats } from './stats';

export function useStats({ days, recentCount }: Partial<GetStats> = {}) {
  const { getToken } = useAuth();
  const params = {
    days: days ?? 30,
    recentCount: recentCount ?? 5,
  };
  return useQuery({
    queryKey: ['stats', params.days, params.recentCount],
    queryFn: async () => {
      const token = await getToken();
      return getStats(params, token);
    },
  });
}
