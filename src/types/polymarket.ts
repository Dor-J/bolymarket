/**
 * Normalized domain types for bolymarket.
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
  volume: number;
  outcomes: Outcome[];
}

/** A single outcome with its implied probability (0–1). */
export interface Outcome {
  id: string;
  name: string;
  price: number;
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
