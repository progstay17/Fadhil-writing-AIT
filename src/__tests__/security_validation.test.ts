/** @vitest-environment node */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { verifyToken } from '../lib/auth';
import { SignJWT } from 'jose';

describe('Security Validation', () => {
  beforeEach(() => {
    vi.resetModules();
    process.env.JWT_SECRET = 'a-very-long-secret-at-least-32-chars-long';
  });

  it('should return null if JWT_SECRET is too short', async () => {
    process.env.JWT_SECRET = 'short';
    expect(await verifyToken('any')).toBeNull();
  });

  it('should return null for invalid username characters in token', async () => {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    const token = await new SignJWT({ username: 'user; DROP TABLE' }).setProtectedHeader({ alg: 'HS256' }).sign(secret);
    expect(await verifyToken(token)).toBeNull();
  });

  it('should return null for spaces in username', async () => {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    const token = await new SignJWT({ username: 'user name' }).setProtectedHeader({ alg: 'HS256' }).sign(secret);
    expect(await verifyToken(token)).toBeNull();
  });

  it('should return username if it is valid', async () => {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    const token = await new SignJWT({ username: 'valid_user' }).setProtectedHeader({ alg: 'HS256' }).sign(secret);
    expect(await verifyToken(token)).toBe('valid_user');
  });
});
