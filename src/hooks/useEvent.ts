"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { eventsQueryOptions } from "@/lib/api/queries";
import { fetchEventBySlugClient } from "@/lib/api/eventsClient";
import type { Event } from "@/types/polymarket";

/**
 * Fetches a single event by slug — cache-first from the open events list.
 */
export function useEvent(slug: string) {
  const queryClient = useQueryClient();

  return useQuery({
    queryKey: ["event", slug],
    queryFn: async (): Promise<Event> => {
      const cachedEvents = queryClient.getQueryData<Event[]>(
        eventsQueryOptions.queryKey,
      );
      const fromList = cachedEvents?.find((event) => event.slug === slug);

      if (fromList) {
        return fromList;
      }

      const event = await fetchEventBySlugClient(slug);

      if (!event) {
        throw new Error("Event not found");
      }

      return event;
    },
    staleTime: 60_000,
    gcTime: 5 * 60_000,
    enabled: Boolean(slug),
  });
}
