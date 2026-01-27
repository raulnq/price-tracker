import { Link } from 'react-router';
import { Pencil, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Pagination } from '@/components/Pagination';
import { useProductsSuspense } from '@/features/products/useProducts';
import { PriceChangeIndicator } from '@/features/products/components/PriceChangeIndicator';

type ProductsTableProps = {
  storeId?: string;
  name?: string;
  storeNameVisible?: boolean;
};

export function ProductsTableSkeleton() {
  return (
    <div className="text-center py-8 text-muted-foreground">
      Loading products...
    </div>
  );
}

export function ProductsTableError({
  resetErrorBoundary,
}: {
  resetErrorBoundary: () => void;
}) {
  return (
    <>
      <div className="text-center py-8 text-destructive">
        Failed to load products. Please try again.
      </div>
      <button onClick={resetErrorBoundary} className="underline">
        Try again
      </button>
    </>
  );
}

export function ProductsTable({
  storeId,
  name,
  storeNameVisible: storeNameEnabled = false,
}: ProductsTableProps) {
  const { data } = useProductsSuspense({ storeId, name });

  if (data?.items.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        {storeId ? 'No products from this store yet.' : 'No products found.'}
      </div>
    );
  }

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            {storeNameEnabled && <TableHead>Store</TableHead>}
            <TableHead>Current Price</TableHead>
            <TableHead>Change</TableHead>
            <TableHead>Last Updated</TableHead>
            <TableHead className="w-[100px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data?.items.map(product => (
            <TableRow key={product.productId}>
              <TableCell className="font-medium">
                <Link
                  to={`/products/${product.productId}`}
                  className="hover:underline"
                >
                  {product.name}
                </Link>
              </TableCell>
              {storeNameEnabled && (
                <TableCell>
                  <Link
                    to={`/stores/${product.storeId}`}
                    className="text-muted-foreground hover:text-foreground hover:underline"
                  >
                    {product.storeName}
                  </Link>
                </TableCell>
              )}
              <TableCell>
                {product.currentPrice !== null
                  ? `${product.currentPrice.toFixed(2)} ${product.currency}`
                  : '-'}
              </TableCell>
              <TableCell>
                <PriceChangeIndicator change={product.priceChangePercentage} />
              </TableCell>
              <TableCell className="text-muted-foreground">
                {product.lastUpdated
                  ? new Date(product.lastUpdated).toLocaleDateString()
                  : '-'}
              </TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <Button variant="ghost" size="icon" asChild>
                    <Link to={`/products/${product.productId}`}>
                      <Search className="h-4 w-4" />
                    </Link>
                  </Button>
                  <Button variant="ghost" size="icon" asChild>
                    <Link to={`/products/${product.productId}/edit`}>
                      <Pencil className="h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <div className="mt-4">
        <Pagination totalPages={data.totalPages} />
      </div>
    </>
  );
}
