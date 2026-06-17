'use client';

import { ChevronDown } from 'lucide-react';
import type { MarketSort } from '@/lib/markets/types';
import { cn } from '@/lib/cn';

export interface MarketSortSelectProps {
  value: MarketSort;
  onChange: (value: MarketSort) => void;
  className?: string;
}

const SORT_LABELS: Record<MarketSort, string> = {
  volume: '24hr Volume',
  newest: 'Newest',
};

/**
 * Sort dropdown styled like Polymarket's volume control.
 */
export function MarketSortSelect({ value, onChange, className }: MarketSortSelectProps) {
  return (
    <label className={cn('relative inline-flex items-center', className)}>
      <span className="sr-only">Sort markets</span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value as MarketSort)}
        className={cn(
          'h-8 appearance-none rounded-md border border-border bg-surface pr-7 pl-2.5',
          'text-sm leading-5 font-medium text-text',
          'focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none',
        )}
      >
        {(Object.keys(SORT_LABELS) as MarketSort[]).map((key) => (
          <option key={key} value={key}>
            {SORT_LABELS[key]}
          </option>
        ))}
      </select>
      <ChevronDown
        className="pointer-events-none absolute right-2 h-3.5 w-3.5 text-neutral-500"
        aria-hidden
      />
    </label>
  );
}
