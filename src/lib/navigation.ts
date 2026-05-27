const SECTION_IDS = new Set(["about", "skills", "projects", "contact"]);

export function getCanonicalHash(hash: string) {
  const value = hash.replace(/^#/, "").split("#")[0];
  return SECTION_IDS.has(value) ? value : "";
}

export function normalizeCurrentHash() {
  const sectionId = getCanonicalHash(window.location.hash);
  if (!sectionId || window.location.hash === `#${sectionId}`) return sectionId;

  window.history.replaceState(
    window.history.state,
    "",
    `${window.location.pathname}${window.location.search}#${sectionId}`
  );
  return sectionId;
}

export function scrollToSection(sectionId: string, options?: { updateUrl?: boolean }) {
  const section = document.getElementById(sectionId);
  if (!section) return;

  const lenisInstance = (window as any).lenis;
  if (lenisInstance) {
    lenisInstance.scrollTo(section, {
      duration: 1.4,
    });
  } else {
    section.scrollIntoView({ behavior: "smooth" });
  }

  if (options?.updateUrl !== false) {
    window.history.replaceState(
      window.history.state,
      "",
      `${window.location.pathname}${window.location.search}#${sectionId}`
    );

    // Auto-clear the hash from URL bar after smooth scroll completes (approx 800ms)
    setTimeout(() => {
      if (window.location.hash === `#${sectionId}`) {
        window.history.replaceState(
          window.history.state,
          "",
          `${window.location.pathname}${window.location.search}`
        );
      }
    }, 800);
  }
}
