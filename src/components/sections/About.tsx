"use client";

import FadeIn from "../ui/FadeIn";
import Section from "../ui/Section";
import { Terminal, Cpu, Layers } from "lucide-react";
import GitHubStats from "./GitHubStats";

export default function About() {
  return (
    <Section id="about" className="py-32 relative">
      <FadeIn className="mb-16 text-center lg:text-left relative z-10 px-6 max-w-5xl mx-auto">
        <h2 className="text-4xl md:text-6xl font-bold tracking-tight">
          Behind the <span className="text-zinc-500">Code</span>
        </h2>
      </FadeIn>

      <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6 px-6 lg:px-0 relative z-10">

        {/* Main Bio Card */}
        <FadeIn className="lg:col-span-2 group relative glass-effect rounded-2xl p-6 md:p-8 overflow-hidden transition-all duration-500 hover:border-zinc-700 hover:shadow-[0_8px_30px_rgb(0,0,0,0.5)]" data-cursor="scale">
          {/* macOS Window Controls */}
          <div className="absolute top-5 left-5 flex items-center gap-1.5 z-20">
            <div className="w-3 h-3 rounded-full bg-red-500/80 border border-red-500/50"></div>
            <div className="w-3 h-3 rounded-full bg-amber-500/80 border border-amber-500/50"></div>
            <div className="w-3 h-3 rounded-full bg-emerald-500/80 border border-emerald-500/50"></div>
          </div>

          {/* Ambient Glow */}
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none opacity-40 group-hover:opacity-100 transition-opacity duration-700" />

          <div className="relative z-10 flex flex-col h-full justify-center">
            <Terminal className="w-8 h-8 text-zinc-500 mb-8 group-hover:text-emerald-400 transition-colors duration-500" />
            <h3 className="text-3xl md:text-4xl font-black mb-8 tracking-tighter text-white text-balance leading-none">
              Engineering <span className="text-emerald-400 drop-shadow-[0_0_15px_rgba(52,211,153,0.3)]">precision</span>.<br />
              Digital <span className="text-zinc-400">simplicity</span>.
            </h3>
            <div className="space-y-6">
              <p className="text-base text-zinc-300 leading-relaxed">
                I am a Full Stack Developer with a deep passion for building
                high-performance, scalable applications. My expertise spans
                across mobile ecosystems and the modern web, with an absolute
                focus on creating seamless, uncompromised user experiences.
              </p>
              <p className="text-base text-zinc-300 leading-relaxed">
                When I&apos;m not architecting large-scale web platforms, I dive deep into systems programming—always looking for the most elegant solution to the hardest problems.
              </p>
              <p className="text-base text-zinc-300 leading-relaxed">
                To me, minimalism isn&apos;t just a visual style—it&apos;s an engineering principle. I believe in writing code that is as clean and maintainable under the hood as the interfaces it powers.
              </p>
            </div>
          </div>
        </FadeIn>

        <div className="lg:col-span-1 flex flex-col gap-6">
          {/* GitHub Stats Card */}
          <GitHubStats />

          {/* AI & Embedded Tech Spec Card */}
          <FadeIn delay={0.1} className="flex-1 group relative bg-[#050505] border border-white/5 rounded-2xl p-6 md:p-8 overflow-hidden transition-all duration-700 hover:border-emerald-500/30 hover:bg-[#0a0a0a]" data-cursor="scale">
            
            {/* Tech grid background that reveals on hover */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:20px_20px] [mask-image:radial-gradient(ellipse_at_center,black,transparent_80%)] opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
            
            {/* Ambient Corner Glow */}
            <div className="absolute -top-12 -right-12 w-32 h-32 bg-emerald-500/10 blur-[50px] rounded-full group-hover:bg-emerald-500/30 transition-all duration-700" />

            <div className="relative z-10 flex flex-col h-full justify-between">
              
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                  <span className="font-mono text-[9px] tracking-[0.2em] text-emerald-500/80 uppercase">Hardware_Node</span>
                </div>
                <Cpu className="w-5 h-5 text-zinc-700 group-hover:text-emerald-400 transition-colors duration-500" />
              </div>
              
              <div>
                <h4 className="text-2xl font-medium text-white tracking-tight mb-3">Silicon & AI</h4>
                <p className="text-sm text-zinc-400 leading-relaxed font-light">
                  Bridging the gap between intelligent software and the physical world through deep exploration of edge computing, microcontrollers, and embedded systems.
                </p>
              </div>

              {/* Technical Data Bar */}
              <div className="mt-8 pt-4 border-t border-white/5 flex items-center justify-between">
                <div className="flex gap-6">
                  <div>
                    <div className="text-[9px] tracking-widest text-zinc-600 font-mono mb-1 uppercase">Arch</div>
                    <div className="text-xs text-zinc-300 font-mono">ARM / Edge</div>
                  </div>
                  <div>
                    <div className="text-[9px] tracking-widest text-zinc-600 font-mono mb-1 uppercase">Logic</div>
                    <div className="text-xs text-zinc-300 font-mono">TinyML</div>
                  </div>
                </div>
                <div className="w-8 h-8 rounded-full border border-white/5 flex items-center justify-center bg-black group-hover:border-emerald-500/30 transition-colors">
                  <Layers className="w-3 h-3 text-zinc-600 group-hover:text-emerald-400" />
                </div>
              </div>

            </div>
          </FadeIn>


        </div>

      </div>
    </Section>
  );
}
