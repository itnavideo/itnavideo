"use client";

import React, { useMemo } from "react";
import {
  isKineticCaptionStyle,
  type KineticCaptionWord,
} from "@/lib/captions/kineticStyles";
import { KineticCaptionLiveRenderer } from "@/components/captions/KineticCaptionLiveRenderer";

export interface UniversalCaptionWord {
  word?: string;
  text?: string;
  start: number;
  end: number;
}

export interface UniversalCaptionLiveRendererProps {
  styleName: string;
  words: UniversalCaptionWord[];
  playbackTime: number;
  isPlaying?: boolean;
  accentColor?: string;
  className?: string;
}

/**
 * UniversalCaptionLiveRenderer
 *
 * Real-time kinetic and typography subtitle renderer for in-studio video previews.
 * Seamlessly supports all 32 kinetic presets and classic social styles with:
 * - Real word-level timestamps & active karaoke highlighting
 * - Dynamic fonts, weights, colors, text strokes, and drop-shadows
 * - Live micro-animations and spring scale
 */
export function UniversalCaptionLiveRenderer({
  styleName,
  words,
  playbackTime,
  isPlaying = true,
  accentColor = "#FFE14D",
  className = "",
}: UniversalCaptionLiveRendererProps) {
  const norm = (styleName || "glow-viral").toLowerCase().trim();

  // Normalize words to ensure word property is always populated
  const normalizedWords: KineticCaptionWord[] = useMemo(() => {
    if (!words || words.length === 0) return [];
    return words.map((w, idx) => ({
      word: String(w.word || w.text || `word-${idx}`),
      start: Number(w.start ?? 0),
      end: Number(w.end ?? (Number(w.start ?? 0) + 0.4)),
    }));
  }, [words]);

  // If style matches one of the 32 kinetic style IDs or names, use KineticCaptionLiveRenderer
  if (isKineticCaptionStyle(styleName)) {
    return (
      <KineticCaptionLiveRenderer
        styleName={styleName}
        words={normalizedWords}
        playbackTime={playbackTime}
        isPlaying={isPlaying}
        accentColor={accentColor}
        className={className}
      />
    );
  }

  // Active word index from playback loop
  const activeIdx = useMemo(() => {
    if (!normalizedWords || normalizedWords.length === 0) return 0;
    const idx = normalizedWords.findIndex((w) => playbackTime >= w.start && playbackTime <= w.end);
    if (idx !== -1) return idx;
    const recent = normalizedWords.findIndex((w) => playbackTime >= w.start && playbackTime <= w.end + 0.35);
    if (recent !== -1) return recent;
    return 0;
  }, [normalizedWords, playbackTime]);

  const activeWordObj = normalizedWords[activeIdx] || normalizedWords[0];
  const activeWordText = activeWordObj?.word || "CAPTIONS";

  // Visible window of 3 words for punchy short-form / subtitle readability
  const windowStart = Math.max(0, Math.min(activeIdx - 1, Math.max(0, normalizedWords.length - 3)));
  const visibleWords = normalizedWords.slice(windowStart, windowStart + 3);

  // 1. Hormozi Viral Pop
  if (norm.includes("hormozi") || norm === "pop-word") {
    return (
      <div className={`flex flex-wrap items-center justify-center gap-2 select-none ${className}`}>
        {visibleWords.map((w, idx) => {
          const isActive = w.word === activeWordText;
          return (
            <span
              key={`${w.word}-${idx}`}
              style={{
                fontFamily: "Montserrat, sans-serif",
                WebkitTextStroke: "2px #000",
                textShadow: "0 4px 0 #000, 0 8px 16px rgba(0,0,0,0.8)",
                color: isActive ? "#22C55E" : "#FFFFFF",
                transform: isActive ? "scale(1.15)" : "scale(1)",
              }}
              className="text-base sm:text-lg font-black uppercase tracking-tight transition-transform duration-150 inline-block"
            >
              {w.word}
            </span>
          );
        })}
      </div>
    );
  }

  // 2. MrBeast Shorts Impact
  if (norm.includes("mrbeast") || norm.includes("impact") || norm === "slam-headline") {
    return (
      <div className={`flex flex-wrap items-center justify-center gap-2 select-none ${className}`}>
        {visibleWords.map((w, idx) => {
          const isActive = w.word === activeWordText;
          return (
            <span
              key={`${w.word}-${idx}`}
              style={{
                fontFamily: "Impact, Anton, sans-serif",
                WebkitTextStroke: "2.5px #000",
                textShadow: "0 3px 0 #000, 0 6px 14px rgba(0,0,0,0.9)",
                color: isActive ? accentColor : "#FFFFFF",
                transform: isActive ? "scale(1.12)" : "scale(1)",
              }}
              className="text-lg sm:text-xl font-black uppercase tracking-wide transition-transform duration-100 inline-block"
            >
              {w.word}
            </span>
          );
        })}
      </div>
    );
  }

  // 3. Neon Glow / Cyan Futuristic
  if (norm.includes("neon") || norm.includes("glow") || norm === "neon-glow") {
    return (
      <div className={`flex flex-wrap items-center justify-center gap-2 select-none ${className}`}>
        {visibleWords.map((w, idx) => {
          const isActive = w.word === activeWordText;
          return (
            <span
              key={`${w.word}-${idx}`}
              style={{
                fontFamily: "Montserrat, sans-serif",
                color: isActive ? "#06B6D4" : "#FFFFFF",
                textShadow: isActive
                  ? "0 0 16px #06B6D4, 0 0 32px rgba(6,182,212,0.8), 0 2px 4px #000"
                  : "0 2px 6px rgba(0,0,0,0.9)",
                transform: isActive ? "scale(1.12)" : "scale(1)",
              }}
              className="text-base sm:text-lg font-black uppercase tracking-tight transition-all inline-block"
            >
              {w.word}
            </span>
          );
        })}
      </div>
    );
  }

  // 4. Box Highlight / Pill
  if (norm.includes("box") || norm.includes("pill") || norm === "box-highlight" || norm === "pill-highlight") {
    return (
      <div className={`flex flex-wrap items-center justify-center gap-1.5 select-none ${className}`}>
        {visibleWords.map((w, idx) => {
          const isActive = w.word === activeWordText;
          return (
            <span
              key={`${w.word}-${idx}`}
              style={{
                fontFamily: "Montserrat, sans-serif",
                backgroundColor: isActive ? "#0284C7" : "transparent",
                color: "#FFFFFF",
                transform: isActive ? "scale(1.1)" : "scale(1)",
              }}
              className={`text-sm sm:text-base font-black uppercase tracking-tight px-2 py-0.5 rounded-lg transition-all inline-block ${
                isActive ? "shadow-md shadow-sky-500/50" : ""
              }`}
            >
              {w.word}
            </span>
          );
        })}
      </div>
    );
  }

  // 5. Karaoke Smooth Line
  if (norm.includes("karaoke") || norm === "karaoke-line") {
    return (
      <div className={`flex flex-wrap items-center justify-center gap-2 select-none ${className}`}>
        {visibleWords.map((w, idx) => {
          const isActive = w.word === activeWordText;
          return (
            <span
              key={`${w.word}-${idx}`}
              style={{
                fontFamily: "Plus Jakarta Sans, sans-serif",
                color: isActive ? "#FBBF24" : "rgba(255,255,255,0.7)",
                textDecoration: isActive ? "underline" : "none",
                textUnderlineOffset: "6px",
                textDecorationThickness: "3px",
                transform: isActive ? "scale(1.08)" : "scale(1)",
              }}
              className="text-base sm:text-lg font-bold tracking-tight transition-all inline-block"
            >
              {w.word}
            </span>
          );
        })}
      </div>
    );
  }

  // 6. Submagic Aura Glow
  if (norm.includes("submagic")) {
    return (
      <div className={`flex flex-wrap items-center justify-center gap-2 select-none ${className}`}>
        {visibleWords.map((w, idx) => {
          const isActive = w.word === activeWordText;
          return (
            <span
              key={`${w.word}-${idx}`}
              style={{
                fontFamily: "Montserrat, sans-serif",
                color: isActive ? "#FFFFFF" : "rgba(255,255,255,0.7)",
                textShadow: isActive
                  ? "0 0 16px rgba(192,132,252,0.9), 0 0 30px rgba(244,114,182,0.7), 0 2px 4px #000"
                  : "0 2px 6px rgba(0,0,0,0.8)",
                transform: isActive ? "scale(1.1)" : "scale(1)",
              }}
              className="text-sm sm:text-base font-black uppercase tracking-tight transition-transform inline-block"
            >
              {w.word}
            </span>
          );
        })}
      </div>
    );
  }

  // 7. Simple Clean / Stacy Pill
  if (norm.includes("simple") || norm.includes("clean") || norm.includes("pill") || norm.includes("stacy")) {
    return (
      <div className={`inline-flex max-w-[92%] items-center justify-center gap-1.5 rounded-full border border-white/20 bg-slate-900/90 px-4 py-1.5 shadow-xl backdrop-blur-md ${className}`}>
        {visibleWords.map((w, idx) => {
          const isActive = w.word === activeWordText;
          return (
            <span
              key={`${w.word}-${idx}`}
              style={{
                fontFamily: "Inter, sans-serif",
                color: isActive ? accentColor : "#FFFFFF",
                fontWeight: isActive ? 900 : 600,
                transform: isActive ? "scale(1.08)" : "scale(1)",
              }}
              className="text-xs sm:text-sm tracking-normal transition-all inline-block"
            >
              {w.word}
            </span>
          );
        })}
      </div>
    );
  }

  // Fallback: Clean Word Highlight
  return (
    <div className={`flex flex-wrap items-center justify-center gap-2 select-none ${className}`}>
      {visibleWords.map((w, idx) => {
        const isActive = w.word === activeWordText;
        return (
          <span
            key={`${w.word}-${idx}`}
            style={{
              fontFamily: "Montserrat, sans-serif",
              color: isActive ? accentColor : "#FFFFFF",
              fontWeight: 800,
              textShadow: "0 2px 8px rgba(0,0,0,0.8)",
              transform: isActive ? "scale(1.1)" : "scale(1)",
            }}
            className="text-sm sm:text-base uppercase tracking-tight transition-transform inline-block"
          >
            {w.word}
          </span>
        );
      })}
    </div>
  );
}
