import { usePriceHistory } from '../usePriceHistory';
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

export function PriceHistoryChart({
  productId,
  currency,
}: PriceHistoryChartProps) {
  const { data, isLoading, error } = usePriceHistory(productId, {
    pageSize: 100,
    pageNumber: 1,
  });

  if (isLoading) {
    return (
      <div className="h-[300px] flex items-center justify-center text-muted-foreground">
        Loading chart...
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-[300px] flex items-center justify-center text-destructive">
        Error loading price history
      </div>
    );
  }

  if (!data?.items.length) {
    return (
      <div className="h-[300px] flex items-center justify-center text-muted-foreground">
        No price history data available
      </div>
    );
  }

  const chartData = data.items
    .map(item => ({
      date: new Date(item.timestamp).toLocaleDateString(),
      price: item.price,
      timestamp: new Date(item.timestamp).getTime(),
    }))
    .sort((a, b) => a.timestamp - b.timestamp);

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
