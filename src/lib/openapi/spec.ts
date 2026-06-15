import type { OpenAPIV3_1 } from 'openapi-types';

/** Reusable OpenAPI schema components for bolymarket API responses. */
export const openApiSchemas: OpenAPIV3_1.ComponentsObject['schemas'] = {
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
      oneOf: [{ type: 'number' }, { type: 'string' }],
      description: 'Series values keyed by CLOB token id.',
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
 * Builds the OpenAPI 3.1 specification for bolymarket REST routes.
 */
export function buildOpenApiSpec({
  serverUrl,
}: BuildOpenApiSpecOptions): OpenAPIV3_1.Document {
  return {
    openapi: '3.1.0',
    info: {
      title: 'bolymarket API',
      version: '1.0.0',
      description: [
        'Read-only REST API for the bolymarket Polymarket-style frontend.',
        '',
        'All routes proxy and cache upstream Polymarket Gamma / CLOB data.',
        'Responses are normalized to bolymarket domain types.',
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
    },
    components: {
      schemas: openApiSchemas,
    },
  };
}
