import { screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { FeaturedCarousel } from './FeaturedCarousel';
import { renderWithProviders } from '@/test/test-utils';
import { mockEvents } from '@/test/fixtures/events';

describe('FeaturedCarousel', () => {
  it('renders featured markets heading and event links', () => {
    renderWithProviders(<FeaturedCarousel events={mockEvents.slice(0, 2)} />);

    expect(
      screen.getByRole('heading', { name: 'Featured markets' }),
    ).toBeInTheDocument();
    expect(screen.getByText('Crypto Event')).toBeInTheDocument();
  });

  it('returns null for empty events', () => {
    const { container } = renderWithProviders(<FeaturedCarousel events={[]} />);
    expect(container).toBeEmptyDOMElement();
  });
});
