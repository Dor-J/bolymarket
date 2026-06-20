'use client';

import { useEffect, useId, useRef, useState, type ReactNode } from 'react';
import { MarketFilterChevronIcon } from '@/components/icons/MarketControlIcons';
import { cn } from '@/lib/cn';

export interface MarketFilterDropdownOption<T extends string> {
  value: T;
  label: string;
}

export interface MarketFilterDropdownProps<T extends string> {
  label: string;
  value: T;
  options: MarketFilterDropdownOption<T>[];
  onChange: (value: T) => void;
  leadingIcon?: ReactNode;
  className?: string;
  menuLabel?: string;
}

const pillClassName = cn(
  'inline-flex h-8 cursor-pointer items-center justify-center gap-1.5 rounded-full border border-border',
  'px-3 text-sm font-semibold whitespace-nowrap text-text',
  'transition duration-150 active:scale-[97%] hover:bg-surface-2',
  'focus-visible:outline-none focus-visible:ring-0',
);

/**
 * Polymarket-style outline pill dropdown trigger.
 */
export function MarketFilterDropdown<T extends string>({
  label,
  value,
  options,
  onChange,
  leadingIcon,
  className,
  menuLabel,
}: MarketFilterDropdownProps<T>) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const menuId = useId();

  useEffect(() => {
    if (!open) {
      return;
    }

    function handlePointerDown(event: MouseEvent) {
      if (!containerRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setOpen(false);
      }
    }

    document.addEventListener('mousedown', handlePointerDown);
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [open]);

  return (
    <div ref={containerRef} className={cn('relative', className)}>
      <button
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={menuId}
        onClick={() => setOpen((current) => !current)}
        className={pillClassName}
      >
        {leadingIcon}
        <span>{label}</span>
        <MarketFilterChevronIcon />
      </button>

      {open ? (
        <div
          id={menuId}
          role="menu"
          aria-label={menuLabel ?? label}
          className={cn(
            'absolute top-full left-0 z-50 mt-1 min-w-[140px]',
            'rounded-lg border border-border bg-card p-1 shadow-lg',
          )}
        >
          {options.map((option) => (
            <button
              key={option.value}
              type="button"
              role="menuitem"
              onClick={() => {
                onChange(option.value);
                setOpen(false);
              }}
              className={cn(
                'flex w-full rounded-md px-2.5 py-1.5 text-left text-sm font-medium',
                'transition-colors hover:bg-surface-2',
                value === option.value ? 'text-text' : 'text-neutral-500',
              )}
            >
              {option.label}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
