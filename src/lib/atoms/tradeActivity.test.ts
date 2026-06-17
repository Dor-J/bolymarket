import { describe, expect, it } from 'vitest';
import {
  appendTradeActivity,
  pruneTradeActivity,
  tradeActivityByEventAtom,
} from './tradeActivity';
import { createStore } from 'jotai';

describe('tradeActivity', () => {
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
});
