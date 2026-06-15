import {
  getTopOutcomeRows,
  mapEventToBinaryProps,
} from "@/lib/cards/mapEventToCardProps";
import { resolveCardVariant } from "@/lib/cards/resolveCardVariant";
import { flattenOutcomes } from "@/lib/event/flattenOutcomes";
import type { Event } from "@/types/polymarket";
import { getOutcomePriceKey } from "./outcomeKey";

/** Seed payload for a single outcome price atom. */
export interface OutcomePriceSeed {
  outcomeKey: string;
  price: number;
  /** CLOB token id — used to map WebSocket trades to atoms. */
  assetId?: string;
  eventSlug?: string;
  marketSlug?: string;
}

/**
 * Returns price seeds for all outcomes visible on the home events grid.
 */
export function getVisibleOutcomeSeedsFromEvents(
  events: Event[],
): OutcomePriceSeed[] {
  const seeds = new Map<string, OutcomePriceSeed>();

  for (const event of events) {
    if (resolveCardVariant(event) === "binary") {
      const props = mapEventToBinaryProps(event);
      const market = event.markets[0];
      const outcomeKey = getOutcomePriceKey(props.marketId, props.yesOutcomeId);
      seeds.set(outcomeKey, {
        outcomeKey,
        price: props.yesPrice,
        assetId: props.yesOutcomeId,
        eventSlug: event.slug,
        marketSlug: market?.slug,
      });
      continue;
    }

    for (const row of getTopOutcomeRows(event, 2)) {
      const market = event.markets.find((item) => item.id === row.marketId);
      const outcomeKey = getOutcomePriceKey(row.marketId, row.outcomeId);
      seeds.set(outcomeKey, {
        outcomeKey,
        price: row.yesPrice,
        assetId: row.outcomeId,
        eventSlug: event.slug,
        marketSlug: market?.slug,
      });
    }
  }

  return Array.from(seeds.values());
}

/**
 * Returns price seeds for every outcome row on the event detail page.
 */
export function getOutcomeSeedsFromEvent(event: Event): OutcomePriceSeed[] {
  return flattenOutcomes(event).map((row) => {
    const market = event.markets.find((item) => item.id === row.marketId);
    return {
      outcomeKey: getOutcomePriceKey(row.marketId, row.outcomeId),
      price: row.yesPrice,
      assetId: row.outcomeId,
      eventSlug: event.slug,
      marketSlug: market?.slug,
    };
  });
}

/**
 * Returns deduplicated outcome keys from seed payloads.
 */
export function getOutcomeKeysFromSeeds(seeds: OutcomePriceSeed[]): string[] {
  return seeds.map((seed) => seed.outcomeKey);
}

/**
 * Stable signature of outcome keys (order-independent) for effect dependencies.
 */
export function getOutcomeKeysSignature(seeds: OutcomePriceSeed[]): string {
  return getOutcomeKeysFromSeeds(seeds)
    .slice()
    .sort()
    .join("|");
}
