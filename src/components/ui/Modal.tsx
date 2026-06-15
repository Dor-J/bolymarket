'use client';

import { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { IconButton } from '@/components/ui/IconButton';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { cn } from '@/lib/cn';

export interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  className?: string;
}

/**
 * Accessible modal dialog with motion transitions.
 */
export function Modal({
  open,
  onClose,
  title,
  children,
  className,
}: ModalProps) {
  const reducedMotion = useReducedMotion();
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) {
      return;
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        onClose();
      }
    }

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose, open]);

  return (
    <AnimatePresence>
      {open ? (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
          <motion.button
            type="button"
            aria-label="Close dialog"
            className="absolute inset-0 bg-black/40"
            initial={reducedMotion ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          <motion.div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
            initial={reducedMotion ? false : { opacity: 0, scale: 0.96, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 8 }}
            transition={{ duration: reducedMotion ? 0 : 0.2 }}
            className={cn(
              'relative z-10 w-full max-w-md rounded-card border border-border bg-card p-6 shadow-xl',
              className,
            )}
          >
            <div className="mb-4 flex items-center justify-between gap-3">
              <h2 id="modal-title" className="text-lg font-semibold text-text">
                {title}
              </h2>
              <IconButton label="Close" onClick={onClose}>
                <X className="h-4 w-4" aria-hidden />
              </IconButton>
            </div>
            {children}
          </motion.div>
        </div>
      ) : null}
    </AnimatePresence>
  );
}

export interface AuthModalProps {
  open: boolean;
  onClose: () => void;
  mode: 'login' | 'signup';
}

/**
 * Visual-only auth modal (no real authentication).
 */
export function AuthModal({ open, onClose, mode }: AuthModalProps) {
  const title = mode === 'login' ? 'Log in' : 'Sign up';

  return (
    <Modal open={open} onClose={onClose} title={title}>
      <p className="mb-4 text-sm text-muted-foreground">
        Trading is visual-only in this assignment clone. Create an account on
        Polymarket to trade for real.
      </p>

      <form className="space-y-3" onSubmit={(event) => event.preventDefault()}>
        <label className="block text-sm font-medium text-text">
          Email
          <input
            type="email"
            placeholder="you@example.com"
            className="mt-1 w-full rounded-md border border-border bg-surface-2 px-3 py-2 text-sm"
          />
        </label>
        <label className="block text-sm font-medium text-text">
          Password
          <input
            type="password"
            placeholder="••••••••"
            className="mt-1 w-full rounded-md border border-border bg-surface-2 px-3 py-2 text-sm"
          />
        </label>
        <Button variant="brand" className="w-full" disabled>
          {title}
        </Button>
      </form>
    </Modal>
  );
}

export interface HowItWorksModalProps {
  open: boolean;
  onClose: () => void;
}

/**
 * Informational modal explaining prediction markets.
 */
export function HowItWorksModal({ open, onClose }: HowItWorksModalProps) {
  return (
    <Modal open={open} onClose={onClose} title="How it works">
      <ol className="list-decimal space-y-2 pl-5 text-sm text-muted-foreground">
        <li>Browse markets and see live probabilities.</li>
        <li>Buy shares on outcomes you think will happen.</li>
        <li>Prices move as traders react to new information.</li>
        <li>Winning shares pay out $1 when the market resolves.</li>
      </ol>
    </Modal>
  );
}
