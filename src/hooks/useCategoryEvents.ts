'use client';

import { useQuery } from '@tanstack/react-query';
import { useAtomValue } from 'jotai';
import { useMemo } from 'react';
import { searchQueryAtom } from '@/lib/atoms/search';
import { eventsByTagQueryOptions } from '@/lib/api/queries';
import type { CategoryRouteSlug } from '@/lib/constants/categoryRoutes';
import { filterEventsBySearch } from '@/lib/filters/search';
import { SEARCH_DEBOUNCE_MS, useDebouncedValue } from './useDebouncedValue';

/**
 * Fetches and filters events for a dedicated category route page.
 */
export function useCategoryEvents(tag: CategoryRouteSlug) {
  const searchQuery = useAtomValue(searchQueryAtom);
  const debouncedSearch = useDebouncedValue(searchQuery, SEARCH_DEBOUNCE_MS);
  const query = useQuery(eventsByTagQueryOptions(tag));

  const events = useMemo(() => {
    if (!query.data) {
      return [];
    }

    return filterEventsBySearch(query.data, debouncedSearch);
  }, [query.data, debouncedSearch]);

  return {
    ...query,
    events,
    searchQuery,
    debouncedSearch,
  };
}
