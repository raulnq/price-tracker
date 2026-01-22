import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@clerk/clerk-react';
import { listPriceHistory, createPriceHistory } from './price-history';
import type { AddPriceHistory } from '@price-tracker/backend/features/products/add-price-history';
import type { ListPriceHistories } from '@price-tracker/backend/features/products/list-price-histories';
import { useSearchParams } from 'react-router';

export function usePriceHistory(
  productId: string,
  { pageNumber, pageSize }: Partial<ListPriceHistories> = {}
) {
  const { getToken } = useAuth();
  const [searchParams] = useSearchParams();
  const queryPage = searchParams.get('page') ?? '1';
  const currentPage = Math.max(1, Math.floor(Number(queryPage)) || 1);
  const params = {
    pageNumber: pageNumber ?? currentPage,
    pageSize: pageSize ?? 10,
  };
  return useQuery({
    queryKey: ['priceHistory', productId, params],
    queryFn: async () => {
      const token = await getToken();
      return listPriceHistory(productId, params, token);
    },
    enabled: !!productId,
  });
}

export function useCreatePriceHistory(productId: string) {
  const queryClient = useQueryClient();
  const { getToken } = useAuth();

  return useMutation({
    mutationFn: async (data: AddPriceHistory) => {
      const token = await getToken();
      return createPriceHistory(productId, data, token);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['priceHistory', productId],
      });
      queryClient.invalidateQueries({ queryKey: ['product', productId] });
    },
  });
}
