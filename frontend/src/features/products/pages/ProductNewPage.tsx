import { useNavigate, useSearchParams } from 'react-router';
import { toast } from 'sonner';
import { type SubmitHandler } from 'react-hook-form';
import { useAddProduct } from '../useProducts';
import { ProductForm } from '../components/ProductForm';
import type { AddProduct } from '#/features/products/schemas';

export function ProductNewPage() {
  const navigate = useNavigate();
  const add = useAddProduct();
  const [searchParams] = useSearchParams();
  const preselectedStoreId = searchParams.get('storeId') ?? '';
  const handleSubmit: SubmitHandler<AddProduct> = async formData => {
    try {
      const result = await add.mutateAsync(formData);
      toast.success('Product created successfully');
      navigate(`/products/${result.productId}`);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : 'Failed to save product'
      );
    }
  };
  return (
    <ProductForm
      onSubmit={handleSubmit}
      isPending={add.isPending}
      defaultStoreId={preselectedStoreId}
    />
  );
}
