/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, @next/next/no-img-element, react-hooks/exhaustive-deps */
import React from "react";
import FadeIn from "@/components/ui/FadeIn";
import { Monitor, Cpu, Keyboard, Headphones, Code2, Database } from "lucide-react";

export const metadata = {
  title: "Uses | Anuvab Das",
  description: "A deep dive into my development environment, hardware, and software stack.",
};

export default function UsesPage() {
  return (
    <div className="min-h-screen pt-32 pb-20 px-6 sm:px-8 max-w-5xl mx-auto">
      <FadeIn>
        <h1 className="text-4xl md:text-6xl font-bold tracking-tighter mb-4 text-white">
          My Setup
        </h1>
        <p className="text-lg text-zinc-400 mb-16 max-w-2xl">
          A detailed look into the hardware, software, and everyday tools I use to build scalable digital experiences.
        </p>
      </FadeIn>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <FadeIn delay={0.1}>
          <section className="bg-zinc-900/50 border border-white/10 rounded-2xl p-6 backdrop-blur-md">
            <div className="flex items-center gap-3 mb-6 border-b border-white/5 pb-4">
              <div className="p-2 bg-emerald-500/10 rounded-lg">
                <Monitor className="w-5 h-5 text-emerald-400" />
              </div>
              <h2 className="text-xl font-semibold text-white">Hardware & Displays</h2>
            </div>
            <ul className="space-y-4">
              <li className="flex justify-between items-center border-b border-white/5 pb-2">
                <span className="text-zinc-300 font-medium">MacBook Pro 16&quot; (M3 Max)</span>
                <span className="text-xs px-2 py-1 bg-white/5 rounded text-zinc-500">Primary</span>
              </li>
              <li className="flex justify-between items-center border-b border-white/5 pb-2">
                <span className="text-zinc-300 font-medium">LG UltraFine 5K (27&quot;)</span>
                <span className="text-xs px-2 py-1 bg-white/5 rounded text-zinc-500">Display</span>
              </li>
              <li className="flex justify-between items-center border-b border-white/5 pb-2">
                <span className="text-zinc-300 font-medium">Custom PC (RTX 4090)</span>
                <span className="text-xs px-2 py-1 bg-white/5 rounded text-zinc-500">ML/Gaming</span>
              </li>
            </ul>
          </section>
        </FadeIn>

        <FadeIn delay={0.2}>
          <section className="bg-zinc-900/50 border border-white/10 rounded-2xl p-6 backdrop-blur-md">
            <div className="flex items-center gap-3 mb-6 border-b border-white/5 pb-4">
              <div className="p-2 bg-emerald-500/10 rounded-lg">
                <Keyboard className="w-5 h-5 text-emerald-400" />
              </div>
              <h2 className="text-xl font-semibold text-white">Peripherals</h2>
            </div>
            <ul className="space-y-4">
              <li className="flex justify-between items-center border-b border-white/5 pb-2">
                <span className="text-zinc-300 font-medium">Keychron Q1 Pro</span>
                <span className="text-xs px-2 py-1 bg-white/5 rounded text-zinc-500">Keyboard</span>
              </li>
              <li className="flex justify-between items-center border-b border-white/5 pb-2">
                <span className="text-zinc-300 font-medium">Logitech MX Master 3S</span>
                <span className="text-xs px-2 py-1 bg-white/5 rounded text-zinc-500">Mouse</span>
              </li>
              <li className="flex justify-between items-center border-b border-white/5 pb-2">
                <span className="text-zinc-300 font-medium">Herman Miller Aeron</span>
                <span className="text-xs px-2 py-1 bg-white/5 rounded text-zinc-500">Chair</span>
              </li>
            </ul>
          </section>
        </FadeIn>

        <FadeIn delay={0.3}>
          <section className="bg-zinc-900/50 border border-white/10 rounded-2xl p-6 backdrop-blur-md">
            <div className="flex items-center gap-3 mb-6 border-b border-white/5 pb-4">
              <div className="p-2 bg-emerald-500/10 rounded-lg">
                <Code2 className="w-5 h-5 text-emerald-400" />
              </div>
              <h2 className="text-xl font-semibold text-white">Development & Editor</h2>
            </div>
            <ul className="space-y-4">
              <li className="flex justify-between items-center border-b border-white/5 pb-2">
                <span className="text-zinc-300 font-medium">VS Code</span>
                <span className="text-xs px-2 py-1 bg-emerald-500/10 text-emerald-400 rounded">Vitesse Theme</span>
              </li>
              <li className="flex justify-between items-center border-b border-white/5 pb-2">
                <span className="text-zinc-300 font-medium">Cursor IDE</span>
                <span className="text-xs px-2 py-1 bg-white/5 rounded text-zinc-500">AI Coding</span>
              </li>
              <li className="flex justify-between items-center border-b border-white/5 pb-2">
                <span className="text-zinc-300 font-medium">Warp Terminal</span>
                <span className="text-xs px-2 py-1 bg-white/5 rounded text-zinc-500">CLI</span>
              </li>
              <li className="flex justify-between items-center border-b border-white/5 pb-2">
                <span className="text-zinc-300 font-medium">Figma</span>
                <span className="text-xs px-2 py-1 bg-white/5 rounded text-zinc-500">Design</span>
              </li>
            </ul>
          </section>
        </FadeIn>

        <FadeIn delay={0.4}>
          <section className="bg-zinc-900/50 border border-white/10 rounded-2xl p-6 backdrop-blur-md">
            <div className="flex items-center gap-3 mb-6 border-b border-white/5 pb-4">
              <div className="p-2 bg-emerald-500/10 rounded-lg">
                <Database className="w-5 h-5 text-emerald-400" />
              </div>
              <h2 className="text-xl font-semibold text-white">Tech Stack Favorites</h2>
            </div>
            <ul className="space-y-4">
              <li className="flex justify-between items-center border-b border-white/5 pb-2">
                <span className="text-zinc-300 font-medium">Next.js & React Native</span>
                <span className="text-xs px-2 py-1 bg-white/5 rounded text-zinc-500">Frameworks</span>
              </li>
              <li className="flex justify-between items-center border-b border-white/5 pb-2">
                <span className="text-zinc-300 font-medium">Tailwind CSS & Framer</span>
                <span className="text-xs px-2 py-1 bg-white/5 rounded text-zinc-500">Styling/Motion</span>
              </li>
              <li className="flex justify-between items-center border-b border-white/5 pb-2">
                <span className="text-zinc-300 font-medium">Firebase & Supabase</span>
                <span className="text-xs px-2 py-1 bg-white/5 rounded text-zinc-500">Backend</span>
              </li>
              <li className="flex justify-between items-center border-b border-white/5 pb-2">
                <span className="text-zinc-300 font-medium">Three.js / R3F</span>
                <span className="text-xs px-2 py-1 bg-white/5 rounded text-zinc-500">WebGL</span>
              </li>
            </ul>
          </section>
        </FadeIn>
      </div>
    </div>
  );
}
