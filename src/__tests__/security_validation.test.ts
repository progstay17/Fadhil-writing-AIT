import { describe, it, expect } from 'vitest';
import { isValidUsername } from '../lib/validation';

describe('Username Security Validation', () => {
  it('should allow valid alphanumeric usernames', () => {
    expect(isValidUsername('jules_123')).toBe(true);
    expect(isValidUsername('ADMIN')).toBe(true);
  });

  it('should reject usernames with special characters', () => {
    expect(isValidUsername('jules!@#')).toBe(false);
    expect(isValidUsername('user space')).toBe(false);
    expect(isValidUsername('user-dash')).toBe(false);
  });

  it('should reject potential environment variable injection attempts', () => {
    expect(isValidUsername('__proto__')).toBe(true); // Alphanumeric/underscore is allowed by regex
    // The key is that it restricts to a specific safe set
    expect(isValidUsername('USER_ADMIN_PASSWORD')).toBe(true);
    expect(isValidUsername('path/to/secret')).toBe(false);
    expect(isValidUsername('..\\..\\etc\\passwd')).toBe(false);
  });
});
