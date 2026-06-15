import { describe, expect, it } from 'vitest';
import { formatVolume } from './volume';

describe('formatVolume', () => {
  it('formats zero and invalid volumes', () => {
    expect(formatVolume(0)).toBe('$0 Vol.');
    expect(formatVolume(Number.NaN)).toBe('$0 Vol.');
  });

  it('formats thousands', () => {
    expect(formatVolume(5_000)).toBe('$5.0K Vol.');
    expect(formatVolume(15_000)).toBe('$15K Vol.');
  });

  it('formats millions', () => {
    expect(formatVolume(57_000_000)).toBe('$57M Vol.');
  });

  it('formats billions', () => {
    expect(formatVolume(2_000_000_000)).toBe('$2.0B Vol.');
    expect(formatVolume(12_000_000_000)).toBe('$12B Vol.');
  });
});
