import { describe, it, expect } from 'vitest';

function validateArticle(content: string, keyword: string) {
  const wordCount = content.split(/\s+/).filter(w => w.length > 0).length;
  const keywordCount = (content.match(new RegExp(keyword, 'gi')) || []).length;
  const hasBrand = content.includes('潮际好麦');
  const hasPrice = /(Rp|IDR|USD|\$|¥|RM)\s?\d+([.,]\d+)?/gi.test(content) || /\d+([.,]\d+)?\s?(Rp|IDR|USD|\$|¥|RM)/gi.test(content);
  const isPlainText = !/[#*`_~]/.test(content);

  return {
    wordCount,
    keywordCount,
    hasBrand,
    hasPrice,
    isPlainText
  };
}

describe('Article Validation', () => {
  it('should detect Markdown formatting', () => {
    const text = "## Judul\n**Fitur**";
    const result = validateArticle(text, "test");
    expect(result.isPlainText).toBe(false);
  });

  it('should pass for plain text', () => {
    const text = "Judul\nFitur";
    const result = validateArticle(text, "test");
    expect(result.isPlainText).toBe(true);
  });
});
