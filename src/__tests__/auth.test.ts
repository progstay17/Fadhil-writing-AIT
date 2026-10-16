import { describe, it, expect } from 'vitest';
import { isValidUsername } from '../lib/auth';

describe('isValidUsername', () => {
  it('should return true for valid usernames', () => {
    expect(isValidUsername('admin')).toBe(true);
    expect(isValidUsername('user_123')).toBe(true);
    expect(isValidUsername('A')).toBe(true);
    expect(isValidUsername('a'.repeat(32))).toBe(true);
  });

  it('should return false for non-string inputs', () => {
    expect(isValidUsername(null)).toBe(false);
    expect(isValidUsername(undefined)).toBe(false);
    expect(isValidUsername(123)).toBe(false);
    expect(isValidUsername({})).toBe(false);
  });

  it('should return false for invalid characters', () => {
    expect(isValidUsername('user-123')).toBe(false);
    expect(isValidUsername('user 123')).toBe(false);
    expect(isValidUsername('admin!')).toBe(false);
    expect(isValidUsername('admin;')).toBe(false);
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
    expect(isValidUsername('__PROTO__')).toBe(false);
  });
});
