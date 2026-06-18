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

const ODDS_FORMAT_OPTIONS = [
  'Price',
  'American',
  'Decimal',
  'Fractional',
  'Percentage',
  'Indonesian',
  'Hong Kong',
  'Malaysian',
] as const;

type OddsFormat = (typeof ODDS_FORMAT_OPTIONS)[number];

function SlidersIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 18 18" fill="none" aria-hidden className={className}>
      <path
        d="M13.25 5.25h3M1.75 5.25h7M4.75 12.75h-3M16.25 12.75h-7"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle
        cx="11"
        cy="5.25"
        r="2.25"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <circle
        cx="7"
        cy="12.75"
        r="2.25"
        stroke="currentColor"
        strokeWidth="1.5"
      />
    </svg>
  );
}

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 12 12" fill="none" aria-hidden className={className}>
      <path
        d="m1.76 7.004 2.25 3 6.23-8.258"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
      />
    </svg>
  );
}

/**
 * Sports Live title row with expandable search.
 */
export function SportsLiveHeader() {
  const [searchQuery, setSearchQuery] = useAtom(searchQueryAtom);
  const [searchExpanded, setSearchExpanded] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [oddsFormat, setOddsFormat] = useState<OddsFormat>('Price');
  const [showSpreadTotals, setShowSpreadTotals] = useState(true);
  const inputRef = useRef<HTMLInputElement>(null);
  const filtersRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (searchExpanded) {
      inputRef.current?.focus();
    }
  }, [searchExpanded]);

  useEffect(() => {
    if (!filtersOpen) {
      return undefined;
    }

    function handlePointerDown(event: PointerEvent) {
      if (!filtersRef.current?.contains(event.target as Node)) {
        setFiltersOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setFiltersOpen(false);
      }
    }

    document.addEventListener('pointerdown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('pointerdown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [filtersOpen]);

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
        <div className="relative flex items-center">
          <div
            className={cn(
              'shrink-0 overflow-hidden transition-all duration-200',
              searchExpanded ? 'w-0 opacity-0' : 'w-9 opacity-100',
            )}
          >
            <button
              type="button"
              aria-label="Search sports markets"
              className={cn(ghostIconButtonClass, 'transition-none')}
              onClick={() => setSearchExpanded(true)}
            >
              <HeaderSearchIcon className="text-text" />
            </button>
          </div>

          <div
            className={cn(
              'relative overflow-hidden transition-all duration-300 ease-out',
              searchExpanded ? 'w-[min(280px,24vw)] opacity-100' : 'w-0 opacity-0',
            )}
          >
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
                'peer h-9 w-full rounded-md bg-surface-2 px-3 py-1 pl-9',
                'text-sm text-text placeholder:text-text-secondary',
                'transition-shadow duration-200',
                'hover:bg-surface-2 focus-visible:bg-surface-1',
                'focus-visible:outline-none focus-visible:ring-0 max-lg:text-[16px]!',
              )}
            />
            <div className="pointer-events-none absolute top-1/2 flex -translate-y-1/2 items-center justify-start pl-3 text-text-secondary">
              <HeaderSearchIcon />
            </div>
          </div>
        </div>

        <div ref={filtersRef} className="relative">
          <button
            type="button"
            aria-label="Sports filters"
            aria-haspopup="menu"
            aria-expanded={filtersOpen}
            className={cn(ghostIconButtonClass, 'rounded-full')}
            onClick={() => setFiltersOpen((isOpen) => !isOpen)}
          >
            <span className="flex select-none items-center justify-center rounded-md p-2">
              <SlidersIcon className="size-[18px] text-text" />
            </span>
          </button>

          {filtersOpen ? (
            <div
              role="menu"
              aria-orientation="vertical"
              className={cn(
                'absolute top-[calc(100%+6px)] right-0 z-50 w-[230px] min-w-32',
                'flex max-h-[min(520px,calc(100vh-120px))] flex-col overflow-y-auto',
                'rounded-lg border border-border bg-background p-1.5 text-sm font-medium text-text shadow-lg',
              )}
            >
              <div className="mb-0 px-2.5 py-1.5 text-sm font-medium text-text-secondary">
                Odds Format
              </div>
              <div role="group">
                {ODDS_FORMAT_OPTIONS.map((option) => {
                  const checked = option === oddsFormat;

                  return (
                    <button
                      key={option}
                      type="button"
                      role="menuitemradio"
                      aria-checked={checked}
                      className={cn(
                        'relative flex w-full cursor-pointer select-none items-center gap-2',
                        'rounded-sm px-2.5 py-2 pr-8 text-left text-body-base font-medium',
                        'text-text-primary outline-none hover:bg-neutral-50 focus:bg-neutral-50',
                      )}
                      onClick={() => setOddsFormat(option)}
                    >
                      {option}
                      <span className="absolute top-1/2 right-3 flex -translate-y-1/2 items-center justify-center">
                        {checked ? <span className="size-1.5 rounded-full bg-text-brand" /> : null}
                      </span>
                    </button>
                  );
                })}
              </div>

              <div role="separator" className="-mx-1 my-1.5 h-px shrink-0 bg-border" />

              <button
                type="button"
                role="menuitemcheckbox"
                aria-checked={showSpreadTotals}
                className={cn(
                  'relative flex w-full cursor-pointer select-none items-center gap-2',
                  'rounded-sm px-2.5 py-2 pr-8 text-left text-sm font-medium',
                  'text-text-primary outline-none hover:bg-neutral-50 focus:bg-neutral-50',
                )}
                onClick={() => setShowSpreadTotals((value) => !value)}
              >
                <span className="pointer-events-none absolute right-3 flex items-center justify-center">
                  {showSpreadTotals ? <CheckIcon className="size-3" /> : null}
                </span>
                Show Spreads + Totals
              </button>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
