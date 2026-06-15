import { describe, expect, it } from "vitest";
import {
  eventMatchesCategory,
  filterAndSortEvents,
} from "@/lib/filters/category";
import { createMockEvent, mockEvents } from "@/test/fixtures/events";

describe("eventMatchesCategory", () => {
  it("matches all events for trending", () => {
    const event = createMockEvent({
      id: "1",
      slug: "any",
      title: "Any",
      tags: ["random"],
    });

    expect(eventMatchesCategory(event, "trending")).toBe(true);
  });

  it("matches crypto by category field", () => {
    const event = createMockEvent({
      id: "1",
      slug: "crypto",
      title: "Crypto",
      category: "crypto",
      tags: [],
    });

    expect(eventMatchesCategory(event, "crypto")).toBe(true);
  });

  it("matches sports by tag substring", () => {
    const event = createMockEvent({
      id: "1",
      slug: "sports",
      title: "Sports",
      tags: ["live-sports"],
    });

    expect(eventMatchesCategory(event, "sports")).toBe(true);
  });

  it("does not match unrelated categories", () => {
    const event = createMockEvent({
      id: "1",
      slug: "other",
      title: "Other",
      tags: ["finance"],
    });

    expect(eventMatchesCategory(event, "crypto")).toBe(false);
  });
});

describe("filterAndSortEvents", () => {
  it("returns all events sorted by volume descending for trending", () => {
    const result = filterAndSortEvents(mockEvents, "trending");

    expect(result.map((event) => event.slug)).toEqual([
      "trending-high",
      "sports-event",
      "crypto-event",
      "politics-event",
    ]);
  });

  it("filters to crypto events only", () => {
    const result = filterAndSortEvents(mockEvents, "crypto");

    expect(result).toHaveLength(1);
    expect(result[0]?.slug).toBe("crypto-event");
  });

  it("sorts by title when volume is equal", () => {
    const events = [
      createMockEvent({
        id: "1",
        slug: "b-event",
        title: "Bravo",
        volume: 100,
      }),
      createMockEvent({
        id: "2",
        slug: "a-event",
        title: "Alpha",
        volume: 100,
      }),
    ];

    const result = filterAndSortEvents(events, "trending");

    expect(result.map((event) => event.title)).toEqual(["Alpha", "Bravo"]);
  });

  it("returns an empty array when no events match the category", () => {
    const events = [
      createMockEvent({
        id: "1",
        slug: "finance-only",
        title: "Finance",
        tags: ["finance"],
      }),
    ];

    const result = filterAndSortEvents(events, "crypto");

    expect(result).toEqual([]);
  });
});
