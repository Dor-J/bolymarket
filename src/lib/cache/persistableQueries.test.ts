import { describe, expect, it, vi } from 'vitest';
import { shouldPersistQuery } from './persistableQueries';

function createMockQuery(
  queryKey: unknown[],
  status: 'success' | 'pending' | 'error',
) {
  return {
    queryKey,
    state: { status },
  } as Parameters<typeof shouldPersistQuery>[0];
}

describe('shouldPersistQuery', () => {
  it('persists successful events list queries', () => {
    expect(
      shouldPersistQuery(
        createMockQuery(['events', { closed: false, aggregated: true }], 'success'),
      ),
    ).toBe(true);
  });

  it('persists successful single event queries', () => {
    expect(shouldPersistQuery(createMockQuery(['event', 'my-slug'], 'success'))).toBe(
      true,
    );
  });

  it('does not persist pending queries', () => {
    expect(
      shouldPersistQuery(
        createMockQuery(['events', { closed: false, aggregated: true }], 'pending'),
      ),
    ).toBe(false);
  });

  it('does not persist unrelated query keys', () => {
    expect(shouldPersistQuery(createMockQuery(['prices', 'abc'], 'success'))).toBe(
      false,
    );
  });
});
