"use client";

import React from "react";
import FadeIn from "../ui/FadeIn";
import Section from "../ui/Section";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface SkillItem {
  name: string;
  level: string;
  tagline: string;
}

interface SkillCategory {
  category: string;
  glowColor: string;
  color: string;
  accent: string;
  borderHover: string;
  glowLight: string;
  icon: string;
  items: SkillItem[];
}

const SKILLS: SkillCategory[] = [
  {
    category: "Frontend",
    glowColor: "rgba(14, 165, 233, 0.12)",
    color: "text-sky-400",
    accent: "bg-sky-500",
    borderHover: "hover:border-sky-500/30",
    glowLight: "hover:shadow-[0_0_40px_rgba(14,165,233,0.15)]",
    icon: "🌐",
    items: [
      { name: "React.js", level: "Expert", tagline: "Dynamic UI rendering, custom hooks, context workflows" },
      { name: "Next.js 15", level: "Expert", tagline: "App Router, SSR/ISR config, server components" },
      { name: "TypeScript", level: "Expert", tagline: "Advanced typing patterns, generics, api models" },
      { name: "Tailwind CSS", level: "Expert", tagline: "Fluid custom layouts, component utility systems" },
      { name: "Framer Motion", level: "Advanced", tagline: "Fluid transitions, keyframes, layout anims" }
    ]
  },
  {
    category: "Mobile",
    glowColor: "rgba(139, 92, 246, 0.12)",
    color: "text-violet-400",
    accent: "bg-violet-500",
    borderHover: "hover:border-violet-500/30",
    glowLight: "hover:shadow-[0_0_40px_rgba(139,92,246,0.15)]",
    icon: "📱",
    items: [
      { name: "React Native", level: "Expert", tagline: "Perf tuning, custom native modules, cross-platform UI" },
      { name: "Flutter", level: "Advanced", tagline: "Widget composition, responsive visual systems" },
      { name: "Dart", level: "Advanced", tagline: "Async runtime, thread-free isolates, streams" },
      { name: "iOS/Android", level: "Advanced", tagline: "App store packaging, release automation, build tools" }
    ]
  },
  {
    category: "Backend & AI",
    glowColor: "rgba(16, 185, 129, 0.12)",
    color: "text-emerald-400",
    accent: "bg-emerald-500",
    borderHover: "hover:border-emerald-500/30",
    glowLight: "hover:shadow-[0_0_40px_rgba(16,185,129,0.15)]",
    icon: "🤖",
    items: [
      { name: "Node.js", level: "Expert", tagline: "Scalable secure middleware, custom API design" },
      { name: "PostgreSQL", level: "Advanced", tagline: "Structured optimization, query indexing, data schemas" },
      { name: "MongoDB", level: "Advanced", tagline: "BSON data aggregates, clusters, transactional layers" },
      { name: "OpenAI API", level: "Expert", tagline: "Model customization, system instructions, structured output" },
      { name: "LangChain", level: "Advanced", tagline: "Retrieval models, custom RAG agents, memory flows" }
    ]
  },
  {
    category: "Low Level",
    glowColor: "rgba(245, 158, 11, 0.12)",
    color: "text-amber-500",
    accent: "bg-amber-500",
    borderHover: "hover:border-amber-500/30",
    glowLight: "hover:shadow-[0_0_40px_rgba(245,158,11,0.15)]",
    icon: "🔌",
    items: [
      { name: "C/C++", level: "Advanced", tagline: "Optimized algorithm architectures, system tooling" },
      { name: "Embedded C", level: "Advanced", tagline: "Interrupt service routines, direct IO registry, firmware" },
      { name: "RTOS", level: "Proficient", tagline: "Task prioritizations, semaphores, real-time control" },
      { name: "Arduino/ESP32", level: "Expert", tagline: "Microcontroller meshes, IoT communication networks" }
    ]
  }
];

export default function Skills() {
  return (
    <Section id="skills" className="py-32 relative">
      <FadeIn className="mb-24 text-center relative z-10">
        <h2 className="text-4xl md:text-6xl font-bold tracking-tight mb-5">
          Technical <span className="text-zinc-500">Arsenal</span>
        </h2>
        <p className="text-muted text-lg max-w-2xl mx-auto text-balance">
          A high-performance toolkit curated to architect and deploy elite products,
          spanning from low-level silicon firmware to bleeding-edge AI models.
        </p>
      </FadeIn>

      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10 px-6 lg:px-0">
        {SKILLS.map((category, idx) => (
          <FadeIn 
            key={category.category} 
            delay={idx * 0.1}
            className={cn(
              "group relative flex flex-col justify-between glass-effect rounded-3xl p-8 border border-white/[0.04] bg-white/[0.01] transition-all duration-500 overflow-hidden",
              category.borderHover,
              category.glowLight,
              idx === 0 || idx === 2 ? "md:col-span-2" : "md:col-span-1"
            )}
            data-cursor="scale"
          >
            {/* Ambient Background Shimmer */}
            <div 
              className="absolute -inset-px opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none rounded-3xl"
              style={{
                background: `radial-gradient(circle at 50% 50%, ${category.glowColor}, transparent 70%)`
              }}
            />

            <div className="relative z-10">
              <div className="flex items-center gap-4 mb-8">
                <span className="text-4xl p-4 rounded-2xl bg-white/[0.03] border border-white/[0.05] shadow-inner">
                  {category.icon}
                </span>
                <div>
                  <h3 className="text-2xl font-bold text-zinc-100 tracking-tight">
                    {category.category}
                  </h3>
                  <p className="text-sm text-muted mt-1 uppercase tracking-wider">
                    {category.items.length} Modules
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap gap-3">
                {category.items.map((item, itemIdx) => (
                  <motion.div 
                    key={item.name}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 + (itemIdx * 0.05), duration: 0.4 }}
                    className="relative group/skill"
                  >
                    <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/[0.03] border border-white/[0.06] hover:bg-white/[0.08] hover:border-white/[0.15] transition-all cursor-default">
                      <span className="text-zinc-200 font-medium text-sm whitespace-nowrap">{item.name}</span>
                      <span className={cn(
                        "text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full border transition-colors",
                        item.level === "Expert" 
                          ? `bg-white/10 border-white/20 text-white` 
                          : "bg-white/5 border-transparent text-zinc-400"
                      )}>
                        {item.level}
                      </span>
                    </div>

                    {/* Tagline tooltip inside bento card (Desktop only) */}
                    <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-max max-w-[220px] pointer-events-none opacity-0 group-hover/skill:opacity-100 group-hover/skill:-translate-y-1 transition-all duration-300 z-20 hidden md:block">
                      <div className="bg-zinc-900 border border-white/10 text-xs text-zinc-300 p-2.5 rounded-lg shadow-2xl text-center backdrop-blur-md">
                        {item.tagline}
                      </div>
                      {/* Triangle pointer */}
                      <div className="w-2 h-2 bg-zinc-900 border-b border-r border-white/10 rotate-45 mx-auto -mt-1" />
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </FadeIn>
        ))}
      </div>
    </Section>
  );
}
