import { atom } from 'jotai';

/** When true, home page shows only breaking/hot markets. */
export const breakingFilterAtom = atom(false);

/** When true, listing pages filter to bookmarked events only. */
export const bookmarksOnlyAtom = atom(false);
