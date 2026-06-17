'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { Moon, Sun, ChevronRight } from 'lucide-react';
import { useAtom } from 'jotai';
import {
  USER_MENU_ITEMS,
  USER_MENU_LANGUAGES,
  type UserMenuIconKey,
  type UserMenuItem,
} from '@/lib/constants/categories';
import {
  ApisMenuIcon,
  DarkModeMenuIcon,
  LanguageMenuIcon,
  LeaderboardMenuIcon,
  RewardsMenuIcon,
} from '@/components/icons/UserMenuIcons';
import { UserMenuTriggerIcon } from '@/components/icons/UserMenuTriggerIcon';
import { themeAtom, toggleThemeAtom } from '@/lib/atoms/theme';
import { cn } from '@/lib/cn';

function renderMenuIcon(icon: UserMenuIconKey | undefined) {
  switch (icon) {
    case 'leaderboard':
      return <LeaderboardMenuIcon />;
    case 'rewards':
      return <RewardsMenuIcon />;
    case 'apis':
      return <ApisMenuIcon />;
    case 'dark-mode':
      return <DarkModeMenuIcon />;
    case 'language':
      return <LanguageMenuIcon />;
    default:
      return null;
  }
}

function MenuDivider() {
  return <div role="separator" className="my-1 border-t border-border" />;
}

const userMenuItemClass = cn(
  'flex w-full items-center rounded-sm px-2 py-1.5',
  'text-sm font-medium text-text outline-none',
  'transition-colors',
);

const userMenuItemInteractiveClass = cn(
  userMenuItemClass,
  'hover:bg-surface-2 focus-visible:bg-surface-2',
);

/**
 * Desktop user menu dropdown — mirrors polymarket.com hamburger menu.
 */
export function UserMenu() {
  const [open, setOpen] = useState(false);
  const [languageOpen, setLanguageOpen] = useState(false);
  const [theme] = useAtom(themeAtom);
  const [, toggleTheme] = useAtom(toggleThemeAtom);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) {
      return;
    }

    function handlePointerDown(event: MouseEvent) {
      if (!containerRef.current?.contains(event.target as Node)) {
        setOpen(false);
        setLanguageOpen(false);
      }
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setOpen(false);
        setLanguageOpen(false);
      }
    }

    document.addEventListener('mousedown', handlePointerDown);
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [open]);

  function renderItem(item: UserMenuItem) {
    const icon = renderMenuIcon(item.icon);

    if (item.type === 'theme-toggle') {
      return (
        <div key={item.key}>
          <div
            role="menuitem"
            className={cn(userMenuItemClass, 'justify-between gap-3')}
          >
            <span className="flex items-center gap-3">
              {icon}
              {item.label}
            </span>
            <button
              type="button"
              aria-label={
                theme === 'light'
                  ? 'Switch to dark mode'
                  : 'Switch to light mode'
              }
              onClick={() => toggleTheme()}
              className={cn(
                'relative inline-flex h-6 w-11 shrink-0 rounded-full',
                'transition-colors',
                theme === 'dark' ? 'bg-brand' : 'bg-neutral-100',
              )}
            >
              <span
                className={cn(
                  'absolute top-0.5 left-0.5 flex h-5 w-5 items-center justify-center',
                  'rounded-full bg-white shadow transition-transform',
                  theme === 'dark' ? 'translate-x-5' : 'translate-x-0',
                )}
              >
                {theme === 'dark' ? (
                  <Moon className="h-3 w-3 text-brand" aria-hidden />
                ) : (
                  <Sun className="h-3 w-3 text-neutral-500" aria-hidden />
                )}
              </span>
            </button>
          </div>
          {item.showDividerAfter ? <MenuDivider /> : null}
        </div>
      );
    }

    if (item.type === 'language') {
      return (
        <div key={item.key} className="relative">
          <button
            type="button"
            role="menuitem"
            aria-expanded={languageOpen}
            onClick={() => setLanguageOpen((value) => !value)}
            className={cn(userMenuItemInteractiveClass, 'justify-between gap-3')}
          >
            <span className="flex items-center gap-3">
              {icon}
              {item.label}
            </span>
            <ChevronRight
              className={cn(
                'h-4 w-4 text-muted-foreground transition-transform',
                languageOpen ? 'rotate-90' : '',
              )}
              aria-hidden
            />
          </button>

          {languageOpen ? (
            <div className="border-t border-border p-1.5 pt-1">
              {USER_MENU_LANGUAGES.map((language) => (
                <button
                  key={language}
                  type="button"
                  role="menuitem"
                  onClick={() => setLanguageOpen(false)}
                  className={cn(
                    userMenuItemInteractiveClass,
                    'text-left',
                    language === 'English' ? 'font-semibold' : 'font-medium',
                  )}
                >
                  {language}
                </button>
              ))}
            </div>
          ) : null}
        </div>
      );
    }

    const linkContent = (
      <span className="flex items-center gap-3">
        {icon}
        {item.label}
      </span>
    );

    const linkClass = cn(userMenuItemInteractiveClass, 'gap-3');

    if (item.href?.startsWith('/')) {
      return (
        <div key={item.key}>
          <Link
            role="menuitem"
            href={item.href}
            onClick={() => setOpen(false)}
            className={linkClass}
          >
            {linkContent}
          </Link>
          {item.showDividerAfter ? <MenuDivider /> : null}
        </div>
      );
    }

    return (
      <div key={item.key}>
        <a
          role="menuitem"
          href="#"
          onClick={(event) => {
            event.preventDefault();
            setOpen(false);
          }}
          className={linkClass}
        >
          {linkContent}
        </a>
        {item.showDividerAfter ? <MenuDivider /> : null}
      </div>
    );
  }

  return (
    <div ref={containerRef} className="relative hidden xl:block">
      <button
        type="button"
        aria-label="Open user menu"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => {
          setOpen((value) => !value);
          setLanguageOpen(false);
        }}
        className={cn(
          'group hidden cursor-pointer items-center rounded-[6px] p-2 xl:flex',
          'transition-none hover:bg-surface-2',
          'focus:outline-none focus-visible:outline-none',
        )}
      >
        <UserMenuTriggerIcon />
      </button>

      {open ? (
        <div
          role="menu"
          className={cn(
            'absolute top-full right-0 z-50 mt-2 w-[240px]',
            'rounded-lg border border-border bg-card p-1.5 shadow-lg',
            'flex flex-col',
          )}
        >
          {USER_MENU_ITEMS.map((item) => renderItem(item))}
        </div>
      ) : null}
    </div>
  );
}
