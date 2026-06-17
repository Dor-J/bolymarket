import Link from 'next/link';
import { HOT_TOPICS } from '@/lib/constants/hotTopics';
import { cn } from '@/lib/cn';

function HotTopicFlameIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="18px"
      height="18px"
      viewBox="0 0 18 18"
      className={className}
      aria-hidden
    >
      <path
        d="M9.493,1.185c-.282-.246-.703-.246-.985,0-.235,.205-5.757,5.067-5.757,9.548,0,3.456,2.804,6.267,6.25,6.267s6.25-2.812,6.25-6.267C15.25,6.252,9.728,1.389,9.493,1.185Zm-.493,14.315c-1.523,0-2.762-1.242-2.762-2.769,0-1.822,2.037-3.65,2.27-3.852,.282-.246,.703-.246,.985,0,.232,.202,2.27,2.03,2.27,3.852,0,1.526-1.239,2.769-2.762,2.769Z"
        fill="currentColor"
      />
    </svg>
  );
}

function ChevronRightSmallIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="12px"
      height="12px"
      viewBox="0 0 12 12"
      className={className}
      aria-hidden
    >
      <polyline
        points="4.25 10.25 8.5 6 4.25 1.75"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
      />
    </svg>
  );
}

function ChevronRightMediumIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="18px"
      height="18px"
      viewBox="0 0 18 18"
      className={className}
      aria-hidden
    >
      <path
        d="M13.28,8.47L7.03,2.22c-.293-.293-.768-.293-1.061,0s-.293,.768,0,1.061l5.72,5.72-5.72,5.72c-.293,.293-.293,.768,0,1.061,.146,.146,.338,.22,.53,.22s.384-.073,.53-.22l6.25-6.25c.293-.293,.293-.768,0-1.061Z"
        fill="currentColor"
      />
    </svg>
  );
}

export interface HomeHotTopicsPanelProps {
  className?: string;
}

/**
 * Scrollable ranked hot topics list for the home page sidebar.
 */
export function HomeHotTopicsPanel({ className }: HomeHotTopicsPanelProps) {
  return (
    <div className={cn('rounded-lg flex flex-col gap-3', className)}>
      <Link
        href="/predictions?_sort=volume"
        className="group flex items-center gap-1 hover:underline"
      >
        <h2 className="text-[18px] font-[580] text-text">Hot topics</h2>
        <ChevronRightMediumIcon className="size-3.5 text-text-secondary transition-colors group-hover:text-text" />
      </Link>

      <div className="flex flex-col">
        {HOT_TOPICS.map((topic) => (
          <Link
            key={topic.label}
            href={topic.href}
            className="group flex items-start gap-4 py-2.5"
          >
            <div className="text-sm font-semibold text-text-tertiary tabular-nums">
              {topic.rank}
            </div>
            <div className="flex w-full items-center justify-between gap-2">
              <div className="flex flex-1 items-center justify-between gap-1.5">
                <div className="text-base font-medium text-text group-hover:underline">
                  {topic.label}
                </div>
                <div className="flex items-center gap-2 text-sm text-text-secondary">
                  <span className="font-medium">
                    {topic.volumeLabel} today
                  </span>
                  <HotTopicFlameIcon className="size-3.5 text-red-500" />
                </div>
              </div>
              <ChevronRightSmallIcon className="text-text-tertiary" />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
