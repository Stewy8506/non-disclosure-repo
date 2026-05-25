import { NextResponse, NextRequest } from "next/server";
import { verifySessionToken } from "@/lib/auth";
import { db, isFirebaseConfigured } from "@/lib/firebase";
import { doc, updateDoc } from "firebase/firestore";

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const token = req.cookies.get("admin_session")?.value;
  if (!(await verifySessionToken(token))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!isFirebaseConfigured || !db) {
    return NextResponse.json({ error: "Firebase not configured on server" }, { status: 503 });
  }

  try {
    const { id } = await params;
    const body = await req.json();
    
    const docRef = doc(db, "skills", id);
    await updateDoc(docRef, {
      name: body.name,
      slug: body.slug,
      category: body.category,
      white: !!body.white,
      updatedAt: new Date().toISOString()
    });

    return NextResponse.json({ id, ...body });
  } catch (error) {
    console.error("Firestore Skill PUT Error:", error);
    return NextResponse.json({ error: "Failed to update skill" }, { status: 500 });
  }
}
