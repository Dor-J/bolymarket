import { beforeEach, describe, expect, it, vi } from 'vitest';
import { GET } from './route';

const openApiMocks = vi.hoisted(() => ({
  buildOpenApiSpec: vi.fn(),
}));

vi.mock('@/lib/openapi/spec', () => openApiMocks);

describe('/api/openapi route', () => {
  beforeEach(() => {
    openApiMocks.buildOpenApiSpec.mockReset();
  });

  it('serves the generated OpenAPI spec using the request origin', async () => {
    const spec = { openapi: '3.0.3', info: { title: 'Bolymarket API' } };
    openApiMocks.buildOpenApiSpec.mockReturnValue(spec);

    const response = await GET(new Request('https://bolymarket.test/api/openapi'));

    expect(openApiMocks.buildOpenApiSpec).toHaveBeenCalledWith({
      serverUrl: 'https://bolymarket.test',
    });
    expect(await response.json()).toEqual(spec);
    expect(response.headers.get('Cache-Control')).toBe('public, max-age=300');
  });
});
