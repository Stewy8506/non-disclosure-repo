import { NextResponse } from "next/server";
import { createSessionToken } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const { password } = await req.json();
    
    if (password === process.env.ADMIN_PASSWORD) {
      const token = await createSessionToken();
      const response = NextResponse.json({ success: true });
      response.cookies.set("admin_session", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 60 * 60 * 24, // 24 hours
        path: "/",
      });
      return response;
    }

    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
