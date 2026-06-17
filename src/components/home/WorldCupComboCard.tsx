import Image from 'next/image';
import Link from 'next/link';
import { cn } from '@/lib/cn';

export interface WorldCupComboCardProps {
  className?: string;
}

/**
 * Promotional card for building World Cup combo trades.
 */
export function WorldCupComboCard({ className }: WorldCupComboCardProps) {
  return (
    <div
      data-polykit="true"
      className={cn(
        'relative mb-4 shrink-0 overflow-hidden rounded-[18px] border',
        'border-(--color-element-border) bg-background p-4',
        'shadow-[0_1px_30px_rgba(9,9,11,0.03)] dark:shadow-[0_18px_60px_rgba(0,0,0,0.28)]',
        className,
      )}
    >
      <div
        aria-hidden
        className={cn(
          'pointer-events-none absolute inset-x-0 top-0 h-[90px]',
          'bg-[linear-gradient(90deg,#82CB9F_0%,#697AEB_37%,#C96BEF_100%)] opacity-30',
        )}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-[90px] bg-linear-to-b from-transparent to-background"
      />

      <span
        data-polykit="true"
        data-slot="badge"
        data-variant="subtle-sm"
        data-color="purple"
        className={cn(
          'absolute top-4 right-4 inline-flex h-6 shrink-0 items-center justify-center',
          'rounded-full pl-1.5 pr-0.5 text-xs font-medium',
          '[&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0',
        )}
        style={{
          backgroundColor: 'var(--color-purple-100)',
          color: 'var(--color-purple-800)',
        }}
      >
        <span data-slot="label" className="inline-flex items-center justify-center pr-1.5 pl-0.5">
          Beta
        </span>
      </span>

      <div className="relative flex flex-col items-center gap-2.5 pt-1">
        <Image
          alt=""
          src="/WorldCupBall.svg"
          width={52}
          height={48}
          className="h-12 w-[52px]"
        />

        <div className="flex flex-col items-center gap-1.5 text-center">
          <h2 className="text-[22px] leading-7 font-[580] text-primary">
            Build a World Cup combo
          </h2>
          <p className="max-w-[260px] text-base font-medium text-(--color-gray-600)">
            Combine multiple predictions in one trade for a bigger payout
          </p>
        </div>

        <Link
          href="/sports/world-cup/games"
          className={cn(
            'mt-1.5 flex h-10 w-full items-center justify-center rounded-full',
            'bg-(--color-purple-600) text-base font-semibold text-white',
            'transition-[background-color,scale] duration-120 ease-out',
            'hover:bg-(--color-purple-700) active:scale-[0.98]',
          )}
        >
          Get started
        </Link>
      </div>
    </div>
  );
}
