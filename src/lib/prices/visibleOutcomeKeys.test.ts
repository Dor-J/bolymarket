import { describe, expect, it } from "vitest";
import { createMockEvent } from "@/test/fixtures/events";
import {
  getOutcomeKeysFromSeeds,
  getOutcomeSeedsFromEvent,
  getVisibleOutcomeSeedsFromEvents,
} from "./visibleOutcomeKeys";

describe("getOutcomeKeysFromSeeds", () => {
  it("returns outcome keys from seed payloads", () => {
    expect(
      getOutcomeKeysFromSeeds([
        { outcomeKey: "m1:yes", price: 0.5 },
        { outcomeKey: "m2:france", price: 0.2 },
      ]),
    ).toEqual(["m1:yes", "m2:france"]);
  });

  it("returns an empty array for empty seeds", () => {
    expect(getOutcomeKeysFromSeeds([])).toEqual([]);
  });
});

describe("getVisibleOutcomeSeedsFromEvents", () => {
  it("returns yes outcome keys for binary events", () => {
    const event = createMockEvent({
      id: "1",
      slug: "binary",
      title: "Binary",
      markets: [
        {
          id: "m1",
          question: "Will it happen?",
          volume: 100,
          outcomes: [
            { id: "yes", name: "Yes", price: 0.28 },
            { id: "no", name: "No", price: 0.72 },
          ],
        },
      ],
    });

    const seeds = getVisibleOutcomeSeedsFromEvents([event]);

    expect(seeds[0]).toMatchObject({
      outcomeKey: "m1:yes",
      price: 0.28,
      assetId: "yes",
      eventSlug: "binary",
    });
  });

  it("returns top outcome keys for multi-outcome cards", () => {
    const event = createMockEvent({
      id: "2",
      slug: "multi",
      title: "Multi",
      markets: [
        {
          id: "m1",
          question: "Winner",
          volume: 100,
          outcomes: [
            { id: "spain", name: "Spain", price: 0.16 },
            { id: "france", name: "France", price: 0.2 },
            { id: "brazil", name: "Brazil", price: 0.1 },
          ],
        },
      ],
    });

    const seeds = getVisibleOutcomeSeedsFromEvents([event]);

    expect(seeds).toHaveLength(2);
    expect(seeds[0]?.outcomeKey).toBe("m1:france");
  });
});

describe("getOutcomeSeedsFromEvent", () => {
  it("includes all detail rows", () => {
    const event = createMockEvent({
      id: "3",
      slug: "detail",
      title: "Detail",
      markets: [
        {
          id: "m1",
          question: "Winner",
          volume: 100,
          outcomes: [
            { id: "a", name: "A", price: 0.3 },
            { id: "b", name: "B", price: 0.2 },
            { id: "c", name: "C", price: 0.5 },
          ],
        },
      ],
    });

    expect(getOutcomeSeedsFromEvent(event)).toHaveLength(3);
  });
});
