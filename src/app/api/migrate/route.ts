import { NextResponse, NextRequest } from "next/server";
import { db, isFirebaseConfigured } from "@/lib/firebase";
import { collection, addDoc, getDocs } from "firebase/firestore";
import fs from "fs/promises";
import path from "path";

export async function GET(req: NextRequest) {
  if (!isFirebaseConfigured || !db) {
    return NextResponse.json({ error: "Firebase not configured on server" }, { status: 503 });
  }

  try {
    // 1. Check if Firestore already has data to prevent duplicate seeding
    const querySnapshot = await getDocs(collection(db, "projects"));
    if (!querySnapshot.empty) {
      return NextResponse.json({ 
        message: "Firestore already contains projects. Migration skipped to prevent duplicates.",
        count: querySnapshot.size
      });
    }

    // 2. Read local JSON
    const LOCAL_DATA_PATH = path.join(process.cwd(), "src/data/projects.json");
    let localData = [];
    try {
      const data = await fs.readFile(LOCAL_DATA_PATH, "utf8");
      localData = JSON.parse(data);
    } catch (e) {
      return NextResponse.json({ error: "Could not read src/data/projects.json" }, { status: 404 });
    }

    if (!localData || localData.length === 0) {
      return NextResponse.json({ message: "Local data is empty, nothing to migrate." });
    }

    // 3. Write each project to Firestore
    const migrated = [];
    for (const project of localData) {
      // Remove any static 'id' if it exists so Firestore can autogenerate it, 
      // or we can keep it as a field.
      const { id, ...projectData } = project;
      
      const docRef = await addDoc(collection(db, "projects"), {
        ...projectData,
        createdAt: new Date().toISOString()
      });
      
      migrated.push({ newId: docRef.id, title: projectData.title });
    }

    return NextResponse.json({
      success: true,
      message: `Successfully migrated ${migrated.length} projects to Firestore.`,
      migrated
    });
  } catch (error) {
    console.error("Migration Error:", error);
    return NextResponse.json({ error: "Migration failed", details: String(error) }, { status: 500 });
  }
}
