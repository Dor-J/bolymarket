import { atom } from 'jotai';

/** Raw search input from the top bar (updated on every keystroke). */
export const searchQueryAtom = atom('');
