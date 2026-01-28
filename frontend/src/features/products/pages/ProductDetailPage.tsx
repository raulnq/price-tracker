import { useState, Suspense } from 'react';
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
import { useProductSuspense } from '../useProducts';
import { PriceChangeIndicator } from '../components/PriceChangeIndicator';
import {
  PriceHistoryChart,
  PriceHistoryChartSkeleton,
  PriceHistoryChartError,
} from '../components/PriceHistoryChart';
import {
  PriceHistoryTable,
  PriceHistoryTableSkeleton,
  PriceHistoryTableError,
} from '../components/PriceHistoryTable';
import { AddPriceDialog } from '../components/AddPriceDialog';
import { ErrorBoundary } from 'react-error-boundary';
import { QueryErrorResetBoundary } from '@tanstack/react-query';

function ProductDetailSkeleton() {
  return (
    <div className="text-center py-8 text-muted-foreground">Loading...</div>
  );
}

function ProductDetailError({
  resetErrorBoundary,
}: {
  resetErrorBoundary: () => void;
}) {
  return (
    <div className="space-y-4">
      <Button variant="ghost" asChild>
        <Link to="/products">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Products
        </Link>
      </Button>
      <div className="text-center py-8 text-destructive">
        Product not found or error loading product.
      </div>
      <button onClick={resetErrorBoundary} className="underline" type="button">
        Try again
      </button>
    </div>
  );
}

export function ProductDetailPage() {
  return (
    <QueryErrorResetBoundary>
      {({ reset }) => (
        <ErrorBoundary onReset={reset} FallbackComponent={ProductDetailError}>
          <Suspense fallback={<ProductDetailSkeleton />}>
            <ProductDetail />
          </Suspense>
        </ErrorBoundary>
      )}
    </QueryErrorResetBoundary>
  );
}

function ProductDetail() {
  const { productId } = useParams<{ productId: string }>();
  const [showAddPrice, setShowAddPrice] = useState(false);
  const { data: product } = useProductSuspense(productId!);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link to="/products">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div className="flex-1">
          <h1 className="text-3xl font-bold tracking-tight">{product.name}</h1>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Link to={`/stores/${product.storeId}`} className="hover:underline">
              {product.storeName}
            </Link>
            <span>•</span>
            <a
              href={product.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 hover:text-foreground"
            >
              View Product
              <ExternalLink className="h-3 w-3" />
            </a>
          </div>
        </div>
        <Button variant="outline" asChild>
          <Link to={`/products/${productId}/edit`}>
            <Pencil className="mr-2 h-4 w-4" />
            Edit Product
          </Link>
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Current Price</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {product.currentPrice !== null
                ? `${product.currentPrice.toFixed(2)} ${product.currency}`
                : 'No price data'}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Price Change</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              <PriceChangeIndicator change={product.priceChangePercentage} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Last Updated</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {product.lastUpdated
                ? new Date(product.lastUpdated).toLocaleDateString()
                : 'Never'}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Price History</CardTitle>
            <CardDescription>Track price changes over time</CardDescription>
          </div>
          <Button onClick={() => setShowAddPrice(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Price
          </Button>
        </CardHeader>
        <CardContent>
          <QueryErrorResetBoundary>
            {({ reset }) => (
              <ErrorBoundary
                onReset={reset}
                FallbackComponent={PriceHistoryChartError}
              >
                <Suspense fallback={<PriceHistoryChartSkeleton />}>
                  <PriceHistoryChart
                    productId={productId!}
                    currency={product.currency}
                  />
                </Suspense>
              </ErrorBoundary>
            )}
          </QueryErrorResetBoundary>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Price History Data</CardTitle>
          <CardDescription>All recorded price entries</CardDescription>
        </CardHeader>
        <CardContent>
          <QueryErrorResetBoundary>
            {({ reset }) => (
              <ErrorBoundary
                onReset={reset}
                FallbackComponent={PriceHistoryTableError}
              >
                <Suspense fallback={<PriceHistoryTableSkeleton />}>
                  <PriceHistoryTable
                    productId={productId!}
                    currency={product.currency}
                  />
                </Suspense>
              </ErrorBoundary>
            )}
          </QueryErrorResetBoundary>
        </CardContent>
      </Card>

      <AddPriceDialog
        productId={productId!}
        open={showAddPrice}
        onOpenChange={setShowAddPrice}
      />
    </div>
  );
}
