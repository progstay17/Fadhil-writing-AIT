import { describe, it, expect } from 'vitest';
import { USERNAME_REGEX } from '../lib/auth';

describe('Username Validation Security', () => {
  it('should allow valid alphanumeric usernames', () => {
    expect(USERNAME_REGEX.test('user123')).toBe(true);
    expect(USERNAME_REGEX.test('ADMIN_USER')).toBe(true);
    expect(USERNAME_REGEX.test('john_doe_99')).toBe(true);
  });

  it('should reject usernames with special characters (Injection Risk)', () => {
    expect(USERNAME_REGEX.test('user!123')).toBe(false);
    expect(USERNAME_REGEX.test('user; DROP TABLE users')).toBe(false);
    expect(USERNAME_REGEX.test('user" OR "1"="1')).toBe(false);
    expect(USERNAME_REGEX.test('user<script>')).toBe(false);
  });

  it('should reject usernames with spaces', () => {
    expect(USERNAME_REGEX.test('user name')).toBe(false);
  });

  it('should reject empty usernames', () => {
    expect(USERNAME_REGEX.test('')).toBe(false);
  });
});
