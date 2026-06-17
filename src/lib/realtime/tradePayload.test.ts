import { describe, expect, it } from "vitest";
import { clampTradePrice, parseTradePayload } from "./tradePayload";

describe("parseTradePayload", () => {
  it("parses a valid trade payload", () => {
    expect(
      parseTradePayload({
        asset: "token-1",
        price: 0.62,
        eventSlug: "my-event",
      }),
    ).toEqual({
      asset: 'token-1',
      price: 0.62,
      eventSlug: 'my-event',
      slug: undefined,
      outcomeIndex: undefined,
      side: undefined,
      size: undefined,
      outcome: undefined,
      userName: undefined,
      timestamp: undefined,
    });
  });

  it('parses activity trade metadata', () => {
    expect(
      parseTradePayload({
        asset: 'token-1',
        price: 0.18,
        pseudonym: 'polyfan',
        outcome: 'France',
        size: 260,
        side: 'BUY',
        timestamp: 1_781_700_000,
      }),
    ).toMatchObject({
      price: 0.18,
      userName: 'polyfan',
      outcome: 'France',
      size: 260,
      side: 'BUY',
      timestamp: 1_781_700_000,
    });
  });

  it("returns null when price is missing", () => {
    expect(parseTradePayload({ asset: "token-1" })).toBeNull();
  });
});

describe("clampTradePrice", () => {
  it("clamps values to 0–1", () => {
    expect(clampTradePrice(1.2)).toBe(1);
    expect(clampTradePrice(-0.1)).toBe(0);
    expect(clampTradePrice(0.42)).toBe(0.42);
  });
});
