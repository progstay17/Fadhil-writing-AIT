import { describe, it, expect } from 'vitest';
import { isValidUsername } from '../lib/auth';

describe('Username Validation Security', () => {
  it('should allow valid alphanumeric usernames', () => {
    expect(isValidUsername('admin')).toBe(true);
    expect(isValidUsername('user123')).toBe(true);
    expect(isValidUsername('test_user')).toBe(true);
    expect(isValidUsername('ADMIN_123')).toBe(true);
  });

  it('should reject usernames with special characters (Injection Prevention)', () => {
    expect(isValidUsername('admin;')).toBe(false);
    expect(isValidUsername('user"')).toBe(false);
    expect(isValidUsername("user'")).toBe(false);
    expect(isValidUsername('user-name')).toBe(false);
    expect(isValidUsername('user.name')).toBe(false);
    expect(isValidUsername('user name')).toBe(false);
    expect(isValidUsername('admin\n')).toBe(false);
  });

  it('should allow common alphanumeric strings even if they are special property names', () => {
    // Alphanumeric and underscores are allowed by the regex
    expect(isValidUsername('__proto__')).toBe(true);
    expect(isValidUsername('constructor')).toBe(true);
  });

  it('should reject potential path traversal attempts', () => {
    expect(isValidUsername('../admin')).toBe(false);
    expect(isValidUsername('./admin')).toBe(false);
  });

  it('should reject non-string types', () => {
    expect(isValidUsername(null)).toBe(false);
    expect(isValidUsername(undefined)).toBe(false);
    expect(isValidUsername(123)).toBe(false);
    expect(isValidUsername({})).toBe(false);
    expect(isValidUsername([])).toBe(false);
  });

  it('should reject empty strings', () => {
    expect(isValidUsername('')).toBe(false);
  });
});
