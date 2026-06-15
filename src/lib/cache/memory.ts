import type { CacheEnvelope } from "./types";

const memoryStore = new Map<string, string>();

/**
 * In-memory cache fallback when Redis is unavailable (local dev).
 */
export const memoryCache = {
  async get<T>(key: string): Promise<CacheEnvelope<T> | null> {
    const raw = memoryStore.get(key);
    if (!raw) {
      return null;
    }

    try {
      return JSON.parse(raw) as CacheEnvelope<T>;
    } catch {
      memoryStore.delete(key);
      return null;
    }
  },

  async set<T>(key: string, envelope: CacheEnvelope<T>): Promise<void> {
    memoryStore.set(key, JSON.stringify(envelope));
  },

  async delete(key: string): Promise<void> {
    memoryStore.delete(key);
  },

  /** Clears all entries — test helper only. */
  clearForTests(): void {
    memoryStore.clear();
  },
};
