import { afterEach, describe, expect, it, vi } from 'vitest';
import {
  disablePolymarketWsLogSuppression,
  enablePolymarketWsLogSuppression,
  isPolymarketRoutineDisconnectLog,
  resetPolymarketWsLogSuppressionForTests,
} from './suppressPolymarketWsLogs';

describe('isPolymarketRoutineDisconnectLog', () => {
  it('matches routine close codes with empty reason', () => {
    expect(isPolymarketRoutineDisconnectLog(['disconnected', 'code', 1006, 'reason', ''])).toBe(
      true,
    );
    expect(isPolymarketRoutineDisconnectLog(['disconnected', 'code', 1005, 'reason', ''])).toBe(
      true,
    );
  });

  it('does not match unrelated console.error calls', () => {
    expect(isPolymarketRoutineDisconnectLog(['error', new Error('boom')])).toBe(false);
  });
});

describe('enablePolymarketWsLogSuppression', () => {
  afterEach(() => {
    resetPolymarketWsLogSuppressionForTests();
  });

  it('filters routine disconnect logs while enabled', () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => undefined);

    enablePolymarketWsLogSuppression();

    console.error('disconnected', 'code', 1006, 'reason', '');
    console.error('real error');

    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith('real error');

    disablePolymarketWsLogSuppression();
    spy.mockRestore();
  });
});
