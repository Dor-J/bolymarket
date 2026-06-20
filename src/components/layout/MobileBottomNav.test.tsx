import { cleanup, fireEvent, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { MobileBottomNav } from "./MobileBottomNav";
import { renderWithProviders } from "@/test/test-utils";

vi.mock("next/navigation", () => ({
  usePathname: vi.fn(() => "/"),
  useRouter: vi.fn(() => ({ push: vi.fn() })),
}));

describe("MobileBottomNav", () => {
  afterEach(() => {
    cleanup();
  });

  it("renders the four mobile navigation items", () => {
    renderWithProviders(<MobileBottomNav />);

    expect(
      screen.getByRole("navigation", { name: /mobile/i }),
    ).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /home/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /search/i })).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /breaking/i }),
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /more/i })).toBeInTheDocument();
  });

  it("opens the mobile search drawer", () => {
    renderWithProviders(<MobileBottomNav />);

    fireEvent.click(screen.getByRole("button", { name: /search/i }));

    expect(screen.getByRole("dialog", { name: /search/i })).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText("Search polymarkets..."),
    ).toBeInTheDocument();
    expect(screen.getByText("Browse")).toBeInTheDocument();
    expect(screen.getByText("Live Crypto")).toBeInTheDocument();
  });

  it("opens the mobile more menu", () => {
    renderWithProviders(<MobileBottomNav />);

    fireEvent.click(screen.getByRole("button", { name: /more/i }));

    expect(
      screen.getByRole("dialog", { name: /more menu/i }),
    ).toBeInTheDocument();
    expect(screen.getByText("Leaderboard")).toBeInTheDocument();
    expect(screen.getByText("Rewards")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /log in/i })).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /sign up/i }),
    ).toBeInTheDocument();
  });
});
