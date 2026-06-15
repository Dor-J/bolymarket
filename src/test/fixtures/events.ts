import type { Event, Market, Outcome } from "@/types/polymarket";

const defaultMarket: Market = {
  id: "market-1",
  question: "Will this happen?",
  volume: 1000,
  outcomes: [
    { id: "outcome-yes", name: "Yes", price: 0.6 },
    { id: "outcome-no", name: "No", price: 0.4 },
  ],
};

/**
 * Creates a normalized mock event for tests.
 */
export function createMockEvent(
  overrides: Partial<Event> & Pick<Event, "id" | "slug" | "title">,
): Event {
  return {
    tags: [],
    volume: 100,
    markets: [defaultMarket],
    ...overrides,
  };
}

export const mockEvents: Event[] = [
  createMockEvent({
    id: "1",
    slug: "crypto-event",
    title: "Crypto Event",
    category: "crypto",
    tags: ["crypto"],
    volume: 100,
  }),
  createMockEvent({
    id: "2",
    slug: "sports-event",
    title: "Sports Event",
    tags: ["sports"],
    volume: 200,
  }),
  createMockEvent({
    id: "3",
    slug: "politics-event",
    title: "Politics Event",
    tags: ["politics"],
    volume: 50,
  }),
  createMockEvent({
    id: "4",
    slug: "trending-high",
    title: "Trending High Volume",
    tags: ["general"],
    volume: 999,
  }),
];

export function createMockOutcome(overrides: Partial<Outcome> = {}): Outcome {
  return {
    id: "outcome-1",
    name: "Yes",
    price: 0.5,
    ...overrides,
  };
}
