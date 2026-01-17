import { client } from '../../client-api';
import type { Product } from '@price-tracker/backend/features/products/product';
import type { AddProduct } from '@price-tracker/backend/features/products/add-product';
import type { EditProduct } from '@price-tracker/backend/features/products/edit-product';
import type { ListProducts } from '@price-tracker/backend/features/products/list-products';
import type { Page } from '@price-tracker/backend/types/pagination';

export async function listProducts(
  params?: ListProducts,
  token?: string | null
): Promise<Page<Product>> {
  const response = await client.api.products.$get(
    {
      query: {
        pageNumber: params?.pageNumber?.toString(),
        pageSize: params?.pageSize?.toString(),
        name: params?.name,
        storeId: params?.storeId,
      },
    },
    { headers: token ? { Authorization: `Bearer ${token}` } : {} }
  );
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Failed to fetch products');
  }
  return response.json() as Promise<Page<Product>>;
}

export async function getProduct(
  productId: string,
  token?: string | null
): Promise<Product> {
  const response = await client.api.products[':productId'].$get(
    { param: { productId } },
    { headers: token ? { Authorization: `Bearer ${token}` } : {} }
  );
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Failed to fetch product');
  }
  return response.json() as Promise<Product>;
}

export async function createProduct(
  data: AddProduct,
  token?: string | null
): Promise<Product> {
  const response = await client.api.products.$post(
    { json: data },
    { headers: token ? { Authorization: `Bearer ${token}` } : {} }
  );
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Failed to create product');
  }
  return response.json() as Promise<Product>;
}

export async function updateProduct(
  productId: string,
  data: EditProduct,
  token?: string | null
): Promise<Product> {
  const response = await client.api.products[':productId'].$put(
    {
      param: { productId },
      json: data,
    },
    { headers: token ? { Authorization: `Bearer ${token}` } : {} }
  );
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Failed to update product');
  }
  return response.json() as Promise<Product>;
}
