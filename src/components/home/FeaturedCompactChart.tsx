'use client';

import { useMemo } from 'react';
import { useQueries } from '@tanstack/react-query';
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from 'recharts';
import { getOutcomeColor } from '@/lib/chart/colors';
import { generateChartData } from '@/lib/chart/generateChartData';
import { mergeChartSeries } from '@/lib/api/clob';
import { priceHistoryQueryOptions } from '@/lib/api/queries';
import type { ChartOutcome } from '@/lib/chart/types';
import { formatPercent } from '@/lib/format/price';
import { useLiveChartOutcomes } from '@/hooks/useLiveChartOutcomes';
import { cn } from '@/lib/cn';

export interface FeaturedCompactChartProps {
  outcomes: ChartOutcome[];
  eventId: string;
  className?: string;
}

/**
 * Compact featured preview chart with live last-point updates from WebSocket ticks.
 */
export function FeaturedCompactChart({
  outcomes,
  eventId,
  className,
}: FeaturedCompactChartProps) {
  const liveOutcomes = useLiveChartOutcomes(outcomes);
  const timeframe = '1d' as const;

  const historyQueries = useQueries({
    queries: liveOutcomes.map((outcome) =>
      priceHistoryQueryOptions(outcome.id, timeframe),
    ),
  });

  const chartData = useMemo(() => {
    const allFailedOrEmpty = historyQueries.every(
      (query) =>
        query.isError ||
        !query.data ||
        (Array.isArray(query.data) && query.data.length === 0),
    );

    let merged;

    if (allFailedOrEmpty) {
      merged = generateChartData(
        liveOutcomes.map((outcome) => ({
          id: outcome.id,
          name: outcome.name,
          price: outcome.price,
        })),
        timeframe,
        eventId,
      );
    } else {
      const series = historyQueries.map((query) => query.data ?? []);
      merged = mergeChartSeries(
        series,
        liveOutcomes.map((outcome) => outcome.id),
      );

      if (merged.length === 0) {
        merged = generateChartData(
          liveOutcomes.map((outcome) => ({
            id: outcome.id,
            name: outcome.name,
            price: outcome.price,
          })),
          timeframe,
          eventId,
        );
      }
    }

    if (merged.length === 0) {
      return merged;
    }

    const next = merged.map((point) => ({ ...point }));
    const lastPoint = next[next.length - 1];

    if (lastPoint) {
      for (const outcome of liveOutcomes) {
        lastPoint[outcome.id] = outcome.price;
      }
    }

    return next;
  }, [eventId, historyQueries, liveOutcomes, timeframe]);

  if (liveOutcomes.length === 0) {
    return null;
  }

  return (
    <div className={cn('relative w-full', className)}>
      <div className="mb-2 flex flex-wrap gap-x-3 gap-y-1">
        {liveOutcomes.map((outcome, index) => (
          <div
            key={outcome.id}
            className="inline-flex items-center gap-1.5 text-xs text-text-secondary"
          >
            <span
              className="size-2 rounded-full"
              style={{
                backgroundColor: outcome.color ?? getOutcomeColor(index),
              }}
              aria-hidden
            />
            <span>{outcome.name}</span>
            <span className="font-semibold text-text">
              {formatPercent(outcome.price)}
            </span>
          </div>
        ))}
      </div>

      <div className="h-[200px] w-full lg:h-[240px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={chartData}
            margin={{ top: 4, right: 4, left: 0, bottom: 0 }}
          >
            <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" />
            <XAxis
              dataKey="label"
              tick={{ fill: 'var(--neutral-500)', fontSize: 11 }}
              axisLine={false}
              tickLine={false}
              minTickGap={28}
            />
            <YAxis
              orientation="right"
              domain={[0, 1]}
              tickFormatter={(value: number) => formatPercent(value)}
              tick={{ fill: 'var(--neutral-500)', fontSize: 11 }}
              axisLine={false}
              tickLine={false}
              width={40}
            />
            {liveOutcomes.map((outcome, index) => (
              <Line
                key={outcome.id}
                type="monotone"
                dataKey={outcome.id}
                stroke={outcome.color ?? getOutcomeColor(index)}
                strokeWidth={2}
                dot={false}
                isAnimationActive={false}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
