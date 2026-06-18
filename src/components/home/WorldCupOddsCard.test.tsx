import { cleanup, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import { renderWithProviders } from '@/test/test-utils';
import { WorldCupOddsCard } from './WorldCupOddsCard';

describe('WorldCupOddsCard', () => {
  afterEach(() => {
    cleanup();
  });

  it('renders the World Cup odds promo link', () => {
    renderWithProviders(<WorldCupOddsCard />);

    expect(screen.getByRole('link', { name: 'World Cup' })).toHaveAttribute(
      'href',
      '/sports/world-cup/games',
    );
    expect(
      screen.getAllByText(
        (_, element) => element?.textContent === 'World CupOdds & Predictions',
      ),
    ).not.toHaveLength(0);
  });
});
