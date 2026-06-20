'use client';

import { useAtomValue } from 'jotai';
import { useMemo, useState } from 'react';
import { CategoryPageHeader } from '@/components/category/CategoryPageHeader';
import { CategoryPageLayout } from '@/components/category/CategoryPageLayout';
import { CategorySidebar } from '@/components/category/CategorySidebar';
import { bookmarksAtom } from '@/lib/atoms/bookmarks';
import { bookmarksOnlyAtom, marketFiltersVisibleAtom } from '@/lib/atoms/marketPage';
import { searchQueryAtom } from '@/lib/atoms/search';
import { CATEGORY_EVENTS_GRID_CLASSES } from '@/lib/constants/eventsGrid';
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
 * Politics category page with sidebar navigation and Polymarket-style layout.
 */
export function PoliticsPageView() {
  const { events: rawEvents, isLoading, isError, error, refetch, isFetching } =
    useCategoryEvents('politics');
  const searchQuery = useAtomValue(searchQueryAtom);
  const bookmarks = useAtomValue(bookmarksAtom);
  const bookmarksOnly = useAtomValue(bookmarksOnlyAtom);
  const filtersVisible = useAtomValue(marketFiltersVisibleAtom);
  const [topicId, setTopicId] = useState('all');
  const [sort, setSort] = useState<MarketSort>('volume');
  const [status, setStatus] = useState<MarketStatus>('all');

  const topicCounts = useMemo(
    () => countTopicMatches(rawEvents, POLITICS_TOPIC_CHIPS),
    [rawEvents],
  );

  const sidebarItems = useMemo(
    () =>
      POLITICS_TOPIC_CHIPS.map((chip) => ({
        id: chip.id,
        label: chip.label,
        count: topicCounts[chip.id],
      })),
    [topicCounts],
  );

  const events = useMemo(() => {
    let result = filterByTopic(rawEvents, topicId, POLITICS_TOPIC_CHIPS);
    result = filterByStatus(result, status);

    if (bookmarksOnly) {
      result = filterByBookmarks(result, bookmarks);
    }

    return sortEvents(result, sort);
  }, [rawEvents, topicId, status, bookmarksOnly, bookmarks, sort]);

  const filterControls = (
    <MarketControlsBar
      sort={sort}
      onSortChange={setSort}
      status={status}
      onStatusChange={setStatus}
      className="pb-0"
    />
  );

  return (
    <CategoryPageLayout
      sidebar={
        <CategorySidebar
          items={sidebarItems}
          selectedId={topicId}
          onSelect={setTopicId}
        />
      }
    >
      <div className="flex w-full flex-col items-center gap-5 pt-3 lg:mx-auto lg:mb-4 lg:max-w-[1350px] lg:pt-5.5">
        <h1 className="sr-only lg:hidden">Politics</h1>

        <CategoryPageHeader title="Politics" filters={filterControls} />

        <div className="w-full px-4 lg:hidden">
          <MarketTopicRail
            items={sidebarItems}
            selectedId={topicId}
            onSelect={setTopicId}
            showCounts
          />
        </div>

        {filtersVisible ? (
          <div id="market-filters" className="w-full px-4 lg:hidden">
            {filterControls}
          </div>
        ) : null}

        <div className="w-full">
          <MarketsPageBody
            events={events}
            isLoading={isLoading}
            isError={isError}
            isFetching={isFetching}
            error={error}
            onRetry={() => {
              void refetch();
            }}
            hideHeading
            gridClassName={CATEGORY_EVENTS_GRID_CLASSES}
            gridWrapperClassName="px-4 lg:px-0"
            emptyMessage={
              searchQuery.trim()
                ? `No politics markets found for "${searchQuery.trim()}"`
                : undefined
            }
          />
        </div>
      </div>
    </CategoryPageLayout>
  );
}
