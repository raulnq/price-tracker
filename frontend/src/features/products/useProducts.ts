import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@clerk/clerk-react';
import {
  listProducts,
  getProduct,
  createProduct,
  updateProduct,
} from './products';
import type { AddProduct } from '@price-tracker/backend/features/products/add-product';
import type { EditProduct } from '@price-tracker/backend/features/products/edit-product';
import type { ListProducts } from '@price-tracker/backend/features/products/list-products';

export function useProducts(params?: ListProducts) {
  const { getToken } = useAuth();
  return useQuery({
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

export function useCreateProduct() {
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

export function useUpdateProduct(productId: string) {
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
