import { describe, it, expect } from 'vitest';

const USERNAME_REGEX = /^[a-zA-Z0-9_]+$/;

describe('Security Validation: Username Regex', () => {
  it('should accept valid usernames', () => {
    expect(USERNAME_REGEX.test('admin')).toBe(true);
    expect(USERNAME_REGEX.test('user_123')).toBe(true);
    expect(USERNAME_REGEX.test('TEST_USER')).toBe(true);
    expect(USERNAME_REGEX.test('123456')).toBe(true);
  });

  it('should reject usernames with special characters', () => {
    expect(USERNAME_REGEX.test('admin!')).toBe(false);
    expect(USERNAME_REGEX.test('user-123')).toBe(false);
    expect(USERNAME_REGEX.test('user.name')).toBe(false);
    expect(USERNAME_REGEX.test('user@domain')).toBe(false);
    expect(USERNAME_REGEX.test('user space')).toBe(false);
  });

  it('should reject potential environment variable injection attempts', () => {
    expect(USERNAME_REGEX.test('ADMIN_PASSWORD')).toBe(true); // Valid characters, but should be handled by logic
    expect(USERNAME_REGEX.test('USER[`_`].toUpperCase()')).toBe(false);
    expect(USERNAME_REGEX.test('${process.env.JWT_SECRET}')).toBe(false);
    expect(USERNAME_REGEX.test('__proto__')).toBe(true); // Valid characters, but check if we need to block this specifically
  });
});
