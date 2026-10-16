import { describe, it, expect } from 'vitest';

const USERNAME_REGEX = /^[a-zA-Z0-9_]+$/;

describe('Security: Username Validation', () => {
  it('should permit valid alphanumeric usernames', () => {
    expect(USERNAME_REGEX.test('admin')).toBe(true);
    expect(USERNAME_REGEX.test('user123')).toBe(true);
    expect(USERNAME_REGEX.test('jules_engineer')).toBe(true);
  });

  it('should reject usernames with special characters (potential injection)', () => {
    expect(USERNAME_REGEX.test('admin;--')).toBe(false);
    expect(USERNAME_REGEX.test('user" OR "1"="1')).toBe(false);
    expect(USERNAME_REGEX.test('user space')).toBe(false);
    expect(USERNAME_REGEX.test('user.name')).toBe(false);
    expect(USERNAME_REGEX.test('user$name')).toBe(false);
  });
});
