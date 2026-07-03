import { jwtVerify } from "jose";

export function isValidUsername(username: unknown): username is string {
  if (typeof username !== "string") return false;

  // Alphanumeric and underscores only
  const regex = /^[a-zA-Z0-9_]+$/;
  if (!regex.test(username)) return false;

  // Length limit
  if (username.length < 1 || username.length > 32) return false;

  // Blacklist sensitive property names
  const blacklist = ["__proto__", "constructor", "tostring", "toprimitive"];
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
      console.error("Invalid username in token");
      return null;
    }
    return username;
  } catch (error) {
    console.error("Token verification failed:", error);
    return null;
  }
}
