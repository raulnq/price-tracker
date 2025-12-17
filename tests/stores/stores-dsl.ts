import { testClient } from 'hono/testing';
import { type AddStore } from '@/features/stores/add-store.js';
import { storeRoute } from '@/features/stores/index.js';
import type { ProblemDocument } from 'http-problem-details/dist/ProblemDocument.js';
import { type Store } from '@/features/stores/store.js';
import { faker } from '@faker-js/faker';
import { StatusCodes } from 'http-status-codes';
import assert from 'node:assert';
import { assertStrictEqualProblemDocument } from '../utils.js';
import type { EditStore } from '@/features/stores/edit-store.js';
import type { ListStores } from '@/features/stores/list-stores.js';
import type { Page } from '@/types/pagination.js';

export const wallmart = (overrides?: Partial<AddStore>): AddStore => {
  return {
    name: `wallmart ${faker.string.uuid()}`,
    url: 'https://www.walmart.com',
    ...overrides,
  };
};

export const nike = (overrides?: Partial<AddStore>): AddStore => {
  return {
    name: `nike ${faker.string.uuid()}`,
    url: 'https://www.nike.com',
    ...overrides,
  };
};

export async function addStore(input: AddStore): Promise<Store>;
export async function addStore(
  input: AddStore,
  expectedProblemDocument: ProblemDocument
): Promise<ProblemDocument>;

export async function addStore(
  input: AddStore,
  expectedProblemDocument?: ProblemDocument
): Promise<Store | ProblemDocument> {
  const client = testClient(storeRoute);
  const response = await client.stores.$post({
    json: input,
  });

  if (response.status === StatusCodes.CREATED) {
    assert.ok(
      !expectedProblemDocument,
      'Expected a problem document but received CREATED status'
    );
    const store = await response.json();
    assert.ok(store);
    return store;
  } else {
    const problemDocument = await response.json();
    assert.ok(problemDocument);
    assert.ok(
      expectedProblemDocument,
      `Expected CREATED status but received ${response.status}`
    );
    assertStrictEqualProblemDocument(problemDocument, expectedProblemDocument);
    return problemDocument;
  }
}

export const editStore = async (
  storeId: string,
  input: EditStore,
  expectedProblemDocument?: ProblemDocument
): Promise<Store | ProblemDocument> => {
  const client = testClient(storeRoute);
  const response = await client.stores[':storeId'].$put({
    param: { storeId },
    json: input,
  });

  if (response.status === StatusCodes.OK) {
    const store = await response.json();
    assert.ok(store);
    return store;
  } else {
    const problemDocument = await response.json();
    assert.ok(problemDocument);
    if (expectedProblemDocument) {
      assertStrictEqualProblemDocument(
        problemDocument,
        expectedProblemDocument
      );
    }
    return problemDocument;
  }
};

export async function getStore(storeId: string): Promise<Store>;
export async function getStore(
  storeId: string,
  expectedProblemDocument: ProblemDocument
): Promise<ProblemDocument>;

export async function getStore(
  storeId: string,
  expectedProblemDocument?: ProblemDocument
): Promise<Store | ProblemDocument> {
  const client = testClient(storeRoute);
  const response = await client.stores[':storeId'].$get({
    param: { storeId },
  });

  if (response.status === StatusCodes.OK) {
    const store = await response.json();
    assert.ok(store);
    return store;
  } else {
    const problemDocument = await response.json();
    assert.ok(problemDocument);
    if (expectedProblemDocument) {
      assertStrictEqualProblemDocument(
        problemDocument,
        expectedProblemDocument
      );
    }
    return problemDocument;
  }
}

export async function listStores(params: ListStores): Promise<Page<Store>>;
export async function listStores(
  params: ListStores,
  expectedProblemDocument: ProblemDocument
): Promise<ProblemDocument>;

export async function listStores(
  params: ListStores,
  expectedProblemDocument?: ProblemDocument
): Promise<Page<Store> | ProblemDocument> {
  const client = testClient(storeRoute);
  const queryParams = {
    pageNumber: params.pageNumber?.toString(),
    pageSize: params.pageSize?.toString(),
    name: params.name,
  };
  const response = await client.stores.$get({
    query: queryParams,
  });

  if (response.status === StatusCodes.OK) {
    const page = await response.json();
    assert.ok(page);
    return page;
  } else {
    const problemDocument = await response.json();
    assert.ok(problemDocument);
    if (expectedProblemDocument) {
      assertStrictEqualProblemDocument(
        problemDocument,
        expectedProblemDocument
      );
    }
    return problemDocument;
  }
}

interface StoreAssertions {
  hasName(expected: string): StoreAssertions;
  hasUrl(expected: string): StoreAssertions;
}

export const assertStore = (store: Store): StoreAssertions => {
  return {
    hasName(expected: string) {
      assert.strictEqual(
        store.name,
        expected,
        `Expected name to be ${expected}, got ${store.name}`
      );
      return this;
    },
    hasUrl(expected: string) {
      assert.strictEqual(
        store.url,
        expected,
        `Expected url to be ${expected}, got ${store.url}`
      );
      return this;
    },
  };
};
