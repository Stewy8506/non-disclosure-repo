import { NextResponse, NextRequest } from "next/server";
import { verifySessionToken } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get("admin_session")?.value;
    const isValid = await verifySessionToken(token);
    return NextResponse.json({ authenticated: isValid });
  } catch (error) {
    return NextResponse.json({ authenticated: false }, { status: 500 });
  }
}
