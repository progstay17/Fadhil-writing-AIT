import { jwtVerify } from "jose";

/**
 * Validates the format of a username to prevent property injection
 * and ensure consistent naming conventions.
 */
export function isValidUsername(username: unknown): boolean {
  if (typeof username !== "string") return false;

  // Alphanumeric and underscore only, 1-32 chars
  const usernameRegex = /^[a-zA-Z0-9_]{1,32}$/;
  if (!usernameRegex.test(username)) return false;

  // Case-insensitive blacklist for dangerous properties
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

    return username as string;
  } catch (error) {
    console.error("Token verification failed:", error);
    return null;
  }
}
