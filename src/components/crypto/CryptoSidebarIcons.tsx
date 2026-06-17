import type { SVGProps } from "react";
import type { CryptoNavIcon } from "@/lib/crypto/cryptoNav";

type IconProps = SVGProps<SVGSVGElement>;

function AllIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 18 18" fill="none" aria-hidden {...props}>
      <rect
        x="2.75"
        y="2.75"
        width="4.5"
        height="4.5"
        rx="1"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <rect
        x="10.75"
        y="2.75"
        width="4.5"
        height="4.5"
        rx="1"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <rect
        x="2.75"
        y="10.75"
        width="4.5"
        height="4.5"
        rx="1"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <rect
        x="10.75"
        y="10.75"
        width="4.5"
        height="4.5"
        rx="1"
        stroke="currentColor"
        strokeWidth="1.5"
      />
    </svg>
  );
}

function FiveMinIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 18 18" fill="none" aria-hidden {...props}>
      <path
        d="M2.75 9h7.5M5.75 13.75h7.5M7.75 4.25h7.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

function FifteenMinIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden {...props}>
      <path
        d="M22 12C22 6.477 17.523 2 12 2M12 12h5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="square"
      />
      {[
        [12, 22],
        [2, 12],
        [7, 20.66],
        [20.66, 17],
        [3.34, 7],
        [3.34, 17],
        [17, 20.66],
        [7, 3.34],
      ].map(([cx, cy]) => (
        <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r="1" fill="currentColor" />
      ))}
    </svg>
  );
}

function HourlyIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 18 18" fill="none" aria-hidden {...props}>
      <path
        d="M9 4.75V9l3.25 2.25"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M16.25 9.2A7.25 7.25 0 1 1 15.69 6.2M16.12 3.3l-.41 2.95-2.94-.41"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

function FourHoursIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 18 18" fill="none" aria-hidden {...props}>
      <circle cx="9" cy="9" r="7.25" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M9 4.75V9l3.25 2.25"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

function CalendarIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 18 18" fill="none" aria-hidden {...props}>
      <path
        d="M5.75 3.25v-2M12.25 3.25v-2M2.25 6.75h13.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <rect
        x="2.25"
        y="3.25"
        width="13.5"
        height="12.5"
        rx="2"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <path
        d="M9 8.75a1 1 0 1 0 0 2 1 1 0 0 0 0-2ZM12.5 8.75a1 1 0 1 0 0 2 1 1 0 0 0 0-2ZM5.5 11.75a1 1 0 1 0 0 2 1 1 0 0 0 0-2ZM9 11.75a1 1 0 1 0 0 2 1 1 0 0 0 0-2ZM12.5 11.75a1 1 0 1 0 0 2 1 1 0 0 0 0-2Z"
        fill="currentColor"
      />
    </svg>
  );
}

function WeeklyIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 18 18" fill="none" aria-hidden {...props}>
      <rect
        x="7.75"
        y="2.75"
        width="2.5"
        height="12.5"
        rx="1"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <rect
        x="2.25"
        y="7.75"
        width="2.5"
        height="7.5"
        rx="1"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <rect
        x="13.25"
        y="11.75"
        width="2.5"
        height="3.5"
        rx="1"
        stroke="currentColor"
        strokeWidth="1.5"
      />
    </svg>
  );
}

function MonthlyIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 18 18" fill="none" aria-hidden {...props}>
      <path
        d="m2 14 3-3.25 1 2.5 4-6.5 2 5.5L16 4"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function PreMarketIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 18 18" fill="none" aria-hidden {...props}>
      <path
        d="M12.25 3.25v11.5M2.25 11.25 5.5 8 8 10.5l4.25-4.25"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <rect
        x="2.25"
        y="3.25"
        width="13.5"
        height="11.5"
        rx="2"
        stroke="currentColor"
        strokeWidth="1.5"
      />
    </svg>
  );
}

function EtfIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 18 18" fill="none" aria-hidden {...props}>
      <path
        d="m4.75 12 1.75-2 1 1.25 2-3.5 1.5 2.5 2.25-4.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <rect
        x="1.75"
        y="2.75"
        width="14.5"
        height="12.5"
        rx="2"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <circle cx="4.25" cy="5.25" r=".75" fill="currentColor" />
      <circle cx="6.75" cy="5.25" r=".75" fill="currentColor" />
    </svg>
  );
}

const ICONS: Record<CryptoNavIcon, (props: IconProps) => React.ReactNode> = {
  all: AllIcon,
  fiveMin: FiveMinIcon,
  fifteenMin: FifteenMinIcon,
  hourly: HourlyIcon,
  fourHours: FourHoursIcon,
  daily: CalendarIcon,
  weekly: WeeklyIcon,
  monthly: MonthlyIcon,
  preMarket: PreMarketIcon,
  etf: EtfIcon,
};

export function CryptoSidebarIcon({
  icon,
  className,
}: {
  icon: CryptoNavIcon;
  className?: string;
}) {
  const Icon = ICONS[icon];

  return <Icon className={className} />;
}
