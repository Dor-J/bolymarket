import { describe, expect, it } from "vitest";
import type { GammaEvent, GammaMarket } from "./schemas";
import { normalizeEvent, normalizeEvents, normalizeMarket } from "./normalize";

const validMarket: GammaMarket = {
  id: "m1",
  question: "Will it happen?",
  slug: "will-it-happen",
  volumeNum: 1000,
  outcomes: ["Yes", "No"],
  outcomePrices: ["0.6", "0.4"],
  clobTokenIds: ["yes-token", "no-token"],
};

const validEvent: GammaEvent = {
  id: "1",
  slug: "test-event",
  title: "Test Event",
  category: "Sports",
  tags: [{ slug: "soccer", label: "Soccer" }],
  volume: 5000,
  markets: [validMarket],
};

describe("normalizeMarket", () => {
  it("normalizes a valid Gamma market", () => {
    const market = normalizeMarket(validMarket);

    expect(market).toEqual({
      id: "m1",
      question: "Will it happen?",
      slug: "will-it-happen",
      volume: 1000,
      outcomes: [
        { id: "yes-token", name: "Yes", price: 0.6 },
        { id: "no-token", name: "No", price: 0.4 },
      ],
    });
  });

  it("returns null when question is missing", () => {
    expect(normalizeMarket({ id: "m1", question: "  " })).toBeNull();
  });

  it("returns null when there are no outcomes", () => {
    expect(normalizeMarket({ id: "m1", question: "Q?" })).toBeNull();
  });

  it("clamps invalid outcome prices", () => {
    const market = normalizeMarket({
      id: "m2",
      question: "Edge prices?",
      outcomes: ["Yes", "No"],
      outcomePrices: ["1.5", "-0.2"],
    });

    expect(market?.outcomes[0]?.price).toBe(1);
    expect(market?.outcomes[1]?.price).toBe(0);
  });
});

describe("normalizeEvent", () => {
  it("normalizes a valid Gamma event with slug and title", () => {
    const event = normalizeEvent(validEvent);

    expect(event).toMatchObject({
      id: "1",
      slug: "test-event",
      title: "Test Event",
      category: "sports",
      volume: 5000,
    });
    expect(event?.tags).toContain("sports");
    expect(event?.tags).toContain("soccer");
    expect(event?.markets).toHaveLength(1);
  });

  it("returns null when slug is missing", () => {
    expect(normalizeEvent({ ...validEvent, slug: undefined })).toBeNull();
    expect(normalizeEvent({ ...validEvent, slug: "   " })).toBeNull();
  });

  it("returns null when title is missing", () => {
    expect(normalizeEvent({ ...validEvent, title: undefined })).toBeNull();
  });

  it("returns null when all markets are invalid", () => {
    expect(
      normalizeEvent({
        ...validEvent,
        markets: [{ id: "bad", question: "" }],
      }),
    ).toBeNull();
  });

  it("falls back to market volume sum when event volume is zero", () => {
    const event = normalizeEvent({
      ...validEvent,
      volume: 0,
      markets: [{ ...validMarket, volumeNum: 250 }],
    });

    expect(event?.volume).toBe(250);
  });

  it("uses image or icon for the event image field", () => {
    const withImage = normalizeEvent({
      ...validEvent,
      image: "https://img/a.png",
    });
    const withIcon = normalizeEvent({
      ...validEvent,
      image: undefined,
      icon: "https://img/b.png",
    });

    expect(withImage?.image).toBe("https://img/a.png");
    expect(withIcon?.image).toBe("https://img/b.png");
  });
});

describe("normalizeEvents", () => {
  it("filters out invalid events", () => {
    const events = normalizeEvents([
      validEvent,
      { id: "2", slug: "no-title" },
      {
        id: "3",
        slug: "valid-2",
        title: "Valid Two",
        markets: [validMarket],
      },
    ]);

    expect(events).toHaveLength(2);
    expect(events.map((event) => event.slug)).toEqual([
      "test-event",
      "valid-2",
    ]);
  });
});
