"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useLoading } from "../layout/ClientLayoutWrapper";

interface TextRevealProps {
  children: string;
  className?: string;
  delay?: number;
}

export default function TextReveal({ children, className, delay = 0 }: TextRevealProps) {
  const { isSiteReady } = useLoading();
  const [isMobile, setIsMobile] = useState(true);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const words = children.split(" ");

  const container = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.08, delayChildren: delay * 0.3 },
    },
  };

  const child = {
    visible: {
      opacity: 1,
      y: 0,
      ...(isMobile ? {} : { filter: "blur(0px)" }),
      transition: {
        type: "spring" as const,
        damping: 12,
        stiffness: 100,
      },
    },
    hidden: {
      opacity: 0,
      y: 20,
      ...(isMobile ? {} : { filter: "blur(4px)" }),
      transition: {
        type: "spring" as const,
        damping: 12,
        stiffness: 100,
      },
    },
  };

  if (!isSiteReady) {
    return (
      <div className={cn("flex flex-wrap opacity-0", className)}>
        {words.map((word, index) => (
          <span
            style={{ 
              marginRight: "0.25em", 
              transform: "translateY(20px)", 
              filter: isMobile ? "none" : "blur(4px)",
              willChange: "transform, opacity, filter"
            }}
            key={index}
            className="inline-block"
          >
            {word}
          </span>
        ))}
      </div>
    );
  }

  return (
    <motion.div
      className={cn("flex flex-wrap", className)}
      variants={container}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-10%" }}
    >
      {words.map((word, index) => (
        <motion.span
          variants={child}
          style={{ marginRight: "0.25em", willChange: "transform, opacity, filter" }}
          key={index}
          className="inline-block"
        >
          {word}
        </motion.span>
      ))}
    </motion.div>
  );
}
