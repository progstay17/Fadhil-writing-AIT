import { describe, it, expect } from 'vitest';
import { isValidUsername, validateJwtSecret } from '../lib/validation';

describe('Security Validation Utilities', () => {
  describe('isValidUsername', () => {
    it('should allow valid alphanumeric usernames', () => {
      expect(isValidUsername('user123')).toBe(true);
      expect(isValidUsername('ADMIN_USER')).toBe(true);
      expect(isValidUsername('john_doe_99')).toBe(true);
    });

    it('should reject usernames with special characters (injection risks)', () => {
      expect(isValidUsername('user$123')).toBe(false);
      expect(isValidUsername('admin;')).toBe(false);
      expect(isValidUsername('john"doe')).toBe(false);
      expect(isValidUsername('user.name')).toBe(false);
      expect(isValidUsername('user/path')).toBe(false);
      expect(isValidUsername('user\nnewline')).toBe(false);
    });

    it('should reject usernames with spaces', () => {
      expect(isValidUsername('user name')).toBe(false);
    });

    it('should reject empty usernames', () => {
      expect(isValidUsername('')).toBe(false);
    });
  });

  describe('validateJwtSecret', () => {
    it('should allow secrets with 32 or more characters', () => {
      expect(validateJwtSecret('a'.repeat(32))).toBe(true);
      expect(validateJwtSecret('a'.repeat(64))).toBe(true);
    });

    it('should reject secrets with less than 32 characters', () => {
      expect(validateJwtSecret('too_short')).toBe(false);
      expect(validateJwtSecret('a'.repeat(31))).toBe(false);
    });

    it('should reject undefined or empty secrets', () => {
      expect(validateJwtSecret(undefined)).toBe(false);
      expect(validateJwtSecret('')).toBe(false);
    });
  });
});
