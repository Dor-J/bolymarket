import { act } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import { outcomePriceAtomFamily } from '@/lib/atoms/prices';
import type { ChartOutcome } from '@/lib/chart/types';
import { createJotaiStore, renderHookWithProviders } from '@/test/test-utils';
import { useLiveChartOutcomes } from './useLiveChartOutcomes';

const chartOutcomes: ChartOutcome[] = [
  {
    id: 'yes',
    marketId: 'market-1',
    name: 'Yes',
    price: 0.5,
    color: '#30a159',
  },
];

describe('useLiveChartOutcomes', () => {
  afterEach(() => {
    for (const key of outcomePriceAtomFamily.getParams()) {
      outcomePriceAtomFamily.remove(key);
    }
  });

  it('returns seed prices when live atoms are unset', () => {
    const jotaiStore = createJotaiStore();
    const { result } = renderHookWithProviders(
      () => useLiveChartOutcomes(chartOutcomes),
      { jotaiStore },
    );

    expect(result.current[0]?.price).toBe(0.5);
  });

  it('merges live atom prices into chart outcomes', async () => {
    const jotaiStore = createJotaiStore();
    jotaiStore.set(outcomePriceAtomFamily('market-1:yes'), {
      value: 0.72,
      previousValue: 0.5,
      updatedAt: Date.now(),
    });

    const { result } = renderHookWithProviders(
      () => useLiveChartOutcomes(chartOutcomes),
      { jotaiStore },
    );

    await act(async () => {
      await Promise.resolve();
    });

    expect(result.current[0]?.price).toBe(0.72);
  });

  it('returns a stable snapshot when live prices are unchanged', async () => {
    const jotaiStore = createJotaiStore();
    const { result } = renderHookWithProviders(
      () => useLiveChartOutcomes(chartOutcomes),
      { jotaiStore },
    );

    await act(async () => {
      await Promise.resolve();
    });

    const firstSnapshot = result.current;
    const secondSnapshot = result.current;

    expect(secondSnapshot).toBe(firstSnapshot);
  });

  it('updates when a subscribed outcome price changes', async () => {
    const jotaiStore = createJotaiStore();
    const { result } = renderHookWithProviders(
      () => useLiveChartOutcomes(chartOutcomes),
      { jotaiStore },
    );

    await act(async () => {
      jotaiStore.set(outcomePriceAtomFamily('market-1:yes'), {
        value: 0.61,
        previousValue: 0.5,
        updatedAt: Date.now(),
      });
      await Promise.resolve();
    });

    expect(result.current[0]?.price).toBe(0.61);
  });
});
