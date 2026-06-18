import { CRYPTO_TOPIC_CHIPS } from "@/lib/markets/constants";

export type CryptoNavIcon =
  | "all"
  | "fiveMin"
  | "fifteenMin"
  | "hourly"
  | "fourHours"
  | "daily"
  | "weekly"
  | "monthly"
  | "preMarket"
  | "etf";

export interface CryptoNavItem {
  id: string;
  label: string;
  href: string;
  icon?: CryptoNavIcon;
  token?: {
    symbol: string;
    className: string;
  };
}

export const CRYPTO_TIME_NAV_ITEMS: CryptoNavItem[] = [
  { id: "all", label: "All", href: "/crypto", icon: "all" },
  { id: "5min", label: "5 Min", href: "/crypto/5M", icon: "fiveMin" },
  { id: "15min", label: "15 Min", href: "/crypto/15M", icon: "fifteenMin" },
  { id: "1hour", label: "1 Hour", href: "/crypto/hourly", icon: "hourly" },
  { id: "4hours", label: "4 Hours", href: "/crypto/4hour", icon: "fourHours" },
  { id: "daily", label: "Daily", href: "/crypto/daily", icon: "daily" },
  { id: "weekly", label: "Weekly", href: "/crypto/weekly", icon: "weekly" },
  { id: "monthly", label: "Monthly", href: "/crypto/monthly", icon: "monthly" },
  { id: "yearly", label: "Yearly", href: "/crypto/yearly", icon: "daily" },
  {
    id: "pre-market",
    label: "Pre-Market",
    href: "/crypto/pre-market",
    icon: "preMarket",
  },
  { id: "etf", label: "ETF", href: "/crypto/etf", icon: "etf" },
];

export const CRYPTO_ASSET_NAV_ITEMS: CryptoNavItem[] = [
  {
    id: "bitcoin",
    label: "Bitcoin",
    href: "/crypto/bitcoin",
    token: { symbol: "B", className: "bg-[#F7931A] text-white" },
  },
  {
    id: "ethereum",
    label: "Ethereum",
    href: "/crypto/ethereum",
    token: { symbol: "E", className: "bg-[#627EEA] text-white" },
  },
  {
    id: "solana",
    label: "Solana",
    href: "/crypto/solana",
    token: { symbol: "S", className: "bg-[#14F195] text-black" },
  },
  {
    id: "xrp",
    label: "XRP",
    href: "/crypto/xrp",
    token: { symbol: "X", className: "bg-black text-white" },
  },
  {
    id: "dogecoin",
    label: "Dogecoin",
    href: "/crypto/dogecoin",
    token: { symbol: "D", className: "bg-[#C2A633] text-white" },
  },
  {
    id: "bnb",
    label: "BNB",
    href: "/crypto/bnb",
    token: { symbol: "B", className: "bg-[#F3BA2F] text-black" },
  },
  {
    id: "microstrategy",
    label: "Microstrategy",
    href: "/crypto/microstrategy",
    token: { symbol: "M", className: "bg-[#D9232E] text-white" },
  },
];

const CRYPTO_TOPIC_IDS = new Set(CRYPTO_TOPIC_CHIPS.map((chip) => chip.id));

/**
 * Guards static crypto nav ids against filter ids used by the data layer.
 */
export function isCryptoTopicId(id: string): boolean {
  return CRYPTO_TOPIC_IDS.has(id);
}
