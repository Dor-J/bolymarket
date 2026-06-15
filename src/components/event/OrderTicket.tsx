'use client';

import { useMemo, useState } from 'react';
import { useAtomValue } from 'jotai';
import { outcomePriceAtomFamily } from '@/lib/atoms/prices';
import { formatCents } from '@/lib/format/price';
import { getOutcomePriceKey } from '@/lib/prices/outcomeKey';
import { cn } from '@/lib/cn';

export type OrderSide = 'buy' | 'sell';
export type OrderOutcomeSide = 'yes' | 'no';

export interface OrderTicketProps {
  marketId: string;
  yesOutcomeId: string;
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

  const payout = useMemo(() => {
    const dollars = Number.parseFloat(amount.replace(/[^0-9.]/g, ''));
    if (!Number.isFinite(dollars) || dollars <= 0 || activePrice <= 0) {
      return 0;
    }

    return dollars / activePrice;
  }, [activePrice, amount]);

  return (
    <aside
      className={cn('rounded-card border border-border bg-card p-4', className)}
      aria-label="Trading panel"
    >
      <div className="flex rounded-md bg-surface-2 p-1">
        <button
          type="button"
          onClick={() => setOrderSide('buy')}
          className={cn(
            'flex-1 rounded-sm px-3 py-2 text-sm font-semibold transition-colors',
            orderSide === 'buy'
              ? 'bg-card text-text shadow-sm'
              : 'text-muted-foreground',
          )}
        >
          Buy
        </button>
        <button
          type="button"
          onClick={() => setOrderSide('sell')}
          className={cn(
            'flex-1 rounded-sm px-3 py-2 text-sm font-semibold transition-colors',
            orderSide === 'sell'
              ? 'bg-card text-text shadow-sm'
              : 'text-muted-foreground',
          )}
        >
          Sell
        </button>
      </div>

      <div className="mt-4 flex gap-2">
        <button
          type="button"
          onClick={() => setOutcomeSide('yes')}
          className={cn(
            'flex-1 rounded-md px-3 py-2 text-sm font-semibold transition-colors',
            outcomeSide === 'yes'
              ? 'bg-yes/10 text-yes'
              : 'text-muted-foreground hover:bg-surface-2',
          )}
        >
          Yes {formatCents(liveYes)}
        </button>
        <button
          type="button"
          onClick={() => setOutcomeSide('no')}
          className={cn(
            'flex-1 rounded-md px-3 py-2 text-sm font-semibold transition-colors',
            outcomeSide === 'no'
              ? 'bg-no/10 text-no'
              : 'text-muted-foreground hover:bg-surface-2',
          )}
        >
          No {formatCents(liveNo)}
        </button>
      </div>

      <label className="mt-4 block text-sm font-medium text-muted-foreground">
        Amount
        <input
          type="text"
          inputMode="decimal"
          value={amount}
          onChange={(event) => setAmount(event.target.value)}
          placeholder="$0"
          className={cn(
            'mt-2 w-full rounded-md border border-border bg-surface-2 px-3 py-3',
            'text-sm text-text placeholder:text-muted-foreground',
            'focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none',
          )}
        />
      </label>

      <div className="mt-3 space-y-1 text-sm">
        <div className="flex items-center justify-between text-muted-foreground">
          <span>Price</span>
          <span className="font-semibold text-text">
            {formatCents(activePrice)}
          </span>
        </div>
        <div className="flex items-center justify-between text-muted-foreground">
          <span>Potential payout</span>
          <span className="font-semibold text-text">
            {payout > 0 ? `$${payout.toFixed(2)}` : '—'}
          </span>
        </div>
      </div>

      <button
        type="button"
        disabled
        className={cn(
          'mt-4 w-full rounded-md bg-brand px-4 py-3 text-sm font-semibold text-white',
          'opacity-60 transition-opacity',
        )}
      >
        Sign up to trade
      </button>
    </aside>
  );
}
