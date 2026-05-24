"use client";

import { Mail } from "lucide-react";
import { motion } from "framer-motion";
import { GitHubIcon, LinkedInIcon, TwitterIcon } from "../ui/BrandIcons";

export default function Footer() {
  return (
    <footer className="relative px-6 py-12 border-t border-white/5 bg-background">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="text-sm text-muted">
          © {new Date().getFullYear()} <span className="text-white font-medium">anv</span>. All rights reserved.
        </div>
        
        <div className="flex items-center gap-6">
          <SocialLink href="https://github.com/Stewy8506" icon={<GitHubIcon className="w-4 h-4" />} />
          <SocialLink href="https://twitter.com" icon={<TwitterIcon className="w-4 h-4" />} />
          <SocialLink href="https://linkedin.com" icon={<LinkedInIcon className="w-4 h-4" />} />
          <SocialLink href="mailto:hello@example.com" icon={<Mail className="w-4 h-4" />} />
        </div>
      </div>
    </footer>
  );
}

function SocialLink({ href, icon }: { href: string; icon: React.ReactNode }) {
  return (
    <motion.a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      whileHover={{ y: -2, color: "#ffffff" }}
      className="text-muted transition-colors"
    >
      {icon}
    </motion.a>
  );
}
