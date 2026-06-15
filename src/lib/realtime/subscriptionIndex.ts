import type { OutcomePriceSeed } from "@/lib/prices/visibleOutcomeKeys";

export interface RealtimeSubscriptionIndex {
  assetToOutcomeKey: Map<string, string>;
  eventSlugs: string[];
}

/**
 * Builds lookup tables for mapping WebSocket trades to outcome price atoms.
 */
export function buildRealtimeSubscriptionIndex(
  seeds: OutcomePriceSeed[],
): RealtimeSubscriptionIndex {
  const assetToOutcomeKey = new Map<string, string>();
  const eventSlugs = new Set<string>();

  for (const seed of seeds) {
    if (seed.assetId) {
      assetToOutcomeKey.set(seed.assetId, seed.outcomeKey);
    }

    if (seed.eventSlug) {
      eventSlugs.add(seed.eventSlug);
    }
  }

  return {
    assetToOutcomeKey,
    eventSlugs: Array.from(eventSlugs).sort(),
  };
}

/**
 * Stable signature for subscription metadata — order-independent.
 */
export function getRealtimeSubscriptionSignature(
  seeds: OutcomePriceSeed[],
): string {
  const { assetToOutcomeKey, eventSlugs } =
    buildRealtimeSubscriptionIndex(seeds);

  const assets = Array.from(assetToOutcomeKey.keys()).sort().join(",");
  return `${eventSlugs.join("|")}::${assets}`;
}
