import { cleanup, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import { Footer } from './Footer';
import { renderWithProviders } from '@/test/test-utils';

describe('Footer', () => {
  afterEach(() => {
    cleanup();
  });
  it('renders the Polymarket-style brand subtitle and topic heading', () => {
    renderWithProviders(<Footer />);

    expect(
      screen.getByText("The World's Largest Prediction Market™"),
    ).toBeInTheDocument();
    expect(screen.getByText('Markets by category and topics')).toBeInTheDocument();
  });

  it('renders representative topic, support, and company links', () => {
    renderWithProviders(<Footer />);

    expect(screen.getAllByText('Commodities').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Predictions & odds').length).toBeGreaterThan(0);
    expect(screen.getAllByText('View more').length).toBeGreaterThan(0);
    expect(screen.getAllByRole('heading', { name: 'Support & Social' }).length).toBeGreaterThan(0);
    expect(screen.getByText('Learn')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Polymarket' })).toBeInTheDocument();
    expect(screen.getByText('Rewards')).toBeInTheDocument();
    expect(screen.getByText('Adventure One QSS Inc. © 2026')).toBeInTheDocument();
    expect(screen.getByText('Privacy')).toBeInTheDocument();
    expect(screen.getByLabelText('Select language')).toBeInTheDocument();
    expect(screen.getByText(/Polymarket operates globally/)).toBeInTheDocument();
  });
});
