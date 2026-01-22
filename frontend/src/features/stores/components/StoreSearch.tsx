import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { useRef } from 'react';
import { useSearchParams } from 'react-router';

export function StoreSearch() {
  const [searchParams, setSearchParams] = useSearchParams();
  const search = searchParams.get('search') ?? '';
  const searchInputRef = useRef<HTMLInputElement>(null);
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchParams(prev => {
      const value = searchInputRef.current?.value ?? '';
      if (value) {
        prev.set('search', value);
      } else {
        prev.delete('search');
      }
      prev.set('page', '1');
      return prev;
    });
  };

  const handleClear = () => {
    if (searchInputRef.current) {
      searchInputRef.current.value = '';
    }
    setSearchParams(prev => {
      prev.delete('search');
      prev.set('page', '1');
      return prev;
    });
  };

  return (
    <form onSubmit={handleSearch} className="flex gap-2 mb-4">
      <div className="relative flex-1 max-w-sm">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          ref={searchInputRef}
          placeholder="Search stores..."
          defaultValue={search}
          className="pl-8"
        />
      </div>
      <Button type="submit" variant="secondary">
        Search
      </Button>
      {search && (
        <Button type="button" variant="ghost" onClick={handleClear}>
          Clear
        </Button>
      )}
    </form>
  );
}
