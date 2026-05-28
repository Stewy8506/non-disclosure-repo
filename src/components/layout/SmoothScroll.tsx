"use client";

import { useEffect } from "react";
import Lenis from "lenis";

export default function SmoothScroll({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Disable Lenis on touch devices to prioritize native scrolling performance
    if (window.matchMedia("(pointer: coarse)").matches) {
      return;
    }

    // Instantiate Lenis with curated parameters for a premium "heavy" inertial feel
    const lenis = new Lenis({
      duration: 1.4, // Slightly longer duration for luxury weight
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Fluid exponential decelerating curve
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      wheelMultiplier: 1.0, // Natural scroll scaling
      touchMultiplier: 1.5, // Enhances mobile touch weight
    });

    // Expose Lenis globally to allow custom components/functions to scroll premiumly
    (window as any).lenis = lenis;

    // Connect Lenis to requestAnimationFrame loop
    let rafId: number;
    function raf(time: number) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }
    rafId = requestAnimationFrame(raf);

    // Check if URL has a hash on mount and scroll to it smoothly
    const hash = window.location.hash;
    if (hash) {
      const decodedHash = decodeURIComponent(hash);
      const target = document.querySelector(decodedHash);
      if (target) {
        // Delay slightly to ensure page assets/layout are stable
        setTimeout(() => {
          lenis.scrollTo(target as HTMLElement, {
            offset: 0,
            immediate: false,
            duration: 1.5,
          });
        }, 300);
      }
    }

    // Clean up on unmount
    return () => {
      lenis.destroy();
      (window as any).lenis = undefined;
      cancelAnimationFrame(rafId);
    };
  }, []);

  return <>{children}</>;
}
