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
        eventTitle="World Cup Winner"
        outcomeName="France"
        yesPrice={0.6}
        noPrice={0.4}
      />,
    );

    expect(screen.getByRole('radio', { name: 'Buy' })).toBeInTheDocument();
    expect(screen.getByRole('radio', { name: 'Sell' })).toBeInTheDocument();
    expect(screen.getByText('World Cup Winner')).toBeInTheDocument();
    expect(screen.getByText('France')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Trade' })).toBeInTheDocument();
    expect(screen.getByText(/By trading, you agree/)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Terms of Use' })).toHaveAttribute(
      'href',
      '/tos',
    );
  });

  it('calculates payout from amount input', () => {
    renderWithProviders(
      <OrderTicket
        marketId="market-1"
        yesOutcomeId="yes-1"
        eventTitle="World Cup Winner"
        outcomeName="France"
        yesPrice={0.5}
        noPrice={0.5}
      />,
    );

    fireEvent.change(screen.getByLabelText('Amount'), {
      target: { value: '10' },
    });

    expect(screen.getByText(/Potential payout \$20.00/)).toBeInTheDocument();
  });
});
