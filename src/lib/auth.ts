import { jwtVerify } from "jose";

// ⚡ Bolt Optimization: Reuse TextEncoder and cache the encoded JWT secret to avoid
// redundant encoding operations on every authentication check.
const encoder = new TextEncoder();
let cachedSecret: Uint8Array | null = null;

export async function verifyToken(token: string): Promise<string | null> {
  try {
    if (!cachedSecret) {
      const secretStr = process.env.JWT_SECRET;
      if (!secretStr || secretStr.length < 32) {
        console.error("JWT_SECRET is not defined or too short (min 32 characters)");
        return null;
      }
      cachedSecret = encoder.encode(secretStr);
    }

    const { payload } = await jwtVerify(token, cachedSecret);
    return payload.username as string;
  } catch (error) {
    console.error("Token verification failed:", error);
    return null;
  }
}
