import { jwtVerify } from "jose";

export async function verifyToken(token: string): Promise<string | null> {
  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET || "default_secret_at_least_32_characters_long");
    const { payload } = await jwtVerify(token, secret);
    return payload.username as string;
  } catch (error) {
    console.error("Token verification failed:", error);
    return null;
  }
}
