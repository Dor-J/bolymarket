import "server-only";

import { createClient, type RedisClientType } from "redis";
import type { CacheEnvelope } from "./types";

let client: RedisClientType | null = null;
let connectPromise: Promise<RedisClientType | null> | null = null;

/**
 * Returns a connected Redis client, or null when `REDIS_URL` is not configured.
 */
export async function getRedisClient(): Promise<RedisClientType | null> {
  const redisUrl = process.env.REDIS_URL;

  if (!redisUrl) {
    return null;
  }

  if (client?.isOpen) {
    return client;
  }

  if (!connectPromise) {
    connectPromise = (async () => {
      try {
        const nextClient = createClient({ url: redisUrl });
        nextClient.on("error", (error) => {
          console.error("[redis] connection error:", error);
        });
        await nextClient.connect();
        client = nextClient as RedisClientType;
        return client;
      } catch (error) {
        console.error("[redis] failed to connect:", error);
        client = null;
        return null;
      } finally {
        connectPromise = null;
      }
    })();
  }

  return connectPromise;
}

/**
 * Reads a JSON cache envelope from Redis.
 */
export async function redisGet<T>(key: string): Promise<CacheEnvelope<T> | null> {
  const redis = await getRedisClient();
  if (!redis) {
    return null;
  }

  const raw = await redis.get(key);
  if (!raw) {
    return null;
  }

  try {
    return JSON.parse(raw) as CacheEnvelope<T>;
  } catch {
    await redis.del(key);
    return null;
  }
}

/**
 * Writes a JSON cache envelope to Redis with TTL.
 */
export async function redisSet<T>(
  key: string,
  envelope: CacheEnvelope<T>,
  ttlMs: number,
): Promise<void> {
  const redis = await getRedisClient();
  if (!redis) {
    return;
  }

  const ttlSeconds = Math.max(1, Math.ceil(ttlMs / 1000));
  await redis.setEx(key, ttlSeconds, JSON.stringify(envelope));
}

/** Disconnects Redis — test helper only. */
export async function disconnectRedisForTests(): Promise<void> {
  if (client?.isOpen) {
    await client.quit();
  }

  client = null;
  connectPromise = null;
}
