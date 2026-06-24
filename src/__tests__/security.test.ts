import { describe, it, expect } from 'vitest';
import { isValidUsername } from '../lib/auth';

describe('Security: Username Validation', () => {
  it('should allow valid usernames', () => {
    expect(isValidUsername('admin')).toBe(true);
    expect(isValidUsername('user_123')).toBe(true);
    expect(isValidUsername('A1b2_C3')).toBe(true);
  });

  it('should reject invalid characters', () => {
    expect(isValidUsername('user-123')).toBe(false);
    expect(isValidUsername('user.123')).toBe(false);
    expect(isValidUsername('user 123')).toBe(false);
    expect(isValidUsername('admin;')).toBe(false);
    expect(isValidUsername('admin"')).toBe(false);
    expect(isValidUsername("admin'")).toBe(false);
    expect(isValidUsername('admin\n')).toBe(false);
  });

  it('should reject based on length', () => {
    expect(isValidUsername('')).toBe(false);
    expect(isValidUsername('a'.repeat(33))).toBe(false);
    expect(isValidUsername('a'.repeat(32))).toBe(true);
  });

  it('should reject blacklisted property names', () => {
    expect(isValidUsername('__proto__')).toBe(false);
    expect(isValidUsername('constructor')).toBe(false);
    expect(isValidUsername('toString')).toBe(false);
    expect(isValidUsername('CONSTRUCTOR')).toBe(false);
  });

  it('should reject non-string inputs', () => {
    expect(isValidUsername(null)).toBe(false);
    expect(isValidUsername(undefined)).toBe(false);
    expect(isValidUsername(123)).toBe(false);
    expect(isValidUsername({})).toBe(false);
  });
});
