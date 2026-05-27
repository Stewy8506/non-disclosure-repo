"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { Volume2, VolumeX, Loader2 } from "lucide-react";
import { toast } from "../ui/Toast";
import { useSoundEffect } from "@/hooks/useSoundEffect";

const MOBILE_VOLUME = 0.75; // locked volume on phone

export default function MusicPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [volume, setVolume] = useState(0.5); // Default to 50%
  const [showSlider, setShowSlider] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const playerRef = useRef<any>(null);
  const initializedRef = useRef(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { playThocc } = useSoundEffect();

  // Detect mobile once on mount
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  // Close slider when clicking outside
  const handleClickOutside = useCallback((e: MouseEvent) => {
    if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
      setShowSlider(false);
    }
  }, []);

  useEffect(() => {
    if (showSlider) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showSlider, handleClickOutside]);

  const initYouTubePlayer = () => {
    if (typeof window === "undefined" || initializedRef.current) return;
    setIsLoading(true);
    initializedRef.current = true;

    let div = document.getElementById("youtube-lofi-player");
    if (!div) {
      div = document.createElement("div");
      div.id = "youtube-lofi-player";
      (div as HTMLElement).style.display = "none";
      (div as HTMLElement).style.position = "absolute";
      (div as HTMLElement).style.width = "0px";
      (div as HTMLElement).style.height = "0px";
      (div as HTMLElement).style.opacity = "0";
      (div as HTMLElement).style.pointerEvents = "none";
      document.body.appendChild(div);
    }

    const startVol = isMobile ? MOBILE_VOLUME : volume;

    const initPlayer = () => {
      try {
        if (playerRef.current) return;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        playerRef.current = new (window as any).YT.Player("youtube-lofi-player", {
          height: "0",
          width: "0",
          videoId: "CFGLoQIhmow",
          playerVars: {
            autoplay: 1,
            controls: 0,
            disablekb: 1,
            fs: 0,
            loop: 1,
            playlist: "CFGLoQIhmow",
            modestbranding: 1,
            rel: 0,
            showinfo: 0,
          },
          events: {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            onReady: (event: any) => {
              event.target.setVolume(startVol * 100);
              setIsLoading(false);
              setIsPlaying(true);
              toast("Playing: Lofi Music 🎧", "success");
            },
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            onStateChange: (event: any) => {
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              if (event.data === (window as any).YT.PlayerState.ENDED) {
                event.target.playVideo();
              }
            },
          },
        });
      } catch (e) {
        console.error("YouTube Player initialization failed", e);
        setIsLoading(false);
      }
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if (!(window as any).YT) {
      const tag = document.createElement("script");
      tag.src = "https://www.youtube.com/iframe_api";
      const firstScriptTag = document.getElementsByTagName("script")[0];
      if (firstScriptTag?.parentNode) {
        firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
      } else {
        document.head.appendChild(tag);
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (window as any).onYouTubeIframeAPIReady = () => {
        initPlayer();
      };
    } else {
      initPlayer();
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    if (playerRef.current && typeof playerRef.current.setVolume === "function") {
      playerRef.current.setVolume(val * 100);
    }
  };

  const toggleMusic = () => {
    if (isLoading) return;

    if (!initializedRef.current) {
      initYouTubePlayer();
      return;
    }

    if (!playerRef.current || typeof playerRef.current.playVideo !== "function") {
      toast("Player is loading... please try again in a moment.", "info");
      return;
    }

    try {
      if (isPlaying) {
        playerRef.current.pauseVideo();
        setIsPlaying(false);
        toast("Soothing Stream Paused", "info");
      } else {
        const vol = isMobile ? MOBILE_VOLUME : volume;
        playerRef.current.setVolume(vol * 100);
        playerRef.current.playVideo();
        setIsPlaying(true);
        toast("Playing: Lofi Music 🎧", "success");
      }
    } catch (e) {
      console.error("Playback toggle failed", e);
      toast("Playback blocked. Please interact with the page first.", "error");
    }
  };

  // Right-click opens the volume slider (desktop only)
  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isMobile) return;
    setShowSlider((prev) => !prev);
  };

  return (
    <div
      id="tour-lofi"
      ref={wrapperRef}
      className="relative flex items-center gap-1.5 px-1.5 py-0.5 rounded-lg hover:bg-white/5 transition-all duration-300"
      onContextMenu={handleContextMenu}
    >
      <button
        onClick={toggleMusic}
        onContextMenu={handleContextMenu}
        className="flex items-center justify-center p-0.5 rounded active:scale-95 transition-all text-white/90 cursor-pointer outline-none border-0 bg-transparent"
        title={isPlaying ? "Pause Lofi Stream" : "Stream Soothing Lofi"}
        aria-label={isPlaying ? "Pause Background Music" : "Play Background Music"}
      >
        {isLoading ? (
          <Loader2 className="w-4 h-4 md:w-3.5 md:h-3.5 text-zinc-400 animate-spin" />
        ) : isPlaying ? (
          <Volume2 className="w-4 h-4 md:w-3.5 md:h-3.5 text-sky-400 animate-pulse" />
        ) : (
          <VolumeX className="w-4 h-4 md:w-3.5 md:h-3.5 text-zinc-400 hover:text-white" />
        )}
      </button>

      {/* Vertical Volume Slider — desktop right-click only */}
      {!isMobile && showSlider && (
        <div
          className="absolute top-full left-1/2 -translate-x-1/2 mt-3 flex flex-col items-center gap-2 p-3 bg-zinc-900/95 border border-white/10 rounded-xl backdrop-blur-xl shadow-2xl z-50 animate-in fade-in zoom-in-95 duration-150"
          style={{ transformOrigin: "top center" }}
        >
          {/* Volume % label */}
          <span className="text-[10px] font-semibold text-sky-400 tabular-nums select-none">
            {Math.round(volume * 100)}%
          </span>

          {/* Vertical range input */}
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={volume}
            onChange={handleVolumeChange}
            className="appearance-none cursor-pointer focus:outline-none"
            style={{
              writingMode: "vertical-lr" as React.CSSProperties["writingMode"],
              direction: "rtl",
              WebkitAppearance: "slider-vertical",
              width: "4px",
              height: "80px",
              accentColor: "rgb(56 189 248)",
              background: `linear-gradient(to top, rgb(56 189 248) ${volume * 100}%, rgba(255,255,255,0.15) ${volume * 100}%)`,
              borderRadius: "999px",
              outline: "none",
            }}
            title={`Volume: ${Math.round(volume * 100)}%`}
          />

          {/* Low vol icon at bottom */}
          <VolumeX className="w-3 h-3 text-zinc-500" />
        </div>
      )}
    </div>
  );
}
