'use client';

import { EventCard } from '@/components/cards/EventCard';
import { useFilteredEvents } from '@/hooks/useFilteredEvents';
import { EventListEmpty } from './EventListEmpty';
import { EventsGridError } from './EventsGridError';
import { EventsGridSkeleton } from './EventsGridSkeleton';

const gridClasses =
  'grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 min-[1300px]:grid-cols-4';

/**
 * Responsive home events grid with loading, empty, and error states.
 */
export function EventsGrid() {
  const { events, isLoading, isError, error, refetch, isFetching } =
    useFilteredEvents();

  if (isLoading) {
    return <EventsGridSkeleton />;
  }

  if (isError) {
    return (
      <EventsGridError
        message={error instanceof Error ? error.message : undefined}
        onRetry={() => {
          void refetch();
        }}
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

      <h2 className="mb-4 text-xl leading-6 font-semibold text-text">
        All markets
      </h2>

      <div className={gridClasses}>
        {events.map((event) => (
          <EventCard key={event.id} event={event} />
        ))}
      </div>
    </div>
  );
}
