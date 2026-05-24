"use client";

import FadeIn from "../ui/FadeIn";
import Section from "../ui/Section";

export default function About() {
  return (
    <Section id="about" className="py-32">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <FadeIn>
          <h2 className="text-3xl md:text-5xl font-bold mb-6 tracking-tight">
            Engineering <span className="text-zinc-500">precision</span> and <br /> 
            digital <span className="text-zinc-500">simplicity</span>.
          </h2>
          <p className="text-lg text-muted leading-relaxed mb-6 text-balance">
            I am a Full Stack Developer with a deep passion for building 
            high-performance, scalable applications. My expertise spans 
            across mobile ecosystems (React Native, Flutter) and the modern 
            web (Next.js), with a strong focus on creating seamless user 
            experiences.
          </p>
          <p className="text-lg text-muted leading-relaxed text-balance">
            Beyond the code, I am driven by the intersection of AI and 
            embedded systems, exploring how intelligent software can interact 
            with the physical world to solve complex real-world problems.
          </p>
        </FadeIn>

        <FadeIn delay={0.2}>
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-zinc-700 to-zinc-900 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
            <div className="relative glass-effect p-8 rounded-2xl border border-white/10">
              <div className="space-y-6">
                <div className="flex items-center justify-between p-4 rounded-xl bg-white/[0.03] border border-white/5">
                  <span className="text-sm font-medium">Full Stack Expertise</span>
                  <span className="text-xs text-muted">Advanced</span>
                </div>
                <div className="flex items-center justify-between p-4 rounded-xl bg-white/[0.03] border border-white/5">
                  <span className="text-sm font-medium">AI Integration</span>
                  <span className="text-xs text-muted">Intermediate</span>
                </div>
                <div className="flex items-center justify-between p-4 rounded-xl bg-white/[0.03] border border-white/5">
                  <span className="text-sm font-medium">Embedded Systems</span>
                  <span className="text-xs text-muted">Passionate</span>
                </div>
                <div className="flex items-center justify-between p-4 rounded-xl bg-white/[0.03] border border-white/5">
                  <span className="text-sm font-medium">UI/UX Design</span>
                  <span className="text-xs text-muted">Minimalist</span>
                </div>
              </div>
            </div>
          </div>
        </FadeIn>
      </div>
    </Section>
  );
}
