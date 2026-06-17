import { describe, expect, it } from 'vitest';
import { formatSportsCents } from './sportsPrice';
import { formatSportsVolume } from './sportsVolume';

describe('sports formatting', () => {
  it('formats rounded sports cents', () => {
    expect(formatSportsCents(0.405)).toBe('41¢');
    expect(formatSportsCents(0.42)).toBe('42¢');
  });

  it('formats sports volume labels', () => {
    expect(formatSportsVolume(1_240_000)).toBe('$1.24M Vol');
    expect(formatSportsVolume(836_180)).toBe('$836.18K Vol');
  });
});
