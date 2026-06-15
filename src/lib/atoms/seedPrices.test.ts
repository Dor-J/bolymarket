import { createStore } from 'jotai';
import { describe, expect, it } from 'vitest';
import {
  commitOutcomePriceTick,
  outcomePriceAtomFamily,
  seedOutcomePrice,
} from './prices';
import { seedOutcomePrices } from './seedPrices';

describe('seedOutcomePrice', () => {
  it('seeds an atom once', () => {
    const store = createStore();

    seedOutcomePrice(store, 'm1:yes', 0.42);
    seedOutcomePrice(store, 'm1:yes', 0.99);

    expect(store.get(outcomePriceAtomFamily('m1:yes'))?.value).toBe(0.42);
  });

  it('can force reseed', () => {
    const store = createStore();

    seedOutcomePrice(store, 'm1:yes', 0.42);
    seedOutcomePrice(store, 'm1:yes', 0.55, true);

    expect(store.get(outcomePriceAtomFamily('m1:yes'))?.value).toBe(0.55);
  });
});

describe('commitOutcomePriceTick', () => {
  it('updates value and previousValue', () => {
    const store = createStore();
    seedOutcomePrice(store, 'm1:yes', 0.4);

    commitOutcomePriceTick(store, 'm1:yes', 0.45);
    const state = store.get(outcomePriceAtomFamily('m1:yes'));

    expect(state?.value).toBe(0.45);
    expect(state?.previousValue).toBe(0.4);
  });

  it('ignores negligible changes', () => {
    const store = createStore();
    seedOutcomePrice(store, 'm1:yes', 0.4);

    commitOutcomePriceTick(store, 'm1:yes', 0.4000000001);
    const state = store.get(outcomePriceAtomFamily('m1:yes'));

    expect(state?.value).toBe(0.4);
    expect(state?.previousValue).toBe(0.4);
  });
});

describe('seedOutcomePrices', () => {
  it('seeds multiple outcome atoms from seed payloads', () => {
    const store = createStore();

    seedOutcomePrices(store, [
      { outcomeKey: 'm1:yes', price: 0.6 },
      { outcomeKey: 'm2:yes', price: 0.3 },
    ]);

    expect(store.get(outcomePriceAtomFamily('m1:yes'))?.value).toBe(0.6);
    expect(store.get(outcomePriceAtomFamily('m2:yes'))?.value).toBe(0.3);
  });

  it('supports force reseed for all payloads', () => {
    const store = createStore();

    seedOutcomePrices(store, [{ outcomeKey: 'm1:yes', price: 0.4 }]);
    seedOutcomePrices(store, [{ outcomeKey: 'm1:yes', price: 0.55 }], {
      force: true,
    });

    expect(store.get(outcomePriceAtomFamily('m1:yes'))?.value).toBe(0.55);
  });
});
