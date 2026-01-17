import { TrendingDown, TrendingUp, Minus } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PriceChangeIndicatorProps {
  change: number | null;
}

export function PriceChangeIndicator({ change }: PriceChangeIndicatorProps) {
  if (change === null || change === 0) {
    return (
      <span className="flex items-center gap-1 text-muted-foreground">
        <Minus className="h-4 w-4" />
        <span>0%</span>
      </span>
    );
  }

  const isNegative = change < 0;
  const Icon = isNegative ? TrendingDown : TrendingUp;

  return (
    <span
      className={cn(
        'flex items-center gap-1',
        isNegative ? 'text-green-500' : 'text-red-500'
      )}
    >
      <Icon className="h-4 w-4" />
      <span>
        {isNegative ? '' : '+'}
        {change.toFixed(2)}%
      </span>
    </span>
  );
}
