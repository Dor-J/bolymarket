import type { MultiOutcomeRowProps } from './types';

/** Props for crypto up/down card variant. */
export interface CryptoUpDownCardProps {
  eventId: string;
  slug: string;
  title: string;
  image?: string;
  volume: number;
  marketId: string;
  yesOutcomeId: string;
  noOutcomeId: string;
  yesPrice: number;
  noPrice: number;
  assetLabel?: string | null;
  isLive?: boolean;
}

/** Props for crypto price-target card variant. */
export interface CryptoPriceTargetCardProps {
  eventId: string;
  slug: string;
  title: string;
  image?: string;
  volume: number;
  outcomes: MultiOutcomeRowProps[];
  assetLabel?: string | null;
  isLive?: boolean;
}
