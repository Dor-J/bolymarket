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
}

/**
 * Returns price seeds for all outcomes visible on the home events grid.
 */
export function getVisibleOutcomeSeedsFromEvents(
  events: Event[],
): OutcomePriceSeed[] {
  const seeds = new Map<string, number>();

  for (const event of events) {
    if (resolveCardVariant(event) === "binary") {
      const props = mapEventToBinaryProps(event);
      const outcomeKey = getOutcomePriceKey(props.marketId, props.yesOutcomeId);
      seeds.set(outcomeKey, props.yesPrice);
      continue;
    }

    for (const row of getTopOutcomeRows(event, 2)) {
      const outcomeKey = getOutcomePriceKey(row.marketId, row.outcomeId);
      seeds.set(outcomeKey, row.yesPrice);
    }
  }

  return Array.from(seeds.entries(), ([outcomeKey, price]) => ({
    outcomeKey,
    price,
  }));
}

/**
 * Returns price seeds for every outcome row on the event detail page.
 */
export function getOutcomeSeedsFromEvent(event: Event): OutcomePriceSeed[] {
  return flattenOutcomes(event).map((row) => ({
    outcomeKey: getOutcomePriceKey(row.marketId, row.outcomeId),
    price: row.yesPrice,
  }));
}

/**
 * Returns deduplicated outcome keys from seed payloads.
 */
export function getOutcomeKeysFromSeeds(seeds: OutcomePriceSeed[]): string[] {
  return seeds.map((seed) => seed.outcomeKey);
}
