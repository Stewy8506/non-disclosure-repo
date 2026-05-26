"use client";

import React from "react";
import { motion } from "framer-motion";
import { Code2, Database, Layout, Server, Smartphone, Monitor } from "lucide-react";

const skills = [
  { name: "React", icon: Layout, angle: 0, distance: 100 },
  { name: "Next.js", icon: Monitor, angle: 60, distance: 130 },
  { name: "Node.js", icon: Server, angle: 120, distance: 110 },
  { name: "TypeScript", icon: Code2, angle: 180, distance: 140 },
  { name: "Firebase", icon: Database, angle: 240, distance: 120 },
  { name: "React Native", icon: Smartphone, angle: 300, distance: 110 },
];

export default function SkillGraph() {
  return (
    <div className="relative w-full h-[400px] flex items-center justify-center overflow-hidden">
      {/* Central Node */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", damping: 15 }}
        className="absolute z-10 w-24 h-24 rounded-full bg-emerald-500/10 border-2 border-emerald-500/30 backdrop-blur-md flex items-center justify-center shadow-[0_0_30px_rgba(6,182,212,0.2)]"
      >
        <div className="w-16 h-16 rounded-full bg-emerald-500/20 flex items-center justify-center">
          <span className="text-emerald-400 font-bold tracking-tight">CORE</span>
        </div>
      </motion.div>

      {/* Orbit Rings */}
      <div className="absolute w-[200px] h-[200px] rounded-full border border-white/5" />
      <div className="absolute w-[280px] h-[280px] rounded-full border border-white/5 border-dashed" />

      {/* Orbiting Nodes */}
      {skills.map((skill, idx) => {
        const rad = (skill.angle * Math.PI) / 180;
        const x = Math.cos(rad) * skill.distance;
        const y = Math.sin(rad) * skill.distance;

        return (
          <motion.div
            key={skill.name}
            initial={{ opacity: 0, x: 0, y: 0 }}
            animate={{ opacity: 1, x, y }}
            transition={{ type: "spring", damping: 12, delay: idx * 0.1 }}
            className="absolute z-20 flex flex-col items-center group cursor-pointer"
          >
            <div className="w-12 h-12 rounded-full bg-zinc-900 border border-white/10 flex items-center justify-center group-hover:border-emerald-500/50 group-hover:bg-emerald-500/10 transition-colors shadow-lg">
              <skill.icon className="w-5 h-5 text-zinc-400 group-hover:text-emerald-400 transition-colors" />
            </div>
            <span className="absolute top-14 text-[10px] font-medium text-zinc-500 group-hover:text-emerald-400 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap bg-black/80 px-2 py-1 rounded">
              {skill.name}
            </span>
          </motion.div>
        );
      })}
    </div>
  );
}
