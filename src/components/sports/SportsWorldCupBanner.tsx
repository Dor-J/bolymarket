import Link from 'next/link';
import { cn } from '@/lib/cn';

const FLAG_CODES = [
  'fra',
  'eng',
  'esp',
  'bra',
  'usa',
  'deu',
  'arg',
  'ita',
  'mex',
  'jpn',
  'kor',
  'nld',
];

export interface SportsWorldCupBannerProps {
  className?: string;
}

/**
 * Promotional World Cup banner shown above the sports live feed.
 */
export function SportsWorldCupBanner({ className }: SportsWorldCupBannerProps) {
  return (
    <Link
      href="/sports"
      aria-label="World Cup Odds and Predictions"
      className={cn(
        'group relative mb-4 block h-[140px] overflow-hidden rounded-2xl border border-border',
        'bg-background transition-shadow hover:shadow-md lg:mb-8',
        '-mx-1 lg:mx-0',
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
        {FLAG_CODES.map((code, index) => (
          <div
            key={code}
            className="flex h-[22px] w-[30px] items-center justify-center overflow-hidden rounded-[12%] bg-neutral-100"
            style={{ opacity: index % 3 === 0 ? 1 : 0.35 }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              alt=""
              src={`https://polymarket-upload.s3.us-east-2.amazonaws.com/country-flags/${code}.png`}
              className="h-full w-full object-cover"
              loading="lazy"
            />
          </div>
        ))}
      </div>
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(250px 150px at 15% 70%, var(--background) 40%, transparent 100%)',
        }}
      />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 flex items-end justify-between p-4 lg:p-5">
        <p className="text-2xl font-semibold leading-tight text-text">
          World Cup
          <br />
          <span className="inline-flex items-center">Odds &amp; Predictions</span>
        </p>
      </div>
    </Link>
  );
}
