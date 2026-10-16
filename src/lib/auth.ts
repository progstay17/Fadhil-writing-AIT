import { jwtVerify } from "jose";

export function isValidUsername(username: unknown): username is string {
  const forbidden = ["__proto__", "constructor", "prototype", "tostring", "valueof"];
  return (
    typeof username === "string" &&
    username.length > 0 &&
    username.length <= 32 &&
    /^[a-zA-Z0-9_]+$/.test(username) &&
    !forbidden.includes(username.toLowerCase())
  );
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
