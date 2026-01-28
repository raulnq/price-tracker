import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Pagination } from '@/components/Pagination';
import { usePriceHistorySuspense } from '../usePriceHistory';

interface PriceHistoryTableProps {
  productId: string;
  currency: string;
}

export function PriceHistoryTableSkeleton() {
  return (
    <div className="text-center py-8 text-muted-foreground">
      Loading price history...
    </div>
  );
}

export function PriceHistoryTableError({
  resetErrorBoundary,
}: {
  resetErrorBoundary: () => void;
}) {
  return (
    <>
      <div className="text-center py-8 text-destructive">
        Failed to load price history. Please try again.
      </div>
      <button onClick={resetErrorBoundary} className="underline" type="button">
        Try again
      </button>
    </>
  );
}

export function PriceHistoryTable({
  productId,
  currency,
}: PriceHistoryTableProps) {
  const { data } = usePriceHistorySuspense(productId);

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
      <div className="mt-4">
        <Pagination totalPages={data.totalPages} />
      </div>
    </>
  );
}
