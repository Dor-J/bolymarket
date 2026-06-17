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
 * Controls row — sort/status on the left, optional trailing filters on the right.
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
      className={cn('flex flex-wrap items-center justify-between gap-3 pb-4', className)}
    >
      <div className="flex flex-wrap items-center gap-2">
        <MarketSortSelect value={sort} onChange={onSortChange} />
        {showStatus && onStatusChange ? (
          <MarketStatusSelect value={status} onChange={onStatusChange} />
        ) : null}
      </div>

      {children ? (
        <div className="flex flex-wrap items-center gap-4">{children}</div>
      ) : null}
    </div>
  );
}
