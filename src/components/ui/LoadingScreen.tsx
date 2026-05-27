"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface LoadingScreenProps {
  onComplete: () => void;
}

const BOOT_SEQUENCE = [
  "[ OK ] Kernel initialized.",
  "[ OK ] Mounting virtual DOM...",
  "[INFO] Establishing secure connection...",
  "[ OK ] Connection established (Latency: 12ms).",
  "[INFO] Hydrating React components...",
  "[ OK ] Components hydrated.",
  "[INFO] Loading aesthetic modules...",
  "[ OK ] Shaders compiled. Geometry loaded.",
  "[ OK ] System ready. Initializing user interface..."
];

export default function LoadingScreen({ onComplete }: LoadingScreenProps) {
  const [progress, setProgress] = useState(0);
  const [visibleLogs, setVisibleLogs] = useState<string[]>([]);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const duration = 2800; 
    const intervalTime = 30; 
    const steps = duration / intervalTime;
    let currentStep = 0;

    const timer = setInterval(() => {
      currentStep++;
      
      // Easing for progress bar
      const x = currentStep / steps;
      const easeInOutQuart = x < 0.5 ? 8 * x * x * x * x : 1 - Math.pow(-2 * x + 2, 4) / 2;
      const currentProgress = Math.min(easeInOutQuart * 100, 100);
      
      setProgress(currentProgress);

      // Determine how many logs to show
      const logIndex = Math.min(
        Math.floor((currentProgress / 100) * BOOT_SEQUENCE.length),
        BOOT_SEQUENCE.length
      );
      
      setVisibleLogs(BOOT_SEQUENCE.slice(0, logIndex + 1));

      if (currentStep >= steps || currentProgress >= 100) {
        clearInterval(timer);
        setTimeout(() => {
          setIsVisible(false);
          const event = new CustomEvent('enterSite');
          window.dispatchEvent(event);
        }, 400); 
      }
    }, intervalTime);

    return () => clearInterval(timer);
  }, []);

  return (
    <AnimatePresence onExitComplete={onComplete}>
      {isVisible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.02, filter: "blur(4px)" }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-0 z-[99999] flex flex-col justify-between bg-[#040404] text-white select-none overflow-hidden font-mono p-6 md:p-12"
        >
          {/* Top subtle branding */}
          <div className="flex justify-between items-center text-[10px] text-zinc-600 tracking-widest uppercase">
            <span>ANV_OS // V.1.0</span>
            <span>SECURE BOOT</span>
          </div>

          {/* Center Logs */}
          <div className="flex-1 flex flex-col justify-center max-w-2xl mx-auto w-full gap-2">
            {visibleLogs.map((log, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.2 }}
                className="text-xs md:text-sm tracking-wide text-zinc-400"
              >
                {log.startsWith("[ OK ]") ? (
                  <span className="text-emerald-500 mr-2">[ OK ]</span>
                ) : (
                  <span className="text-sky-500 mr-2">[INFO]</span>
                )}
                {log.replace(/\[.*\]\s/, "")}
              </motion.div>
            ))}
            
            {/* Blinking Cursor */}
            <motion.div 
              animate={{ opacity: [1, 0] }}
              transition={{ repeat: Infinity, duration: 0.8, ease: "linear" }}
              className="w-2.5 h-4 bg-zinc-300 mt-2"
            />
          </div>

          {/* Bottom Progress Bar */}
          <div className="w-full max-w-2xl mx-auto flex items-center gap-4">
            <div className="text-[10px] text-zinc-500 tracking-widest w-10">
              {Math.round(progress)}%
            </div>
            <div className="flex-1 h-[1px] bg-zinc-800 relative overflow-hidden">
              <motion.div 
                className="absolute top-0 bottom-0 left-0 bg-white shadow-[0_0_10px_rgba(255,255,255,0.5)]"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
