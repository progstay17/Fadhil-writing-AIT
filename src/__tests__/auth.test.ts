import { describe, it, expect } from 'vitest';
import { isValidUsername } from '../lib/auth';

describe('isValidUsername', () => {
  it('should allow valid usernames', () => {
    expect(isValidUsername('user123')).toBe(true);
    expect(isValidUsername('admin_user')).toBe(true);
    expect(isValidUsername('a')).toBe(true);
    expect(isValidUsername('a'.repeat(32))).toBe(true);
  });

  it('should reject usernames with invalid characters', () => {
    expect(isValidUsername('user@123')).toBe(false);
    expect(isValidUsername('user-123')).toBe(false);
    expect(isValidUsername('user 123')).toBe(false);
    expect(isValidUsername('user.123')).toBe(false);
  });

  it('should reject usernames with invalid length', () => {
    expect(isValidUsername('')).toBe(false);
    expect(isValidUsername('a'.repeat(33))).toBe(false);
  });

  it('should reject blacklisted property names', () => {
    expect(isValidUsername('__proto__')).toBe(false);
    expect(isValidUsername('constructor')).toBe(false);
    expect(isValidUsername('prototype')).toBe(false);
    expect(isValidUsername('toString')).toBe(false);
    expect(isValidUsername('hasOwnProperty')).toBe(false);
    expect(isValidUsername('CONSTRUCTOR')).toBe(false);
  });

  it('should reject non-string inputs', () => {
    expect(isValidUsername(null as any)).toBe(false);
    expect(isValidUsername(undefined as any)).toBe(false);
    expect(isValidUsername(123 as any)).toBe(false);
  });
});
