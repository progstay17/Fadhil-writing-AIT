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

  it('should return false for invalid formats', () => {
    expect(isValidUsername('')).toBe(false); // empty
    expect(isValidUsername('user-name')).toBe(false); // hyphen not allowed
    expect(isValidUsername('user name')).toBe(false); // space not allowed
    expect(isValidUsername('user@domain')).toBe(false); // special char
    expect(isValidUsername('a'.repeat(33))).toBe(false); // too long
  });

  it('should return false for blacklisted property names', () => {
    expect(isValidUsername('__proto__')).toBe(false);
    expect(isValidUsername('constructor')).toBe(false);
    expect(isValidUsername('toString')).toBe(false);
    expect(isValidUsername('valueOf')).toBe(false);
    expect(isValidUsername('CONSTRUCTOR')).toBe(false); // case insensitive check
  });
});
