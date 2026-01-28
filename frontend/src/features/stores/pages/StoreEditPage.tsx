import { useNavigate, useParams } from 'react-router';
import { toast } from 'sonner';
import { type SubmitHandler } from 'react-hook-form';
import { useEditStore, useStoreSuspense } from '../useStores';
import { type EditStore } from '@price-tracker/backend/features/stores/schemas';
import { StoreForm } from '../components/StoreForm';
import { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { QueryErrorResetBoundary } from '@tanstack/react-query';

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
      <button onClick={resetErrorBoundary} className="underline" type="button">
        Try again
      </button>
    </>
  );
}

export function StoreEditPage() {
  return (
    <QueryErrorResetBoundary>
      {({ reset }) => (
        <ErrorBoundary onReset={reset} FallbackComponent={StoreEditError}>
          <Suspense fallback={<StoreEditSkeleton />}>
            <StoreEdit />
          </Suspense>
        </ErrorBoundary>
      )}
    </QueryErrorResetBoundary>
  );
}

function StoreEdit() {
  const { storeId } = useParams<{ storeId: string }>();
  const navigate = useNavigate();
  const { data } = useStoreSuspense(storeId!);
  const edit = useEditStore(storeId!);
  const handleSubmit: SubmitHandler<EditStore> = async formData => {
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
