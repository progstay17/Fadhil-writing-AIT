import { describe, it, expect } from 'vitest';
import { isValidUsername } from '../lib/auth';

describe('Security Validation: Username', () => {
  it('should accept valid usernames', () => {
    expect(isValidUsername('admin')).toBe(true);
    expect(isValidUsername('user_123')).toBe(true);
    expect(isValidUsername('Editor2026')).toBe(true);
    expect(isValidUsername('CHAOJI_HAOMAI')).toBe(true);
  });

  it('should reject usernames with special characters (potential injection)', () => {
    expect(isValidUsername('admin";--')).toBe(false);
    expect(isValidUsername('user$name')).toBe(false);
    expect(isValidUsername('admin/config')).toBe(false);
    expect(isValidUsername('..\\etc\\passwd')).toBe(false);
    expect(isValidUsername('username#')).toBe(false);
  });

  it('should reject usernames with spaces', () => {
    expect(isValidUsername('admin user')).toBe(false);
    expect(isValidUsername(' ')).toBe(false);
  });

  it('should reject non-string inputs', () => {
    expect(isValidUsername(null)).toBe(false);
    expect(isValidUsername(undefined)).toBe(false);
    expect(isValidUsername(123)).toBe(false);
    expect(isValidUsername({})).toBe(false);
  });

  it('should reject empty strings', () => {
    expect(isValidUsername('')).toBe(false);
  });
});
