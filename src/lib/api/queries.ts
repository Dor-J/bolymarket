import { queryOptions } from '@tanstack/react-query';
import { QUERY_PERSIST_MAX_AGE_MS } from '@/lib/cache/constants';
import type { Timeframe } from '@/lib/chart/types';
import { fetchEventBySlugClient, fetchEventsClient } from './eventsClient';
import { fetchPriceHistoryClient } from './pricesClient';
import { fetchRelatedNewsClient } from './relatedNewsClient';

/** React Query options for the aggregated open events list. */
export const eventsQueryOptions = queryOptions({
  queryKey: ['events', { closed: false, aggregated: true }],
  queryFn: ({ signal }) => fetchEventsClient({ signal }),
  staleTime: 60_000,
  gcTime: QUERY_PERSIST_MAX_AGE_MS,
});

/** React Query options for a category-specific events list. */
export function eventsByTagQueryOptions(tag: string) {
  return queryOptions({
    queryKey: ['events', { tag }],
    queryFn: ({ signal }) => fetchEventsClient({ tag, signal }),
    staleTime: 60_000,
    gcTime: QUERY_PERSIST_MAX_AGE_MS,
  });
}

/** React Query options for a single event by slug. */
export function eventQueryOptions(slug: string) {
  return queryOptions({
    queryKey: ['event', slug],
    queryFn: ({ signal }) => fetchEventBySlugClient(slug, { signal }),
    staleTime: 60_000,
    gcTime: QUERY_PERSIST_MAX_AGE_MS,
  });
}

/** React Query options for CLOB price history (not persisted). */
export function priceHistoryQueryOptions(tokenId: string, timeframe: Timeframe) {
  return queryOptions({
    queryKey: ['prices', tokenId, timeframe],
    queryFn: ({ signal }) =>
      fetchPriceHistoryClient(tokenId, timeframe, { signal }),
    staleTime: 30_000,
    gcTime: 5 * 60_000,
    retry: 1,
  });
}

/** React Query options for related OkSurf headlines ranked to an event. */
export function relatedNewsQueryOptions(input: {
  slug: string;
  title: string;
  category?: string;
  tags?: string[];
  marketQuestions?: string[];
  enabled?: boolean;
}) {
  return queryOptions({
    queryKey: [
      'related-news',
      input.slug,
      input.title,
      input.category ?? '',
      (input.tags ?? []).join(','),
    ],
    queryFn: ({ signal }) =>
      fetchRelatedNewsClient({
        slug: input.slug,
        title: input.title,
        category: input.category,
        tags: input.tags,
        marketQuestions: input.marketQuestions,
        signal,
      }),
    staleTime: 120_000,
    gcTime: 10 * 60_000,
    enabled: input.enabled ?? true,
  });
}
