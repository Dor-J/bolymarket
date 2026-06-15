'use client';

import { useAtomValue } from 'jotai';
import { useMemo } from 'react';
import { selectedCategoryAtom } from '@/lib/atoms/category';
import { searchQueryAtom } from '@/lib/atoms/search';
import { filterAndSortEvents } from '@/lib/filters/category';
import { filterEventsBySearch } from '@/lib/filters/search';
import { SEARCH_DEBOUNCE_MS, useDebouncedValue } from './useDebouncedValue';
import { useEvents } from './useEvents';

/**
 * Returns events filtered and sorted by category and debounced search query.
 */
export function useFilteredEvents() {
  const category = useAtomValue(selectedCategoryAtom);
  const searchQuery = useAtomValue(searchQueryAtom);
  const debouncedSearch = useDebouncedValue(searchQuery, SEARCH_DEBOUNCE_MS);
  const query = useEvents();

  const events = useMemo(() => {
    if (!query.data) {
      return [];
    }

    const byCategory = filterAndSortEvents(query.data, category);
    return filterEventsBySearch(byCategory, debouncedSearch);
  }, [query.data, category, debouncedSearch]);

  return {
    ...query,
    events,
    category,
    searchQuery,
    debouncedSearch,
  };
}
