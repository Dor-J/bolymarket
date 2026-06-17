'use client';

import { queryOptions, useQuery } from '@tanstack/react-query';
import { QUERY_PERSIST_MAX_AGE_MS } from '@/lib/cache/constants';
import { fetchSportsLiveClient } from '@/lib/api/sportsClient';

/** React Query options for the sports live games list. */
export const sportsLiveQueryOptions = queryOptions({
  queryKey: ['sports', 'live'],
  queryFn: ({ signal }) => fetchSportsLiveClient({ signal }),
  staleTime: 60_000,
  gcTime: QUERY_PERSIST_MAX_AGE_MS,
  refetchInterval: 60_000,
});

/**
 * Fetches sports live games for the `/sports/live` page.
 */
export function useSportsLiveGames() {
  return useQuery(sportsLiveQueryOptions);
}
