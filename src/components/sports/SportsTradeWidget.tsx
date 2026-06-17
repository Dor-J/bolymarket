'use client';

import { useAtomValue } from 'jotai';
import { useMemo, useState } from 'react';
import { MarketThumbnail } from '@/components/market/MarketThumbnail';
import { TradingButton } from '@/components/trading/TradingButton';
import { outcomePriceAtomFamily } from '@/lib/atoms/prices';
import { formatCents } from '@/lib/format/price';
import { getOutcomePriceKey } from '@/lib/prices/outcomeKey';
import type {
  SportsGame,
  SportsMarket,
  SportsMarketType,
  SportsSelection,
} from '@/types/polymarket';
import { cn } from '@/lib/cn';

export interface SportsTradeWidgetProps {
  game: SportsGame | null;
  selection: SportsSelection | null;
  onSelectOutcome?: (selection: SportsSelection) => void;
  className?: string;
}

type OrderSide = 'buy' | 'sell';

const QUICK_AMOUNTS = [1, 5, 10, 100] as const;

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

  const outcomeKey =
    activeMarket && activeOutcome
      ? getOutcomePriceKey(activeMarket.id, activeOutcome.id)
      : '';
  const livePrice = useAtomValue(outcomePriceAtomFamily(outcomeKey));
  const displayPrice = livePrice?.value ?? activeOutcome?.price ?? 0;

  const payout = useMemo(() => {
    const dollars = Number.parseFloat(amount.replace(/[^0-9.]/g, ''));
    if (!Number.isFinite(dollars) || dollars <= 0 || displayPrice <= 0) {
      return 0;
    }

    return dollars / displayPrice;
  }, [amount, displayPrice]);

  return (
    <div className={cn('not-lg:hidden hidden shrink-0 lg:flex lg:w-[372px]', className)}>
      <div
        id="trade-widget"
        className={cn(
          'sticky max-h-[calc(100vh-var(--navbar-height))] w-full',
          'box-border overflow-y-auto px-4 pt-8 pb-4 scrollbar-hide',
        )}
        style={{ top: 'var(--navbar-height)' }}
      >
        <div className="flex w-full flex-col">
          {game && activeMarket && activeOutcome ? (
            <div
              className={cn(
                'relative flex w-[340px] flex-col gap-5 overflow-visible',
                'rounded-xl border border-border bg-surface-1 px-4 py-4 shadow-md',
              )}
            >
              <div className="flex w-full items-center gap-3">
                <MarketThumbnail
                  title={game.title}
                  image={activeTeam?.logo ?? game.image}
                  size={40}
                  className="rounded-sm object-contain"
                />
                <div className="flex min-w-0 flex-col">
                  <span className="truncate text-sm font-medium text-neutral-500">
                    {game.title}
                  </span>
                  <span
                    className="truncate text-base font-semibold"
                    style={{ color: activeTeam?.color ?? '#C00040' }}
                  >
                    {activeOutcome.name}
                  </span>
                </div>
              </div>

              <div className="flex gap-4 border-b border-border">
                {(['buy', 'sell'] as const).map((side) => (
                  <button
                    key={side}
                    type="button"
                    onClick={() => setOrderSide(side)}
                    className={cn(
                      'border-b-2 pb-2 text-sm font-semibold capitalize transition-colors',
                      orderSide === side
                        ? 'border-text text-text'
                        : 'border-transparent text-neutral-500',
                    )}
                  >
                    {side}
                  </button>
                ))}
              </div>

              <div className="flex gap-2">
                {activeMarket.outcomes.slice(0, 2).map((outcome, index) => {
                  const team = game.teams[index];
                  const label =
                    activeSelection?.marketType === 'total'
                      ? index === 0
                        ? 'O'
                        : 'U'
                      : team?.abbreviation ?? outcome.name;

                  return (
                    <TradingButton
                      key={outcome.id}
                      label={label}
                      marketId={activeMarket.id}
                      outcomeId={outcome.id}
                      price={outcome.price}
                      format="cents"
                      variant="custom"
                      backgroundColor={team?.color}
                      onClick={() => {
                        onSelectOutcome?.({
                          gameId: game.gameId,
                          marketType: activeSelection!.marketType,
                          outcomeIndex: index,
                        });
                      }}
                      className={cn(
                        activeSelection?.outcomeIndex === index &&
                          'ring-2 ring-brand ring-offset-1',
                      )}
                    />
                  );
                })}
              </div>

              <div>
                <label className="text-xs font-medium text-neutral-500">
                  Market
                  <select
                    className={cn(
                      'mt-1 block w-full rounded-md border border-border bg-surface-2',
                      'px-3 py-2 text-sm text-text',
                    )}
                    defaultValue="market"
                  >
                    <option value="market">Market</option>
                  </select>
                </label>
              </div>

              <div>
                <label className="text-xs font-medium text-neutral-500">
                  Amount
                  <input
                    type="text"
                    inputMode="decimal"
                    value={amount}
                    onChange={(event) => setAmount(event.target.value)}
                    placeholder="$0"
                    className={cn(
                      'mt-1 w-full rounded-md border border-border bg-surface-2 px-3 py-3',
                      'text-sm text-text placeholder:text-neutral-500',
                      'focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none',
                    )}
                  />
                </label>
                <div className="mt-2 flex flex-wrap gap-2">
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
                      className={cn(
                        'rounded-full border border-border px-2.5 py-1',
                        'text-xs font-semibold text-neutral-600 hover:bg-neutral-50',
                      )}
                    >
                      +${value}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-1 text-sm">
                <div className="flex items-center justify-between text-neutral-500">
                  <span>Price</span>
                  <span className="font-semibold text-text">
                    {formatCents(displayPrice)}
                  </span>
                </div>
                <div className="flex items-center justify-between text-neutral-500">
                  <span>Potential payout</span>
                  <span className="font-semibold text-text">
                    {payout > 0 ? `$${payout.toFixed(2)}` : '—'}
                  </span>
                </div>
              </div>

              <TradingButton variant="blue" className="h-11 text-sm">
                Trade
              </TradingButton>

              <p className="text-center text-[11px] text-neutral-500">
                By trading, you agree to the{' '}
                <a href="/terms" className="underline">
                  Terms of Use
                </a>
                .
              </p>
            </div>
          ) : (
            <div
              className={cn(
                'flex w-[340px] flex-col items-center justify-center gap-2',
                'rounded-xl border border-border bg-surface-1 px-4 py-10 text-center shadow-md',
              )}
            >
              <p className="text-sm font-medium text-text">Select a market</p>
              <p className="text-xs text-neutral-500">
                Choose a game from the list to preview the trade ticket.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
