"use client";

import React from "react";

export default function NoiseOverlay() {
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `
        .noise-bg {
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
          background-repeat: repeat;
        }
      `}} />
      <div 
        className="pointer-events-none fixed inset-0 z-50 opacity-[0.05] noise-bg" 
      />
    </>
  );
}
