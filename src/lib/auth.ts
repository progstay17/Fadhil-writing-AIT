import { jwtVerify } from "jose";
import { isValidUsername, isValidJwtSecret } from "./validation";

export async function verifyToken(token: string): Promise<string | null> {
  try {
    const secretStr = process.env.JWT_SECRET;
    if (!isValidJwtSecret(secretStr)) {
      console.error("JWT_SECRET is not defined or too short (min 32 characters)");
      return null;
    }
    const secret = new TextEncoder().encode(secretStr as string);
    const { payload } = await jwtVerify(token, secret);
    const username = payload.username as string;

    // Defense in depth: validate username format from token
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
