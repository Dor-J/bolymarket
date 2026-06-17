'use client';

import type { MarketStatus } from '@/lib/markets/types';
import { cn } from '@/lib/cn';

export interface MarketStatusSelectProps {
  value: MarketStatus;
  onChange: (value: MarketStatus) => void;
  className?: string;
}

const STATUS_OPTIONS: { value: MarketStatus; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'active', label: 'Active' },
];

/**
 * All / Active status toggle matching Polymarket controls.
 */
export function MarketStatusSelect({
  value,
  onChange,
  className,
}: MarketStatusSelectProps) {
  return (
    <div
      className={cn('inline-flex rounded-md border border-border bg-surface p-0.5', className)}
      role="group"
      aria-label="Market status"
    >
      {STATUS_OPTIONS.map((option) => {
        const active = value === option.value;

        return (
          <button
            key={option.value}
            type="button"
            aria-pressed={active}
            onClick={() => onChange(option.value)}
            className={cn(
              'rounded px-2.5 py-1 text-sm leading-5 font-medium transition-colors',
              active
                ? 'bg-surface-2 text-text'
                : 'text-neutral-500 hover:text-text',
            )}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
