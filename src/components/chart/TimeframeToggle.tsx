'use client';

import { cn } from '@/lib/cn';
import type { Timeframe } from '@/lib/chart/types';

const TIMEFRAMES: Array<{ key: Timeframe; label: string }> = [
  { key: '1h', label: '1H' },
  { key: '6h', label: '6H' },
  { key: '1d', label: '1D' },
  { key: '1w', label: '1W' },
  { key: '1m', label: '1M' },
  { key: 'all', label: 'ALL' },
];

export interface TimeframeToggleProps {
  value: Timeframe;
  onChange: (timeframe: Timeframe) => void;
  className?: string;
}

/**
 * Timeframe selector for the event detail price chart.
 */
export function TimeframeToggle({
  value,
  onChange,
  className,
}: TimeframeToggleProps) {
  return (
    <div className={cn('flex flex-wrap gap-1', className)}>
      {TIMEFRAMES.map((timeframe) => {
        const isActive = timeframe.key === value;

        return (
          <button
            key={timeframe.key}
            type="button"
            aria-pressed={isActive}
            onClick={() => onChange(timeframe.key)}
            className={cn(
              'inline-flex h-9 items-center rounded-md px-1.5',
              'text-sm leading-5 font-semibold transition-colors',
              'focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none',
              isActive
                ? 'bg-surface-2 text-text'
                : 'text-muted hover:bg-black/5 hover:text-text',
            )}
          >
            {timeframe.label}
          </button>
        );
      })}
    </div>
  );
}
