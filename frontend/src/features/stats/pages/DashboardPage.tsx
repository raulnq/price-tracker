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
import { useStats } from '@/features/stats/useStats';
import { PriceChangeIndicator } from '@/features/products/components/PriceChangeIndicator';

export function DashboardPage() {
  const { data: stats, isLoading } = useStats({ days: 30, recentCount: 5 });

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
              {isLoading ? '...' : (stats?.totalProducts ?? 0)}
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
              {isLoading ? '...' : (stats?.totalStores ?? 0)}
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
              {isLoading ? '...' : (stats?.priceDrops ?? 0)}
            </div>
            <p className="text-xs text-muted-foreground">
              Products with lower prices (last 30 days)
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
              {isLoading ? '...' : (stats?.priceIncreases ?? 0)}
            </div>
            <p className="text-xs text-muted-foreground">
              Products with higher prices (last 30 days)
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
            {isLoading ? (
              <div className="text-center py-4 text-muted-foreground">
                Loading...
              </div>
            ) : stats?.recentProducts.length === 0 ? (
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
                {stats?.recentProducts.map(product => (
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
                        {product.storeName}
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
            {isLoading ? (
              <div className="text-center py-4 text-muted-foreground">
                Loading...
              </div>
            ) : stats?.recentStores.length === 0 ? (
              <div className="text-center py-4 text-muted-foreground">
                No stores yet.{' '}
                <Link to="/stores/new" className="text-primary hover:underline">
                  Add your first store
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {stats?.recentStores.map(store => (
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
