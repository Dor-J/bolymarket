import { afterEach, describe, expect, it } from "vitest";
import { EVENTS_CACHE_TTL_MS, REDIS_EVENTS_KEY } from "./constants";
import { memoryCache } from "./memory";
import type { CacheEnvelope } from "./types";

async function writeMemoryCache<T>(
  key: string,
  data: T,
  ttlMs: number,
): Promise<CacheEnvelope<T>> {
  const cachedAt = Date.now();
  const envelope: CacheEnvelope<T> = {
    data,
    cachedAt,
    expiresAt: cachedAt + ttlMs,
  };
  await memoryCache.set(key, envelope);
  return envelope;
}

describe("memory cache fallback", () => {
  afterEach(() => {
    memoryCache.clearForTests();
  });

  it("writes and reads cache envelopes", async () => {
    await writeMemoryCache(REDIS_EVENTS_KEY, [{ id: "1" }], EVENTS_CACHE_TTL_MS);
    const cached = await memoryCache.get<Array<{ id: string }>>(REDIS_EVENTS_KEY);

    expect(cached?.data).toEqual([{ id: "1" }]);
  });
});
