'use client';

import type { ReactNode } from 'react';
import type { MarketSort, MarketStatus } from '@/lib/markets/types';
import { MarketSortSelect } from './MarketSortSelect';
import { MarketStatusSelect } from './MarketStatusSelect';
import { cn } from '@/lib/cn';

export interface MarketControlsBarProps {
  sort: MarketSort;
  onSortChange: (sort: MarketSort) => void;
  status?: MarketStatus;
  onStatusChange?: (status: MarketStatus) => void;
  showStatus?: boolean;
  children?: ReactNode;
  className?: string;
}

/**
 * Single dense controls row — sort, status pills, then hide toggles (Polymarket parity).
 */
export function MarketControlsBar({
  sort,
  onSortChange,
  status = 'all',
  onStatusChange,
  showStatus = true,
  children,
  className,
}: MarketControlsBarProps) {
  return (
    <div
      className={cn('flex flex-wrap items-center gap-2 pb-4', className)}
    >
      <MarketSortSelect value={sort} onChange={onSortChange} />
      {showStatus && onStatusChange ? (
        <MarketStatusSelect value={status} onChange={onStatusChange} />
      ) : null}
      {children}
    </div>
  );
}
