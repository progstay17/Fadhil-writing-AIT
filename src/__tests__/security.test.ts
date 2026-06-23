import { describe, it, expect } from 'vitest';
import { isValidUsername } from '../lib/auth';

describe('isValidUsername', () => {
  it('should accept valid usernames', () => {
    expect(isValidUsername('admin')).toBe(true);
    expect(isValidUsername('user123')).toBe(true);
    expect(isValidUsername('test_user')).toBe(true);
    expect(isValidUsername('A')).toBe(true);
    expect(isValidUsername('a'.repeat(32))).toBe(true);
  });

  it('should reject empty or too long usernames', () => {
    expect(isValidUsername('')).toBe(false);
    expect(isValidUsername('a'.repeat(33))).toBe(false);
  });

  it('should reject usernames with special characters', () => {
    expect(isValidUsername('user@123')).toBe(false);
    expect(isValidUsername('user!inc')).toBe(false);
    expect(isValidUsername('user space')).toBe(false);
    expect(isValidUsername('user-dash')).toBe(false);
    expect(isValidUsername('user.dot')).toBe(false);
  });

  it('should reject blacklisted property names', () => {
    expect(isValidUsername('__proto__')).toBe(false);
    expect(isValidUsername('constructor')).toBe(false);
    expect(isValidUsername('toString')).toBe(false);
    expect(isValidUsername('hasOwnProperty')).toBe(false);
    expect(isValidUsername('valueOf')).toBe(false);

    // Case-insensitivity check
    expect(isValidUsername('__PROTO__')).toBe(false);
    expect(isValidUsername('Constructor')).toBe(false);
    expect(isValidUsername('TOSTRING')).toBe(false);
  });

  it('should reject possible injection patterns', () => {
    expect(isValidUsername('admin" OR "1"="1')).toBe(false);
    expect(isValidUsername('<script>')).toBe(false);
    expect(isValidUsername('../../../etc/passwd')).toBe(false);
  });
});
