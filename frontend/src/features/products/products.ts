import { client } from '../../client-api';
import type { Page } from '#/pagination';
import type {
  AddProduct,
  EditProduct,
  GetProductResponse,
  ListProducts,
  ListProductsResponse,
  Product,
} from '#/features/products/schemas';

export async function listProducts(
  params?: ListProducts,
  token?: string | null
): Promise<Page<ListProductsResponse>> {
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
  const data = await response.json();
  return {
    ...data,
    items: data.items.map(item => ({
      ...item,
      lastUpdated: item.lastUpdated ? new Date(item.lastUpdated) : null,
    })),
  };
}

export async function getProduct(
  productId: string,
  token?: string | null
): Promise<GetProductResponse> {
  const response = await client.api.products[':productId'].$get(
    { param: { productId } },
    { headers: token ? { Authorization: `Bearer ${token}` } : {} }
  );
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Failed to fetch product');
  }
  const data = await response.json();
  return {
    ...data,
    lastUpdated: data.lastUpdated ? new Date(data.lastUpdated) : null,
  };
}

export async function createProduct(
  input: AddProduct,
  token?: string | null
): Promise<Product> {
  const response = await client.api.products.$post(
    { json: input },
    { headers: token ? { Authorization: `Bearer ${token}` } : {} }
  );
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Failed to create product');
  }
  const data = await response.json();
  return {
    ...data,
    lastUpdated: data.lastUpdated ? new Date(data.lastUpdated) : null,
  };
}

export async function updateProduct(
  productId: string,
  input: EditProduct,
  token?: string | null
): Promise<Product> {
  const response = await client.api.products[':productId'].$put(
    {
      param: { productId },
      json: input,
    },
    { headers: token ? { Authorization: `Bearer ${token}` } : {} }
  );
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Failed to update product');
  }
  const data = await response.json();
  return {
    ...data,
    lastUpdated: data.lastUpdated ? new Date(data.lastUpdated) : null,
  };
}
