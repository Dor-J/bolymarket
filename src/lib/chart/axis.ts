import type { ChartPoint, Timeframe } from './types';

export type ChartYDomain = [number, number];

const Y_DOMAIN_BUCKETS = [0.25, 0.5, 0.75, 1] as const;
const Y_DOMAIN_HEADROOM = 0.02;

function clampProbability(value: number): number {
  return Math.min(1, Math.max(0, value));
}

function getNumericSeriesValues(
  data: ChartPoint[],
  outcomeIds: string[],
): number[] {
  const values: number[] = [];

  for (const point of data) {
    for (const outcomeId of outcomeIds) {
      const value = point[outcomeId];

      if (typeof value === 'number' && Number.isFinite(value)) {
        values.push(clampProbability(value));
      }
    }
  }

  return values;
}

/**
 * Returns a readable Y-axis domain for probability charts.
 */
export function getChartYDomain(
  data: ChartPoint[],
  outcomeIds: string[],
): ChartYDomain {
  const values = getNumericSeriesValues(data, outcomeIds);

  if (values.length === 0) {
    return [0, 1];
  }

  const maxValue = Math.max(...values);

  for (const bucket of Y_DOMAIN_BUCKETS) {
    if (maxValue <= bucket - Y_DOMAIN_HEADROOM) {
      return [0, bucket];
    }
  }

  return [0, 1];
}

/**
 * Returns stable percentage ticks for known probability domains.
 */
export function getChartYTicks([, max]: ChartYDomain): number[] {
  if (max <= 0.25) {
    return [0, 0.05, 0.1, 0.15, 0.2, 0.25];
  }

  if (max <= 0.5) {
    return [0, 0.1, 0.2, 0.3, 0.4, 0.5];
  }

  if (max <= 0.75) {
    return [0, 0.15, 0.3, 0.45, 0.6, 0.75];
  }

  return [0, 0.25, 0.5, 0.75, 1];
}

/**
 * Returns the timestamp span represented by chart points.
 */
export function getChartTimeSpan(data: ChartPoint[]): number {
  const timestamps = data
    .map((point) => point.timestamp)
    .filter((timestamp) => Number.isFinite(timestamp));

  if (timestamps.length < 2) {
    return 0;
  }

  return Math.max(...timestamps) - Math.min(...timestamps);
}

/**
 * Formats X-axis timestamps using both the selected timeframe and real data span.
 */
export function formatXAxisTick(
  timestamp: number | string,
  timeframe: Timeframe,
  spanMs: number,
): string {
  const numericTimestamp =
    typeof timestamp === 'number' ? timestamp : Number(timestamp);

  if (!Number.isFinite(numericTimestamp)) {
    return String(timestamp);
  }

  const date = new Date(numericTimestamp);
  const hourMs = 60 * 60 * 1000;
  const dayMs = 24 * hourMs;

  if (timeframe === '1h' || spanMs <= 2 * hourMs) {
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
    });
  }

  if (timeframe === '6h' || timeframe === '1d' || spanMs <= 2 * dayMs) {
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
    });
  }

  if (timeframe === '1w' || spanMs <= 45 * dayMs) {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
  }

  return date.toLocaleDateString('en-US', {
    month: 'short',
    year: '2-digit',
  });
}

/**
 * Formats generated or normalized point labels consistently with chart axes.
 */
export function formatChartPointLabel(
  timestamp: number,
  timeframe: Timeframe,
  spanMs: number,
): string {
  return formatXAxisTick(timestamp, timeframe, spanMs);
}
