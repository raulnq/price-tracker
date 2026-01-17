import { client } from '../../client-api';
import type { Store } from '@price-tracker/backend/features/stores/store';
import type { AddStore } from '@price-tracker/backend/features/stores/add-store';
import type { EditStore } from '@price-tracker/backend/features/stores/edit-store';
import type { ListStores } from '@price-tracker/backend/features/stores/list-stores';
import type { Page } from '@price-tracker/backend/types/pagination';

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
  return response.json() as Promise<Page<Store>>;
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
  return response.json() as Promise<Store>;
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
  return response.json() as Promise<Store>;
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
  return response.json() as Promise<Store>;
}
