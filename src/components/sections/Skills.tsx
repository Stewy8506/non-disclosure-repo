"use client";

import FadeIn from "../ui/FadeIn";
import Section from "../ui/Section";
import { motion } from "framer-motion";

const SKILLS = [
  {
    category: "Frontend",
    items: ["React.js", "Next.js 15", "TypeScript", "Tailwind CSS", "Framer Motion"],
    color: "from-blue-500/20",
    icon: "🌐"
  },
  {
    category: "Mobile",
    items: ["React Native", "Flutter", "Dart", "iOS/Android Deployment"],
    color: "from-purple-500/20",
    icon: "📱"
  },
  {
    category: "Backend & AI",
    items: ["Node.js", "PostgreSQL", "MongoDB", "OpenAI API", "LangChain"],
    color: "from-emerald-500/20",
    icon: "🤖"
  },
  {
    category: "Low Level",
    items: ["C/C++", "Embedded C", "RTOS", "Arduino/ESP32"],
    color: "from-orange-500/20",
    icon: "🔌"
  },
];

export default function Skills() {
  return (
    <Section id="skills" className="py-32">
      <FadeIn className="mb-16 text-center">
        <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">
          Technical <span className="text-zinc-500">Arsenal</span>
        </h2>
        <p className="text-muted text-lg max-w-2xl mx-auto text-balance">
          A curated set of technologies I use to bring digital ideas to life, 
          from the silicon level to the cloud.
        </p>
      </FadeIn>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {SKILLS.map((skill, idx) => (
          <FadeIn key={skill.category} delay={idx * 0.1}>
            <motion.div 
              whileHover={{ y: -8 }}
              data-cursor="scale"
              className="relative group h-full"
            >
              <div className={cn(
                "absolute inset-0 bg-gradient-to-b opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-2xl rounded-3xl",
                skill.color
              )} />
              
              <div className="relative h-full glass-effect p-6 rounded-2xl border border-white/10 group-hover:border-white/20 transition-all duration-300 backdrop-blur-md">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-white">
                    {skill.category}
                  </h3>
                  <span className="text-2xl">{skill.icon}</span>
                </div>
                
                <div className="space-y-3">
                  {skill.items.map((item) => (
                    <motion.div 
                      key={item} 
                      whileHover={{ x: 5 }}
                      className="text-muted text-sm flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 transition-colors cursor-default"
                      data-cursor="text"
                    >
                      <div className="w-1.5 h-1.5 rounded-full bg-zinc-600 group-hover:bg-white transition-colors" />
                      {item}
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          </FadeIn>
        ))}
      </div>
    </Section>
  );
}

// Helper to allow cn in this file since I didn't import it
function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}
