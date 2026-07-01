import { describe, it, expect } from 'vitest';
import { isValidUsername } from '../lib/auth';

describe('isValidUsername', () => {
  it('should return true for valid usernames', () => {
    expect(isValidUsername('jules')).toBe(true);
    expect(isValidUsername('jules_123')).toBe(true);
    expect(isValidUsername('ADMIN')).toBe(true);
  });

  it('should return false for non-string inputs', () => {
    expect(isValidUsername(null)).toBe(false);
    expect(isValidUsername(undefined)).toBe(false);
    expect(isValidUsername(123)).toBe(false);
    expect(isValidUsername({})).toBe(false);
  });

  it('should return false for invalid characters', () => {
    expect(isValidUsername('jules-123')).toBe(false);
    expect(isValidUsername('jules 123')).toBe(false);
    expect(isValidUsername('jules@123')).toBe(false);
  });

  it('should return false for invalid lengths', () => {
    expect(isValidUsername('')).toBe(false);
    expect(isValidUsername('a'.repeat(33))).toBe(false);
  });

  it('should return false for blacklisted property names', () => {
    expect(isValidUsername('__proto__')).toBe(false);
    expect(isValidUsername('constructor')).toBe(false);
    expect(isValidUsername('toString')).toBe(false);
    expect(isValidUsername('CONSTRUCTOR')).toBe(false);
  });
});
