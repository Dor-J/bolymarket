/** Props for the binary (Yes/No chance) market card. */
export interface BinaryCardProps {
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
}

/** Single outcome row on a multi-outcome card. */
export interface MultiOutcomeRowProps {
  marketId: string;
  outcomeId: string;
  name: string;
  yesPrice: number;
  noPrice: number;
}

/** Props for the multi-outcome market card. */
export interface MultiOutcomeCardProps {
  eventId: string;
  slug: string;
  title: string;
  image?: string;
  volume: number;
  outcomes: MultiOutcomeRowProps[];
}
