'use client';

import { Info, Menu, Search } from 'lucide-react';
import { useAtom } from 'jotai';
import { useRef, useState } from 'react';
import { Button } from '@/components/ui/Button';
import { IconButton } from '@/components/ui/IconButton';
import { AuthModal, HowItWorksModal } from '@/components/ui/Modal';
import { MobileNavDrawer } from '@/components/layout/MobileNavDrawer';
import { ThemeToggle } from '@/components/layout/ThemeToggle';
import { searchQueryAtom } from '@/lib/atoms/search';
import { useSearchShortcut } from '@/hooks/useSearchShortcut';
import { cn } from '@/lib/cn';
import { Logo } from './Logo';

/**
 * Sticky top navigation bar — logo, search, auth actions.
 */
export function TopBar() {
  const [searchQuery, setSearchQuery] = useAtom(searchQueryAtom);
  const searchRef = useRef<HTMLInputElement>(null);
  const [authMode, setAuthMode] = useState<'login' | 'signup' | null>(null);
  const [howItWorksOpen, setHowItWorksOpen] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  useSearchShortcut(searchRef);

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-border bg-surface">
        <div className="mx-auto flex h-16 w-full max-w-[1350px] items-center gap-3 px-6">
          <Logo className="shrink-0" />

          <div className="relative min-w-0 flex-1">
            <Search
              aria-hidden
              className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted"
            />
            <input
              ref={searchRef}
              type="search"
              value={searchQuery}
              onChange={(event) => {
                setSearchQuery(event.target.value);
              }}
              aria-label="Search polymarkets"
              placeholder="Search polymarkets…"
              className={cn(
                'h-10 w-full rounded-md bg-surface-2 pr-10 pl-11',
                'text-sm leading-5 text-text placeholder:text-muted',
                'focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none',
              )}
            />
            <kbd
              aria-hidden
              className="pointer-events-none absolute top-1/2 right-3 hidden -translate-y-1/2 rounded border border-border bg-surface px-1.5 py-0.5 text-xs text-muted sm:inline"
            >
              /
            </kbd>
          </div>

          <div className="flex shrink-0 items-center gap-1 sm:gap-2">
            <ThemeToggle />

            <Button
              variant="ghost-brand"
              className="hidden px-3 md:inline-flex"
              aria-label="How it works"
              onClick={() => setHowItWorksOpen(true)}
            >
              <Info className="mr-1.5 h-4 w-4" aria-hidden />
              How it works
            </Button>

            <Button
              variant="ghost-brand"
              className="hidden sm:inline-flex"
              onClick={() => setAuthMode('login')}
            >
              Log In
            </Button>
            <Button variant="brand" onClick={() => setAuthMode('signup')}>
              Sign Up
            </Button>

            <IconButton
              label="Open menu"
              className="lg:hidden"
              onClick={() => setMobileNavOpen(true)}
            >
              <Menu className="h-5 w-5" aria-hidden />
            </IconButton>
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
      <MobileNavDrawer
        open={mobileNavOpen}
        onClose={() => setMobileNavOpen(false)}
        onLogin={() => {
          setMobileNavOpen(false);
          setAuthMode('login');
        }}
        onSignup={() => {
          setMobileNavOpen(false);
          setAuthMode('signup');
        }}
      />
    </>
  );
}
