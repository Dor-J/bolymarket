import type { Outcome } from "@/types/polymarket";
import type { ChartPoint, Timeframe } from "./types";
import { formatChartPointLabel } from "./axis";

const TIMEFRAME_CONFIG: Record<
  Timeframe,
  { points: number; durationMs: number }
> = {
  "1h": { points: 60, durationMs: 60 * 60 * 1000 },
  "6h": { points: 72, durationMs: 6 * 60 * 60 * 1000 },
  "1d": { points: 96, durationMs: 24 * 60 * 60 * 1000 },
  "1w": { points: 168, durationMs: 7 * 24 * 60 * 60 * 1000 },
  "1m": { points: 30, durationMs: 30 * 24 * 60 * 60 * 1000 },
  all: { points: 90, durationMs: 90 * 24 * 60 * 60 * 1000 },
};

/**
 * Deterministic seeded pseudo-random generator (Mulberry32).
 */
function createSeededRandom(seed: string): () => number {
  let hash = 0;

  for (let index = 0; index < seed.length; index += 1) {
    hash = (hash << 5) - hash + seed.charCodeAt(index);
    hash |= 0;
  }

  return () => {
    hash += 0x6d2b79f5;
    let t = hash;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function clampPrice(price: number): number {
  return Math.min(1, Math.max(0, price));
}

/**
 * Generates deterministic simulated historical chart data from current prices.
 */
export function generateChartData(
  outcomes: Outcome[],
  timeframe: Timeframe,
  seed: string,
  now = Date.now(),
): ChartPoint[] {
  const { points, durationMs } = TIMEFRAME_CONFIG[timeframe];
  const random = createSeededRandom(`${seed}:${timeframe}`);
  const startTime = now - durationMs;
  const stepMs = durationMs / Math.max(points - 1, 1);
  const seriesKeys = outcomes.map((outcome) => outcome.id);

  const workingPrices = outcomes.map((outcome) => clampPrice(outcome.price));
  const backwardPoints: ChartPoint[] = [];

  for (let index = points - 1; index >= 0; index -= 1) {
    const timestamp = startTime + index * stepMs;

    backwardPoints.unshift({
      timestamp,
      label: formatChartPointLabel(timestamp, timeframe, durationMs),
      ...Object.fromEntries(
        seriesKeys.map((key, seriesIndex) => [
          key,
          clampPrice(workingPrices[seriesIndex] ?? 0),
        ]),
      ),
    });

    if (index === 0) {
      break;
    }

    for (
      let seriesIndex = 0;
      seriesIndex < workingPrices.length;
      seriesIndex += 1
    ) {
      const delta = (random() - 0.5) * 0.04;
      workingPrices[seriesIndex] = clampPrice(
        (workingPrices[seriesIndex] ?? 0) - delta,
      );
    }
  }

  return backwardPoints;
}
