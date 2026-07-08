import { jwtVerify } from "jose";

/**
 * Validates a username to prevent property injection and ensure it follows
 * the expected format for environment variable lookups.
 */
export function isValidUsername(username: unknown): username is string {
  if (typeof username !== "string") return false;

  // Alphanumeric and underscores only, 1-32 characters
  const validRegex = /^[a-zA-Z0-9_]{1,32}$/;
  if (!validRegex.test(username)) return false;

  // Blacklist of property names that could lead to property injection
  const blacklist = ["__proto__", "constructor", "prototype", "tostring", "valueof"];
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
