import { screen } from '@testing-library/react';
import { createStore } from 'jotai';
import { afterEach, describe, expect, it } from 'vitest';
import { outcomePriceAtomFamily } from '@/lib/atoms/prices';
import { getOutcomePriceKey } from '@/lib/prices/outcomeKey';
import { renderWithProviders } from '@/test/test-utils';
import { PriceDisplay } from './PriceDisplay';

describe('PriceDisplay', () => {
  afterEach(() => {
    for (const key of outcomePriceAtomFamily.getParams()) {
      outcomePriceAtomFamily.remove(key);
    }
  });

  it('uses a provided livePrice without reading atom state', () => {
    renderWithProviders(
      <PriceDisplay
        marketId="market-1"
        outcomeId="yes"
        initialPrice={0.2}
        livePrice={{ value: 0.67, previousValue: 0.61, updatedAt: 1 }}
      />,
    );

    expect(screen.getByText('67%')).toBeInTheDocument();
  });

  it('falls back to the outcome atom when livePrice is omitted', () => {
    const store = createStore();
    store.set(outcomePriceAtomFamily(getOutcomePriceKey('market-1', 'yes')), {
      value: 0.42,
      previousValue: 0.4,
      updatedAt: 1,
    });

    renderWithProviders(
      <PriceDisplay marketId="market-1" outcomeId="yes" initialPrice={0.2} />,
      { jotaiStore: store },
    );

    expect(screen.getByText('42%')).toBeInTheDocument();
  });

  it('formats inverse no-side prices and cents formats', () => {
    renderWithProviders(
      <div>
        <PriceDisplay
          marketId="market-1"
          outcomeId="yes"
          initialPrice={0.7}
          side="no"
          format="cents"
          livePrice={null}
        />
        <PriceDisplay
          marketId="market-2"
          outcomeId="home"
          initialPrice={0.435}
          format="sportsCents"
          livePrice={null}
        />
      </div>,
    );

    expect(screen.getByText('30¢')).toBeInTheDocument();
    expect(screen.getByText('44¢')).toBeInTheDocument();
  });
});
