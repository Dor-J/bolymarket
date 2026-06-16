import {
  Activity,
  Clock,
  Gift,
  LayoutGrid,
  Trophy,
  type LucideIcon,
} from 'lucide-react';
import type { CategoryMoreIconKey } from '@/lib/constants/categories';
import { cn } from '@/lib/cn';

const ICON_MAP: Record<CategoryMoreIconKey, LucideIcon> = {
  new: Clock,
  activity: Activity,
  leaderboard: Trophy,
  dashboards: LayoutGrid,
  rewards: Gift,
};

export interface CategoryMoreMenuIconProps {
  icon: CategoryMoreIconKey;
  className?: string;
}

/**
 * Outline icons for category nav "More" dropdown items.
 */
export function CategoryMoreMenuIcon({ icon, className }: CategoryMoreMenuIconProps) {
  const Icon = ICON_MAP[icon];

  return (
    <Icon
      aria-hidden
      className={cn('h-[18px] w-[18px] shrink-0 text-[#77808d]', className)}
      strokeWidth={1.75}
    />
  );
}
