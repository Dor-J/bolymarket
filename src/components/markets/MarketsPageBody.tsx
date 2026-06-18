'use client';

import { Fragment, useMemo } from 'react';
import type { ReactNode } from 'react';
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
import { cn } from '@/lib/cn';

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
  hideHeading?: boolean;
  gridClassName?: string;
  gridWrapperClassName?: string;
  thirdGridCard?: ReactNode;
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
  hideHeading = false,
  gridClassName = EVENTS_GRID_CLASSES,
  gridWrapperClassName,
  thirdGridCard,
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
    return (
      <EventsGridSkeleton
        heading={heading}
        hideHeading={hideHeading}
        gridClassName={gridClassName}
        gridWrapperClassName={gridWrapperClassName}
      />
    );
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
        {!hideHeading ? (
          showSectionToolbar ? (
            <MarketSectionHeader heading={heading} />
          ) : (
            <h2 className="mb-3 text-xl leading-6 font-semibold text-text">{heading}</h2>
          )
        ) : null}
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

      {!hideHeading ? (
        showSectionToolbar ? (
          <MarketSectionHeader heading={heading} />
        ) : (
          <h2 className="mb-3 text-xl leading-6 font-semibold text-text">{heading}</h2>
        )
      ) : null}

      {controls}

      <div
        className={cn(
          'relative flex h-auto w-full shrink-0 flex-col gap-3 pt-px pb-10',
          gridWrapperClassName,
        )}
      >
        <div className={gridClassName}>
          {visibleEvents.map((event, index) => (
            <Fragment key={event.id}>
              {index === 2 && thirdGridCard ? thirdGridCard : null}
              <EventCard event={event} />
            </Fragment>
          ))}
          {visibleEvents.length === 2 && thirdGridCard ? thirdGridCard : null}
        </div>
      </div>

      {hasMore ? <ShowMoreMarketsButton onClick={showMore} /> : null}
    </div>
  );
}
