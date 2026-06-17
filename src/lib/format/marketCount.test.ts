import { describe, expect, it } from 'vitest';
import { formatMarketCount } from './marketCount';

describe('formatMarketCount', () => {
  it('returns plain numbers below 1000', () => {
    expect(formatMarketCount(301)).toBe('301');
    expect(formatMarketCount(0)).toBe('0');
  });

  it('formats thousands with one decimal when needed', () => {
    expect(formatMarketCount(1_500)).toBe('1.5K');
    expect(formatMarketCount(10_500)).toBe('11K');
  });

  it('formats millions', () => {
    expect(formatMarketCount(1_500_000)).toBe('1.5M');
    expect(formatMarketCount(12_000_000)).toBe('12M');
  });
});
