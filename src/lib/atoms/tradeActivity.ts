import { atom } from 'jotai';
import type { Store } from 'jotai/vanilla/store';

const MAX_TRADES_PER_EVENT = 20;

let tradeActivityIdSeq = 0;

/** Resets the trade id sequence — for unit tests only. */
export function resetTradeActivityIdSeqForTests(): void {
  tradeActivityIdSeq = 0;
}

/** Single live trade row for featured activity display. */
export interface TradeActivityItem {
  id: string;
  eventSlug: string;
  price: number;
  side?: string;
  timestamp: number;
  assetId?: string;
  /** Trade notional in USDC when provided by the activity feed. */
  size?: number;
  outcome?: string;
  userName?: string;
}

/** Recent trades keyed by event slug. */
export const tradeActivityByEventAtom = atom<Record<string, TradeActivityItem[]>>(
  {},
);

/**
 * Appends a trade to the per-event activity tape, trimming to the latest rows.
 */
export function appendTradeActivity(
  store: Store,
  eventSlug: string,
  item: Omit<TradeActivityItem, 'id' | 'eventSlug'>,
): void {
  const current = store.get(tradeActivityByEventAtom);
  const existing = current[eventSlug] ?? [];
  const nextItem: TradeActivityItem = {
    ...item,
    id: `${item.timestamp}-${item.assetId ?? 'trade'}-${++tradeActivityIdSeq}`,
    eventSlug,
  };

  store.set(tradeActivityByEventAtom, {
    ...current,
    [eventSlug]: [nextItem, ...existing].slice(0, MAX_TRADES_PER_EVENT),
  });
}

/**
 * Clears trade activity for event slugs that are no longer featured.
 */
export function pruneTradeActivity(
  store: Store,
  activeSlugs: ReadonlySet<string>,
): void {
  const current = store.get(tradeActivityByEventAtom);
  const next: Record<string, TradeActivityItem[]> = {};

  for (const slug of activeSlugs) {
    if (current[slug]) {
      next[slug] = current[slug];
    }
  }

  store.set(tradeActivityByEventAtom, next);
}
