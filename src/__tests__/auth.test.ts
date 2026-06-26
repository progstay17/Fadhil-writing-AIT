import { describe, it, expect } from 'vitest';
import { isValidUsername } from '../lib/auth';

describe('isValidUsername', () => {
  it('should return true for valid usernames', () => {
    expect(isValidUsername('admin')).toBe(true);
    expect(isValidUsername('user_123')).toBe(true);
    expect(isValidUsername('USER_NAME')).toBe(true);
  });

  it('should return false for usernames with invalid characters', () => {
    expect(isValidUsername('user-name')).toBe(false);
    expect(isValidUsername('user name')).toBe(false);
    expect(isValidUsername('user@123')).toBe(false);
    expect(isValidUsername('admin!')).toBe(false);
  });

  it('should return false for empty or too long usernames', () => {
    expect(isValidUsername('')).toBe(false);
    expect(isValidUsername('a'.repeat(33))).toBe(false);
    expect(isValidUsername('a'.repeat(32))).toBe(true);
  });

  it('should return false for blacklisted property names (case-insensitive)', () => {
    expect(isValidUsername('__proto__')).toBe(false);
    expect(isValidUsername('CONSTRUCTOR')).toBe(false);
    expect(isValidUsername('toString')).toBe(false);
    expect(isValidUsername('__PROTO__')).toBe(false);
  });
});
