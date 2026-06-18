'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import type { MouseEvent } from 'react';
import { cn } from '@/lib/cn';
import {
  buildWorldCupFlagGrid,
  getDefaultVisibleFlagIndices,
  getWorldCupFlagUrl,
  pickVisibleFlagIndices,
} from '@/lib/sports/worldCupFlags';

const GRID_CELLS = 84;
const VISIBLE_FLAGS = 10;
const CYCLE_MS = 2200;

export interface SportsWorldCupBannerProps {
  className?: string;
  /** When set, clicking the banner filters the live feed to World Cup. */
  onSelect?: () => void;
}

/**
 * Promotional World Cup banner with Polymarket-style animated flag grid.
 */
export function SportsWorldCupBanner({ className, onSelect }: SportsWorldCupBannerProps) {
  const flagGrid = useMemo(() => buildWorldCupFlagGrid(GRID_CELLS), []);
  const [visibleIndices, setVisibleIndices] = useState(() =>
    getDefaultVisibleFlagIndices(GRID_CELLS, VISIBLE_FLAGS),
  );
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = (): void => setReduceMotion(media.matches);
    update();
    media.addEventListener('change', update);
    return () => media.removeEventListener('change', update);
  }, []);

  useEffect(() => {
    if (reduceMotion) {
      return undefined;
    }

    const interval = window.setInterval(() => {
      setVisibleIndices(pickVisibleFlagIndices(GRID_CELLS, VISIBLE_FLAGS));
    }, CYCLE_MS);

    return () => window.clearInterval(interval);
  }, [reduceMotion]);

  function handleClick(event: MouseEvent<HTMLAnchorElement>): void {
    if (!onSelect) {
      return;
    }

    event.preventDefault();
    onSelect();
  }

  return (
    <Link
      href="/sports/live"
      onClick={handleClick}
      aria-label="World Cup Odds & Predictions"
      className={cn(
        'group relative -mx-1 mb-4 block h-[140px] overflow-hidden rounded-2xl',
        'border border-border bg-background transition-shadow hover:shadow-md lg:mx-0 lg:mb-8',
        className,
      )}
    >
      <div
        aria-hidden
        className={cn(
          'pointer-events-none absolute inset-0 grid auto-rows-[30px]',
          'grid-cols-[repeat(auto-fill,minmax(40px,1fr))] place-items-center gap-2 p-3',
        )}
      >
        {flagGrid.map((code, index) => {
          const visible = reduceMotion
            ? index % 6 === 0
            : visibleIndices.has(index);

          return (
            <div
              key={`${code}-${index}`}
              className="wc-grid-flag"
              style={{
                transitionProperty: 'opacity, transform',
                transitionTimingFunction: 'ease-in-out',
                transitionDuration: visible ? '0.6s' : '1s',
                opacity: visible ? 1 : 0,
                transform: visible ? 'scale(1)' : 'scale(0.7)',
              }}
            >
              <div className="flex h-[22px] w-[30px] items-center justify-center">
                <div className="relative h-full w-full overflow-hidden rounded-[12%]">
                  <Image
                    alt=""
                    src={getWorldCupFlagUrl(code)}
                    fill
                    sizes="30px"
                    className="object-cover"
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(250px 150px at 15% 70%, var(--color-background) 40%, transparent 100%)',
        }}
      />

      <div className="pointer-events-none absolute inset-x-0 bottom-0 flex items-end justify-between p-4 lg:p-5">
        <p className="font-sauce text-text-primary text-heading-2xl">
          World Cup
          <br />
          <span className="inline-flex items-center">Odds &amp; Predictions</span>
        </p>
      </div>
    </Link>
  );
}
