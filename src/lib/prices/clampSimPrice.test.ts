import { describe, expect, it } from 'vitest';
import { clampSimPrice } from './clampSimPrice';

describe('clampSimPrice', () => {
  it('clamps to 0.01–0.99', () => {
    expect(clampSimPrice(0)).toBe(0.01);
    expect(clampSimPrice(1)).toBe(0.99);
    expect(clampSimPrice(0.5)).toBe(0.5);
  });

  it('handles invalid values', () => {
    expect(clampSimPrice(Number.NaN)).toBe(0.01);
  });
});
