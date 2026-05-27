"use client";

import React from "react";
import FadeIn from "@/components/ui/FadeIn";
import { Network, Database } from "lucide-react";
import MermaidDiagram from "@/components/ui/MermaidDiagram";
import { Project } from "@/lib/projects";

export default function DynamicCaseStudySections({ project }: { project: Project }) {
  if (
    !project.architectureDiagram &&
    !project.databaseSchema &&
    !project.stateManagement &&
    (!project.challenges || project.challenges.length === 0)
  ) {
    return null;
  }

  return (
    <div className="pt-16 border-t border-white/[0.06] space-y-24">
      {/* Architecture & Database Schema */}
      {(project.architectureDiagram || project.databaseSchema) && (
        <FadeIn className="space-y-10">
          <div className="flex flex-col gap-3">
            <span className="text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full bg-white/[0.04] border border-white/[0.08] text-emerald-400 w-fit">
              Technical Architecture
            </span>
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              System Architecture & Design
            </h2>
            <p className="text-zinc-500 max-w-2xl leading-relaxed text-sm">
              A high-level blueprint of design decisions, communication pathways, and structural data relationships.
            </p>
          </div>

          {project.architectureDiagram && (
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-zinc-300 font-semibold">
                <Network className="w-4 h-4 text-emerald-400" />
                Core Architecture Flow
              </div>
              <MermaidDiagram code={project.architectureDiagram} id={`${project.id || "proj"}-arch`} />
            </div>
          )}

          {project.databaseSchema && (
            <div className="space-y-3 pt-2">
              <div className="flex items-center gap-2 text-zinc-300 font-semibold">
                <Database className="w-4 h-4 text-cyan-400" />
                Database Schema
              </div>
              <MermaidDiagram code={project.databaseSchema} id={`${project.id || "proj"}-db`} />
            </div>
          )}
        </FadeIn>
      )}

      {/* State Management */}
      {project.stateManagement && (
        <FadeIn className="space-y-6">
          <div className="flex flex-col gap-3">
            <span className="text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full bg-white/[0.04] border border-white/[0.08] text-blue-400 w-fit">
              Data Flow
            </span>
            <h2 className="text-3xl font-bold tracking-tight text-white">
              State Management Strategy
            </h2>
          </div>
          <div className="rounded-3xl border border-white/[0.06] bg-white/[0.02] p-8 backdrop-blur-sm leading-relaxed text-zinc-300 text-sm">
            <p className="whitespace-pre-wrap">{project.stateManagement}</p>
          </div>
        </FadeIn>
      )}

      {/* Technical Challenges */}
      {project.challenges && project.challenges.length > 0 && (
        <FadeIn className="space-y-10">
          <div className="flex flex-col gap-3">
            <span className="text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full bg-white/[0.04] border border-white/[0.08] text-red-400 w-fit">
              Post-Mortem
            </span>
            <h2 className="text-3xl font-bold tracking-tight text-white">
              Technical Challenges & Solutions
            </h2>
            <p className="text-zinc-500 max-w-2xl leading-relaxed text-sm">
              Real engineering hurdles faced during development, and the techniques used to resolve them.
            </p>
          </div>

          <div className="grid gap-5">
            {project.challenges.map((challenge, idx) => (
              <div
                key={idx}
                className="group rounded-3xl border border-white/[0.05] bg-white/[0.015] p-6 md:p-8 hover:border-white/[0.12] hover:bg-white/[0.03] transition-all duration-500 backdrop-blur-sm"
              >
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="md:w-1/3 space-y-1.5">
                    <div className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">
                      Challenge {idx + 1}
                    </div>
                    <h3 className="text-base font-bold text-zinc-100 group-hover:text-emerald-400 transition-colors leading-snug">
                      {challenge.title}
                    </h3>
                  </div>
                  <div className="md:w-2/3 space-y-4">
                    <div className="space-y-1">
                      <span className="text-[9px] font-bold text-red-400 uppercase tracking-widest">Problem</span>
                      <p className="text-zinc-400 leading-relaxed text-sm">{challenge.description}</p>
                    </div>
                    <div className="space-y-1 pt-3 border-t border-white/[0.05]">
                      <span className="text-[9px] font-bold text-emerald-400 uppercase tracking-widest">Resolution</span>
                      <p className="text-zinc-400 leading-relaxed text-sm">{challenge.solution}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </FadeIn>
      )}
    </div>
  );
}
