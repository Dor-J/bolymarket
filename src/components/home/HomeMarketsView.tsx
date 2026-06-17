'use client';

import { useAtom, useAtomValue } from 'jotai';
import { useMemo, useState } from 'react';
import { bookmarksAtom } from '@/lib/atoms/bookmarks';
import { breakingFilterAtom, bookmarksOnlyAtom } from '@/lib/atoms/marketPage';
import { searchQueryAtom } from '@/lib/atoms/search';
import { HOME_TOPIC_CHIPS } from '@/lib/markets/constants';
import {
  applyHomeHideToggles,
  countTopicMatches,
  filterByBookmarks,
  filterByStatus,
  filterByTopic,
  sortEvents,
} from '@/lib/markets/filterEvents';
import type { HomeHideToggles, MarketSort, MarketStatus } from '@/lib/markets/types';
import { useFilteredEvents } from '@/hooks/useFilteredEvents';
import { FeaturedCarousel } from './FeaturedCarousel';
import { MarketControlsBar } from '@/components/markets/MarketControlsBar';
import { MarketTopicRail } from '@/components/markets/MarketTopicRail';
import { MarketsPageBody } from '@/components/markets/MarketsPageBody';

/**
 * Home trending page with topic rails, controls, and show-more grid.
 */
export function HomeMarketsView() {
  const { events: rawEvents, isLoading, isError, error, refetch, isFetching } =
    useFilteredEvents();
  const searchQuery = useAtomValue(searchQueryAtom);
  const bookmarks = useAtomValue(bookmarksAtom);
  const [breakingOnly, setBreakingOnly] = useAtom(breakingFilterAtom);
  const bookmarksOnly = useAtomValue(bookmarksOnlyAtom);
  const [topicId, setTopicId] = useState('all');
  const [sort, setSort] = useState<MarketSort>('volume');
  const [status, setStatus] = useState<MarketStatus>('all');
  const [hideToggles, setHideToggles] = useState<HomeHideToggles>({
    hideSports: false,
    hideCrypto: false,
    hideEarnings: false,
  });

  const topicCounts = useMemo(
    () => countTopicMatches(rawEvents, HOME_TOPIC_CHIPS),
    [rawEvents],
  );

  const events = useMemo(() => {
    let result = rawEvents;

    if (breakingOnly) {
      result = filterByTopic(result, 'breaking', HOME_TOPIC_CHIPS);
    } else {
      result = filterByTopic(result, topicId, HOME_TOPIC_CHIPS);
    }

    result = applyHomeHideToggles(result, hideToggles);
    result = filterByStatus(result, status);

    if (bookmarksOnly) {
      result = filterByBookmarks(result, bookmarks);
    }

    return sortEvents(result, sort);
  }, [rawEvents, topicId, breakingOnly, hideToggles, status, bookmarksOnly, bookmarks, sort]);

  const featuredEvents = useMemo(() => events.slice(0, 6), [events]);

  const controls = (
    <div id="market-filters" className="space-y-3">
      <MarketTopicRail
        showCounts={false}
        items={HOME_TOPIC_CHIPS.map((chip) => ({
          id: chip.id,
          label: chip.label,
          count: topicCounts[chip.id],
        }))}
        selectedId={breakingOnly ? 'breaking' : topicId}
        onSelect={(id) => {
          setBreakingOnly(false);
          setTopicId(id);
        }}
      />

      <MarketControlsBar
        sort={sort}
        onSortChange={setSort}
        status={status}
        onStatusChange={setStatus}
      >
        <label className="inline-flex items-center gap-1.5 text-sm font-w490 text-neutral-500">
          <input
            type="checkbox"
            checked={hideToggles.hideSports}
            onChange={(event) =>
              setHideToggles((current) => ({
                ...current,
                hideSports: event.target.checked,
              }))
            }
            className="rounded border-border"
          />
          Hide sports
        </label>
        <label className="inline-flex items-center gap-1.5 text-sm font-w490 text-neutral-500">
          <input
            type="checkbox"
            checked={hideToggles.hideCrypto}
            onChange={(event) =>
              setHideToggles((current) => ({
                ...current,
                hideCrypto: event.target.checked,
              }))
            }
            className="rounded border-border"
          />
          Hide crypto
        </label>
        <label className="inline-flex items-center gap-1.5 text-sm font-w490 text-neutral-500">
          <input
            type="checkbox"
            checked={hideToggles.hideEarnings}
            onChange={(event) =>
              setHideToggles((current) => ({
                ...current,
                hideEarnings: event.target.checked,
              }))
            }
            className="rounded border-border"
          />
          Hide earnings
        </label>
      </MarketControlsBar>
    </div>
  );

  return (
    <>
      {!isLoading && !isError && featuredEvents.length > 0 ? (
        <FeaturedCarousel events={featuredEvents} />
      ) : null}

      <MarketsPageBody
        events={events}
        isLoading={isLoading}
        isError={isError}
        isFetching={isFetching}
        error={error}
        onRetry={() => {
          void refetch();
        }}
        controls={controls}
        showSectionToolbar
        emptyMessage={
          searchQuery.trim()
            ? `No markets found for "${searchQuery.trim()}"`
            : undefined
        }
      />
    </>
  );
}
