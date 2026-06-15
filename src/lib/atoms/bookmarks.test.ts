import { describe, expect, it } from 'vitest';
import { isBookmarked } from './bookmarks';

describe('isBookmarked', () => {
  it('returns true when slug is in bookmarks', () => {
    expect(isBookmarked(['event-a', 'event-b'], 'event-a')).toBe(true);
  });

  it('returns false when slug is not bookmarked', () => {
    expect(isBookmarked(['event-a'], 'event-b')).toBe(false);
  });
});
