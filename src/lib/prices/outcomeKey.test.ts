import { describe, expect, it } from "vitest";
import { getOutcomePriceKey, parseOutcomePriceKey } from "./outcomeKey";

describe("getOutcomePriceKey", () => {
  it("joins market and outcome IDs", () => {
    expect(getOutcomePriceKey("m1", "yes")).toBe("m1:yes");
  });
});

describe("parseOutcomePriceKey", () => {
  it("parses a composite key", () => {
    expect(parseOutcomePriceKey("m1:yes")).toEqual({
      marketId: "m1",
      outcomeId: "yes",
    });
  });
});
