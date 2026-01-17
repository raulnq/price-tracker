import { useRef } from 'react';
import { Link, useSearchParams } from 'react-router';
import { Plus, Search, ExternalLink, Pencil } from 'lucide-react';
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
import { Pagination } from '@/components/Pagination';
import { useStores } from '../useStores';

function getHostname(url: string): string {
  try {
    return new URL(url).hostname;
  } catch {
    return url;
  }
}

export function StoreList() {
  const [searchParams, setSearchParams] = useSearchParams();
  const queryPage = searchParams.get('page') ?? '1';
  const page = Math.max(1, Math.floor(Number(queryPage)) || 1);
  const search = searchParams.get('search') ?? '';
  const searchInputRef = useRef<HTMLInputElement>(null);

  const { data, isLoading, error } = useStores({
    pageNumber: page,
    pageSize: 10,
    name: search || undefined,
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchParams(prev => {
      const value = searchInputRef.current?.value ?? '';
      if (value) {
        prev.set('search', value);
      } else {
        prev.delete('search');
      }
      prev.set('page', '1');
      return prev;
    });
  };

  const handleClear = () => {
    if (searchInputRef.current) {
      searchInputRef.current.value = '';
    }
    setSearchParams(prev => {
      prev.delete('search');
      prev.set('page', '1');
      return prev;
    });
  };

  const handlePageChange = (newPage: number) => {
    setSearchParams(prev => {
      prev.set('page', newPage.toString());
      return prev;
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Stores</h1>
          <p className="text-muted-foreground">Manage your tracked stores</p>
        </div>
        <Button asChild>
          <Link to="/stores/new">
            <Plus className="mr-2 h-4 w-4" />
            Add Store
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Stores</CardTitle>
          <CardDescription>
            A list of all stores you are tracking prices from.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSearch} className="flex gap-2 mb-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                ref={searchInputRef}
                placeholder="Search stores..."
                defaultValue={search}
                className="pl-8"
              />
            </div>
            <Button type="submit" variant="secondary">
              Search
            </Button>
            {search && (
              <Button type="button" variant="ghost" onClick={handleClear}>
                Clear
              </Button>
            )}
          </form>

          {isLoading ? (
            <div className="text-center py-8 text-muted-foreground">
              Loading...
            </div>
          ) : error ? (
            <div className="text-center py-8 text-destructive">
              Error loading stores. Please try again.
            </div>
          ) : data?.items.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              {search
                ? 'No stores found matching your search.'
                : 'No stores yet. Add your first store!'}
            </div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>URL</TableHead>
                    <TableHead className="w-[100px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data?.items.map(store => (
                    <TableRow key={store.storeId}>
                      <TableCell className="font-medium">
                        <Link
                          to={`/stores/${store.storeId}`}
                          className="hover:underline"
                        >
                          {store.name}
                        </Link>
                      </TableCell>
                      <TableCell>
                        <a
                          href={store.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 text-muted-foreground hover:text-foreground"
                        >
                          {getHostname(store.url)}
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button variant="ghost" size="icon" asChild>
                            <Link to={`/stores/${store.storeId}`}>
                              <Search className="h-4 w-4" />
                            </Link>
                          </Button>
                          <Button variant="ghost" size="icon" asChild>
                            <Link to={`/stores/${store.storeId}/edit`}>
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
