import { describe, expect, it } from 'vitest';
import { generateChartData } from './generateChartData';

const outcomes = [
  { id: 'yes', name: 'Yes', price: 0.28 },
  { id: 'no', name: 'No', price: 0.72 },
];

describe('generateChartData', () => {
  it('returns deterministic data for the same seed and timeframe', () => {
    const first = generateChartData(outcomes, '1d', 'event-1', 1_700_000_000_000);
    const second = generateChartData(outcomes, '1d', 'event-1', 1_700_000_000_000);

    expect(first).toEqual(second);
  });

  it('returns different point counts per timeframe', () => {
    const hourly = generateChartData(outcomes, '1h', 'event-1');
    const monthly = generateChartData(outcomes, '1m', 'event-1');

    expect(hourly.length).toBeGreaterThan(monthly.length);
  });

  it('keeps generated prices within 0–1', () => {
    const data = generateChartData(outcomes, 'all', 'event-2');

    for (const point of data) {
      expect(point.yes).toBeGreaterThanOrEqual(0);
      expect(point.yes).toBeLessThanOrEqual(1);
      expect(point.no).toBeGreaterThanOrEqual(0);
      expect(point.no).toBeLessThanOrEqual(1);
    }
  });

  it('ends at the current outcome prices', () => {
    const data = generateChartData(outcomes, '1w', 'event-3', 1_700_000_000_000);
    const lastPoint = data.at(-1);

    expect(lastPoint?.yes).toBeCloseTo(0.28, 5);
    expect(lastPoint?.no).toBeCloseTo(0.72, 5);
  });
});
