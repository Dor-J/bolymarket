import type { OpenAPIV3 } from 'openapi-types';

/** Reusable OpenAPI schema components for Bolymarket API responses. */
export const openApiSchemas: OpenAPIV3.ComponentsObject['schemas'] = {
  Outcome: {
    type: 'object',
    required: ['id', 'name', 'price'],
    properties: {
      id: {
        type: 'string',
        description: 'CLOB token id when available from Gamma.',
        example: '21742633143463906290569050155826241533067272736897614950488156847949938836455',
      },
      name: { type: 'string', example: 'Yes' },
      price: {
        type: 'number',
        format: 'float',
        minimum: 0,
        maximum: 1,
        description: 'Implied probability (0–1).',
        example: 0.42,
      },
    },
  },
  Market: {
    type: 'object',
    required: ['id', 'question', 'volume', 'outcomes'],
    properties: {
      id: { type: 'string', example: 'market-abc123' },
      question: {
        type: 'string',
        example: 'Will Bitcoin reach $100k by end of 2026?',
      },
      slug: { type: 'string', example: 'btc-100k-2026' },
      volume: {
        type: 'number',
        format: 'float',
        description: 'Total traded volume in USD.',
        example: 1250000,
      },
      outcomes: {
        type: 'array',
        items: { $ref: '#/components/schemas/Outcome' },
      },
    },
  },
  Event: {
    type: 'object',
    required: ['id', 'slug', 'title', 'tags', 'volume', 'markets'],
    properties: {
      id: { type: 'string', example: 'event-xyz789' },
      slug: { type: 'string', example: 'presidential-election-2028' },
      title: { type: 'string', example: 'Presidential Election Winner 2028' },
      description: { type: 'string' },
      image: {
        type: 'string',
        format: 'uri',
        example: 'https://polymarket-upload.s3.us-east-2.amazonaws.com/example.png',
      },
      category: { type: 'string', example: 'politics' },
      tags: {
        type: 'array',
        items: { type: 'string' },
        example: ['politics', 'elections'],
      },
      volume: { type: 'number', format: 'float', example: 5400000 },
      endDate: {
        type: 'string',
        format: 'date-time',
        example: '2028-11-05T00:00:00.000Z',
      },
      markets: {
        type: 'array',
        items: { $ref: '#/components/schemas/Market' },
      },
    },
  },
  ChartPoint: {
    type: 'object',
    required: ['timestamp', 'label'],
    properties: {
      timestamp: {
        type: 'integer',
        format: 'int64',
        description: 'Unix timestamp in milliseconds.',
        example: 1_704_067_200_000,
      },
      label: { type: 'string', example: 'Jan 1' },
    },
    additionalProperties: {
      type: 'number',
      description: 'Series values keyed by CLOB token id.',
    },
  },
  TradeActivityItem: {
    type: 'object',
    required: ['id', 'eventSlug', 'price', 'timestamp'],
    properties: {
      id: {
        type: 'string',
        description: 'Stable trade id, preferably transaction hash.',
        example: '0xdd22472e552920b8438158ea7238bfadfa4f736aa4cee91a6b86c39ead110917',
      },
      eventSlug: { type: 'string', example: 'world-cup-winner' },
      price: {
        type: 'number',
        format: 'float',
        minimum: 0,
        maximum: 1,
        example: 0.18,
      },
      side: { type: 'string', example: 'BUY' },
      timestamp: {
        type: 'integer',
        format: 'int64',
        example: 1_781_700_000,
      },
      assetId: {
        type: 'string',
        description: 'CLOB token id for the traded outcome.',
      },
      size: {
        type: 'number',
        format: 'float',
        description: 'USDC notional when provided by the Data API.',
        example: 260,
      },
      outcome: { type: 'string', example: 'France' },
      userName: { type: 'string', example: 'polyfan' },
      transactionHash: { type: 'string' },
    },
  },
  NewsArticle: {
    type: 'object',
    required: ['title', 'link', 'score'],
    properties: {
      title: {
        type: 'string',
        example: 'Anthropic restores access to advanced AI models',
      },
      link: {
        type: 'string',
        format: 'uri',
        example: 'https://example.com/anthropic-model-access',
      },
      source: { type: 'string', example: 'example.com' },
      og: {
        type: 'string',
        format: 'uri',
        description: 'Optional article preview image.',
      },
      source_icon: {
        type: 'string',
        format: 'uri',
        description: 'Optional source favicon URL.',
      },
      publishedAt: {
        type: 'string',
        description: 'Provider-specific article publication timestamp when available.',
        example: '20260614T070000Z',
      },
      provider: {
        type: 'string',
        enum: ['gdelt', 'oksurf'],
        description: 'Upstream related-news provider.',
      },
      score: {
        type: 'number',
        format: 'float',
        description: 'Local relevance score against the event context.',
        example: 8,
      },
    },
  },
  ErrorResponse: {
    type: 'object',
    required: ['error'],
    properties: {
      error: { type: 'string', example: 'Failed to load events' },
    },
  },
  CategoryTag: {
    type: 'string',
    enum: ['crypto', 'sports', 'politics'],
    example: 'crypto',
  },
  ChartTimeframe: {
    type: 'string',
    enum: ['1h', '6h', '1d', '1w', '1m', 'all'],
    default: '1d',
    example: '1d',
  },
};

export interface BuildOpenApiSpecOptions {
  /** Public origin, e.g. `http://localhost:3000`. */
  serverUrl: string;
}

/**
 * Builds the OpenAPI 3.0 specification for Bolymarket REST routes.
 */
export function buildOpenApiSpec({
  serverUrl,
}: BuildOpenApiSpecOptions): OpenAPIV3.Document {
  return {
    openapi: '3.0.3',
    info: {
      title: 'Bolymarket API',
      version: '1.0.0',
      description: [
        'Read-only REST API for the Bolymarket Polymarket-style frontend.',
        '',
        'All routes proxy and cache upstream Polymarket Gamma / CLOB data.',
        'Responses are normalized to Bolymarket domain types.',
        '',
        '**Note:** Trading, wallet, and authentication are out of scope.',
      ].join('\n'),
      contact: {
        name: 'bolymarket',
      },
      license: {
        name: 'MIT',
      },
    },
    servers: [
      {
        url: serverUrl,
        description: 'Current environment',
      },
    ],
    tags: [
      {
        name: 'Events',
        description: 'Open prediction events and markets (Gamma-backed, Redis-cached).',
      },
      {
        name: 'Prices',
        description: 'Historical outcome prices from the Polymarket CLOB API.',
      },
      {
        name: 'Trades',
        description: 'Recent public trade history from the Polymarket Data API.',
      },
      {
        name: 'News',
        description: 'Related event headlines from GDELT with OkSurf fallback.',
      },
    ],
    paths: {
      '/api/events': {
        get: {
          tags: ['Events'],
          summary: 'List open events',
          description:
            'Returns aggregated open events (trending + crypto + sports + politics) ' +
            'or a category-specific list when `tag` is provided.',
          operationId: 'listEvents',
          parameters: [
            {
              name: 'tag',
              in: 'query',
              required: false,
              schema: { $ref: '#/components/schemas/CategoryTag' },
              description: 'Optional category tag slug for dedicated category pages.',
            },
          ],
          responses: {
            '200': {
              description: 'List of open events.',
              headers: {
                'Cache-Control': {
                  schema: { type: 'string' },
                  example: 'public, s-maxage=60, stale-while-revalidate=120',
                },
              },
              content: {
                'application/json': {
                  schema: {
                    type: 'array',
                    items: { $ref: '#/components/schemas/Event' },
                  },
                },
              },
            },
            '500': {
              description: 'Server error.',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/ErrorResponse' },
                },
              },
            },
          },
        },
      },
      '/api/events/{slug}': {
        get: {
          tags: ['Events'],
          summary: 'Get event by slug',
          description: 'Returns a single open event by its URL slug.',
          operationId: 'getEventBySlug',
          parameters: [
            {
              name: 'slug',
              in: 'path',
              required: true,
              schema: { type: 'string' },
              example: 'presidential-election-winner-2028',
            },
          ],
          responses: {
            '200': {
              description: 'Event found.',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/Event' },
                },
              },
            },
            '404': {
              description: 'Event not found.',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/ErrorResponse' },
                  example: { error: 'Event not found' },
                },
              },
            },
            '500': {
              description: 'Server error.',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/ErrorResponse' },
                },
              },
            },
          },
        },
      },
      '/api/prices/{tokenId}': {
        get: {
          tags: ['Prices'],
          summary: 'Get price history',
          description:
            'Returns CLOB price history for a single outcome token id. ' +
            'Server-cached for ~45 seconds.',
          operationId: 'getPriceHistory',
          parameters: [
            {
              name: 'tokenId',
              in: 'path',
              required: true,
              schema: { type: 'string' },
              description: 'CLOB token id (outcome id from Gamma `clobTokenIds`).',
              example:
                '21742633143463906290569050155826241533067272736897614950488156847949938836455',
            },
            {
              name: 'timeframe',
              in: 'query',
              required: false,
              schema: { $ref: '#/components/schemas/ChartTimeframe' },
            },
          ],
          responses: {
            '200': {
              description: 'Price history points.',
              content: {
                'application/json': {
                  schema: {
                    type: 'array',
                    items: { $ref: '#/components/schemas/ChartPoint' },
                  },
                },
              },
            },
            '400': {
              description: 'Invalid timeframe.',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/ErrorResponse' },
                  example: { error: 'Invalid timeframe' },
                },
              },
            },
            '500': {
              description: 'Server error.',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/ErrorResponse' },
                },
              },
            },
          },
        },
      },
      '/api/trades': {
        get: {
          tags: ['Trades'],
          summary: 'Get recent event trades',
          description:
            'Returns recent public Polymarket Data API trades for an event. ' +
            'Used to seed featured bid rails before live websocket activity arrives.',
          operationId: 'getRecentEventTrades',
          parameters: [
            {
              name: 'eventId',
              in: 'query',
              required: true,
              schema: { type: 'string' },
              description: 'Gamma event id used by Polymarket Data API filters.',
              example: '903445',
            },
            {
              name: 'eventSlug',
              in: 'query',
              required: true,
              schema: { type: 'string' },
              description: 'Event slug used as a fallback when upstream omits it.',
              example: 'world-cup-winner',
            },
            {
              name: 'limit',
              in: 'query',
              required: false,
              schema: {
                type: 'integer',
                minimum: 1,
                maximum: 50,
                default: 20,
              },
            },
          ],
          responses: {
            '200': {
              description: 'Recent event trades.',
              headers: {
                'Cache-Control': {
                  schema: { type: 'string' },
                  example: 'public, s-maxage=20, stale-while-revalidate=60',
                },
              },
              content: {
                'application/json': {
                  schema: {
                    type: 'array',
                    items: { $ref: '#/components/schemas/TradeActivityItem' },
                  },
                },
              },
            },
            '400': {
              description: 'Missing or invalid query parameters.',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/ErrorResponse' },
                  example: { error: 'Missing eventId or eventSlug' },
                },
              },
            },
            '500': {
              description: 'Server error.',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/ErrorResponse' },
                },
              },
            },
          },
        },
      },
      '/api/related-news': {
        get: {
          tags: ['News'],
          summary: 'Get related news',
          description:
            'Returns event-related headlines from GDELT DOC 2.0, ranked locally ' +
            'against the supplied event context. Falls back to OkSurf when GDELT ' +
            'times out, errors, or returns no usable articles.',
          operationId: 'getRelatedNews',
          parameters: [
            {
              name: 'title',
              in: 'query',
              required: true,
              schema: { type: 'string' },
              description: 'Event title used as the primary news search input.',
              example: 'Claude Fable 5 restored for US customers by June?',
            },
            {
              name: 'category',
              in: 'query',
              required: false,
              schema: { type: 'string' },
              description: 'Optional event category for ranking and fallback sections.',
              example: 'technology',
            },
            {
              name: 'tags',
              in: 'query',
              required: false,
              schema: { type: 'string' },
              description: 'Comma-separated event tags.',
              example: 'ai,anthropic',
            },
            {
              name: 'questions',
              in: 'query',
              required: false,
              schema: { type: 'string' },
              description: 'Pipe-separated market questions for ranking context.',
              example: 'Will Anthropic restore Claude access?|Will access return by June?',
            },
          ],
          responses: {
            '200': {
              description: 'Ranked related headlines.',
              headers: {
                'Cache-Control': {
                  schema: { type: 'string' },
                  example: 'public, s-maxage=120, stale-while-revalidate=300',
                },
              },
              content: {
                'application/json': {
                  schema: {
                    type: 'array',
                    items: { $ref: '#/components/schemas/NewsArticle' },
                  },
                },
              },
            },
            '400': {
              description: 'Missing event title.',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/ErrorResponse' },
                  example: { error: 'Missing title' },
                },
              },
            },
            '500': {
              description: 'Server error.',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/ErrorResponse' },
                },
              },
            },
          },
        },
      },
    },
    components: {
      schemas: openApiSchemas,
    },
  };
}
