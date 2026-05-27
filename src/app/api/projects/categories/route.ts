import { NextResponse, NextRequest } from "next/server";
import { verifySessionToken } from "@/lib/auth";
import { db, isFirebaseConfigured } from "@/lib/firebase";
import { collection, query, where, getDocs, updateDoc, doc } from "firebase/firestore";

export async function POST(req: NextRequest) {
  const token = req.cookies.get("admin_session")?.value;
  if (!(await verifySessionToken(token))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!isFirebaseConfigured || !db) {
    return NextResponse.json({ error: "Firebase not configured on server" }, { status: 503 });
  }

  try {
    const { oldName, newName, imageType } = await req.json();

    if (!oldName || !newName) {
      return NextResponse.json({ error: "oldName and newName are required" }, { status: 400 });
    }

    const q = query(collection(db!, "projects"), where("category", "==", oldName));
    const snapshot = await getDocs(q);

    const updatePromises = snapshot.docs.map((projectDoc) => {
      const docRef = doc(db!, "projects", projectDoc.id);
      
      const updates: any = {
        category: newName,
        updatedAt: new Date().toISOString()
      };
      
      if (imageType) {
        updates.imageType = imageType;
      }
      
      return updateDoc(docRef, updates);
    });

    await Promise.all(updatePromises);

    return NextResponse.json({ success: true, updatedCount: snapshot.docs.length });
  } catch (error) {
    console.error("Firestore Category Rename Error:", error);
    return NextResponse.json({ error: "Failed to rename category in Firestore" }, { status: 500 });
  }
}
