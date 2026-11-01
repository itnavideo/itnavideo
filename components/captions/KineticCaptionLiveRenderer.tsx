"use client";

import React, { useMemo, useEffect } from "react";
import {
  getKineticStyle,
  generateAllKineticCss,
  KINETIC_STYLES,
  type KineticCaptionWord,
} from "@/lib/captions/kineticStyles";

export type { KineticCaptionWord };

export interface KineticCaptionLiveRendererProps {
  styleName: string;
  words: KineticCaptionWord[];
  playbackTime: number;
  isPlaying: boolean;
  accentColor?: string;
  className?: string;
}

export function KineticCaptionLiveRenderer({
  styleName,
  words,
  playbackTime,
  isPlaying,
  accentColor = "#ffe14d",
  className = "",
}: KineticCaptionLiveRendererProps) {
  const styleDef = getKineticStyle(styleName) || KINETIC_STYLES[0];
  const { index: cur, layout: L, chunk: n, flags: f } = styleDef;

  // Active word index based on playbackTime
  const activeIndex = useMemo(() => {
    if (!words || words.length === 0) return -1;
    const idx = words.findIndex((w) => playbackTime >= w.start && playbackTime <= w.end);
    if (idx !== -1) return idx;

    // During brief pauses between words (up to 0.4s pause), keep last word visible
    const recentIdx = words.findIndex((w) => playbackTime >= w.start && playbackTime <= w.end + 0.4);
    if (recentIdx !== -1) return recentIdx;

    if (!isPlaying) return 0;
    return -1;
  }, [words, playbackTime, isPlaying]);

  if (!words || words.length === 0 || activeIndex === -1) {
    return null;
  }

  const activeWord = words[activeIndex];
  if (!activeWord) return null;

  // Helper: group of words
  const grp = (idx: number, size: number) => {
    const s = Math.floor(idx / size) * size;
    return words.slice(s, s + size).map((w, j) => ({
      ...w,
      i: s + j,
    }));
  };

  // Base classes for caption container
  const isUpper = f.includes("u");
  const isLower = f.includes("l");
  const isReveal = f.includes("r");

  const containerCls = `s${cur} L-${L} ${isUpper ? "u" : ""} ${isLower ? "lo" : ""} ${isReveal ? "rv" : ""}`;

  return (
    <div
      className={`relative select-none text-center pointer-events-none ${className}`}
      style={
        {
          "--a": accentColor,
          width: "94%",
          maxWidth: "380px",
          margin: "0 auto",
          lineHeight: 1.15,
          color: "#FFFFFF",
        } as React.CSSProperties
      }
    >
      {/* Google Fonts for all 50 kinetic styles */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Anton&family=Bebas+Neue&family=Bangers&family=Permanent+Marker&family=Playfair+Display:ital,wght@1,800&family=Montserrat:wght@500;700;800;900&display=swap');

        .w { display: inline-block; margin: 0 .1em; }
        .u { text-transform: uppercase; }
        .lo { text-transform: lowercase; }
        .rv .nx { visibility: hidden; }
        .L-s .w { display: block; margin: 0; }
        .eh { display: block; animation: bi .3s ease-out; }
        .w i { display: inline-block; width: .5em; height: 1em; background: var(--a); vertical-align: -.15em; animation: bl .6s steps(1) infinite; }

        @keyframes pop { 0% { transform: scale(.6); opacity: 0; } 60% { transform: scale(1.12); } 100% { transform: scale(1); opacity: 1; } }
        @keyframes slam { 0% { transform: scale(2.8) rotate(-8deg); opacity: 0; } 55% { transform: scale(.95) rotate(2deg); opacity: 1; } 70% { transform: translate(-4px, 0); } 85% { transform: translate(4px, 0); } 100% { transform: scale(1) translate(0, 0); } }
        @keyframes zoom { from { transform: scale(.3); opacity: 0; } to { transform: scale(1); opacity: 1; } }
        @keyframes drop { 0% { transform: translateY(-200%); opacity: 0; } 60% { transform: translateY(12%); } 80% { transform: translateY(-6%); } 100% { transform: none; } }
        @keyframes glitch { 0%, 100% { transform: none; } 20% { transform: translate(-.05em, .02em) skewX(8deg); } 40% { transform: translate(.05em, -.02em); } 60% { transform: translate(-.03em, 0) skewX(-8deg); } }
        @keyframes flip { from { transform: rotateX(90deg); opacity: 0; } }
        @keyframes bi { from { filter: blur(10px); opacity: 0; transform: scale(1.15); } to { filter: blur(0); opacity: 1; transform: scale(1); } }
        @keyframes spin { from { transform: rotate(-180deg) scale(.2); opacity: 0; } to { transform: rotate(0) scale(1); opacity: 1; } }
        @keyframes wipe { from { clip-path: inset(0 100% 0 0); } to { clip-path: inset(0); } }
        @keyframes beat { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.15); } }
        @keyframes up { from { transform: translateY(40%); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
        @keyframes hue { to { filter: hue-rotate(360deg); } }
        @keyframes bnc { 40% { transform: translateY(-.3em); } }
        @keyframes bl { 50% { opacity: 0; } }

        ${generateAllKineticCss()}
      `}</style>

      {/* Render matching layout */}
      <div id="cap" className={containerCls}>
        {/* Layout 'o': One word at a time */}
        {L === "o" && (
          <span
            key={`w-${activeIndex}`}
            className={`w on ${activeWord.isKeyword ? "k" : ""}`}
          >
            {activeWord.word}
          </span>
        )}

        {/* Layout 'l': Line captions */}
        {L === "l" && (
          <>
            {grp(activeIndex, n).map((o) => {
              const stateCls = o.i === activeIndex ? "on" : o.i < activeIndex ? "pv" : "nx";
              return (
                <span
                  key={`w-${o.i}`}
                  className={`w ${stateCls} ${o.isKeyword ? "k" : ""}`}
                >
                  {o.word}
                </span>
              );
            })}
          </>
        )}

        {/* Layout 'e': Editorial headline + line */}
        {L === "e" && (
          <>
            {(() => {
              let keywordHeader = "";
              grp(activeIndex, n).forEach((o) => {
                if (o.isKeyword && o.i <= activeIndex) {
                  keywordHeader = o.word;
                }
              });
              return (
                <>
                  {keywordHeader ? <div className="eh">{keywordHeader}</div> : null}
                  {grp(activeIndex, n).map((o) => {
                    const stateCls = o.i === activeIndex ? "on" : o.i < activeIndex ? "pv" : "nx";
                    return (
                      <span
                        key={`w-${o.i}`}
                        className={`w ${stateCls} ${o.isKeyword ? "k" : ""}`}
                      >
                        {o.word}
                      </span>
                    );
                  })}
                </>
              );
            })()}
          </>
        )}

        {/* Layout 's': Stacked lines */}
        {L === "s" && (
          <>
            {(() => {
              const items = [];
              for (let j = Math.max(0, activeIndex - n + 1); j <= activeIndex; j++) {
                items.push({ ...words[j], idx: j });
              }
              return items.map((o) => {
                const stateCls = o.idx === activeIndex ? "on" : "pv";
                return (
                  <span
                    key={`w-${o.idx}`}
                    className={`w ${stateCls} ${o.isKeyword ? "k" : ""}`}
                  >
                    {o.word}
                  </span>
                );
              });
            })()}
          </>
        )}

        {/* Layout 't': Typewriter letter-by-letter */}
        {L === "t" && (
          <>
            {(() => {
              const g = grp(activeIndex, n);
              const w = activeWord;
              const p = Math.min(1, Math.max(0, (playbackTime - w.start) / Math.max(0.01, (w.end - w.start) * 0.85)));
              let s = "";
              g.forEach((o) => {
                if (o.i < activeIndex) s += o.word + " ";
                else if (o.i === activeIndex) s += o.word.slice(0, Math.ceil(o.word.length * p));
              });
              return (
                <span className="w">
                  {s}
                  <i />
                </span>
              );
            })()}
          </>
        )}
      </div>
    </div>
  );
}
