import { z } from 'zod';

const DEFAULT_PAGE_NUMBER = 1;
const DEFAULT_PAGE_SIZE = 10;
const MAX_PAGE_SIZE = 100;

export const paginationSchema = z.object({
  pageNumber: z.coerce.number().min(1).optional().default(DEFAULT_PAGE_NUMBER),
  pageSize: z.coerce
    .number()
    .min(1)
    .max(MAX_PAGE_SIZE)
    .optional()
    .default(DEFAULT_PAGE_SIZE),
});

export const createPage = <TResult>(
  items: TResult[],
  totalCount: number,
  pageNumber: number,
  pageSize: number
) => {
  const totalPages = Math.ceil(totalCount / pageSize);
  return {
    items,
    pageNumber,
    pageSize,
    totalPages,
    totalCount,
  };
};
