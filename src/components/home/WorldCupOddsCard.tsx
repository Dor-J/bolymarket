import Image from 'next/image';
import Link from 'next/link';
import type { CSSProperties } from 'react';
import { cn } from '@/lib/cn';
import {
  getWorldCupFlagUrl,
  type WorldCupFlagCode,
} from '@/lib/sports/worldCupFlags';

interface WorldCupOddsFlag {
  code: WorldCupFlagCode;
  percent: string;
  delayMs: number;
}

export interface WorldCupOddsCardProps {
  className?: string;
}

const WORLD_CUP_ODDS_FLAGS: WorldCupOddsFlag[] = [
  { code: 'fra', percent: '18%', delayMs: 0 },
  { code: 'civ', percent: '1%', delayMs: 260 },
  { code: 'esp', percent: '14%', delayMs: 99 },
  { code: 'ury', percent: '1%', delayMs: 359 },
  { code: 'eng', percent: '13%', delayMs: 198 },
  { code: 'sen', percent: '1%', delayMs: 38 },
  { code: 'arg', percent: '12%', delayMs: 297 },
  { code: 'hrv', percent: '1%', delayMs: 137 },
  { code: 'prt', percent: '8%', delayMs: 397 },
  { code: 'che', percent: '1%', delayMs: 236 },
  { code: 'bra', percent: '7%', delayMs: 76 },
  { code: 'mex', percent: '1%', delayMs: 335 },
  { code: 'deu', percent: '6%', delayMs: 175 },
  { code: 'jpn', percent: '2%', delayMs: 14 },
  { code: 'nld', percent: '4%', delayMs: 274 },
  { code: 'col', percent: '2%', delayMs: 114 },
  { code: 'nor', percent: '3%', delayMs: 373 },
  { code: 'bel', percent: '2%', delayMs: 213 },
  { code: 'mar', percent: '2%', delayMs: 52 },
  { code: 'usa', percent: '2%', delayMs: 312 },
];

/**
 * Grid promo card for the World Cup odds market.
 */
export function WorldCupOddsCard({ className }: WorldCupOddsCardProps) {
  return (
    <Link
      aria-label="World Cup"
      href="/sports/world-cup/games"
      className={cn(
        'relative block h-full min-h-[180px] overflow-hidden rounded-xl border',
        'border-border bg-background shadow-md shadow-black/4 transition',
        'hover:-translate-y-px hover:shadow-md hover:shadow-black/8',
        'dark:bg-neutral-50 dark:hover:bg-neutral-100',
        className,
      )}
    >
      <div className="absolute inset-0 size-full overflow-hidden @container">
        <div
          className={cn(
            'wc-hero-perspective absolute top-[6.33cqw] left-1/2 aspect-square',
            'w-[138.23cqw] -translate-x-1/2 select-none @container',
          )}
          style={{ '--wc-wheel-size': '100cqi' } as CSSProperties}
        >
          <div className="wc-hero-flags-hydrated absolute inset-0" aria-hidden>
            <div className="wc-hero-wheel-spin absolute inset-0">
              {WORLD_CUP_ODDS_FLAGS.map((flag, index) => (
                <div
                  key={flag.code}
                  className="wc-hero-flag absolute top-1/2 left-1/2 size-0"
                  style={
                    {
                      transform: `rotate(${index * 18}deg) translateY(calc(var(--wc-wheel-size) * -0.4615))`,
                      '--wc-flag-delay': `${flag.delayMs}ms`,
                    } as CSSProperties
                  }
                >
                  <div
                    className="absolute rounded-[12%]"
                    style={{
                      width: 'calc(var(--wc-wheel-size) * 0.0769)',
                      height: 'calc(var(--wc-wheel-size) * 0.0607)',
                      top: 'calc(var(--wc-wheel-size) * -0.03035)',
                      left: 'calc(var(--wc-wheel-size) * -0.03845)',
                    }}
                  >
                    <div className="pointer-events-none flex size-full items-center justify-center">
                      <div className="relative h-full w-full overflow-hidden rounded-[12%]">
                        <Image
                          alt=""
                          src={getWorldCupFlagUrl(flag.code)}
                          width={19}
                          height={15}
                          sizes="24px"
                          className="h-full w-full object-cover"
                        />
                      </div>
                    </div>
                  </div>
                  <div
                    className={cn(
                      'absolute -translate-x-1/2 text-center font-mono font-medium',
                      'text-text-secondary tabular-nums',
                    )}
                    style={{
                      top: 'calc(var(--wc-wheel-size) * 0.03035 + var(--wc-wheel-size) * 0.0082)',
                      left: 0,
                      fontSize: 'calc(var(--wc-wheel-size) * 0.01786)',
                      lineHeight: 'calc(var(--wc-wheel-size) * 0.022)',
                      letterSpacing: '-0.09px',
                    }}
                  >
                    {flag.percent}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div
          className={cn(
            'absolute inset-x-0 bottom-0 flex items-end px-5 pt-[60px] pb-5',
            'bg-linear-to-b from-transparent to-background dark:to-neutral-50',
          )}
        >
          <p className="font-sauce text-heading-2xl text-text-primary">
            World Cup
            <br />
            Odds &amp; Predictions
          </p>
        </div>
      </div>
    </Link>
  );
}
