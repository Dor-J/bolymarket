import { waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { createMockEvent } from "@/test/fixtures/events";
import {
  createTestQueryClient,
  renderHookWithProviders,
  seedEventsQuery,
} from "@/test/test-utils";
import { useEvent } from "./useEvent";

vi.mock("@/lib/api/gamma", () => ({
  fetchEventBySlug: vi.fn(),
}));

import { fetchEventBySlug } from "@/lib/api/gamma";

describe("useEvent", () => {
  it("returns a cached event without calling the API", async () => {
    const queryClient = createTestQueryClient();
    const cachedEvent = createMockEvent({
      id: "1",
      slug: "cached-slug",
      title: "Cached Event",
    });

    seedEventsQuery(queryClient, [cachedEvent]);

    const { result } = renderHookWithProviders(() => useEvent("cached-slug"), {
      queryClient,
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data?.slug).toBe("cached-slug");
    expect(fetchEventBySlug).not.toHaveBeenCalled();
  });

  it("falls back to fetchEventBySlug on a cold cache", async () => {
    const fetchedEvent = createMockEvent({
      id: "2",
      slug: "cold-slug",
      title: "Cold Event",
    });

    vi.mocked(fetchEventBySlug).mockResolvedValueOnce(fetchedEvent);

    const { result } = renderHookWithProviders(() => useEvent("cold-slug"));

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(fetchEventBySlug).toHaveBeenCalledWith("cold-slug");
    expect(result.current.data?.title).toBe("Cold Event");
  });
});
