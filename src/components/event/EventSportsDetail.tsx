'use client';

import { useState } from 'react';
import type { Event } from '@/types/polymarket';
import { OutcomeList } from './OutcomeList';
import { cn } from '@/lib/cn';

export interface EventSportsDetailProps {
  event: Event;
}

const SPORTS_DETAIL_VIEW_TABS = ['Market', 'Live stats'] as const;
const SPORTS_DETAIL_MARKET_TABS = [
  'Game Lines',
  'Exact Score',
  'Halves',
  'Corners',
  'Goals',
  'Assists',
  'Shots',
] as const;

/**
 * Sports match event detail with odds-focused outcome list.
 */
export function EventSportsDetail({ event }: EventSportsDetailProps) {
  const [selectedViewTab, setSelectedViewTab] =
    useState<(typeof SPORTS_DETAIL_VIEW_TABS)[number]>('Market');
  const [selectedMarketTab, setSelectedMarketTab] =
    useState<(typeof SPORTS_DETAIL_MARKET_TABS)[number]>('Game Lines');

  return (
    <div className="space-y-4">
      <div className="space-y-3 min-[1440px]:hidden">
        <div
          className="inline-flex h-9 rounded-lg bg-surface-2 p-1"
          role="tablist"
          aria-label="Sports event view"
        >
          {SPORTS_DETAIL_VIEW_TABS.map((tab) => {
            const active = selectedViewTab === tab;

            return (
              <button
                key={tab}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => setSelectedViewTab(tab)}
                className={cn(
                  'inline-flex h-7 items-center justify-center rounded-md px-3 text-sm font-semibold whitespace-nowrap',
                  active
                    ? 'bg-background text-text shadow-sm'
                    : 'text-neutral-500 hover:text-text',
                )}
              >
                {tab}
              </button>
            );
          })}
        </div>

        <div
          className="scrollbar-hide -mx-1 flex gap-1 overflow-x-auto px-1 pb-1"
          role="tablist"
          aria-label="Sports market category"
        >
          {SPORTS_DETAIL_MARKET_TABS.map((tab) => {
            const active = selectedMarketTab === tab;

            return (
              <button
                key={tab}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => setSelectedMarketTab(tab)}
                className={cn(
                  'h-8 shrink-0 rounded-md px-2.5 text-sm font-medium whitespace-nowrap',
                  active
                    ? 'bg-brand-subtle text-brand'
                    : 'text-neutral-500 hover:bg-surface-2 hover:text-text',
                )}
              >
                {tab}
              </button>
            );
          })}
        </div>
      </div>

      <div className="hidden grid-cols-3 gap-2 text-center text-xs font-semibold tracking-wide text-neutral-500 uppercase lg:grid">
        <span>Moneyline</span>
        <span>Spread</span>
        <span>Total</span>
      </div>
      <OutcomeList event={event} />
    </div>
  );
}
