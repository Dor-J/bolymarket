import { describe, expect, it } from 'vitest';
import {
  formatXAxisTick,
  getChartTimeSpan,
  getChartYDomain,
  getChartYTicks,
} from './axis';
import type { ChartPoint } from './types';

const baseTimestamp = new Date(2026, 0, 15, 13, 5).getTime();

function point(timestamp: number, values: Record<string, number>): ChartPoint {
  return {
    timestamp,
    label: '',
    ...values,
  };
}

describe('chart axis helpers', () => {
  it('uses a 25% Y domain when visible values fit with headroom', () => {
    const data = [
      point(baseTimestamp, { yes: 0.08, no: 0.12 }),
      point(baseTimestamp + 60_000, { yes: 0.2, no: 0.22 }),
    ];

    expect(getChartYDomain(data, ['yes', 'no'])).toEqual([0, 0.25]);
  });

  it('promotes to a 50% Y domain near the 25% boundary', () => {
    const data = [point(baseTimestamp, { yes: 0.24 })];

    expect(getChartYDomain(data, ['yes'])).toEqual([0, 0.5]);
  });

  it('uses a 50% Y domain for values below 50% with headroom', () => {
    const data = [point(baseTimestamp, { yes: 0.47 })];

    expect(getChartYDomain(data, ['yes'])).toEqual([0, 0.5]);
  });

  it('uses a full Y domain for values over 75%', () => {
    const data = [point(baseTimestamp, { yes: 0.82 })];

    expect(getChartYDomain(data, ['yes'])).toEqual([0, 1]);
  });

  it('falls back to a full Y domain for missing data', () => {
    expect(getChartYDomain([], ['yes'])).toEqual([0, 1]);
    expect(getChartYDomain([point(baseTimestamp, { no: 0.12 })], ['yes'])).toEqual([0, 1]);
  });

  it('returns stable ticks for probability buckets', () => {
    expect(getChartYTicks([0, 0.25])).toEqual([0, 0.05, 0.1, 0.15, 0.2, 0.25]);
    expect(getChartYTicks([0, 0.5])).toEqual([0, 0.1, 0.2, 0.3, 0.4, 0.5]);
    expect(getChartYTicks([0, 1])).toEqual([0, 0.25, 0.5, 0.75, 1]);
  });

  it('computes chart time span from timestamps', () => {
    const data = [
      point(baseTimestamp + 120_000, { yes: 0.2 }),
      point(baseTimestamp, { yes: 0.1 }),
      point(baseTimestamp + 60_000, { yes: 0.15 }),
    ];

    expect(getChartTimeSpan(data)).toBe(120_000);
  });

  it('formats short spans with minute-level labels', () => {
    expect(formatXAxisTick(baseTimestamp, '1h', 60 * 60 * 1000)).toBe('1:05 PM');
  });

  it('formats daily spans with hour-level labels', () => {
    expect(formatXAxisTick(baseTimestamp, '1d', 24 * 60 * 60 * 1000)).toBe('1 PM');
  });

  it('formats weekly spans with day labels', () => {
    expect(formatXAxisTick(baseTimestamp, '1w', 7 * 24 * 60 * 60 * 1000)).toBe('Jan 15');
  });

  it('formats monthly spans with month labels', () => {
    expect(formatXAxisTick(baseTimestamp, '1m', 60 * 24 * 60 * 60 * 1000)).toBe('Jan 26');
  });
});
