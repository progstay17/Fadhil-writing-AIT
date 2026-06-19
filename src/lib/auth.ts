import { jwtVerify } from "jose";

/**
 * Validates that the username contains only alphanumeric characters and underscores.
 * This prevents potential injection risks when using the username as a key for environment lookups.
 */
export function isValidUsername(username: unknown): username is string {
  if (typeof username !== "string") return false;
  return /^[a-zA-Z0-9_]+$/.test(username);
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
      console.error("Invalid username format in token");
      return null;
    }

    return username;
  } catch (error) {
    console.error("Token verification failed:", error);
    return null;
  }
}
