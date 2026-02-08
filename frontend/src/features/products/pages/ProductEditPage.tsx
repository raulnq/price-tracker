import { useNavigate, useParams } from 'react-router';
import { toast } from 'sonner';
import { type SubmitHandler } from 'react-hook-form';
import { useEditProduct, useProductSuspense } from '../useProducts';
import { ProductForm } from '../components/ProductForm';
import { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { QueryErrorResetBoundary } from '@tanstack/react-query';
import type { EditProduct } from '#/features/products/schemas';

function ProductEditSkeleton() {
  return (
    <div className="text-center py-8 text-muted-foreground">Loading...</div>
  );
}

function ProductEditError({
  resetErrorBoundary,
}: {
  resetErrorBoundary: () => void;
}) {
  return (
    <>
      <div className="text-center py-8 text-destructive">
        Failed to load product. Please try again.
      </div>
      <button onClick={resetErrorBoundary} className="underline" type="button">
        Try again
      </button>
    </>
  );
}

export function ProductEditPage() {
  return (
    <QueryErrorResetBoundary>
      {({ reset }) => (
        <ErrorBoundary onReset={reset} FallbackComponent={ProductEditError}>
          <Suspense fallback={<ProductEditSkeleton />}>
            <ProductEdit />
          </Suspense>
        </ErrorBoundary>
      )}
    </QueryErrorResetBoundary>
  );
}

function ProductEdit() {
  const { productId } = useParams<{ productId: string }>();
  const navigate = useNavigate();
  const { data } = useProductSuspense(productId!);
  const edit = useEditProduct(productId!);
  const handleSubmit: SubmitHandler<EditProduct> = async formData => {
    try {
      const result = await edit.mutateAsync(formData);
      toast.success('Product updated successfully');
      navigate(`/products/${result.productId}`);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : 'Failed to save product'
      );
    }
  };

  return (
    <ProductForm
      product={data}
      onSubmit={handleSubmit}
      isPending={edit.isPending}
    />
  );
}
