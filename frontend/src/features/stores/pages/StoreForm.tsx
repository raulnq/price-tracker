import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useStore, useAddStore, useEditStore } from '../useStores';

export function StoreForm() {
  const { storeId } = useParams<{ storeId: string }>();
  const navigate = useNavigate();
  const isEdit = !!storeId;

  const {
    data: store,
    isLoading: storeLoading,
    isError: storeError,
  } = useStore(storeId ?? '');
  const addMutation = useAddStore();
  const editMutation = useEditStore(storeId ?? '');
  const [errors, setErrors] = useState<{ name?: string; url?: string }>({});

  const validate = (formData: FormData) => {
    const name = (formData.get('name') as string) ?? '';
    const url = (formData.get('url') as string) ?? '';
    const newErrors: { name?: string; url?: string } = {};

    if (!name.trim()) {
      newErrors.name = 'Name is required';
    } else if (name.length > 1024) {
      newErrors.name = 'Name must be at most 1024 characters';
    }

    if (!url.trim()) {
      newErrors.url = 'URL is required';
    } else {
      try {
        new URL(url);
      } catch {
        newErrors.url = 'Please enter a valid URL';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget as HTMLFormElement);
    if (!validate(formData)) return;

    const name = formData.get('name') as string;
    const url = formData.get('url') as string;

    try {
      if (isEdit) {
        await editMutation.mutateAsync({ name, url });
        navigate(`/stores/${storeId}`);
      } else {
        const result = await addMutation.mutateAsync({ name, url });
        navigate(`/stores/${result.storeId}`);
      }
    } catch (error) {
      console.error('Failed to save store:', error);
    }
  };

  const isPending = addMutation.isPending || editMutation.isPending;
  const mutationError = addMutation.error || editMutation.error;

  if (isEdit && storeError) {
    return (
      <div className="text-center py-8 text-destructive">
        Failed to load store. Please try again.
      </div>
    );
  }

  if (isEdit && storeLoading) {
    return (
      <div className="text-center py-8 text-muted-foreground">Loading...</div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link to={isEdit ? `/stores/${storeId}` : '/stores'}>
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {isEdit ? 'Edit Store' : 'Add Store'}
          </h1>
          <p className="text-muted-foreground">
            {isEdit ? 'Update store information' : 'Add a new store to track'}
          </p>
        </div>
      </div>

      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle>Store Details</CardTitle>
          <CardDescription>Enter the store name and URL.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {mutationError && (
              <div className="text-sm text-destructive">
                {mutationError instanceof Error
                  ? mutationError.message
                  : 'Failed to save store'}
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                name="name"
                defaultValue={store?.name ?? ''}
                placeholder="Store name"
                disabled={isPending}
              />
              {errors.name && (
                <p className="text-sm text-destructive">{errors.name}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="url">URL</Label>
              <Input
                id="url"
                type="url"
                name="url"
                defaultValue={store?.url ?? ''}
                placeholder="https://example.com"
                disabled={isPending}
              />
              {errors.url && (
                <p className="text-sm text-destructive">{errors.url}</p>
              )}
            </div>

            <div className="flex gap-2 pt-4">
              <Button type="submit" disabled={isPending}>
                {isPending
                  ? 'Saving...'
                  : isEdit
                    ? 'Update Store'
                    : 'Create Store'}
              </Button>
              <Button type="button" variant="outline" asChild>
                <Link to={isEdit ? `/stores/${storeId}` : '/stores'}>
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
