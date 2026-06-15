import { waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { fetchEventsClient } from "@/lib/api/eventsClient";
import { mockEvents } from "@/test/fixtures/events";
import {
  createTestQueryClient,
  EVENTS_QUERY_KEY,
  renderHookWithProviders,
} from "@/test/test-utils";
import { useEvents } from "./useEvents";

vi.mock("@/lib/api/eventsClient", () => ({
  fetchEventsClient: vi.fn(),
}));

const mockedFetchEventsClient = vi.mocked(fetchEventsClient);

describe("useEvents", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns loading state initially", () => {
    mockedFetchEventsClient.mockImplementation(
      () => new Promise(() => undefined),
    );

    const { result } = renderHookWithProviders(() => useEvents());

    expect(result.current.isLoading).toBe(true);
    expect(result.current.data).toBeUndefined();
  });

  it("returns events on success", async () => {
    mockedFetchEventsClient.mockResolvedValue(mockEvents);

    const { result } = renderHookWithProviders(() => useEvents());

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toEqual(mockEvents);
    expect(mockedFetchEventsClient).toHaveBeenCalledTimes(1);
  });

  it("returns error on failure", async () => {
    mockedFetchEventsClient.mockRejectedValue(new Error("Events API error"));

    const { result } = renderHookWithProviders(() => useEvents());

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });

    expect(result.current.error).toEqual(new Error("Events API error"));
    expect(mockedFetchEventsClient).toHaveBeenCalledTimes(1);
  });

  it("uses the open events query key", async () => {
    mockedFetchEventsClient.mockResolvedValue(mockEvents);

    const queryClient = createTestQueryClient();
    renderHookWithProviders(() => useEvents(), { queryClient });

    await waitFor(() => {
      expect(queryClient.getQueryData(EVENTS_QUERY_KEY)).toEqual(mockEvents);
    });
  });
});
