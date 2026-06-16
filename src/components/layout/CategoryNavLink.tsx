'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { CategoryIcon, CategoryNavItem } from '@/lib/constants/categories';
import { TrendingIcon, WorldCupIcon } from '@/components/icons/CategoryNavIcons';
import { cn } from '@/lib/cn';

export interface CategoryNavLinkProps {
  item: CategoryNavItem;
}

function renderIcon(icon: CategoryIcon | undefined, isActive: boolean) {
  if (icon === 'trending') {
    return (
      <TrendingIcon
        className={isActive ? 'text-text' : 'text-[#77808d]'}
      />
    );
  }

  if (icon === 'world-cup') {
    return <WorldCupIcon />;
  }

  return null;
}

/**
 * Single category nav link with Polymarket styling (active = darker text only).
 */
export function CategoryNavLink({ item }: CategoryNavLinkProps) {
  const pathname = usePathname();
  const isActive =
    item.functional &&
    (item.href === '/'
      ? pathname === '/'
      : pathname === item.href || pathname.startsWith(`${item.href}/`));

  const className = cn(
    'inline-flex h-12 shrink-0 items-center gap-1.5 px-2.5',
    'text-sm leading-5 font-semibold whitespace-nowrap transition-colors',
    'hover:text-text focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none',
    isActive ? 'text-text' : 'text-[#77808d]',
    !isActive && item.accentClass,
  );

  const content = (
    <>
      {renderIcon(item.icon, isActive)}
      <span>{item.label}</span>
    </>
  );

  if (!item.functional) {
    return (
      <a
        href="#"
        className={className}
        onClick={(event) => event.preventDefault()}
      >
        {content}
      </a>
    );
  }

  return (
    <Link href={item.href} className={className} aria-current={isActive ? 'page' : undefined}>
      {content}
    </Link>
  );
}
