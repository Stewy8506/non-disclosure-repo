"use client";

import React, { useState } from "react";
import { cn } from "@/lib/utils";

interface HoverSpotlightProps {
  children: React.ReactNode;
  className?: string;
  innerClassName?: string;
  glowColor?: string;
}

export default function HoverSpotlight({ 
  children, 
  className,
  innerClassName,
  glowColor = "rgba(255,255,255,0.08)"
}: HoverSpotlightProps) {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [opacity, setOpacity] = useState(0);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  return (
    <div
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setOpacity(1)}
      onMouseLeave={() => setOpacity(0)}
      className={cn("relative overflow-hidden group", className)}
    >
      <div
        className="pointer-events-none absolute -inset-px transition-opacity duration-300 z-0"
        style={{
          opacity,
          background: `radial-gradient(300px circle at ${position.x}px ${position.y}px, ${glowColor}, transparent 50%)`,
        }}
      />
      <div className={cn("relative z-10 w-full h-full", innerClassName)}>
        {children}
      </div>
    </div>
  );
}
