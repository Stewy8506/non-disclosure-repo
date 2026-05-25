"use client";

import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";

interface ProjectsBentoProps {
  projects: any[];
  onSelect: (project: any) => void;
}

export default function ProjectsBento({ projects, onSelect }: ProjectsBentoProps) {
  return (
    <div className="w-full max-w-7xl mx-auto p-6 md:p-12 pb-32">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 auto-rows-[300px] md:auto-rows-[400px]">
        {projects.map((project, i) => {
          // Create varied spans for a bento box look
          const isLarge = i % 5 === 0;
          const isMedium = i % 5 === 1 || i % 5 === 2;

          return (
            <motion.div
              key={project.id || project.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              onClick={() => onSelect(project)}
              className={`group relative rounded-3xl overflow-hidden cursor-pointer border border-white/5 bg-zinc-900 ${
                isLarge ? "md:col-span-2 md:row-span-2" : isMedium ? "md:col-span-2 md:row-span-1" : "md:col-span-1 md:row-span-1"
              }`}
            >
              {/* Background Image */}
              <div className="absolute inset-0 w-full h-full">
                <Image
                  src={project.image || "/projects/default.jpg"}
                  alt={project.title}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-700 ease-in-out opacity-60 group-hover:opacity-40"
                />
              </div>

              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />

              {/* Content */}
              <div className="absolute inset-0 p-6 md:p-8 flex flex-col justify-end">
                <div className="translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                  <span className="inline-block px-3 py-1 mb-3 text-[10px] font-bold tracking-widest uppercase text-white bg-white/10 rounded-full border border-white/20 backdrop-blur-md">
                    {project.category}
                  </span>
                  <h3 className="text-2xl md:text-4xl font-semibold tracking-tight text-white mb-2">
                    {project.title}
                  </h3>
                  <div className="h-0 opacity-0 overflow-hidden group-hover:h-auto group-hover:opacity-100 transition-all duration-500 ease-out">
                    <p className="text-zinc-300 text-sm md:text-base line-clamp-2 mt-2">
                      {project.description}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
