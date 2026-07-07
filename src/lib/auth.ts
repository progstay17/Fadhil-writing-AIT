import { jwtVerify } from "jose";

/**
 * Validates a username to prevent property injection and ensure it follows expected format.
 * - Alphanumeric and underscores only
 * - 1 to 32 characters long
 * - Blacklist of common JS property names to prevent injection into objects like process.env
 */
export function isValidUsername(username: unknown): username is string {
  if (typeof username !== 'string') return false;

  if (username.length < 1 || username.length > 32) return false;

  // Alphanumeric and underscores only
  if (!/^[a-zA-Z0-9_]+$/.test(username)) return false;

  const blacklisted = ['__proto__', 'constructor', 'prototype', 'tostring', 'valueof'];
  if (blacklisted.includes(username.toLowerCase())) return false;

  return true;
}

export async function verifyToken(token: string): Promise<string | null> {
  try {
    const secretStr = process.env.JWT_SECRET;
    if (!secretStr || secretStr.length < 32) {
      console.error("JWT_SECRET is not defined or too short (min 32 characters)");
      return null;
    }
    const secret = new TextEncoder().encode(secretStr);
    const { payload } = await jwtVerify(token, secret);

    const username = payload.username;
    if (!isValidUsername(username)) {
      console.error("Invalid username in token payload");
      return null;
    }

    return username;
  } catch (error) {
    console.error("Token verification failed:", error);
    return null;
  }
}
