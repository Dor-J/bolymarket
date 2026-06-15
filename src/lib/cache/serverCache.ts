import "server-only";

import { memoryCache } from "./memory";
import { redisGet, redisSet } from "./redis";
import type { CacheEnvelope, ReadCacheOptions } from "./types";

function isExpired<T>(
  envelope: CacheEnvelope<T>,
  respectExpiry: boolean,
): boolean {
  return respectExpiry && envelope.expiresAt <= Date.now();
}

function createEnvelope<T>(data: T, ttlMs: number): CacheEnvelope<T> {
  const cachedAt = Date.now();
  return {
    data,
    cachedAt,
    expiresAt: cachedAt + ttlMs,
  };
}

/**
 * Reads from Redis first, then the in-memory fallback store.
 */
export async function readServerCache<T>(
  key: string,
  options: ReadCacheOptions = {},
): Promise<CacheEnvelope<T> | null> {
  const respectExpiry = options.respectExpiry ?? true;

  const fromRedis = await redisGet<T>(key);
  if (fromRedis && !isExpired(fromRedis, respectExpiry)) {
    return fromRedis;
  }

  const fromMemory = await memoryCache.get<T>(key);
  if (fromMemory && !isExpired(fromMemory, respectExpiry)) {
    return fromMemory;
  }

  return null;
}

/**
 * Writes to Redis when available and always mirrors to in-memory fallback.
 */
export async function writeServerCache<T>(
  key: string,
  data: T,
  ttlMs: number,
): Promise<CacheEnvelope<T>> {
  const envelope = createEnvelope(data, ttlMs);

  await Promise.all([
    redisSet(key, envelope, ttlMs),
    memoryCache.set(key, envelope),
  ]);

  return envelope;
}
