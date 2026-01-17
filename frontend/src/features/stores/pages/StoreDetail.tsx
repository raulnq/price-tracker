import { Link, useParams, useSearchParams } from 'react-router';
import { ArrowLeft, ExternalLink, Pencil, Plus, Search } from 'lucide-react';
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
import { useStore } from '../useStores';
import { useProducts } from '@/features/products/useProducts';
import { PriceChangeIndicator } from '@/features/products/components/PriceChangeIndicator';

export function StoreDetail() {
  const { storeId } = useParams<{ storeId: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const page = Number(searchParams.get('page')) || 1;

  const handlePageChange = (newPage: number) => {
    setSearchParams(prev => {
      prev.set('page', newPage.toString());
      return prev;
    });
  };

  const {
    data: store,
    isLoading: storeLoading,
    error: storeError,
  } = useStore(storeId!);
  const { data: productsData, isLoading: productsLoading } = useProducts({
    storeId,
    pageNumber: page,
    pageSize: 10,
  });

  if (storeLoading) {
    return (
      <div className="text-center py-8 text-muted-foreground">Loading...</div>
    );
  }

  if (storeError || !store) {
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
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link to="/stores">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div className="flex-1">
          <h1 className="text-3xl font-bold tracking-tight">{store.name}</h1>
          <a
            href={store.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-muted-foreground hover:text-foreground"
          >
            {store.url}
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
            <CardDescription>
              Products from this store ({productsData?.totalCount ?? 0} total)
            </CardDescription>
          </div>
          <Button asChild>
            <Link to={`/products/new?storeId=${storeId}`}>
              <Plus className="mr-2 h-4 w-4" />
              Add Product
            </Link>
          </Button>
        </CardHeader>
        <CardContent>
          {productsLoading ? (
            <div className="text-center py-8 text-muted-foreground">
              Loading products...
            </div>
          ) : productsData?.items.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No products from this store yet.
            </div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Current Price</TableHead>
                    <TableHead>Change</TableHead>
                    <TableHead>Last Updated</TableHead>
                    <TableHead className="w-[100px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {productsData?.items.map(product => (
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

              {productsData && (
                <div className="mt-4">
                  <Pagination
                    currentPage={productsData.pageNumber}
                    totalPages={productsData.totalPages}
                    onPageChange={handlePageChange}
                  />
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
