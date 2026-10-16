import { describe, it, expect } from 'vitest';

const USERNAME_REGEX = /^[a-zA-Z0-9_]+$/;

describe('Username Validation', () => {
  it('should allow valid usernames', () => {
    expect(USERNAME_REGEX.test('jules')).toBe(true);
    expect(USERNAME_REGEX.test('JULES_2024')).toBe(true);
    expect(USERNAME_REGEX.test('user123')).toBe(true);
  });

  it('should reject invalid usernames', () => {
    expect(USERNAME_REGEX.test('jules@example.com')).toBe(false);
    expect(USERNAME_REGEX.test('jules-123')).toBe(false);
    expect(USERNAME_REGEX.test('jules ')).toBe(false);
    expect(USERNAME_REGEX.test('jules$')).toBe(false);
    expect(USERNAME_REGEX.test(';DROP TABLE users;')).toBe(false);
  });
});
