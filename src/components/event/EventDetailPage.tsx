'use client';

import { useMemo } from 'react';
import { PriceChart } from '@/components/chart/PriceChart';
import { TimeframeToggle } from '@/components/chart/TimeframeToggle';
import { getOutcomeColor } from '@/lib/chart/colors';
import type { ChartOutcome } from '@/lib/chart/types';
import { getChartOutcomes } from '@/lib/event/flattenOutcomes';
import { getOutcomeSeedsFromEvent } from '@/lib/prices/visibleOutcomeKeys';
import { useChartTimeframe } from '@/hooks/useChartTimeframe';
import { useEvent } from '@/hooks/useEvent';
import { useLivePrices } from '@/hooks/useLivePrices';
import { ChartMetaRow } from './ChartMetaRow';
import { EventDetailError } from './EventDetailError';
import { EventDetailSkeleton } from './EventDetailSkeleton';
import { EventHeader } from './EventHeader';
import { OrderSidebarPlaceholder } from './OrderSidebarPlaceholder';
import { OutcomeLegend } from './OutcomeLegend';
import { OutcomeList } from './OutcomeList';

export interface EventDetailPageProps {
  slug: string;
}

/**
 * Client orchestrator for the event detail layout.
 */
export function EventDetailPage({ slug }: EventDetailPageProps) {
  const { data: event, isLoading, isError, error, refetch } = useEvent(slug);
  const { timeframe, selectTimeframe } = useChartTimeframe();

  const chartOutcomes = useMemo<ChartOutcome[]>(() => {
    if (!event) {
      return [];
    }

    return getChartOutcomes(event).map((row, index) => ({
      id: row.outcomeId,
      marketId: row.marketId,
      name: row.name,
      price: row.yesPrice,
      color: getOutcomeColor(index),
    }));
  }, [event]);

  const priceSeeds = useMemo(
    () => (event ? getOutcomeSeedsFromEvent(event) : []),
    [event],
  );

  useLivePrices(priceSeeds);

  if (isLoading) {
    return <EventDetailSkeleton />;
  }

  if (isError || !event) {
    return (
      <EventDetailError
        message={error instanceof Error ? error.message : undefined}
        onRetry={() => {
          void refetch();
        }}
      />
    );
  }

  return (
    <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:gap-8">
      <div className="min-w-0 flex-1 space-y-6 lg:max-w-[938px]">
        <EventHeader event={event} />
        <OutcomeLegend outcomes={chartOutcomes} />
        <div className="space-y-3">
          <PriceChart
            outcomes={chartOutcomes}
            eventId={event.id}
            timeframe={timeframe}
          />
          <TimeframeToggle value={timeframe} onChange={selectTimeframe} />
        </div>
        <ChartMetaRow volume={event.volume} endDate={event.endDate} />
        <OutcomeList event={event} />
      </div>

      <OrderSidebarPlaceholder className="w-full shrink-0 lg:sticky lg:top-[calc(var(--navbar-height)+1rem)] lg:w-[360px]" />
    </div>
  );
}
