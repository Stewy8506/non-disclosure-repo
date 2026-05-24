"use client";

import { motion } from "framer-motion";
import type { Variants } from "framer-motion";
import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

interface FadeInProps {
  children: ReactNode;
  delay?: number;
  direction?: "up" | "down" | "left" | "right" | "none";
  duration?: number;
  className?: string;
}

export default function FadeIn({
  children,
  delay = 0,
  direction = "up",
  duration = 0.5,
  className,
}: FadeInProps) {
  const variants: Variants = {
    hidden: {
      opacity: 0,
      x: direction === "left" ? 20 : direction === "right" ? -20 : 0,
      y: direction === "up" ? 20 : direction === "down" ? -20 : 0,
    },
    visible: {
      opacity: 1,
      x: 0,
      y: 0,
      transition: {
        duration,
        delay,
        ease: [0.215, 0.61, 0.355, 1],
      },
    },
  };

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      variants={variants}
      className={cn("will-change-transform", className)}
    >
      {children}
    </motion.div>
  );
}
