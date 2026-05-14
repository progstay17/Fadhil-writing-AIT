import { SignJWT } from "jose";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { username, password } = await req.json();

    if (!username || !password) {
      return NextResponse.json({ error: "Missing credentials" }, { status: 400 });
    }

    const envPassword = process.env[`USER_${username.toUpperCase()}_PASSWORD`];

    if (!envPassword || password !== envPassword) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    const secretStr = process.env.JWT_SECRET;
    if (!secretStr) {
      console.error("JWT_SECRET is not defined");
      return NextResponse.json({ error: "Server configuration error" }, { status: 500 });
    }

    const secret = new TextEncoder().encode(secretStr);
    const token = await new SignJWT({ username })
      .setProtectedHeader({ alg: "HS256" })
      .setExpirationTime("24h")
      .sign(secret);

    return NextResponse.json({ token });
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
