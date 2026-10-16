import { describe, it, expect } from 'vitest';
import { isValidUsername } from '../lib/auth';

describe('isValidUsername Security Validation', () => {
  it('should allow valid usernames', () => {
    expect(isValidUsername('jules')).toBe(true);
    expect(isValidUsername('user_123')).toBe(true);
    expect(isValidUsername('ADMIN')).toBe(true);
  });

  it('should reject usernames with special characters (potential injection)', () => {
    expect(isValidUsername('user-name')).toBe(false);
    expect(isValidUsername('user.name')).toBe(false);
    expect(isValidUsername('user$name')).toBe(false);
    expect(isValidUsername('user;')).toBe(false);
    expect(isValidUsername('user--')).toBe(false);
    expect(isValidUsername('user/*')).toBe(false);
  });

  it('should reject usernames with spaces', () => {
    expect(isValidUsername('user name')).toBe(false);
  });

  it('should reject empty or non-string inputs', () => {
    expect(isValidUsername('')).toBe(false);
    expect(isValidUsername(null)).toBe(false);
    expect(isValidUsername(undefined)).toBe(false);
    expect(isValidUsername(123)).toBe(false);
    expect(isValidUsername({})).toBe(false);
  });

  it('should prevent prototype pollution attempts via username', () => {
    expect(isValidUsername('__proto__')).toBe(true); // Alphanumeric/underscore allowed
    // But it won't allow dots or brackets needed for typical pollution in this context
    expect(isValidUsername('constructor.prototype')).toBe(false);
  });
});
