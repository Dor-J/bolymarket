'use client';

import { Bookmark, Search, SlidersHorizontal } from 'lucide-react';
import { useAtom } from 'jotai';
import { useEffect, useRef, useState } from 'react';
import { IconButton } from '@/components/ui/IconButton';
import { searchQueryAtom } from '@/lib/atoms/search';
import { useSearchShortcut } from '@/hooks/useSearchShortcut';
import { cn } from '@/lib/cn';

/**
 * Compact content-level search toolbar shown when the header search is hidden.
 * Mirrors Polymarket's search/filter/bookmark row under the category nav.
 */
export function MarketSearchToolbar() {
  const [searchQuery, setSearchQuery] = useAtom(searchQueryAtom);
  const inputRef = useRef<HTMLInputElement>(null);
  const [isXlUp, setIsXlUp] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 1280px)');
    setIsXlUp(mq.matches);

    function handleChange() {
      setIsXlUp(mq.matches);
    }

    mq.addEventListener('change', handleChange);
    return () => mq.removeEventListener('change', handleChange);
  }, []);

  // Only enable '/' shortcut when this toolbar is visible.
  useSearchShortcut(inputRef, !isXlUp);

  return (
    <div className="border-b border-border bg-surface xl:hidden">
      <div className="mx-auto flex max-w-[1350px] items-center gap-3 px-4 py-2 md:px-6">
        <div className="relative flex-1">
          <Search
            aria-hidden
            className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-[#77808d]"
          />
          <input
            ref={inputRef}
            type="search"
            value={searchQuery}
            onChange={(event) => {
              setSearchQuery(event.target.value);
            }}
            aria-label="Search polymarkets"
            placeholder="Search"
            className={cn(
              'h-9 w-full rounded-[9px] bg-surface-2 pr-10 pl-10',
              'text-sm leading-5 text-text placeholder:text-[#77808d]',
              'focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none',
            )}
          />
        </div>

        <div className="flex items-center gap-2">
          <IconButton label="Toggle filters" className="h-9 w-9 rounded-md">
            <SlidersHorizontal className="h-4 w-4 text-[#77808d]" aria-hidden />
          </IconButton>
          <IconButton label="Bookmark markets" className="h-9 w-9 rounded-md">
            <Bookmark className="h-4 w-4 text-[#77808d]" aria-hidden />
          </IconButton>
        </div>
      </div>
    </div>
  );
}

