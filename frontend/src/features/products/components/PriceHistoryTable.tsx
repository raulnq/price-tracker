import { useSearchParams } from 'react-router';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Pagination } from '@/components/Pagination';
import { usePriceHistory } from '../usePriceHistory';

interface PriceHistoryTableProps {
  productId: string;
  currency: string;
}

export function PriceHistoryTable({
  productId,
  currency,
}: PriceHistoryTableProps) {
  const [searchParams, setSearchParams] = useSearchParams();
  const page = Number(searchParams.get('historyPage')) || 1;

  const handlePageChange = (newPage: number) => {
    setSearchParams(prev => {
      prev.set('historyPage', newPage.toString());
      return prev;
    });
  };

  const { data, isLoading, error } = usePriceHistory(productId, {
    pageNumber: page,
    pageSize: 10,
  });

  if (isLoading) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        Loading price history...
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8 text-destructive">
        Error loading price history
      </div>
    );
  }

  if (!data?.items.length) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No price history data available
      </div>
    );
  }

  const sortedItems = [...data.items].sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Time</TableHead>
            <TableHead className="text-right">Price</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedItems.map(item => {
            const date = new Date(item.timestamp);
            return (
              <TableRow key={item.priceHistoryId}>
                <TableCell>{date.toLocaleDateString()}</TableCell>
                <TableCell className="text-muted-foreground">
                  {date.toLocaleTimeString()}
                </TableCell>
                <TableCell className="text-right font-medium">
                  {item.price.toFixed(2)} {currency}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>

      {data && (
        <div className="mt-4">
          <Pagination
            currentPage={data.pageNumber}
            totalPages={data.totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      )}
    </>
  );
}
