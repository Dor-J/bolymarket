import { cleanup, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { mockEvents } from "@/test/fixtures/events";
import { renderWithProviders } from "@/test/test-utils";
import { EventsGrid } from "./EventsGrid";

const mockRefetch = vi.fn();

vi.mock("@/hooks/useFilteredEvents", () => ({
  useFilteredEvents: vi.fn(),
}));

vi.mock("@/hooks/useLivePrices", () => ({
  useLivePrices: vi.fn(),
}));

vi.mock("./FeaturedCarousel", () => ({
  FeaturedCarousel: () => null,
}));

import { useFilteredEvents } from "@/hooks/useFilteredEvents";

const mockedUseFilteredEvents = vi.mocked(useFilteredEvents);

function mockFilteredEvents(
  overrides: Partial<ReturnType<typeof useFilteredEvents>> = {},
) {
  mockedUseFilteredEvents.mockReturnValue({
    events: [],
    isLoading: false,
    isError: false,
    error: null,
    refetch: mockRefetch,
    isFetching: false,
    category: "trending",
    ...overrides,
  } as ReturnType<typeof useFilteredEvents>);
}

describe("EventsGrid", () => {
  beforeEach(() => {
    cleanup();
    vi.clearAllMocks();
  });

  it("renders skeleton when loading", () => {
    mockFilteredEvents({ isLoading: true });

    renderWithProviders(<EventsGrid />);

    expect(screen.getByLabelText("Loading markets")).toBeInTheDocument();
  });

  it("renders error state with retry", () => {
    mockFilteredEvents({
      isError: true,
      error: new Error("Network error"),
    });

    renderWithProviders(<EventsGrid />);

    expect(screen.getByText("Network error")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Retry" })).toBeInTheDocument();
  });

  it("renders empty state when filter yields no events", () => {
    mockFilteredEvents({ events: [] });

    renderWithProviders(<EventsGrid />);

    expect(screen.getByText("No markets found")).toBeInTheDocument();
  });

  it("renders event cards when data is available", () => {
    mockFilteredEvents({ events: mockEvents });

    renderWithProviders(<EventsGrid />);

    expect(
      screen.getByRole("heading", { name: "All markets" }),
    ).toBeInTheDocument();
    expect(screen.getByText("Crypto Event")).toBeInTheDocument();
    expect(screen.getByText("Sports Event")).toBeInTheDocument();
  });
});
