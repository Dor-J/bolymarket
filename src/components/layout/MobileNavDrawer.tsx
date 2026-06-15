'use client';

import { AnimatePresence, motion } from 'motion/react';
import Link from 'next/link';
import { X } from 'lucide-react';
import { CATEGORY_NAV_ITEMS } from '@/lib/constants/categories';
import { Button } from '@/components/ui/Button';
import { IconButton } from '@/components/ui/IconButton';
import { ThemeToggle } from '@/components/layout/ThemeToggle';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { cn } from '@/lib/cn';

export interface MobileNavDrawerProps {
  open: boolean;
  onClose: () => void;
  onLogin: () => void;
  onSignup: () => void;
}

/**
 * Slide-in mobile navigation drawer.
 */
export function MobileNavDrawer({
  open,
  onClose,
  onLogin,
  onSignup,
}: MobileNavDrawerProps) {
  const reducedMotion = useReducedMotion();

  return (
    <AnimatePresence>
      {open ? (
        <div className="fixed inset-0 z-[110] lg:hidden">
          <motion.button
            type="button"
            aria-label="Close menu"
            className="absolute inset-0 bg-black/40"
            initial={reducedMotion ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          <motion.aside
            initial={reducedMotion ? false : { x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: reducedMotion ? 0 : 0.25, ease: 'easeOut' }}
            className="absolute top-0 right-0 flex h-full w-[min(320px,85vw)] flex-col border-l border-border bg-surface p-4 shadow-xl"
          >
            <div className="mb-4 flex items-center justify-between">
              <span className="text-sm font-semibold text-text">Menu</span>
              <IconButton label="Close menu" onClick={onClose}>
                <X className="h-5 w-5" aria-hidden />
              </IconButton>
            </div>

            <nav className="flex flex-col gap-1">
              {CATEGORY_NAV_ITEMS.map((item) => (
                <Link
                  key={item.key}
                  href={item.href}
                  onClick={onClose}
                  className={cn(
                    'rounded-md px-3 py-2 text-sm font-semibold text-text',
                    'hover:bg-black/5 dark:hover:bg-white/10',
                  )}
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            <div className="mt-auto flex flex-col gap-2 pt-6">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Theme</span>
                <ThemeToggle />
              </div>
              <Button variant="ghost-brand" onClick={onLogin}>
                Log In
              </Button>
              <Button variant="brand" onClick={onSignup}>
                Sign Up
              </Button>
            </div>
          </motion.aside>
        </div>
      ) : null}
    </AnimatePresence>
  );
}
