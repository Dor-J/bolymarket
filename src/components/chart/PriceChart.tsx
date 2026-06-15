"use client";

import { useMemo } from "react";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { getOutcomeColor } from "@/lib/chart/colors";
import { generateChartData } from "@/lib/chart/generateChartData";
import type { ChartOutcome, Timeframe } from "@/lib/chart/types";
import { formatPercent } from "@/lib/format/price";
import { cn } from "@/lib/cn";

export interface PriceChartProps {
  outcomes: ChartOutcome[];
  eventId: string;
  timeframe: Timeframe;
  className?: string;
}

/**
 * Multi-line price chart with simulated historical data.
 */
export function PriceChart({
  outcomes,
  eventId,
  timeframe,
  className,
}: PriceChartProps) {
  const chartData = useMemo(
    () =>
      generateChartData(
        outcomes.map((outcome) => ({
          id: outcome.id,
          name: outcome.name,
          price: outcome.price,
        })),
        timeframe,
        eventId,
      ),
    [eventId, outcomes, timeframe],
  );

  if (outcomes.length === 0) {
    return null;
  }

  return (
    <div className={cn("relative w-full", className)}>
      <div className="pointer-events-none absolute right-4 top-1/2 z-10 -translate-y-1/2 text-xs font-semibold tracking-[0.2em] text-[#aeb4bc]/40 uppercase">
        bolymarket
      </div>

      <div className="h-[240px] w-full lg:h-[400px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={chartData}
            margin={{ top: 8, right: 8, left: 0, bottom: 0 }}
          >
            <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" />
            <XAxis
              dataKey="label"
              tick={{ fill: "#77808d", fontSize: 12 }}
              axisLine={false}
              tickLine={false}
              minTickGap={24}
            />
            <YAxis
              orientation="right"
              domain={[0, 1]}
              tickFormatter={(value: number) => formatPercent(value)}
              tick={{ fill: "#77808d", fontSize: 12 }}
              axisLine={false}
              tickLine={false}
              width={48}
            />
            <Tooltip
              formatter={(value, name) => {
                const numericValue =
                  typeof value === "number" ? value : Number(value ?? 0);
                const seriesName = String(name);
                const outcome = outcomes.find((item) => item.id === seriesName);

                return [
                  formatPercent(numericValue),
                  outcome?.name ?? seriesName,
                ];
              }}
              labelFormatter={(label) => String(label)}
              contentStyle={{
                borderRadius: "8px",
                borderColor: "var(--border)",
                background: "var(--card)",
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
