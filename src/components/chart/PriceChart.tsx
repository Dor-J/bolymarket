'use client';

import { useMemo } from 'react';
import { useQueries } from '@tanstack/react-query';
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { getOutcomeColor } from '@/lib/chart/colors';
import { generateChartData } from '@/lib/chart/generateChartData';
import { mergeChartSeries } from '@/lib/api/clob';
import { priceHistoryQueryOptions } from '@/lib/api/queries';
import type { ChartOutcome, Timeframe } from '@/lib/chart/types';
import {
  formatXAxisTick,
  getChartTimeSpan,
  getChartYDomain,
  getChartYTicks,
} from '@/lib/chart/axis';
import { formatPercent } from '@/lib/format/price';
import { cn } from '@/lib/cn';

export interface PriceChartProps {
  outcomes: ChartOutcome[];
  eventId: string;
  timeframe: Timeframe;
  className?: string;
}

/**
 * Multi-line price chart with real CLOB history and simulated fallback.
 */
export function PriceChart({
  outcomes,
  eventId,
  timeframe,
  className,
}: PriceChartProps) {
  const history = useQueries({
    queries: outcomes.map((outcome) =>
      priceHistoryQueryOptions(outcome.id, timeframe),
    ),
    combine: (results) => ({
      allFailedOrEmpty: results.every(
        (query) =>
          query.isError ||
          !query.data ||
          (Array.isArray(query.data) && query.data.length === 0),
      ),
      series: results.map((query) => query.data ?? []),
      signature: results
        .map((query) => {
          const first = query.data?.[0];
          const last = query.data?.[query.data.length - 1];
          return [
            query.isError ? 'error' : 'ok',
            query.data?.length ?? 0,
            first?.timestamp ?? '',
            last?.timestamp ?? '',
            last ? JSON.stringify(last) : '',
          ].join(':');
        })
        .join('|'),
    }),
  });
  const chartData = useMemo(() => {
    if (history.allFailedOrEmpty) {
      return generateChartData(
        outcomes.map((outcome) => ({
          id: outcome.id,
          name: outcome.name,
          price: outcome.price,
        })),
        timeframe,
        eventId,
      );
    }

    const merged = mergeChartSeries(
      history.series,
      outcomes.map((outcome) => outcome.id),
    );

    if (merged.length === 0) {
      return generateChartData(
        outcomes.map((outcome) => ({
          id: outcome.id,
          name: outcome.name,
          price: outcome.price,
        })),
        timeframe,
        eventId,
      );
    }

    const lastPoint = merged[merged.length - 1];
    if (!lastPoint) {
      return merged;
    }

    for (const outcome of outcomes) {
      lastPoint[outcome.id] = outcome.price;
    }

    return merged;
  }, [eventId, history, outcomes, timeframe]);

  const outcomeIds = useMemo(
    () => outcomes.map((outcome) => outcome.id),
    [outcomes],
  );
  const yDomain = useMemo(
    () => getChartYDomain(chartData, outcomeIds),
    [chartData, outcomeIds],
  );
  const yTicks = useMemo(() => getChartYTicks(yDomain), [yDomain]);
  const xSpanMs = useMemo(() => getChartTimeSpan(chartData), [chartData]);

  if (outcomes.length === 0) {
    return null;
  }

  return (
    <div className={cn('relative w-full', className)}>
      <div className="pointer-events-none absolute top-1/2 right-4 z-10 -translate-y-1/2 text-xs font-semibold tracking-[0.2em] text-neutral-300/40 uppercase">
        Bolymarket
      </div>

      <div className="h-[240px] w-full lg:h-[400px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={chartData}
            margin={{ top: 8, right: 8, left: 0, bottom: 0 }}
          >
            <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" />
            <XAxis
              dataKey="timestamp"
              type="number"
              domain={['dataMin', 'dataMax']}
              tickFormatter={(value: number | string) =>
                formatXAxisTick(value, timeframe, xSpanMs)
              }
              tick={{ fill: 'var(--neutral-500)', fontSize: 12 }}
              axisLine={false}
              tickLine={false}
              minTickGap={24}
            />
            <YAxis
              orientation="right"
              domain={yDomain}
              ticks={yTicks}
              tickFormatter={(value: number) => formatPercent(value)}
              tick={{ fill: 'var(--neutral-500)', fontSize: 12 }}
              axisLine={false}
              tickLine={false}
              width={48}
            />
            <Tooltip
              formatter={(value, name) => {
                const numericValue =
                  typeof value === 'number' ? value : Number(value ?? 0);
                const seriesName = String(name);
                const outcome = outcomes.find((item) => item.id === seriesName);

                return [
                  formatPercent(numericValue),
                  outcome?.name ?? seriesName,
                ];
              }}
              labelFormatter={(label) => formatXAxisTick(label, timeframe, xSpanMs)}
              contentStyle={{
                borderRadius: '8px',
                borderColor: 'var(--border)',
                background: 'var(--card)',
              }}
            />
            {outcomes.map((outcome, index) => (
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
