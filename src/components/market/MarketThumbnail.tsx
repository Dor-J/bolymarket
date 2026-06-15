import Image from 'next/image';
import { cn } from '@/lib/cn';

export interface MarketThumbnailProps {
  title: string;
  image?: string;
  size?: number;
  className?: string;
}

/**
 * Circular market icon with image or title initial fallback.
 */
export function MarketThumbnail({
  title,
  image,
  size = 24,
  className,
}: MarketThumbnailProps) {
  const initial = title.trim().charAt(0).toUpperCase() || '?';

  if (image) {
    return (
      <Image
        src={image}
        alt=""
        width={size}
        height={size}
        className={cn('shrink-0 rounded-full object-cover', className)}
        style={{ width: size, height: size }}
      />
    );
  }

  return (
    <span
      className={cn(
        'inline-flex shrink-0 items-center justify-center rounded-full bg-surface-2',
        'text-[11px] leading-none font-semibold text-muted',
        className,
      )}
      style={{ width: size, height: size }}
      aria-hidden
    >
      {initial}
    </span>
  );
}
