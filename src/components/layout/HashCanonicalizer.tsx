"use client";

import { useEffect } from "react";
import { normalizeCurrentHash } from "@/lib/navigation";

export default function HashCanonicalizer() {
  useEffect(() => {
    const normalize = () => {
      normalizeCurrentHash();
    };

    normalize();
    window.addEventListener("hashchange", normalize);
    window.addEventListener("popstate", normalize);

    return () => {
      window.removeEventListener("hashchange", normalize);
      window.removeEventListener("popstate", normalize);
    };
  }, []);

  return null;
}
