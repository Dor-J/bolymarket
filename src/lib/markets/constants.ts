import type { TopicChip, MarketTypeTab } from './types';
import { createKeywordMatcher } from './topicMatchers';

/** Initial visible market count on desktop. */
export const INITIAL_MARKETS_DESKTOP = 24;

/** Initial visible market count on mobile. */
export const INITIAL_MARKETS_MOBILE = 12;

/** Increment when "Show more markets" is clicked. */
export const MARKETS_PAGE_SIZE = 24;

/** Home trending topic chips. */
export const HOME_TOPIC_CHIPS: TopicChip[] = [
  { id: 'all', label: 'All', match: () => true },
  { id: 'trump', label: 'Trump', match: createKeywordMatcher(['trump']) },
  { id: 'bitcoin', label: 'Bitcoin', match: createKeywordMatcher(['bitcoin', 'btc']) },
  { id: 'sports', label: 'Sports', match: createKeywordMatcher(['sports', 'mlb', 'nba', 'nfl']) },
  { id: 'crypto', label: 'Crypto', match: createKeywordMatcher(['crypto', 'ethereum', 'solana']) },
  { id: 'politics', label: 'Politics', match: createKeywordMatcher(['politics', 'election', 'congress']) },
  { id: 'ai', label: 'AI', match: createKeywordMatcher([' ai ', 'artificial intelligence', 'openai']) },
  { id: 'breaking', label: 'Breaking', match: createKeywordMatcher(['breaking', 'today', 'this week']) },
];

/** Politics subcategory chips mirroring Polymarket labels. */
export const POLITICS_TOPIC_CHIPS: TopicChip[] = [
  { id: 'all', label: 'All', match: () => true },
  { id: 'trump', label: 'Trump', match: createKeywordMatcher(['trump']) },
  { id: 'trump-daily', label: 'Trump Daily', match: createKeywordMatcher(['trump daily']) },
  { id: 'midterms', label: 'Midterms', match: createKeywordMatcher(['midterm']) },
  { id: 'global-elections', label: 'Global Elections', match: createKeywordMatcher(['election']) },
  { id: 'primaries', label: 'Primaries', match: createKeywordMatcher(['primary', 'primaries']) },
  { id: 'congress', label: 'Congress', match: createKeywordMatcher(['congress', 'senate', 'house']) },
  { id: 'trump-cabinet', label: 'Trump Cabinet', match: createKeywordMatcher(['cabinet']) },
  { id: 'courts', label: 'Courts', match: createKeywordMatcher(['court', 'scotus', 'supreme']) },
  { id: 'epstein', label: 'Epstein', match: createKeywordMatcher(['epstein']) },
  { id: 'gov-shutdown', label: 'Gov Shutdown', match: createKeywordMatcher(['shutdown']) },
  { id: 'la-mayor', label: 'LA Mayor', match: createKeywordMatcher(['la mayor', 'los angeles mayor']) },
  { id: 'uk-elections', label: 'UK Elections', match: createKeywordMatcher(['uk election', 'britain']) },
  { id: 'us-election', label: 'US Election', match: createKeywordMatcher(['us election', 'presidential']) },
  { id: 'mayoral', label: 'Mayoral Elections', match: createKeywordMatcher(['mayor', 'mayoral']) },
  { id: 'south-korea', label: 'South Korea', match: createKeywordMatcher(['south korea', 'korea']) },
  { id: 'japan', label: 'Japan', match: createKeywordMatcher(['japan']) },
  { id: 'china', label: 'China', match: createKeywordMatcher(['china']) },
  { id: 'brazil', label: 'Brazil', match: createKeywordMatcher(['brazil']) },
  { id: 'canada', label: 'Canada', match: createKeywordMatcher(['canada']) },
  { id: 'venezuela', label: 'Venezuela', match: createKeywordMatcher(['venezuela']) },
  { id: 'turkey', label: 'Turkey', match: createKeywordMatcher(['turkey']) },
];

/** Crypto time/asset chips. */
export const CRYPTO_TOPIC_CHIPS: TopicChip[] = [
  { id: 'all', label: 'All', match: () => true },
  { id: '5min', label: '5 Min', match: createKeywordMatcher(['5 min', '5m', '5-minute']) },
  { id: '15min', label: '15 Min', match: createKeywordMatcher(['15 min', '15m']) },
  { id: '1hour', label: '1 Hour', match: createKeywordMatcher(['1 hour', '1h', 'hourly']) },
  { id: '4hours', label: '4 Hours', match: createKeywordMatcher(['4 hour', '4h']) },
  { id: 'daily', label: 'Daily', match: createKeywordMatcher(['daily', 'day']) },
  { id: 'weekly', label: 'Weekly', match: createKeywordMatcher(['weekly', 'week']) },
  { id: 'monthly', label: 'Monthly', match: createKeywordMatcher(['monthly', 'month', 'june', 'july']) },
  { id: 'yearly', label: 'Yearly', match: createKeywordMatcher(['yearly', 'year', '2026', '2027']) },
  { id: 'pre-market', label: 'Pre-Market', match: createKeywordMatcher(['pre-market', 'premarket']) },
  { id: 'etf', label: 'ETF', match: createKeywordMatcher(['etf']) },
  { id: 'bitcoin', label: 'Bitcoin', match: createKeywordMatcher(['bitcoin', 'btc']) },
  { id: 'ethereum', label: 'Ethereum', match: createKeywordMatcher(['ethereum', 'eth']) },
  { id: 'solana', label: 'Solana', match: createKeywordMatcher(['solana', 'sol']) },
  { id: 'xrp', label: 'XRP', match: createKeywordMatcher(['xrp', 'ripple']) },
  { id: 'dogecoin', label: 'Dogecoin', match: createKeywordMatcher(['dogecoin', 'doge']) },
  { id: 'bnb', label: 'BNB', match: createKeywordMatcher(['bnb', 'binance']) },
  { id: 'microstrategy', label: 'Microstrategy', match: createKeywordMatcher(['microstrategy', 'mstr']) },
];

/** Crypto market-type tabs. */
export const CRYPTO_MARKET_TYPE_TABS: MarketTypeTab[] = [
  { id: 'all', label: 'All', match: () => true },
  {
    id: 'up-down',
    label: 'Up / Down',
    match: createKeywordMatcher(['up or down', 'up/down', 'updown']),
  },
  {
    id: 'above-below',
    label: 'Above / Below',
    match: createKeywordMatcher(['above', 'below', 'blank']),
  },
  {
    id: 'price-range',
    label: 'Price Range',
    match: createKeywordMatcher(['price range', 'between']),
  },
  {
    id: 'hit-price',
    label: 'Hit Price',
    match: createKeywordMatcher(['hit', 'reach', 'price will']),
  },
];

/** Sports league section groupings. */
export const SPORTS_LEAGUE_SECTIONS = [
  { id: 'world-cup', label: 'WORLD CUP', keywords: ['world cup', 'fifa', 'fifwc'] },
  { id: 'mlb', label: 'MLB', keywords: ['mlb', 'baseball'] },
  { id: 'nba', label: 'NBA', keywords: ['nba', 'basketball'] },
  { id: 'nfl', label: 'NFL', keywords: ['nfl', 'football'] },
  { id: 'atp', label: 'ATP', keywords: ['atp', 'tennis'] },
  { id: 'wta', label: 'WTA', keywords: ['wta'] },
  { id: 'nhl', label: 'NHL', keywords: ['nhl', 'hockey'] },
  { id: 'soccer', label: 'SOCCER', keywords: ['soccer', 'premier league', 'la liga', 'mls'] },
] as const;

/** Sports filter chips for league rail. */
export const SPORTS_FILTER_CHIPS: TopicChip[] = [
  { id: 'all', label: 'All', match: () => true },
  ...SPORTS_LEAGUE_SECTIONS.map((section) => ({
    id: section.id,
    label: section.label,
    match: createKeywordMatcher(section.keywords),
  })),
];
