import { formatDate } from '@/lib/format/date';
import { formatDetailVolume } from '@/lib/format/detailVolume';

export interface ChartMetaRowProps {
  volume: number;
  endDate?: string;
}

/**
 * Volume and end-date meta row below the price chart.
 */
export function ChartMetaRow({ volume, endDate }: ChartMetaRowProps) {
  return (
    <div className="flex items-center justify-between gap-4 text-[13px] leading-4 font-medium text-[#aeb4bc]">
      <p>{formatDetailVolume(volume)}</p>
      <p>{formatDate(endDate)}</p>
    </div>
  );
}
