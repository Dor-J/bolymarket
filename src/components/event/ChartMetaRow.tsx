import { formatDate } from "@/lib/format/date";
import { formatDetailVolume } from "@/lib/format/detailVolume";
import { TimeframeToggle } from "@/components/chart/TimeframeToggle";
import type { Timeframe } from "@/lib/chart/types";

export interface ChartMetaRowProps {
  volume: number;
  endDate?: string;
  timeframe: Timeframe;
  onTimeframeChange: (timeframe: Timeframe) => void;
}

function TrophyIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 18 18" fill="none" aria-hidden>
      <path
        d="M8.5 12.25S8.5 15.188 4.75 16.25h5.028M5.286 9C1.469 9 1.75 3.75 1.75 3.75h2.237M12.714 9c3.818 0 3.536-5.25 3.536-5.25h-2.237M14 1.75c-.625 6.531-2.281 10.219-4.75 10.5H8.75C6.281 11.969 4.625 8.281 4 1.75h10ZM14.213 12.25v5M16.713 14.75h-5"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
      />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 12 12" aria-hidden>
      <circle
        cx="6"
        cy="6"
        r="5.25"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
      />
      <path
        d="M6 3.25V6l2 1.75"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
      />
    </svg>
  );
}

function SortIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" aria-hidden>
      <path
        d="m10.25 12.75 2.5 2.5 2.5-2.5M12.75 15.25v-9M2.75 9.75h6.5M2.75 6.25h6.5M2.75 2.75h10"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
      />
    </svg>
  );
}

function SettingsIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" aria-hidden>
      <path
        d="M9 11.25A2.25 2.25 0 1 0 9 6.75a2.25 2.25 0 0 0 0 4.5Z"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
      />
      <path
        d="M16.25 9.35v-.71c0-.51-.38-.93-.89-.99l-1.09-.12-.5-1.22.68-.86a1 1 0 0 0-.07-1.33l-.5-.5a1 1 0 0 0-1.33-.07l-.86.69-1.22-.5-.12-1.1a1 1 0 0 0-.99-.89h-.71a1 1 0 0 0-.99.89l-.12 1.1-1.22.5-.86-.69a1 1 0 0 0-1.33.07l-.5.5a1 1 0 0 0-.07 1.33l.69.86-.5 1.22-1.1.12a1 1 0 0 0-.89.99v.71c0 .51.38.93.89.99l1.1.12.5 1.22-.69.86a1 1 0 0 0 .07 1.33l.5.5a1 1 0 0 0 1.33.07l.86-.69 1.22.5.12 1.1a1 1 0 0 0 .99.89h.71a1 1 0 0 0 .99-.89l.12-1.1 1.22-.5.86.69a1 1 0 0 0 1.33-.07l.5-.5a1 1 0 0 0 .07-1.33l-.68-.86.5-1.22 1.09-.12a1 1 0 0 0 .89-.99Z"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
      />
    </svg>
  );
}

/**
 * Volume, end-date, and chart controls below the price chart.
 */
export function ChartMetaRow({
  volume,
  endDate,
  timeframe,
  onTimeframeChange,
}: ChartMetaRowProps) {
  return (
    <div className="flex w-full flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
      <div className="flex items-center gap-x-2.5">
        <div className="flex items-center gap-1.5">
          <button type="button" className="flex items-center text-text-primary" aria-label="Rewards">
            <TrophyIcon />
          </button>
          <p className="text-[13px] font-medium tracking-[-0.09px] whitespace-nowrap text-text-primary">
            {formatDetailVolume(volume)}
          </p>
        </div>
        <div className="h-[10px] w-[1.5px] shrink-0 rounded-full bg-border" />
        <div className="flex items-center gap-1.5 whitespace-nowrap text-[13px] font-medium tracking-[-0.09px] text-text-secondary">
          <ClockIcon />
          <span>{formatDate(endDate)}</span>
        </div>
      </div>

      <div className="flex items-center gap-1 lg:ml-auto">
        <TimeframeToggle value={timeframe} onChange={onTimeframeChange} />
        <div className="ml-1 flex items-center gap-3">
          <button type="button" aria-label="Sort chart data" className="cursor-pointer text-text-secondary hover:text-text-primary">
            <SortIcon />
          </button>
          <button type="button" aria-label="Chart settings" className="cursor-pointer text-text-secondary hover:text-text-primary">
            <SettingsIcon />
          </button>
        </div>
      </div>
    </div>
  );
}
