"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";

export interface MenuItem {
  label: string;
  shortcut?: string;
  action?: () => void;
  divider?: boolean;
  disabled?: boolean;
}

interface MenuDropdownProps {
  isOpen: boolean;
  items: MenuItem[];
  xOffset?: number;
  yOffset?: number;
}

export default function MenuDropdown({ isOpen, items, xOffset = 0, yOffset = 24 }: MenuDropdownProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -5 }}
          transition={{ duration: 0.15, ease: "easeOut" }}
          className="absolute z-50 py-1.5 bg-zinc-900/90 backdrop-blur-2xl border border-white/10 rounded-lg shadow-2xl min-w-[220px]"
          style={{ top: yOffset, left: xOffset }}
        >
          {items.map((item, index) => {
            if (item.divider) {
              return <div key={`divider-${index}`} className="my-1.5 h-px bg-white/10" />;
            }

            return (
              <div
                key={item.label}
                onClick={(e) => {
                  e.stopPropagation();
                  if (!item.disabled && item.action) {
                    item.action();
                  }
                }}
                className={`flex items-center justify-between px-3 py-1 text-[13px] mx-1 rounded-md transition-colors
                  ${item.disabled 
                    ? "text-white/40 cursor-default" 
                    : "text-white/90 hover:bg-white/15 cursor-pointer"
                  }
                `}
              >
                <span>{item.label}</span>
                {item.shortcut && (
                  <span className="text-white/40 tracking-widest text-[11px] font-sans">
                    {item.shortcut}
                  </span>
                )}
              </div>
            );
          })}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
