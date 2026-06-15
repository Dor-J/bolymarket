'use client';

import { useMemo } from 'react';
import type { Event } from '@/types/polymarket';
import { EventCard } from '@/components/cards/EventCard';
import { EVENTS_GRID_CLASSES } from '@/lib/constants/eventsGrid';
import { useLivePrices } from '@/hooks/useLivePrices';
import { getVisibleOutcomeSeedsFromEvents } from '@/lib/prices/visibleOutcomeKeys';
import { EventListEmpty } from './EventListEmpty';
import { EventsGridError } from './EventsGridError';
import { EventsGridSkeleton } from './EventsGridSkeleton';

export interface EventsGridViewProps {
  events: Event[];
  isLoading: boolean;
  isError: boolean;
  isFetching: boolean;
  error: Error | null;
  onRetry: () => void;
  heading?: string;
  showFeatured?: boolean;
  featuredEvents?: Event[];
}

/**
 * Presentational events grid with loading, empty, and error states.
 */
export function EventsGridView({
  events,
  isLoading,
  isError,
  isFetching,
  error,
  onRetry,
  heading = 'All markets',
  showFeatured = false,
  featuredEvents = [],
}: EventsGridViewProps) {
  const priceSeeds = useMemo(
    () => getVisibleOutcomeSeedsFromEvents(events),
    [events],
  );

  useLivePrices(priceSeeds);

  if (isLoading) {
    return <EventsGridSkeleton heading={heading} showFeatured={showFeatured} />;
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
    return <EventListEmpty />;
  }

  return (
    <div>
      {isFetching ? (
        <p className="sr-only" aria-live="polite">
          Refreshing markets
        </p>
      ) : null}

      {showFeatured && featuredEvents.length > 0 ? (
        <div className="mb-6 hidden lg:block">
          <h2 className="mb-3 text-xl leading-6 font-semibold text-text">
            Featured markets
          </h2>
          <div className="scrollbar-hide flex gap-3 overflow-x-auto pb-1">
            {featuredEvents.slice(0, 4).map((event) => (
              <div key={event.id} className="w-[320px] shrink-0">
                <EventCard event={event} />
              </div>
            ))}
          </div>
        </div>
      ) : null}

      <h2 className="mb-4 text-xl leading-6 font-semibold text-text">
        {heading}
      </h2>

      <div className={EVENTS_GRID_CLASSES}>
        {events.map((event) => (
          <EventCard key={event.id} event={event} />
        ))}
      </div>
    </div>
  );
}
