"use client";

import { useQuery } from "@tanstack/react-query";
import { eventsQueryOptions } from "@/lib/api/queries";

/**
 * Fetches and caches open events from the Gamma API.
 */
export function useEvents() {
  return useQuery(eventsQueryOptions);
}
