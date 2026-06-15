'use client';

import { Moon, Sun } from 'lucide-react';
import { useAtom } from 'jotai';
import { IconButton } from '@/components/ui/IconButton';
import { toggleThemeAtom, themeAtom } from '@/lib/atoms/theme';

/**
 * Toggles between light and dark themes.
 */
export function ThemeToggle() {
  const [theme] = useAtom(themeAtom);
  const [, toggleTheme] = useAtom(toggleThemeAtom);

  return (
    <IconButton
      label={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
      onClick={() => toggleTheme()}
    >
      {theme === 'light' ? (
        <Moon className="h-4 w-4" aria-hidden />
      ) : (
        <Sun className="h-4 w-4" aria-hidden />
      )}
    </IconButton>
  );
}
