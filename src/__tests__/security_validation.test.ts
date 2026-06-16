import { describe, it, expect } from 'vitest';

const USERNAME_REGEX = /^[a-zA-Z0-9_]+$/;

describe('Username Validation Security', () => {
  it('should allow valid alphanumeric usernames with underscores', () => {
    expect(USERNAME_REGEX.test('jules')).toBe(true);
    expect(USERNAME_REGEX.test('user_123')).toBe(true);
    expect(USERNAME_REGEX.test('ADMIN_USER')).toBe(true);
    expect(USERNAME_REGEX.test('12345')).toBe(true);
  });

  it('should reject usernames with special characters that could be used for injection or path traversal', () => {
    expect(USERNAME_REGEX.test('user-name')).toBe(false);
    expect(USERNAME_REGEX.test('user.name')).toBe(false);
    expect(USERNAME_REGEX.test('user name')).toBe(false);
    expect(USERNAME_REGEX.test('user@123')).toBe(false);
    expect(USERNAME_REGEX.test('../etc/passwd')).toBe(false);
    expect(USERNAME_REGEX.test('admin"')).toBe(false);
    expect(USERNAME_REGEX.test("admin'")).toBe(false);
    expect(USERNAME_REGEX.test('admin;')).toBe(false);
    expect(USERNAME_REGEX.test('admin#')).toBe(false);
    expect(USERNAME_REGEX.test('admin?')).toBe(false);
    expect(USERNAME_REGEX.test('admin&')).toBe(false);
    expect(USERNAME_REGEX.test('admin|')).toBe(false);
  });

  it('should reject empty or null-like inputs if tested as string', () => {
    expect(USERNAME_REGEX.test('')).toBe(false);
  });
});
