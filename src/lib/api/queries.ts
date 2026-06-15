import { queryOptions } from "@tanstack/react-query";
import { fetchEventBySlug, getOpenEvents } from "./gamma";

/** React Query options for the open events list. */
export const eventsQueryOptions = queryOptions({
  queryKey: ["events", { closed: false }],
  queryFn: () => getOpenEvents(),
  staleTime: 60_000,
  gcTime: 5 * 60_000,
});

/** React Query options for a single event by slug. */
export function eventQueryOptions(slug: string) {
  return queryOptions({
    queryKey: ["event", slug],
    queryFn: () => fetchEventBySlug(slug),
    staleTime: 60_000,
    gcTime: 5 * 60_000,
  });
}
