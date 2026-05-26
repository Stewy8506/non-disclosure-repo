"use client";

import { useEffect } from "react";
import { toast } from "./Toast";

const KONAMI_CODE = [
  "ArrowUp", "ArrowUp", 
  "ArrowDown", "ArrowDown", 
  "ArrowLeft", "ArrowRight", 
  "ArrowLeft", "ArrowRight", 
  "b", "a"
];

export default function KonamiCode() {
  const triggerEasterEgg = () => {
    toast("SYSTEM OVERRIDE INITIATED...", "success");
    document.body.classList.toggle("theme-matrix");
    
    // Add matrix styles if they don't exist
    if (!document.getElementById("matrix-styles")) {
      const style = document.createElement("style");
      style.id = "matrix-styles";
      style.innerHTML = `
        .theme-matrix {
          --background: #000000;
          --foreground: #00ff00;
        }
        .theme-matrix * {
          color: #00ff00 !important;
          border-color: #00ff00 !important;
          background-color: rgba(0, 20, 0, 0.8) !important;
          font-family: monospace !important;
        }
        .theme-matrix img, .theme-matrix canvas {
          filter: sepia(100%) hue-rotate(90deg) saturate(300%) !important;
        }
      `;
      document.head.appendChild(style);
    }
  };
  useEffect(() => {
    let keyIndex = 0;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === KONAMI_CODE[keyIndex]) {
        keyIndex++;
        if (keyIndex === KONAMI_CODE.length) {
          triggerEasterEgg();
          keyIndex = 0; // Reset
        }
      } else {
        keyIndex = 0; // Reset on wrong key
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);


  return null;
}
