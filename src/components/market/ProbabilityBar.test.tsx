import { createStore } from 'jotai';
import { afterEach, describe, expect, it } from 'vitest';
import { outcomePriceAtomFamily } from '@/lib/atoms/prices';
import { getOutcomePriceKey } from '@/lib/prices/outcomeKey';
import { renderWithProviders } from '@/test/test-utils';
import { ProbabilityBar } from './ProbabilityBar';

function getSegments(container: HTMLElement): HTMLElement[] {
  const bar = container.querySelector('[role="presentation"]');
  return Array.from(bar?.children ?? []) as HTMLElement[];
}

describe('ProbabilityBar', () => {
  afterEach(() => {
    for (const key of outcomePriceAtomFamily.getParams()) {
      outcomePriceAtomFamily.remove(key);
    }
  });

  it('uses a provided livePrice for yes and no widths', () => {
    const { container } = renderWithProviders(
      <ProbabilityBar
        marketId="market-1"
        yesOutcomeId="yes"
        yesPrice={0.2}
        livePrice={{ value: 0.64, previousValue: 0.5, updatedAt: 1 }}
      />,
    );

    const [yesSegment, noSegment] = getSegments(container);
    expect(yesSegment).toHaveStyle({ width: '64%' });
    expect(noSegment).toHaveStyle({ width: '36%' });
  });

  it('falls back to the outcome atom when livePrice is omitted', () => {
    const store = createStore();
    store.set(outcomePriceAtomFamily(getOutcomePriceKey('market-1', 'yes')), {
      value: 0.42,
      previousValue: 0.4,
      updatedAt: 1,
    });

    const { container } = renderWithProviders(
      <ProbabilityBar marketId="market-1" yesOutcomeId="yes" yesPrice={0.2} />,
      { jotaiStore: store },
    );

    const [yesSegment, noSegment] = getSegments(container);
    expect(yesSegment).toHaveStyle({ width: '42%' });
    expect(noSegment).toHaveStyle({ width: '58%' });
  });

  it('clamps displayed widths into the 0-100 range', () => {
    const { container } = renderWithProviders(
      <ProbabilityBar
        marketId="market-1"
        yesOutcomeId="yes"
        yesPrice={0.5}
        livePrice={{ value: 1.25, previousValue: 1, updatedAt: 1 }}
      />,
    );

    const [yesSegment, noSegment] = getSegments(container);
    expect(yesSegment).toHaveStyle({ width: '100%' });
    expect(noSegment).toHaveStyle({ width: '0%' });
  });
});
