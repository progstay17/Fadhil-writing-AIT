import { jwtVerify } from "jose";

/**
 * Validates a username to prevent property injection and ensuring proper format.
 * - Alphanumeric and underscores only
 * - 1-32 characters
 * - Blacklists dangerous property names (case-insensitive)
 */
export function isValidUsername(username: unknown): username is string {
  if (typeof username !== "string") return false;
  if (username.length < 1 || username.length > 32) return false;

  // Alphanumeric and underscore only
  const regex = /^[a-zA-Z0-9_]+$/;
  if (!regex.test(username)) return false;

  // Property injection blacklist
  const blacklist = ["__proto__", "constructor", "tostring"];
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
