import { describe, expect, it } from 'vitest';
import { formatGameStatus, parseScorePair } from './formatGameStatus';

describe('formatGameStatus', () => {
  it('formats MLB inning strings', () => {
    expect(
      formatGameStatus(
        {
          gameId: '1',
          live: true,
          period: 'Top 1',
        },
        'mlb',
      ),
    ).toBe('Top 1st');

    expect(
      formatGameStatus(
        {
          gameId: '1',
          live: true,
          period: 'Bot 2',
        },
        'mlb',
      ),
    ).toBe('Bot 2nd');
  });

  it('formats NFL/NBA quarter strings', () => {
    expect(
      formatGameStatus(
        {
          gameId: '1',
          live: true,
          period: 'Q4',
          elapsed: '5:18',
        },
        'nfl',
      ),
    ).toBe('Q4 5:18');
  });

  it('returns null for scheduled games', () => {
    expect(
      formatGameStatus({
        gameId: '1',
        live: false,
        status: 'Scheduled',
      }),
    ).toBeNull();
  });
});

describe('parseScorePair', () => {
  it('parses away-home score strings', () => {
    expect(parseScorePair('3-16')).toEqual([3, 16]);
    expect(parseScorePair(undefined)).toEqual([null, null]);
  });
});
