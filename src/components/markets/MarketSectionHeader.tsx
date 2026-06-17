'use client';

import { useAtom } from 'jotai';
import { useEffect, useRef, useState } from 'react';
import { HeaderSearchIcon } from '@/components/icons/HeaderSearchIcon';
import {
  MarketSlidersIcon,
  MarketWatchlistIcon,
} from '@/components/icons/MarketControlIcons';
import { bookmarksOnlyAtom } from '@/lib/atoms/marketPage';
import { searchQueryAtom } from '@/lib/atoms/search';
import { cn } from '@/lib/cn';

export interface MarketSectionHeaderProps {
  heading: string;
  className?: string;
}

const ghostIconButtonClass = cn(
  'inline-flex size-10 shrink-0 cursor-pointer items-center justify-center rounded-sm',
  'bg-transparent font-semibold transition duration-150 active:scale-[97%]',
  'hover:bg-surface-2 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring',
);

/**
 * "All markets" row with expandable search and Polymarket-style toolbar actions.
 */
export function MarketSectionHeader({ heading, className }: MarketSectionHeaderProps) {
  const [bookmarksOnly, setBookmarksOnly] = useAtom(bookmarksOnlyAtom);
  const [searchQuery, setSearchQuery] = useAtom(searchQueryAtom);
  const [searchExpanded, setSearchExpanded] = useState(false);
  const [filtersActive, setFiltersActive] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (searchExpanded) {
      inputRef.current?.focus();
    }
  }, [searchExpanded]);

  return (
    <div className={cn('mb-3 flex items-center justify-between gap-3', className)}>
      <h2 className="text-xl leading-6 font-semibold text-text">{heading}</h2>

      <div className="hidden items-center gap-1 xl:flex">
        {searchExpanded ? (
          <div className="relative w-[min(320px,28vw)]">
            <div className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-neutral-500">
              <HeaderSearchIcon />
            </div>
            <input
              ref={inputRef}
              type="search"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              onBlur={() => {
                if (!searchQuery.trim()) {
                  setSearchExpanded(false);
                }
              }}
              onKeyDown={(event) => {
                if (event.key === 'Escape') {
                  setSearchQuery('');
                  setSearchExpanded(false);
                }
              }}
              aria-label="Search markets"
              placeholder="Search"
              autoComplete="off"
              className={cn(
                'h-10 w-full rounded-md border border-transparent bg-surface-2 pl-10',
                'text-sm text-text placeholder:text-[15px] placeholder:font-normal placeholder:text-neutral-500',
                'transition-shadow duration-200 hover:bg-surface-2',
                'focus-visible:border-border focus-visible:bg-surface-2 focus-visible:outline-none focus-visible:ring-0',
              )}
            />
          </div>
        ) : (
          <button
            type="button"
            aria-label="Search markets"
            className={ghostIconButtonClass}
            onClick={() => setSearchExpanded(true)}
          >
            <HeaderSearchIcon className="text-text" />
          </button>
        )}

        <button
          type="button"
          aria-label="Toggle filters"
          aria-pressed={filtersActive}
          className={cn(
            'flex size-10 shrink-0 cursor-pointer items-center justify-center rounded-md',
            'transition-colors hover:bg-surface-2',
            filtersActive
              ? 'border border-text bg-surface'
              : 'border border-transparent bg-transparent',
          )}
          onClick={() => {
            setFiltersActive((current) => !current);
            document.getElementById('market-filters')?.scrollIntoView({
              behavior: 'smooth',
              block: 'nearest',
            });
          }}
        >
          <div className="flex items-center justify-center rounded-md p-2">
            <MarketSlidersIcon />
          </div>
        </button>

        <button
          type="button"
          aria-label="Toggle watchlist"
          aria-pressed={bookmarksOnly}
          className={cn(
            'flex size-10 shrink-0 cursor-pointer items-center justify-center rounded-md',
            'transition-colors hover:bg-surface-2',
          )}
          onClick={() => setBookmarksOnly((current) => !current)}
        >
          <MarketWatchlistIcon
            className={bookmarksOnly ? 'text-brand' : 'text-neutral-500'}
          />
        </button>
      </div>
    </div>
  );
}
