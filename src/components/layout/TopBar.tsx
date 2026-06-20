'use client';

import { Info } from 'lucide-react';
import { useAtom } from 'jotai';
import dynamic from 'next/dynamic';
import { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/Button';
import { HeaderSearchIcon } from '@/components/icons/HeaderSearchIcon';
import { UserMenu } from '@/components/layout/UserMenu';
import { searchQueryAtom } from '@/lib/atoms/search';
import { useSearchShortcut } from '@/hooks/useSearchShortcut';
import { cn } from '@/lib/cn';
import { Logo } from './Logo';

const AuthModal = dynamic(
  () => import('@/components/ui/Modal').then((module) => module.AuthModal),
  { ssr: false },
);

const HowItWorksModal = dynamic(
  () => import('@/components/ui/Modal').then((module) => module.HowItWorksModal),
  { ssr: false },
);

/**
 * Sticky top navigation bar — pixel-aligned with polymarket.com.
 */
export function TopBar() {
  const [searchQuery, setSearchQuery] = useAtom(searchQueryAtom);
  const searchRef = useRef<HTMLInputElement>(null);
  const [isDesktopSearchVisible, setIsDesktopSearchVisible] = useState(() =>
    typeof window === 'undefined'
      ? false
      : window.matchMedia('(min-width: 1024px)').matches,
  );
  const [authMode, setAuthMode] = useState<'login' | 'signup' | null>(null);
  const [howItWorksOpen, setHowItWorksOpen] = useState(false);
  const [hasLoadedAuthModal, setHasLoadedAuthModal] = useState(false);
  const [hasLoadedHowItWorksModal, setHasLoadedHowItWorksModal] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 1024px)');
    function handleChange() {
      setIsDesktopSearchVisible(mq.matches);
    }

    mq.addEventListener('change', handleChange);
    return () => mq.removeEventListener('change', handleChange);
  }, []);

  useSearchShortcut(searchRef, isDesktopSearchVisible);

  function openAuthModal(mode: 'login' | 'signup') {
    setHasLoadedAuthModal(true);
    setAuthMode(mode);
  }

  function openHowItWorksModal() {
    setHasLoadedHowItWorksModal(true);
    setHowItWorksOpen(true);
  }

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-border bg-surface">
        <div
          className={cn(
            'mx-auto flex w-full max-w-[1350px] items-center justify-between gap-4',
            'h-14 px-4 md:h-[68px] md:px-6',
          )}
        >
          <div className="flex min-w-0 items-center gap-3">
            <Logo className="shrink-0" />

            <div className="relative hidden min-w-0 lg:block lg:w-[416px] xl:w-[600px]">
              <div className="pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-neutral-500">
                <HeaderSearchIcon />
              </div>
              <input
                ref={searchRef}
                type="search"
                data-header-search
                value={searchQuery}
                onChange={(event) => {
                  setSearchQuery(event.target.value);
                }}
                aria-label="Search polymarkets"
                placeholder="Search polymarkets..."
                className={cn(
                  'h-10 w-full rounded-[9px] border border-transparent bg-surface-2',
                  'pl-11 pr-4 text-sm leading-5 text-text placeholder:text-neutral-500',
                  'transition-shadow duration-200',
                  'focus-visible:bg-surface-2 focus-visible:ring-0 focus-visible:outline-none',
                  'hover:bg-surface-2',
                )}
              />
              <kbd
                aria-hidden
                className="pointer-events-none absolute top-1/2 right-4 hidden -translate-y-1/2 text-sm text-neutral-400 lg:block"
              >
                /
              </kbd>
            </div>

            <Button
              variant="ghost-brand"
              className="hidden h-9 shrink-0 px-3 lg:inline-flex"
              aria-label="How it works"
              onClick={openHowItWorksModal}
            >
              <Info className="mr-1.5 h-4 w-4" aria-hidden />
              How it works
            </Button>
          </div>

          <div className="flex shrink-0 items-center gap-1 sm:gap-2">
            <Button
              variant="ghost-brand"
              className="hidden h-9 md:inline-flex"
              onClick={() => openAuthModal('login')}
            >
              Log In
            </Button>

            <Button
              variant="brand"
              className="h-9 rounded-[7.2px] px-4"
              onClick={() => openAuthModal('signup')}
            >
              Sign Up
            </Button>

            <UserMenu />
          </div>
        </div>
      </header>

      {hasLoadedAuthModal ? (
        <AuthModal
          open={authMode !== null}
          onClose={() => setAuthMode(null)}
          mode={authMode ?? 'login'}
        />
      ) : null}
      {hasLoadedHowItWorksModal ? (
        <HowItWorksModal
          open={howItWorksOpen}
          onClose={() => setHowItWorksOpen(false)}
        />
      ) : null}
    </>
  );
}
