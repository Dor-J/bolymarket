import { cleanup, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import { renderWithProviders } from '@/test/test-utils';
import { OutcomeRow } from './OutcomeRow';

describe('OutcomeRow', () => {
  afterEach(() => {
    cleanup();
  });

  it('renders a Polymarket-style horizontal outcome row', () => {
    renderWithProviders(
      <OutcomeRow
        marketId="market-france"
        outcomeId="france"
        name="France"
        volume={59_661_594}
        yesPrice={0.18}
        noPrice={0.82}
        image="https://example.com/france.png"
      />,
    );

    expect(screen.getByText('France')).toBeInTheDocument();
    expect(screen.getByText('$59,661,594 Vol.')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Rewards' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Buy Yes/ })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Buy No/ })).toBeInTheDocument();
    expect(screen.getByText('18%')).toBeInTheDocument();
  });
});
