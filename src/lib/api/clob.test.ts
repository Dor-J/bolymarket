import { describe, expect, it } from 'vitest';
import { normalizePriceHistory, mergeChartSeries } from './clob';
import type { ChartPoint } from '@/lib/chart/types';

describe('normalizePriceHistory', () => {
  it('maps CLOB history to chart points', () => {
    const points = normalizePriceHistory(
      'token-1',
      [
        { t: 1_700_000_000, p: 0.42 },
        { t: 1_700_000_600, p: 0.55 },
      ],
      '1d',
    );

    expect(points).toHaveLength(2);
    expect(points[0]?.['token-1']).toBe(0.42);
    expect(points[1]?.['token-1']).toBe(0.55);
    expect(points[0]?.timestamp).toBe(1_700_000_000_000);
  });

  it('clamps prices to 0–1', () => {
    const points = normalizePriceHistory(
      'token-1',
      [{ t: 1, p: 1.5 }, { t: 2, p: -0.2 }],
      '1h',
    );

    expect(points[0]?.['token-1']).toBe(1);
    expect(points[1]?.['token-1']).toBe(0);
  });
});

describe('mergeChartSeries', () => {
  it('merges multiple series by timestamp', () => {
    const seriesA: ChartPoint[] = [
      { timestamp: 100, label: 'a', 'token-a': 0.4 },
      { timestamp: 200, label: 'b', 'token-a': 0.5 },
    ];
    const seriesB: ChartPoint[] = [
      { timestamp: 100, label: 'a', 'token-b': 0.6 },
      { timestamp: 200, label: 'b', 'token-b': 0.7 },
    ];

    const merged = mergeChartSeries([seriesA, seriesB], ['token-a', 'token-b']);

    expect(merged).toHaveLength(2);
    expect(merged[0]?.['token-a']).toBe(0.4);
    expect(merged[0]?.['token-b']).toBe(0.6);
    expect(merged[1]?.['token-a']).toBe(0.5);
    expect(merged[1]?.['token-b']).toBe(0.7);
  });
});
