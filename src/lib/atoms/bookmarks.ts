import { atom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';

const BOOKMARKS_STORAGE_KEY = 'bolymarket-bookmarks';

/** Persisted set of bookmarked event slugs. */
export const bookmarksAtom = atomWithStorage<string[]>(
  BOOKMARKS_STORAGE_KEY,
  [],
);

/** Toggles bookmark state for an event slug. */
export const toggleBookmarkAtom = atom(
  null,
  (get, set, slug: string) => {
    const current = get(bookmarksAtom);
    if (current.includes(slug)) {
      set(
        bookmarksAtom,
        current.filter((item) => item !== slug),
      );
      return;
    }

    set(bookmarksAtom, [...current, slug]);
  },
);

/**
 * Returns true when an event slug is bookmarked.
 */
export function isBookmarked(bookmarks: string[], slug: string): boolean {
  return bookmarks.includes(slug);
}
