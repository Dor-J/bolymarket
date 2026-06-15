import { queryOptions } from "@tanstack/react-query";
import { getOpenEvents } from "./gamma";

/** React Query options for the open events list. */
export const eventsQueryOptions = queryOptions({
  queryKey: ["events", { closed: false }],
  queryFn: () => getOpenEvents(),
  staleTime: 60_000,
  gcTime: 5 * 60_000,
});
