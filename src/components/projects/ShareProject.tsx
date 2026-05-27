"use client";

import React, { useState, useEffect, useRef } from "react";
import { Share2, Copy, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { getProjectShortCode, Project } from "@/lib/projects";
import { TwitterIcon, LinkedInIcon } from "@/components/ui/BrandIcons";
import { useSoundEffect } from "@/hooks/useSoundEffect";
import { createPortal } from "react-dom";

// Custom SVGs to match premium design style
function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.455L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.42 9.864-9.864.002-2.637-1.03-5.115-2.906-6.99C16.654 1.876 14.179.845 11.54.845 6.104.845 1.68 5.269 1.676 10.705c-.001 1.64.453 3.24 1.314 4.676l-.99 3.612 3.702-.97L6.647 19.15z" />
    </svg>
  );
}

function RedditIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M24 11.5c0-1.65-1.35-3-3-3-.96 0-1.86.48-2.42 1.24-1.64-1-3.85-1.64-6.29-1.72l1.35-4.24 3.71.79c.07.96.88 1.73 1.86 1.73 1.02 0 1.85-.83 1.85-1.85s-.83-1.85-1.85-1.85c-.75 0-1.4.45-1.69 1.1l-4.14-.88c-.29-.06-.58.12-.66.41l-1.62 5.1C9.1 8.28 6.89 8.92 5.25 9.92 4.69 9.16 3.79 8.68 2.81 8.68c-1.65 0-3 1.35-3 3 0 1.13.63 2.11 1.57 2.62-.06.39-.07.78-.07 1.18 0 4.14 4.93 7.5 11 7.5s11-3.36 11-7.5c0-.4-.01-.79-.07-1.18.94-.5 1.57-1.48 1.57-2.62zm-18 2c-.77 0-1.38-.62-1.38-1.38s.62-1.38 1.38-1.38 1.38.62 1.38 1.38-.61 1.38-1.38 1.38zm10.74 4.8c-1.86 1.86-5.4 1.86-7.26 0-.27-.27-.27-.71 0-.97.27-.27.71-.27.97 0 1.32 1.33 3.82 1.33 5.14 0 .27-.27.71-.27.97 0 .27.26.27.7 0 .97zm.64-4.18c-.77 0-1.38-.62-1.38-1.38s.62-1.38 1.38-1.38 1.38.62 1.38 1.38-.62 1.38-1.38 1.38z" />
    </svg>
  );
}

interface ShareProjectProps {
  project: Project;
}

export default function ShareProject({ project }: ShareProjectProps) {
  const { playThocc } = useSoundEffect();
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [shortUrl, setShortUrl] = useState("");
  const [mounted, setMounted] = useState(false);
  const [popoverPos, setPopoverPos] = useState({ top: 0, left: 0 });
  const triggerRef = useRef<HTMLButtonElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
    if (typeof window !== "undefined") {
      const shortCode = getProjectShortCode(project);
      setShortUrl(`${window.location.origin}/p/${shortCode}`);
    }
  }, [project]);

  // Compute popover position anchored to trigger button
  useEffect(() => {
    if (isOpen && triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      setPopoverPos({
        top: rect.bottom + window.scrollY + 10,
        left: rect.left + window.scrollX,
      });
    }
  }, [isOpen]);

  // Click outside to close
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        popoverRef.current &&
        !popoverRef.current.contains(event.target as Node) &&
        triggerRef.current &&
        !triggerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const toggleOpen = () => {
    playThocc();
    setIsOpen((prev) => !prev);
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shortUrl);
      setCopied(true);
      playThocc();
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Could not copy text: ", err);
    }
  };

  const title = project.title || "Project Report";
  const desc = project.description || "Take a look at this case study.";
  const shareText = `Check out this project: ${title} - ${desc}`;

  const shareLinks = {
    x: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shortUrl)}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shortUrl)}`,
    whatsapp: `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText + " " + shortUrl)}`,
    reddit: `https://reddit.com/submit?title=${encodeURIComponent(title)}&url=${encodeURIComponent(shortUrl)}`,
  };

  const openShareLink = (url: string) => {
    playThocc();
    window.open(url, "_blank", "noopener,noreferrer,width=600,height=400");
  };

  const popover = (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          ref={popoverRef}
          initial={{ opacity: 0, scale: 0.95, y: 8 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 8 }}
          transition={{ duration: 0.15, ease: "easeOut" }}
          style={{
            position: "absolute",
            top: popoverPos.top,
            left: popoverPos.left,
            zIndex: 99999,
          }}
          className="w-72 sm:w-80 bg-zinc-950/98 backdrop-blur-xl border border-white/10 rounded-2xl p-5 shadow-[0_15px_60px_rgba(0,0,0,0.85)]"
        >
          <h4 className="text-sm font-bold text-white mb-3 tracking-tight">
            Share Case Study
          </h4>

          {/* Read-only URL + Copy Button */}
          <div className="flex items-center justify-between gap-2 bg-white/[0.03] border border-white/[0.08] rounded-xl px-3 py-2 text-xs font-mono text-zinc-400 overflow-hidden whitespace-nowrap mb-4">
            <span className="truncate flex-1 select-all">{shortUrl}</span>
            <button
              onClick={copyToClipboard}
              className="p-1 hover:bg-white/5 rounded-md text-zinc-500 hover:text-white transition-colors cursor-pointer shrink-0"
              title="Copy short link"
            >
              {copied ? (
                <Check className="w-3.5 h-3.5 text-emerald-400" />
              ) : (
                <Copy className="w-3.5 h-3.5" />
              )}
            </button>
          </div>

          {/* Micro-interactive Social Grid */}
          <div className="grid grid-cols-4 gap-2">
            {/* X / Twitter */}
            <button
              onClick={() => openShareLink(shareLinks.x)}
              className="flex flex-col items-center justify-center py-2.5 px-1 bg-white/[0.02] border border-white/5 rounded-xl hover:bg-white/[0.06] hover:border-white/10 hover:scale-[1.03] active:scale-[0.98] transition-all cursor-pointer group"
              title="Share on X"
            >
              <TwitterIcon className="w-4 h-4 text-zinc-400 group-hover:text-white transition-colors mb-1" />
              <span className="text-[10px] text-zinc-500 group-hover:text-zinc-300 transition-colors">X</span>
            </button>

            {/* LinkedIn */}
            <button
              onClick={() => openShareLink(shareLinks.linkedin)}
              className="flex flex-col items-center justify-center py-2.5 px-1 bg-white/[0.02] border border-white/5 rounded-xl hover:bg-white/[0.06] hover:border-white/10 hover:scale-[1.03] active:scale-[0.98] transition-all cursor-pointer group"
              title="Share on LinkedIn"
            >
              <LinkedInIcon className="w-4 h-4 text-zinc-400 group-hover:text-white transition-colors mb-1" />
              <span className="text-[10px] text-zinc-500 group-hover:text-zinc-300 transition-colors">LinkedIn</span>
            </button>

            {/* WhatsApp */}
            <button
              onClick={() => openShareLink(shareLinks.whatsapp)}
              className="flex flex-col items-center justify-center py-2.5 px-1 bg-white/[0.02] border border-white/5 rounded-xl hover:bg-white/[0.06] hover:border-white/10 hover:scale-[1.03] active:scale-[0.98] transition-all cursor-pointer group"
              title="Share via WhatsApp"
            >
              <WhatsAppIcon className="w-4 h-4 text-zinc-400 group-hover:text-white transition-colors mb-1" />
              <span className="text-[10px] text-zinc-500 group-hover:text-zinc-300 transition-colors">WhatsApp</span>
            </button>

            {/* Reddit */}
            <button
              onClick={() => openShareLink(shareLinks.reddit)}
              className="flex flex-col items-center justify-center py-2.5 px-1 bg-white/[0.02] border border-white/5 rounded-xl hover:bg-white/[0.06] hover:border-white/10 hover:scale-[1.03] active:scale-[0.98] transition-all cursor-pointer group"
              title="Share on Reddit"
            >
              <RedditIcon className="w-4 h-4 text-zinc-400 group-hover:text-white transition-colors mb-1" />
              <span className="text-[10px] text-zinc-500 group-hover:text-zinc-300 transition-colors">Reddit</span>
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  return (
    <>
      {/* Share Button Trigger */}
      <button
        ref={triggerRef}
        onClick={toggleOpen}
        onMouseEnter={playThocc}
        className="flex items-center gap-2 px-5 py-2.5 bg-white/5 border border-white/10 text-white font-semibold rounded-xl hover:bg-white/10 transition-colors text-sm cursor-pointer"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <Share2 className="w-4 h-4" /> Share Project
      </button>

      {/* Portal: render popover directly on document.body to escape all stacking contexts */}
      {mounted && createPortal(popover, document.body)}
    </>
  );
}
