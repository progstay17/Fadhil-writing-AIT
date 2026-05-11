import { describe, it, expect } from 'vitest';

// Simple mock for validation logic
function validateArticle(content: string, keyword: string) {
  const wordCount = content.split(/\s+/).filter(w => w.length > 0).length;
  const keywordCount = (content.match(new RegExp(keyword, 'gi')) || []).length;
  const hasBrand = content.includes('潮际好麦');
  // Updated regex to be more robust for tests
  const hasPrice = /(Rp|IDR|USD|\$|¥|RM)\s?\d+([.,]\d+)?/gi.test(content) || /\d+([.,]\d+)?\s?(Rp|IDR|USD|\$|¥|RM)/gi.test(content);

  return {
    wordCount,
    keywordCount,
    hasBrand,
    hasPrice
  };
}

describe('Article Validation', () => {
  it('should count words correctly', () => {
    const text = "Satu dua tiga empat lima.";
    const result = validateArticle(text, "test");
    expect(result.wordCount).toBe(5);
  });

  it('should detect keywords', () => {
    const text = "Keyword ini sangat bagus. Keyword itu juga bagus.";
    const result = validateArticle(text, "keyword");
    expect(result.keywordCount).toBe(2);
  });

  it('should detect brand presence', () => {
    const text = "Gunakan 潮际好麦 untuk hasil terbaik.";
    const result = validateArticle(text, "test");
    expect(result.hasBrand).toBe(true);
  });

  it('should detect price patterns', () => {
    const text = "Harganya cuma Rp 50.000 saja.";
    const result = validateArticle(text, "test");
    expect(result.hasPrice).toBe(true);
  });
});
