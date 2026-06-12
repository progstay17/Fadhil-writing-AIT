import { jwtVerify } from "jose";
import { isValidJwtSecret } from "./validation";

export async function verifyToken(token: string): Promise<string | null> {
  try {
    const secretStr = process.env.JWT_SECRET;
    if (!isValidJwtSecret(secretStr)) {
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
