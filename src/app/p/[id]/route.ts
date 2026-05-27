import { NextRequest, NextResponse } from "next/server";
import { db, isFirebaseConfigured } from "@/lib/firebase";
import { collection, getDocs } from "firebase/firestore";
import fs from "fs/promises";
import path from "path";
import { getProjectShortCode, Project } from "@/lib/projects";

const LOCAL_DATA_PATH = path.join(process.cwd(), "src/data/projects.json");

async function getLocalProjects() {
  try {
    const data = await fs.readFile(LOCAL_DATA_PATH, "utf8");
    const parsed = JSON.parse(data);
    return parsed.map((p: any, idx: number) => ({
      id: p.id || p.title.toLowerCase().replace(/[^a-z0-9]+/g, "-") || `project-${idx}`,
      ...p
    }));
  } catch (error) {
    return [];
  }
}

async function getAllProjects(): Promise<Project[]> {
  if (!isFirebaseConfigured || !db) {
    const localData = await getLocalProjects();
    localData.sort((a: any, b: any) => (a.order || 0) - (b.order || 0));
    return localData;
  }

  try {
    const querySnapshot = await getDocs(collection(db, "projects"));
    const projects: any[] = [];
    
    querySnapshot.forEach((docSnap) => {
      const data = docSnap.data();
      projects.push({
        id: docSnap.id,
        ...data,
      });
    });

    if (projects.length === 0) {
      const localData = await getLocalProjects();
      localData.sort((a: any, b: any) => (a.order || 0) - (b.order || 0));
      return localData;
    }

    projects.sort((a, b) => (a.order || 0) - (b.order || 0));
    return projects;
  } catch (error) {
    const localData = await getLocalProjects();
    return localData;
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const shortId = id.toLowerCase();
  const projects = await getAllProjects();

  // Find project by matching slug, initials, prefix, or index
  const project = projects.find((p: Project, idx: number) => {
    const slug = (p.id || p.title.toLowerCase().replace(/[^a-z0-9]+/g, "-")).toLowerCase();
    const initials = getProjectShortCode(p).toLowerCase();
    
    return (
      slug === shortId ||
      initials === shortId ||
      slug.startsWith(shortId) ||
      `p${idx}` === shortId
    );
  });

  if (project) {
    const slug = project.id || project.title.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    return NextResponse.redirect(new URL(`/projects/${slug}`, request.url));
  }

  // Fallback to home page if not found
  return NextResponse.redirect(new URL("/", request.url));
}
