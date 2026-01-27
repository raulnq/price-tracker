import { Link, useParams } from 'react-router';
import { ArrowLeft, ExternalLink, Pencil, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useStoreSuspense } from '../useStores';
import { ErrorBoundary } from 'react-error-boundary';
import { Suspense } from 'react';
import {
  ProductsTable,
  ProductsTableError,
  ProductsTableSkeleton,
} from '@/features/products/components/ProductsTable';

function StoreDetailSkeleton() {
  return (
    <div className="text-center py-8 text-muted-foreground">Loading...</div>
  );
}

function StoreDetailError({
  resetErrorBoundary,
}: {
  resetErrorBoundary: () => void;
}) {
  return (
    <div className="space-y-4">
      <Button variant="ghost" asChild>
        <Link to="/stores">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Stores
        </Link>
      </Button>
      <div className="text-center py-8 text-destructive">
        Store not found or error loading store.
      </div>
      <button onClick={resetErrorBoundary} className="underline">
        Try again
      </button>
    </div>
  );
}

export function StoreDetailPage() {
  return (
    <ErrorBoundary FallbackComponent={StoreDetailError}>
      <Suspense fallback={<StoreDetailSkeleton />}>
        <StoreDetail />
      </Suspense>
    </ErrorBoundary>
  );
}

export function StoreDetail() {
  const { storeId } = useParams<{ storeId: string }>();
  const { data } = useStoreSuspense(storeId!);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link to="/stores">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div className="flex-1">
          <h1 className="text-3xl font-bold tracking-tight">{data.name}</h1>
          <a
            href={data.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-muted-foreground hover:text-foreground"
          >
            {data.url}
            <ExternalLink className="h-3 w-3" />
          </a>
        </div>
        <Button variant="outline" asChild>
          <Link to={`/stores/${storeId}/edit`}>
            <Pencil className="mr-2 h-4 w-4" />
            Edit Store
          </Link>
        </Button>
      </div>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Products</CardTitle>
            <CardDescription>Products from this store</CardDescription>
          </div>
          <Button asChild>
            <Link to={`/products/new?storeId=${storeId}`}>
              <Plus className="mr-2 h-4 w-4" />
              Add Product
            </Link>
          </Button>
        </CardHeader>
        <CardContent>
          <ErrorBoundary FallbackComponent={ProductsTableError}>
            <Suspense fallback={<ProductsTableSkeleton />}>
              <ProductsTable storeId={storeId} />
            </Suspense>
          </ErrorBoundary>
        </CardContent>
      </Card>
    </div>
  );
}
