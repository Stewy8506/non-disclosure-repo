"use client";

import { motion } from "framer-motion";
import FadeIn from "../ui/FadeIn";
import Button from "../ui/Button";
import { ArrowRight } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden">
      {/* Background Glow */}
      <motion.div 
        animate={{ 
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{ 
          duration: 8, 
          repeat: Infinity, 
          ease: "easeInOut" 
        }}
        className="absolute inset-0 bg-gradient-radial pointer-events-none" 
      />
      
      <div className="relative z-10 text-center px-6 max-w-4xl">
        <FadeIn delay={0.1}>
          <span className="inline-block py-1 px-3 rounded-full bg-white/[0.05] border border-white/[0.1] text-xs font-medium text-muted mb-6 tracking-wider uppercase">
            Available for new opportunities
          </span>
        </FadeIn>

        <FadeIn delay={0.15}>
          <div className="flex justify-center mb-6">
            <div className="flex items-center gap-3 px-4 py-2 rounded-full bg-white/[0.03] border border-white/[0.08] backdrop-blur-md shadow-[0_0_20px_rgba(255,255,255,0.02)]">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="text-sm font-medium text-zinc-300 tracking-wide">
                Hi, I'm <span className="text-white font-semibold">Dasan</span>
              </span>
            </div>
          </div>
        </FadeIn>

        <FadeIn delay={0.2}>
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tighter leading-tight mb-8">
            Building the <br /> 
            <span className="bg-clip-text text-transparent bg-gradient-to-b from-white to-zinc-500">
              future of digital
            </span>
            <br /> experiences.
          </h1>
        </FadeIn>

        <FadeIn delay={0.3}>
          <p className="text-lg md:text-xl text-muted mb-10 max-w-2xl mx-auto text-balance">
            Full stack developer specializing in high-performance apps with React Native, 
            Flutter, and AI-driven products. Crafting minimal, premium interfaces.
          </p>
        </FadeIn>

        <FadeIn delay={0.4}>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button variant="primary" className="group flex items-center gap-2" data-cursor="button">
              View Projects
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button variant="outline" data-cursor="button">
              Get in touch
            </Button>
          </div>
        </FadeIn>
      </div>

    </section>
  );
}
