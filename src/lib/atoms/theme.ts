import { atom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';
import type { Theme } from '@/types/polymarket';

const THEME_STORAGE_KEY = 'bolymarket-theme';

function getInitialTheme(): Theme {
  if (typeof window === 'undefined') {
    return 'light';
  }

  const stored = window.localStorage.getItem(THEME_STORAGE_KEY);
  if (stored === 'light' || stored === 'dark') {
    return stored;
  }

  return window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light';
}

/** Application theme — synced to `data-theme` on `<html>`. */
export const themeAtom = atomWithStorage<Theme>(
  THEME_STORAGE_KEY,
  'light',
  {
    getItem: (key, initialValue) => {
      if (typeof window === 'undefined') {
        return initialValue;
      }

      const stored = window.localStorage.getItem(key);
      if (stored === 'light' || stored === 'dark') {
        return stored;
      }

      return getInitialTheme();
    },
    setItem: (key, value) => {
      window.localStorage.setItem(key, value);
      document.documentElement.setAttribute('data-theme', value);
    },
    removeItem: (key) => {
      window.localStorage.removeItem(key);
    },
  },
);

/** Derived atom for toggling between light and dark themes. */
export const toggleThemeAtom = atom(null, (get, set) => {
  const current = get(themeAtom);
  set(themeAtom, current === 'light' ? 'dark' : 'light');
});
