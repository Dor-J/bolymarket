import { queryOptions } from "@tanstack/react-query";
import { fetchEventBySlugClient, fetchEventsClient } from "./eventsClient";

/** React Query options for the open events list. */
export const eventsQueryOptions = queryOptions({
  queryKey: ["events", { closed: false, aggregated: true }],
  queryFn: ({ signal }) => fetchEventsClient({ signal }),
  staleTime: 60_000,
  gcTime: 5 * 60_000,
});

/** React Query options for a single event by slug. */
export function eventQueryOptions(slug: string) {
  return queryOptions({
    queryKey: ["event", slug],
    queryFn: ({ signal }) => fetchEventBySlugClient(slug, { signal }),
    staleTime: 60_000,
    gcTime: 5 * 60_000,
  });
}
