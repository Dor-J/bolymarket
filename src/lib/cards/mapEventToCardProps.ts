import { getYesDisplayPrice } from "@/lib/format/price";
import type { Event, Market } from "@/types/polymarket";
import type { BinaryCardProps, MultiOutcomeCardProps } from "@/lib/cards/types";
import { resolveCardVariant } from "./resolveCardVariant";

export interface OutcomeRowProps {
  marketId: string;
  outcomeId: string;
  name: string;
  yesPrice: number;
  noPrice: number;
}

/**
 * Extracts Yes/No prices from a binary market.
 */
export function getYesNoFromMarket(market: Market): {
  yesPrice: number;
  noPrice: number;
  yesOutcomeId: string;
  noOutcomeId: string;
} {
  const yesOutcome =
    market.outcomes.find((outcome) => outcome.name.toLowerCase() === "yes") ??
    market.outcomes[0];
  const noOutcome =
    market.outcomes.find((outcome) => outcome.name.toLowerCase() === "no") ??
    market.outcomes[1];

  const yesPrice = yesOutcome?.price ?? 0;
  const noPrice = noOutcome?.price ?? Math.max(0, 1 - yesPrice);

  return {
    yesPrice,
    noPrice,
    yesOutcomeId: yesOutcome?.id ?? `${market.id}-yes`,
    noOutcomeId: noOutcome?.id ?? `${market.id}-no`,
  };
}

/**
 * Returns the top N outcome rows by yes price for multi-outcome cards.
 */
export function getTopOutcomeRows(event: Event, limit = 2): OutcomeRowProps[] {
  const rows: OutcomeRowProps[] = [];

  for (const market of event.markets) {
    if (market.outcomes.length === 2) {
      const { yesPrice, noPrice, yesOutcomeId } = getYesNoFromMarket(market);

      rows.push({
        marketId: market.id,
        outcomeId: yesOutcomeId,
        name: market.question,
        yesPrice,
        noPrice,
      });
      continue;
    }

    for (const outcome of market.outcomes) {
      rows.push({
        marketId: market.id,
        outcomeId: outcome.id,
        name: outcome.name,
        yesPrice: outcome.price,
        noPrice: Math.max(0, 1 - outcome.price),
      });
    }
  }

  return rows
    .sort((left, right) => right.yesPrice - left.yesPrice)
    .slice(0, limit);
}

/**
 * Maps an event to BinaryCard props.
 */
export function mapEventToBinaryProps(event: Event): BinaryCardProps {
  const market = event.markets[0];
  const { yesPrice, noPrice, yesOutcomeId, noOutcomeId } =
    getYesNoFromMarket(market);

  return {
    eventId: event.id,
    slug: event.slug,
    title: event.title,
    image: event.image,
    volume: event.volume,
    marketId: market.id,
    yesOutcomeId,
    noOutcomeId,
    yesPrice,
    noPrice,
  };
}

/**
 * Maps an event to MultiOutcomeCard props.
 */
export function mapEventToMultiProps(event: Event): MultiOutcomeCardProps {
  return {
    eventId: event.id,
    slug: event.slug,
    title: event.title,
    image: event.image,
    volume: event.volume,
    outcomes: getTopOutcomeRows(event, 2).map(
      ({ marketId, outcomeId, name, yesPrice, noPrice }) => ({
        marketId,
        outcomeId,
        name,
        yesPrice,
        noPrice,
      }),
    ),
  };
}

/**
 * Maps an event to the appropriate card props based on variant.
 */
export function mapEventToCardProps(event: Event) {
  const variant = resolveCardVariant(event);

  if (variant === "binary") {
    return { variant, props: mapEventToBinaryProps(event) } as const;
  }

  return { variant, props: mapEventToMultiProps(event) } as const;
}

/**
 * Resolves yes display price for binary card hero percentage.
 */
export function getBinaryChancePrice(event: Event): number {
  const market = event.markets[0];

  if (!market) {
    return 0;
  }

  return getYesDisplayPrice(market.outcomes);
}
