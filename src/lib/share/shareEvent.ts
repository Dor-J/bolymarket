/**
 * Copies text to the clipboard with a graceful fallback.
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch {
      return false;
    }
  }

  return false;
}

export interface ShareEventOptions {
  title: string;
  url: string;
}

/**
 * Shares an event via the Web Share API or clipboard fallback.
 */
export async function shareEvent({
  title,
  url,
}: ShareEventOptions): Promise<'shared' | 'copied' | 'failed'> {
  if (typeof navigator !== 'undefined' && navigator.share) {
    try {
      await navigator.share({ title, url });
      return 'shared';
    } catch {
      // User cancelled or share failed — fall through to clipboard.
    }
  }

  const copied = await copyToClipboard(url);
  return copied ? 'copied' : 'failed';
}

/**
 * Builds an embed snippet for an event page.
 */
export function buildEmbedSnippet(url: string): string {
  return `<iframe src="${url}" width="400" height="300" frameborder="0"></iframe>`;
}
