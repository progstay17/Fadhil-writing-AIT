import { jwtVerify } from "jose";

export function isValidUsername(username: string): boolean {
  if (!username || typeof username !== "string") return false;
  if (username.length < 1 || username.length > 32) return false;

  // Alphanumeric and underscore only
  if (!/^[a-zA-Z0-9_]+$/.test(username)) return false;

  // Blacklist of dangerous property names to prevent injection/unexpected behavior
  const blacklist = ["__proto__", "constructor", "prototype", "tostring", "hasownproperty"];
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
    const username = payload.username as string;

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
