"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface ProjectCarouselProps {
  images: string[];
  imageType?: "phone" | "desktop" | "auto";
}

// ─── Phone Mockup Frame ───────────────────────────────────────────────────────
function PhoneFrame({ src, alt, index }: { src: string; alt: string; index: number }) {
  return (
    <motion.div
      key={index}
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, scale: 0.95 }}
      transition={{ type: "spring", stiffness: 300, damping: 28 }}
      className="relative flex-shrink-0"
      style={{ width: "min(280px, 72vw)" }}
    >
      {/* Phone outer shell */}
      <div
        className="relative rounded-[2.5rem] overflow-hidden select-none"
        style={{
          background: "linear-gradient(145deg, #2a2a2e 0%, #1a1a1e 40%, #0f0f12 100%)",
          padding: "3px",
          boxShadow:
            "0 0 0 1px rgba(255,255,255,0.08), 0 32px 80px -12px rgba(0,0,0,0.9), 0 0 60px -20px rgba(16,185,129,0.08), inset 0 1px 0 rgba(255,255,255,0.12)",
        }}
      >
        {/* Side button – volume up */}
        <div
          className="absolute -left-[3px] top-[88px] w-[3px] h-8 rounded-l-full"
          style={{ background: "linear-gradient(180deg, #3a3a3e, #252528)" }}
        />
        {/* Side button – volume down */}
        <div
          className="absolute -left-[3px] top-[132px] w-[3px] h-8 rounded-l-full"
          style={{ background: "linear-gradient(180deg, #3a3a3e, #252528)" }}
        />
        {/* Side button – power */}
        <div
          className="absolute -right-[3px] top-[108px] w-[3px] h-12 rounded-r-full"
          style={{ background: "linear-gradient(180deg, #3a3a3e, #252528)" }}
        />

        {/*
          CORNER RADIUS:
          • Outer shell  → change "rounded-[3rem]"   on the outer <div> above  (↑ line 32)
          • Inner screen → change "rounded-[2.75rem]" on the inner <div> below
          Tip: keep inner ~0.25rem smaller than outer so the bezel gap is visible.
        */}
        {/* Inner bezel */}
        <div
          className="relative rounded-[2.25rem] overflow-hidden"
          style={{ background: "#000" }}
        >
          {/* Screen content — fills full height, no notch */}
          <div className="relative" style={{ aspectRatio: "9/19.5" }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={src}
              alt={alt}
              className="w-full h-full object-cover object-top"
              draggable={false}
            />
            {/* Screen reflection overlay */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background:
                  "linear-gradient(135deg, rgba(255,255,255,0.04) 0%, transparent 50%, rgba(0,0,0,0.15) 100%)",
              }}
            />
          </div>
        </div>

        {/* Outer shell reflection */}
        <div
          className="absolute inset-0 rounded-[3rem] pointer-events-none"
          style={{
            background:
              "linear-gradient(135deg, rgba(255,255,255,0.06) 0%, transparent 40%)",
          }}
        />
      </div>

      {/* Ground shadow */}
      <div
        className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-3/4 h-4 rounded-full pointer-events-none"
        style={{
          background: "radial-gradient(ellipse at center, rgba(0,0,0,0.6) 0%, transparent 70%)",
          filter: "blur(8px)",
        }}
      />
    </motion.div>
  );
}

// ─── Desktop / Default Mode ───────────────────────────────────────────────────
function DesktopCarousel({ images }: { images: string[] }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleNext = () => setCurrentIndex((prev) => (prev + 1) % images.length);
  const handlePrev = () => setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);

  return (
    <div className="relative w-full overflow-hidden rounded-2xl group border border-white/10 bg-black/50">
      <div className="w-full aspect-[16/9] md:aspect-[21/9] flex items-center justify-center relative">
        <motion.div
          className="flex w-full h-full"
          animate={{ x: `-${currentIndex * 100}%` }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        >
          {images.map((img, idx) => (
            <div key={idx} className="w-full h-full flex-shrink-0 relative">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={img}
                alt={`Project image ${idx + 1}`}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60" />
            </div>
          ))}
        </motion.div>
      </div>

      {images.length > 1 && (
        <>
          <div className="absolute inset-y-0 left-0 flex items-center px-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <button
              onClick={handlePrev}
              className="p-2 rounded-full bg-black/50 text-white backdrop-blur-md border border-white/10 hover:bg-white/10 transition-colors"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
          </div>
          <div className="absolute inset-y-0 right-0 flex items-center px-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <button
              onClick={handleNext}
              className="p-2 rounded-full bg-black/50 text-white backdrop-blur-md border border-white/10 hover:bg-white/10 transition-colors"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>
          <div className="absolute bottom-4 inset-x-0 flex justify-center gap-2 z-10">
            {images.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={cn(
                  "h-1.5 rounded-full transition-all duration-300",
                  idx === currentIndex ? "w-6 bg-emerald-400" : "w-2 bg-white/30 hover:bg-white/50"
                )}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

// ─── Phone Gallery Mode ───────────────────────────────────────────────────────
function PhoneCarousel({ images }: { images: string[] }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleNext = () => setCurrentIndex((prev) => (prev + 1) % images.length);
  const handlePrev = () => setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);

  return (
    <div className="w-full flex flex-col items-center gap-8">
      {/* Ambient glow behind phone */}
      <div className="relative flex items-center justify-center w-full">
        {/* Decorative ambient gradient */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 60% 80% at 50% 50%, rgba(16,185,129,0.06) 0%, transparent 70%)",
          }}
        />

        {/* Single-phone display with nav */}
        <div className="relative flex items-center gap-6 md:gap-10 py-8">
          {images.length > 1 && (
            <button
              onClick={handlePrev}
              className="p-2.5 rounded-full bg-white/5 text-zinc-400 hover:text-white border border-white/10 hover:bg-white/10 transition-all backdrop-blur-md flex-shrink-0"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
          )}

          <AnimatePresence mode="wait">
            <PhoneFrame
              key={currentIndex}
              src={images[currentIndex]}
              alt={`Screenshot ${currentIndex + 1}`}
              index={currentIndex}
            />
          </AnimatePresence>

          {images.length > 1 && (
            <button
              onClick={handleNext}
              className="p-2.5 rounded-full bg-white/5 text-zinc-400 hover:text-white border border-white/10 hover:bg-white/10 transition-all backdrop-blur-md flex-shrink-0"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      {/* Dot indicators */}
      {images.length > 1 && (
        <div className="flex items-center gap-2">
          {images.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={cn(
                "h-1.5 rounded-full transition-all duration-300",
                idx === currentIndex
                  ? "w-6 bg-emerald-400"
                  : "w-2 bg-white/20 hover:bg-white/40"
              )}
              aria-label={`Go to screenshot ${idx + 1}`}
            />
          ))}
        </div>
      )}

      {/* Screenshot counter label */}
      {images.length > 1 && (
        <p className="text-xs text-zinc-600 tracking-widest font-medium uppercase">
          {currentIndex + 1} / {images.length}
        </p>
      )}
    </div>
  );
}

// ─── Main Export ──────────────────────────────────────────────────────────────
export default function ProjectCarousel({ images, imageType = "auto" }: ProjectCarouselProps) {
  if (!images || images.length === 0) return null;

  if (imageType === "phone") {
    return <PhoneCarousel images={images} />;
  }

  return <DesktopCarousel images={images} />;
}
