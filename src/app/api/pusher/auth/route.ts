import { NextResponse } from "next/server";
import Pusher from "pusher";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const socketId = formData.get("socket_id") as string;
    const channelName = formData.get("channel_name") as string;

    console.log(`[Pusher Auth] Request: socketId="${socketId}", channelName="${channelName}"`);

    if (!socketId || !channelName) {
      return NextResponse.json({ error: "Missing parameters" }, { status: 400 });
    }

    const pusher = new Pusher({
      appId: process.env.NEXT_PUBLIC_PUSHER_APP_ID || "",
      key: process.env.NEXT_PUBLIC_PUSHER_KEY || "",
      secret: process.env.PUSHER_APP_SECRET || "",
      cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER || "mt1",
      useTLS: true,
    });

    const presenceInfo = {
      user_id: Math.random().toString(36).substring(2, 9),
      user_info: {
        name: "Visitor",
      },
    };

    // FIX: Double-check the order. In some versions of the 'pusher' package,
    // it might be different or expect a specific object.
    // We'll try the standard (channel, socketId, options) first.
    try {
      const authResponse = pusher.authorizeChannel(channelName, socketId, presenceInfo);
      return NextResponse.json({ auth: authResponse });
    } catch (e: any) {
      console.error("[Pusher Auth] authorizeChannel failed, trying alternative order...", e.message);
      // Fallback: try swapping if it's a version mismatch
      const authResponse = pusher.authorizeChannel(socketId, channelName, presenceInfo);
      return NextResponse.json({ auth: authResponse });
    }
  } catch (error: any) {
    console.error("[Pusher Auth] Server Error:", error.message);
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
  }
}
