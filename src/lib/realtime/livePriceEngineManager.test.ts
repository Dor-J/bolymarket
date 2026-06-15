import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest';
import { createStore } from 'jotai';
import {
  acquireLivePriceEngine,
  resetLivePriceEngineForTests,
} from './livePriceEngineManager';

const mockStart = vi.fn();
const mockStop = vi.fn();

vi.mock('./priceSourceFactory', () => ({
  createLivePriceEngine: () => ({
    start: mockStart,
    stop: mockStop,
  }),
}));

describe('acquireLivePriceEngine', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    mockStart.mockClear();
    mockStop.mockClear();
  });

  afterEach(() => {
    vi.useRealTimers();
    resetLivePriceEngineForTests();
  });

  it('debounces disconnect until all subscribers release', () => {
    const store = createStore();
    const leaseA = acquireLivePriceEngine(store, ['a'], [
      { outcomeKey: 'a', price: 0.5 },
    ]);
    const leaseB = acquireLivePriceEngine(store, ['b'], [
      { outcomeKey: 'b', price: 0.6 },
    ]);

    leaseA.release();
    vi.advanceTimersByTime(300);
    expect(mockStop).not.toHaveBeenCalled();

    leaseB.release();
    vi.advanceTimersByTime(300);
    expect(mockStop).toHaveBeenCalledTimes(1);
  });
});
