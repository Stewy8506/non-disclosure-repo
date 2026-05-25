
"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Pusher from "pusher-js";
import { useSoundEffect } from "../../hooks/useSoundEffect";

interface Reaction {
  id: string;
  emoji: string;
  x: number;
  y: number;
  timestamp: number;
  intensity: number;
}

export default function EmojiWheel() {
  const { playPop } = useSoundEffect();
  const [isOpen, setIsOpen] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [intensity, setIntensity] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [activeReactions, setActiveReactions] = useState<Reaction[]>([]);
  
  const EMOJIS = ["❤️", "🔥", "🚀", "✨", "👏", "⭐", "💯", "🤯"];
  const RADIUS = 80;

  useEffect(() => {
    const KEY = process.env.NEXT_PUBLIC_PUSHER_KEY;
    const CLUSTER = process.env.NEXT_PUBLIC_PUSHER_CLUSTER;
    if (!KEY || !CLUSTER) return;

    const pusher = new Pusher(KEY, {
      cluster: CLUSTER,
      forceTLS: true,
      authEndpoint: "/api/pusher/auth",
    });

    const channel = pusher.subscribe("portfolio");
    channel.bind("client-reaction", (data: { emoji: string; x: number; y: number; intensity: number }) => {
      const id = Math.random().toString(36).substring(2, 9);
      setActiveReactions((prev) => [...prev, { id, ...data, timestamp: Date.now() }]);
    });

    return () => {
      pusher.unsubscribe("portfolio");
    };
  }, []);

  useEffect(() => {
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
      setPosition({ x: e.clientX, y: e.clientY });
      setIntensity(0);
      setIsOpen(true);
      setIsDragging(false);
    };

    const handleLeftClick = (e: MouseEvent) => {
      if (isOpen) {
        setIsOpen(false);
        setIsDragging(false);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsOpen(false);
        setIsDragging(false);
      }
    };

    window.addEventListener("contextmenu", handleContextMenu);
    window.addEventListener("click", handleLeftClick);
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("contextmenu", handleContextMenu);
      window.removeEventListener("click", handleLeftClick);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  useEffect(() => {
    const handleGlobalMouseMove = (e: MouseEvent) => {
      if (!isDragging || !isOpen) return;
      
      const dx = e.clientX - position.x;
      const dy = e.clientY - position.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      // Intensity scales from 0 to 1 (max drag distance 200px)
      setIntensity(Math.min(distance / 200, 1));
    };

    const handleGlobalMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      window.addEventListener("mousemove", handleGlobalMouseMove);
      window.addEventListener("mouseup", handleGlobalMouseUp);
    }

    return () => {
      window.removeEventListener("mousemove", handleGlobalMouseMove);
      window.removeEventListener("mouseup", handleGlobalMouseUp);
    };
  }, [isDragging, isOpen, position]);

  const triggerReaction = (emoji: string) => {
    setIsOpen(false);
    setIsDragging(false);
    
    const finalIntensity = intensity > 0 ? intensity : 0.2;
    playPop(finalIntensity);

    const x = position.x / window.innerWidth;
    const y = position.y / window.innerHeight;
    
    const KEY = process.env.NEXT_PUBLIC_PUSHER_KEY;
    const CLUSTER = process.env.NEXT_PUBLIC_PUSHER_CLUSTER;
    if (KEY && CLUSTER) {
      const pusher = new Pusher(KEY, { cluster: CLUSTER });
      const channel = pusher.subscribe("portfolio");
      channel.trigger("client-reaction", { emoji, x, y, intensity: finalIntensity });
    }

    const id = Math.random().toString(36).substring(2, 9);
    setActiveReactions((prev) => [...prev, { id, emoji, x: position.x, y: position.y, timestamp: Date.now(), intensity: finalIntensity }]);
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveReactions((prev) => prev.filter(r => Date.now() - r.timestamp < 3000));
    }, 100);
    return () => clearInterval(timer);
  }, []);

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5, rotate: -45 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            exit={{ opacity: 0, scale: 0.5, rotate: -45 }}
            className="fixed z-[10000] pointer-events-auto"
            style={{ 
              left: position.x, 
              top: position.y,
              transform: "translate(-50%, -50%)" 
            }}
            onMouseDown={(e) => {
              e.stopPropagation();
              setIsDragging(true);
            }}
          >
            <div className="relative w-40 h-40 flex items-center justify-center">
              {EMOJIS.map((emoji, i) => {
                const angle = (i * 360) / EMOJIS.length;
                return (
                  <motion.button
                    key={emoji}
                    whileHover={{ scale: 1.2 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={(e) => {
                      e.stopPropagation();
                      triggerReaction(emoji);
                    }}
                    className="absolute text-2xl cursor-pointer p-2 bg-white/10 backdrop-blur-md rounded-full hover:bg-white/20 transition-colors"
                    style={{
                      left: `calc(50% + ${Math.cos((angle * Math.PI) / 180) * RADIUS}px - 20px)`,
                      top: `calc(50% + ${Math.sin((angle * Math.PI) / 180) * RADIUS}px - 20px)`,
                    }}
                  >
                    {emoji}
                  </motion.button>
                );
              })}
              <div className="relative flex items-center justify-center">
                <motion.div 
                  className="w-4 h-4 bg-white rounded-full shadow-lg z-10" 
                  animate={{ scale: 1 + intensity * 3 }}
                />
                <motion.div 
                  className="absolute inset-0 rounded-full border-2 border-white/50"
                  initial={{ scale: 0 }}
                  animate={{ 
                    scale: 1 + intensity * 5, 
                    opacity: intensity > 0 ? 1 : 0 
                  }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="fixed inset-0 pointer-events-none z-[9999]">
        {activeReactions.map((r) => (
          <motion.div
            key={r.id}
            initial={{ opacity: 0, y: r.y, scale: 0.5 }}
            animate={{ 
              opacity: [0, 1, 0], 
              y: r.y - (100 * (1 + r.intensity)), 
              scale: [0.5, 1 + r.intensity, 1],
              rotate: Math.random() * 20 - 10
            }}
            transition={{ duration: 2, ease: "easeOut" }}
            className="absolute text-3xl pointer-events-none"
            style={{ left: r.x }}
          >
            {r.emoji}
          </motion.div>
        ))}
      </div>
    </>
  );
}
