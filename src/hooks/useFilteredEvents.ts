"use client";

import { useAtomValue } from "jotai";
import { useMemo } from "react";
import { selectedCategoryAtom } from "@/lib/atoms/category";
import { filterAndSortEvents } from "@/lib/filters/category";
import { useEvents } from "./useEvents";

/**
 * Returns events filtered and sorted by the selected category atom.
 */
export function useFilteredEvents() {
  const category = useAtomValue(selectedCategoryAtom);
  const query = useEvents();

  const events = useMemo(() => {
    if (!query.data) {
      return [];
    }

    return filterAndSortEvents(query.data, category);
  }, [query.data, category]);

  return {
    ...query,
    events,
    category,
  };
}
