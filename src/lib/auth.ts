import { jwtVerify } from "jose";

const DANGEROUS_PROPERTIES = [
  "__proto__",
  "constructor",
  "prototype",
  "tostring",
  "valueof",
  "hasownproperty",
  "isprototypeof",
  "propertyisenumerable",
  "tolocalestring",
];

/**
 * Validates username format to prevent injection and property manipulation.
 * - Must be a string
 * - 1-32 characters
 * - Alphanumeric and underscores only
 * - Not a dangerous property name
 */
export function isValidUsername(username: unknown): username is string {
  if (typeof username !== "string") return false;
  if (username.length === 0 || username.length > 32) return false;

  // Alphanumeric and underscores only
  const regex = /^[a-zA-Z0-9_]+$/;
  if (!regex.test(username)) return false;

  // Prevent property injection
  if (DANGEROUS_PROPERTIES.includes(username.toLowerCase())) return false;

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
