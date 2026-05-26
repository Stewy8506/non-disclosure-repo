import React from "react";
import { notFound } from "next/navigation";
import FadeIn from "@/components/ui/FadeIn";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { GitHubIcon } from "@/components/ui/BrandIcons";
import Link from "next/link";
import { Project } from "@/lib/projects";
import projectsData from "@/data/projects.json";

const projects = projectsData as Project[];

// Generate static params for all projects at build time
export function generateStaticParams() {
  return projects.map((p: Project) => ({
    slug: p.id || p.title.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
  }));
}

export default async function ProjectCaseStudy(props: { params: Promise<{ slug: string }> }) {
  const params = await props.params;
  const project = projects.find((p: Project) => (p.id || p.title.toLowerCase().replace(/[^a-z0-9]+/g, "-")) === params.slug);

  if (!project) {
    notFound();
  }

  return (
    <div className="min-h-screen pt-32 pb-20 px-6 sm:px-8 max-w-4xl mx-auto">
      <FadeIn>
        <Link href="/#projects" className="inline-flex items-center gap-2 text-zinc-400 hover:text-white transition-colors mb-8 text-sm">
          <ArrowLeft className="w-4 h-4" /> Back to Projects
        </Link>
        
        <h1 className="text-4xl md:text-6xl font-bold tracking-tighter mb-6 text-white">
          {project.title}
        </h1>
        
        <p className="text-xl text-zinc-300 mb-10 leading-relaxed">
          {project.description}
        </p>

        <div className="flex flex-wrap items-center gap-4 mb-16">
          {project.link && (
            <a href={project.link} target="_blank" rel="noreferrer" className="flex items-center gap-2 px-4 py-2 bg-emerald-500 text-black font-medium rounded-lg hover:bg-emerald-400 transition-colors">
              <ExternalLink className="w-4 h-4" /> Live Demo
            </a>
          )}
          {project.sourceCodeUrl && (
            <a href={project.sourceCodeUrl} target="_blank" rel="noreferrer" className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 text-white font-medium rounded-lg hover:bg-white/10 transition-colors">
              <GitHubIcon className="w-4 h-4" /> Source Code
            </a>
          )}
        </div>
      </FadeIn>

      <FadeIn delay={0.2}>
        <div className="aspect-video w-full rounded-2xl overflow-hidden bg-zinc-900 border border-white/10 mb-16 relative">
          <img src={project.image || "/projects/default.jpg"} alt={project.title} className="w-full h-full object-cover" />
        </div>
      </FadeIn>

      <div className="grid md:grid-cols-3 gap-12">
        <FadeIn delay={0.3} className="md:col-span-2 prose prose-invert max-w-none prose-emerald">
          <h2>Overview</h2>
          <p>
            {project.overview || project.description || "A deep dive into the architecture, challenges, and solutions built for this project."}
          </p>
          
          <h3>Architecture & Tech Stack</h3>
          <p>This project was built using modern tools to ensure scalability and maintainability.</p>
          <ul>
            {project.tech?.map((tech: string) => (
              <li key={tech}>{tech}</li>
            ))}
          </ul>
        </FadeIn>

        <FadeIn delay={0.4} className="space-y-8">
          <div>
            <h4 className="text-sm font-semibold text-zinc-500 uppercase tracking-wider mb-3">Category</h4>
            <p className="text-zinc-300">{project.category || "General"}</p>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-zinc-500 uppercase tracking-wider mb-3">Timeline</h4>
            <p className="text-zinc-300">2023 - Present</p>
          </div>
        </FadeIn>
      </div>
    </div>
  );
}
