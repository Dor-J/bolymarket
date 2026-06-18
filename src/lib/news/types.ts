/** News article shape returned by related-news providers. */
export interface NewsArticle {
  title: string;
  link: string;
  og?: string;
  source?: string;
  source_icon?: string;
  publishedAt?: string;
  provider?: 'gdelt' | 'oksurf';
}

/** Ranked article with relevance score for featured preview display. */
export interface RankedNewsArticle extends NewsArticle {
  score: number;
}

/** Input used to rank headlines against an event. */
export interface RelatedNewsInput {
  title: string;
  category?: string;
  tags: string[];
  marketQuestions?: string[];
}
