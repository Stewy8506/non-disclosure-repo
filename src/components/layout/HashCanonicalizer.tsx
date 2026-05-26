"use client";

import { useEffect } from "react";
import { getCanonicalHash } from "@/lib/navigation";

export default function HashCanonicalizer() {
  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash;
      if (!hash) return;

      const sectionId = getCanonicalHash(hash);
      if (sectionId) {
        const element = document.getElementById(sectionId);
        if (element) {
          // Smooth scroll to the target section
          element.scrollIntoView({ behavior: "smooth" });

          // Auto-clear the hash from the URL after the smooth scroll completes (approx 800ms)
          setTimeout(() => {
            if (window.location.hash === hash) {
              window.history.replaceState(
                window.history.state,
                "",
                window.location.pathname + window.location.search
              );
            }
          }, 800);
        }
      }
    };

    // Run on initial mount with a slight delay to allow hydration and rendering
    const timer = setTimeout(handleHash, 200);

    window.addEventListener("hashchange", handleHash);
    window.addEventListener("popstate", handleHash);

    return () => {
      clearTimeout(timer);
      window.removeEventListener("hashchange", handleHash);
      window.removeEventListener("popstate", handleHash);
    };
  }, []);

  return null;
}
