'use client';
import { useCallback, useRef, useEffect } from 'react';

export const useSoundEffect = () => {
  const audioCtxRef = useRef<AudioContext | null>(null);

  useEffect(() => {
    // Pre-warm the audio context on mount (some browsers might keep it suspended until interaction)
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (AudioContextClass && !audioCtxRef.current) {
      try {
        audioCtxRef.current = new AudioContextClass();
      } catch (e) {
        console.error("Audio context creation failed", e);
      }
    }
  }, []);

  const playThocc = useCallback(() => {
    try {
      let audioCtx = audioCtxRef.current;
      if (!audioCtx) {
        const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
        if (!AudioContextClass) return;
        audioCtx = new AudioContextClass();
        audioCtxRef.current = audioCtx;
      }
      
      // Resume if suspended (browser auto-play policy)
      if (audioCtx.state === 'suspended') {
        audioCtx.resume();
      }

      const t = audioCtx.currentTime;

      // Master Gain to keep the sound subtle, soft, and premium
      const masterGain = audioCtx.createGain();
      masterGain.gain.setValueAtTime(0.12, t); // Soft, not loud or obtrusive
      masterGain.connect(audioCtx.destination);

      // 1. Primary Marbly Pop (Sine wave sweeping down rapidly from 650Hz to 380Hz)
      // This is the core "hollow pop" sound of a creamy/marbly keyboard switch or marbles tapping
      const popOsc = audioCtx.createOscillator();
      popOsc.type = 'sine';
      popOsc.frequency.setValueAtTime(650, t);
      popOsc.frequency.exponentialRampToValueAtTime(380, t + 0.035);

      const popGain = audioCtx.createGain();
      popGain.gain.setValueAtTime(0.7, t);
      popGain.gain.exponentialRampToValueAtTime(0.001, t + 0.045);

      popOsc.connect(popGain);
      popGain.connect(masterGain);

      // 2. High-frequency Glassy tap (Triangle wave for the subtle tactile contact sound)
      // A triangle wave is softer than a square wave, giving a nice round marble tap.
      const tapOsc = audioCtx.createOscillator();
      tapOsc.type = 'triangle';
      tapOsc.frequency.setValueAtTime(1100, t);
      tapOsc.frequency.exponentialRampToValueAtTime(550, t + 0.015);

      const tapGain = audioCtx.createGain();
      tapGain.gain.setValueAtTime(0.2, t);
      tapGain.gain.exponentialRampToValueAtTime(0.001, t + 0.018);

      tapOsc.connect(tapGain);
      tapGain.connect(masterGain);

      // 3. Ultra-soft muffled mechanical feedback (a tiny, deeply band-passed noise pulse)
      // This adds that "creamy keyboard" texture without sounding scratchy or harsh.
      const bufferSize = Math.floor(audioCtx.sampleRate * 0.02); // Very short: 20ms
      const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1);
      }
      const noiseSource = audioCtx.createBufferSource();
      noiseSource.buffer = buffer;

      // Bandpass filter to isolate the "marbly" resonance frequency (around 500Hz)
      const noiseFilter = audioCtx.createBiquadFilter();
      noiseFilter.type = 'bandpass';
      noiseFilter.frequency.setValueAtTime(500, t);
      noiseFilter.Q.setValueAtTime(3, t); // Resonant Q for a woody, hollow character

      const noiseGain = audioCtx.createGain();
      noiseGain.gain.setValueAtTime(0.15, t);
      noiseGain.gain.exponentialRampToValueAtTime(0.001, t + 0.02);

      noiseSource.connect(noiseFilter);
      noiseFilter.connect(noiseGain);
      noiseGain.connect(masterGain);

      // Start all layers
      popOsc.start(t);
      tapOsc.start(t);
      noiseSource.start(t);

      // Stop all layers to release nodes
      popOsc.stop(t + 0.05);
      tapOsc.stop(t + 0.02);
      noiseSource.stop(t + 0.03);
    } catch (e) {
      // Ignore audio errors gracefully
    }
  }, []);

  return { playThocc };
};
