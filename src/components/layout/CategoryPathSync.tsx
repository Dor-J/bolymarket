'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { useSetAtom } from 'jotai';
import { selectedCategoryAtom } from '@/lib/atoms/category';
import { isCategoryRouteSlug } from '@/lib/constants/categoryRoutes';

/**
 * Syncs the selected category atom from the current pathname.
 */
export function CategoryPathSync() {
  const pathname = usePathname();
  const setCategory = useSetAtom(selectedCategoryAtom);

  useEffect(() => {
    const slug = pathname.replace(/^\//, '');
    if (isCategoryRouteSlug(slug)) {
      setCategory(slug);
      return;
    }

    setCategory('trending');
  }, [pathname, setCategory]);

  return null;
}
