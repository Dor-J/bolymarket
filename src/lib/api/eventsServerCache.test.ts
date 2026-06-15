import { afterEach, describe, expect, it, vi } from 'vitest';
import { REDIS_EVENTS_TAG_PREFIX } from '@/lib/cache/constants';
import { memoryCache } from '@/lib/cache/memory';

vi.mock('./gamma', () => ({
  fetchOpenEvents: vi.fn(async () => [{ id: 'tag-event-1', slug: 'tag-event' }]),
}));

import { getCachedOpenEventsByTag } from './eventsServerCache';
import { fetchOpenEvents } from './gamma';

describe('getCachedOpenEventsByTag', () => {
  afterEach(() => {
    memoryCache.clearForTests();
    vi.clearAllMocks();
  });

  it('fetches and caches events for a tag slug', async () => {
    const events = await getCachedOpenEventsByTag('crypto');

    expect(events).toEqual([{ id: 'tag-event-1', slug: 'tag-event' }]);
    expect(fetchOpenEvents).toHaveBeenCalledWith({
      limit: 50,
      tagSlug: 'crypto',
      relatedTags: true,
    });

    const cached = await memoryCache.get(`${REDIS_EVENTS_TAG_PREFIX}crypto`);
    expect(cached?.data).toEqual(events);
  });

  it('returns cached data on subsequent calls', async () => {
    await getCachedOpenEventsByTag('sports');
    await getCachedOpenEventsByTag('sports');

    expect(fetchOpenEvents).toHaveBeenCalledTimes(1);
  });
});
