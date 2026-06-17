'use client';

import { useAtom } from 'jotai';
import { useEffect, useRef, useState } from 'react';
import { HeaderSearchIcon } from '@/components/icons/HeaderSearchIcon';
import { searchQueryAtom } from '@/lib/atoms/search';
import { cn } from '@/lib/cn';

const ghostIconButtonClass = cn(
  'inline-flex size-9 shrink-0 cursor-pointer items-center justify-center rounded-sm',
  'bg-transparent font-semibold transition duration-150 active:scale-[97%]',
  'hover:bg-surface-2 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring',
);

/**
 * Sports Live title row with expandable search.
 */
export function SportsLiveHeader() {
  const [searchQuery, setSearchQuery] = useAtom(searchQueryAtom);
  const [searchExpanded, setSearchExpanded] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (searchExpanded) {
      inputRef.current?.focus();
    }
  }, [searchExpanded]);

  return (
    <div className="mb-3 flex h-9 scroll-mt-4 items-center lg:mb-5 lg:justify-between">
      <h1
        className={cn(
          'text-text text-heading-2xl font-semibold tracking-[0.25px]',
          'transition-[text-decoration-color] duration-120 ease-out',
          '[font-variant-numeric:slashed-zero] md:text-heading-3xl',
        )}
      >
        Sports Live
      </h1>

      <div className="ml-auto hidden items-center gap-0.5 lg:flex">
        {searchExpanded ? (
          <div className="relative w-[min(280px,24vw)]">
            <div className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-neutral-500">
              <HeaderSearchIcon />
            </div>
            <input
              ref={inputRef}
              id="sports-search-input"
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
              aria-label="Search sports markets"
              placeholder="Search"
              autoComplete="off"
              className={cn(
                'h-9 w-full rounded-md border border-transparent bg-surface-2 pl-9',
                'text-sm text-text placeholder:text-neutral-500',
                'focus-visible:border-border focus-visible:outline-none focus-visible:ring-0',
              )}
            />
          </div>
        ) : (
          <button
            type="button"
            aria-label="Search sports markets"
            className={ghostIconButtonClass}
            onClick={() => setSearchExpanded(true)}
          >
            <HeaderSearchIcon className="text-text" />
          </button>
        )}
      </div>
    </div>
  );
}
