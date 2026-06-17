'use client';

import Link from 'next/link';
import { memo, type MouseEvent, type ReactNode } from 'react';
import { MarketThumbnail } from '@/components/market/MarketThumbnail';
import { PriceDisplay } from '@/components/market/PriceDisplay';
import { TradingButton } from '@/components/trading/TradingButton';
import { useSportsGameState } from '@/hooks/useSportsGameState';
import { formatSportsVolume } from '@/lib/format/sportsVolume';
import {
  formatGameStatus,
  parseScorePair,
} from '@/lib/sports/formatGameStatus';
import { getSportIconUrl } from '@/lib/sports/sportIcons';
import { getMoneylineFeedColors } from '@/lib/sports/teamColors';
import { getWorldCupTeamFlagUrl } from '@/lib/sports/worldCupFlags';
import type {
  SportsGame,
  SportsMarket,
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

function formatSpreadLine(
  line: number | undefined,
  teamIndex: number,
): number | undefined {
  if (line === undefined) {
    return undefined;
  }

  return teamIndex === 0 ? line : -line;
}

function formatLineValue(line: number | undefined): string | null {
  if (line === undefined) {
    return null;
  }

  const formatted = Number.isInteger(line) ? String(line) : line.toFixed(1);
  const sign = line > 0 ? '+' : '';
  return `${sign}${formatted}`;
}

function OrderBookIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      fill="none"
      viewBox="0 0 20 20"
      aria-hidden
      className="size-4 shrink-0 text-text-secondary"
    >
      <path
        fill="currentColor"
        d="M13.623 2.889c1.618 0 2.86.557 3.585.984.579.342.916.959.916 1.614v9.083c0 1.284-1.29 2.243-2.539 1.752l-.001-.001a5.3 5.3 0 0 0-1.666-.367l-.284-.007a5.4 5.4 0 0 0-2.702.728l-.002.001a1.86 1.86 0 0 1-.928.25H10c-.327 0-.645-.087-.93-.25h-.002a5.4 5.4 0 0 0-2.478-.724l-.224-.005c-.77 0-1.43.169-1.95.374h-.001c-1.245.49-2.539-.46-2.539-1.747v-9.09c0-.659.34-1.27.916-1.61a7.07 7.07 0 0 1 3.585-.984c1.645 0 2.9.577 3.622 1.009a7.06 7.06 0 0 1 3.624-1.01M6.377 4.64c-1.21 0-2.146.417-2.695.741a.11.11 0 0 0-.056.103v9.09a.125.125 0 0 0 .103.126q.015.002.044-.007a7.1 7.1 0 0 1 2.59-.496 7.1 7.1 0 0 1 2.763.56v-9.34a5.3 5.3 0 0 0-2.749-.777m7.246-.001a5.3 5.3 0 0 0-2.747.774v9.343a7.1 7.1 0 0 1 2.76-.56 7.1 7.1 0 0 1 2.59.497q.029.01.044.007a.1.1 0 0 0 .047-.021.13.13 0 0 0 .057-.11V5.488a.12.12 0 0 0-.056-.107 5.3 5.3 0 0 0-2.695-.741m0 5.75c.572 0 1.098.07 1.57.179a.875.875 0 0 1-.393 1.705 5.2 5.2 0 0 0-2.353 0 .875.875 0 0 1-.394-1.704c.472-.11.998-.18 1.57-.18m0-3.5c.572 0 1.098.07 1.57.179a.875.875 0 0 1-.393 1.705 5.2 5.2 0 0 0-2.353 0 .875.875 0 0 1-.394-1.704c.472-.11.998-.18 1.57-.18"
      />
    </svg>
  );
}

function OddsButtonShell({
  children,
  dimmed = false,
}: {
  children: ReactNode;
  dimmed?: boolean;
}) {
  return (
    <span className={cn('h-full w-full', dimmed && 'opacity-80')}>
      <span className="flex h-10 w-full max-w-full flex-1">{children}</span>
    </span>
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
  const gameState = useSportsGameState(game);
  const statusLabel = formatGameStatus(gameState, game.leagueId);
  const isLive = gameState?.live ?? false;
  const isFinal =
    gameState?.ended === true ||
    /final|completed|closed|finished/i.test(gameState?.status ?? '');
  const [awayScore, homeScore] = parseScorePair(gameState?.score);
  const volumeLabel = formatSportsVolume(game.volume);
  const leagueIcon = getSportIconUrl(game.leagueId);
  const showScores = isLive || isFinal;

  function getTeamImage(teamName: string, logo?: string): string | undefined {
    if (logo) {
      return logo;
    }

    if (game.leagueId === 'world-cup') {
      return getWorldCupTeamFlagUrl(teamName);
    }

    return leagueIcon;
  }

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

  function handleRowClick() {
    handleOutcomeClick('moneyline', 0);
  }

  function stopClick(event: MouseEvent) {
    event.stopPropagation();
  }

  function renderMoneylineButtons(market: SportsMarket | undefined) {
    if (!market || market.outcomes.length < 2) {
      return (
        <>
          <EmptyOddsButton />
          <EmptyOddsButton />
        </>
      );
    }

    return market.outcomes.slice(0, 2).map((outcome, index) => {
      const colors = getMoneylineFeedColors(index, game.teams[index]?.color);
      const abbrev = game.teams[index]?.abbreviation ?? '';

      return (
        <OddsButtonShell key={outcome.id}>
          <TradingButton
            variant="custom"
            backgroundColor={colors.background}
            textColor={colors.color}
            onClick={(event) => {
              stopClick(event);
              handleOutcomeClick('moneyline', index);
            }}
            className={cn(
              'h-9! w-full rounded-md! px-0! text-xs!',
              isOutcomeSelected('moneyline', index) &&
                'ring-2 ring-brand ring-offset-1',
            )}
          >
            <span className="flex w-full justify-between px-4 max-lg:px-1">
              <p className="flex h-full flex-1 items-center justify-center overflow-hidden text-center text-xs font-semibold uppercase tracking-[0.15px]">
                <span className="min-w-0 overflow-hidden text-ellipsis whitespace-nowrap opacity-70">
                  {abbrev}
                </span>
                <PriceDisplay
                  marketId={market.id}
                  outcomeId={outcome.id}
                  initialPrice={outcome.price}
                  format="sportsCents"
                  className="ml-1 text-sm tabular-nums"
                />
              </p>
            </span>
          </TradingButton>
        </OddsButtonShell>
      );
    });
  }

  function renderLineButtons(
    marketType: 'spread' | 'total',
    market: SportsMarket | undefined,
    labelForIndex: (index: number) => { prefix: string; line: string | null },
  ) {
    if (!market || market.outcomes.length < 2) {
      return (
        <>
          <EmptyOddsButton />
          <EmptyOddsButton />
        </>
      );
    }

    return market.outcomes.slice(0, 2).map((outcome, index) => {
      const { prefix, line } = labelForIndex(index);
      const hasPrice = Number.isFinite(outcome.price) && outcome.price > 0;

      return (
        <OddsButtonShell key={outcome.id} dimmed>
          <TradingButton
            variant="gray"
            onClick={(event) => {
              stopClick(event);
              handleOutcomeClick(marketType, index);
            }}
            className={cn(
              'h-9! w-full justify-start! rounded-md! px-0! text-xs!',
              isOutcomeSelected(marketType, index) &&
                'ring-2 ring-brand ring-offset-1',
            )}
          >
            <span className="flex w-full justify-between px-1">
              <p className="flex h-full min-w-0 flex-1 items-center overflow-hidden px-2 text-left text-xs font-semibold uppercase tracking-[0.15px] whitespace-nowrap">
                <span className="flex min-w-0 flex-1 items-center gap-1 opacity-70">
                  <span className="min-w-0 overflow-hidden text-ellipsis whitespace-nowrap">
                    {prefix}
                  </span>
                  {line ? (
                    <span className="shrink-0">{line}</span>
                  ) : null}
                </span>
                {hasPrice ? (
                  <PriceDisplay
                    marketId={market.id}
                    outcomeId={outcome.id}
                    initialPrice={outcome.price}
                    format="sportsCents"
                    className="ml-1 shrink-0 text-sm tabular-nums"
                  />
                ) : (
                  <span className="ml-1 shrink-0 text-sm">--</span>
                )}
              </p>
            </span>
          </TradingButton>
        </OddsButtonShell>
      );
    });
  }

  return (
    <div
      className={cn(
        'relative mb-2 w-full overflow-hidden rounded-xl border border-border bg-surface-1',
        isSelected && 'ring-1 ring-brand/40',
      )}
    >
      <div
        className={cn(
          'group relative flex w-full cursor-pointer flex-col p-3',
          'bg-surface-1 transition-colors hover:bg-neutral-50/50',
        )}
        onClick={handleRowClick}
        onKeyDown={(eventKey) => {
          if (eventKey.key === 'Enter' || eventKey.key === ' ') {
            eventKey.preventDefault();
            handleRowClick();
          }
        }}
        role="button"
        tabIndex={0}
      >
        <div className="flex w-full flex-col gap-3 @container">
          <div className="flex h-8 min-h-8 flex-1 items-center justify-between gap-2">
            <div className="flex min-w-0 flex-1 items-center gap-2">
              <div className="flex min-w-0 flex-1 items-center gap-2">
                {isFinal ? (
                  <div className="flex h-5 shrink-0 items-center gap-2.5 whitespace-nowrap rounded-sm bg-neutral-50 px-1.5">
                    <p className="text-body-sm font-medium text-text-primary">
                      FINAL
                    </p>
                  </div>
                ) : isLive || statusLabel ? (
                  <div className="flex h-5 shrink-0 items-center gap-2.5 whitespace-nowrap">
                    {isLive ? (
                      <div className="relative flex items-center justify-center">
                        <div className="relative z-10 size-[7px] rounded-full bg-red-500" />
                        <div className="absolute -inset-px size-[9px] animate-ping rounded-full bg-red-500 opacity-75" />
                      </div>
                    ) : null}
                    <p className="text-body-sm font-semibold text-red-500">
                      {statusLabel ?? 'Live'}
                    </p>
                  </div>
                ) : null}
                <div className="pointer-events-auto relative z-10 flex min-w-0 items-center gap-1 overflow-hidden text-body-sm font-semibold text-text-secondary">
                  <span className="shrink-0 whitespace-nowrap">{volumeLabel}</span>
                </div>
              </div>
            </div>
            <div className="flex shrink-0 gap-1 overflow-visible">
              <Link
                href={href}
                onClick={stopClick}
                className="max-lg:hidden"
                aria-label="Order Book"
              >
                <span className="flex size-8 cursor-pointer items-center justify-center rounded-lg bg-neutral-50 outline-none hover:bg-neutral-100">
                  <OrderBookIcon />
                </span>
              </Link>
            </div>
          </div>

          <div className="flex w-full flex-col gap-3">
            <div className="flex w-full flex-row gap-3 @max-[490px]:flex-col">
              <div
                className={cn(
                  'grid w-full items-center gap-x-3 gap-y-3 lg:min-w-0 lg:flex-1 lg:self-center',
                  '@max-[490px]:w-full @max-[490px]:self-start',
                  showScores
                    ? 'grid-cols-[min-content_min-content_auto] grid-rows-[24px_24px] lg:grid-rows-[40px_40px] lg:gap-y-2'
                    : 'grid-cols-[min-content_auto] grid-rows-[24px_24px] lg:grid-rows-[40px_40px] lg:gap-y-2',
                )}
              >
                {game.teams.map((team, index) => {
                  const score = index === 0 ? awayScore : homeScore;
                  const image = getTeamImage(team.name, team.logo);

                  return (
                    <div key={team.id} className="contents">
                      {showScores ? (
                        <div className="score-container flex h-6 items-center justify-center rounded-sm bg-neutral-100 px-1.5 text-xs font-semibold text-text-primary">
                          {score ?? '0'}
                        </div>
                      ) : null}
                      <div className="relative size-7 overflow-hidden rounded-[4px]">
                        <MarketThumbnail
                          title={team.name}
                          image={image}
                          size={28}
                          className="object-scale-down"
                        />
                      </div>
                      <div className="flex min-w-0 max-w-full items-baseline gap-[5px] overflow-hidden">
                        <span className={cn(showScores && 'ml-1')}>
                          <Link
                            href={href}
                            onClick={stopClick}
                            className="line-clamp-1 w-fit text-body-base font-semibold whitespace-nowrap capitalize text-text-primary hover:underline hover:underline-offset-4"
                          >
                            {team.name}
                          </Link>
                        </span>
                        {team.record ? (
                          <span className="w-fit text-xs font-normal whitespace-nowrap text-text-secondary">
                            {team.record}
                          </span>
                        ) : null}
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="mt-1.5 flex flex-1 lg:mt-0 lg:justify-end">
                <div className="grid w-full flex-1 grid-cols-3 gap-2 lg:w-[372px] lg:@max-[490px]:w-full">
                  <div className="flex w-full items-end justify-between lg:justify-end">
                    <div className="flex w-full flex-col gap-2">
                      {renderMoneylineButtons(game.moneyline)}
                    </div>
                  </div>
                  <div className="flex w-full items-center @min-[490px]:justify-end">
                    <div className="flex w-full flex-col gap-2">
                      {renderLineButtons('spread', game.spread, (index) => ({
                        prefix: game.teams[index]?.abbreviation ?? '',
                        line: formatLineValue(
                          formatSpreadLine(game.spread?.line, index),
                        ),
                      }))}
                    </div>
                  </div>
                  <div className="flex w-full items-center @min-[490px]:justify-end">
                    <div className="flex w-full flex-col gap-2">
                      {renderLineButtons('total', game.total, (index) => ({
                        prefix: index === 0 ? 'O' : 'U',
                        line: formatLineValue(game.total?.line),
                      }))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

function EmptyOddsButton() {
  return (
    <OddsButtonShell dimmed>
      <TradingButton
        variant="gray"
        disabled
        className="h-9! w-full rounded-md! opacity-50"
      >
        <span className="text-sm">--</span>
      </TradingButton>
    </OddsButtonShell>
  );
}
