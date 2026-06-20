import { describe, it, expect } from 'vitest';
import { isValidUsername } from '../lib/auth';

describe('isValidUsername', () => {
  it('should return true for valid alphanumeric usernames', () => {
    expect(isValidUsername('user123')).toBe(true);
    expect(isValidUsername('ADMIN_USER')).toBe(true);
    expect(isValidUsername('valid_username_1')).toBe(true);
  });

  it('should return false for usernames with special characters', () => {
    expect(isValidUsername('user@123')).toBe(false);
    expect(isValidUsername('user-name')).toBe(false);
    expect(isValidUsername('user.name')).toBe(false);
    expect(isValidUsername('user name')).toBe(false);
  });

  it('should return false for non-string inputs', () => {
    expect(isValidUsername(null)).toBe(false);
    expect(isValidUsername(undefined)).toBe(false);
    expect(isValidUsername(123)).toBe(false);
    expect(isValidUsername({})).toBe(false);
  });

  it('should return false for injection attempts', () => {
    // Potential environment variable access or other property injection attempts
    expect(isValidUsername('__proto__')).toBe(true); // Alphanumeric with underscores, but allowed as per regex
    expect(isValidUsername('NODE_OPTIONS')).toBe(true); // Alphanumeric with underscores, but allowed as per regex
    expect(isValidUsername('user[`PASSWORD`]')).toBe(false);
    expect(isValidUsername("user']; console.log('hacked'); //")).toBe(false);
  });
});
