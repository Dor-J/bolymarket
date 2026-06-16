'use client';

import { Info, Search } from 'lucide-react';
import { useAtom } from 'jotai';
import { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/Button';
import { AuthModal, HowItWorksModal } from '@/components/ui/Modal';
import { UserMenu } from '@/components/layout/UserMenu';
import { searchQueryAtom } from '@/lib/atoms/search';
import { useSearchShortcut } from '@/hooks/useSearchShortcut';
import { cn } from '@/lib/cn';
import { Logo } from './Logo';

/**
 * Sticky top navigation bar — pixel-aligned with polymarket.com.
 */
export function TopBar() {
  const [searchQuery, setSearchQuery] = useAtom(searchQueryAtom);
  const searchRef = useRef<HTMLInputElement>(null);
  const [isXlUp, setIsXlUp] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup' | null>(null);
  const [howItWorksOpen, setHowItWorksOpen] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 1280px)');
    setIsXlUp(mq.matches);

    function handleChange() {
      setIsXlUp(mq.matches);
    }

    mq.addEventListener('change', handleChange);
    return () => mq.removeEventListener('change', handleChange);
  }, []);

  useSearchShortcut(searchRef, isXlUp);

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-border bg-surface">
        <div
          className={cn(
            'mx-auto flex w-full max-w-[1350px] items-center gap-3',
            'h-14 px-4 md:h-[68px] md:px-6',
          )}
        >
          <Logo className="shrink-0" />

          <div className="relative hidden min-w-0 flex-1 justify-center xl:flex">
            <div className="relative w-full max-w-[600px]">
              <Search
              aria-hidden
              className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-[#77808d]"
            />
            <input
              ref={searchRef}
              type="search"
              value={searchQuery}
              onChange={(event) => {
                setSearchQuery(event.target.value);
              }}
              aria-label="Search polymarkets"
              placeholder="Search polymarkets..."
              className={cn(
                'h-10 w-full rounded-[9px] bg-surface-2 pr-10 pl-10',
                'text-sm leading-5 text-text placeholder:text-[#77808d]',
                'focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none',
              )}
            />
            <kbd
              aria-hidden
              className={cn(
                'pointer-events-none absolute top-1/2 right-3 hidden -translate-y-1/2',
                'rounded border border-border bg-surface px-1.5 py-0.5',
                'text-xs text-[#77808d] xl:inline',
              )}
            >
              /
            </kbd>
            </div>
          </div>

          <div className="ml-auto flex shrink-0 items-center gap-1 sm:gap-2">
            <Button
              variant="ghost-brand"
              className="hidden h-9 px-3 xl:inline-flex"
              aria-label="How it works"
              onClick={() => setHowItWorksOpen(true)}
            >
              <Info className="mr-1.5 h-4 w-4" aria-hidden />
              How it works
            </Button>

            <Button
              variant="ghost-brand"
              className="hidden h-9 xl:inline-flex"
              onClick={() => setAuthMode('login')}
            >
              Log In
            </Button>

            <Button
              variant="brand"
              className="h-9 rounded-[7.2px] px-4"
              onClick={() => setAuthMode('signup')}
            >
              Sign Up
            </Button>

            <UserMenu />
          </div>
        </div>
      </header>

      <AuthModal
        open={authMode !== null}
        onClose={() => setAuthMode(null)}
        mode={authMode ?? 'login'}
      />
      <HowItWorksModal
        open={howItWorksOpen}
        onClose={() => setHowItWorksOpen(false)}
      />
    </>
  );
}
