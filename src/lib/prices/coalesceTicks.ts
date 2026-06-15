export interface PriceTick {
  outcomeKey: string;
  value: number;
}

type FlushHandler = (tick: PriceTick) => void;

const pendingTicks = new Map<string, number>();
let animationFrameId: number | null = null;
let flushHandler: FlushHandler | null = null;

function flushPendingTicks(): void {
  animationFrameId = null;

  if (!flushHandler) {
    pendingTicks.clear();
    return;
  }

  for (const [outcomeKey, value] of pendingTicks) {
    flushHandler({ outcomeKey, value });
  }

  pendingTicks.clear();
}

/**
 * Registers the function that commits coalesced ticks (typically once per frame).
 */
export function configureCoalesceFlush(handler: FlushHandler | null): void {
  flushHandler = handler;
}

/**
 * Enqueues a price tick; multiple ticks for the same key collapse to the last value per frame.
 */
export function enqueuePriceTick(outcomeKey: string, value: number): void {
  pendingTicks.set(outcomeKey, value);

  if (animationFrameId === null && typeof requestAnimationFrame === 'function') {
    animationFrameId = requestAnimationFrame(flushPendingTicks);
  } else if (animationFrameId === null) {
    flushPendingTicks();
  }
}

/**
 * Synchronously flushes pending ticks — for unit tests only.
 */
export function flushPendingTicksForTests(): void {
  if (animationFrameId !== null && typeof cancelAnimationFrame === 'function') {
    cancelAnimationFrame(animationFrameId);
  }

  animationFrameId = null;
  flushPendingTicks();
}

/**
 * Clears pending ticks and cancels a scheduled frame — for test teardown.
 */
export function resetCoalesceTicksForTests(): void {
  if (animationFrameId !== null && typeof cancelAnimationFrame === 'function') {
    cancelAnimationFrame(animationFrameId);
  }

  animationFrameId = null;
  pendingTicks.clear();
  flushHandler = null;
}
