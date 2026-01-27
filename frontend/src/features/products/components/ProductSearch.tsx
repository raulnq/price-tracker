import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { useRef } from 'react';
import { useSearchParams } from 'react-router';
import { StoreSelect } from '@/features/stores/components/StoreSelect';

export function ProductSearch() {
  const [searchParams, setSearchParams] = useSearchParams();
  const name = searchParams.get('name') ?? '';
  const searchInputRef = useRef<HTMLInputElement>(null);
  const storeId = searchParams.get('storeId') || '';
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const value = searchInputRef.current?.value || '';
    setSearchParams(prev => {
      if (value) {
        prev.set('name', value);
      } else {
        prev.delete('name');
      }
      prev.set('page', '1');
      return prev;
    });
  };

  const handleStoreFilterChange = (value: string) => {
    setSearchParams(prev => {
      if (value && value !== 'all') {
        prev.set('storeId', value);
      } else {
        prev.delete('storeId');
      }
      prev.set('page', '1');
      return prev;
    });
  };

  const handleClearFilters = () => {
    setSearchParams({});
    if (searchInputRef.current) searchInputRef.current.value = '';
  };

  return (
    <div className="flex gap-2 mb-4 flex-wrap">
      <form onSubmit={handleSearch} className="flex gap-2 flex-1 min-w-[200px]">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search products..."
            className="pl-8"
            ref={searchInputRef}
            defaultValue={name}
          />
        </div>
        <Button type="submit" variant="secondary">
          Search
        </Button>
      </form>

      <StoreSelect
        value={storeId || 'all'}
        onValueChange={handleStoreFilterChange}
        showAllOption
        placeholder="Filter by store"
        className="w-[200px]"
      />

      {(name || storeId) && (
        <Button variant="ghost" type="button" onClick={handleClearFilters}>
          Clear Filters
        </Button>
      )}
    </div>
  );
}
