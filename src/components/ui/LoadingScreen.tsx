"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Terminal } from "lucide-react";

interface LoadingScreenProps {
  onComplete: () => void;
}

const BOOT_LOGS = [
  "INITIALIZING SYSTEM KERNEL...",
  "LOADING NEURAL NETWORKS...",
  "CONNECTING TO SECURE STREAMS...",
  "MOUNTING PORTFOLIO REGISTRY...",
  "CONFIGURING DYNAMIC MATRICES...",
  "SYNCHRONIZING GLOBAL LOBBY...",
  "BOOT SEQUENCE COMPLETE."
];

export default function LoadingScreen({ onComplete }: LoadingScreenProps) {
  const [progress, setProgress] = useState(0);
  const [logIndex, setLogIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const duration = 2800; 
    const intervalTime = 40;
    const steps = duration / intervalTime;
    let currentStep = 0;

    const timer = setInterval(() => {
      currentStep++;
      const progressPercent = Math.min((currentStep / steps) * 100, 100);
      
      let dynamicProgress = progressPercent;
      if (progressPercent < 40) {
        dynamicProgress = progressPercent * 1.5;
      } else if (progressPercent >= 40 && progressPercent < 80) {
        dynamicProgress = 60 + (progressPercent - 40) * 0.4;
      } else {
        dynamicProgress = 76 + (progressPercent - 80) * 1.2;
      }

      const finalProgress = Math.min(Math.round(dynamicProgress), 100);
      setProgress(finalProgress);

      const segmentSize = 100 / BOOT_LOGS.length;
      const currentLog = Math.min(
        Math.floor(finalProgress / segmentSize),
        BOOT_LOGS.length - 1
      );
      setLogIndex(currentLog);

      if (currentStep >= steps || finalProgress >= 100) {
        clearInterval(timer);
        setTimeout(() => {
          setIsVisible(false);
          const event = new CustomEvent('enterSite');
          window.dispatchEvent(event);
        }, 500);
      }
    }, intervalTime);

    return () => clearInterval(timer);
  }, []);

  return (
    <AnimatePresence onExitComplete={onComplete}>
      {isVisible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.05 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-0 z-[99999] flex flex-col items-center justify-center bg-[#09090b] text-white select-none overflow-hidden"
        >

          {/* DESKTOP VIEWPORT */}
          <div className="hidden md:flex flex-col items-center max-w-lg w-full px-8 relative z-10">
            <div className="relative mb-12 flex items-center justify-center">
              {/* Complex Geometric Loader */}
              <motion.div 
                animate={{ rotate: 360 }}
                transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                className="absolute w-32 h-32 border-[1px] border-emerald-500/30 rounded-full border-dashed"
              />
              <motion.div 
                animate={{ rotate: -360 }}
                transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
                className="absolute w-40 h-40 border-[1px] border-emerald-400/20 rounded-full border-dotted"
              />
              <motion.div
                animate={{
                  opacity: [0.5, 1, 0.5],
                  scale: [0.95, 1.05, 0.95],
                }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                className="w-20 h-20 p-5 rounded-xl border border-emerald-500/40 flex items-center justify-center bg-emerald-500/[0.02] shadow-[0_0_30px_rgba(16,185,129,0.15)] relative overflow-hidden backdrop-blur-md"
              >
                <div className="absolute inset-0 bg-gradient-to-t from-emerald-500/10 to-transparent" />
                <Terminal className="w-10 h-10 text-emerald-400 relative z-10" strokeWidth={1.5} />
              </motion.div>
            </div>

            <div className="w-full bg-black/40 border border-white/[0.05] rounded-xl py-4 px-5 mb-8 font-mono text-[11px] text-zinc-500 h-36 flex flex-col justify-end gap-2 shadow-inner overflow-hidden relative backdrop-blur-sm">
              {/* Scanline effect */}
              <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_4px,3px_100%] pointer-events-none opacity-20"></div>

              {BOOT_LOGS.slice(Math.max(0, logIndex - 3), logIndex + 1).map((log, idx) => (
                <motion.div
                  initial={{ opacity: 0, x: -10, filter: "blur(4px)" }}
                  animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
                  key={idx}
                  className={`truncate tracking-widest ${idx === logIndex ? "text-emerald-400 font-bold" : ""}`}
                >
                  <span className="text-zinc-700 mr-2">&gt;</span>
                  {log}
                </motion.div>
              ))}
            </div>

            <div className="w-full relative">
              <div className="flex justify-between w-full text-[10px] text-emerald-500/70 font-bold tracking-[0.2em] mb-3">
                <span>SYSTEM BOOT</span>
                <span>{progress}%</span>
              </div>
              <div className="w-full h-1.5 bg-zinc-900 rounded-full overflow-hidden relative border border-white/[0.02]">
                <motion.div
                  className="absolute top-0 bottom-0 left-0 bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]"
                  style={{ width: `${progress}%` }}
                  layoutId="progressBar"
                />
              </div>
            </div>
          </div>

          {/* MOBILE VIEWPORT */}
          <div className="flex md:hidden flex-col items-center justify-center px-6 relative z-10 w-full">
            <div className="relative w-32 h-32 flex items-center justify-center mb-12">
              <motion.div 
                animate={{
                  scale: [1, 1.5, 1],
                  opacity: [0.1, 0.3, 0.1],
                }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                className="absolute inset-0 bg-emerald-500 rounded-full blur-xl"
              />
              
              {/* Complex layered rings */}
              <motion.svg 
                animate={{ rotate: 360 }} 
                transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 w-full h-full"
              >
                <circle cx="64" cy="64" r="54" className="stroke-white/5" strokeWidth="1" fill="none" strokeDasharray="4 4" />
              </motion.svg>

              <svg className="absolute inset-0 w-full h-full rotate-[-90deg]">
                <circle cx="64" cy="64" r="46" className="stroke-white/10" strokeWidth="2" fill="none" />
                <motion.circle
                  cx="64"
                  cy="64"
                  r="46"
                  className="stroke-emerald-400"
                  strokeWidth="3"
                  fill="none"
                  strokeDasharray="289"
                  strokeDashoffset={289 - (289 * progress) / 100}
                  strokeLinecap="round"
                />
              </svg>
              
              <div className="absolute flex flex-col items-center">
                <span className="text-emerald-400 font-bold text-2xl tracking-tighter">
                  {progress}
                </span>
                <span className="text-[10px] text-emerald-500/50 font-medium tracking-widest mt-1">
                  SYS
                </span>
              </div>
            </div>

            <div className="w-full max-w-xs space-y-4">
              <div className="h-4 flex justify-center w-full overflow-hidden">
                <motion.span 
                  key={logIndex}
                  initial={{ y: 10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  className="text-[10px] font-bold text-emerald-400/80 tracking-[0.2em]"
                >
                  {BOOT_LOGS[logIndex]}
                </motion.span>
              </div>
              <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                 <motion.div
                  className="h-full bg-emerald-500"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          </div>

        </motion.div>
      )}
    </AnimatePresence>
  );
}
