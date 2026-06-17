import type {
  Event,
  Market,
  Outcome,
  SportsEvent,
  SportsMarket,
  SportsMarketType,
} from "@/types/polymarket";
import type { GammaEvent, GammaMarket } from "./schemas";

const MIN_PRICE = 0;
const MAX_PRICE = 1;

/**
 * Coerces API volume fields into a finite number.
 */
function parseVolume(...values: Array<string | number | undefined>): number {
  for (const value of values) {
    if (value === undefined || value === null || value === "") {
      continue;
    }

    const parsed = typeof value === "number" ? value : Number.parseFloat(value);
    if (Number.isFinite(parsed) && parsed >= 0) {
      return parsed;
    }
  }

  return 0;
}

/**
 * Clamps a probability to the valid 0–1 range.
 */
function clampPrice(value: number): number {
  if (!Number.isFinite(value)) {
    return 0;
  }

  return Math.min(MAX_PRICE, Math.max(MIN_PRICE, value));
}

/**
 * Parses Gamma's string-encoded outcome names and prices into aligned pairs.
 */
function parseOutcomes(market: GammaMarket): Outcome[] {
  const names = market.outcomes ?? [];
  const prices = market.outcomePrices ?? [];
  const tokenIds = market.clobTokenIds ?? [];
  const length = Math.max(names.length, prices.length);

  const outcomes: Outcome[] = [];

  for (let index = 0; index < length; index += 1) {
    const name = names[index] ?? `Outcome ${index + 1}`;
    const rawPrice = prices[index];
    const parsedPrice =
      rawPrice === undefined ? 0 : clampPrice(Number.parseFloat(rawPrice));
    const tokenId = tokenIds[index];

    outcomes.push({
      id: tokenId ?? `${String(market.id)}-${index}`,
      name,
      price: parsedPrice,
    });
  }

  return outcomes;
}

/**
 * Parses Gamma sportsMarketType into the app enum.
 */
export function parseSportsMarketType(
  raw: string | undefined,
  question?: string,
): SportsMarketType {
  const normalized = raw?.toLowerCase().trim() ?? '';
  if (
    normalized.includes('moneyline') ||
    normalized === 'moneyline' ||
    normalized === 'child_moneyline'
  ) {
    return 'moneyline';
  }
  if (normalized.includes('spread') || normalized.includes('handicap')) {
    return 'spread';
  }
  if (normalized.includes('total')) {
    return 'total';
  }
  if (normalized.includes('prop')) {
    return 'prop';
  }

  const haystack = question?.toLowerCase() ?? '';
  if (/\bspread\b/.test(haystack)) {
    return 'spread';
  }
  if (/\b(o\/u|over\/under|total points|total runs)\b/.test(haystack)) {
    return 'total';
  }
  if (/\b(winner|moneyline|to win|will win)\b/.test(haystack)) {
    return 'moneyline';
  }

  return 'unknown';
}

function parseLine(value: string | number | undefined): number | undefined {
  if (value === undefined || value === null || value === '') {
    return undefined;
  }

  const parsed = typeof value === 'number' ? value : Number.parseFloat(value);
  return Number.isFinite(parsed) ? parsed : undefined;
}

function parseShortOutcomes(market: GammaMarket): string[] | undefined {
  const raw = market.shortOutcomes;
  if (!raw || raw.length === 0) {
    return undefined;
  }

  return raw;
}

/**
 * Normalizes a raw Gamma market with sports metadata.
 */
export function normalizeSportsMarket(market: GammaMarket): SportsMarket | null {
  const base = normalizeMarket(market);
  if (!base) {
    return null;
  }

  const sportsMarketType = parseSportsMarketType(
    typeof market.sportsMarketType === 'string'
      ? market.sportsMarketType
      : undefined,
    base.question,
  );

  return {
    ...base,
    sportsMarketType,
    line: parseLine(market.line),
    gameId: market.gameId !== undefined ? String(market.gameId) : undefined,
    gameStartTime: market.gameStartTime,
    teamAId:
      market.teamAID !== undefined ? String(market.teamAID) : undefined,
    teamBId:
      market.teamBID !== undefined ? String(market.teamBID) : undefined,
    shortOutcomes: parseShortOutcomes(market),
    gameStatus:
      typeof market.gameStatus === 'string' ? market.gameStatus : undefined,
  };
}

/**
 * Normalizes a raw Gamma event with sports market metadata preserved.
 */
export function normalizeSportsEvent(event: GammaEvent): SportsEvent | null {
  const base = normalizeEvent(event);
  if (!base) {
    return null;
  }

  const sportsMarkets = (event.markets ?? [])
    .map(normalizeSportsMarket)
    .filter((market): market is SportsMarket => market !== null);

  return {
    ...base,
    markets: sportsMarkets.length > 0 ? sportsMarkets : base.markets,
    sportsMarkets,
    gameStatus:
      typeof event.gameStatus === 'string' ? event.gameStatus : undefined,
    spreadsMainLine: parseLine(event.spreadsMainLine),
    totalsMainLine: parseLine(event.totalsMainLine),
  };
}

/**
 * Normalizes sports events from Gamma, dropping invalid entries.
 */
export function normalizeSportsEvents(events: GammaEvent[]): SportsEvent[] {
  return events
    .map(normalizeSportsEvent)
    .filter((event): event is SportsEvent => event !== null);
}

/**
 * Normalizes a raw Gamma market into the app domain model.
 */
export function normalizeMarket(market: GammaMarket): Market | null {
  const question = market.question?.trim();
  if (!question) {
    return null;
  }

  const outcomes = parseOutcomes(market);
  if (outcomes.length === 0) {
    return null;
  }

  return {
    id: String(market.id),
    question,
    slug: market.slug,
    volume: parseVolume(market.volumeNum, market.volume),
    outcomes,
  };
}

/**
 * Extracts lowercase tag slugs for client-side category filtering.
 */
function normalizeTags(event: GammaEvent): string[] {
  const tags = new Set<string>();

  if (event.category) {
    tags.add(event.category.toLowerCase());
  }

  for (const tag of event.tags ?? []) {
    if (tag.slug) {
      tags.add(tag.slug.toLowerCase());
    }
    if (tag.label) {
      tags.add(tag.label.toLowerCase());
    }
  }

  return Array.from(tags);
}

/**
 * Normalizes a raw Gamma event into the app domain model.
 * Returns null when required routing fields are missing.
 */
export function normalizeEvent(event: GammaEvent): Event | null {
  const slug = event.slug?.trim();
  const title = event.title?.trim();

  if (!slug || !title) {
    return null;
  }

  const markets = (event.markets ?? [])
    .map(normalizeMarket)
    .filter((market): market is Market => market !== null);

  if (markets.length === 0) {
    return null;
  }

  const eventVolume = parseVolume(event.volume, event.volume24hr);
  const marketsVolume = markets.reduce((sum, market) => sum + market.volume, 0);

  return {
    id: String(event.id),
    slug,
    title,
    description: event.description,
    image: event.image ?? event.icon,
    category: event.category?.toLowerCase(),
    tags: normalizeTags(event),
    volume: eventVolume > 0 ? eventVolume : marketsVolume,
    endDate: event.endDateIso ?? event.endDate,
    markets,
  };
}

/**
 * Normalizes an array of raw Gamma events, dropping invalid entries.
 */
export function normalizeEvents(events: GammaEvent[]): Event[] {
  return events
    .map(normalizeEvent)
    .filter((event): event is Event => event !== null);
}
