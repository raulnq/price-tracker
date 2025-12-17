import { testClient } from 'hono/testing';
import { productRoute } from '@/features/products/index.js';
import type { ProblemDocument } from 'http-problem-details/dist/ProblemDocument.js';
import { type Product } from '@/features/products/product.js';
import { faker } from '@faker-js/faker';
import { StatusCodes } from 'http-status-codes';
import assert from 'node:assert';
import {
  assertStrictEqualProblemDocument,
  parseDatesFromJSON,
} from '../utils.js';
import type { AddProduct } from '@/features/products/add-product.js';
import type { EditProduct } from '@/features/products/edit-product.js';
import type { ListProducts } from '@/features/products/list-products.js';
import type { Page } from '@/types/pagination.js';

export const laptop = (
  storeId: string,
  overrides?: Partial<AddProduct>
): AddProduct => {
  return {
    storeId,
    name: `Laptop ${faker.string.uuid()}`,
    url: 'https://www.example.com/laptop',
    currency: 'USD',
    ...overrides,
  };
};

export const phone = (
  storeId: string,
  overrides?: Partial<AddProduct>
): AddProduct => {
  return {
    storeId,
    name: `Phone ${faker.string.uuid()}`,
    url: 'https://www.example.com/phone',
    currency: 'PEN',
    ...overrides,
  };
};

export async function addProduct(input: AddProduct): Promise<Product>;
export async function addProduct(
  input: AddProduct,
  expectedProblemDocument: ProblemDocument
): Promise<ProblemDocument>;

export async function addProduct(
  input: AddProduct,
  expectedProblemDocument?: ProblemDocument
): Promise<Product | ProblemDocument> {
  const client = testClient(productRoute);
  const response = await client.products.$post({
    json: input,
  });

  if (response.status === StatusCodes.CREATED) {
    const json = await response.json();
    const product = parseDatesFromJSON<Product>(json, ['lastUpdated']);
    assert.ok(product);
    return product;
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

export const editProduct = async (
  productId: string,
  input: EditProduct,
  expectedProblemDocument?: ProblemDocument
): Promise<Product | ProblemDocument> => {
  const client = testClient(productRoute);
  const response = await client.products[':productId'].$put({
    param: { productId },
    json: input,
  });

  if (response.status === StatusCodes.OK) {
    const json = await response.json();
    const product = parseDatesFromJSON<Product>(json, ['lastUpdated']);
    assert.ok(product);
    return product;
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

export async function getProduct(productId: string): Promise<Product>;
export async function getProduct(
  productId: string,
  expectedProblemDocument: ProblemDocument
): Promise<ProblemDocument>;
export async function getProduct(
  productId: string,
  expectedProblemDocument?: ProblemDocument
): Promise<Product | ProblemDocument> {
  const client = testClient(productRoute);
  const response = await client.products[':productId'].$get({
    param: { productId },
  });

  if (response.status === StatusCodes.OK) {
    const json = await response.json();
    const product = parseDatesFromJSON<Product>(json, ['lastUpdated']);
    assert.ok(product);
    return product;
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

export async function listProducts(
  params: ListProducts
): Promise<Page<Product>>;
export async function listProducts(
  params: ListProducts,
  expectedProblemDocument: ProblemDocument
): Promise<ProblemDocument>;
export async function listProducts(
  params: ListProducts,
  expectedProblemDocument?: ProblemDocument
): Promise<Page<Product> | ProblemDocument> {
  const client = testClient(productRoute);
  const queryParams = {
    pageNumber: params.pageNumber?.toString(),
    pageSize: params.pageSize?.toString(),
    name: params.name,
    storeId: params.storeId,
  };
  const response = await client.products.$get({
    query: queryParams,
  });

  if (response.status === StatusCodes.OK) {
    const json = await response.json();
    const page = {
      ...json,
      items: json.items.map(item =>
        parseDatesFromJSON<Product>(item, ['lastUpdated'])
      ),
    };
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
