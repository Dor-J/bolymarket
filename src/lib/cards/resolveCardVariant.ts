import type { Event } from "@/types/polymarket";
import { eventHaystack } from "@/lib/markets/topicMatchers";

export type CardVariant =
  | "binary"
  | "multi-outcome"
  | "crypto-up-down"
  | "crypto-price-target"
  | "sports-match";

function isSportsMatchHaystack(haystack: string): boolean {
  return /sports|soccer|fifwc|mlb|nba|nfl|nhl|tennis|cs2|esports/.test(
    haystack,
  );
}

function hasMatchTitle(haystack: string): boolean {
  return /\bvs\.?\b|\bv\b|game \d+|fifwc-/.test(haystack);
}

/**
 * Determines which card variant to render for an event.
 */
export function resolveCardVariant(event: Event): CardVariant {
  const haystack = eventHaystack(event);
  const market = event.markets[0];
  const outcomeNames =
    market?.outcomes.map((outcome) => outcome.name.toLowerCase()) ?? [];
  const isYesNo =
    outcomeNames.length === 2 &&
    outcomeNames.includes("yes") &&
    outcomeNames.includes("no");
  const hasDrawMarket = event.markets.some((candidate) => {
    const candidateHaystack =
      `${candidate.question} ${candidate.slug ?? ""}`.toLowerCase();
    return (
      candidate.outcomes.length === 2 && /\bdraw\b/.test(candidateHaystack)
    );
  });

  if (
    event.markets.length === 1 &&
    market &&
    market.outcomes.length >= 2 &&
    market.outcomes.length <= 3 &&
    !isYesNo &&
    isSportsMatchHaystack(haystack) &&
    (hasMatchTitle(haystack) || outcomeNames.some((name) => name === "draw"))
  ) {
    return "sports-match";
  }

  if (
    event.markets.length > 1 &&
    isSportsMatchHaystack(haystack) &&
    hasMatchTitle(haystack) &&
    hasDrawMarket
  ) {
    return "sports-match";
  }

  if (
    /up or down|up\/down|updown/.test(haystack) &&
    event.markets.length === 1
  ) {
    return "crypto-up-down";
  }

  if (/hit|reach|price will|above|below|price range/.test(haystack)) {
    return "crypto-price-target";
  }

  if (event.markets.length === 1) {
    if (market && market.outcomes.length === 2) {
      return "binary";
    }
  }

  return "multi-outcome";
}
