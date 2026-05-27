"use client";

import React, { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronRight, ChevronLeft, Menu, Volume2, MessageSquare, Search } from "lucide-react";

const TOUR_STEPS = [
  {
    id: "#tour-anvos",
    title: "Welcome to anv os",
    description: "This is the main system menu. You can use it to navigate around the portfolio and access settings.",
    icon: Menu,
  },
  {
    id: "#tour-lofi",
    title: "Lofi Player",
    description: "Click here to stream soothing lofi music while you explore. Hover over it to reveal the volume slider!",
    icon: Volume2,
  },
  {
    id: "#tour-chat",
    title: "Global Chat",
    description: "Join the real-time anonymous chat room! Interact with other live visitors here.",
    icon: MessageSquare,
  },
  {
    id: "#tour-spotlight",
    title: "Spotlight Search",
    description: "Looking for something specific? Press Cmd+K (or Ctrl+K) or click here to search quickly.",
    icon: Search,
  }
];

export default function OnboardingTour() {
  const [isMounted, setIsMounted] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [targetRect, setTargetRect] = useState<DOMRect | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted) return;

    // Check mobile
    setIsMobile(window.innerWidth < 768);
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);

    const hasSeenTour = localStorage.getItem("hasSeenTour");
    if (hasSeenTour) {
      window.removeEventListener("resize", handleResize);
      return;
    }

    // Start instantly when mounted
    setIsActive(true);

    return () => window.removeEventListener("resize", handleResize);
  }, [isMounted]);

  const updateRect = useCallback(() => {
    if (!isActive) return;
    const step = TOUR_STEPS[currentStepIndex];
    const element = document.querySelector(step.id);
    if (element) {
      setTargetRect(element.getBoundingClientRect());
    } else {
      setTargetRect(null);
    }
  }, [isActive, currentStepIndex]);

  useEffect(() => {
    updateRect();
    window.addEventListener("resize", updateRect);
    window.addEventListener("scroll", updateRect, true);
    return () => {
      window.removeEventListener("resize", updateRect);
      window.removeEventListener("scroll", updateRect, true);
    };
  }, [updateRect]);

  const endTour = () => {
    setIsActive(false);
    localStorage.setItem("hasSeenTour", "true");
  };

  const nextStep = () => {
    if (currentStepIndex < TOUR_STEPS.length - 1) {
      setCurrentStepIndex((prev) => prev + 1);
    } else {
      endTour();
    }
  };

  const prevStep = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex((prev) => prev - 1);
    }
  };

  if (!isMounted || !isActive) return null;

  const currentStep = TOUR_STEPS[currentStepIndex];
  const padding = 8;

  return (
    <div className="fixed inset-0 z-[9999] pointer-events-auto flex items-center justify-center overflow-hidden">
      {/* Dimmed Overlay */}
      {isMobile ? (
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm pointer-events-none" />
      ) : (
        <svg className="absolute inset-0 w-full h-full pointer-events-none">
          <defs>
            <mask id="tour-mask">
              <rect width="100%" height="100%" fill="white" />
              {targetRect && (
                <motion.rect
                  fill="black"
                  rx="12"
                  ry="12"
                  initial={false}
                  animate={{
                    x: targetRect.left - padding,
                    y: targetRect.top - padding,
                    width: targetRect.width + padding * 2,
                    height: targetRect.height + padding * 2,
                  }}
                  transition={{ type: "spring", stiffness: 100, damping: 20 }}
                />
              )}
            </mask>
          </defs>
          <rect width="100%" height="100%" fill="rgba(0,0,0,0.8)" mask="url(#tour-mask)" />
        </svg>
      )}

      {/* Interactive Overlay to prevent clicks on the page behind the tour */}
      <div className="absolute inset-0 z-0" onClick={(e) => {
        if (e.target === e.currentTarget && confirm("Are you sure you want to skip the tour?")) {
           endTour();
        }
      }} />

      {/* Spotlight Glow Border (Desktop Only) */}
      {!isMobile && targetRect && (
        <motion.div
          className="absolute z-10 border-2 border-sky-400 rounded-xl shadow-[0_0_20px_rgba(56,189,248,0.5)] pointer-events-none"
          initial={false}
          animate={{
            left: targetRect.left - padding,
            top: targetRect.top - padding,
            width: targetRect.width + padding * 2,
            height: targetRect.height + padding * 2,
          }}
          transition={{ type: "spring", stiffness: 100, damping: 20 }}
        />
      )}

      {/* Popover Card */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`step-${currentStepIndex}`}
          className={`absolute z-20 bg-zinc-950/95 backdrop-blur-3xl border border-white/10 shadow-[0_30px_60px_-15px_rgba(0,0,0,1)] overflow-hidden flex flex-col ${
            isMobile 
              ? "bottom-0 left-0 right-0 w-full rounded-t-3xl rounded-b-none p-6 pt-8 pb-10 border-b-0" 
              : "w-[90vw] max-w-[320px] rounded-2xl p-6 gap-3"
          }`}
          initial={isMobile ? { opacity: 0, y: "100%" } : { opacity: 0, y: 15, scale: 0.95 }}
          animate={isMobile ? { opacity: 1, y: 0 } : { opacity: 1, y: 0, scale: 1 }}
          exit={isMobile ? { opacity: 0, y: "100%" } : { opacity: 0, y: -15, scale: 0.95 }}
          transition={{ type: "spring", stiffness: 120, damping: 20 }}
          style={!isMobile && targetRect ? {
            left: Math.max(16, Math.min(window.innerWidth - Math.min(320, window.innerWidth * 0.9) - 16, targetRect.left + targetRect.width / 2 - Math.min(320, window.innerWidth * 0.9) / 2)),
            top: targetRect.bottom + padding + 24 + 200 > window.innerHeight 
              ? targetRect.top - padding - 220 - 16 
              : targetRect.bottom + padding + 16,
          } : {}}
        >
          {isMobile && (
            <div className="w-12 h-1.5 bg-white/20 rounded-full mx-auto absolute left-1/2 -translate-x-1/2 top-3"></div>
          )}

          {/* Header */}
          <div className="flex justify-between items-start mb-3">
            <div className="flex items-center gap-3">
              {isMobile && currentStep.icon && (
                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                  <currentStep.icon className="w-5 h-5 text-sky-400" />
                </div>
              )}
              <h3 className="text-sky-400 font-semibold text-lg tracking-tight">{currentStep.title}</h3>
            </div>
            <button 
              onClick={() => {
                 if(confirm("Are you sure you want to skip the tour?")) endTour();
              }}
                className="text-zinc-500 hover:text-zinc-300 hover:bg-white/10 p-1 rounded-md transition-colors"
                title="Close Tour"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            
            {/* Description */}
            <p className="text-zinc-400 text-sm leading-relaxed mb-4">{currentStep.description}</p>
            
            {/* Footer / Controls */}
            <div className={`flex items-center justify-between pt-4 border-t border-white/5 ${isMobile ? "mt-auto" : "mt-3"}`}>
              <div className="flex gap-1.5">
                {TOUR_STEPS.map((_, i) => (
                  <div 
                    key={i} 
                    className={`h-1.5 rounded-full transition-all duration-300 ${i === currentStepIndex ? "w-4 bg-sky-400" : "w-1.5 bg-zinc-700"}`} 
                  />
                ))}
              </div>
              
              <div className="flex gap-2">
                <button
                  onClick={prevStep}
                  disabled={currentStepIndex === 0}
                  className="px-2.5 py-1.5 rounded-lg text-white/50 hover:text-white hover:bg-white/5 disabled:opacity-0 disabled:pointer-events-none transition-colors text-sm font-medium flex items-center gap-1"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={nextStep}
                  className="px-4 py-1.5 rounded-lg bg-sky-500 hover:bg-sky-400 text-zinc-950 transition-colors text-sm font-semibold flex items-center gap-1 shadow-[0_0_15px_rgba(56,189,248,0.3)] active:scale-95"
                >
                  {currentStepIndex === TOUR_STEPS.length - 1 ? "Done" : "Next"} {currentStepIndex !== TOUR_STEPS.length - 1 && <ChevronRight className="w-4 h-4 -mr-1" />}
                </button>
              </div>
            </div>
          </motion.div>
      </AnimatePresence>
    </div>
  );
}
