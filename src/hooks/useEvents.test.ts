import { waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { getOpenEvents } from "@/lib/api/gamma";
import { mockEvents } from "@/test/fixtures/events";
import {
  createTestQueryClient,
  renderHookWithProviders,
} from "@/test/test-utils";
import { useEvents } from "./useEvents";

vi.mock("@/lib/api/gamma", () => ({
  getOpenEvents: vi.fn(),
}));

const mockedGetOpenEvents = vi.mocked(getOpenEvents);

describe("useEvents", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns loading state initially", () => {
    mockedGetOpenEvents.mockImplementation(() => new Promise(() => undefined));

    const { result } = renderHookWithProviders(() => useEvents());

    expect(result.current.isLoading).toBe(true);
    expect(result.current.data).toBeUndefined();
  });

  it("returns events on success", async () => {
    mockedGetOpenEvents.mockResolvedValue(mockEvents);

    const { result } = renderHookWithProviders(() => useEvents());

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toEqual(mockEvents);
    expect(mockedGetOpenEvents).toHaveBeenCalledTimes(1);
  });

  it("returns error on failure", async () => {
    mockedGetOpenEvents.mockRejectedValue(new Error("Gamma API error"));

    const { result } = renderHookWithProviders(() => useEvents());

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });

    expect(result.current.error).toEqual(new Error("Gamma API error"));
    expect(mockedGetOpenEvents).toHaveBeenCalledTimes(1);
  });

  it("uses the open events query key", async () => {
    mockedGetOpenEvents.mockResolvedValue(mockEvents);

    const queryClient = createTestQueryClient();
    renderHookWithProviders(() => useEvents(), { queryClient });

    await waitFor(() => {
      expect(queryClient.getQueryData(["events", { closed: false }])).toEqual(
        mockEvents,
      );
    });
  });
});
