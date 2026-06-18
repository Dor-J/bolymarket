import { describe, expect, it } from 'vitest';
import { buildOpenApiSpec } from './spec';

describe('buildOpenApiSpec', () => {
  it('returns OpenAPI 3.0 document with all API paths', () => {
    const spec = buildOpenApiSpec({ serverUrl: 'http://localhost:3000' });

    expect(spec.openapi).toBe('3.0.3');
    expect(spec.info.title).toBe('bolymarket API');
    expect(spec.servers?.[0]?.url).toBe('http://localhost:3000');
    expect(spec.paths?.['/api/events']?.get).toBeDefined();
    expect(spec.paths?.['/api/events/{slug}']?.get).toBeDefined();
    expect(spec.paths?.['/api/prices/{tokenId}']?.get).toBeDefined();
    expect(spec.paths?.['/api/related-news']?.get).toBeDefined();
  });

  it('documents category tag query parameter', () => {
    const spec = buildOpenApiSpec({ serverUrl: 'http://localhost:3000' });
    const params = spec.paths?.['/api/events']?.get?.parameters ?? [];

    expect(params.some((param) => 'name' in param && param.name === 'tag')).toBe(
      true,
    );
  });
});
