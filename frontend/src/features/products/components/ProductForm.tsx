import { Link } from 'react-router';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  useForm,
  type SubmitHandler,
  Controller,
  type Resolver,
} from 'react-hook-form';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  addProductSchema,
  editProductSchema,
  type AddProduct,
  type EditProduct,
  type Product,
} from '#/features/products/schemas';
import { StoreSelect } from '@/features/stores/components/StoreSelect';

type ProductFormProps =
  | {
      product?: undefined;
      isPending: boolean;
      onSubmit: SubmitHandler<AddProduct>;
      defaultStoreId?: string;
    }
  | {
      product: Product;
      isPending: boolean;
      onSubmit: SubmitHandler<EditProduct>;
      defaultStoreId?: string;
    };

export function ProductForm({
  product,
  isPending,
  onSubmit,
  defaultStoreId,
}: ProductFormProps) {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<AddProduct | EditProduct>({
    resolver: (product
      ? zodResolver(editProductSchema)
      : zodResolver(addProductSchema)) as Resolver<AddProduct | EditProduct>,
    defaultValues: product ?? {
      currency: 'USD',
      storeId: defaultStoreId,
    },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link to={product ? `/products/${product.productId}` : '/products'}>
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {product ? 'Edit Product' : 'Add Product'}
          </h1>
          <p className="text-muted-foreground">
            {product
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
          <form
            onSubmit={handleSubmit(
              onSubmit as SubmitHandler<AddProduct | EditProduct>
            )}
            className="space-y-4"
          >
            {!product && (
              <Controller
                name="storeId"
                control={control}
                render={({ field }) => (
                  <StoreSelect
                    value={field.value}
                    onValueChange={field.onChange}
                    disabled={isPending}
                    label="Store"
                    errorMessage={
                      'storeId' in errors ? errors.storeId?.message : undefined
                    }
                  />
                )}
              />
            )}

            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                placeholder="Product name"
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
                placeholder="https://example.com/product"
                disabled={isPending}
                {...register('url')}
              />
              {errors.url && (
                <p className="text-sm text-destructive">{errors.url.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="currency">Currency</Label>
              <Input
                id="currency"
                placeholder="USD"
                maxLength={3}
                disabled={isPending}
                {...register('currency')}
              />
              {errors.currency && (
                <p className="text-sm text-destructive">
                  {errors.currency.message}
                </p>
              )}
              <p className="text-xs text-muted-foreground">
                3-letter currency code (e.g., USD, EUR, GBP)
              </p>
            </div>

            <div className="flex gap-2 pt-4">
              <Button type="submit" disabled={isPending}>
                {isPending
                  ? 'Saving...'
                  : product
                    ? 'Update Product'
                    : 'Create Product'}
              </Button>
              <Button type="button" variant="outline" asChild>
                <Link
                  to={product ? `/products/${product.productId}` : '/products'}
                >
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
