'use client';

import { useAtom } from 'jotai';
import { useEffect, useRef, useState, type ReactNode } from 'react';
import { HeaderSearchIcon } from '@/components/icons/HeaderSearchIcon';
import {
  MarketSlidersIcon,
  MarketWatchlistIcon,
} from '@/components/icons/MarketControlIcons';
import { bookmarksOnlyAtom, marketFiltersVisibleAtom } from '@/lib/atoms/marketPage';
import { searchQueryAtom } from '@/lib/atoms/search';
import { toggleAriaPressed } from '@/lib/a11y/toggleAriaPressed';
import { cn } from '@/lib/cn';

export interface CategoryPageHeaderProps {
  title: string;
  filters?: ReactNode;
  className?: string;
}

const ghostIconButtonClass = cn(
  'inline-flex size-10 shrink-0 cursor-pointer items-center justify-center rounded-sm',
  'bg-transparent font-semibold transition duration-150 active:scale-[97%]',
  'hover:bg-surface-2 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring',
);

/**
 * Category page title row with search, collapsible filters, and watchlist actions.
 */
export function CategoryPageHeader({ title, filters, className }: CategoryPageHeaderProps) {
  const [bookmarksOnly, setBookmarksOnly] = useAtom(bookmarksOnlyAtom);
  const [searchQuery, setSearchQuery] = useAtom(searchQueryAtom);
  const [searchExpanded, setSearchExpanded] = useState(false);
  const [filtersVisible, setFiltersVisible] = useAtom(marketFiltersVisibleAtom);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (searchExpanded) {
      inputRef.current?.focus();
    }
  }, [searchExpanded]);

  return (
    <div className={cn('hidden w-full flex-col gap-0 px-0 lg:flex', className)}>
      <div className="flex w-full items-center justify-between">
        <h1 className="text-2xl font-semibold leading-8 text-text">{title}</h1>

        <div className="ml-auto flex items-center gap-0.5">
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
            aria-pressed={toggleAriaPressed(filtersVisible)}
            className={cn(
              'flex size-10 shrink-0 cursor-pointer items-center justify-center rounded-md',
              'transition-colors hover:bg-surface-2',
              filtersVisible
                ? 'border border-text bg-surface'
                : 'border border-transparent bg-transparent',
            )}
            onClick={() => setFiltersVisible((current) => !current)}
          >
            <div className="flex items-center justify-center rounded-md p-2">
              <MarketSlidersIcon />
            </div>
          </button>

          <button
            type="button"
            aria-label="Toggle watchlist"
            aria-pressed={toggleAriaPressed(bookmarksOnly)}
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

      {filters ? (
        <div
          className={cn(
            'w-full overflow-x-auto transition-all duration-200',
            filtersVisible ? 'max-h-24 opacity-100' : 'max-h-0 opacity-0',
          )}
          aria-hidden={!filtersVisible}
        >
          <div
            id="market-filters"
            className={cn(
              'flex w-full items-center justify-start gap-x-2 pt-2.5',
              !filtersVisible && 'pointer-events-none',
            )}
          >
            {filters}
          </div>
        </div>
      ) : null}
    </div>
  );
}
