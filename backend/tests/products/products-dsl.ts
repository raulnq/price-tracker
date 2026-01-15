import { testClient } from 'hono/testing';
import { productRoute } from '@/features/products/index.js';
import type { ProblemDocument } from 'http-problem-details/dist/ProblemDocument.js';
import {
  type Product,
  type PriceHistory,
} from '@/features/products/product.js';
import { faker } from '@faker-js/faker';
import { StatusCodes } from 'http-status-codes';
import assert from 'node:assert';
import { parseDatesFromJSON } from '../utils.js';
import { assertStrictEqualProblemDocument } from '../assertions.js';
import type { AddProduct } from '@/features/products/add-product.js';
import type { EditProduct } from '@/features/products/edit-product.js';
import type { ListProducts } from '@/features/products/list-products.js';
import type { Page } from '@/types/pagination.js';
import type { AddPriceHistory } from '@/features/products/add-price-history.js';
import type { ListPriceHistories } from '@/features/products/list-price-histories.js';

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

export const newPriceHistory = (
  overrides?: Partial<AddPriceHistory>
): AddPriceHistory => {
  return {
    price: faker.number.float({ min: 1, max: 1000, fractionDigits: 2 }),
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

export async function editProduct(
  productId: string,
  input: EditProduct
): Promise<Product>;
export async function editProduct(
  productId: string,
  input: EditProduct,
  expectedProblemDocument: ProblemDocument
): Promise<ProblemDocument>;
export async function editProduct(
  productId: string,
  input: EditProduct,
  expectedProblemDocument?: ProblemDocument
): Promise<Product | ProblemDocument> {
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
}

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

export async function addPriceHistory(
  productId: string,
  input: AddPriceHistory
): Promise<PriceHistory>;
export async function addPriceHistory(
  productId: string,
  input: AddPriceHistory,
  expectedProblemDocument: ProblemDocument
): Promise<ProblemDocument>;
export async function addPriceHistory(
  productId: string,
  input: AddPriceHistory,
  expectedProblemDocument?: ProblemDocument
): Promise<PriceHistory | ProblemDocument> {
  const client = testClient(productRoute);
  const response = await client.products[':productId'].prices.$post({
    param: { productId },
    json: input,
  });

  if (response.status === StatusCodes.CREATED) {
    const json = await response.json();
    const priceHistory = parseDatesFromJSON<PriceHistory>(json, ['timestamp']);
    assert.ok(priceHistory);
    return priceHistory;
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

export async function listPriceHistories(
  productId: string,
  params: ListPriceHistories
): Promise<Page<PriceHistory>>;
export async function listPriceHistories(
  productId: string,
  params: ListPriceHistories,
  expectedProblemDocument: ProblemDocument
): Promise<ProblemDocument>;
export async function listPriceHistories(
  productId: string,
  params: ListPriceHistories,
  expectedProblemDocument?: ProblemDocument
): Promise<Page<PriceHistory> | ProblemDocument> {
  const client = testClient(productRoute);
  const queryParams = {
    pageNumber: params.pageNumber?.toString(),
    pageSize: params.pageSize?.toString(),
  };
  const response = await client.products[':productId'].prices.$get({
    param: { productId },
    query: queryParams,
  });

  if (response.status === StatusCodes.OK) {
    const json = await response.json();
    const page = {
      ...json,
      items: json.items.map(item =>
        parseDatesFromJSON<PriceHistory>(item, ['timestamp'])
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

export const assertProduct = (product: Product) => {
  return {
    hasProductId(expected: string) {
      assert.strictEqual(
        product.productId,
        expected,
        `Expected productId to be ${expected}, got ${product.productId}`
      );
      return this;
    },
    hasStoreId(expected: string) {
      assert.strictEqual(
        product.storeId,
        expected,
        `Expected storeId to be ${expected}, got ${product.storeId}`
      );
      return this;
    },
    hasCurrentPrice(expected: number) {
      assert.strictEqual(
        product.currentPrice,
        expected,
        `Expected price to be ${expected}, got ${product.currentPrice}`
      );
      return this;
    },
    hasPriceChangePercentage(expected: number) {
      assert.strictEqual(
        product.priceChangePercentage,
        expected,
        `Expected priceChangePercentage to be ${expected}, got ${product.priceChangePercentage}`
      );
      return this;
    },
    hasLastUpdated() {
      assert.ok(
        product.lastUpdated,
        `Expected lastUpdated to be defined, got ${product.lastUpdated}`
      );
      return this;
    },
    hasName(expected: string) {
      assert.strictEqual(
        product.name,
        expected,
        `Expected name to be ${expected}, got ${product.name}`
      );
      return this;
    },
    hasUrl(expected: string) {
      assert.strictEqual(
        product.url,
        expected,
        `Expected url to be ${expected}, got ${product.url}`
      );
      return this;
    },
    hasCurrency(expected: string) {
      assert.strictEqual(
        product.currency,
        expected,
        `Expected currency to be ${expected}, got ${product.currency}`
      );
      return this;
    },
    isTheSameOf(expected: Product) {
      return this.hasProductId(expected.productId)
        .hasStoreId(expected.storeId)
        .hasName(expected.name)
        .hasUrl(expected.url)
        .hasCurrency(expected.currency);
    },
  };
};

export const assertPriceHistory = (priceHistory: PriceHistory) => {
  return {
    hasProductId(expected: string) {
      assert.strictEqual(
        priceHistory.productId,
        expected,
        `Expected productId to be ${expected}, got ${priceHistory.productId}`
      );
      return this;
    },
    hasPrice(expected: number) {
      assert.strictEqual(
        priceHistory.price,
        expected,
        `Expected price to be ${expected}, got ${priceHistory.price}`
      );
      return this;
    },
    hasTimestamp() {
      assert.ok(
        priceHistory.timestamp,
        `Expected timestamp to be defined, got ${priceHistory.timestamp}`
      );
      return this;
    },
    hasPriceHistoryId() {
      assert.ok(
        priceHistory.priceHistoryId,
        `Expected priceHistoryId to be defined, got ${priceHistory.priceHistoryId}`
      );
      return this;
    },
    isTheSameOf(expected: PriceHistory) {
      return this.hasProductId(expected.productId).hasPrice(expected.price);
    },
  };
};
