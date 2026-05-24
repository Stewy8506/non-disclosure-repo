"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Command, Wifi, BatteryMedium, Search } from "lucide-react";
import MenuDropdown, { MenuItem } from "../ui/MenuDropdown";
import ToastContainer, { toast } from "../ui/Toast";

export default function MenuBar() {
  const [time, setTime] = useState("");
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true }));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setActiveMenu(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleMenuHover = (menu: string) => {
    if (activeMenu) {
      setActiveMenu(menu);
    }
  };

  const handleMenuClick = (menu: string) => {
    if (activeMenu === menu) {
      setActiveMenu(null);
    } else {
      setActiveMenu(menu);
    }
  };

  const menuData: Record<string, MenuItem[]> = {
    anvos: [
      { label: "About anv os", action: () => { setActiveMenu(null); document.getElementById('about')?.scrollIntoView({behavior: 'smooth'}) } },
      { divider: true, label: "" },
      { label: "System Preferences...", disabled: true },
      { label: "App Store...", disabled: true },
      { divider: true, label: "" },
      { label: "Restart", action: () => { window.location.reload(); } },
      { label: "Shut Down", disabled: true },
    ],
    File: [
      { label: "New Window", shortcut: "⌘N", action: () => { window.open(window.location.href, "_blank"); setActiveMenu(null); } },
      { divider: true, label: "" },
      { label: "Download Resume", shortcut: "⌘D", action: () => { 
        const link = document.createElement('a');
        link.href = '/resume.pdf';
        link.download = 'Anuvab_Das_Resume.pdf';
        link.click();
        toast("Downloading resume...", "success");
        setActiveMenu(null); 
      } },
      { divider: true, label: "" },
      { label: "Print...", shortcut: "⌘P", action: () => { window.print(); setActiveMenu(null); } },
      { label: "Close Window", shortcut: "⌘W", action: () => { toast("Cannot close main window.", "info"); setActiveMenu(null); } },
    ],
    Edit: [
      { label: "Undo", shortcut: "⌘Z", action: () => { toast("Undo", "info"); setActiveMenu(null); } },
      { label: "Redo", shortcut: "⇧⌘Z", action: () => { toast("Redo", "info"); setActiveMenu(null); } },
      { divider: true, label: "" },
      { label: "Cut", shortcut: "⌘X", action: () => { toast("Cut", "info"); setActiveMenu(null); } },
      { label: "Copy", shortcut: "⌘C", action: () => { toast("Copy", "info"); setActiveMenu(null); } },
      { label: "Paste", shortcut: "⌘V", action: () => { toast("Paste", "info"); setActiveMenu(null); } },
      { label: "Select All", shortcut: "⌘A", action: () => { toast("Select All", "info"); setActiveMenu(null); } },
    ],
    View: [
      { label: "Reload", shortcut: "⌘R", action: () => { window.location.reload(); } },
      { label: "Toggle Fullscreen", shortcut: "⌃⌘F", action: () => { 
        if (!document.fullscreenElement) {
          document.documentElement.requestFullscreen();
        } else {
          document.exitFullscreen();
        }
        setActiveMenu(null);
      } },
      { divider: true, label: "" },
      { label: "View Source", shortcut: "⌥⌘U", action: () => { window.open("https://github.com/Stewy8506/portfolio-app", "_blank"); setActiveMenu(null); } },
    ],
    Window: [
      { label: "Minimize", shortcut: "⌘M", action: () => { toast("Window Minimized", "info"); setActiveMenu(null); } },
      { label: "Zoom", action: () => { toast("Window Zoomed", "info"); setActiveMenu(null); } },
      { divider: true, label: "" },
      { label: "Bring All to Front", action: () => { toast("Brought to front", "info"); setActiveMenu(null); } },
    ],
    Help: [
      { label: "anv os Help", action: () => { toast("You are looking at it!", "success"); setActiveMenu(null); } },
      { label: "Contact Support", action: () => { document.getElementById('contact')?.scrollIntoView({behavior: 'smooth'}); setActiveMenu(null); } }
    ]
  };

  return (
    <>
      <ToastContainer />
      <motion.div
        ref={menuRef}
        initial={{ y: -50 }}
        animate={{ y: 0 }}
        className="fixed top-0 inset-x-0 h-7 z-50 flex items-center justify-between px-4 bg-zinc-900/60 backdrop-blur-xl border-b border-white/10 text-[13px] font-medium text-white/90 select-none shadow-sm"
      >
        {/* Left side */}
        <div className="flex items-center gap-5">
          <div className="relative">
            <div 
              onClick={() => handleMenuClick("anvos")}
              onMouseEnter={() => handleMenuHover("anvos")}
              className={`flex items-center gap-2 px-2 py-0.5 rounded cursor-pointer transition-colors ${activeMenu === "anvos" ? "bg-white/20" : "hover:bg-white/10"}`}
            >
              <Command className="w-3.5 h-3.5" />
              <span className="font-bold tracking-tight">anv os</span>
            </div>
            <MenuDropdown isOpen={activeMenu === "anvos"} items={menuData["anvos"]} />
          </div>

          <div className="hidden md:flex items-center gap-1 text-white/80">
            {["File", "Edit", "View", "Window", "Help"].map((menu) => (
              <div key={menu} className="relative">
                <div
                  onClick={() => handleMenuClick(menu)}
                  onMouseEnter={() => handleMenuHover(menu)}
                  className={`px-2 py-0.5 rounded cursor-pointer transition-colors ${activeMenu === menu ? "bg-white/20 text-white" : "hover:bg-white/10 hover:text-white"}`}
                >
                  {menu}
                </div>
                <MenuDropdown isOpen={activeMenu === menu} items={menuData[menu]} />
              </div>
            ))}
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
    </>
  );
}
