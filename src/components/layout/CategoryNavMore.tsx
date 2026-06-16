'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { CATEGORY_MORE_ITEMS } from '@/lib/constants/categories';
import { CategoryMoreMenuIcon } from '@/components/icons/CategoryMoreMenuIcons';
import { NavChevronDown } from '@/components/icons/NavChevronDown';
import { cn } from '@/lib/cn';

const CLOSE_DELAY_MS = 120;
const PANEL_WIDTH_PX = 180;

/**
 * Category nav "More" hover dropdown — mirrors polymarket.com behavior.
 */
export function CategoryNavMore() {
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [panelPos, setPanelPos] = useState<{ top: number; left: number } | null>(null);

  const clearCloseTimer = useCallback(() => {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
  }, []);

  const computePanelPos = useCallback(() => {
    const trigger = triggerRef.current;
    if (!trigger) {
      return;
    }

    const rect = trigger.getBoundingClientRect();
    setPanelPos({
      top: rect.bottom + 4,
      left: rect.right - PANEL_WIDTH_PX,
    });
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

    computePanelPos();

    function handleEscape(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setOpen(false);
      }
    }

    function handlePointerDown(event: MouseEvent) {
      const target = event.target as Node;
      if (triggerRef.current?.contains(target)) {
        return;
      }
      if (panelRef.current?.contains(target)) {
        return;
      }
      setOpen(false);
    }

    document.addEventListener('keydown', handleEscape);
    document.addEventListener('mousedown', handlePointerDown);
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.removeEventListener('mousedown', handlePointerDown);
    };
  }, [open]);

  return (
    <div
      ref={wrapperRef}
      className="relative my-auto hidden shrink-0 xl:block"
      onMouseEnter={openMenu}
      onMouseLeave={scheduleClose}
      onFocus={openMenu}
    >
      <button
        ref={triggerRef}
        type="button"
        aria-expanded={open}
        aria-haspopup="menu"
        aria-label="Open more navigation links"
        onClick={openMenu}
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

      {open && panelPos
        ? createPortal(
            <div
              ref={panelRef}
              role="menu"
              className={cn(
                'rounded-lg border border-border bg-card p-1.5 shadow-lg',
                'flex flex-col',
              )}
              style={{
                position: 'fixed',
                top: panelPos.top,
                left: panelPos.left,
                width: PANEL_WIDTH_PX,
              }}
              onMouseEnter={openMenu}
              onMouseLeave={scheduleClose}
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
            </div>,
            document.body,
          )
        : null}
    </div>
  );
}
