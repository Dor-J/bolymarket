'use client';

import { useMemo } from 'react';
import type { Event } from '@/types/polymarket';
import { EventCard } from '@/components/cards/EventCard';
import { EVENTS_GRID_CLASSES } from '@/lib/constants/eventsGrid';
import { useLivePrices } from '@/hooks/useLivePrices';
import { useShowMoreMarkets } from '@/hooks/useShowMoreMarkets';
import { getVisibleOutcomeSeedsFromEvents } from '@/lib/prices/visibleOutcomeKeys';
import { EventListEmpty } from '@/components/home/EventListEmpty';
import { EventsGridError } from '@/components/home/EventsGridError';
import { EventsGridSkeleton } from '@/components/home/EventsGridSkeleton';
import { ShowMoreMarketsButton } from './ShowMoreMarketsButton';
import { MarketSectionHeader } from './MarketSectionHeader';

export interface MarketsPageBodyProps {
  events: Event[];
  isLoading: boolean;
  isError: boolean;
  isFetching: boolean;
  error: Error | null;
  onRetry: () => void;
  heading?: string;
  controls?: React.ReactNode;
  emptyMessage?: string;
  showSectionToolbar?: boolean;
}

/**
 * Market grid body with loading states, controls slot, and show-more pagination.
 */
export function MarketsPageBody({
  events,
  isLoading,
  isError,
  isFetching,
  error,
  onRetry,
  heading = 'All markets',
  controls,
  emptyMessage,
  showSectionToolbar = false,
}: MarketsPageBodyProps) {
  const { visibleCount, showMore, hasMore } = useShowMoreMarkets(events.length);
  const visibleEvents = useMemo(
    () => events.slice(0, visibleCount),
    [events, visibleCount],
  );

  const priceSeeds = useMemo(
    () => getVisibleOutcomeSeedsFromEvents(visibleEvents),
    [visibleEvents],
  );

  useLivePrices(priceSeeds);

  if (isLoading) {
    return <EventsGridSkeleton heading={heading} />;
  }

  if (isError) {
    return (
      <EventsGridError
        message={error instanceof Error ? error.message : undefined}
        onRetry={onRetry}
      />
    );
  }

  if (events.length === 0) {
    return (
      <div>
        {showSectionToolbar ? (
          <MarketSectionHeader heading={heading} />
        ) : (
          <h2 className="mb-3 text-xl leading-6 font-semibold text-text">{heading}</h2>
        )}
        {controls}
        <EventListEmpty message={emptyMessage} />
      </div>
    );
  }

  return (
    <div>
      {isFetching ? (
        <p className="sr-only" aria-live="polite">
          Refreshing markets
        </p>
      ) : null}

      {showSectionToolbar ? (
        <MarketSectionHeader heading={heading} />
      ) : (
        <h2 className="mb-3 text-xl leading-6 font-semibold text-text">{heading}</h2>
      )}

      {controls}

      <div className={EVENTS_GRID_CLASSES}>
        {visibleEvents.map((event) => (
          <EventCard key={event.id} event={event} />
        ))}
      </div>

      {hasMore ? <ShowMoreMarketsButton onClick={showMore} /> : null}
    </div>
  );
}
