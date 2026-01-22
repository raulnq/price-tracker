import { Link, useSearchParams } from 'react-router';
import { Plus, Search, Pencil } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Pagination } from '@/components/Pagination';
import { useProducts } from '../useProducts';
import { PriceChangeIndicator } from './PriceChangeIndicator';
import { ProductSearch } from './ProductSearch';

export function ProductList() {
  const [searchParams] = useSearchParams();
  const storeId = searchParams.get('storeId') || '';
  const search = searchParams.get('search') ?? '';
  const { data, isLoading, error } = useProducts({
    storeId: storeId || undefined,
    name: search || undefined,
  });

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
          {isLoading ? (
            <div className="text-center py-8 text-muted-foreground">
              Loading...
            </div>
          ) : error ? (
            <div className="text-center py-8 text-destructive">
              Error loading products. Please try again.
            </div>
          ) : data?.items.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No products found matching your filters.
            </div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Store</TableHead>
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
                      <TableCell>
                        <Link
                          to={`/stores/${product.storeId}`}
                          className="text-muted-foreground hover:text-foreground hover:underline"
                        >
                          {product.storeName}
                        </Link>
                      </TableCell>
                      <TableCell>
                        {product.currentPrice !== null
                          ? `${product.currentPrice.toFixed(2)} ${product.currency}`
                          : '-'}
                      </TableCell>
                      <TableCell>
                        <PriceChangeIndicator
                          change={product.priceChangePercentage}
                        />
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

              {data && (
                <div className="mt-4">
                  <Pagination totalPages={data.totalPages} />
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
