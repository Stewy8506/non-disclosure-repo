"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Lightbulb, X } from "lucide-react";

const TIPS = [
  "Easter Egg: Try entering the Konami Code (↑ ↑ ↓ ↓ ← → ← → B A)",
  "Pro Tip: Press Cmd+K (or Ctrl+K) anywhere to instantly open Spotlight Search.",
  "Did you know? You can open the Terminal and type 'help' for a list of commands.",
  "Double-click any window's title bar to maximize it instantly.",
  "Check out the Lofi Player in the menu bar to stream music while you browse.",
];

export default function EasterEggTips() {
  const [currentTip, setCurrentTip] = useState<string | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [seenTips, setSeenTips] = useState<Set<number>>(new Set());

  useEffect(() => {
    // Only run on desktop
    if (typeof window !== "undefined" && window.innerWidth < 768) return;

    // Show first tip after 30 seconds
    let initialTimeout = setTimeout(() => {
      showRandomTip();
    }, 30000);

    // Show subsequent tips every 2 minutes
    const interval = setInterval(() => {
      showRandomTip();
    }, 120000);

    return () => {
      clearTimeout(initialTimeout);
      clearInterval(interval);
    };
  }, [seenTips]);

  const showRandomTip = () => {
    if (seenTips.size >= TIPS.length) {
      // Reset if all tips shown
      setSeenTips(new Set());
    }

    const availableTips = TIPS.map((_, i) => i).filter((i) => !seenTips.has(i));
    if (availableTips.length === 0) return;

    const randomIndex = availableTips[Math.floor(Math.random() * availableTips.length)];
    
    setCurrentTip(TIPS[randomIndex]);
    setIsVisible(true);
    setSeenTips((prev) => new Set(prev).add(randomIndex));

    // Auto hide after 8 seconds
    setTimeout(() => {
      setIsVisible(false);
    }, 8000);
  };

  return (
    <AnimatePresence>
      {isVisible && currentTip && (
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95, filter: "blur(4px)" }}
          transition={{ type: "spring", stiffness: 200, damping: 20 }}
          className="fixed bottom-24 right-6 z-[9000] hidden md:flex items-center gap-3 bg-zinc-950/80 backdrop-blur-3xl border border-white/10 p-3 pr-4 rounded-xl shadow-2xl max-w-sm"
        >
          <div className="w-8 h-8 rounded-full bg-yellow-500/10 flex items-center justify-center shrink-0">
            <Lightbulb className="w-4 h-4 text-yellow-500" />
          </div>
          <p className="text-sm text-zinc-300 leading-snug">
            {currentTip}
          </p>
          <button 
            onClick={() => setIsVisible(false)}
            className="absolute top-2 right-2 text-zinc-500 hover:text-white transition-colors"
          >
            <X className="w-3 h-3" />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
