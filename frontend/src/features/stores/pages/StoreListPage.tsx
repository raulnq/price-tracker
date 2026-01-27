import { Link } from 'react-router';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { StoreSearch } from '../components/StoreSearch';
import { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import {
  StoresError,
  StoresSkeleton,
  StoresTable,
} from '../components/StoresTable';

export function StoreListPage() {
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
          <ErrorBoundary FallbackComponent={StoresError}>
            <Suspense fallback={<StoresSkeleton />}>
              <StoresTable />
            </Suspense>
          </ErrorBoundary>
        </CardContent>
      </Card>
    </div>
  );
}
