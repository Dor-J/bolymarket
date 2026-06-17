import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

describe('PageContainer mobile padding', () => {
  it('includes mobile bottom nav padding class', () => {
    const source = readFileSync(
      resolve(process.cwd(), 'src/components/layout/PageContainer.tsx'),
      'utf8',
    );

    expect(source).toContain('--mobile-bottom-nav-height');
  });
});
