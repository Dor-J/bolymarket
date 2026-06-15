import { describe, expect, it } from "vitest";
import {
  buildRealtimeSubscriptionIndex,
  getRealtimeSubscriptionSignature,
} from "./subscriptionIndex";

describe("buildRealtimeSubscriptionIndex", () => {
  it("indexes assets and event slugs from seeds", () => {
    const index = buildRealtimeSubscriptionIndex([
      {
        outcomeKey: "m1:yes",
        price: 0.5,
        assetId: "token-yes",
        eventSlug: "event-a",
      },
      {
        outcomeKey: "m2:yes",
        price: 0.4,
        assetId: "token-b",
        eventSlug: "event-b",
      },
    ]);

    expect(index.assetToOutcomeKey.get("token-yes")).toBe("m1:yes");
    expect(index.eventSlugs).toEqual(["event-a", "event-b"]);
  });
});

describe("getRealtimeSubscriptionSignature", () => {
  it("is stable regardless of seed order", () => {
    const left = getRealtimeSubscriptionSignature([
      {
        outcomeKey: "m1:yes",
        price: 0.5,
        assetId: "a",
        eventSlug: "event-a",
      },
      {
        outcomeKey: "m2:yes",
        price: 0.4,
        assetId: "b",
        eventSlug: "event-b",
      },
    ]);

    const right = getRealtimeSubscriptionSignature([
      {
        outcomeKey: "m2:yes",
        price: 0.4,
        assetId: "b",
        eventSlug: "event-b",
      },
      {
        outcomeKey: "m1:yes",
        price: 0.5,
        assetId: "a",
        eventSlug: "event-a",
      },
    ]);

    expect(left).toBe(right);
  });
});
