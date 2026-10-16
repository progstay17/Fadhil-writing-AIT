import { jwtVerify } from "jose";

export function isValidUsername(username: unknown): username is string {
  if (typeof username !== "string") return false;

  // Alphanumeric and underscores only, 1-32 chars
  const regex = /^[a-zA-Z0-9_]+$/;
  if (!regex.test(username) || username.length < 1 || username.length > 32) {
    return false;
  }

  // Prevent property injection/prototype pollution
  const blacklist = ["__proto__", "constructor", "tostring"];
  if (blacklist.includes(username.toLowerCase())) {
    return false;
  }

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
      return null;
    }

    return username;
  } catch (error) {
    console.error("Token verification failed:", error);
    return null;
  }
}
