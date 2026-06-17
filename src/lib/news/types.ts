/** OkSurf news article shape returned by the public API. */
export interface NewsArticle {
  title: string;
  link: string;
  og?: string;
  source?: string;
  source_icon?: string;
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
