"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Command, Wifi, BatteryMedium, Search } from "lucide-react";

export default function MenuBar() {
  const [time, setTime] = useState("");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true }));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div 
      initial={{ y: -50 }}
      animate={{ y: 0 }}
      className="fixed top-0 inset-x-0 h-7 z-50 flex items-center justify-between px-4 bg-zinc-900/60 backdrop-blur-xl border-b border-white/10 text-[13px] font-medium text-white/90 select-none shadow-sm"
    >
      {/* Left side */}
      <div className="flex items-center gap-5">
        <div className="flex items-center gap-2 hover:bg-white/10 px-2 py-0.5 rounded cursor-pointer transition-colors">
          <Command className="w-3.5 h-3.5" />
          <span className="font-bold tracking-tight">Dasan OS</span>
        </div>
        <div className="hidden md:flex items-center gap-1 text-white/80">
          <a href="#about" className="hover:bg-white/10 px-2 py-0.5 rounded transition-colors">File</a>
          <a href="#skills" className="hover:bg-white/10 px-2 py-0.5 rounded transition-colors">Edit</a>
          <a href="#projects" className="hover:bg-white/10 px-2 py-0.5 rounded transition-colors">View</a>
          <a href="#contact" className="hover:bg-white/10 px-2 py-0.5 rounded transition-colors">Window</a>
          <a href="#" className="hover:bg-white/10 px-2 py-0.5 rounded transition-colors">Help</a>
        </div>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-4 text-white/80">
        <div className="flex items-center gap-3">
          <Wifi className="w-3.5 h-3.5 hover:text-white cursor-pointer" />
          <Search className="w-3.5 h-3.5 hover:text-white cursor-pointer" />
          <BatteryMedium className="w-4 h-4 hover:text-white cursor-pointer" />
        </div>
        <span className="text-white/90 cursor-default">{time || "10:00 AM"}</span>
      </div>
    </motion.div>
  );
}
