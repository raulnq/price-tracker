import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useCreatePriceHistory } from '@/features/products/usePriceHistory';

interface AddPriceDialogProps {
  productId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AddPriceDialog({
  productId,
  open,
  onOpenChange,
}: AddPriceDialogProps) {
  const [error, setError] = useState<string | null>(null);

  const createMutation = useCreatePriceHistory(productId);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const priceValue = parseFloat(formData.get('price') as string);

    if (isNaN(priceValue) || priceValue <= 0) {
      setError('Please enter a valid positive price');
      return;
    }

    try {
      await createMutation.mutateAsync({ price: priceValue });
      e.currentTarget.reset();
      setError(null);
      onOpenChange(false);
    } catch (err) {
      setError('Failed to add price. Please try again.');
      console.error('Failed to add price:', err);
    }
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      setError(null);
    }
    onOpenChange(open);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Price Entry</DialogTitle>
          <DialogDescription>
            Record a new price for this product.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="price">Price</Label>
              <Input
                id="price"
                name="price"
                type="number"
                step="0.01"
                min="0.01"
                placeholder="0.00"
                disabled={createMutation.isPending}
              />
              {error && <p className="text-sm text-destructive">{error}</p>}
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => handleOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={createMutation.isPending}>
              {createMutation.isPending ? 'Adding...' : 'Add Price'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
