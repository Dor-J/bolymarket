import { cleanup, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import { renderWithProviders } from '@/test/test-utils';
import type { SportsGame } from '@/types/polymarket';
import { SportsTradeWidget } from './SportsTradeWidget';

const giantsGame: SportsGame = {
  gameId: 'mlb-giants-braves',
  eventId: 'event-1',
  slug: 'san-francisco-giants-vs-atlanta-braves',
  title: 'San Francisco Giants vs. Atlanta Braves',
  league: 'MLB',
  leagueId: 'mlb',
  volume: 1_000,
  matchupKey: 'san-francisco-giants-vs-atlanta-braves',
  teams: [
    { id: 1, name: 'San Francisco Giants', abbreviation: 'SFG' },
    { id: 2, name: 'Atlanta Braves', abbreviation: 'ATL' },
  ],
  moneyline: {
    id: 'market-1',
    question: 'San Francisco Giants vs. Atlanta Braves',
    volume: 1_000,
    sportsMarketType: 'moneyline',
    outcomes: [
      { id: 'giants', name: 'San Francisco Giants', price: 0.48 },
      { id: 'braves', name: 'Atlanta Braves', price: 0.52 },
    ],
  },
  tags: ['mlb'],
};

describe('SportsTradeWidget', () => {
  afterEach(() => {
    cleanup();
  });

  it('uses Polymarket-style compact matchup and outcome labels in the header', () => {
    renderWithProviders(
      <SportsTradeWidget
        game={giantsGame}
        selection={{
          gameId: giantsGame.gameId,
          marketType: 'moneyline',
          outcomeIndex: 0,
        }}
      />,
    );

    expect(screen.getByText('Giants vs Braves')).toBeInTheDocument();
    expect(screen.getByText('Giants')).toBeInTheDocument();
    expect(screen.queryByText('San Francisco Giants vs. Atlanta Braves')).not.toBeInTheDocument();
  });
});
