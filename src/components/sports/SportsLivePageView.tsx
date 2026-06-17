'use client';

import { useAtomValue } from 'jotai';
import { useEffect, useMemo, useState } from 'react';
import { searchQueryAtom } from '@/lib/atoms/search';
import { groupGamesByLeague } from '@/lib/sports/buildSportsGameCard';
import { getVisibleOutcomeSeedsFromSportsGames } from '@/lib/prices/visibleOutcomeKeys';
import { useSportsGameResults } from '@/hooks/useSportsGameResults';
import { useSportsLiveGames } from '@/hooks/useSportsLiveGames';
import { useLivePrices } from '@/hooks/useLivePrices';
import { MarketTopicRail } from '@/components/markets/MarketTopicRail';
import { EventsGridError } from '@/components/home/EventsGridError';
import { EventsGridSkeleton } from '@/components/home/EventsGridSkeleton';
import type { SportsGame, SportsLeagueSummary, SportsSelection } from '@/types/polymarket';
import { SportsLeagueSection } from './SportsLeagueSection';
import { SportsLiveHeader } from './SportsLiveHeader';
import { SportsPageLayout } from './SportsPageLayout';
import { SportsSidebar } from './SportsSidebar';
import { SportsTradeWidget } from './SportsTradeWidget';
import { SportsWorldCupBanner } from './SportsWorldCupBanner';

function formatSectionLabel(label: string): string {
  if (label === 'WORLD CUP') {
    return 'World Cup';
  }

  return label
    .toLowerCase()
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

function filterGames(
  games: SportsGame[],
  filterId: string,
  searchQuery: string,
): SportsGame[] {
  let result = games;

  if (filterId !== 'all') {
    result = result.filter((game) => game.leagueId === filterId);
  }

  const query = searchQuery.trim().toLowerCase();
  if (query) {
    result = result.filter(
      (game) =>
        game.title.toLowerCase().includes(query) ||
        game.teams.some((team) => team.name.toLowerCase().includes(query)),
    );
  }

  return result;
}

/**
 * Sports live page with three-column Polymarket-style layout.
 */
export function SportsLivePageView() {
  const { data, isLoading, isError, error, refetch } = useSportsLiveGames();
  const searchQuery = useAtomValue(searchQueryAtom);
  const [viewTab, setViewTab] = useState<'live' | 'futures'>('live');
  const [filterId, setFilterId] = useState('all');
  const [selection, setSelection] = useState<SportsSelection | null>(null);

  const liveGames = data?.games ?? [];
  const futuresGames = data?.futuresGames ?? [];
  const leagues: SportsLeagueSummary[] = data?.leagues ?? [];
  const sourceGames = viewTab === 'live' ? liveGames : futuresGames;

  const visibleGames = useMemo(
    () => filterGames(sourceGames, filterId, searchQuery),
    [sourceGames, filterId, searchQuery],
  );

  const sections = useMemo(() => {
    if (viewTab === 'futures') {
      return visibleGames.length > 0
        ? [{ id: 'futures', label: 'FUTURES', games: visibleGames }]
        : [];
    }

    return groupGamesByLeague(visibleGames);
  }, [visibleGames, viewTab]);

  const priceSeeds = useMemo(
    () => getVisibleOutcomeSeedsFromSportsGames(visibleGames),
    [visibleGames],
  );

  useLivePrices(priceSeeds);
  useSportsGameResults(visibleGames);

  const selectedGame = useMemo(() => {
    if (!selection) {
      return visibleGames[0] ?? null;
    }

    return (
      visibleGames.find((game) => game.gameId === selection.gameId) ??
      visibleGames[0] ??
      null
    );
  }, [visibleGames, selection]);

  useEffect(() => {
    if (visibleGames.length === 0) {
      setSelection(null);
      return;
    }

    if (
      !selection ||
      !visibleGames.some((game) => game.gameId === selection.gameId)
    ) {
      const first = visibleGames[0]!;
      setSelection({
        gameId: first.gameId,
        marketType: 'moneyline',
        outcomeIndex: 0,
      });
    }
  }, [visibleGames, selection]);

  const sidebarItems = useMemo<SportsLeagueSummary[]>(
    () =>
      leagues.map((league) => ({
        ...league,
        label: formatSectionLabel(league.label),
      })),
    [leagues],
  );

  if (isLoading) {
    return <EventsGridSkeleton heading="Sports Live" hideHeading />;
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
    <SportsPageLayout
      sidebar={
        <SportsSidebar
          viewTab={viewTab}
          onViewTabChange={setViewTab}
          leagues={sidebarItems}
          selectedFilterId={filterId === 'all' ? '' : filterId}
          onFilterSelect={(id) => {
            setFilterId(id);
            setViewTab('live');
          }}
        />
      }
      tradePanel={
        <SportsTradeWidget
          game={selectedGame}
          selection={selection}
          onSelectOutcome={setSelection}
        />
      }
    >
      <div className="relative h-fit w-full max-w-[756px] pt-8 max-lg:w-[calc(100vw-2rem)] max-lg:px-0 max-lg:pt-0 md:max-w-none lg:min-w-full lg:pl-8 xl:max-w-[756px]">
        {viewTab === 'live' ? (
          <SportsWorldCupBanner onSelect={() => setFilterId('world-cup')} />
        ) : null}

        <SportsLiveHeader />

        <div className="mb-3 lg:hidden">
          <MarketTopicRail
            items={[
              { id: 'live', label: 'Live' },
              { id: 'futures', label: 'Futures' },
              ...sidebarItems.map((item) => ({
                id: item.id,
                label: item.label,
                count: item.count,
              })),
            ]}
            selectedId={filterId === 'all' ? viewTab : filterId}
            onSelect={(id) => {
              if (id === 'live' || id === 'futures') {
                setViewTab(id);
                setFilterId('all');
                return;
              }

              setFilterId(id);
              setViewTab('live');
            }}
            showCounts
          />
        </div>

        {sections.length === 0 ? (
          <p className="py-8 text-center text-sm text-neutral-500">
            {viewTab === 'futures'
              ? 'No futures markets found'
              : 'No sports markets found'}
          </p>
        ) : (
          sections.map((section) => (
            <SportsLeagueSection
              key={section.id}
              label={formatSectionLabel(section.label)}
              games={section.games}
              selectedGameId={selectedGame?.gameId}
              selection={selection}
              onSelectOutcome={setSelection}
            />
          ))
        )}
      </div>
    </SportsPageLayout>
  );
}
