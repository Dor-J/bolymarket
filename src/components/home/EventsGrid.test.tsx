import { cleanup, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { renderWithProviders } from "@/test/test-utils";
import { EventsGrid } from "./EventsGrid";

vi.mock("./HomeMarketsView", () => ({
  HomeMarketsView: () => <div data-testid="home-markets-view" />,
}));

describe("EventsGrid", () => {
  beforeEach(() => {
    cleanup();
    vi.clearAllMocks();
  });

  it("renders the home markets view", () => {
    renderWithProviders(<EventsGrid />);
    expect(screen.getByTestId("home-markets-view")).toBeInTheDocument();
  });
});
