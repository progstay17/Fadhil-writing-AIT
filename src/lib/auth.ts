import { jwtVerify } from "jose";

/**
 * Validates username format to prevent injection attacks and unexpected property access
 * when used as a key for dynamic object lookups (e.g., process.env).
 */
export function isValidUsername(username: string): boolean {
  if (!username || username.length < 1 || username.length > 32) return false;
  if (!/^[a-zA-Z0-9_]+$/.test(username)) return false;

  const blacklist = ["__proto__", "constructor", "tostring", "hasownproperty", "valueof"];
  if (blacklist.includes(username.toLowerCase())) return false;

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
    return payload.username as string;
  } catch (error) {
    console.error("Token verification failed:", error);
    return null;
  }
}
