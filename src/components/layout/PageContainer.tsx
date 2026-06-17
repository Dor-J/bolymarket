'use client';

import { motion } from 'motion/react';
import { usePathname } from 'next/navigation';
import type { ReactNode } from 'react';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { cn } from '@/lib/cn';

export interface PageContainerProps {
  children: ReactNode;
  className?: string;
}

/**
 * Centered page container with subtle route transition fade.
 */
export function PageContainer({ children, className }: PageContainerProps) {
  const pathname = usePathname();
  const reducedMotion = useReducedMotion();

  return (
    <motion.div
      key={pathname}
      initial={reducedMotion ? false : { opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: reducedMotion ? 0 : 0.2 }}
      className={cn(
        'mx-auto w-full max-w-[1350px] px-6 py-6',
        'pb-[calc(1.5rem+var(--mobile-bottom-nav-height,56px))] md:pb-6',
        className,
      )}
    >
      {children}
    </motion.div>
  );
}
