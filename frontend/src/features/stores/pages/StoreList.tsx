import { Link, useSearchParams } from 'react-router';
import { Plus, Search, ExternalLink, Pencil } from 'lucide-react';
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
import { useStores } from '../useStores';
import { StoreSearch } from '../components/StoreSearch';

function getHostname(url: string): string {
  try {
    return new URL(url).hostname;
  } catch {
    return url;
  }
}

export function StoreList() {
  const [searchParams] = useSearchParams();
  const search = searchParams.get('search') ?? '';
  const { data, isLoading, error } = useStores({ name: search });
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
          <StoreSearch />
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
              No stores found matching your search.
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
