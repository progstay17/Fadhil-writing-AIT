import { describe, it, expect } from 'vitest';
import { isValidUsername } from '../lib/auth';

function validateArticle(content: string, keyword: string) {
  const wordCount = content.split(/\s+/).filter(w => w.length > 0).length;
  const keywordCount = (content.match(new RegExp(keyword, 'gi')) || []).length;
  const hasBrand = content.includes('潮际好麦');
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

  it('should detect brand presence', () => {
    const text = "Gunakan 潮际好麦 untuk hasil terbaik.";
    const result = validateArticle(text, "test");
    expect(result.hasBrand).toBe(true);
  });
});

describe('isValidUsername Security Validation', () => {
  it('should allow valid usernames', () => {
    expect(isValidUsername('user123')).toBe(true);
    expect(isValidUsername('admin_user')).toBe(true);
    expect(isValidUsername('A')).toBe(true);
    expect(isValidUsername('a'.repeat(32))).toBe(true);
  });

  it('should reject invalid types', () => {
    expect(isValidUsername(null)).toBe(false);
    expect(isValidUsername(undefined)).toBe(false);
    expect(isValidUsername(123)).toBe(false);
    expect(isValidUsername({})).toBe(false);
  });

  it('should reject invalid characters', () => {
    expect(isValidUsername('user!123')).toBe(false);
    expect(isValidUsername('user 123')).toBe(false);
    expect(isValidUsername('user-123')).toBe(false);
    expect(isValidUsername('user.123')).toBe(false);
  });

  it('should reject invalid lengths', () => {
    expect(isValidUsername('')).toBe(false);
    expect(isValidUsername('a'.repeat(33))).toBe(false);
  });

  it('should reject blacklisted property names', () => {
    expect(isValidUsername('__proto__')).toBe(false);
    expect(isValidUsername('constructor')).toBe(false);
    expect(isValidUsername('toString')).toBe(false);
    expect(isValidUsername('CONSTRUCTOR')).toBe(false);
  });
});
