import { describe, it, expect } from 'vitest';

const USERNAME_REGEX = /^[a-zA-Z0-9_]+$/;

describe('Security Validation: Username', () => {
  it('should accept valid usernames', () => {
    expect(USERNAME_REGEX.test('jules')).toBe(true);
    expect(USERNAME_REGEX.test('Sentinel_01')).toBe(true);
    expect(USERNAME_REGEX.test('12345')).toBe(true);
    expect(USERNAME_REGEX.test('user_name')).toBe(true);
  });

  it('should reject usernames with spaces', () => {
    expect(USERNAME_REGEX.test('jules sentry')).toBe(false);
  });

  it('should reject usernames with special characters', () => {
    expect(USERNAME_REGEX.test('jules!')).toBe(false);
    expect(USERNAME_REGEX.test('admin;--')).toBe(false);
    expect(USERNAME_REGEX.test('admin"')).toBe(false);
    expect(USERNAME_REGEX.test('admin\'')).toBe(false);
    expect(USERNAME_REGEX.test('admin*')).toBe(false);
    expect(USERNAME_REGEX.test('admin$')).toBe(false);
    expect(USERNAME_REGEX.test('admin@example.com')).toBe(false);
  });

  it('should reject usernames attempting path traversal', () => {
    expect(USERNAME_REGEX.test('../../etc/passwd')).toBe(false);
  });

  it('should allow alphanumeric and underscores but prevent special character injection', () => {
    expect(USERNAME_REGEX.test('__proto__')).toBe(true); // Matches regex, but safe due to USER_ prefix
    expect(USERNAME_REGEX.test('user_123')).toBe(true);
  });
});
