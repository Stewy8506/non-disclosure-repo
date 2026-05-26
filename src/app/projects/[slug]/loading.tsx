"use client";

import { motion } from "framer-motion";

function Skeleton({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <div
      style={style}
      className={`relative overflow-hidden rounded-lg bg-white/[0.04] after:absolute after:inset-0 after:translate-x-[-100%] after:bg-gradient-to-r after:from-transparent after:via-white/[0.06] after:to-transparent after:animate-[shimmer_1.8s_infinite] ${className ?? ""}`}
    />
  );
}

export default function ProjectSlugLoading() {
  return (
    <div className="min-h-screen pt-32 pb-24 px-6 sm:px-8 max-w-5xl mx-auto">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        {/* Back link skeleton */}
        <Skeleton className="h-5 w-32 mb-10" />

        <div className="flex flex-col lg:flex-row gap-12 lg:gap-16 lg:items-start">
          {/* Left column */}
          <div className="flex-1 min-w-0 space-y-6">
            {/* Category badge */}
            <Skeleton className="h-6 w-28 rounded-full" />

            {/* Title */}
            <div className="space-y-3 mb-6">
              <Skeleton className="h-12 w-4/5" />
              <Skeleton className="h-12 w-3/5" />
            </div>

            {/* Description */}
            <div className="space-y-2 mb-10">
              <Skeleton className="h-5 w-full" />
              <Skeleton className="h-5 w-[90%]" />
              <Skeleton className="h-5 w-4/5" />
            </div>

            {/* CTA buttons */}
            <div className="flex gap-3 mb-12">
              <Skeleton className="h-10 w-28 rounded-xl" />
              <Skeleton className="h-10 w-32 rounded-xl" />
            </div>

            {/* Overview label */}
            <Skeleton className="h-3 w-16 mb-6" />

            {/* Overview text */}
            <div className="pl-5 border-l-2 border-emerald-500/20 space-y-2 mb-8">
              <Skeleton className="h-6 w-full" />
              <Skeleton className="h-6 w-[95%]" />
              <Skeleton className="h-6 w-[85%]" />
              <Skeleton className="h-6 w-3/4" />
            </div>

            {/* Metadata chips */}
            <div className="flex gap-3 mb-10">
              <Skeleton className="h-9 w-32 rounded-xl" />
              <Skeleton className="h-9 w-24 rounded-xl" />
            </div>

            {/* Tech stack label */}
            <Skeleton className="h-3 w-20 mb-3" />

            {/* Tech chips */}
            <div className="flex flex-wrap gap-2">
              {[72, 88, 64, 96, 80, 70].map((w, i) => (
                <Skeleton key={i} className={`h-8 rounded-full`} style={{ width: `${w}px` }} />
              ))}
            </div>
          </div>

          {/* Right column — phone mockup skeleton */}
          <div className="hidden lg:flex lg:w-[320px] xl:w-[340px] flex-shrink-0 flex-col items-center gap-4">
            {/* Phone shell */}
            <div className="relative w-[220px]">
              <Skeleton className="h-[440px] w-full rounded-[2.5rem]" />
              {/* Subtle inner screen indent illusion */}
              <div className="absolute inset-[12px] rounded-[2.25rem] bg-white/[0.02] border border-white/[0.03]" />
            </div>
            {/* Carousel dots */}
            <div className="flex gap-2 mt-2">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className={`h-1.5 ${i === 1 ? "w-5" : "w-1.5"} rounded-full`} />
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
