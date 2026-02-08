import {
  useQuery,
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from '@tanstack/react-query';
import { listStores, getStore, addStore, editStore } from './stores';
import { useAuth } from '@clerk/clerk-react';
import { useSearchParams } from 'react-router';
import type {
  AddStore,
  EditStore,
  ListStores,
} from '#/features/stores/schemas';

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

export function useStoresSuspense({
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
  return useSuspenseQuery({
    queryKey: ['stores', params],
    queryFn: async () => {
      const token = await getToken();
      return listStores(params, token);
    },
  });
}

export function useStoreSuspense(storeId: string) {
  const { getToken } = useAuth();
  return useSuspenseQuery({
    queryKey: ['store', storeId],
    queryFn: async () => {
      const token = await getToken();
      return getStore(storeId, token);
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
