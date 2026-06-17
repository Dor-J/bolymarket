'use client';

import { formatMarketCount } from '@/lib/format/marketCount';
import { cn } from '@/lib/cn';

export interface CategorySidebarItem {
  id: string;
  label: string;
  count?: number;
}

export interface CategorySidebarProps {
  items: CategorySidebarItem[];
  selectedId: string;
  onSelect: (id: string) => void;
  className?: string;
}

/**
 * Sticky left navigation for category subtopics — desktop only (lg+).
 */
export function CategorySidebar({
  items,
  selectedId,
  onSelect,
  className,
}: CategorySidebarProps) {
  return (
    <div className={cn('hidden shrink-0 lg:block', className)}>
      <nav
        aria-label="Subcategories"
        className={cn(
          'scrollbar-hide sticky flex w-[190px] shrink-0 flex-col overflow-y-auto py-5',
        )}
        style={{
          top: 'var(--navbar-height)',
          height: 'calc(100vh - var(--navbar-height) - 2rem)',
        }}
      >
        <div className="flex flex-col gap-0.5">
          {items.map((item) => {
            const active = item.id === selectedId;

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onSelect(item.id)}
                aria-current={active ? 'true' : undefined}
                className={cn(
                  'group flex w-full cursor-pointer flex-row items-center justify-between',
                  'rounded-md px-3 py-2.5',
                  active ? 'bg-neutral-100' : 'bg-transparent hover:bg-neutral-50',
                )}
              >
                <div
                  className={cn(
                    'flex min-w-0 flex-1 flex-row items-center gap-x-2.5',
                    'transition-opacity duration-150 group-hover:opacity-100',
                    !active && 'opacity-80',
                  )}
                >
                  <p className="truncate text-base font-semibold text-text">{item.label}</p>
                </div>
                {item.count !== undefined ? (
                  <div className="ml-2 shrink-0 text-[11px] font-bold text-neutral-300">
                    {formatMarketCount(item.count)}
                  </div>
                ) : null}
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
