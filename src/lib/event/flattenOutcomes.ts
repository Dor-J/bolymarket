import { getYesNoFromMarket } from "@/lib/cards/mapEventToCardProps";
import { deriveBinaryMarketLabel } from "@/lib/cards/deriveMarketLabel";
import { deriveOutcomeDisplayName } from "@/lib/event/deriveOutcomeDisplayName";
import type { Event } from "@/types/polymarket";

/** Flattened outcome row for the event detail list. */
export interface DetailOutcomeRow {
  marketId: string;
  outcomeId: string;
  name: string;
  volume: number;
  yesPrice: number;
  noPrice: number;
  image?: string;
}

/**
 * Flattens event markets into detail outcome rows.
 * Multi-outcome markets produce one row per outcome; binary markets produce one row per market.
 */
export function flattenOutcomes(event: Event): DetailOutcomeRow[] {
  const rows: DetailOutcomeRow[] = [];

  for (const market of event.markets) {
    if (market.outcomes.length === 2) {
      const { yesPrice, noPrice, yesOutcomeId } = getYesNoFromMarket(market);

      rows.push({
        marketId: market.id,
        outcomeId: yesOutcomeId,
        name: deriveOutcomeDisplayName({
          eventTitle: event.title,
          marketQuestion: market.question,
          fallback: deriveBinaryMarketLabel(market.question),
        }),
        volume: market.volume,
        yesPrice,
        noPrice,
        image: market.image,
      });
      continue;
    }

    for (const outcome of market.outcomes) {
      rows.push({
        marketId: market.id,
        outcomeId: outcome.id,
        name: outcome.name,
        volume: market.volume,
        yesPrice: outcome.price,
        noPrice: Math.max(0, 1 - outcome.price),
        image: market.image,
      });
    }
  }

  return rows.sort((left, right) => right.yesPrice - left.yesPrice);
}

/**
 * Returns up to six outcomes for chart and legend display.
 */
export function getChartOutcomes(event: Event, limit = 6): DetailOutcomeRow[] {
  return flattenOutcomes(event).slice(0, limit);
}
