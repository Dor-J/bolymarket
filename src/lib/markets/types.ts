import type { Event } from '@/types/polymarket';

/** Sort options for market listing pages. */
export type MarketSort = 'volume' | 'newest';

/** Status filter for market listings. */
export type MarketStatus = 'all' | 'active';

/** Topic chip definition with optional count. */
export interface TopicChip {
  id: string;
  label: string;
  match: (event: Event) => boolean;
}

/** Market-type tab for crypto page. */
export interface MarketTypeTab {
  id: string;
  label: string;
  match: (event: Event) => boolean;
}

/** Home page category hide toggles. */
export interface HomeHideToggles {
  hideSports: boolean;
  hideCrypto: boolean;
  hideEarnings: boolean;
}
