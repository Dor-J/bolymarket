import { cleanup, fireEvent, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { renderWithProviders } from '@/test/test-utils';
import { YesNoChip } from './YesNoChip';

describe('YesNoChip', () => {
  afterEach(() => {
    cleanup();
  });

  it('renders a custom label and forwards livePrice to PriceDisplay', () => {
    renderWithProviders(
      <YesNoChip
        side="yes"
        price={0.2}
        marketId="market-1"
        outcomeId="yes"
        label="Buy Yes"
        livePrice={{ value: 0.63, previousValue: 0.6, updatedAt: 1 }}
      />,
    );

    expect(screen.getByText('Buy Yes')).toBeInTheDocument();
    expect(screen.getByText('63%')).toBeInTheDocument();
  });

  it('uses inverse initial price for no chips when no live price is provided', () => {
    renderWithProviders(
      <YesNoChip
        side="no"
        price={0.7}
        marketId="market-1"
        outcomeId="yes"
        livePrice={null}
      />,
    );

    expect(screen.getByText('No')).toBeInTheDocument();
    expect(screen.getByText('30%')).toBeInTheDocument();
  });

  it('prevents parent click propagation while invoking its own click handler', () => {
    const parentClick = vi.fn();
    const chipClick = vi.fn();

    renderWithProviders(
      <div onClick={parentClick}>
        <YesNoChip
          side="yes"
          price={0.4}
          marketId="market-1"
          outcomeId="yes"
          onClick={chipClick}
          livePrice={null}
        />
      </div>,
    );

    fireEvent.click(screen.getByRole('button', { name: /yes40%/i }));

    expect(chipClick).toHaveBeenCalledTimes(1);
    expect(parentClick).not.toHaveBeenCalled();
  });
});
