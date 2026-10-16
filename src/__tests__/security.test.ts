import { describe, it, expect } from 'vitest';
import { isValidUsername } from '../lib/auth';

describe('Security: Username Validation', () => {
  it('should allow valid usernames', () => {
    expect(isValidUsername('user123')).toBe(true);
    expect(isValidUsername('admin_user')).toBe(true);
    expect(isValidUsername('USER_1')).toBe(true);
  });

  it('should reject usernames with special characters', () => {
    expect(isValidUsername('user.name')).toBe(false);
    expect(isValidUsername('user-name')).toBe(false);
    expect(isValidUsername('user/name')).toBe(false);
    expect(isValidUsername('user\\name')).toBe(false);
    expect(isValidUsername('user@name')).toBe(false);
  });

  it('should reject usernames with spaces', () => {
    expect(isValidUsername('user name')).toBe(false);
  });

  it('should reject potential path traversal attempts', () => {
    expect(isValidUsername('../admin')).toBe(false);
    expect(isValidUsername('./config')).toBe(false);
  });

  it('should reject potential property injection attempts', () => {
    expect(isValidUsername('__proto__')).toBe(false);
    expect(isValidUsername('constructor')).toBe(false);
    expect(isValidUsername('toString')).toBe(false);
  });

  it('should reject non-string inputs', () => {
    expect(isValidUsername(null)).toBe(false);
    expect(isValidUsername(undefined)).toBe(false);
    expect(isValidUsername(123)).toBe(false);
    expect(isValidUsername({})).toBe(false);
  });

  it('should enforce length limits', () => {
    expect(isValidUsername('')).toBe(false);
    expect(isValidUsername('a'.repeat(33))).toBe(false);
    expect(isValidUsername('a'.repeat(32))).toBe(true);
  });
});
