'use client';

import { useMemo } from 'react';
import {
  CATEGORY_PAGE_META,
  type CategoryRouteSlug,
} from '@/lib/constants/categoryRoutes';
import { useCategoryEvents } from '@/hooks/useCategoryEvents';
import { EventsGridView } from '@/components/home/EventsGridView';

export interface CategoryPageViewProps {
  tag: CategoryRouteSlug;
}

/**
 * Dedicated category page with tag-specific data fetch and grid.
 */
export function CategoryPageView({ tag }: CategoryPageViewProps) {
  const meta = CATEGORY_PAGE_META[tag];
  const { events, isLoading, isError, error, refetch, isFetching } =
    useCategoryEvents(tag);

  const featuredEvents = useMemo(
    () => events.slice(0, 4),
    [events],
  );

  return (
    <div>
      <header className="mb-6">
        <h1 className="text-2xl leading-8 font-semibold text-text">
          {meta.title}
        </h1>
        <p className="mt-1 text-sm leading-5 text-muted">{meta.description}</p>
      </header>

      <EventsGridView
        events={events}
        isLoading={isLoading}
        isError={isError}
        isFetching={isFetching}
        error={error}
        onRetry={() => {
          void refetch();
        }}
        heading={`${meta.title} markets`}
        showFeatured
        featuredEvents={featuredEvents}
      />
    </div>
  );
}
