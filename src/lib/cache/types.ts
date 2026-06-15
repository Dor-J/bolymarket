/** Serialized cache envelope stored in Redis. */
export interface CacheEnvelope<T> {
  data: T;
  cachedAt: number;
  expiresAt: number;
}

/** Options for reading a cache entry. */
export interface ReadCacheOptions {
  /** When true, expired entries are treated as misses. Defaults to true. */
  respectExpiry?: boolean;
}
