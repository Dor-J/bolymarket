'use client';

import { Bookmark, Search, SlidersHorizontal } from 'lucide-react';
import { useAtom } from 'jotai';
import { IconButton } from '@/components/ui/IconButton';
import { bookmarksOnlyAtom } from '@/lib/atoms/marketPage';
import { cn } from '@/lib/cn';

export interface MarketSectionHeaderProps {
  heading: string;
  className?: string;
}

/**
 * "All markets" row with desktop search/filter/bookmark actions (Polymarket parity).
 */
export function MarketSectionHeader({ heading, className }: MarketSectionHeaderProps) {
  const [bookmarksOnly, setBookmarksOnly] = useAtom(bookmarksOnlyAtom);

  return (
    <div className={cn('mb-3 flex items-center justify-between gap-3', className)}>
      <h2 className="text-xl leading-6 font-semibold text-text">{heading}</h2>

      <div className="hidden items-center gap-0.5 xl:flex">
        <IconButton
          label="Search markets"
          className="h-9 w-9 rounded-md"
          onClick={() => {
            document.querySelector<HTMLInputElement>('[data-header-search]')?.focus();
          }}
        >
          <Search className="h-4 w-4 text-neutral-500" aria-hidden />
        </IconButton>

        <IconButton
          label="Toggle filters"
          className="h-9 w-9 rounded-md"
          onClick={() => {
            document.getElementById('market-filters')?.scrollIntoView({
              behavior: 'smooth',
              block: 'nearest',
            });
          }}
        >
          <SlidersHorizontal className="h-4 w-4 text-neutral-500" aria-hidden />
        </IconButton>

        <IconButton
          label={bookmarksOnly ? 'Show all markets' : 'Show bookmarked markets'}
          aria-pressed={bookmarksOnly}
          className={cn(
            'h-9 w-9 rounded-md',
            bookmarksOnly && 'bg-brand-subtle text-brand',
          )}
          onClick={() => setBookmarksOnly((current) => !current)}
        >
          <Bookmark
            className={cn(
              'h-4 w-4',
              bookmarksOnly ? 'fill-current text-brand' : 'text-neutral-500',
            )}
            aria-hidden
          />
        </IconButton>
      </div>
    </div>
  );
}
