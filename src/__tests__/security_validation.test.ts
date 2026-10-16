import { describe, it, expect } from 'vitest';
import { isValidUsername, isValidJwtSecret } from '../lib/validation';

describe('Security Validation', () => {
  describe('Username Regex Validation', () => {
    it('should accept valid usernames', () => {
      expect(isValidUsername('admin')).toBe(true);
      expect(isValidUsername('user_1')).toBe(true);
      expect(isValidUsername('USER123')).toBe(true);
      expect(isValidUsername('john_doe_99')).toBe(true);
    });

    it('should reject usernames with special characters', () => {
      expect(isValidUsername('user!')).toBe(false);
      expect(isValidUsername('admin@domain')).toBe(false);
      expect(isValidUsername('user#1')).toBe(false);
    });

    it('should reject usernames with spaces', () => {
      expect(isValidUsername('user name')).toBe(false);
      expect(isValidUsername(' admin')).toBe(false);
      expect(isValidUsername('user ')).toBe(false);
    });

    it('should reject path traversal attempts', () => {
      expect(isValidUsername('../admin')).toBe(false);
      expect(isValidUsername('/etc/passwd')).toBe(false);
    });

    it('should reject empty or undefined usernames', () => {
      expect(isValidUsername('')).toBe(false);
      expect(isValidUsername(undefined)).toBe(false);
    });
  });

  describe('JWT Secret Length Validation', () => {
    it('should accept secrets with 32 characters or more', () => {
      expect(isValidJwtSecret('a'.repeat(32))).toBe(true);
      expect(isValidJwtSecret('a'.repeat(64))).toBe(true);
    });

    it('should reject secrets with less than 32 characters', () => {
      expect(isValidJwtSecret('a'.repeat(31))).toBe(false);
      expect(isValidJwtSecret('short_secret')).toBe(false);
    });

    it('should reject undefined or empty secrets', () => {
      expect(isValidJwtSecret(undefined)).toBe(false);
      expect(isValidJwtSecret('')).toBe(false);
    });
  });
});
