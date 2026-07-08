import { describe, it, expect } from 'vitest';
import { isValidUsername } from '../lib/auth';

describe('isValidUsername', () => {
  it('should accept valid usernames', () => {
    expect(isValidUsername('user123')).toBe(true);
    expect(isValidUsername('admin_user')).toBe(true);
    expect(isValidUsername('A')).toBe(true);
    expect(isValidUsername('a'.repeat(32))).toBe(true);
  });

  it('should reject non-string inputs', () => {
    expect(isValidUsername(null)).toBe(false);
    expect(isValidUsername(undefined)).toBe(false);
    expect(isValidUsername(123)).toBe(false);
    expect(isValidUsername({})).toBe(false);
    expect(isValidUsername([])).toBe(false);
  });

  it('should reject usernames with invalid characters', () => {
    expect(isValidUsername('user-123')).toBe(false);
    expect(isValidUsername('user 123')).toBe(false);
    expect(isValidUsername('user@123')).toBe(false);
    expect(isValidUsername('user.123')).toBe(false);
  });

  it('should reject empty or too long usernames', () => {
    expect(isValidUsername('')).toBe(false);
    expect(isValidUsername('a'.repeat(33))).toBe(false);
  });

  it('should reject blacklisted property names', () => {
    expect(isValidUsername('__proto__')).toBe(false);
    expect(isValidUsername('constructor')).toBe(false);
    expect(isValidUsername('prototype')).toBe(false);
    expect(isValidUsername('toString')).toBe(false);
    expect(isValidUsername('valueOf')).toBe(false);

    // Case insensitive check
    expect(isValidUsername('CONSTRUCTOR')).toBe(false);
    expect(isValidUsername('__PROTO__')).toBe(false);
  });

  it('should reject usernames that attempt property injection via array-like access if they match blacklist', () => {
    // These are covered by the alphanumeric regex anyway, but good to test the blacklist
    expect(isValidUsername('__proto__')).toBe(false);
  });
});
