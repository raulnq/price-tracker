import { client } from '../../client-api';
import type { Page } from '@price-tracker/backend/types/pagination';
import type {
  AddStore,
  EditStore,
  Store,
  ListStores,
} from '@price-tracker/backend/features/stores/schemas';

export async function listStores(
  params?: ListStores,
  token?: string | null
): Promise<Page<Store>> {
  const response = await client.api.stores.$get(
    {
      query: {
        pageNumber: params?.pageNumber?.toString(),
        pageSize: params?.pageSize?.toString(),
        name: params?.name,
      },
    },
    { headers: token ? { Authorization: `Bearer ${token}` } : {} }
  );
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Failed to fetch stores');
  }
  return response.json();
}

export async function getStore(
  storeId: string,
  token?: string | null
): Promise<Store> {
  const response = await client.api.stores[':storeId'].$get(
    { param: { storeId } },
    { headers: token ? { Authorization: `Bearer ${token}` } : {} }
  );
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Failed to fetch store');
  }
  return response.json();
}

export async function addStore(
  data: AddStore,
  token?: string | null
): Promise<Store> {
  const response = await client.api.stores.$post(
    { json: data },
    { headers: token ? { Authorization: `Bearer ${token}` } : {} }
  );
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Failed to add store');
  }
  return response.json();
}

export async function editStore(
  storeId: string,
  data: EditStore,
  token?: string | null
): Promise<Store> {
  const response = await client.api.stores[':storeId'].$put(
    {
      param: { storeId },
      json: data,
    },
    { headers: token ? { Authorization: `Bearer ${token}` } : {} }
  );
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Failed to update store');
  }
  return response.json();
}
