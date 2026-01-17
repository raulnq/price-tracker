import { useRef } from 'react';
import { Link, useSearchParams } from 'react-router';
import { Plus, Search, Pencil } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Pagination } from '@/components/Pagination';
import { useProducts } from '../useProducts';
import { useStores } from '@/features/stores/useStores';
import { PriceChangeIndicator } from './PriceChangeIndicator';

export function ProductList() {
  const [searchParams, setSearchParams] = useSearchParams();
  const queryPage = searchParams.get('page') ?? 1;
  const page = Math.max(1, Math.floor(Number(queryPage)) || 1);
  const search = searchParams.get('search') || '';
  const storeFilter = searchParams.get('storeId') || '';
  const searchInputRef = useRef<HTMLInputElement>(null);

  const { data: storesData } = useStores({ pageSize: 100, pageNumber: 1 });
  const { data, isLoading, error } = useProducts({
    pageNumber: page,
    pageSize: 10,
    name: search || undefined,
    storeId: storeFilter || undefined,
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const value = searchInputRef.current?.value || '';
    setSearchParams(prev => {
      if (value) {
        prev.set('search', value);
      } else {
        prev.delete('search');
      }
      prev.delete('page');
      return prev;
    });
  };

  const handlePageChange = (newPage: number) => {
    setSearchParams(prev => {
      prev.set('page', newPage.toString());
      return prev;
    });
  };

  const handleStoreFilterChange = (value: string) => {
    setSearchParams(prev => {
      if (value && value !== 'all') {
        prev.set('storeId', value);
      } else {
        prev.delete('storeId');
      }
      prev.delete('page');
      return prev;
    });
  };

  const handleClearFilters = () => {
    setSearchParams({});
    if (searchInputRef.current) searchInputRef.current.value = '';
  };

  const storeMap = new Map(
    storesData?.items.map(s => [s.storeId, s.name]) ?? []
  );

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
          <div className="flex gap-2 mb-4 flex-wrap">
            <form
              onSubmit={handleSearch}
              className="flex gap-2 flex-1 min-w-[200px]"
            >
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search products..."
                  className="pl-8"
                  ref={searchInputRef}
                  defaultValue={search}
                />
              </div>
              <Button type="submit" variant="secondary">
                Search
              </Button>
            </form>

            <Select
              value={storeFilter || 'all'}
              onValueChange={handleStoreFilterChange}
            >
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Filter by store" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Stores</SelectItem>
                {storesData?.items.map(store => (
                  <SelectItem key={store.storeId} value={store.storeId}>
                    {store.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {(search || storeFilter) && (
              <Button
                variant="ghost"
                type="button"
                onClick={handleClearFilters}
              >
                Clear Filters
              </Button>
            )}
          </div>

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
              {search || storeFilter
                ? 'No products found matching your filters.'
                : 'No products yet. Add your first product!'}
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
                          {storeMap.get(product.storeId) ?? 'Unknown'}
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
                  <Pagination
                    currentPage={data.pageNumber}
                    totalPages={data.totalPages}
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
