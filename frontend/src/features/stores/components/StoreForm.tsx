import { Link } from 'react-router';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useForm, type SubmitHandler, type Resolver } from 'react-hook-form';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  addStoreSchema,
  editStoreSchema,
  type AddStore,
  type EditStore,
  type Store,
} from '@price-tracker/backend/features/stores/schemas';

type StoreFormProps =
  | {
      store?: undefined;
      isPending: boolean;
      onSubmit: SubmitHandler<AddStore>;
    }
  | {
      store: Store;
      isPending: boolean;
      onSubmit: SubmitHandler<EditStore>;
    };

export function StoreForm({ store, isPending, onSubmit }: StoreFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AddStore | EditStore>({
    resolver: (store
      ? zodResolver(editStoreSchema)
      : zodResolver(addStoreSchema)) as Resolver<AddStore | EditStore>,
    defaultValues: store,
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link to={store ? `/stores/${store.storeId}` : '/stores'}>
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {store ? 'Edit Store' : 'Add Store'}
          </h1>
          <p className="text-muted-foreground">
            {store ? 'Update store information' : 'Add a new store to track'}
          </p>
        </div>
      </div>

      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle>Store Details</CardTitle>
          <CardDescription>Enter the store name and URL.</CardDescription>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={handleSubmit(
              onSubmit as SubmitHandler<AddStore | EditStore>
            )}
            className="space-y-4"
          >
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                placeholder="Store name"
                disabled={isPending}
                {...register('name')}
              />
              {errors.name && (
                <p className="text-sm text-destructive">
                  {errors.name.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="url">URL</Label>
              <Input
                id="url"
                placeholder="https://example.com"
                disabled={isPending}
                {...register('url')}
              />
              {errors.url && (
                <p className="text-sm text-destructive">{errors.url.message}</p>
              )}
            </div>

            <div className="flex gap-2 pt-4">
              <Button type="submit" disabled={isPending}>
                {isPending
                  ? 'Saving...'
                  : store
                    ? 'Update Store'
                    : 'Create Store'}
              </Button>
              <Button type="button" variant="outline" asChild>
                <Link to={store ? `/stores/${store.storeId}` : '/stores'}>
                  Cancel
                </Link>
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
