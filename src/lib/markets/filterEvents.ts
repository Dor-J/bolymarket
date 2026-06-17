import type { Event } from '@/types/polymarket';
import { SPORTS_LEAGUE_SECTIONS } from './constants';
import type { HomeHideToggles, MarketSort, MarketStatus } from './types';
import { eventHaystack } from './topicMatchers';

/**
 * Counts events matching each topic chip id.
 */
export function countTopicMatches(
  events: Event[],
  chips: { id: string; match: (event: Event) => boolean }[],
): Record<string, number> {
  const counts: Record<string, number> = {};

  for (const chip of chips) {
    if (chip.id === 'all') {
      counts[chip.id] = events.length;
      continue;
    }

    counts[chip.id] = events.filter((event) => chip.match(event)).length;
  }

  return counts;
}

/**
 * Filters events by a topic chip matcher (skips when id is "all").
 */
export function filterByTopic(
  events: Event[],
  topicId: string,
  chips: { id: string; match: (event: Event) => boolean }[],
): Event[] {
  if (topicId === 'all') {
    return events;
  }

  const chip = chips.find((item) => item.id === topicId);
  if (!chip) {
    return events;
  }

  return events.filter((event) => chip.match(event));
}

/**
 * Filters events by market-type tab (skips when id is "all").
 */
export function filterByMarketType(
  events: Event[],
  typeId: string,
  tabs: { id: string; match: (event: Event) => boolean }[],
): Event[] {
  if (typeId === 'all') {
    return events;
  }

  const tab = tabs.find((item) => item.id === typeId);
  if (!tab) {
    return events;
  }

  return events.filter((event) => tab.match(event));
}

/**
 * Filters events by active status — hides resolved/closed when active.
 */
export function filterByStatus(events: Event[], status: MarketStatus): Event[] {
  if (status === 'all') {
    return events;
  }

  const now = Date.now();

  return events.filter((event) => {
    if (!event.endDate) {
      return true;
    }

    const end = Date.parse(event.endDate);
    return Number.isNaN(end) || end > now;
  });
}

/**
 * Applies home-only category hide toggles.
 */
export function applyHomeHideToggles(
  events: Event[],
  toggles: HomeHideToggles,
): Event[] {
  return events.filter((event) => {
    const haystack = eventHaystack(event);

    if (toggles.hideSports && /sports|mlb|nba|nfl|nhl|soccer|tennis|world cup/.test(haystack)) {
      return false;
    }

    if (toggles.hideCrypto && /crypto|bitcoin|btc|ethereum|solana|blockchain/.test(haystack)) {
      return false;
    }

    if (toggles.hideEarnings && /earnings|revenue|eps/.test(haystack)) {
      return false;
    }

    return true;
  });
}

/**
 * Filters events to bookmarked slugs only.
 */
export function filterByBookmarks(events: Event[], bookmarks: string[]): Event[] {
  if (bookmarks.length === 0) {
    return [];
  }

  const bookmarkSet = new Set(bookmarks);
  return events.filter((event) => bookmarkSet.has(event.slug));
}

/**
 * Sorts events by volume or end date.
 */
export function sortEvents(events: Event[], sort: MarketSort): Event[] {
  const copy = [...events];

  if (sort === 'newest') {
    return copy.sort((left, right) => {
      const leftDate = left.endDate ? Date.parse(left.endDate) : 0;
      const rightDate = right.endDate ? Date.parse(right.endDate) : 0;
      return rightDate - leftDate;
    });
  }

  return copy.sort((left, right) => {
    if (right.volume !== left.volume) {
      return right.volume - left.volume;
    }

    return left.title.localeCompare(right.title);
  });
}

/**
 * Groups sports events into league sections.
 */
export function groupSportsByLeague(
  events: Event[],
): { id: string; label: string; events: Event[] }[] {
  const used = new Set<string>();
  const sections: { id: string; label: string; events: Event[] }[] = [];

  for (const section of SPORTS_LEAGUE_SECTIONS) {
    const matched = events.filter((event) => {
      if (used.has(event.id)) {
        return false;
      }

      const haystack = eventHaystack(event);
      const matches = section.keywords.some((keyword) =>
        haystack.includes(keyword.toLowerCase()),
      );

      if (matches) {
        used.add(event.id);
      }

      return matches;
    });

    if (matched.length > 0) {
      sections.push({ id: section.id, label: section.label, events: matched });
    }
  }

  const remaining = events.filter((event) => !used.has(event.id));
  if (remaining.length > 0) {
    sections.push({ id: 'other', label: 'OTHER', events: remaining });
  }

  return sections;
}
