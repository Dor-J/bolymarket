'use client';

import { useAtomValue } from 'jotai';
import { useMemo, useState } from 'react';
import { bookmarksAtom } from '@/lib/atoms/bookmarks';
import { bookmarksOnlyAtom } from '@/lib/atoms/marketPage';
import { searchQueryAtom } from '@/lib/atoms/search';
import {
  CRYPTO_MARKET_TYPE_TABS,
  CRYPTO_TOPIC_CHIPS,
} from '@/lib/markets/constants';
import {
  countTopicMatches,
  filterByBookmarks,
  filterByMarketType,
  filterByStatus,
  filterByTopic,
  sortEvents,
} from '@/lib/markets/filterEvents';
import type { MarketSort, MarketStatus } from '@/lib/markets/types';
import { useCategoryEvents } from '@/hooks/useCategoryEvents';
import { MarketControlsBar } from '@/components/markets/MarketControlsBar';
import { MarketTopicRail } from '@/components/markets/MarketTopicRail';
import { MarketTypeTabs } from '@/components/markets/MarketTypeTabs';
import { MarketsPageBody } from '@/components/markets/MarketsPageBody';

/**
 * Crypto category page with time/asset chips and market-type tabs.
 */
export function CryptoPageView() {
  const { events: rawEvents, isLoading, isError, error, refetch, isFetching } =
    useCategoryEvents('crypto');
  const searchQuery = useAtomValue(searchQueryAtom);
  const bookmarks = useAtomValue(bookmarksAtom);
  const bookmarksOnly = useAtomValue(bookmarksOnlyAtom);
  const [topicId, setTopicId] = useState('all');
  const [typeId, setTypeId] = useState('all');
  const [sort, setSort] = useState<MarketSort>('volume');
  const [status, setStatus] = useState<MarketStatus>('all');

  const topicCounts = useMemo(
    () => countTopicMatches(rawEvents, CRYPTO_TOPIC_CHIPS),
    [rawEvents],
  );

  const events = useMemo(() => {
    let result = filterByTopic(rawEvents, topicId, CRYPTO_TOPIC_CHIPS);
    result = filterByMarketType(result, typeId, CRYPTO_MARKET_TYPE_TABS);
    result = filterByStatus(result, status);

    if (bookmarksOnly) {
      result = filterByBookmarks(result, bookmarks);
    }

    return sortEvents(result, sort);
  }, [rawEvents, topicId, typeId, status, bookmarksOnly, bookmarks, sort]);

  const controls = (
    <div id="market-filters" className="space-y-3">
      <MarketTopicRail
        items={CRYPTO_TOPIC_CHIPS.map((chip) => ({
          id: chip.id,
          label: chip.label,
          count: topicCounts[chip.id],
        }))}
        selectedId={topicId}
        onSelect={setTopicId}
      />

      <MarketTypeTabs
        items={CRYPTO_MARKET_TYPE_TABS.map((tab) => ({
          id: tab.id,
          label: tab.label,
        }))}
        selectedId={typeId}
        onSelect={setTypeId}
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
        <h1 className="text-2xl leading-8 font-semibold text-text">Crypto</h1>
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
        heading="Crypto markets"
        controls={controls}
        emptyMessage={
          searchQuery.trim()
            ? `No crypto markets found for "${searchQuery.trim()}"`
            : undefined
        }
      />
    </div>
  );
}
