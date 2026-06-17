'use client';

import { cn } from '@/lib/cn';

export interface MarketTypeTabItem {
  id: string;
  label: string;
}

export interface MarketTypeTabsProps {
  items: MarketTypeTabItem[];
  selectedId: string;
  onSelect: (id: string) => void;
  className?: string;
}

/**
 * Secondary market-type tab row (e.g. crypto Up/Down tabs).
 */
export function MarketTypeTabs({
  items,
  selectedId,
  onSelect,
  className,
}: MarketTypeTabsProps) {
  return (
    <div
      className={cn('scrollbar-hide -mx-1 flex gap-1 overflow-x-auto border-b border-border px-1', className)}
      role="tablist"
      aria-label="Market types"
    >
      {items.map((item) => {
        const active = item.id === selectedId;

        return (
          <button
            key={item.id}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onSelect(item.id)}
            className={cn(
              'shrink-0 border-b-2 px-2.5 py-2 text-sm leading-5 font-medium whitespace-nowrap',
              'transition-colors',
              active
                ? 'border-brand text-text'
                : 'border-transparent text-neutral-500 hover:text-text',
            )}
          >
            {item.label}
          </button>
        );
      })}
    </div>
  );
}
