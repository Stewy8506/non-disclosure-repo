"use client";

import FadeIn from "../ui/FadeIn";
import Section from "../ui/Section";
import { ExternalLink } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { GitHubIcon } from "../ui/BrandIcons";

const PROJECTS = [
  {
    title: "RN Habit Tracker",
    description: "A premium productivity ecosystem featuring a Pomodoro focus timer, real-time task management, and automatic DND mode for deep work.",
    tech: ["React Native", "TypeScript", "Expo"],
    link: "https://github.com/Stewy8506/RN-Habit-Tracker",
    category: "Mobile App",
    color: "from-blue-500/20 to-cyan-500/20"
  },
  {
    title: "Adaptive Noise Cancellation",
    description: "High-performance embedded system implemented on STM32 to actively filter ambient noise using adaptive signal processing algorithms.",
    tech: ["C", "STM32", "DSP"],
    link: "https://github.com/Stewy8506/STM32-Adaptive-Noise-Cancellation",
    category: "Embedded Systems",
    color: "from-purple-500/20 to-indigo-500/20"
  },
  {
    title: "AI Intelligence Suite",
    description: "Next-generation AI application exploring the boundaries of LLM integration for personalized productivity and automation.",
    tech: ["Next.js", "TypeScript", "OpenAI"],
    link: "https://github.com/Stewy8506/AI-App",
    category: "AI Product",
    color: "from-emerald-500/20 to-teal-500/20"
  },
  {
    title: "Smart Helmet OS",
    description: "Comprehensive hardware and software integration for a motorcycle smart helmet, featuring real-time telemetry and safety alerts.",
    tech: ["Embedded C", "Hardware", "IoT"],
    link: "https://github.com/Stewy8506/Smart-Helmet-Full-Hardware-Code",
    category: "Embedded Systems",
    color: "from-orange-500/20 to-red-500/20"
  }
];

export default function Projects() {
  return (
    <Section id="projects" className="py-32">
      <FadeIn className="mb-16 text-center">
        <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">
          Featured <span className="text-zinc-500">Works</span>
        </h2>
        <p className="text-muted text-lg max-w-2xl mx-auto text-balance">
          A selection of projects where I merge technical complexity with 
          minimalist design and high performance.
        </p>
      </FadeIn>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {PROJECTS.map((project, idx) => (
          <FadeIn key={project.title} delay={idx * 0.1}>
            <motion.a
              href={project.link}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ y: -5 }}
              className={cn(
                "relative block glass-effect p-8 rounded-3xl border border-white/10 group overflow-hidden transition-all hover:border-white/20",
              )}
            >
              {/* Subtle Background Glow */}
              <div className={cn(
                "absolute -inset-px bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-2xl",
                project.color
              )} />

              <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-medium px-3 py-1 rounded-full bg-white/[0.05] border border-white/10 text-muted">
                    {project.category}
                  </span>
                  <div className="flex gap-3">
                    <GitHubIcon className="w-5 h-5 text-muted group-hover:text-white transition-colors" />
                    <ExternalLink className="w-5 h-5 text-muted group-hover:text-white transition-colors" />
                  </div>
                </div>

                <h3 className="text-2xl font-bold mb-3 group-hover:text-white transition-colors">
                  {project.title}
                </h3>
                
                <p className="text-muted leading-relaxed mb-6 group-hover:text-zinc-400 transition-colors">
                  {project.description}
                </p>

                <div className="flex flex-wrap gap-2">
                  {project.tech.map((t) => (
                    <span key={t} className="text-[10px] uppercase tracking-wider font-bold px-2 py-1 rounded bg-zinc-900 text-zinc-500 border border-zinc-800">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </motion.a>
          </FadeIn>
        ))}
      </div>
    </Section>
  );
}
