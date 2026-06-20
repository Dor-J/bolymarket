import { cleanup, fireEvent, screen, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { FeaturedCarousel } from './FeaturedCarousel';
import { renderWithProviders } from '@/test/test-utils';
import { createMockEvent } from '@/test/fixtures/events';

vi.mock('./FeaturedCompactChart', () => ({
  FeaturedCompactChart: () => <div data-testid="featured-chart" />,
}));

vi.mock('./FeaturedActivityRail', () => ({
  FeaturedActivityRail: () => <div data-testid="featured-activity" />,
}));

vi.mock('./FeaturedBidRail', () => ({
  FeaturedBidRail: () => <div data-testid="featured-bid-rail" />,
}));

const featuredEvents = [
  createMockEvent({
    id: '1',
    slug: 'world-cup-winner',
    title: 'World Cup Winner',
    category: 'sports',
    tags: ['soccer'],
    volume: 5000,
    markets: [
      {
        id: 'market-1',
        question: 'Will France win?',
        volume: 2000,
        outcomes: [
          { id: 'france', name: 'France', price: 0.18 },
          { id: 'spain', name: 'Spain', price: 0.13 },
          { id: 'argentina', name: 'Argentina', price: 0.11 },
        ],
      },
    ],
  }),
  createMockEvent({
    id: '2',
    slug: 'election-2028',
    title: 'Election 2028',
    tags: ['politics'],
    volume: 3000,
  }),
];

describe('FeaturedCarousel', () => {
  afterEach(() => {
    cleanup();
  });

  it('renders featured markets heading and active preview content', () => {
    renderWithProviders(<FeaturedCarousel events={featuredEvents} />);

    expect(
      screen.getByRole('region', { name: 'Featured markets' }),
    ).toBeInTheDocument();
    expect(screen.getByText('World Cup Winner')).toBeInTheDocument();
    expect(screen.getByText('France')).toBeInTheDocument();
    expect(screen.getByTestId('featured-chart')).toBeInTheDocument();
    expect(screen.getByTestId('featured-activity')).toBeInTheDocument();
    expect(screen.getByTestId('featured-bid-rail')).toBeInTheDocument();
  });

  it('navigates between featured slides', async () => {
    renderWithProviders(<FeaturedCarousel events={featuredEvents} />);

    fireEvent.click(
      screen.getAllByRole('button', { name: 'Next featured market: Election 2028' })[0]!,
    );

    await waitFor(() => {
      expect(screen.getByRole('heading', { level: 3, name: 'Election 2028' })).toBeInTheDocument();
    });
    expect(
      screen.queryByRole('heading', { level: 3, name: 'World Cup Winner' }),
    ).not.toBeInTheDocument();
  });

  it('returns null for empty events', () => {
    const { container } = renderWithProviders(<FeaturedCarousel events={[]} />);
    expect(container).toBeEmptyDOMElement();
  });

  it('exposes slide dot controls for multiple events', () => {
    renderWithProviders(<FeaturedCarousel events={featuredEvents} />);

    const dots = screen.getAllByRole('button', {
      name: /^Show featured market \d+$/,
    });
    expect(dots).toHaveLength(2);
    expect(dots[0]?.getAttribute('aria-current')).toBe('true');
  });
});
