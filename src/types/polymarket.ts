/**
 * Normalized domain types for Bolymarket.
 * Components must consume these — never raw Gamma API shapes.
 */

/** A prediction event grouping one or more markets. */
export interface Event {
  id: string;
  slug: string;
  title: string;
  description?: string;
  image?: string;
  category?: string;
  tags: string[];
  volume: number;
  endDate?: string;
  markets: Market[];
}

/** A single tradeable market within an event. */
export interface Market {
  id: string;
  question: string;
  slug?: string;
  image?: string;
  volume: number;
  outcomes: Outcome[];
}

/** A single outcome with its implied probability (0–1). */
export interface Outcome {
  id: string;
  name: string;
  price: number;
}

/** Sports bet type classification. */
export type SportsMarketType =
  | 'moneyline'
  | 'spread'
  | 'total'
  | 'prop'
  | 'unknown';

/** A market with sports-specific metadata from Gamma. */
export interface SportsMarket extends Market {
  sportsMarketType: SportsMarketType;
  line?: number;
  gameId?: string;
  gameStartTime?: string;
  teamAId?: string;
  teamBId?: string;
  shortOutcomes?: string[];
  gameStatus?: string;
}

/** Event with normalized sports markets. */
export interface SportsEvent extends Event {
  sportsMarkets: SportsMarket[];
  gameStatus?: string;
  spreadsMainLine?: number;
  totalsMainLine?: number;
}

/** Team metadata from Gamma `/teams`. */
export interface TeamInfo {
  id: number;
  name: string;
  abbreviation: string;
  record?: string;
  logo?: string;
  league?: string;
  color?: string;
  alias?: string;
}

/** Classified markets for a single game. */
export interface ClassifiedSportsMarkets {
  moneyline?: SportsMarket;
  spread?: SportsMarket;
  total?: SportsMarket;
}

/** View model for a sports live matchup row. */
export interface SportsGame {
  gameId: string;
  eventId: string;
  slug: string;
  title: string;
  league: string;
  leagueId: string;
  volume: number;
  image?: string;
  gameStartTime?: string;
  matchupKey: string;
  wsGameId?: string;
  isMoreMarkets?: boolean;
  teams: [TeamInfo, TeamInfo];
  moneyline?: SportsMarket;
  spread?: SportsMarket;
  total?: SportsMarket;
  tags: string[];
}

/** Live game state from the Polymarket Sports WebSocket. */
export interface SportsGameState {
  gameId: string;
  leagueAbbreviation?: string;
  slug?: string;
  homeTeam?: string;
  awayTeam?: string;
  status?: string;
  score?: string;
  period?: string;
  elapsed?: string;
  live?: boolean;
  ended?: boolean;
}

/** League summary for the sports sidebar. */
export interface SportsLeagueSummary {
  id: string;
  label: string;
  count: number;
  icon?: string;
}

/** Response from `/api/sports/live`. */
export interface SportsLiveResponse {
  games: SportsGame[];
  futuresGames: SportsGame[];
  leagues: SportsLeagueSummary[];
  fetchedAt: string;
}

/** Selected outcome on the sports live page. */
export interface SportsSelection {
  gameId: string;
  marketType: SportsMarketType;
  outcomeIndex: number;
}

/** Metadata from Gamma `/sports`. */
export interface SportsMetadata {
  sport: string;
  image?: string;
  resolution?: string;
  ordering?: string;
  tags?: string;
  series?: string;
}

/** Live price state for a market — used by Jotai in Phase 4. */
export interface MarketPriceState {
  value: number;
  previousValue: number;
  updatedAt: number;
}

/** Category filter values for client-side navigation. */
export type CategoryFilter =
  | "trending"
  | "crypto"
  | "sports"
  | "politics"
  | string;

/** Application theme mode. */
export type Theme = "light" | "dark";
