"use client";

import React from "react";
import FadeIn from "../ui/FadeIn";
import Section from "../ui/Section";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const ROW1 = [
  { name: "React.js", icon: "⚛️" },
  { name: "TypeScript", icon: "🔷" },
  { name: "PostgreSQL", icon: "🐘" },
  { name: "AWS", icon: "☁️" },
  { name: "C++", icon: "⚙️" },
  { name: "React Native", icon: "📱" },
  { name: "Docker", icon: "🐳" },
  { name: "Python", icon: "🐍" },
  { name: "WebSockets", icon: "⚡" },
  { name: "GraphQL", icon: "🕸️" }
];

const ROW2 = [
  { name: "Next.js 15", icon: "▲" },
  { name: "Tailwind CSS", icon: "🌊" },
  { name: "MongoDB", icon: "🍃" },
  { name: "Kubernetes", icon: "☸️" },
  { name: "Rust", icon: "🦀" },
  { name: "Flutter", icon: "🦋" },
  { name: "Serverless", icon: "⚡" },
  { name: "PyTorch", icon: "🔥" },
  { name: "TRPC", icon: "🔗" },
  { name: "Embedded C", icon: "🔌" }
];

const ROW3 = [
  { name: "Framer Motion", icon: "✨" },
  { name: "Redis", icon: "🔴" },
  { name: "Expo", icon: "🚀" },
  { name: "Swift", icon: "🍎" },
  { name: "Kotlin", icon: "🤖" },
  { name: "OpenAI API", icon: "🧠" },
  { name: "LangChain", icon: "🦜" },
  { name: "RTOS", icon: "⏱️" },
  { name: "ESP32", icon: "📡" }
];

const MarqueeRow = ({ 
  items, 
  speed = 40, 
  direction = "left" 
}: { 
  items: {name:string, icon:string}[], 
  speed?: number, 
  direction?: "left" | "right" 
}) => {
  return (
    <div 
      className="flex w-full overflow-hidden relative py-3"
      style={{ WebkitMaskImage: "linear-gradient(to right, transparent, black 10%, black 90%, transparent)", maskImage: "linear-gradient(to right, transparent, black 10%, black 90%, transparent)" }}
    >
      <motion.div
        className="flex w-max gap-6 px-3"
        initial={{ x: direction === "left" ? 0 : "-50%" }}
        animate={{ x: direction === "left" ? "-50%" : 0 }}
        transition={{ duration: speed, repeat: Infinity, ease: "linear" }}
      >
        {[...items, ...items].map((item, idx) => (
          <div 
            key={`${item.name}-${idx}`}
            className="flex items-center gap-4 px-8 py-5 rounded-2xl glass-effect border border-white/[0.05] bg-white/[0.02] hover:bg-white/[0.06] hover:border-white/[0.15] hover:shadow-[0_0_30px_rgba(255,255,255,0.05)] transition-all duration-300 cursor-default group"
          >
            <span className="text-3xl group-hover:scale-110 transition-transform duration-300 drop-shadow-md">
              {item.icon}
            </span>
            <span className="text-xl font-semibold text-zinc-300 group-hover:text-white transition-colors tracking-tight">
              {item.name}
            </span>
          </div>
        ))}
      </motion.div>
    </div>
  )
}

export default function Skills() {
  return (
    <Section id="skills" className="py-32 relative overflow-hidden">
      {/* Dynamic Background Glows */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none -z-10" />
      <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-[500px] h-[500px] bg-violet-500/10 rounded-full blur-[120px] pointer-events-none -z-10" />

      <FadeIn className="mb-20 text-center relative z-10 px-6">
        <h2 className="text-4xl md:text-6xl font-bold tracking-tight mb-5">
          Technical <span className="text-zinc-500">Ecosystem</span>
        </h2>
        <p className="text-muted text-lg max-w-2xl mx-auto text-balance">
          A dynamic, full-stack arsenal built for architecting high-performance applications, 
          from low-level systems to cutting-edge AI and mobile experiences.
        </p>
      </FadeIn>

      <div className="relative z-10 flex flex-col gap-2 w-full max-w-[100vw]">
        <MarqueeRow items={ROW1} speed={45} direction="left" />
        <MarqueeRow items={ROW2} speed={55} direction="right" />
        <MarqueeRow items={ROW3} speed={40} direction="left" />
      </div>
      
    </Section>
  );
}
