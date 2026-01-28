import { Link, useSearchParams } from 'react-router';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { ProductSearch } from '../components/ProductSearch';
import { ErrorBoundary } from 'react-error-boundary';
import { QueryErrorResetBoundary } from '@tanstack/react-query';
import {
  ProductsTable,
  ProductsTableError,
  ProductsTableSkeleton,
} from '../components/ProductsTable';
import { Suspense } from 'react';

export function ProductListPage() {
  const [searchParams] = useSearchParams();
  const storeId = searchParams.get('storeId') || '';
  const name = searchParams.get('name') ?? '';

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Products</h1>
          <p className="text-muted-foreground">Manage your tracked products</p>
        </div>
        <Button asChild>
          <Link to="/products/new">
            <Plus className="mr-2 h-4 w-4" />
            Add Product
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Products</CardTitle>
          <CardDescription>
            A list of all products you are tracking prices for.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ProductSearch />
          <QueryErrorResetBoundary>
            {({ reset }) => (
              <ErrorBoundary
                onReset={reset}
                FallbackComponent={ProductsTableError}
              >
                <Suspense fallback={<ProductsTableSkeleton />}>
                  <ProductsTable
                    storeId={storeId}
                    name={name}
                    storeNameVisible
                  />
                </Suspense>
              </ErrorBoundary>
            )}
          </QueryErrorResetBoundary>
        </CardContent>
      </Card>
    </div>
  );
}
