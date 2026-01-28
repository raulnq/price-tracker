import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useStoreOptions } from '../useStores';

interface StoreSelectProps {
  value: string;
  onValueChange: (value: string) => void;
  disabled?: boolean;
  label?: string;
  placeholder?: string;
  showAllOption?: boolean;
  errorMessage?: string;
  className?: string;
}

export function StoreSelect({
  value,
  onValueChange,
  disabled,
  label,
  placeholder = 'Select a store',
  showAllOption = false,
  errorMessage,
  className,
}: StoreSelectProps) {
  const { data: storesData, isLoading, error } = useStoreOptions();

  if (isLoading) {
    return (
      <div className="space-y-2">
        {label && <Label>{label}</Label>}
        <Select disabled>
          <SelectTrigger>
            <SelectValue placeholder="Loading stores..." />
          </SelectTrigger>
        </Select>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-2">
        {label && <Label>{label}</Label>}
        <Select disabled>
          <SelectTrigger>
            <SelectValue placeholder="Failed to load stores" />
          </SelectTrigger>
        </Select>
        <p className="text-sm text-destructive">{error.message}</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {label && <Label>{label}</Label>}
      <Select value={value} onValueChange={onValueChange} disabled={disabled}>
        <SelectTrigger className={className}>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {showAllOption && <SelectItem value="all">All Stores</SelectItem>}
          {storesData?.items.map(store => (
            <SelectItem key={store.storeId} value={store.storeId}>
              {store.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {errorMessage && (
        <p className="text-sm text-destructive">{errorMessage}</p>
      )}
    </div>
  );
}
