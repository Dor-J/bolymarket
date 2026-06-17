'use client';

import Link from 'next/link';
import { useAtomValue } from 'jotai';
import { memo } from 'react';
import { MarketThumbnail } from '@/components/market/MarketThumbnail';
import { TradingButton } from '@/components/trading/TradingButton';
import { sportsGameStateAtomFamily } from '@/lib/atoms/sportsGameState';
import { formatVolume } from '@/lib/format/volume';
import {
  formatGameStatus,
  parseScorePair,
} from '@/lib/sports/formatGameStatus';
import type {
  SportsGame,
  SportsMarketType,
  SportsSelection,
} from '@/types/polymarket';
import { cn } from '@/lib/cn';

export interface SportsMarketRowProps {
  game: SportsGame;
  isSelected?: boolean;
  selection?: SportsSelection | null;
  onSelectOutcome?: (selection: SportsSelection) => void;
}

function formatSpreadLabel(abbrev: string, line: number | undefined): string {
  if (line === undefined) {
    return abbrev;
  }

  const formatted = Number.isInteger(line) ? String(line) : line.toFixed(1);
  const sign = line > 0 ? '+' : '';
  return `${abbrev} ${sign}${formatted}`;
}

function formatTotalLabel(side: 'over' | 'under', line: number | undefined): string {
  const prefix = side === 'over' ? 'O' : 'U';
  if (line === undefined) {
    return prefix;
  }

  const formatted = Number.isInteger(line) ? String(line) : line.toFixed(1);
  return `${prefix} ${formatted}`;
}

function OrderBookIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <path
        d="M3 12V8M6 12V5M9 12V3M12 12V6"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

/**
 * Sports live market row with teams, live status, and moneyline/spread/total odds.
 */
export const SportsMarketRow = memo(function SportsMarketRow({
  game,
  isSelected = false,
  selection,
  onSelectOutcome,
}: SportsMarketRowProps) {
  const href = `/event/${game.slug}`;
  const gameState = useAtomValue(sportsGameStateAtomFamily(game.gameId));
  const statusLabel = formatGameStatus(gameState, game.leagueId);
  const isLive = gameState?.live ?? false;
  const [awayScore, homeScore] = parseScorePair(gameState?.score);
  const volumeLabel = formatVolume(game.volume).replace(' Vol.', ' Vol');

  function handleOutcomeClick(
    marketType: SportsMarketType,
    outcomeIndex: number,
  ) {
    onSelectOutcome?.({
      gameId: game.gameId,
      marketType,
      outcomeIndex,
    });
  }

  function isOutcomeSelected(
    marketType: SportsMarketType,
    outcomeIndex: number,
  ): boolean {
    return (
      selection?.gameId === game.gameId &&
      selection.marketType === marketType &&
      selection.outcomeIndex === outcomeIndex
    );
  }

  function renderMarketColumn(
    marketType: SportsMarketType,
    market: SportsGame['moneyline'],
    labelForIndex: (index: number) => string,
  ) {
    if (!market || market.outcomes.length < 2) {
      return (
        <>
          <div className="flex h-9 items-center justify-center rounded-md bg-neutral-50 text-xs text-neutral-400">
            —
          </div>
          <div className="flex h-9 items-center justify-center rounded-md bg-neutral-50 text-xs text-neutral-400">
            —
          </div>
        </>
      );
    }

    return market.outcomes.slice(0, 2).map((outcome, index) => (
      <TradingButton
        key={outcome.id}
        label={labelForIndex(index)}
        marketId={market.id}
        outcomeId={outcome.id}
        price={outcome.price}
        format="cents"
        variant="custom"
        backgroundColor={game.teams[index]?.color}
        onClick={(event) => {
          event.stopPropagation();
          handleOutcomeClick(marketType, index);
        }}
        className={cn(
          isOutcomeSelected(marketType, index) && 'ring-2 ring-brand ring-offset-1',
        )}
      />
    ));
  }

  return (
    <div
      className={cn(
        'group relative flex w-full cursor-pointer flex-col bg-surface-1 p-3',
        'transition-colors hover:bg-neutral-50/50',
        isSelected && 'bg-neutral-50/80',
      )}
      onClick={() => {
        handleOutcomeClick('moneyline', 0);
      }}
      onKeyDown={(eventKey) => {
        if (eventKey.key === 'Enter' || eventKey.key === ' ') {
          eventKey.preventDefault();
          handleOutcomeClick('moneyline', 0);
        }
      }}
      role="button"
      tabIndex={0}
    >
      <div className="flex flex-col gap-3 @container">
        <div className="flex min-h-8 flex-1 items-center justify-between gap-2">
          <div className="flex min-w-0 flex-1 items-center gap-2">
            {isLive || statusLabel ? (
              <div className="flex shrink-0 items-center gap-2.5 whitespace-nowrap">
                {isLive ? (
                  <div className="relative flex items-center justify-center">
                    <div className="relative z-10 size-[7px] rounded-full bg-red-500" />
                    <div className="absolute -inset-px size-[9px] animate-ping rounded-full bg-red-500 opacity-75" />
                  </div>
                ) : null}
                <p className="text-sm font-semibold text-red-500">
                  {statusLabel ?? 'Live'}
                </p>
              </div>
            ) : null}
            <p className="truncate text-sm font-semibold text-neutral-500">
              {volumeLabel}
            </p>
          </div>
          <Link
            href={href}
            onClick={(clickEvent) => clickEvent.stopPropagation()}
            className="hidden rounded-lg bg-neutral-50 p-2 text-neutral-500 hover:bg-neutral-100 lg:inline-flex"
            aria-label="Open market"
          >
            <OrderBookIcon />
          </Link>
        </div>

        <div className="flex w-full flex-row gap-3 @max-[490px]:flex-col">
          <div className="grid min-w-0 flex-1 grid-cols-[28px_min-content_1fr] grid-rows-2 gap-x-3 gap-y-2 lg:gap-y-2">
            {game.teams.map((team, index) => {
              const score = index === 0 ? awayScore : homeScore;

              return (
                <div key={team.id} className="contents">
                  <div className="flex h-6 items-center justify-center rounded-sm bg-neutral-100 px-1.5 text-xs font-semibold">
                    {score ?? '—'}
                  </div>
                  <div className="relative size-7 overflow-hidden">
                    <MarketThumbnail
                      title={team.name}
                      image={team.logo ?? game.image}
                      size={28}
                      className="rounded-sm object-contain"
                    />
                  </div>
                  <div className="flex min-w-0 items-baseline gap-1.5 overflow-hidden">
                    <Link
                      href={href}
                      onClick={(clickEvent) => clickEvent.stopPropagation()}
                      className="truncate text-base font-semibold text-text hover:underline"
                    >
                      {team.name}
                    </Link>
                    {team.record ? (
                      <span className="shrink-0 text-xs text-neutral-500">
                        {team.record}
                      </span>
                    ) : null}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-1.5 flex flex-1 justify-end lg:mt-0">
            <div className="grid w-full max-w-full flex-1 grid-cols-1 gap-2 min-[1200px]:w-[372px] min-[1200px]:grid-cols-3">
              <div className="flex flex-col gap-2">
                {renderMarketColumn('moneyline', game.moneyline, (index) =>
                  game.teams[index]?.abbreviation ?? '',
                )}
              </div>
              <div className="hidden flex-col gap-2 min-[1200px]:flex">
                {renderMarketColumn('spread', game.spread, (index) =>
                  formatSpreadLabel(
                    game.teams[index]?.abbreviation ?? '',
                    game.spread?.line,
                  ),
                )}
              </div>
              <div className="hidden flex-col gap-2 min-[1200px]:flex">
                {renderMarketColumn('total', game.total, (index) =>
                  formatTotalLabel(index === 0 ? 'over' : 'under', game.total?.line),
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});
