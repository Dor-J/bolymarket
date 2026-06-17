'use client';

import { useAtomValue } from 'jotai';
import { useMemo, useState } from 'react';
import { bookmarksAtom } from '@/lib/atoms/bookmarks';
import { bookmarksOnlyAtom } from '@/lib/atoms/marketPage';
import { searchQueryAtom } from '@/lib/atoms/search';
import { POLITICS_TOPIC_CHIPS } from '@/lib/markets/constants';
import {
  countTopicMatches,
  filterByBookmarks,
  filterByStatus,
  filterByTopic,
  sortEvents,
} from '@/lib/markets/filterEvents';
import type { MarketSort, MarketStatus } from '@/lib/markets/types';
import { useCategoryEvents } from '@/hooks/useCategoryEvents';
import { MarketControlsBar } from '@/components/markets/MarketControlsBar';
import { MarketTopicRail } from '@/components/markets/MarketTopicRail';
import { MarketsPageBody } from '@/components/markets/MarketsPageBody';

/**
 * Politics category page with subcategory chips and market controls.
 */
export function PoliticsPageView() {
  const { events: rawEvents, isLoading, isError, error, refetch, isFetching } =
    useCategoryEvents('politics');
  const searchQuery = useAtomValue(searchQueryAtom);
  const bookmarks = useAtomValue(bookmarksAtom);
  const bookmarksOnly = useAtomValue(bookmarksOnlyAtom);
  const [topicId, setTopicId] = useState('all');
  const [sort, setSort] = useState<MarketSort>('volume');
  const [status, setStatus] = useState<MarketStatus>('all');

  const topicCounts = useMemo(
    () => countTopicMatches(rawEvents, POLITICS_TOPIC_CHIPS),
    [rawEvents],
  );

  const events = useMemo(() => {
    let result = filterByTopic(rawEvents, topicId, POLITICS_TOPIC_CHIPS);
    result = filterByStatus(result, status);

    if (bookmarksOnly) {
      result = filterByBookmarks(result, bookmarks);
    }

    return sortEvents(result, sort);
  }, [rawEvents, topicId, status, bookmarksOnly, bookmarks, sort]);

  const controls = (
    <div id="market-filters" className="space-y-3">
      <MarketTopicRail
        items={POLITICS_TOPIC_CHIPS.map((chip) => ({
          id: chip.id,
          label: chip.label,
          count: topicCounts[chip.id],
        }))}
        selectedId={topicId}
        onSelect={setTopicId}
      />

      <MarketControlsBar
        sort={sort}
        onSortChange={setSort}
        status={status}
        onStatusChange={setStatus}
      />
    </div>
  );

  return (
    <div>
      <header className="mb-4">
        <h1 className="text-2xl leading-8 font-semibold text-text">Politics</h1>
      </header>

      <MarketsPageBody
        events={events}
        isLoading={isLoading}
        isError={isError}
        isFetching={isFetching}
        error={error}
        onRetry={() => {
          void refetch();
        }}
        heading="Politics markets"
        controls={controls}
        emptyMessage={
          searchQuery.trim()
            ? `No politics markets found for "${searchQuery.trim()}"`
            : undefined
        }
      />
    </div>
  );
}
