"use client";

import { useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { formatVolume } from "@/lib/format/volume";
import { useFilteredEvents } from "@/hooks/useFilteredEvents";
import { EventListEmpty } from "./EventListEmpty";
import { EventListSkeleton } from "./EventListSkeleton";

/**
 * Temporary filtered event list — replaced by the events grid in Phase 2.
 */
export function FilteredEventList() {
  const queryClient = useQueryClient();
  const { events, isLoading, isError, error, refetch, isFetching } =
    useFilteredEvents();

  if (isLoading) {
    return <EventListSkeleton />;
  }

  if (isError) {
    return (
      <div className="rounded-card border border-border bg-card p-6 text-center">
        <p className="text-sm leading-5 text-text">
          {error instanceof Error ? error.message : "Failed to load markets."}
        </p>
        <Button
          variant="brand"
          className="mt-4"
          onClick={() => {
            void queryClient.invalidateQueries({ queryKey: ["events"] });
            void refetch();
          }}
        >
          Retry
        </Button>
      </div>
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

      <ul className="flex flex-col gap-3">
        {events.map((event) => {
          const topMarket = event.markets[0];

          return (
            <li key={event.id}>
              <Link
                href={`/event/${event.slug}`}
                className="block rounded-card border border-border bg-card p-4 transition-colors hover:border-[#caced3] hover:bg-surface-2 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
              >
                <h2 className="text-sm leading-5 font-semibold text-text">
                  {event.title}
                </h2>
                <p className="mt-1 text-[13px] leading-4 font-medium text-[#aeb4bc]">
                  {formatVolume(event.volume)}
                  {event.markets.length > 1
                    ? ` · ${event.markets.length} markets`
                    : ""}
                </p>
                {topMarket ? (
                  <p className="mt-1 truncate text-sm leading-5 text-[#77808d]">
                    {topMarket.question}
                  </p>
                ) : null}
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
