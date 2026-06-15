import { cleanup, fireEvent, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import { OrderTicket } from './OrderTicket';
import { renderWithProviders } from '@/test/test-utils';

describe('OrderTicket', () => {
  afterEach(() => {
    cleanup();
  });

  it('renders buy/sell tabs and disabled trade CTA', () => {
    renderWithProviders(
      <OrderTicket
        marketId="market-1"
        yesOutcomeId="yes-1"
        yesPrice={0.6}
        noPrice={0.4}
      />,
    );

    expect(screen.getByRole('button', { name: 'Buy' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Sell' })).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Sign up to trade' }),
    ).toBeDisabled();
  });

  it('calculates payout from amount input', () => {
    renderWithProviders(
      <OrderTicket
        marketId="market-1"
        yesOutcomeId="yes-1"
        yesPrice={0.5}
        noPrice={0.5}
      />,
    );

    fireEvent.change(screen.getByLabelText('Amount'), {
      target: { value: '10' },
    });

    expect(screen.getByText('$20.00')).toBeInTheDocument();
  });
});
