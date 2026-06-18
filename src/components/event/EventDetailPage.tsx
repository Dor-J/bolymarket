"use client";

import { useMemo } from "react";
import { PriceChart } from "@/components/chart/PriceChart";
import { getOutcomeColor } from "@/lib/chart/colors";
import type { ChartOutcome } from "@/lib/chart/types";
import { getChartOutcomes } from "@/lib/event/flattenOutcomes";
import { resolveEventDetailVariant } from "@/lib/event/resolveEventDetailVariant";
import { getOutcomeSeedsFromEvent } from "@/lib/prices/visibleOutcomeKeys";
import { useChartTimeframe } from "@/hooks/useChartTimeframe";
import { useEvent } from "@/hooks/useEvent";
import { useLivePrices } from "@/hooks/useLivePrices";
import { ChartMetaRow } from "./ChartMetaRow";
import { EventDetailError } from "./EventDetailError";
import { EventDetailSkeleton } from "./EventDetailSkeleton";
import { EventDiscussionTabs } from "./EventDiscussionTabs";
import { EventHeader } from "./EventHeader";
import { EventMarketContext } from "./EventMarketContext";
import { EventRulesSection } from "./EventRulesSection";
import { EventSportsDetail } from "./EventSportsDetail";
import { EventTimeWindowNav } from "./EventTimeWindowNav";
import { OrderTicket } from "./OrderTicket";
import { OutcomeLegend } from "./OutcomeLegend";
import { OutcomeList } from "./OutcomeList";

export interface EventDetailPageProps {
  slug: string;
}

/**
 * Client orchestrator for the event detail layout with variant routing.
 */
export function EventDetailPage({ slug }: EventDetailPageProps) {
  const { data: event, isLoading, isError, error, refetch } = useEvent(slug);
  const { timeframe, selectTimeframe } = useChartTimeframe();

  const variant = useMemo(
    () => (event ? resolveEventDetailVariant(event) : "standard"),
    [event],
  );

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

  const primaryMarket = useMemo(() => {
    if (!event || event.markets.length === 0) {
      return null;
    }

    const [row] = getChartOutcomes(event, 1);
    if (!row) {
      return null;
    }

    return {
      marketId: row.marketId,
      yesOutcomeId: row.outcomeId,
      outcomeName: row.name,
      yesPrice: row.yesPrice,
      noPrice: row.noPrice,
      image: row.image ?? event.image,
    };
  }, [event]);

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

  const showTimeWindow = variant === "crypto-recurring";
  const showSportsLayout = variant === "sports-match";

  return (
    <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:gap-8">
      <div className="min-w-0 flex-1 space-y-6 lg:max-w-[938px]">
        <EventHeader event={event} />
        <OutcomeLegend outcomes={chartOutcomes} />

        {showTimeWindow ? <EventTimeWindowNav /> : null}

        <div className="space-y-3">
          <PriceChart
            outcomes={chartOutcomes}
            eventId={event.id}
            timeframe={timeframe}
          />
          <ChartMetaRow
            volume={event.volume}
            endDate={event.endDate}
            timeframe={timeframe}
            onTimeframeChange={selectTimeframe}
          />
        </div>

        {showSportsLayout ? (
          <EventSportsDetail event={event} />
        ) : (
          <OutcomeList event={event} />
        )}

        <EventRulesSection description={event.description} />
        <EventMarketContext event={event} />
        <EventDiscussionTabs />
      </div>

      {primaryMarket ? (
        <OrderTicket
          marketId={primaryMarket.marketId}
          yesOutcomeId={primaryMarket.yesOutcomeId}
          eventTitle={event.title}
          outcomeName={primaryMarket.outcomeName}
          image={primaryMarket.image}
          yesPrice={primaryMarket.yesPrice}
          noPrice={primaryMarket.noPrice}
          className="w-full shrink-0 lg:sticky lg:top-[calc(var(--navbar-height)+1rem)] lg:w-[340px]"
        />
      ) : null}
    </div>
  );
}
