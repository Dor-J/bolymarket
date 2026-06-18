'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { useQueries } from '@tanstack/react-query';
import {
  CartesianGrid,
  Line,
  LineChart,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { getOutcomeColor } from '@/lib/chart/colors';
import { generateChartData } from '@/lib/chart/generateChartData';
import { mergeChartSeries } from '@/lib/api/clob';
import { priceHistoryQueryOptions } from '@/lib/api/queries';
import type { ChartOutcome, ChartPoint } from '@/lib/chart/types';
import {
  formatXAxisTick,
  getChartTimeSpan,
  getChartYDomain,
  getChartYTicks,
} from '@/lib/chart/axis';
import { formatPercent } from '@/lib/format/price';
import { useLiveChartOutcomes } from '@/hooks/useLiveChartOutcomes';
import { cn } from '@/lib/cn';

export interface FeaturedCompactChartProps {
  outcomes: ChartOutcome[];
  eventId: string;
  className?: string;
}

interface FeaturedTooltipPayload {
  color?: string;
  dataKey?: string | number;
  name?: string | number;
  value?: string | number;
  payload?: ChartPoint;
}

interface FeaturedChartTooltipProps {
  active?: boolean;
  label?: string | number;
  outcomes: ChartOutcome[];
  payload?: FeaturedTooltipPayload[];
}

function formatTooltipTimestamp(point: ChartPoint | undefined, label: string | number | undefined) {
  if (typeof point?.timestamp !== 'number') {
    return label ? String(label) : '';
  }

  return formatXAxisTick(point.timestamp, '1d', 24 * 60 * 60 * 1000);
}

function FeaturedChartTooltip({
  active,
  label,
  outcomes,
  payload,
}: FeaturedChartTooltipProps) {
  if (!active || !payload || payload.length === 0) {
    return null;
  }

  const point = payload[0]?.payload;
  const valuesByOutcomeId = new Map(
    payload.map((item) => [String(item.dataKey ?? item.name), item]),
  );
  const visibleItems = outcomes
    .map((outcome, index) => {
      const item = valuesByOutcomeId.get(outcome.id);
      const value = typeof item?.value === 'number' ? item.value : Number(item?.value);

      if (!Number.isFinite(value)) {
        return null;
      }

      return {
        color: item?.color ?? outcome.color ?? getOutcomeColor(index),
        name: outcome.name,
        value,
      };
    })
    .filter((item): item is { color: string; name: string; value: number } => item !== null);

  if (visibleItems.length === 0) {
    return null;
  }

  return (
    <div className="min-w-[170px] rounded-lg border border-border bg-background/95 px-3 py-2 text-xs shadow-lg backdrop-blur">
      <p className="mb-2 font-semibold text-text">
        {formatTooltipTimestamp(point, label)}
      </p>
      <div className="flex flex-col gap-1.5">
        {visibleItems.map((item) => (
          <div key={item.name} className="flex items-center justify-between gap-4">
            <span className="flex min-w-0 items-center gap-1.5 text-text-secondary">
              <span
                className="size-2 shrink-0 rounded-full"
                style={{ backgroundColor: item.color }}
                aria-hidden
              />
              <span className="truncate">{item.name}</span>
            </span>
            <span className="font-semibold text-text">{formatPercent(item.value)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * Compact featured preview chart with live last-point updates from WebSocket ticks.
 */
export function FeaturedCompactChart({
  outcomes,
  eventId,
  className,
}: FeaturedCompactChartProps) {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const [chartSize, setChartSize] = useState({ width: 0, height: 0 });
  const liveOutcomes = useLiveChartOutcomes(outcomes);
  const timeframe = '1d' as const;

  useEffect(() => {
    const element = chartContainerRef.current;
    if (!element) {
      return;
    }

    const updateSize = () => {
      const { width, height } = element.getBoundingClientRect();
      const nextWidth = Math.floor(width);
      const nextHeight = Math.floor(height);

      setChartSize((current) =>
        current.width === nextWidth && current.height === nextHeight
          ? current
          : { width: nextWidth, height: nextHeight },
      );
    };

    updateSize();

    const observer = new ResizeObserver(updateSize);
    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, []);

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

  const outcomeIds = useMemo(
    () => liveOutcomes.map((outcome) => outcome.id),
    [liveOutcomes],
  );
  const yDomain = useMemo(
    () => getChartYDomain(chartData, outcomeIds),
    [chartData, outcomeIds],
  );
  const yTicks = useMemo(() => getChartYTicks(yDomain), [yDomain]);
  const xSpanMs = useMemo(() => getChartTimeSpan(chartData), [chartData]);

  if (liveOutcomes.length === 0) {
    return null;
  }

  return (
    <div className={cn('relative w-full', className)}>
      <div className="mt-1.5">
        <div className="flex w-full gap-3">
          <div className="flex h-auto w-full flex-col justify-center gap-3">
            <div className="flex flex-col items-start gap-y-1 sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-3">
              {liveOutcomes.map((outcome, index) => (
                <div
                  key={outcome.id}
                  className="flex items-center gap-1.5 whitespace-nowrap"
                >
                  <span
                    className="size-2 rounded-full"
                    style={{
                      backgroundColor: outcome.color ?? getOutcomeColor(index),
                    }}
                    aria-hidden
                  />
                  <p className="text-body-sm text-text-secondary">
                    {outcome.name}
                    <span className="ml-0.5 font-semibold text-neutral-800 dark:text-text">
                      &nbsp;{formatPercent(outcome.price)}
                    </span>
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div
        ref={chartContainerRef}
        id="group-chart-container"
        className="mt-7 h-[200px] min-h-[200px] w-full min-w-0 lg:h-[240px] lg:min-h-[240px]"
      >
        {chartSize.width > 0 && chartSize.height > 0 ? (
          <LineChart
            width={chartSize.width}
            height={chartSize.height}
            data={chartData}
            margin={{ top: 4, right: 4, left: 0, bottom: 0 }}
          >
            <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" />
            <XAxis
              dataKey="timestamp"
              type="number"
              domain={['dataMin', 'dataMax']}
              tickFormatter={(value: number | string) =>
                formatXAxisTick(value, timeframe, xSpanMs)
              }
              tick={{ fill: 'var(--neutral-500)', fontSize: 11 }}
              axisLine={false}
              tickLine={false}
              minTickGap={28}
            />
            <YAxis
              orientation="right"
              domain={yDomain}
              ticks={yTicks}
              tickFormatter={(value: number) => formatPercent(value)}
              tick={{ fill: 'var(--neutral-500)', fontSize: 11 }}
              axisLine={false}
              tickLine={false}
              width={40}
            />
            <Tooltip
              cursor={{
                stroke: 'var(--neutral-400)',
                strokeDasharray: '4 4',
                strokeWidth: 1,
              }}
              content={(props) => (
                <FeaturedChartTooltip
                  active={props.active}
                  label={props.label}
                  outcomes={liveOutcomes}
                  payload={props.payload as FeaturedTooltipPayload[] | undefined}
                />
              )}
            />
            {liveOutcomes.map((outcome, index) => (
              <Line
                key={outcome.id}
                type="monotone"
                dataKey={outcome.id}
                stroke={outcome.color ?? getOutcomeColor(index)}
                strokeWidth={2}
                activeDot={{ r: 4, strokeWidth: 2 }}
                dot={false}
                connectNulls
                isAnimationActive={false}
              />
            ))}
          </LineChart>
        ) : null}
      </div>
    </div>
  );
}
