import { describe, it, expect } from 'vitest';
import { isValidUsername, isValidJwtSecret } from '../lib/validation';

describe('Security Validation', () => {
  describe('isValidUsername', () => {
    it('should permit valid alphanumeric usernames', () => {
      expect(isValidUsername('jules_01')).toBe(true);
      expect(isValidUsername('admin')).toBe(true);
      expect(isValidUsername('USER123')).toBe(true);
    });

    it('should reject usernames with special characters (injection risk)', () => {
      expect(isValidUsername('jules-01')).toBe(false); // No hyphens
      expect(isValidUsername('admin;')).toBe(false); // No semicolons
      expect(isValidUsername('user space')).toBe(false); // No spaces
      expect(isValidUsername('user"')).toBe(false); // No quotes
      expect(isValidUsername("user'")).toBe(false); // No single quotes
      expect(isValidUsername('user\\')).toBe(false); // No backslashes
      expect(isValidUsername('user.toUpperCase')).toBe(false); // No dots
    });

    it('should reject empty usernames', () => {
      expect(isValidUsername('')).toBe(false);
    });
  });

  describe('isValidJwtSecret', () => {
    it('should permit secrets with at least 32 characters', () => {
      const longSecret = 'a'.repeat(32);
      expect(isValidJwtSecret(longSecret)).toBe(true);
    });

    it('should reject secrets shorter than 32 characters', () => {
      const shortSecret = 'a'.repeat(31);
      expect(isValidJwtSecret(shortSecret)).toBe(false);
    });

    it('should reject undefined or null secrets', () => {
      expect(isValidJwtSecret(undefined)).toBe(false);
    });
  });
});
