"use client";

import { motion } from "framer-motion";

export default function Navbar() {
  return (
    <motion.nav 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="fixed top-0 left-0 right-0 z-50 flex justify-center p-6"
    >
      <div className="glass-effect px-6 py-3 rounded-full flex items-center gap-8 text-sm font-medium">
        <a href="#about" className="hover:text-white text-muted transition-colors">About</a>
        <a href="#skills" className="hover:text-white text-muted transition-colors">Skills</a>
        <a href="#projects" className="hover:text-white text-muted transition-colors">Projects</a>
        <div className="w-px h-4 bg-zinc-800" />
        <a href="mailto:hello@example.com" className="hover:text-white text-muted transition-colors">Contact</a>
      </div>
    </motion.nav>
  );
}
