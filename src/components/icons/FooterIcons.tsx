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
      xmlns="http://www.w3.org/2000/svg"
      width="12"
      height="12"
      viewBox="0 0 12 12"
      className={cn('h-3 w-3', className)}
      fill="none"
    >
      <polyline
        points="1.75 4.25 6 8.5 10.25 4.25"
        fill="none"
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
      xmlns="http://www.w3.org/2000/svg"
      width="18"
      height="18"
      viewBox="0 0 18 18"
      className={cn('h-4 w-4', className)}
      fill="none"
    >
      <ellipse
        cx="9"
        cy="9"
        rx="3"
        ry="7.25"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
      />
      <line
        x1="1.75"
        y1="9"
        x2="16.25"
        y2="9"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
      />
      <circle
        cx="9"
        cy="9"
        r="7.25"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
      />
    </svg>
  );
}

function EmailIcon({ className }: FooterIconProps) {
  return (
    <svg
      aria-hidden
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      className={cn('h-[18px] w-[18px] [&_path]:stroke-current', className)}
    >
      <g clipPath="url(#footer-email-clip)">
        <path
          d="M0.76001 5.85791L9.38444 10.6156C9.76806 10.8271 10.232 10.8271 10.6156 10.6156L19.24 5.85791"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M3.30897 17.3284L16.6911 17.3284C18.0988 17.3284 19.24 16.1872 19.24 14.7794V5.22077C19.24 3.81302 18.0988 2.67181 16.6911 2.67181L3.30897 2.67181C1.90122 2.67181 0.760006 3.81302 0.760006 5.22077V14.7794C0.760006 16.1872 1.90122 17.3284 3.30897 17.3284Z"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
      <defs>
        <clipPath id="footer-email-clip">
          <rect width="20" height="20" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
}

function XIcon({ className }: FooterIconProps) {
  return (
    <svg
      aria-hidden
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      className={cn('h-[18px] w-[18px] [&_path]:fill-current', className)}
    >
      <path
        d="M15.2719 1.58655H18.0831L11.9414 8.60612L19.1667 18.1582H13.5094L9.07837 12.3649L4.0083 18.1582H1.19537L7.76454 10.65L0.833344 1.58655H6.63427L10.6395 6.88182L15.2719 1.58655ZM14.2853 16.4755H15.843L5.78784 3.18082H4.11623L14.2853 16.4755Z"
        fill="currentColor"
      />
    </svg>
  );
}

function InstagramIcon({ className }: FooterIconProps) {
  return (
    <svg
      aria-hidden
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      className={cn('h-[18px] w-[18px] [&_path]:fill-current', className)}
    >
      <g clipPath="url(#footer-instagram-clip)">
        <path
          d="M10 1.80078C12.6719 1.80078 12.9883 1.8125 14.0391 1.85937C15.0156 1.90234 15.543 2.06641 15.8945 2.20313C16.3594 2.38281 16.6953 2.60156 17.043 2.94922C17.3945 3.30078 17.6094 3.63281 17.7891 4.09766C17.9258 4.44922 18.0898 4.98047 18.1328 5.95313C18.1797 7.00781 18.1914 7.32422 18.1914 9.99219C18.1914 12.6641 18.1797 12.9805 18.1328 14.0313C18.0898 15.0078 17.9258 15.5352 17.7891 15.8867C17.6094 16.3516 17.3906 16.6875 17.043 17.0352C16.6914 17.3867 16.3594 17.6016 15.8945 17.7813C15.543 17.918 15.0117 18.082 14.0391 18.125C12.9844 18.1719 12.668 18.1836 10 18.1836C7.32813 18.1836 7.01172 18.1719 5.96094 18.125C4.98438 18.082 4.45703 17.918 4.10547 17.7813C3.64063 17.6016 3.30469 17.3828 2.95703 17.0352C2.60547 16.6836 2.39063 16.3516 2.21094 15.8867C2.07422 15.5352 1.91016 15.0039 1.86719 14.0313C1.82031 12.9766 1.80859 12.6602 1.80859 9.99219C1.80859 7.32031 1.82031 7.00391 1.86719 5.95313C1.91016 4.97656 2.07422 4.44922 2.21094 4.09766C2.39063 3.63281 2.60938 3.29688 2.95703 2.94922C3.30859 2.59766 3.64063 2.38281 4.10547 2.20313C4.45703 2.06641 4.98828 1.90234 5.96094 1.85937C7.01172 1.8125 7.32813 1.80078 10 1.80078ZM10 0C7.28516 0 6.94531 0.0117187 5.87891 0.0585938C4.81641 0.105469 4.08594 0.277344 3.45313 0.523437C2.79297 0.78125 2.23438 1.12109 1.67969 1.67969C1.12109 2.23438 0.78125 2.79297 0.523438 3.44922C0.277344 4.08594 0.105469 4.8125 0.0585938 5.875C0.0117188 6.94531 0 7.28516 0 10C0 12.7148 0.0117188 13.0547 0.0585938 14.1211C0.105469 15.1836 0.277344 15.9141 0.523438 16.5469C0.78125 17.207 1.12109 17.7656 1.67969 18.3203C2.23438 18.875 2.79297 19.2188 3.44922 19.4727C4.08594 19.7188 4.8125 19.8906 5.875 19.9375C6.94141 19.9844 7.28125 19.9961 9.99609 19.9961C12.7109 19.9961 13.0508 19.9844 14.1172 19.9375C15.1797 19.8906 15.9102 19.7188 16.543 19.4727C17.1992 19.2188 17.7578 18.875 18.3125 18.3203C18.8672 17.7656 19.2109 17.207 19.4648 16.5508C19.7109 15.9141 19.8828 15.1875 19.9297 14.125C19.9766 13.0586 19.9883 12.7188 19.9883 10.0039C19.9883 7.28906 19.9766 6.94922 19.9297 5.88281C19.8828 4.82031 19.7109 4.08984 19.4648 3.45703C19.2188 2.79297 18.8789 2.23438 18.3203 1.67969C17.7656 1.125 17.207 0.78125 16.5508 0.527344C15.9141 0.28125 15.1875 0.109375 14.125 0.0625C13.0547 0.0117188 12.7148 0 10 0Z"
          fill="currentColor"
        />
        <path
          d="M10 4.86328C7.16406 4.86328 4.86328 7.16406 4.86328 10C4.86328 12.8359 7.16406 15.1367 10 15.1367C12.8359 15.1367 15.1367 12.8359 15.1367 10C15.1367 7.16406 12.8359 4.86328 10 4.86328ZM10 13.332C8.16016 13.332 6.66797 11.8398 6.66797 10C6.66797 8.16016 8.16016 6.66797 10 6.66797C11.8398 6.66797 13.332 8.16016 13.332 10C13.332 11.8398 11.8398 13.332 10 13.332Z"
          fill="currentColor"
        />
        <path
          d="M16.5391 4.66016C16.5391 5.32422 16 5.85938 15.3398 5.85938C14.6758 5.85938 14.1406 5.32031 14.1406 4.66016C14.1406 3.99609 14.6797 3.46094 15.3398 3.46094C16 3.46094 16.5391 4 16.5391 4.66016Z"
          fill="currentColor"
        />
      </g>
      <defs>
        <clipPath id="footer-instagram-clip">
          <rect width="20" height="20" fill="black" />
        </clipPath>
      </defs>
    </svg>
  );
}

function DiscordIcon({ className }: FooterIconProps) {
  return (
    <svg
      aria-hidden
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      className={cn('h-[18px] w-[18px] [&_path]:fill-current', className)}
    >
      <path
        d="M16.9308 3.46302C15.6561 2.87812 14.2892 2.44719 12.8599 2.20038C12.8339 2.19561 12.8079 2.20752 12.7945 2.23133C12.6187 2.544 12.4239 2.95192 12.2876 3.27254C10.7503 3.0424 9.22099 3.0424 7.71527 3.27254C7.57887 2.94479 7.37707 2.544 7.20048 2.23133C7.18707 2.20831 7.16107 2.19641 7.13504 2.20038C5.70659 2.4464 4.33963 2.87733 3.06411 3.46302C3.05307 3.46778 3.04361 3.47572 3.03732 3.48603C0.444493 7.35967 -0.265792 11.1381 0.0826501 14.8697C0.0842267 14.8879 0.0944749 14.9054 0.108665 14.9165C1.81934 16.1728 3.47642 16.9354 5.10273 17.441C5.12876 17.4489 5.15634 17.4394 5.1729 17.4179C5.55761 16.8926 5.90054 16.3387 6.19456 15.7561C6.21192 15.722 6.19535 15.6815 6.15989 15.668C5.61594 15.4617 5.098 15.2101 4.59978 14.9244C4.56037 14.9014 4.55721 14.845 4.59347 14.8181C4.69831 14.7395 4.80318 14.6578 4.9033 14.5752C4.92141 14.5601 4.94665 14.557 4.96794 14.5665C8.24107 16.0609 11.7846 16.0609 15.0191 14.5665C15.0404 14.5562 15.0657 14.5594 15.0846 14.5744C15.1847 14.657 15.2896 14.7395 15.3952 14.8181C15.4314 14.845 15.4291 14.9014 15.3897 14.9244C14.8914 15.2157 14.3735 15.4617 13.8288 15.6672C13.7933 15.6807 13.7775 15.722 13.7949 15.7561C14.0952 16.3378 14.4381 16.8918 14.8157 17.4172C14.8315 17.4394 14.8599 17.4489 14.8859 17.441C16.5201 16.9354 18.1772 16.1728 19.8879 14.9165C19.9028 14.9054 19.9123 14.8887 19.9139 14.8705C20.3309 10.5563 19.2154 6.80891 16.9568 3.48682C16.9513 3.47572 16.9419 3.46778 16.9308 3.46302ZM6.68335 12.5975C5.69792 12.5975 4.88594 11.6928 4.88594 10.5818C4.88594 9.47068 5.68217 8.56598 6.68335 8.56598C7.69239 8.56598 8.49651 9.47862 8.48073 10.5818C8.48073 11.6928 7.68451 12.5975 6.68335 12.5975ZM13.329 12.5975C12.3435 12.5975 11.5316 11.6928 11.5316 10.5818C11.5316 9.47068 12.3278 8.56598 13.329 8.56598C14.338 8.56598 15.1421 9.47862 15.1264 10.5818C15.1264 11.6928 14.338 12.5975 13.329 12.5975Z"
        fill="currentColor"
      />
    </svg>
  );
}

function TikTokIcon({ className }: FooterIconProps) {
  return (
    <svg
      aria-hidden
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      className={cn('h-[18px] w-[18px] [&_path]:fill-current', className)}
    >
      <path
        d="M14.2271 0H10.8565V13.6232C10.8565 15.2464 9.56018 16.5797 7.94691 16.5797C6.33363 16.5797 5.03726 15.2464 5.03726 13.6232C5.03726 12.029 6.30483 10.7246 7.8605 10.6667V7.24639C4.43229 7.30433 1.66669 10.1159 1.66669 13.6232C1.66669 17.1594 4.4899 20 7.97573 20C11.4615 20 14.2847 17.1304 14.2847 13.6232V6.63767C15.5523 7.56522 17.1079 8.11594 18.75 8.14494V4.72464C16.2149 4.63768 14.2271 2.55072 14.2271 0Z"
        fill="currentColor"
      />
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
