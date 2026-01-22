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
  const { data, isLoading, error } = usePriceHistory(productId);

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
          {data.items.map(item => {
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
          <Pagination totalPages={data.totalPages} />
        </div>
      )}
    </>
  );
}
