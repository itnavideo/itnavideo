"use client";

import React from "react";
import type { WhiteStairCard, WhiteStairWordStyle } from "@/lib/captions/whiteStairTemplates";

export interface WhiteStairCaptionRendererProps {
  template: WhiteStairCard;
  phrase: {
    text: string;
    start: number;
    end: number;
    words: Array<{ word: string; start: number; end: number }>;
  };
  playbackTime: number;
  isPlaying: boolean;
  className?: string;
}

export function WhiteStairCaptionRenderer({
  template,
  phrase,
  playbackTime,
  isPlaying,
  className = "",
}: WhiteStairCaptionRendererProps) {
  const words = phrase.words && phrase.words.length > 0
    ? phrase.words
    : phrase.text.split(/\s+/).filter(Boolean).map((w, i, arr) => ({
        word: w,
        start: phrase.start + (i / Math.max(1, arr.length)) * Math.max(0.1, phrase.end - phrase.start),
        end: phrase.start + ((i + 1) / Math.max(1, arr.length)) * Math.max(0.1, phrase.end - phrase.start),
      }));

  if (words.length === 0) return null;

  const styleRules = template.words && template.words.length > 0
    ? template.words
    : [{ text: "", color: "#FFFFFF", bold: true }];

  // Active word index in current phrase
  const activeWordIndex = isPlaying
    ? words.findIndex((w) => playbackTime >= w.start && playbackTime <= w.end)
    : 0;

  return (
    <div
      className={`flex items-center justify-center flex-nowrap whitespace-nowrap gap-x-2 select-none ${className}`}
      style={{
        fontFamily: "Montserrat, 'Plus Jakarta Sans', Inter, sans-serif",
        lineHeight: 1.15,
        letterSpacing: "-0.015em",
      }}
    >
      {words.map((w, idx) => {
        // Resolve style rule for this word
        let rule: WhiteStairWordStyle;
        if (styleRules.length === 1) {
          rule = styleRules[0];
        } else if (styleRules.length === 2) {
          // Two-tone style (e.g. Creator 4, Creator 3, Red Wipe, Handwritten)
          // If 2 words: [0, 1] -> [Rule 0, Rule 1]
          // If 3 words: [0, 1, 2] -> [Rule 0, Rule 0, Rule 1] (last word gets the contrast tone)
          // If 4 words: [0, 1, 2, 3] -> [Rule 0, Rule 0, Rule 1, Rule 1]
          if (words.length <= 2) {
            rule = idx === 0 ? styleRules[0] : styleRules[1];
          } else {
            rule = idx >= words.length - 1 ? styleRules[1] : styleRules[0];
          }
        } else {
          // 3+ styles (e.g. Crazy, Solo, Discipline, Kinetic)
          const ruleIdx = Math.min(idx, styleRules.length - 1);
          rule = styleRules[ruleIdx];
        }

        const isCurrent = isPlaying && idx === activeWordIndex;

        // Custom font resolution (e.g. cursive)
        const resolvedFont = rule.font === "cursive"
          ? "'Caveat', 'Segoe Script', 'Brush Script MT', cursive"
          : undefined;

        // Text shadow & glow
        const glowShadow = rule.glow
          ? `0 0 16px ${rule.glow}, 0 2px 4px rgba(0,0,0,0.9)`
          : "0 2px 6px rgba(0,0,0,0.85)";

        // Pill badge styling
        if (rule.pill) {
          return (
            <span
              key={`${w.word}-${idx}`}
              className="inline-flex items-center justify-center transition-transform duration-100"
              style={{
                backgroundColor: rule.bg || "#00E5FF",
                color: rule.color || "#000000",
                fontWeight: 900,
                fontSize: "19px",
                borderRadius: "8px",
                padding: "2px 8px",
                transform: isCurrent ? "scale(1.08)" : "scale(1)",
                boxShadow: isCurrent ? "0 4px 14px rgba(0,0,0,0.4)" : "none",
              }}
            >
              {w.word}
            </span>
          );
        }

        return (
          <span
            key={`${w.word}-${idx}`}
            className="inline-block transition-transform duration-100"
            style={{
              color: rule.color || "#FFFFFF",
              fontWeight: rule.bold ? 900 : 700,
              fontStyle: rule.italic ? "italic" : "normal",
              fontFamily: resolvedFont,
              textDecoration: rule.underline ? "underline" : "none",
              textShadow: glowShadow,
              fontSize: "21px",
              transform: isCurrent ? "scale(1.08)" : "scale(1)",
              filter: isCurrent ? "brightness(1.15)" : "none",
            }}
          >
            {w.word}
          </span>
        );
      })}
    </div>
  );
}
