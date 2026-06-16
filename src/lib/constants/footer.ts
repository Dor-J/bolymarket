/** Footer link with optional secondary label. */
export interface FooterLinkItem {
  label: string;
  href: string;
  secondaryLabel?: string;
  showChevron?: boolean;
}

/** Social icon entry for the footer utility row. */
export interface FooterSocialIcon {
  key: 'email' | 'x' | 'instagram' | 'discord' | 'tiktok';
  label: string;
  href: string;
}

/** Market topic columns for desktop (3 columns). */
export const FOOTER_TOPIC_COLUMNS_DESKTOP: FooterLinkItem[][] = [
  [
    { label: 'Commodities', href: '#', secondaryLabel: 'Predictions & odds' },
    { label: 'Peace Deal', href: '#', secondaryLabel: 'Predictions & odds' },
    { label: 'Claude Mythos', href: '#', secondaryLabel: 'Predictions & odds' },
    { label: 'June 23 Primaries', href: '#', secondaryLabel: 'Predictions & odds' },
    { label: 'Cuba', href: '#', secondaryLabel: 'Predictions & odds' },
  ],
  [
    { label: 'Trump', href: '#', secondaryLabel: 'Predictions & odds' },
    { label: 'June 16 Primaries', href: '#', secondaryLabel: 'Predictions & odds' },
    { label: 'Soccer Transfers', href: '#', secondaryLabel: 'Predictions & odds' },
    { label: 'Lebanon', href: '#', secondaryLabel: 'Predictions & odds' },
    { label: 'Privates', href: '#', secondaryLabel: 'Predictions & odds' },
  ],
  [
    { label: 'Iran', href: '#', secondaryLabel: 'Predictions & odds' },
    { label: 'SpaceX', href: '#', secondaryLabel: 'Predictions & odds' },
    { label: 'Daily Temperature', href: '#', secondaryLabel: 'Predictions & odds' },
    { label: 'FIFA World Cup', href: '#', secondaryLabel: 'Predictions & odds' },
    { label: 'View more', href: '#', showChevron: true },
  ],
];

/** Market topic columns for mobile (2 columns). */
export const FOOTER_TOPIC_COLUMNS_MOBILE: FooterLinkItem[][] = [
  [
    { label: 'Commodities', href: '#', secondaryLabel: 'Predictions & odds' },
    { label: 'Iran', href: '#', secondaryLabel: 'Predictions & odds' },
    { label: 'June 16 Primaries', href: '#', secondaryLabel: 'Predictions & odds' },
    { label: 'Claude Mythos', href: '#', secondaryLabel: 'Predictions & odds' },
    { label: 'Daily Temperature', href: '#', secondaryLabel: 'Predictions & odds' },
    { label: 'Lebanon', href: '#', secondaryLabel: 'Predictions & odds' },
    { label: 'Cuba', href: '#', secondaryLabel: 'Predictions & odds' },
    { label: 'View more', href: '#', showChevron: true },
  ],
  [
    { label: 'Trump', href: '#', secondaryLabel: 'Predictions & odds' },
    { label: 'Peace Deal', href: '#', secondaryLabel: 'Predictions & odds' },
    { label: 'SpaceX', href: '#', secondaryLabel: 'Predictions & odds' },
    { label: 'Soccer Transfers', href: '#', secondaryLabel: 'Predictions & odds' },
    { label: 'June 23 Primaries', href: '#', secondaryLabel: 'Predictions & odds' },
    { label: 'FIFA World Cup', href: '#', secondaryLabel: 'Predictions & odds' },
    { label: 'Privates', href: '#', secondaryLabel: 'Predictions & odds' },
  ],
];

/** Support & Social footer links. */
export const FOOTER_SUPPORT_SOCIAL_LINKS: FooterLinkItem[] = [
  { label: 'Learn', href: '#' },
  { label: '𝕏 (Twitter)', href: '#' },
  { label: 'Instagram', href: '#' },
  { label: 'Discord', href: '#' },
  { label: 'TikTok', href: '#' },
  { label: 'News', href: '#' },
  { label: 'Contact us', href: '#' },
  { label: 'Help Center', href: '#' },
  { label: 'Status', href: '#' },
];

/** Polymarket company footer links. */
export const FOOTER_POLYMARKET_LINKS: FooterLinkItem[] = [
  { label: 'Rewards', href: '#' },
  { label: 'APIs', href: '/api-docs' },
  { label: 'Leaderboard', href: '#' },
  { label: 'Accuracy', href: '#' },
  { label: 'Brand', href: '#' },
  { label: 'Activity', href: '#' },
  { label: 'Careers', href: '#' },
  { label: 'Press', href: '#' },
];

/** Legal links shown after the company name. */
export const FOOTER_LEGAL_LINKS: FooterLinkItem[] = [
  { label: 'Privacy', href: '#' },
  { label: 'Terms of Use', href: '#' },
  { label: 'Market Integrity', href: '#' },
  { label: 'Help Center', href: '#' },
  { label: 'Docs', href: '/api-docs' },
];

/** Social icons in the footer utility row. */
export const FOOTER_SOCIAL_ICONS: FooterSocialIcon[] = [
  { key: 'email', label: 'Email', href: '#' },
  { key: 'x', label: 'X', href: '#' },
  { key: 'instagram', label: 'Instagram', href: '#' },
  { key: 'discord', label: 'Discord', href: '#' },
  { key: 'tiktok', label: 'TikTok', href: '#' },
];

export const FOOTER_BRAND_SUBTITLE = "The World's Largest Prediction Market™";

export const FOOTER_COMPANY_LINE = 'Adventure One QSS Inc. © 2026';

export const FOOTER_DISCLAIMER =
  'Polymarket operates globally through separate legal entities. Polymarket US is operated by QCX LLC d/b/a Polymarket US, a CFTC-regulated Designated Contract Market. This international platform is not regulated by the CFTC and operates independently. Trading involves substantial risk of loss. See our Terms of Service & Privacy Policy.';

/** Height of the fixed mobile bottom nav for layout padding. */
export const MOBILE_BOTTOM_NAV_HEIGHT_PX = 56;
