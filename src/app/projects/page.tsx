"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, LayoutGrid, Rows, Maximize } from "lucide-react";
import ProjectPreviewModal from "@/components/ui/ProjectPreviewModal";
import ProjectsBento from "../../components/sections/ProjectsBento";
import ProjectsCinematic from "../../components/sections/ProjectsCinematic";
import ProjectsHorizontal from "../../components/sections/ProjectsHorizontal";

type ViewMode = "cinematic" | "horizontal";

export default function AllProjectsPage() {
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<ViewMode>("cinematic");
  const [selectedProject, setSelectedProject] = useState<any>(null);

  useEffect(() => {
    async function loadProjects() {
      try {
        const res = await fetch("/api/projects");
        const data = await res.json();
        setProjects(data);
      } catch (e) {
        console.error("Failed to fetch projects", e);
      } finally {
        setLoading(false);
      }
    }
    loadProjects();
  }, []);

  if (loading) {
    return (
      <main className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-white/20 border-r-2 border-r-white/20 border-b-2 border-white" />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-zinc-950 text-white relative z-0 flex flex-col overflow-hidden">
      {/* Header */}
      <header className="fixed top-0 z-40 w-full bg-zinc-950/80 backdrop-blur-xl border-b border-white/5 py-4 px-6 lg:px-12 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-6">
          <Link 
            href="/#projects" 
            className="flex items-center justify-center w-10 h-10 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
          >
            <ArrowLeft size={18} />
          </Link>
          <h1 className="text-2xl font-semibold tracking-tight uppercase">Selected Works</h1>
        </div>

        {/* View Toggle */}
        <div className="flex items-center gap-2 p-1 bg-white/5 rounded-full border border-white/10">
          <button
            onClick={() => setViewMode("cinematic")}
            className={`flex items-center gap-2 px-6 py-2 rounded-full text-xs font-semibold uppercase tracking-wider transition-all ${
              viewMode === "cinematic" ? "bg-white text-black shadow-[0_0_20px_rgba(255,255,255,0.3)] scale-105" : "text-zinc-400 hover:text-white"
            }`}
          >
            <Rows size={14} /> Cinematic
          </button>
          <button
            onClick={() => setViewMode("horizontal")}
            className={`flex items-center gap-2 px-6 py-2 rounded-full text-xs font-semibold uppercase tracking-wider transition-all ${
              viewMode === "horizontal" ? "bg-white text-black shadow-[0_0_20px_rgba(255,255,255,0.3)] scale-105" : "text-zinc-400 hover:text-white"
            }`}
          >
            <Maximize size={14} /> 3D Gallery
          </button>
        </div>
      </header>
      
      {/* Dynamic Viewport */}
      <div className="flex-1 w-full relative pt-[130px] md:pt-[88px]">
        {viewMode === "cinematic" && <ProjectsCinematic projects={projects} onSelect={setSelectedProject} />}
        {viewMode === "horizontal" && <ProjectsHorizontal projects={projects} onSelect={setSelectedProject} />}
      </div>

      <ProjectPreviewModal 
        project={selectedProject} 
        isOpen={!!selectedProject} 
        onClose={() => setSelectedProject(null)} 
      />
    </main>
  );
}
