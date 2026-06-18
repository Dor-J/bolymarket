import { z } from 'zod';
import type { ChartPoint, Timeframe } from '@/lib/chart/types';
import { formatChartPointLabel } from '@/lib/chart/axis';

const CLOB_BASE_URL = 'https://clob.polymarket.com';

const priceHistoryResponseSchema = z.object({
  history: z
    .array(
      z.object({
        t: z.number(),
        p: z.number(),
      }),
    )
    .optional()
    .default([]),
});

export interface FetchPriceHistoryOptions {
  interval?: string;
  fidelity?: number;
  startTs?: number;
  endTs?: number;
  signal?: AbortSignal;
}

interface TimeframeClobParams {
  interval: string;
  fidelity: number;
  durationMs: number;
}

const TIMEFRAME_CLOB_PARAMS: Record<Timeframe, TimeframeClobParams> = {
  '1h': { interval: '1h', fidelity: 1, durationMs: 60 * 60 * 1000 },
  '6h': { interval: '6h', fidelity: 5, durationMs: 6 * 60 * 60 * 1000 },
  '1d': { interval: '1d', fidelity: 15, durationMs: 24 * 60 * 60 * 1000 },
  '1w': { interval: '1w', fidelity: 60, durationMs: 7 * 24 * 60 * 60 * 1000 },
  '1m': { interval: '1m', fidelity: 360, durationMs: 30 * 24 * 60 * 60 * 1000 },
  all: { interval: 'max', fidelity: 1440, durationMs: 90 * 24 * 60 * 60 * 1000 },
};

function clampPrice(price: number): number {
  return Math.min(1, Math.max(0, price));
}

/**
 * Maps a CLOB history response to chart points for a single outcome series.
 */
export function normalizePriceHistory(
  tokenId: string,
  history: Array<{ t: number; p: number }>,
  timeframe: Timeframe,
): ChartPoint[] {
  const timestamps = history.map((point) => point.t * 1000);
  const spanMs =
    timestamps.length >= 2
      ? Math.max(...timestamps) - Math.min(...timestamps)
      : getClobParamsForTimeframe(timeframe).durationMs;

  return history
    .map((point) => ({
      timestamp: point.t * 1000,
      label: formatChartPointLabel(point.t * 1000, timeframe, spanMs),
      [tokenId]: clampPrice(point.p),
    }))
    .sort((a, b) => a.timestamp - b.timestamp);
}

/**
 * Returns CLOB interval/fidelity params for a chart timeframe.
 */
export function getClobParamsForTimeframe(timeframe: Timeframe): TimeframeClobParams {
  return TIMEFRAME_CLOB_PARAMS[timeframe];
}

/**
 * Fetches historical prices from the Polymarket CLOB API.
 */
export async function fetchPriceHistory(
  tokenId: string,
  timeframe: Timeframe,
  options: FetchPriceHistoryOptions = {},
): Promise<ChartPoint[]> {
  const params = getClobParamsForTimeframe(timeframe);
  const now = Date.now();
  const startTs = options.startTs ?? Math.floor((now - params.durationMs) / 1000);
  const endTs = options.endTs ?? Math.floor(now / 1000);

  const searchParams = new URLSearchParams({
    market: tokenId,
    interval: options.interval ?? params.interval,
    fidelity: String(options.fidelity ?? params.fidelity),
    startTs: String(startTs),
    endTs: String(endTs),
  });

  const response = await fetch(
    `${CLOB_BASE_URL}/prices-history?${searchParams.toString()}`,
    {
      headers: { Accept: 'application/json' },
      signal: options.signal,
    },
  );

  if (!response.ok) {
    throw new Error(
      `CLOB prices-history error: ${response.status} ${response.statusText}`,
    );
  }

  const json = priceHistoryResponseSchema.parse(await response.json());
  return normalizePriceHistory(tokenId, json.history, timeframe);
}

/**
 * Merges multiple single-series chart points into one combined dataset.
 */
export function mergeChartSeries(
  series: ChartPoint[][],
  outcomeIds: string[],
): ChartPoint[] {
  const byTimestamp = new Map<number, ChartPoint>();

  for (let index = 0; index < series.length; index += 1) {
    const outcomeId = outcomeIds[index];
    if (!outcomeId) {
      continue;
    }

    for (const point of series[index] ?? []) {
      const existing = byTimestamp.get(point.timestamp) ?? {
        timestamp: point.timestamp,
        label: point.label,
      };

      existing[outcomeId] = point[outcomeId] as number;
      byTimestamp.set(point.timestamp, existing);
    }
  }

  const sorted = Array.from(byTimestamp.values()).sort(
    (a, b) => a.timestamp - b.timestamp,
  );

  const lastValues: Record<string, number> = {};

  for (const point of sorted) {
    for (const outcomeId of outcomeIds) {
      const value = point[outcomeId];

      if (typeof value === 'number' && Number.isFinite(value)) {
        lastValues[outcomeId] = value;
        continue;
      }

      if (lastValues[outcomeId] !== undefined) {
        point[outcomeId] = lastValues[outcomeId];
      }
    }
  }

  return sorted;
}
