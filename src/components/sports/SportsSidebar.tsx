'use client';

import Image from 'next/image';
import { Radio } from 'lucide-react';
import { formatMarketCount } from '@/lib/format/marketCount';
import type { SportsLeagueSummary } from '@/types/polymarket';
import { cn } from '@/lib/cn';

export interface SportsSidebarProps {
  leagues: SportsLeagueSummary[];
  selectedFilterId?: string;
  onFilterSelect: (id: string) => void;
  className?: string;
}

/**
 * Sports left nav with Live mode and league filters.
 */
export function SportsSidebar({
  leagues,
  selectedFilterId,
  onFilterSelect,
  className,
}: SportsSidebarProps) {
  return (
    <div className={cn('hidden shrink-0 lg:block', className)}>
      <nav
        aria-label="Sports navigation"
        className="scrollbar-hide sticky flex w-[190px] shrink-0 flex-col overflow-y-auto py-8"
        style={{
          top: 'var(--navbar-height)',
          height: 'calc(100vh - var(--navbar-height))',
        }}
      >
        <div className="flex flex-col gap-0.5">
          <div
            className={cn(
              'group flex w-full flex-row items-center justify-between',
              'rounded-md bg-neutral-100 px-3 py-2.5',
            )}
          >
            <div className="flex min-w-0 flex-1 flex-row items-center gap-x-2.5">
              <div className="size-5 shrink-0">
                <Radio className="size-5 text-red-500" aria-hidden />
              </div>
              <p className="truncate text-base font-semibold text-text">Live</p>
            </div>
          </div>
        </div>

        <div className="mb-2 w-full border-b border-neutral-100 pb-2" />

        <div className="mb-3 mt-4 flex items-center px-3">
          <p className="text-[11px] font-medium tracking-wider text-neutral-500 uppercase">
            All Sports
          </p>
        </div>

        <div className="flex flex-col gap-0.5">
          {leagues.map((item) => {
            const active = item.id === selectedFilterId;

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onFilterSelect(item.id)}
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
                  {item.icon ? (
                    <div className="relative size-5 shrink-0 overflow-hidden rounded-sm">
                      <Image
                        src={item.icon}
                        alt=""
                        fill
                        sizes="20px"
                        className="object-cover"
                      />
                    </div>
                  ) : null}
                  <p className="truncate text-base font-semibold text-text">
                    {formatSidebarLabel(item.label)}
                  </p>
                </div>
                <div className="ml-2 shrink-0 text-[11px] font-bold text-neutral-300">
                  {formatMarketCount(item.count)}
                </div>
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
}

function formatSidebarLabel(label: string): string {
  if (label === 'WORLD CUP') {
    return 'World Cup';
  }

  return label
    .toLowerCase()
    .replace(/\b\w/g, (char) => char.toUpperCase());
}
