/** WebSocket close codes logged by @polymarket/real-time-data-client on routine disconnect. */
const ROUTINE_CLOSE_CODES = new Set([1000, 1005, 1006]);

let suppressCount = 0;
let originalConsoleError: typeof console.error | null = null;

/**
 * Returns true for the Polymarket client's noisy `disconnected code …` console.error.
 */
export function isPolymarketRoutineDisconnectLog(args: unknown[]): boolean {
  if (args[0] !== 'disconnected' || typeof args[2] !== 'number') {
    return false;
  }

  if (!ROUTINE_CLOSE_CODES.has(args[2])) {
    return false;
  }

  const reason = args[4];
  return reason === '' || reason === undefined || reason === 'Client shutdown';
}

/**
 * Suppresses routine Polymarket WebSocket disconnect logs while the engine is active.
 */
export function enablePolymarketWsLogSuppression(): void {
  suppressCount += 1;

  if (suppressCount !== 1 || typeof window === 'undefined' || originalConsoleError) {
    return;
  }

  originalConsoleError = console.error;
  console.error = (...args: unknown[]) => {
    if (isPolymarketRoutineDisconnectLog(args)) {
      return;
    }

    originalConsoleError?.apply(console, args);
  };
}

/**
 * Restores console.error when no WebSocket engines require log suppression.
 */
export function disablePolymarketWsLogSuppression(): void {
  suppressCount = Math.max(0, suppressCount - 1);

  if (suppressCount !== 0 || !originalConsoleError) {
    return;
  }

  console.error = originalConsoleError;
  originalConsoleError = null;
}

/** Resets suppression state — test helper only. */
export function resetPolymarketWsLogSuppressionForTests(): void {
  if (originalConsoleError) {
    console.error = originalConsoleError;
  }

  suppressCount = 0;
  originalConsoleError = null;
}
