'use client';
import { useCallback, useRef, useEffect } from 'react';

export const useSoundEffect = () => {
  const audioCtxRef = useRef<AudioContext | null>(null);

  useEffect(() => {
    // Pre-warm the audio context on mount (some browsers might keep it suspended until interaction)
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (AudioContextClass && !audioCtxRef.current) {
      try {
        audioCtxRef.current = new AudioContextClass();
      } catch {
        console.error("Audio context creation failed");
      }
    }
  }, []);

  const playThocc = useCallback(() => {
    try {
      let audioCtx = audioCtxRef.current;
      if (!audioCtx) {
        const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        if (!AudioContextClass) return;
        audioCtx = new AudioContextClass();
        audioCtxRef.current = audioCtx;
      }
      
      if (audioCtx.state === 'suspended') {
        audioCtx.resume();
      }

      const t = audioCtx.currentTime;

      const masterGain = audioCtx.createGain();
      masterGain.gain.setValueAtTime(0.12, t); 
      masterGain.connect(audioCtx.destination);

      const popOsc = audioCtx.createOscillator();
      popOsc.type = 'sine';
      popOsc.frequency.setValueAtTime(650, t);
      popOsc.frequency.exponentialRampToValueAtTime(380, t + 0.035);

      const popGain = audioCtx.createGain();
      popGain.gain.setValueAtTime(0.7, t);
      popGain.gain.exponentialRampToValueAtTime(0.001, t + 0.045);

      popOsc.connect(popGain);
      popGain.connect(masterGain);

      const tapOsc = audioCtx.createOscillator();
      tapOsc.type = 'triangle';
      tapOsc.frequency.setValueAtTime(1100, t);
      tapOsc.frequency.exponentialRampToValueAtTime(550, t + 0.015);

      const tapGain = audioCtx.createGain();
      tapGain.gain.setValueAtTime(0.2, t);
      tapGain.gain.exponentialRampToValueAtTime(0.001, t + 0.018);

      tapOsc.connect(tapGain);
      tapGain.connect(masterGain);

      popOsc.start(t);
      tapOsc.start(t);
      popOsc.stop(t + 0.05);
      tapOsc.stop(t + 0.02);
    } catch {
      // Ignore audio errors gracefully
    }
  }, []);

  const playPop = useCallback((intensity: number = 1) => {
    try {
      let audioCtx = audioCtxRef.current;
      if (!audioCtx) {
        const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        if (!AudioContextClass) return;
        audioCtx = new AudioContextClass();
        audioCtxRef.current = audioCtx;
      }
      
      if (audioCtx.state === 'suspended') {
        audioCtx.resume();
      }

      const t = audioCtx.currentTime;

      // Scale master gain and pitch based on intensity
      const masterGain = audioCtx.createGain();
      masterGain.gain.setValueAtTime(0.15 + (intensity * 0.2), t); 
      masterGain.connect(audioCtx.destination);

      // 1. The "Thump" - scale frequency down for higher intensity (heavier)
      const thumpOsc = audioCtx.createOscillator();
      thumpOsc.type = 'sine';
      thumpOsc.frequency.setValueAtTime(150 - (intensity * 50), t);
      thumpOsc.frequency.exponentialRampToValueAtTime(60 - (intensity * 20), t + 0.06);
      const thumpGain = audioCtx.createGain();
      thumpGain.gain.setValueAtTime(0.4 + (intensity * 0.4), t);
      thumpGain.gain.exponentialRampToValueAtTime(0.001, t + 0.06);
      thumpOsc.connect(thumpGain);
      thumpGain.connect(masterGain);

      // 2. The "Pop" - scale frequency and duration
      const popOsc = audioCtx.createOscillator();
      popOsc.type = 'sine';
      popOsc.frequency.setValueAtTime(1100 + (intensity * 400), t);
      popOsc.frequency.exponentialRampToValueAtTime(300, t + 0.05 + (intensity * 0.05));
      const popGain = audioCtx.createGain();
      popGain.gain.setValueAtTime(0.7 + (intensity * 0.2), t);
      popGain.gain.exponentialRampToValueAtTime(0.001, t + 0.05 + (intensity * 0.05));
      popOsc.connect(popGain);
      popGain.connect(masterGain);

      // 3. The "Snap"
      const snapOsc = audioCtx.createOscillator();
      snapOsc.type = 'triangle';
      snapOsc.frequency.setValueAtTime(2800 + (intensity * 1000), t);
      snapOsc.frequency.exponentialRampToValueAtTime(1200, t + 0.01);
      const snapGain = audioCtx.createGain();
      snapGain.gain.setValueAtTime(0.3 + (intensity * 0.3), t);
      snapGain.gain.exponentialRampToValueAtTime(0.001, t + 0.015);
      snapOsc.connect(snapGain);
      snapGain.connect(masterGain);

      thumpOsc.start(t);
      popOsc.start(t);
      snapOsc.start(t);

      thumpOsc.stop(t + 0.07);
      popOsc.stop(t + 0.1);
      snapOsc.stop(t + 0.02);
    } catch {
      // Ignore audio errors gracefully
    }
  }, []);

  return { playThocc, playPop };
};
