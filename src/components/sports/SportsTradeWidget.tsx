'use client';

import Image from 'next/image';
import { useMemo, useState } from 'react';
import { PriceDisplay } from '@/components/market/PriceDisplay';
import { TradingButton } from '@/components/trading/TradingButton';
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
import { ChevronDownSmall } from './SportsSidebarIcons';

export interface SportsTradeWidgetProps {
  game: SportsGame | null;
  selection: SportsSelection | null;
  onSelectOutcome?: (selection: SportsSelection) => void;
  className?: string;
}

type OrderSide = 'buy' | 'sell';

const QUICK_AMOUNTS = [1, 5, 10, 100] as const;

const quickAmountButtonClass = cn(
  'inline-flex h-7.5 cursor-pointer items-center justify-center gap-2 rounded-md',
  'border border-border px-2.5 text-xs font-semibold whitespace-nowrap',
  'text-text-secondary transition duration-150 active:scale-[97%]',
  'hover:bg-neutral-25 focus-visible:ring-1 focus-visible:ring-ring focus-visible:outline-none',
);

const TWO_WORD_TEAM_NICKNAMES = new Set([
  'blue jackets',
  'blue jays',
  'golden knights',
  'maple leafs',
  'red sox',
  'red wings',
  'trail blazers',
  'white sox',
]);

function getCompactTeamName(teamName: string | undefined): string {
  const normalized = teamName?.trim();
  if (!normalized) {
    return '';
  }

  const parts = normalized.split(/\s+/);
  if (parts.length <= 1) {
    return normalized;
  }

  const lastTwo = parts.slice(-2).join(' ');
  if (TWO_WORD_TEAM_NICKNAMES.has(lastTwo.toLowerCase())) {
    return lastTwo;
  }

  return parts.at(-1) ?? normalized;
}

function getCompactMatchupTitle(game: SportsGame): string {
  const [awayTeam, homeTeam] = game.teams;
  const awayName = getCompactTeamName(awayTeam.name);
  const homeName = getCompactTeamName(homeTeam.name);

  if (awayName && homeName) {
    return `${awayName} vs ${homeName}`;
  }

  return game.title.replace(/\s+vs\.?\s+/i, ' vs ');
}

function getMarketForSelection(
  game: SportsGame,
  selection: SportsSelection,
): SportsMarket | undefined {
  if (selection.marketType === 'spread') {
    return game.spread;
  }
  if (selection.marketType === 'total') {
    return game.total;
  }

  return game.moneyline;
}

/**
 * Sticky right-column trade panel for the sports live page.
 */
export function SportsTradeWidget({
  game,
  selection,
  onSelectOutcome,
  className,
}: SportsTradeWidgetProps) {
  const [orderSide, setOrderSide] = useState<OrderSide>('buy');
  const [amount, setAmount] = useState('');

  const activeSelection = useMemo(() => {
    if (!game) {
      return null;
    }

    if (selection) {
      return selection;
    }

    return {
      gameId: game.gameId,
      marketType: 'moneyline' as SportsMarketType,
      outcomeIndex: 0,
    };
  }, [game, selection]);

  const activeMarket = game && activeSelection
    ? getMarketForSelection(game, activeSelection)
    : undefined;
  const activeOutcome = activeMarket?.outcomes[activeSelection?.outcomeIndex ?? 0];
  const activeTeam =
    activeSelection && activeSelection.marketType !== 'total'
      ? game?.teams[activeSelection.outcomeIndex]
      : undefined;

  const leagueIcon = game ? getSportIconUrl(game.leagueId) : undefined;
  const activeTeamImage =
    activeTeam && game?.leagueId === 'world-cup'
      ? getWorldCupTeamFlagUrl(activeTeam.name)
      : undefined;
  const headerImage = activeTeam?.logo ?? activeTeamImage ?? leagueIcon;
  const activeTeamColors = getMoneylineFeedColors(
    activeSelection?.outcomeIndex ?? 0,
    activeTeam?.color,
  );
  const outcomeAccentColor = activeTeam ? activeTeamColors.background : '#E04000';
  const compactTitle = game ? getCompactMatchupTitle(game) : '';
  const activeOutcomeLabel =
    activeSelection?.marketType === 'total'
      ? activeOutcome?.name
      : getCompactTeamName(activeTeam?.name) || activeOutcome?.name;

  return (
    <div className={cn('not-lg:hidden hidden shrink-0 lg:flex lg:w-[372px]', className)}>
      <div
        id="trade-widget"
        className={cn(
          'sticky h-fit max-h-[calc(100vh-var(--navbar-height))] w-full',
          'box-border overflow-y-auto px-4 pt-8 pb-4 scrollbar-hide max-lg:hidden',
        )}
        style={{ top: 'var(--navbar-height)' }}
      >
        <div className="flex w-full flex-col">
          {game && activeMarket && activeOutcome ? (
            <div
              className={cn(
                'relative flex h-full w-[340px] flex-col gap-5 overflow-visible',
                'rounded-xl border border-border bg-surface-1 px-4 py-4 shadow-md',
              )}
            >
              <div className="flex w-full flex-col gap-5">
                <div className="flex w-full items-center gap-3">
                  <div
                    className="relative flex shrink-0 items-center justify-center overflow-hidden bg-transparent"
                    style={{
                      width: 40,
                      height: 40,
                      minWidth: 40,
                      minHeight: 40,
                      borderRadius: 4,
                    }}
                  >
                    {headerImage ? (
                      <Image
                        alt=""
                        src={headerImage}
                        width={40}
                        height={40}
                        className="h-10 w-auto object-contain"
                      />
                    ) : (
                      <span className="text-sm font-semibold text-text-secondary">
                        {game.title.charAt(0)}
                      </span>
                    )}
                  </div>
                  <div className="flex w-full min-w-0 flex-col">
                    <span className="truncate text-sm font-medium text-text-secondary">
                      {compactTitle}
                    </span>
                    <span
                      className="flex min-w-0 items-center text-base font-semibold dark:brightness-150"
                      style={{ color: outcomeAccentColor }}
                    >
                      <span className="min-w-0 truncate">{activeOutcomeLabel}</span>
                    </span>
                  </div>
                </div>

                <div className="-ml-4 flex w-[calc(100%+32px)] items-end justify-between border-b border-border px-4 pb-2">
                  <div className="flex gap-3" role="radiogroup" aria-label="Order side">
                    {(['buy', 'sell'] as const).map((side) => {
                      const active = orderSide === side;
                      return (
                        <button
                          key={side}
                          type="button"
                          role="radio"
                          aria-checked={active}
                          onClick={() => setOrderSide(side)}
                          className={cn(
                            'relative cursor-pointer bg-transparent font-semibold text-heading-lg',
                            'focus:outline-none active:outline-none',
                            active
                              ? 'text-text-primary'
                              : 'text-text-secondary hover:text-text-tertiary',
                          )}
                        >
                          {side === 'buy' ? 'Buy' : 'Sell'}
                          {active ? (
                            <div className="absolute bottom-[-9px] left-0 h-0.5 w-full bg-text-primary" />
                          ) : null}
                        </button>
                      );
                    })}
                  </div>
                  <button
                    type="button"
                    className={cn(
                      'flex w-[90px] cursor-pointer items-center justify-end gap-1',
                      'font-medium text-body-base text-text-primary capitalize outline-none',
                    )}
                  >
                    Market
                    <ChevronDownSmall className="ml-1 text-neutral-400" />
                  </button>
                </div>
              </div>

              <div className="flex w-full flex-col">
                <div className="flex w-full gap-3" role="radiogroup" aria-label="Outcome">
                  {activeMarket.outcomes.slice(0, 2).map((outcome, index) => {
                    const team = game.teams[index];
                    const label =
                      activeSelection?.marketType === 'total'
                        ? index === 0
                          ? 'O'
                          : 'U'
                        : (team?.abbreviation ?? outcome.name);
                    const selected = activeSelection?.outcomeIndex === index;
                    const teamColors = getMoneylineFeedColors(index, team?.color);

                    return (
                      <span
                        key={outcome.id}
                        className="flex h-12 w-full max-w-full min-w-0 flex-1"
                      >
                        <TradingButton
                          label={label}
                          marketId={activeMarket.id}
                          outcomeId={outcome.id}
                          price={outcome.price}
                          format="sportsCents"
                          variant={selected ? 'custom' : 'gray'}
                          backgroundColor={selected ? teamColors.background : undefined}
                          textColor={selected ? '#ffffff' : undefined}
                          shadowHeight="5px"
                          onClick={() => {
                            onSelectOutcome?.({
                              gameId: game.gameId,
                              marketType: activeSelection!.marketType,
                              outcomeIndex: index,
                            });
                          }}
                          className="h-[43px]! rounded-md uppercase"
                        >
                          <span className="flex flex-1 items-baseline justify-center px-3">
                            <span
                              className={cn(
                                'text-[15px] leading-tight font-semibold transition-none',
                                selected ? 'text-inherit opacity-70' : 'opacity-70',
                              )}
                            >
                              {label}
                            </span>
                            <PriceDisplay
                              marketId={activeMarket.id}
                              outcomeId={outcome.id}
                              initialPrice={outcome.price}
                              format="sportsCents"
                              className="ml-1 text-base font-semibold tabular-nums"
                            />
                          </span>
                        </TradingButton>
                      </span>
                    );
                  })}
                </div>
              </div>

              <div className="flex w-full flex-col gap-4">
                <div className="mt-3 flex w-full flex-col gap-2">
                  <div className="flex w-full items-center justify-between gap-3">
                    <p className="font-medium text-heading-lg text-text-primary">Amount</p>
                    <div className="relative flex min-w-px flex-1 items-center justify-end">
                      <input
                        id="market-order-amount-input"
                        type="text"
                        inputMode="decimal"
                        autoComplete="off"
                        value={amount}
                        onChange={(event) => setAmount(event.target.value)}
                        placeholder="$0"
                        className={cn(
                          'w-full bg-transparent text-right text-[40px] font-semibold',
                          'tracking-tight text-text-primary outline-none',
                          '[font-variant-numeric:tabular-nums] placeholder:text-text-tertiary',
                        )}
                      />
                    </div>
                  </div>
                  <div className="relative mt-2 flex flex-1 justify-end">
                    <div className="flex gap-1">
                      {QUICK_AMOUNTS.map((value) => (
                        <button
                          key={value}
                          type="button"
                          onClick={() => {
                            const current = Number.parseFloat(
                              amount.replace(/[^0-9.]/g, ''),
                            );
                            const next = Number.isFinite(current) ? current + value : value;
                            setAmount(`$${next}`);
                          }}
                          className={quickAmountButtonClass}
                        >
                          +${value}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex w-full flex-col gap-2">
                  <div className="flex h-full flex-1 overflow-hidden">
                    <span className="flex h-12 w-full max-w-full flex-1">
                      <TradingButton
                        variant="blue"
                        shadowHeight="5px"
                        className="h-[43px]! w-full rounded-md text-sm font-semibold"
                      >
                        <span className="flex items-center gap-3">
                          <span className="relative flex flex-col items-center gap-0.5">
                            <span className="flex items-center">
                              <span className="w-fit whitespace-nowrap text-sm font-semibold text-inherit!">
                                Trade
                              </span>
                            </span>
                          </span>
                        </span>
                      </TradingButton>
                    </span>
                  </div>
                </div>
              </div>

            </div>
          ) : (
            <div
              className={cn(
                'flex w-[340px] flex-col items-center justify-center gap-2',
                'rounded-xl border border-border bg-surface-1 px-4 py-10 text-center shadow-md',
              )}
            >
              <p className="text-sm font-medium text-text">Select a market</p>
              <p className="text-xs text-text-secondary">
                Choose a game from the list to preview the trade ticket.
              </p>
            </div>
          )}
          {game && activeMarket && activeOutcome ? (
            <p className="mt-3 w-[340px] bg-transparent text-center text-body-sm text-neutral-500 outline-none">
              By trading, you agree to the{' '}
              <a
                href="/tos"
                target="_blank"
                rel="noopener noreferrer"
                className="text-inherit underline"
              >
                Terms of Use
              </a>
              .
            </p>
          ) : null}
        </div>
      </div>
    </div>
  );
}
