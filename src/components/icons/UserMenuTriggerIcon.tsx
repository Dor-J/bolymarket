import { cn } from '@/lib/cn';

export interface UserMenuTriggerIconProps {
  className?: string;
}

/**
 * Polymarket hamburger trigger — menu lines with globe badge overlay.
 */
export function UserMenuTriggerIcon({ className }: UserMenuTriggerIconProps) {
  return (
    <div className={cn('relative', className)}>
      <svg
        aria-hidden
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 18 18"
        className="h-[18px] w-6 text-text"
        fill="currentColor"
      >
        <path d="M15.75,9.75H2.25c-.414,0-.75-.336-.75-.75s.336-.75,.75-.75H15.75c.414,0,.75,.336,.75,.75s-.336,.75-.75,.75Z" />
        <path d="M15.75,4.5H2.25c-.414,0-.75-.336-.75-.75s.336-.75,.75-.75H15.75c.414,0,.75,.336,.75,.75s-.336,.75-.75,.75Z" />
        <path d="M15.75,15H2.25c-.414,0-.75-.336-.75-.75s.336-.75,.75-.75H15.75c.414,0,.75,.336,.75,.75s-.336,.75-.75,.75Z" />
      </svg>

      <div
        className={cn(
          'absolute -right-1 -bottom-1 rounded-full bg-surface p-px',
          'transition-colors duration-200 group-hover:bg-surface-2',
        )}
      >
        <svg
          aria-hidden
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 18 18"
          className="size-3.5 text-brand"
          fill="currentColor"
        >
          <path d="M16.25,8.25h-3.517c-.157-3.641-1.454-7.25-3.733-7.25s-3.576,3.609-3.733,7.25H1.75v1.5h3.517c.157,3.641,1.454,7.25,3.733,7.25s3.576-3.609,3.733-7.25h3.517v-1.5ZM9,2.5c.858,0,2.079,2.216,2.233,5.75H6.767c.154-3.534,1.375-5.75,2.233-5.75Zm0,13c-.858,0-2.079-2.216-2.233-5.75h4.467c-.154,3.534-1.375,5.75-2.233,5.75Z" />
          <path d="M9,17c-4.411,0-8-3.589-8-8S4.589,1,9,1s8,3.589,8,8-3.589,8-8,8Zm0-14.5c-3.584,0-6.5,2.916-6.5,6.5s2.916,6.5,6.5,6.5,6.5-2.916,6.5-6.5-2.916-6.5-6.5-6.5Z" />
        </svg>
      </div>
    </div>
  );
}
