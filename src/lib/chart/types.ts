/** Supported chart timeframe keys. */
export type Timeframe = '1h' | '6h' | '1d' | '1w' | '1m' | 'all';

/** Outcome metadata used by the price chart and legend. */
export interface ChartOutcome {
  id: string;
  marketId: string;
  name: string;
  price: number;
  color: string;
}

/** Single simulated chart data point. */
export interface ChartPoint {
  timestamp: number;
  label: string;
  [seriesKey: string]: number | string;
}
