'use client';

import { memo, type MouseEvent, type ReactNode } from 'react';
import { PriceDisplay } from '@/components/market/PriceDisplay';
import { cn } from '@/lib/cn';

export type TradingButtonVariant = 'custom' | 'gray' | 'blue';

export interface TradingButtonProps {
  label?: string;
  marketId?: string;
  outcomeId?: string;
  price?: number;
  format?: 'percent' | 'cents' | 'sportsCents';
  variant?: TradingButtonVariant;
  backgroundColor?: string;
  textColor?: string;
  onClick?: (event: MouseEvent<HTMLButtonElement>) => void;
  className?: string;
  children?: ReactNode;
  disabled?: boolean;
  shadowHeight?: string;
}

const VARIANT_STYLES: Record<
  TradingButtonVariant,
  { background: string; color: string; shadow: string }
> = {
  custom: {
    background: 'var(--btn-background, #C00040)',
    color: 'var(--btn-color, #ffffff)',
    shadow: 'inset 0 calc(-1 * var(--btn-shadow-height, 4px)) 0 rgba(0,0,0,0.2)',
  },
  gray: {
    background: '#f5f5f5',
    color: '#171717',
    shadow: 'inset 0 calc(-1 * var(--btn-shadow-height, 4px)) 0 rgba(0,0,0,0.08)',
  },
  blue: {
    background: '#2E5CFF',
    color: '#ffffff',
    shadow: 'inset 0 calc(-1 * var(--btn-shadow-height, 4px)) 0 rgba(0,0,0,0.2)',
  },
};

/**
 * Polymarket-style 3D trading button with optional live price display.
 */
export const TradingButton = memo(function TradingButton({
  label,
  marketId,
  outcomeId,
  price,
  format = 'cents',
  variant = 'gray',
  backgroundColor,
  textColor,
  onClick,
  className,
  children,
  disabled = false,
  shadowHeight = '4px',
}: TradingButtonProps) {
  const styles = VARIANT_STYLES[variant];
  const bg = backgroundColor ?? styles.background;
  const color = textColor ?? styles.color;

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={cn(
        'flex h-9 w-full min-w-0 items-center justify-center gap-1 rounded-md px-2',
        'text-xs font-semibold transition-transform active:scale-[97%]',
        'disabled:cursor-not-allowed disabled:opacity-50',
        className,
      )}
      style={{
        background: bg,
        color,
        boxShadow: styles.shadow,
        ['--btn-background' as string]: bg,
        ['--btn-color' as string]: color,
        ['--btn-shadow-height' as string]: shadowHeight,
      }}
    >
      {children ?? (
        <>
          {label ? (
            <span
              className={cn(
                'truncate',
                variant === 'gray' ? 'opacity-70' : 'opacity-100',
              )}
            >
              {label}
            </span>
          ) : null}
          {marketId && outcomeId && price !== undefined ? (
            <PriceDisplay
              marketId={marketId}
              outcomeId={outcomeId}
              initialPrice={price}
              format={format}
              className="text-sm font-semibold"
            />
          ) : null}
        </>
      )}
    </button>
  );
});
