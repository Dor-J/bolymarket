'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { CATEGORY_MORE_ITEMS } from '@/lib/constants/categories';
import { CategoryMoreMenuIcon } from '@/components/icons/CategoryMoreMenuIcons';
import { NavChevronDown } from '@/components/icons/NavChevronDown';
import { cn } from '@/lib/cn';

const CLOSE_DELAY_MS = 120;

/**
 * Category nav "More" hover dropdown — mirrors polymarket.com behavior.
 */
export function CategoryNavMore() {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearCloseTimer = useCallback(() => {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
  }, []);

  const openMenu = useCallback(() => {
    clearCloseTimer();
    setOpen(true);
  }, [clearCloseTimer]);

  const scheduleClose = useCallback(() => {
    clearCloseTimer();
    closeTimerRef.current = setTimeout(() => {
      setOpen(false);
    }, CLOSE_DELAY_MS);
  }, [clearCloseTimer]);

  useEffect(() => {
    return () => {
      clearCloseTimer();
    };
  }, [clearCloseTimer]);

  useEffect(() => {
    if (!open) {
      return;
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setOpen(false);
      }
    }

    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [open]);

  return (
    <div
      ref={containerRef}
      className="relative my-auto hidden shrink-0 lg:block"
      onMouseEnter={openMenu}
      onMouseLeave={scheduleClose}
      onFocus={openMenu}
      onBlur={(event) => {
        if (!containerRef.current?.contains(event.relatedTarget as Node)) {
          scheduleClose();
        }
      }}
    >
      <button
        type="button"
        aria-expanded={open}
        aria-haspopup="menu"
        aria-label="Open more navigation links"
        onClick={() => openMenu()}
        className={cn(
          'group inline-flex h-10 cursor-pointer items-center gap-1.5',
          'rounded-md px-3 py-1 text-sm font-medium text-[#77808d]',
          'transition-colors duration-150 outline-none',
          'hover:text-text focus-visible:ring-2 focus-visible:ring-ring',
          open ? 'text-text' : '',
        )}
      >
        More
        <NavChevronDown open={open} />
      </button>

      {open ? (
        <div
          role="menu"
          className={cn(
            'absolute top-full left-0 z-50 mt-1 min-w-[180px]',
            'rounded-lg border border-border bg-card p-1.5 shadow-lg',
            'flex flex-col',
          )}
        >
          {CATEGORY_MORE_ITEMS.map((item) => (
            <a
              key={item.label}
              role="menuitem"
              href={item.href}
              onClick={(event) => event.preventDefault()}
              className={cn(
                'flex items-center gap-2.5 rounded-sm px-2 py-1.5',
                'text-sm font-medium text-text',
                'transition-colors hover:bg-surface-2',
                'focus-visible:bg-surface-2 focus-visible:outline-none',
              )}
            >
              <CategoryMoreMenuIcon icon={item.icon} />
              {item.label}
            </a>
          ))}
        </div>
      ) : null}
    </div>
  );
}
