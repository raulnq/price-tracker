import { Link, useSearchParams } from 'react-router';
import { Search, ExternalLink, Pencil } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Pagination } from '@/components/Pagination';
import { useStoresSuspense } from '../useStores';

function getHostname(url: string): string {
  try {
    return new URL(url).hostname;
  } catch {
    return url;
  }
}

export function StoresSkeleton() {
  return (
    <div className="text-center py-8 text-muted-foreground">Loading...</div>
  );
}

export function StoresError({
  resetErrorBoundary,
}: {
  resetErrorBoundary: () => void;
}) {
  return (
    <div className="text-center py-8 text-destructive">
      Error loading stores.{' '}
      <button onClick={resetErrorBoundary} className="underline" type="button">
        Try again
      </button>
    </div>
  );
}

export function StoresTable() {
  const [searchParams] = useSearchParams();
  const name = searchParams.get('name') ?? '';
  const { data } = useStoresSuspense({ name: name });

  if (data.items.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No stores found matching your search.
      </div>
    );
  }

  return (
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
      <div className="mt-4">
        <Pagination totalPages={data.totalPages} />
      </div>
    </>
  );
}
