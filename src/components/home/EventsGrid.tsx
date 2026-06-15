"use client";

import { useMemo } from "react";
import { useFilteredEvents } from "@/hooks/useFilteredEvents";
import { EventsGridView } from "./EventsGridView";
import { FeaturedCarousel } from "./FeaturedCarousel";

/**
 * Responsive home events grid with loading, empty, and error states.
 */
export function EventsGrid() {
  const { events, isLoading, isError, error, refetch, isFetching } =
    useFilteredEvents();

  const featuredEvents = useMemo(() => events.slice(0, 6), [events]);

  return (
    <>
      {!isLoading && !isError && featuredEvents.length > 0 ? (
        <FeaturedCarousel events={featuredEvents} />
      ) : null}
      <EventsGridView
        events={events}
        isLoading={isLoading}
        isError={isError}
        isFetching={isFetching}
        error={error}
        onRetry={() => {
          void refetch();
        }}
      />
    </>
  );
}
