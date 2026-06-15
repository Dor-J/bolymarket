import { beforeEach, describe, expect, it, vi } from 'vitest';
import { createQueryPersister } from './queryPersister';

const storage = new Map<string, unknown>();

vi.mock('idb-keyval', () => ({
  get: vi.fn(async (key: string) => storage.get(key)),
  set: vi.fn(async (key: string, value: unknown) => {
    storage.set(key, value);
  }),
  del: vi.fn(async (key: string) => {
    storage.delete(key);
  }),
}));

describe('createQueryPersister', () => {
  beforeEach(() => {
    storage.clear();
    vi.clearAllMocks();
  });

  it('persists and restores a client payload', async () => {
    const persister = createQueryPersister('test-cache');
    const payload = {
      clientState: { queries: [], mutations: [] },
      timestamp: Date.now(),
      buster: 'v2',
    };

    await persister.persistClient(payload);
    const restored = await persister.restoreClient();

    expect(restored).toEqual(payload);
  });

  it('removes a persisted client', async () => {
    const persister = createQueryPersister('test-cache');
    await persister.persistClient({
      clientState: { queries: [], mutations: [] },
      timestamp: Date.now(),
      buster: 'v2',
    });

    await persister.removeClient();
    const restored = await persister.restoreClient();

    expect(restored).toBeUndefined();
  });
});
