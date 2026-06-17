import { describe, expect, it, beforeEach } from 'vitest';
import {
  appendTradeActivity,
  pruneTradeActivity,
  resetTradeActivityIdSeqForTests,
  tradeActivityByEventAtom,
} from './tradeActivity';
import { createStore } from 'jotai';

describe('tradeActivity', () => {
  beforeEach(() => {
    resetTradeActivityIdSeqForTests();
  });
  it('appends trades per event and trims to max rows', () => {
    const store = createStore();

    for (let index = 0; index < 25; index += 1) {
      appendTradeActivity(store, 'world-cup', {
        price: 0.1 + index * 0.01,
        timestamp: index,
      });
    }

    const state = store.get(tradeActivityByEventAtom);
    expect(state['world-cup']).toHaveLength(20);
    expect(state['world-cup']?.[0]?.price).toBeCloseTo(0.34);
  });

  it('prunes inactive event slugs', () => {
    const store = createStore();

    appendTradeActivity(store, 'event-a', {
      price: 0.5,
      timestamp: 1,
    });
    appendTradeActivity(store, 'event-b', {
      price: 0.6,
      timestamp: 2,
    });

    pruneTradeActivity(store, new Set(['event-a']));

    const state = store.get(tradeActivityByEventAtom);
    expect(state['event-a']).toHaveLength(1);
    expect(state['event-b']).toBeUndefined();
  });

  it('assigns unique ids when timestamp and assetId repeat', () => {
    const store = createStore();
    const assetId =
      '4394372887385518214471608448209527405727552777602031099972143344338178308080';

    for (let index = 0; index < 25; index += 1) {
      appendTradeActivity(store, 'world-cup', {
        price: 0.5,
        timestamp: 1_781_699_000_000,
        assetId,
      });
    }

    const ids = store.get(tradeActivityByEventAtom)['world-cup']?.map(
      (trade) => trade.id,
    );

    expect(ids).toHaveLength(20);
    expect(new Set(ids).size).toBe(20);
  });
});
