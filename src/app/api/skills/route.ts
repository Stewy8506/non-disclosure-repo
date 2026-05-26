/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, @next/next/no-img-element, react-hooks/exhaustive-deps */
import { NextResponse, NextRequest } from "next/server";
import { verifySessionToken } from "@/lib/auth";
import { db, isFirebaseConfigured } from "@/lib/firebase";
import { collection, getDocs, addDoc, deleteDoc, doc } from "firebase/firestore";
import fs from "fs/promises";
import path from "path";
import { normalizeSkillCategory } from "@/lib/projects";

const LOCAL_DATA_PATH = path.join(process.cwd(), "src/data/skills.json");

// Helper to load static fallback skills if Firestore is unconfigured or empty
async function getLocalSkills() {
  try {
    const data = await fs.readFile(LOCAL_DATA_PATH, "utf8");
    const parsed = JSON.parse(data);
    return parsed.map((s: any, idx: number) => ({
      id: s.id || s.slug || `skill-${idx}`,
      ...s
    }));
  } catch (error) {
    return [];
  }
}

export async function GET() {
  if (!isFirebaseConfigured || !db) {
    const localData = await getLocalSkills();
    return NextResponse.json(localData);
  }

  try {
    const querySnapshot = await getDocs(collection(db, "skills"));
    const skills: any[] = [];
    
    querySnapshot.forEach((docSnap) => {
      const data = docSnap.data();
      skills.push({
        id: docSnap.id,
        ...data,
      });
    });

    if (skills.length === 0) {
      const localData = await getLocalSkills();
      return NextResponse.json(localData);
    }

    return NextResponse.json(skills);
  } catch (error) {
    console.error("Firestore Skills Fetch Error:", error);
    const localData = await getLocalSkills();
    return NextResponse.json(localData);
  }
}

export async function POST(req: NextRequest) {
  const token = req.cookies.get("admin_session")?.value;
  if (!(await verifySessionToken(token))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!isFirebaseConfigured || !db) {
    return NextResponse.json({ error: "Firebase not configured on server" }, { status: 503 });
  }

  try {
    const body = await req.json();
    
    const docRef = await addDoc(collection(db, "skills"), {
      name: body.name || "",
      slug: body.slug || "",
      category: normalizeSkillCategory(body.category),
      white: !!body.white,
      createdAt: new Date().toISOString()
    });

    const newSkill = {
      id: docRef.id,
      ...body
    };

    return NextResponse.json(newSkill);
  } catch (error) {
    console.error("Firestore Skill POST Error:", error);
    return NextResponse.json({ error: "Failed to save skill to Firestore" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const token = req.cookies.get("admin_session")?.value;
  if (!(await verifySessionToken(token))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!isFirebaseConfigured || !db) {
    return NextResponse.json({ error: "Firebase not configured on server" }, { status: 503 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }

    await deleteDoc(doc(db, "skills", id));
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Firestore Skill DELETE Error:", error);
    return NextResponse.json({ error: "Failed to delete skill" }, { status: 500 });
  }
}
