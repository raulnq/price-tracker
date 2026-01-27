import { useNavigate, useParams } from 'react-router';
import { toast } from 'sonner';
import { type SubmitHandler } from 'react-hook-form';
import { useEditStore, useStoreSuspense } from '../useStores';
import { type AddStore } from '@price-tracker/backend/features/stores/schemas';
import { StoreForm } from '../components/StoreForm';
import { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';

function StoreEditSkeleton() {
  return (
    <div className="text-center py-8 text-muted-foreground">Loading...</div>
  );
}

function StoreEditError({
  resetErrorBoundary,
}: {
  resetErrorBoundary: () => void;
}) {
  return (
    <>
      <div className="text-center py-8 text-destructive">
        Failed to load store. Please try again.
      </div>
      <button onClick={resetErrorBoundary} className="underline">
        Try again
      </button>
    </>
  );
}

export function StoreEditPage() {
  return (
    <ErrorBoundary FallbackComponent={StoreEditError}>
      <Suspense fallback={<StoreEditSkeleton />}>
        <StoreEdit />
      </Suspense>
    </ErrorBoundary>
  );
}

function StoreEdit() {
  const { storeId } = useParams<{ storeId: string }>();
  const navigate = useNavigate();
  const { data } = useStoreSuspense(storeId!);
  const edit = useEditStore(storeId!);
  const handleSubmit: SubmitHandler<AddStore> = async formData => {
    try {
      const result = await edit.mutateAsync(formData);
      toast.success('Store updated successfully');
      navigate(`/stores/${result.storeId}`);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : 'Failed to save store'
      );
    }
  };

  return (
    <StoreForm
      store={data}
      onSubmit={handleSubmit}
      isPending={edit.isPending}
    />
  );
}
