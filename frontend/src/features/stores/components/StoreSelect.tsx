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
  error?: string;
  className?: string;
}

export function StoreSelect({
  value,
  onValueChange,
  disabled,
  label,
  placeholder = 'Select a store',
  showAllOption = false,
  error,
  className,
}: StoreSelectProps) {
  const { data: storesData } = useStoreOptions();

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
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
}
