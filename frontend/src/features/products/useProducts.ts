import {
  useQuery,
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from '@tanstack/react-query';
import { useAuth } from '@clerk/clerk-react';
import {
  listProducts,
  getProduct,
  createProduct,
  updateProduct,
} from './products';
import { useSearchParams } from 'react-router';
import type {
  AddProduct,
  EditProduct,
  ListProducts,
} from '@price-tracker/backend/features/products/schemas';

export function useProducts({
  pageNumber,
  pageSize,
  storeId,
  name,
}: Partial<ListProducts> = {}) {
  const { getToken } = useAuth();
  const [searchParams] = useSearchParams();
  const queryPage = searchParams.get('page') ?? '1';
  const currentPage = Math.max(1, Math.floor(Number(queryPage)) || 1);
  const params = {
    pageNumber: pageNumber ?? currentPage,
    pageSize: pageSize ?? 10,
    name: name || undefined,
    storeId: storeId || undefined,
  };
  return useQuery({
    queryKey: ['products', params],
    queryFn: async () => {
      const token = await getToken();
      return listProducts(params, token);
    },
  });
}

export function useProductsSuspense({
  storeId,
  name,
}: Partial<ListProducts> = {}) {
  const { getToken } = useAuth();
  const [searchParams] = useSearchParams();
  const queryPage = searchParams.get('page') ?? '1';
  const currentPage = Math.max(1, Math.floor(Number(queryPage)) || 1);
  const params = {
    pageNumber: currentPage,
    pageSize: 10,
    name: name || undefined,
    storeId: storeId || undefined,
  };
  return useSuspenseQuery({
    queryKey: ['products', params],
    queryFn: async () => {
      const token = await getToken();
      return listProducts(params, token);
    },
  });
}

export function useProduct(productId: string) {
  const { getToken } = useAuth();
  return useQuery({
    queryKey: ['product', productId],
    queryFn: async () => {
      const token = await getToken();
      return getProduct(productId, token);
    },
    enabled: !!productId,
  });
}

export function useProductSuspense(productId: string) {
  const { getToken } = useAuth();
  return useSuspenseQuery({
    queryKey: ['product', productId],
    queryFn: async () => {
      const token = await getToken();
      return getProduct(productId, token);
    },
  });
}

export function useAddProduct() {
  const queryClient = useQueryClient();
  const { getToken } = useAuth();

  return useMutation({
    mutationFn: async (data: AddProduct) => {
      const token = await getToken();
      return createProduct(data, token);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
}

export function useEditProduct(productId: string) {
  const queryClient = useQueryClient();
  const { getToken } = useAuth();

  return useMutation({
    mutationFn: async (data: EditProduct) => {
      const token = await getToken();
      return updateProduct(productId, data, token);
    },
    onSuccess: data => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.setQueryData(['product', productId], data);
    },
  });
}
