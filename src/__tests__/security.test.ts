import { describe, it, expect } from 'vitest';
import { isValidUsername } from '../lib/auth';

describe('isValidUsername', () => {
  it('should accept valid usernames', () => {
    expect(isValidUsername('jules')).toBe(true);
    expect(isValidUsername('user_123')).toBe(true);
    expect(isValidUsername('ADMIN')).toBe(true);
  });

  it('should reject non-string inputs', () => {
    expect(isValidUsername(null)).toBe(false);
    expect(isValidUsername(undefined)).toBe(false);
    expect(isValidUsername(123)).toBe(false);
    expect(isValidUsername({})).toBe(false);
  });

  it('should reject empty or too long usernames', () => {
    expect(isValidUsername('')).toBe(false);
    expect(isValidUsername('a'.repeat(33))).toBe(false);
    expect(isValidUsername('a'.repeat(32))).toBe(true);
  });

  it('should reject invalid characters', () => {
    expect(isValidUsername('user-name')).toBe(false);
    expect(isValidUsername('user name')).toBe(false);
    expect(isValidUsername('user!@#')).toBe(false);
    expect(isValidUsername('../etc/passwd')).toBe(false);
  });

  it('should reject blacklisted property names (case-insensitive)', () => {
    expect(isValidUsername('__proto__')).toBe(false);
    expect(isValidUsername('CONSTRUCTOR')).toBe(false);
    expect(isValidUsername('toString')).toBe(false);
    expect(isValidUsername('constructor')).toBe(false);
  });

  it('should accept normal names that happen to contain blacklist words but are not exactly them', () => {
    expect(isValidUsername('my_constructor')).toBe(true);
    expect(isValidUsername('tostring_v2')).toBe(true);
  });
});
