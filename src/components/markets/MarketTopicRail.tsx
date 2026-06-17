'use client';

import { cn } from '@/lib/cn';

export interface MarketTopicRailItem {
  id: string;
  label: string;
  count?: number;
}

export interface MarketTopicRailProps {
  items: MarketTopicRailItem[];
  selectedId: string;
  onSelect: (id: string) => void;
  showCounts?: boolean;
  className?: string;
  id?: string;
}

/**
 * Horizontally scrollable topic chip rail matching Polymarket density.
 */
export function MarketTopicRail({
  items,
  selectedId,
  onSelect,
  showCounts = true,
  className,
  id,
}: MarketTopicRailProps) {
  return (
    <div
      id={id}
      className={cn('scrollbar-hide -mx-1 flex gap-1 overflow-x-auto px-1 pb-1', className)}
      role="tablist"
      aria-label="Filter topics"
    >
      {items.map((item) => {
        const active = item.id === selectedId;
        const label =
          showCounts && item.count !== undefined
            ? `${item.label} ${item.count}`
            : item.label;

        return (
          <button
            key={item.id}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onSelect(item.id)}
            className={cn(
              'shrink-0 rounded-md px-2.5 py-1.5 text-sm leading-5 font-medium whitespace-nowrap',
              'transition-colors',
              active
                ? 'bg-brand-subtle text-brand'
                : 'text-neutral-500 hover:bg-surface-2 hover:text-text',
            )}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}
