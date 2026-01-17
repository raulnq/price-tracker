import { useRef, useState } from 'react';
import { Link, useNavigate, useParams, useSearchParams } from 'react-router';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useProduct, useCreateProduct, useUpdateProduct } from '../useProducts';
import { useStores } from '@/features/stores/useStores';

export function ProductForm() {
  const { productId } = useParams<{ productId: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const isEdit = !!productId;

  const preselectedStoreId = searchParams.get('storeId') ?? '';

  const { data: product, isLoading: productLoading } = useProduct(
    productId ?? ''
  );
  const { data: storesData, isLoading: storesLoading } = useStores({
    pageSize: 100,
    pageNumber: 1,
  });
  const createMutation = useCreateProduct();
  const updateMutation = useUpdateProduct(productId ?? '');

  const nameRef = useRef<HTMLInputElement>(null);
  const urlRef = useRef<HTMLInputElement>(null);
  const currencyRef = useRef<HTMLInputElement>(null);
  const [storeId, setStoreId] = useState(preselectedStoreId);
  const [errors, setErrors] = useState<{
    name?: string;
    url?: string;
    currency?: string;
    storeId?: string;
  }>({});

  const validate = () => {
    const name = nameRef.current?.value ?? '';
    const url = urlRef.current?.value ?? '';
    const currency = currencyRef.current?.value ?? '';
    const newErrors: typeof errors = {};

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

    if (!currency.trim()) {
      newErrors.currency = 'Currency is required';
    } else if (currency.length !== 3) {
      newErrors.currency = 'Currency must be exactly 3 characters';
    }

    if (!isEdit && !storeId) {
      newErrors.storeId = 'Store is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    const name = nameRef.current?.value ?? '';
    const url = urlRef.current?.value ?? '';
    const currency = currencyRef.current?.value?.toUpperCase() ?? '';

    if (isEdit) {
      await updateMutation.mutateAsync({ name, url, currency });
      navigate(`/products/${productId}`);
    } else {
      const result = await createMutation.mutateAsync({
        name,
        url,
        currency,
        storeId,
      });
      navigate(`/products/${result.productId}`);
    }
  };

  const isPending = createMutation.isPending || updateMutation.isPending;

  if ((isEdit && (productLoading || !product)) || storesLoading) {
    return (
      <div className="text-center py-8 text-muted-foreground">Loading...</div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link to={isEdit ? `/products/${productId}` : '/products'}>
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {isEdit ? 'Edit Product' : 'Add Product'}
          </h1>
          <p className="text-muted-foreground">
            {isEdit
              ? 'Update product information'
              : 'Add a new product to track'}
          </p>
        </div>
      </div>

      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle>Product Details</CardTitle>
          <CardDescription>Enter the product information.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {!isEdit && (
              <div className="space-y-2">
                <Label htmlFor="store">Store</Label>
                <Select
                  value={storeId}
                  onValueChange={setStoreId}
                  disabled={isPending}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a store" />
                  </SelectTrigger>
                  <SelectContent>
                    {storesData?.items.map(store => (
                      <SelectItem key={store.storeId} value={store.storeId}>
                        {store.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.storeId && (
                  <p className="text-sm text-destructive">{errors.storeId}</p>
                )}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                ref={nameRef}
                defaultValue={product?.name ?? ''}
                placeholder="Product name"
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
                ref={urlRef}
                type="url"
                defaultValue={product?.url ?? ''}
                placeholder="https://example.com/product"
                disabled={isPending}
              />
              {errors.url && (
                <p className="text-sm text-destructive">{errors.url}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="currency">Currency</Label>
              <Input
                id="currency"
                ref={currencyRef}
                defaultValue={product?.currency ?? 'USD'}
                placeholder="USD"
                maxLength={3}
                disabled={isPending}
              />
              {errors.currency && (
                <p className="text-sm text-destructive">{errors.currency}</p>
              )}
              <p className="text-xs text-muted-foreground">
                3-letter currency code (e.g., USD, EUR, GBP)
              </p>
            </div>

            <div className="flex gap-2 pt-4">
              <Button type="submit" disabled={isPending}>
                {isPending
                  ? 'Saving...'
                  : isEdit
                    ? 'Update Product'
                    : 'Create Product'}
              </Button>
              <Button type="button" variant="outline" asChild>
                <Link to={isEdit ? `/products/${productId}` : '/products'}>
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
