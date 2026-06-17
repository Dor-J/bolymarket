import { act, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { fetchEventsClient } from '@/lib/api/eventsClient';
import { mockEvents } from '@/test/fixtures/events';
import {
  createJotaiStore,
  createTestQueryClient,
  renderHookWithProviders,
} from '@/test/test-utils';
import { searchQueryAtom } from '@/lib/atoms/search';
import { useCategoryEvents } from './useCategoryEvents';
import { SEARCH_DEBOUNCE_MS } from './useDebouncedValue';

vi.mock('@/lib/api/eventsClient', () => ({
  fetchEventsClient: vi.fn(),
}));

const mockedFetchEventsClient = vi.mocked(fetchEventsClient);

const politicsEvents = mockEvents.filter((event) =>
  event.tags.includes('politics'),
);

describe('useCategoryEvents', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns empty events while loading', () => {
    mockedFetchEventsClient.mockImplementation(() => new Promise(() => undefined));

    const { result } = renderHookWithProviders(() => useCategoryEvents('politics'));

    expect(result.current.events).toEqual([]);
    expect(result.current.isLoading).toBe(true);
  });

  it('fetches politics events for the politics tag', async () => {
    mockedFetchEventsClient.mockResolvedValue(politicsEvents);

    const { result } = renderHookWithProviders(() => useCategoryEvents('politics'));

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.events).toEqual(politicsEvents);
    expect(mockedFetchEventsClient).toHaveBeenCalledWith(
      expect.objectContaining({ tag: 'politics' }),
    );
  });

  it('forwards query error state', async () => {
    mockedFetchEventsClient.mockRejectedValue(new Error('Network error'));

    const { result } = renderHookWithProviders(() => useCategoryEvents('crypto'));

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });

    expect(result.current.events).toEqual([]);
  });

  it('filters events by debounced search query', async () => {
    vi.useFakeTimers();

    const queryClient = createTestQueryClient();
    mockedFetchEventsClient.mockResolvedValue(mockEvents);
    const jotaiStore = createJotaiStore();

    const { result } = renderHookWithProviders(
      () => useCategoryEvents('politics'),
      { queryClient, jotaiStore },
    );

    await act(async () => {
      await Promise.resolve();
    });

    expect(result.current.events.length).toBe(4);

    act(() => {
      jotaiStore.set(searchQueryAtom, 'crypto');
    });

    act(() => {
      vi.advanceTimersByTime(SEARCH_DEBOUNCE_MS);
    });

    expect(result.current.events.length).toBe(1);
    expect(result.current.events[0]?.slug).toBe('crypto-event');
    expect(result.current.debouncedSearch).toBe('crypto');

    vi.useRealTimers();
  });
});
