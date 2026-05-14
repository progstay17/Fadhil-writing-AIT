import { verifyToken } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const token = req.cookies.get("ait_token")?.value;
  if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const username = await verifyToken(token);
  if (!username) return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  return NextResponse.json({ username });
}
