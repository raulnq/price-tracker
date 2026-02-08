import { useNavigate } from 'react-router';
import { toast } from 'sonner';
import { type SubmitHandler } from 'react-hook-form';
import { useAddStore } from '../useStores';
import { type AddStore } from '#/features/stores/schemas';
import { StoreForm } from '../components/StoreForm';

export function StoreNewPage() {
  const navigate = useNavigate();
  const add = useAddStore();
  const handleSubmit: SubmitHandler<AddStore> = async formData => {
    try {
      const result = await add.mutateAsync(formData);
      toast.success('Store created successfully');
      navigate(`/stores/${result.storeId}`);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : 'Failed to save store'
      );
    }
  };
  return <StoreForm onSubmit={handleSubmit} isPending={add.isPending} />;
}
