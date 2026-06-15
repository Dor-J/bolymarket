import type { CategoryFilter, Event } from "@/types/polymarket";

/**
 * Returns whether an event matches the selected category filter.
 */
export function eventMatchesCategory(
  event: Event,
  category: CategoryFilter,
): boolean {
  if (category === "trending") {
    return true;
  }

  const needle = category.toLowerCase();
  const haystack = [
    event.category?.toLowerCase(),
    ...event.tags.map((tag) => tag.toLowerCase()),
  ].filter((value): value is string => Boolean(value));

  return haystack.some((tag) => tag === needle || tag.includes(needle));
}

/**
 * Filters events by category and sorts by volume descending, then title.
 */
export function filterAndSortEvents(
  events: Event[],
  category: CategoryFilter,
): Event[] {
  return events
    .filter((event) => eventMatchesCategory(event, category))
    .sort((left, right) => {
      if (right.volume !== left.volume) {
        return right.volume - left.volume;
      }

      return left.title.localeCompare(right.title);
    });
}
