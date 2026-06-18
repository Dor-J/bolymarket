'use client';

import { useMemo, useState } from 'react';
import { useAtomValue } from 'jotai';
import { MarketThumbnail } from '@/components/market/MarketThumbnail';
import { outcomePriceAtomFamily } from '@/lib/atoms/prices';
import { formatCents } from '@/lib/format/price';
import { getOutcomePriceKey } from '@/lib/prices/outcomeKey';
import { cn } from '@/lib/cn';

export type OrderSide = 'buy' | 'sell';
export type OrderOutcomeSide = 'yes' | 'no';

export interface OrderTicketProps {
  marketId: string;
  yesOutcomeId: string;
  eventTitle: string;
  outcomeName: string;
  image?: string;
  yesPrice: number;
  noPrice: number;
  className?: string;
}

/**
 * Visual-only order ticket styled like Polymarket (read-only assignment scope).
 */
export function OrderTicket({
  marketId,
  yesOutcomeId,
  eventTitle,
  outcomeName,
  image,
  yesPrice,
  noPrice: _noPrice,
  className,
}: OrderTicketProps) {
  const [orderSide, setOrderSide] = useState<OrderSide>('buy');
  const [outcomeSide, setOutcomeSide] = useState<OrderOutcomeSide>('yes');
  const [amount, setAmount] = useState('');

  const outcomeKey = getOutcomePriceKey(marketId, yesOutcomeId);
  const livePrice = useAtomValue(outcomePriceAtomFamily(outcomeKey));
  const liveYes = livePrice?.value ?? yesPrice;
  const liveNo = Math.max(0, 1 - liveYes);

  const activePrice = outcomeSide === 'yes' ? liveYes : liveNo;
  const activeOutcomeLabel = outcomeSide === 'yes' ? 'Yes' : 'No';

  const payout = useMemo(() => {
    const dollars = Number.parseFloat(amount.replace(/[^0-9.]/g, ''));
    if (!Number.isFinite(dollars) || dollars <= 0 || activePrice <= 0) {
      return 0;
    }

    return dollars / activePrice;
  }, [activePrice, amount]);

  return (
    <div className={cn('w-full', className)}>
      <aside
        className="relative flex h-full flex-col gap-5 overflow-visible rounded-xl border border-border bg-surface-1 px-4 py-4 shadow-md"
        aria-label="Trading panel"
      >
        <div className="flex w-full flex-col gap-5">
          <div className="flex w-full items-center gap-3">
            <MarketThumbnail
              title={eventTitle}
              image={image}
              size={48}
              className="rounded-[7px]"
            />
            <div className="flex min-w-0 flex-1 flex-col">
              <span className="truncate text-sm font-medium text-text-secondary">
                {eventTitle}
              </span>
              <span className="flex min-w-0 items-center text-base font-semibold text-text-primary">
                <span className="min-w-0 truncate">{outcomeName}</span>
                <span className="mx-1.5 shrink-0 text-text-tertiary">·</span>
                <span
                  className={cn(
                    'shrink-0',
                    outcomeSide === 'yes' ? 'text-green-600' : 'text-red-500',
                  )}
                >
                  {activeOutcomeLabel}
                </span>
              </span>
            </div>
          </div>

          <div className="-mx-4 flex items-end justify-between border-b border-b-border px-4 pb-2">
            <div role="radiogroup" aria-label="Order side" className="flex gap-3">
              {(['buy', 'sell'] as const).map((side) => {
                const active = orderSide === side;

                return (
                  <button
                    key={side}
                    type="button"
                    role="radio"
                    aria-checked={active}
                    data-state={active ? 'checked' : 'unchecked'}
                    onClick={() => setOrderSide(side)}
                    className={cn(
                      'relative cursor-pointer bg-transparent text-heading-lg font-semibold capitalize',
                      'focus:outline-none active:outline-none',
                      active
                        ? 'text-text-primary'
                        : 'text-text-secondary hover:text-text-tertiary',
                    )}
                  >
                    {side === 'buy' ? 'Buy' : 'Sell'}
                    {active ? (
                      <div className="absolute -bottom-[9px] left-0 h-0.5 w-full bg-text-primary" />
                    ) : null}
                  </button>
                );
              })}
            </div>

            <button
              type="button"
              className="flex w-[90px] cursor-pointer items-center justify-end gap-1 text-body-base font-medium text-text-primary capitalize outline-none"
            >
              Market
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 12 12" aria-hidden>
                <path
                  d="M1.75 4.25 6 8.5l4.25-4.25"
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.5"
                />
              </svg>
            </button>
          </div>
        </div>

        <div className="flex w-full flex-col gap-4">
          <div role="radiogroup" aria-label="Outcome" className="flex w-full gap-3">
            <button
              type="button"
              role="radio"
              aria-checked={outcomeSide === 'yes'}
              onClick={() => setOutcomeSide('yes')}
              className={cn(
                'flex h-12 flex-1 cursor-pointer items-center justify-center rounded-sm',
                'px-3 text-base font-semibold transition-colors',
                outcomeSide === 'yes'
                  ? 'bg-green-600 text-white'
                  : 'bg-green-600/15 text-green-600 hover:bg-green-600/20',
              )}
            >
              <span className="opacity-70">Yes</span>
              <span className="ml-1">{formatCents(liveYes)}</span>
            </button>
            <button
              type="button"
              role="radio"
              aria-checked={outcomeSide === 'no'}
              onClick={() => setOutcomeSide('no')}
              className={cn(
                'flex h-12 flex-1 cursor-pointer items-center justify-center rounded-sm',
                'px-3 text-base font-semibold transition-colors',
                outcomeSide === 'no'
                  ? 'bg-red-500 text-white'
                  : 'bg-neutral-100 text-text-secondary hover:bg-neutral-200',
              )}
            >
              <span>No</span>
              <span className="ml-1">{formatCents(liveNo)}</span>
            </button>
          </div>

          <div className="flex w-full flex-col gap-2">
            <label className="flex items-center justify-between gap-3">
              <span className="text-heading-lg font-medium text-text-primary">
                Amount
              </span>
              <input
                id="market-order-amount-input"
                type="text"
                inputMode="decimal"
                autoComplete="off"
                value={amount}
                onChange={(event) => setAmount(event.target.value)}
                placeholder="$0"
                className={cn(
                  'h-[50px] min-w-0 flex-1 bg-transparent text-right text-[40px] font-semibold',
                  'tracking-tight text-text-primary outline-none placeholder:text-text-tertiary',
                )}
              />
            </label>

            <div className="flex justify-end">
              <div className="flex gap-1">
                {[1, 5, 10, 100].map((value) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setAmount(String(value))}
                    className={cn(
                      'inline-flex h-7.5 cursor-pointer items-center justify-center rounded-md',
                      'border border-button-outline-border px-2.5 text-xs font-semibold',
                      'text-text-secondary transition duration-150 active:scale-[97%] hover:bg-neutral-25',
                    )}
                  >
                    +${value}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="sr-only" aria-live="polite">
            Price {formatCents(activePrice)}. Potential payout{' '}
            {payout > 0 ? `$${payout.toFixed(2)}` : 'unavailable'}.
          </div>

          <button
            type="button"
            className="h-[43px] w-full cursor-pointer rounded-sm bg-brand px-4 py-2 text-sm font-semibold text-white transition duration-150 active:scale-[97%]"
          >
            Trade
          </button>
        </div>
      </aside>

      <div className="mt-4 flex w-full flex-col items-center gap-4">
        <button
          type="button"
          className="w-full bg-transparent text-body-sm text-neutral-500 outline-none focus:outline-none active:outline-none"
        >
          By trading, you agree to the{' '}
          <a
            target="_blank"
            rel="noopener noreferrer"
            className="text-inherit underline"
            href="/tos"
          >
            Terms of Use
          </a>
          .
        </button>
      </div>
    </div>
  );
}
