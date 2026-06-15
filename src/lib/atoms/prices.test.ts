import { createStore } from "jotai";
import { describe, expect, it } from "vitest";
import {
  outcomePriceAtomFamily,
  pruneStaleOutcomePrices,
  seedOutcomePrice,
} from "./prices";

describe("pruneStaleOutcomePrices", () => {
  it("removes cached atoms not in the active key set", () => {
    const store = createStore();

    seedOutcomePrice(store, "m1:yes", 0.42);
    seedOutcomePrice(store, "m2:yes", 0.3);

    expect(Array.from(outcomePriceAtomFamily.getParams()).sort()).toEqual([
      "m1:yes",
      "m2:yes",
    ]);

    pruneStaleOutcomePrices(new Set(["m1:yes"]));

    expect(Array.from(outcomePriceAtomFamily.getParams())).toEqual(["m1:yes"]);
    expect(store.get(outcomePriceAtomFamily("m1:yes"))?.value).toBe(0.42);
  });

  it("keeps all atoms when every key is active", () => {
    seedOutcomePrice(createStore(), "m1:yes", 0.5);
    seedOutcomePrice(createStore(), "m2:yes", 0.6);

    pruneStaleOutcomePrices(new Set(["m1:yes", "m2:yes"]));

    expect(Array.from(outcomePriceAtomFamily.getParams()).sort()).toEqual([
      "m1:yes",
      "m2:yes",
    ]);
  });
});
