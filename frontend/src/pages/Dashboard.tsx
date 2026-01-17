import { Link } from 'react-router';
import {
  Package,
  Store,
  TrendingDown,
  TrendingUp,
  ArrowRight,
} from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useProducts } from '@/features/products/useProducts';
import { useStores } from '@/features/stores/useStores';
import { PriceChangeIndicator } from '@/features/products/components/PriceChangeIndicator';

export function Dashboard() {
  const { data: productsData, isLoading: productsLoading } = useProducts({
    pageSize: 100,
    pageNumber: 1,
  });
  const { data: storesData, isLoading: storesLoading } = useStores({
    pageSize: 100,
    pageNumber: 1,
  });

  const priceDrops =
    productsData?.items.filter(
      p => p.priceChangePercentage !== null && p.priceChangePercentage < 0
    ).length ?? 0;

  const priceIncreases =
    productsData?.items.filter(
      p => p.priceChangePercentage !== null && p.priceChangePercentage > 0
    ).length ?? 0;

  const storeMap = new Map(
    storesData?.items.map(s => [s.storeId, s.name]) ?? []
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Overview of your price tracking activity
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Products
            </CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {productsLoading ? '...' : (productsData?.totalCount ?? 0)}
            </div>
            <p className="text-xs text-muted-foreground">
              Products being tracked
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Stores</CardTitle>
            <Store className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {storesLoading ? '...' : (storesData?.totalCount ?? 0)}
            </div>
            <p className="text-xs text-muted-foreground">Stores configured</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Price Drops</CardTitle>
            <TrendingDown className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-500">
              {productsLoading ? '...' : priceDrops}
            </div>
            <p className="text-xs text-muted-foreground">
              Products with lower prices
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Price Increases
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-500">
              {productsLoading ? '...' : priceIncreases}
            </div>
            <p className="text-xs text-muted-foreground">
              Products with higher prices
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Products</CardTitle>
            <CardDescription>
              Your most recently tracked products
            </CardDescription>
          </CardHeader>
          <CardContent>
            {productsLoading ? (
              <div className="text-center py-4 text-muted-foreground">
                Loading...
              </div>
            ) : productsData?.items.length === 0 ? (
              <div className="text-center py-4 text-muted-foreground">
                No products yet.{' '}
                <Link
                  to="/products/new"
                  className="text-primary hover:underline"
                >
                  Add your first product
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {productsData?.items.slice(0, 5).map(product => (
                  <div
                    key={product.productId}
                    className="flex items-center justify-between"
                  >
                    <div className="space-y-1">
                      <Link
                        to={`/products/${product.productId}`}
                        className="font-medium hover:underline"
                      >
                        {product.name}
                      </Link>
                      <p className="text-sm text-muted-foreground">
                        {storeMap.get(product.storeId) ?? 'Unknown store'}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">
                        {product.currentPrice !== null
                          ? `${product.currentPrice.toFixed(2)} ${product.currency}`
                          : '-'}
                      </div>
                      <PriceChangeIndicator
                        change={product.priceChangePercentage}
                      />
                    </div>
                  </div>
                ))}
                <Button variant="ghost" className="w-full" asChild>
                  <Link to="/products">
                    View all products
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Stores</CardTitle>
            <CardDescription>Your configured stores</CardDescription>
          </CardHeader>
          <CardContent>
            {storesLoading ? (
              <div className="text-center py-4 text-muted-foreground">
                Loading...
              </div>
            ) : storesData?.items.length === 0 ? (
              <div className="text-center py-4 text-muted-foreground">
                No stores yet.{' '}
                <Link to="/stores/new" className="text-primary hover:underline">
                  Add your first store
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {storesData?.items.slice(0, 5).map(store => (
                  <div
                    key={store.storeId}
                    className="flex items-center justify-between"
                  >
                    <div className="space-y-1">
                      <Link
                        to={`/stores/${store.storeId}`}
                        className="font-medium hover:underline"
                      >
                        {store.name}
                      </Link>
                      <p className="text-sm text-muted-foreground truncate max-w-[200px]">
                        {store.url}
                      </p>
                    </div>
                  </div>
                ))}
                <Button variant="ghost" className="w-full" asChild>
                  <Link to="/stores">
                    View all stores
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
