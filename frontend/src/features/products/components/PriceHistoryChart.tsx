import { useMemo } from 'react';
import { usePriceHistorySuspense } from '../usePriceHistory';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

interface PriceHistoryChartProps {
  productId: string;
  currency: string;
}

export function PriceHistoryChartSkeleton() {
  return (
    <div className="h-[300px] flex items-center justify-center text-muted-foreground">
      Loading chart...
    </div>
  );
}

export function PriceHistoryChartError({
  resetErrorBoundary,
}: {
  resetErrorBoundary: () => void;
}) {
  return (
    <>
      <div className="h-[300px] flex items-center justify-center text-destructive">
        Failed to load price history chart. Please try again.
      </div>
      <button onClick={resetErrorBoundary} className="underline" type="button">
        Try again
      </button>
    </>
  );
}

export function PriceHistoryChart({
  productId,
  currency,
}: PriceHistoryChartProps) {
  const { data } = usePriceHistorySuspense(productId, {
    pageSize: 100,
    pageNumber: 1,
  });

  const chartData = useMemo(() => {
    const items = data?.items;
    if (!items?.length) return [];
    return items
      .map(item => {
        const date = new Date(item.timestamp);
        return {
          date: date.toLocaleDateString(),
          price: item.price,
          timestamp: date.getTime(),
        };
      })
      .sort((a, b) => a.timestamp - b.timestamp);
  }, [data]);

  if (!chartData.length) {
    return (
      <div className="h-[300px] flex items-center justify-center text-muted-foreground">
        No price history data available
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart
        data={chartData}
        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
        <XAxis
          dataKey="date"
          className="text-xs"
          tick={{ fill: 'currentColor' }}
        />
        <YAxis
          className="text-xs"
          tick={{ fill: 'currentColor' }}
          tickFormatter={value => `${value} ${currency}`}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: 'hsl(var(--card))',
            border: '1px solid hsl(var(--border))',
            borderRadius: '0.5rem',
          }}
          labelStyle={{ color: 'hsl(var(--foreground))' }}
          formatter={value => [
            `${Number(value).toFixed(2)} ${currency}`,
            'Price',
          ]}
        />
        <Line
          type="monotone"
          dataKey="price"
          stroke="hsl(var(--primary))"
          strokeWidth={2}
          dot={{ fill: 'hsl(var(--primary))' }}
          activeDot={{ r: 6 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
