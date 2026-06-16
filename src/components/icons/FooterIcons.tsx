import { cn } from '@/lib/cn';
import type { FooterSocialIcon } from '@/lib/constants/footer';

export interface FooterIconProps {
  className?: string;
}

/**
 * Up arrow used in the mobile Back to top pill — matches polymarket.com SVG.
 */
export function BackToTopArrowIcon({ className }: FooterIconProps) {
  return (
    <svg
      aria-hidden
      xmlns="http://www.w3.org/2000/svg"
      width="12"
      height="12"
      viewBox="0 0 12 12"
      className={className}
    >
      <line
        x1="6"
        y1="11"
        x2="6"
        y2="1.25"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
      />
      <polyline
        points="9.25 4.25 6 1 2.75 4.25"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
      />
    </svg>
  );
}

export function FooterChevronDownIcon({ className }: FooterIconProps) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 12 12"
      className={cn('h-3 w-3', className)}
      fill="none"
    >
      <path
        d="M2.5 4.5L6 8l3.5-3.5"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
      />
    </svg>
  );
}

export function FooterGlobeIcon({ className }: FooterIconProps) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 16 16"
      className={cn('h-4 w-4', className)}
      fill="none"
    >
      <circle cx="8" cy="8" r="6.25" stroke="currentColor" strokeWidth="1.25" />
      <path
        d="M2.25 8h11.5M8 2.25c1.75 1.75 2.75 4.1 2.75 5.75S9.75 12 8 13.75C6.25 12 5.25 9.65 5.25 8S6.25 4 8 2.25z"
        stroke="currentColor"
        strokeWidth="1.25"
      />
    </svg>
  );
}

function EmailIcon({ className }: FooterIconProps) {
  return (
    <svg aria-hidden viewBox="0 0 16 16" className={cn('h-4 w-4', className)} fill="none">
      <rect
        x="2"
        y="3.5"
        width="12"
        height="9"
        rx="1.25"
        stroke="currentColor"
        strokeWidth="1.25"
      />
      <path
        d="M2.75 4.75L8 9l5.25-4.25"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.25"
      />
    </svg>
  );
}

function XIcon({ className }: FooterIconProps) {
  return (
    <svg aria-hidden viewBox="0 0 16 16" className={cn('h-4 w-4', className)} fill="currentColor">
      <path d="M9.52 7.13L13.28 2.5h-1.28l-3.27 4.01L6.4 2.5H2.5l3.93 5.72L2.5 13.5h1.28l3.45-4.22 2.76 4.22h3.9l-4.07-5.9zm-1.22 1.49l-.4-.57-3.1-4.44h1.34l2.5 3.57.4.57 3.25 4.65H9.1l-2.8-3.98z" />
    </svg>
  );
}

function InstagramIcon({ className }: FooterIconProps) {
  return (
    <svg aria-hidden viewBox="0 0 16 16" className={cn('h-4 w-4', className)} fill="none">
      <rect
        x="2.5"
        y="2.5"
        width="11"
        height="11"
        rx="3"
        stroke="currentColor"
        strokeWidth="1.25"
      />
      <circle cx="8" cy="8" r="2.5" stroke="currentColor" strokeWidth="1.25" />
      <circle cx="11.25" cy="4.75" r="0.75" fill="currentColor" />
    </svg>
  );
}

function DiscordIcon({ className }: FooterIconProps) {
  return (
    <svg aria-hidden viewBox="0 0 16 16" className={cn('h-4 w-4', className)} fill="currentColor">
      <path d="M13.55 3.35A10.9 10.9 0 0 0 10.6 2.5a8.2 8.2 0 0 0-.4.82 10.1 10.1 0 0 0-3.2 0 7.8 7.8 0 0 0-.4-.82 10.86 10.86 0 0 0-2.95.85A11.2 11.2 0 0 0 1.5 11.1a10.9 10.9 0 0 0 3.34 1.68 8.3 8.3 0 0 0 .72-1.17 7.1 7.1 0 0 1-1.14-.55c.1-.07.2-.15.29-.22a7.8 7.8 0 0 0 6.68 0c.1.08.2.15.29.22a7.1 7.1 0 0 1-1.14.55c.22.42.45.81.72 1.17a10.9 10.9 0 0 0 3.34-1.68 11.15 11.15 0 0 0-1.65-7.75zM6.1 9.55c-.66 0-1.2-.61-1.2-1.36s.53-1.36 1.2-1.36c.67 0 1.21.61 1.2 1.36 0 .75-.53 1.36-1.2 1.36zm3.8 0c-.66 0-1.2-.61-1.2-1.36s.53-1.36 1.2-1.36c.67 0 1.21.61 1.2 1.36 0 .75-.53 1.36-1.2 1.36z" />
    </svg>
  );
}

function TikTokIcon({ className }: FooterIconProps) {
  return (
    <svg aria-hidden viewBox="0 0 16 16" className={cn('h-4 w-4', className)} fill="currentColor">
      <path d="M11.2 2.5c.2 1.45 1.05 2.55 2.55 2.75v2.05a4.7 4.7 0 0 1-2.55-.75v4.45a3.55 3.55 0 1 1-3.55-3.55c.2 0 .4.02.6.05v2.15a1.45 1.45 0 1 0 1.02 1.38V2.5h1.93z" />
    </svg>
  );
}

/** Renders a footer social icon by key. */
export function FooterSocialIconGlyph({
  icon,
  className,
}: {
  icon: FooterSocialIcon['key'];
  className?: string;
}) {
  switch (icon) {
    case 'email':
      return <EmailIcon className={className} />;
    case 'x':
      return <XIcon className={className} />;
    case 'instagram':
      return <InstagramIcon className={className} />;
    case 'discord':
      return <DiscordIcon className={className} />;
    case 'tiktok':
      return <TikTokIcon className={className} />;
    default:
      return null;
  }
}

/** Home icon for mobile bottom nav. */
export function MobileNavHomeIcon({ className }: FooterIconProps) {
  return (
    <svg aria-hidden viewBox="0 0 20 20" className={cn('h-5 w-5', className)} fill="none">
      <path
        d="M3.5 8.25 10 3l6.5 5.25V16a1 1 0 0 1-1 1h-4.25v-4.5H8.75V17H4.5a1 1 0 0 1-1-1V8.25z"
        stroke="currentColor"
        strokeLinejoin="round"
        strokeWidth="1.5"
      />
    </svg>
  );
}

/** Search icon for mobile bottom nav. */
export function MobileNavSearchIcon({ className }: FooterIconProps) {
  return (
    <svg aria-hidden viewBox="0 0 20 20" className={cn('h-5 w-5', className)} fill="none">
      <circle cx="9" cy="9" r="5.25" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="m13.75 13.75 3 3"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="1.5"
      />
    </svg>
  );
}

/** Breaking icon for mobile bottom nav. */
export function MobileNavBreakingIcon({ className }: FooterIconProps) {
  return (
    <svg aria-hidden viewBox="0 0 20 20" className={cn('h-5 w-5', className)} fill="none">
      <circle cx="10" cy="10" r="7.25" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M7 10.5 9 8.5l2 2 2-2.5"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
      />
    </svg>
  );
}

/** More icon for mobile bottom nav. */
export function MobileNavMoreIcon({ className }: FooterIconProps) {
  return (
    <svg aria-hidden viewBox="0 0 20 20" className={cn('h-5 w-5', className)} fill="none">
      <path
        d="M4 6h12M4 10h12M4 14h12"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="1.5"
      />
    </svg>
  );
}
