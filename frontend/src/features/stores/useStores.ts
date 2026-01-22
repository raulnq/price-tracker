import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { listStores, getStore, addStore, editStore } from './stores';
import type { AddStore } from '@price-tracker/backend/features/stores/add-store';
import type { EditStore } from '@price-tracker/backend/features/stores/edit-store';
import { useAuth } from '@clerk/clerk-react';
import { useSearchParams } from 'react-router';
import type { ListStores } from '@price-tracker/backend/features/stores/list-stores';

export function useStores({
  pageNumber,
  pageSize,
  name,
}: Partial<ListStores> = {}) {
  const { getToken } = useAuth();
  const [searchParams] = useSearchParams();
  const queryPage = searchParams.get('page') ?? '1';
  const currentPage = Math.max(1, Math.floor(Number(queryPage)) || 1);
  const params = {
    pageNumber: pageNumber ?? currentPage,
    pageSize: pageSize ?? 10,
    name: name || undefined,
  };
  return useQuery({
    queryKey: ['stores', params],
    queryFn: async () => {
      const token = await getToken();
      return listStores(params, token);
    },
  });
}

export function useStoreOptions() {
  const { getToken } = useAuth();
  return useQuery({
    queryKey: ['stores', 'options'],
    queryFn: async () => {
      const token = await getToken();
      return listStores({ pageSize: 100, pageNumber: 1 }, token);
    },
    staleTime: 10 * 60 * 1000,
  });
}

export function useStore(storeId: string) {
  const { getToken } = useAuth();
  return useQuery({
    queryKey: ['store', storeId],
    queryFn: async () => {
      const token = await getToken();
      return getStore(storeId, token);
    },
    enabled: !!storeId,
  });
}

export function useAddStore() {
  const queryClient = useQueryClient();
  const { getToken } = useAuth();
  return useMutation({
    mutationFn: async (data: AddStore) => {
      const token = await getToken();
      return addStore(data, token);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['stores'] });
    },
  });
}

export function useEditStore(storeId: string) {
  const queryClient = useQueryClient();
  const { getToken } = useAuth();
  return useMutation({
    mutationFn: async (data: EditStore) => {
      const token = await getToken();
      return editStore(storeId, data, token);
    },
    onSuccess: data => {
      queryClient.invalidateQueries({ queryKey: ['stores'] });
      queryClient.setQueryData(['store', storeId], data);
    },
  });
}
