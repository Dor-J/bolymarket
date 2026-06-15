import { act, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { getOpenEvents } from "@/lib/api/gamma";
import { mockEvents } from "@/test/fixtures/events";
import {
  createJotaiStore,
  createTestQueryClient,
  renderHookWithProviders,
  seedEventsQuery,
} from "@/test/test-utils";
import { selectedCategoryAtom } from '@/lib/atoms/category';
import { searchQueryAtom } from '@/lib/atoms/search';
import { useFilteredEvents } from './useFilteredEvents';
import { SEARCH_DEBOUNCE_MS } from './useDebouncedValue';

vi.mock("@/lib/api/gamma", () => ({
  getOpenEvents: vi.fn(),
}));

const mockedGetOpenEvents = vi.mocked(getOpenEvents);

describe('useFilteredEvents', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns empty events when query has no data", () => {
    mockedGetOpenEvents.mockImplementation(() => new Promise(() => undefined));

    const { result } = renderHookWithProviders(() => useFilteredEvents());

    expect(result.current.events).toEqual([]);
    expect(result.current.isLoading).toBe(true);
  });

  it("returns trending events sorted by volume descending", async () => {
    const queryClient = createTestQueryClient();
    seedEventsQuery(queryClient, mockEvents);
    mockedGetOpenEvents.mockResolvedValue(mockEvents);

    const { result } = renderHookWithProviders(() => useFilteredEvents(), {
      queryClient,
      jotaiStore: createJotaiStore("trending"),
    });

    await waitFor(() => {
      expect(result.current.events.length).toBe(4);
    });

    expect(result.current.events.map((event) => event.slug)).toEqual([
      "trending-high",
      "sports-event",
      "crypto-event",
      "politics-event",
    ]);
    expect(result.current.category).toBe("trending");
  });

  it("filters crypto events only", async () => {
    const queryClient = createTestQueryClient();
    seedEventsQuery(queryClient, mockEvents);
    mockedGetOpenEvents.mockResolvedValue(mockEvents);

    const { result } = renderHookWithProviders(() => useFilteredEvents(), {
      queryClient,
      jotaiStore: createJotaiStore("crypto"),
    });

    await waitFor(() => {
      expect(result.current.events.length).toBe(1);
    });

    expect(result.current.events[0]?.slug).toBe("crypto-event");
    expect(result.current.category).toBe("crypto");
  });

  it("filters sports events only", async () => {
    const queryClient = createTestQueryClient();
    seedEventsQuery(queryClient, mockEvents);
    mockedGetOpenEvents.mockResolvedValue(mockEvents);

    const { result } = renderHookWithProviders(() => useFilteredEvents(), {
      queryClient,
      jotaiStore: createJotaiStore("sports"),
    });

    await waitFor(() => {
      expect(result.current.events.length).toBe(1);
    });

    expect(result.current.events[0]?.slug).toBe("sports-event");
  });

  it("filters politics events only", async () => {
    const queryClient = createTestQueryClient();
    seedEventsQuery(queryClient, mockEvents);
    mockedGetOpenEvents.mockResolvedValue(mockEvents);

    const { result } = renderHookWithProviders(() => useFilteredEvents(), {
      queryClient,
      jotaiStore: createJotaiStore("politics"),
    });

    await waitFor(() => {
      expect(result.current.events.length).toBe(1);
    });

    expect(result.current.events[0]?.slug).toBe("politics-event");
  });

  it("forwards query error state", async () => {
    mockedGetOpenEvents.mockRejectedValue(new Error("Network error"));

    const { result } = renderHookWithProviders(() => useFilteredEvents());

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });

    expect(result.current.events).toEqual([]);
  });

  it("re-filters when category changes", async () => {
    const queryClient = createTestQueryClient();
    seedEventsQuery(queryClient, mockEvents);
    mockedGetOpenEvents.mockResolvedValue(mockEvents);
    const jotaiStore = createJotaiStore("crypto");

    const { result, rerender } = renderHookWithProviders(
      () => useFilteredEvents(),
      { queryClient, jotaiStore },
    );

    await waitFor(() => {
      expect(result.current.events.length).toBe(1);
    });

    expect(result.current.events[0]?.slug).toBe("crypto-event");

    jotaiStore.set(selectedCategoryAtom, "sports");
    rerender();

    await waitFor(() => {
      expect(result.current.events.length).toBe(1);
    });

    expect(result.current.events[0]?.slug).toBe("sports-event");
    expect(result.current.category).toBe('sports');
  });

  it('filters by debounced search query', async () => {
    vi.useFakeTimers();

    const queryClient = createTestQueryClient();
    seedEventsQuery(queryClient, mockEvents);
    mockedGetOpenEvents.mockResolvedValue(mockEvents);
    const jotaiStore = createJotaiStore('trending');

    const { result } = renderHookWithProviders(() => useFilteredEvents(), {
      queryClient,
      jotaiStore,
    });

    await act(async () => {
      await Promise.resolve();
    });

    expect(result.current.events.length).toBe(4);

    act(() => {
      jotaiStore.set(searchQueryAtom, 'crypto');
    });

    expect(result.current.events.length).toBe(4);

    act(() => {
      vi.advanceTimersByTime(SEARCH_DEBOUNCE_MS);
    });

    expect(result.current.events.length).toBe(1);
    expect(result.current.events[0]?.slug).toBe('crypto-event');
    expect(result.current.debouncedSearch).toBe('crypto');

    vi.useRealTimers();
  });
});
