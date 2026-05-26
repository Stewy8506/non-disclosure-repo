"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import { Maximize2, Minimize2, ZoomIn, ZoomOut, RotateCcw, Network } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface MermaidDiagramProps {
  code: string;
  id: string;
}

const MIN_ZOOM = 0.4;
const MAX_ZOOM = 2.5;
const ZOOM_STEP = 0.2;

export default function MermaidDiagram({ code, id }: MermaidDiagramProps) {
  const [svg, setSvg] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [zoom, setZoom] = useState(1);
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let isMounted = true;

    async function renderDiagram() {
      if (typeof window === "undefined") return;

      try {
        const mermaid = (await import("mermaid")).default;
        mermaid.initialize({
          startOnLoad: false,
          theme: "base",
          securityLevel: "loose",
          fontFamily: "var(--font-geist-sans, Inter, sans-serif)",
          fontSize: 14,
          themeVariables: {
            // Base
            background: "transparent",
            mainBkg: "rgba(16, 185, 129, 0.06)",
            // Primary nodes
            primaryColor: "rgba(16, 185, 129, 0.08)",
            primaryBorderColor: "rgba(16, 185, 129, 0.4)",
            primaryTextColor: "#f4f4f5",
            // Secondary nodes
            secondaryColor: "rgba(6, 182, 212, 0.06)",
            secondaryBorderColor: "rgba(6, 182, 212, 0.35)",
            secondaryTextColor: "#e4e4e7",
            // Tertiary nodes
            tertiaryColor: "rgba(139, 92, 246, 0.06)",
            tertiaryBorderColor: "rgba(139, 92, 246, 0.35)",
            tertiaryTextColor: "#e4e4e7",
            // Edges
            lineColor: "rgba(52, 211, 153, 0.5)",
            edgeLabelBackground: "rgba(9, 9, 11, 0.9)",
            // Text
            textColor: "#d4d4d8",
            labelTextColor: "#e4e4e7",
            // ER Diagram
            attributeBackgroundColorEven: "rgba(16, 185, 129, 0.04)",
            attributeBackgroundColorOdd: "rgba(6, 182, 212, 0.04)",
            // Sequence diagram
            actorBorder: "rgba(16, 185, 129, 0.4)",
            actorBkg: "rgba(16, 185, 129, 0.06)",
            actorTextColor: "#f4f4f5",
            actorLineColor: "rgba(52, 211, 153, 0.3)",
            signalColor: "#34d399",
            signalTextColor: "#f4f4f5",
            labelBoxBkgColor: "rgba(9, 9, 11, 0.9)",
            labelBoxBorderColor: "rgba(16, 185, 129, 0.3)",
            loopTextColor: "#a1a1aa",
            noteBorderColor: "rgba(6, 182, 212, 0.3)",
            noteBkgColor: "rgba(6, 182, 212, 0.06)",
            noteTextColor: "#e4e4e7",
            activationBorderColor: "rgba(52, 211, 153, 0.5)",
            activationBkgColor: "rgba(16, 185, 129, 0.08)",
          },
        });

        const cleanId = `mermaid-${id.replace(/[^a-zA-Z0-9-]/g, "")}`;
        const { svg: renderedSvg } = await mermaid.render(cleanId, code);

        if (isMounted) {
          setSvg(renderedSvg);
          setError(null);
        }
      } catch (err: any) {
        console.error("Mermaid Render Error:", err);
        if (isMounted) {
          setError(err.message || "Failed to render diagram. Please check the syntax.");
        }
      }
    }

    renderDiagram();
    return () => { isMounted = false; };
  }, [code, id]);

  const handleZoomIn = useCallback(() => setZoom((z) => Math.min(z + ZOOM_STEP, MAX_ZOOM)), []);
  const handleZoomOut = useCallback(() => setZoom((z) => Math.max(z - ZOOM_STEP, MIN_ZOOM)), []);
  const handleReset = useCallback(() => setZoom(1), []);

  // ── Error state ────────────────────────────────────────────────────────────
  if (error) {
    return (
      <div className="p-4 rounded-2xl border border-red-900/40 bg-red-950/15 text-red-400 text-xs font-mono max-h-48 overflow-y-auto">
        <p className="font-semibold mb-1 flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-red-400 flex-shrink-0" />
          Diagram Syntax Error
        </p>
        <p className="text-red-300/80">{error}</p>
        <pre className="mt-2 p-2 bg-red-950/40 rounded text-[10px] text-red-300/60 overflow-x-auto">{code}</pre>
      </div>
    );
  }

  // ── Loading state ──────────────────────────────────────────────────────────
  if (!svg) {
    return (
      <div className="diagram-border-animated rounded-3xl">
        <div className="flex items-center justify-center py-16 rounded-3xl bg-zinc-950/60 diagram-grid-bg border border-white/[0.05] backdrop-blur-sm">
          <div className="flex flex-col items-center gap-4">
            <div className="relative">
              <Network className="w-8 h-8 text-zinc-700" />
              <div className="absolute -inset-3 rounded-full border-2 border-emerald-500/30 border-t-emerald-400 animate-spin" />
            </div>
            <span className="text-xs text-zinc-500 font-medium tracking-widest uppercase">
              Rendering diagram…
            </span>
          </div>
        </div>
      </div>
    );
  }

  // ── Shared diagram content ─────────────────────────────────────────────────
  const DiagramContent = ({ inModal = false }: { inModal?: boolean }) => (
    <div
      className={`relative group w-full diagram-border-animated rounded-3xl ${inModal ? "h-full" : ""}`}
    >
      {/* Inner card */}
      <div
        className={`relative w-full rounded-3xl overflow-hidden diagram-grid-bg border border-white/[0.06] backdrop-blur-sm transition-all duration-500 ${
          inModal ? "h-full flex flex-col" : "bg-zinc-950/70"
        }`}
      >
        {/* Top bar */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-white/[0.05] bg-white/[0.01] flex-shrink-0">
          <div className="flex items-center gap-2.5">
            {/* Traffic-light dots */}
            <span className="w-2.5 h-2.5 rounded-full bg-red-500/60" />
            <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/60" />
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/60" />
            <span className="ml-3 text-[10px] font-medium text-zinc-600 tracking-widest uppercase select-none">
              Interactive Diagram
            </span>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-1">
            <span className="text-[10px] text-zinc-700 mr-2 tabular-nums select-none">
              {Math.round(zoom * 100)}%
            </span>
            <button
              onClick={handleZoomOut}
              disabled={zoom <= MIN_ZOOM}
              className="p-1.5 rounded-lg text-zinc-500 hover:text-zinc-300 hover:bg-white/[0.06] disabled:opacity-30 disabled:cursor-not-allowed transition-all"
              aria-label="Zoom out"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={handleReset}
              className="p-1.5 rounded-lg text-zinc-500 hover:text-zinc-300 hover:bg-white/[0.06] transition-all"
              aria-label="Reset zoom"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={handleZoomIn}
              disabled={zoom >= MAX_ZOOM}
              className="p-1.5 rounded-lg text-zinc-500 hover:text-zinc-300 hover:bg-white/[0.06] disabled:opacity-30 disabled:cursor-not-allowed transition-all"
              aria-label="Zoom in"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
            <div className="w-px h-4 bg-white/10 mx-1" />
            <button
              onClick={() => {
                setZoom(1);
                setIsFullscreen(!isFullscreen);
              }}
              className="p-1.5 rounded-lg text-zinc-500 hover:text-zinc-300 hover:bg-white/[0.06] transition-all"
              aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
            >
              {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>

        {/* Diagram viewport */}
        <div
          className={`relative overflow-auto flex items-center justify-center ${inModal ? "flex-1 min-h-0" : "p-6 md:p-10"}`}
          style={{ cursor: zoom !== 1 ? "grab" : "default" }}
        >
          {/* Left + right edge fade for overflow hint */}
          <div className="pointer-events-none absolute inset-y-0 left-0 w-12 z-10"
            style={{ background: "linear-gradient(to right, rgba(9,9,11,0.4), transparent)" }}
          />
          <div className="pointer-events-none absolute inset-y-0 right-0 w-12 z-10"
            style={{ background: "linear-gradient(to left, rgba(9,9,11,0.4), transparent)" }}
          />

          <div
            ref={elementRef}
            className="mermaid-container transition-transform duration-200 ease-out origin-center"
            style={{ transform: `scale(${zoom})` }}
            dangerouslySetInnerHTML={{ __html: svg }}
          />
        </div>

        {/* Bottom hint */}
        {!inModal && (
          <div className="flex items-center justify-center gap-4 px-5 py-2.5 border-t border-white/[0.04] bg-white/[0.005]">
            <span className="text-[9px] text-zinc-700 tracking-widest uppercase font-medium select-none">
              Scroll to pan · Use controls to zoom · Click fullscreen for detail
            </span>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <>
      <DiagramContent />

      <AnimatePresence>
        {isFullscreen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-[99] flex items-center justify-center p-4 md:p-12"
            style={{ background: "rgba(0,0,0,0.92)", backdropFilter: "blur(24px)" }}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.97, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 220 }}
              className="w-full h-full max-w-7xl max-h-[90vh] flex flex-col"
            >
              <DiagramContent inModal />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
