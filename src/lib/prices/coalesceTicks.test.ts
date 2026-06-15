import { afterEach, describe, expect, it, vi } from "vitest";
import {
  configureCoalesceFlush,
  enqueuePriceTick,
  flushPendingTicksForTests,
  resetCoalesceTicksForTests,
} from "./coalesceTicks";

describe("coalesceTicks", () => {
  afterEach(() => {
    resetCoalesceTicksForTests();
    vi.unstubAllGlobals();
  });

  it("coalesces duplicate keys to the last value in a frame", () => {
    const flushed: Array<{ outcomeKey: string; value: number }> = [];
    configureCoalesceFlush((tick) => {
      flushed.push(tick);
    });

    enqueuePriceTick("m1:yes", 0.4);
    enqueuePriceTick("m1:yes", 0.45);
    flushPendingTicksForTests();

    expect(flushed).toEqual([{ outcomeKey: "m1:yes", value: 0.45 }]);
  });

  it("flushes multiple keys in one frame", () => {
    const flushed: string[] = [];
    configureCoalesceFlush((tick) => {
      flushed.push(tick.outcomeKey);
    });

    enqueuePriceTick("m1:yes", 0.4);
    enqueuePriceTick("m2:yes", 0.6);
    flushPendingTicksForTests();

    expect(flushed.sort()).toEqual(["m1:yes", "m2:yes"]);
  });
});
