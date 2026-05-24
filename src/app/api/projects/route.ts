import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

const DATA_PATH = path.join(process.cwd(), "src/data/projects.json");

export async function GET() {
  try {
    const data = await fs.readFile(DATA_PATH, "utf8");
    return NextResponse.json(JSON.parse(data));
  } catch (error) {
    return NextResponse.json({ error: "Failed to load projects" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    
    const authHeader = req.headers.get("authorization");
    if (authHeader !== `Bearer ${process.env.ADMIN_PASSWORD}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data = await fs.readFile(DATA_PATH, "utf8");
    const projects = JSON.parse(data);
    
    const newProject = {
      ...body,
      id: Date.now().toString(),
    };
    
    projects.push(newProject);
    await fs.writeFile(DATA_PATH, JSON.stringify(projects, null, 2));
    
    return NextResponse.json(newProject);
  } catch (error) {
    return NextResponse.json({ error: "Failed to save project" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    
    const authHeader = req.headers.get("authorization");
    if (authHeader !== `Bearer ${process.env.ADMIN_PASSWORD}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }

    const data = await fs.readFile(DATA_PATH, "utf8");
    let projects = JSON.parse(data);
    
    const initialLength = projects.length;
    projects = projects.filter((p: any) => p.id !== id);

    if (projects.length === initialLength) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    await fs.writeFile(DATA_PATH, JSON.stringify(projects, null, 2));
    
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete project" }, { status: 500 });
  }
}
