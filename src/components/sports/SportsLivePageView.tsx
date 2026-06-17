'use client';

import { useMemo, useState } from 'react';
import { useCategoryEvents } from '@/hooks/useCategoryEvents';
import {
  SPORTS_FILTER_CHIPS,
} from '@/lib/markets/constants';
import {
  countTopicMatches,
  filterByTopic,
  groupSportsByLeague,
  sortEvents,
} from '@/lib/markets/filterEvents';
import { MarketTopicRail } from '@/components/markets/MarketTopicRail';
import { MarketTypeTabs } from '@/components/markets/MarketTypeTabs';
import { EventsGridError } from '@/components/home/EventsGridError';
import { EventsGridSkeleton } from '@/components/home/EventsGridSkeleton';
import { SportsLeagueSection } from './SportsLeagueSection';
import { OrderTicket } from '@/components/event/OrderTicket';
import { getYesNoFromMarket } from '@/lib/cards/mapEventToCardProps';

const SPORTS_VIEW_TABS = [
  { id: 'live', label: 'Live' },
  { id: 'futures', label: 'Futures' },
];

/**
 * Sports live-style page body for the existing /sports route.
 */
export function SportsLivePageView() {
  const { events: rawEvents, isLoading, isError, error, refetch } =
    useCategoryEvents('sports');
  const [viewTab, setViewTab] = useState('live');
  const [filterId, setFilterId] = useState('all');

  const topicCounts = useMemo(
    () => countTopicMatches(rawEvents, SPORTS_FILTER_CHIPS),
    [rawEvents],
  );

  const events = useMemo(() => {
    let result = filterByTopic(rawEvents, filterId, SPORTS_FILTER_CHIPS);

    if (viewTab === 'futures') {
      result = result.filter((event) =>
        /futures|winner|champion|season/.test(event.title.toLowerCase()),
      );
    }

    return sortEvents(result, 'volume');
  }, [rawEvents, filterId, viewTab]);

  const sections = useMemo(() => groupSportsByLeague(events), [events]);

  const featured = events[0];
  const primaryMarket = featured?.markets[0];
  const ticketProps = primaryMarket
    ? getYesNoFromMarket(primaryMarket)
    : null;

  if (isLoading) {
    return <EventsGridSkeleton heading="Sports Live" />;
  }

  if (isError) {
    return (
      <EventsGridError
        message={error instanceof Error ? error.message : undefined}
        onRetry={() => {
          void refetch();
        }}
      />
    );
  }

  return (
    <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
      <div className="min-w-0 flex-1">
        <header className="mb-4">
          <h1 className="text-2xl leading-8 font-semibold text-text">Sports</h1>
        </header>

        <MarketTypeTabs
          items={SPORTS_VIEW_TABS}
          selectedId={viewTab}
          onSelect={setViewTab}
        />

        <div className="mt-3">
          <MarketTopicRail
            items={SPORTS_FILTER_CHIPS.map((chip) => ({
              id: chip.id,
              label: chip.label,
              count: topicCounts[chip.id],
            }))}
            selectedId={filterId}
            onSelect={setFilterId}
          />
        </div>

        <h2 className="mt-4 mb-2 text-xl leading-6 font-semibold text-text">
          Sports Live
        </h2>

        {sections.length === 0 ? (
          <p className="py-8 text-center text-sm text-muted">No sports markets found</p>
        ) : (
          sections.map((section) => (
            <SportsLeagueSection
              key={section.id}
              label={section.label}
              events={section.events}
            />
          ))
        )}
      </div>

      {ticketProps && primaryMarket && featured ? (
        <OrderTicket
          marketId={primaryMarket.id}
          yesOutcomeId={ticketProps.yesOutcomeId}
          yesPrice={ticketProps.yesPrice}
          noPrice={ticketProps.noPrice}
          className="hidden w-full shrink-0 lg:sticky lg:top-[calc(var(--navbar-height)+1rem)] lg:block lg:w-[320px]"
        />
      ) : null}
    </div>
  );
}
