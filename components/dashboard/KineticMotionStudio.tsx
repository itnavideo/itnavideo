"use client";

import React, { useState, useRef, useEffect, useMemo } from "react";
import {
  Sparkles,
  Upload,
  Film,
  FileAudio,
  Trash2,
  Zap,
  SlidersHorizontal,
  ChevronDown,
  CheckCircle2,
  Check,
  Type,
  Eye,
  X,
  Play,
  Search,
} from "lucide-react";
import { BorderBeam } from "@/components/magicui/BorderBeam";
import { StudioWorkflowRoadmap } from "@/components/dashboard/StudioWorkflowRoadmap";
import {
  KINETIC_MOTION_PRESETS,
  KM_LAST_PRESET_KEY,
  type KineticMotionPreset,
  type KineticMotionPresetId,
} from "@/lib/kineticMotion/kineticMotionPresets";

// ─── Preset micro-preview default words ───────────────────────────────────────
const PREVIEW_WORDS = ["YOUR", "WORDS", "MOVE"];

// ─── CSS keyframe animations for 60 FPS Kinetic Typography (Zero Video Decoders) ───
const KM_STYLES = `
@keyframes kmSlam {
  0%   { transform: scale(2.8) translateY(-14px); opacity: 0; filter: blur(4px); }
  60%  { transform: scale(0.92) translateY(2px); opacity: 1; filter: blur(0); }
  80%  { transform: scale(1.06) translateY(-1px); }
  100% { transform: scale(1) translateY(0); opacity: 1; }
}

@keyframes kmBounce {
  0%   { transform: scale(0) translateY(32px); opacity: 0; }
  55%  { transform: scale(1.28) translateY(-6px); opacity: 1; }
  72%  { transform: scale(0.9) translateY(2px); }
  88%  { transform: scale(1.08) translateY(-1px); }
  100% { transform: scale(1) translateY(0); opacity: 1; }
}

@keyframes kmCascade {
  0%   { transform: translateX(28px) translateY(14px) scale(0.85); opacity: 0; }
  100% { transform: translateX(0) translateY(0) scale(1); opacity: 1; }
}

@keyframes kmFlip {
  0%   { transform: perspective(500px) rotateX(-90deg) scale(0.85); opacity: 0; }
  100% { transform: perspective(500px) rotateX(0deg) scale(1); opacity: 1; }
}

@keyframes kmSlide {
  0%   { transform: translateY(115%); opacity: 0; }
  100% { transform: translateY(0); opacity: 1; }
}

@keyframes kmGlitch {
  0%, 100% { transform: translate(0); text-shadow: -2px 0 #ef4444, 2px 0 #22c55e; }
  20% { transform: translate(-3px, 1px); text-shadow: 2px 0 #38bdf8, -2px 0 #ef4444; }
  40% { transform: translate(3px, -1px); text-shadow: -2px 0 #a855f7, 2px 0 #facc15; }
  60% { transform: translate(-2px, 2px); text-shadow: 2px 0 #ef4444, -2px 0 #38bdf8; }
  80% { transform: translate(1px, -2px); text-shadow: -1px 0 #22c55e, 1px 0 #a855f7; }
}

@keyframes kmType {
  from { width: 0%; }
  to   { width: 100%; }
}

@keyframes kmCursorBlink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0; }
}

@keyframes kmBurst {
  0%   { transform: scale(0.3); opacity: 0; filter: brightness(2.2); }
  50%  { transform: scale(1.35); opacity: 1; filter: brightness(1.6); }
  75%  { transform: scale(0.95); }
  100% { transform: scale(1); opacity: 1; filter: brightness(1); }
}

@keyframes kmHighlight {
  0%   { width: 0%; }
  100% { width: 100%; }
}

@keyframes kmZoom {
  0%   { transform: scale(0.6); opacity: 0; }
  50%  { transform: scale(1.2); opacity: 1; }
  90%  { transform: scale(1.6); opacity: 0; }
  100% { transform: scale(1); opacity: 0; }
}

@keyframes kmWave {
  0%, 100% { transform: translateY(0px) rotate(0deg); }
  25% { transform: translateY(-5px) rotate(-2deg); }
  75% { transform: translateY(5px) rotate(2deg); }
}

@keyframes kmGoldShimmer {
  0%   { background-position: -200% center; }
  100% { background-position: 200% center; }
}
`;

// ─── Per-preset 60 FPS Micro-preview Renderer (Pure CSS/SVG) ──────────────────
function KMPreviewAnimation({
  preset,
  customText,
  fontFamily,
  customColor,
}: {
  preset: KineticMotionPreset;
  customText?: string;
  fontFamily?: string;
  customColor?: string;
}) {
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setTick((n) => n + 1), 1900);
    return () => clearInterval(t);
  }, []);

  const words = customText
    ? customText.split(/\s+/).filter(Boolean).slice(0, 4)
    : preset.sampleWords && preset.sampleWords.length > 0
    ? preset.sampleWords
    : PREVIEW_WORDS;

  const font = fontFamily && fontFamily !== "preset" ? fontFamily : preset.previewFont;
  const accent = customColor || preset.accentColor;
  const key = `${preset.id}-${tick}`;

  const wordStyle: React.CSSProperties = {
    fontFamily: font,
    color: "#FFFFFF",
    fontSize: words.length > 3 ? 11 : 13,
    fontWeight: 900,
    letterSpacing: "0.03em",
    lineHeight: 1.15,
    display: "inline-block",
  };

  // Specific bespoke treatments for distinct kinetic motion styles
  switch (preset.id) {
    // ── Slam & Tape Stagger Styles ──
    case "km-01-slam":
    case "km-35-action-cuts":
    case "km-36-boxing-punch":
      return (
        <div className="flex flex-wrap gap-1.5 items-center justify-center h-full text-center p-2.5">
          {words.map((w, i) => (
            <span
              key={`${key}-${i}`}
              style={{
                ...wordStyle,
                color: i === 1 ? accent : "#FFFFFF",
                animationName: "kmSlam",
                animationDuration: "0.45s",
                animationDelay: `${i * 0.12}s`,
                animationFillMode: "both",
                animationTimingFunction: "cubic-bezier(0.2,1.2,0.4,1)",
              }}
            >
              {w}
            </span>
          ))}
        </div>
      );

    case "km-12-vox-stagger":
      return (
        <div className="flex flex-col gap-1 items-center justify-center h-full text-center p-2">
          {words.map((w, i) => (
            <span
              key={`${key}-${i}`}
              className={i === 1 ? "bg-[#FF5722] text-black px-2 py-0.5 rounded shadow-md -rotate-1 font-black" : "text-white font-extrabold"}
              style={{
                ...wordStyle,
                color: i === 1 ? "#000000" : "#FFFFFF",
                fontSize: 12,
                animationName: "kmSlam",
                animationDuration: "0.4s",
                animationDelay: `${i * 0.11}s`,
                animationFillMode: "both",
              }}
            >
              {w}
            </span>
          ))}
        </div>
      );

    case "km-14-hormozi-pop":
      return (
        <div className="flex flex-wrap gap-1.5 items-center justify-center h-full text-center p-2.5">
          {words.map((w, i) => (
            <span
              key={`${key}-${i}`}
              style={{
                ...wordStyle,
                backgroundColor: i === 1 ? "#FFD600" : "transparent",
                color: i === 1 ? "#000000" : "#FFFFFF",
                padding: i === 1 ? "3px 6px" : undefined,
                borderRadius: i === 1 ? "6px" : undefined,
                boxShadow: i === 1 ? "0 4px 12px rgba(255,214,0,0.4)" : undefined,
                animationName: "kmBounce",
                animationDuration: "0.5s",
                animationDelay: `${i * 0.12}s`,
                animationFillMode: "both",
              }}
            >
              {w}
            </span>
          ))}
        </div>
      );

    case "km-15-redline-box":
      return (
        <div className="flex items-center justify-center h-full text-center p-2">
          <div className="border-2 border-[#FF3D00] bg-black/60 px-3 py-1.5 rounded-xl shadow-lg shadow-[#FF3D00]/20 flex flex-wrap gap-1.5 items-center justify-center">
            {words.map((w, i) => (
              <span
                key={`${key}-${i}`}
                style={{
                  ...wordStyle,
                  color: i === 0 ? "#FF3D00" : "#FFFFFF",
                  animationName: "kmSlam",
                  animationDuration: "0.4s",
                  animationDelay: `${i * 0.1}s`,
                  animationFillMode: "both",
                }}
              >
                {w}
              </span>
            ))}
          </div>
        </div>
      );

    // ── Bounce & Brutalist Block Styles ──
    case "km-02-elastic-bounce":
    case "km-13-block-slam":
    case "km-30-depth-behind":
      return (
        <div className="flex flex-wrap gap-1.5 items-center justify-center h-full text-center p-2.5">
          {words.map((w, i) => (
            <span
              key={`${key}-${i}`}
              style={{
                ...wordStyle,
                color: i === 1 ? accent : "#FFFFFF",
                animationName: "kmBounce",
                animationDuration: "0.65s",
                animationDelay: `${i * 0.14}s`,
                animationFillMode: "both",
                animationTimingFunction: "cubic-bezier(0.175,0.885,0.32,1.275)",
              }}
            >
              {w}
            </span>
          ))}
        </div>
      );

    // ── Cascade & Marquee Flow ──
    case "km-03-word-cascade":
    case "km-16-marquee-flow":
    case "km-31-parallax-layers":
      return (
        <div className="flex flex-wrap gap-1.5 items-center justify-center h-full text-center p-2.5">
          {words.map((w, i) => (
            <span
              key={`${key}-${i}`}
              style={{
                ...wordStyle,
                color: i === 1 ? "#000000" : "#FFFFFF",
                backgroundColor: i === 1 ? accent : "transparent",
                padding: i === 1 ? "2px 6px" : undefined,
                borderRadius: i === 1 ? "4px" : undefined,
                animationName: "kmCascade",
                animationDuration: "0.35s",
                animationDelay: `${i * 0.12}s`,
                animationFillMode: "both",
                animationTimingFunction: "cubic-bezier(0.16,1,0.3,1)",
              }}
            >
              {w}
            </span>
          ))}
        </div>
      );

    // ── 3D Perspective & Flip Styles ──
    case "km-04-cinematic-flip":
    case "km-23-perspective-tunnel":
    case "km-25-cinematic-trailer":
    case "km-28-monogram-elegance":
      return (
        <div className="flex flex-wrap gap-1.5 items-center justify-center h-full text-center p-2.5" style={{ perspective: 600 }}>
          {words.map((w, i) => (
            <span
              key={`${key}-${i}`}
              style={{
                ...wordStyle,
                color: i === 1 ? accent : "#FFFFFF",
                animationName: "kmFlip",
                animationDuration: "0.55s",
                animationDelay: `${i * 0.14}s`,
                animationFillMode: "both",
                animationTimingFunction: "ease-out",
              }}
            >
              {w}
            </span>
          ))}
        </div>
      );

    // ── Chrome 3D Metallic Extrude ──
    case "km-32-chrome-extrude":
      return (
        <div className="flex flex-wrap gap-1.5 items-center justify-center h-full text-center p-2.5">
          {words.map((w, i) => (
            <span
              key={`${key}-${i}`}
              style={{
                ...wordStyle,
                color: "#E2E8F0",
                textShadow: "1px 1px 0px #94A3B8, 2px 2px 0px #64748B, 3px 3px 0px #334155, 0 0 10px rgba(255,255,255,0.4)",
                animationName: "kmSlam",
                animationDuration: "0.5s",
                animationDelay: `${i * 0.12}s`,
                animationFillMode: "both",
              }}
            >
              {w}
            </span>
          ))}
        </div>
      );

    // ── Dubai 24K Gold Foil ──
    case "km-26-dubai-gold":
      return (
        <div className="flex flex-col gap-1 items-center justify-center h-full text-center p-2">
          {words.map((w, i) => (
            <span
              key={`${key}-${i}`}
              style={{
                ...wordStyle,
                fontFamily: "Georgia, serif",
                background: "linear-gradient(135deg, #FFD700 0%, #FFF8DC 50%, #FFA000 100%)",
                backgroundSize: "200% auto",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                filter: "drop-shadow(0 2px 8px rgba(255,215,0,0.5))",
                letterSpacing: "0.08em",
                animationName: "kmGoldShimmer, kmSlam",
                animationDuration: "2.4s, 0.5s",
                animationDelay: `0s, ${i * 0.12}s`,
                animationIterationCount: "infinite, 1",
                animationFillMode: "both",
              }}
            >
              {w}
            </span>
          ))}
        </div>
      );

    // ── Stat Numbers & ROI Metric ──
    case "km-29-stat-numbers":
      return (
        <div className="flex flex-col gap-1 items-center justify-center h-full text-center p-2">
          <span
            key={`${key}-stat`}
            className="rounded-lg bg-emerald-500/20 border border-emerald-500/40 px-2.5 py-1 text-emerald-400 font-mono text-xs font-black shadow-lg shadow-emerald-500/20"
            style={{
              animationName: "kmSlam",
              animationDuration: "0.45s",
              animationFillMode: "both",
            }}
          >
            {words[0]}
          </span>
          <span
            key={`${key}-sub`}
            style={{
              ...wordStyle,
              color: "#FFFFFF",
              fontSize: 11,
              animationName: "kmSlide",
              animationDuration: "0.4s",
              animationDelay: "0.2s",
              animationFillMode: "both",
            }}
          >
            {words.slice(1).join(" ")}
          </span>
        </div>
      );

    // ── Masked Slide & Apple Keynote Styles ──
    case "km-05-masked-slide":
    case "km-17-apple-punch":
    case "km-19-swiss-grid":
    case "km-27-listing-stats":
    case "km-33-mask-slab":
      return (
        <div className="flex flex-wrap gap-1.5 items-center justify-center h-full text-center p-2.5">
          {words.map((w, i) => (
            <span key={`${key}-${i}`} style={{ overflow: "hidden", display: "inline-block" }}>
              <span
                style={{
                  ...wordStyle,
                  color: i === 1 ? accent : "#FFFFFF",
                  animationName: "kmSlide",
                  animationDuration: "0.5s",
                  animationDelay: `${i * 0.12}s`,
                  animationFillMode: "both",
                  animationTimingFunction: "cubic-bezier(0.16,1,0.3,1)",
                }}
              >
                {w}
              </span>
            </span>
          ))}
        </div>
      );

    // ── Cyber Glitch Scramble ──
    case "km-06-glitch-scramble":
      return (
        <div className="flex flex-wrap gap-1.5 items-center justify-center h-full text-center p-2.5">
          {words.map((w, i) => (
            <span
              key={`${key}-${i}`}
              style={{
                ...wordStyle,
                fontFamily: "Courier New, monospace",
                color: accent,
                animationName: "kmGlitch",
                animationDuration: "0.45s",
                animationDelay: `${i * 0.1}s`,
                animationFillMode: "both",
                animationIterationCount: 2,
              }}
            >
              {w}
            </span>
          ))}
        </div>
      );

    // ── Typewriter Cursor ──
    case "km-07-typewriter-cursor":
      return (
        <div className="flex items-center justify-center h-full text-center p-2">
          <span
            style={{
              ...wordStyle,
              fontFamily: "Courier New, monospace",
              overflow: "hidden",
              whiteSpace: "nowrap",
              display: "inline-block",
              animationName: "kmType",
              animationDuration: "1.4s",
              animationTimingFunction: "steps(16,end)",
              animationFillMode: "both",
              maxWidth: "100%",
            }}
          >
            {words.join(" ")}
          </span>
          <span
            style={{
              display: "inline-block",
              width: 7,
              height: 14,
              backgroundColor: accent,
              marginLeft: 3,
              animationName: "kmCursorBlink",
              animationDuration: "0.75s",
              animationIterationCount: "infinite",
            }}
          />
        </div>
      );

    // ── Particle Burst & Retro Synthwave ──
    case "km-08-particle-burst":
    case "km-24-retro-synthwave":
      return (
        <div className="flex flex-wrap gap-1.5 items-center justify-center h-full text-center p-2.5">
          {words.map((w, i) => (
            <span
              key={`${key}-${i}`}
              style={{
                ...wordStyle,
                color: i === 1 ? accent : "#FFFFFF",
                textShadow: i === 1 ? `0 0 16px ${accent}` : "none",
                animationName: "kmBurst",
                animationDuration: "0.6s",
                animationDelay: `${i * 0.12}s`,
                animationFillMode: "both",
                animationTimingFunction: "cubic-bezier(0.2,1.2,0.4,1)",
              }}
            >
              {w}
            </span>
          ))}
        </div>
      );

    // ── Highlighter Sweep ──
    case "km-09-highlighter-sweep":
      return (
        <div className="flex flex-wrap gap-1.5 items-center justify-center h-full text-center p-2.5">
          {words.map((w, i) => (
            <span key={`${key}-${i}`} style={{ position: "relative", display: "inline-block" }}>
              {i === 1 && (
                <span
                  style={{
                    position: "absolute",
                    bottom: 1,
                    left: 0,
                    height: "45%",
                    backgroundColor: `${accent}77`,
                    borderRadius: 3,
                    animationName: "kmHighlight",
                    animationDuration: "0.55s",
                    animationDelay: "0.3s",
                    animationFillMode: "both",
                    animationTimingFunction: "ease-out",
                    zIndex: 0,
                  }}
                />
              )}
              <span style={{ ...wordStyle, color: "#FFFFFF", position: "relative", zIndex: 1 }}>{w}</span>
            </span>
          ))}
        </div>
      );

    // ── Zoom Through ──
    case "km-10-zoom-through":
      return (
        <div className="flex flex-wrap gap-1.5 items-center justify-center h-full text-center p-2.5">
          {words.map((w, i) => (
            <span
              key={`${key}-${i}`}
              style={{
                ...wordStyle,
                color: i === 1 ? accent : "#FFFFFF",
                animationName: "kmZoom",
                animationDuration: "0.85s",
                animationDelay: `${i * 0.15}s`,
                animationFillMode: "both",
                animationTimingFunction: "cubic-bezier(0.16,1,0.3,1)",
              }}
            >
              {w}
            </span>
          ))}
        </div>
      );

    // ── Fluid Wave & Organic Script ──
    case "km-11-fluid-wave":
    case "km-21-cursive-script":
    case "km-34-blue-muse":
      return (
        <div className="flex flex-wrap gap-0.5 items-center justify-center h-full text-center p-2">
          {words.join(" ").split("").map((ch, i) => (
            <span
              key={`${key}-${i}`}
              style={{
                ...wordStyle,
                fontSize: 12,
                color: i % 3 === 0 ? accent : "#CBD5E1",
                animationName: "kmWave",
                animationDuration: "1.8s",
                animationDelay: `${i * 0.08}s`,
                animationIterationCount: "infinite",
                animationTimingFunction: "ease-in-out",
              }}
            >
              {ch === " " ? "\u00A0" : ch}
            </span>
          ))}
        </div>
      );

    // ── Default Kinetic Card ──
    default:
      return (
        <div className="flex flex-wrap gap-1.5 items-center justify-center h-full text-center p-2.5">
          {words.map((w, i) => (
            <span
              key={`${key}-${i}`}
              style={{
                ...wordStyle,
                color: i === 1 ? accent : "#FFFFFF",
                animationName: "kmBounce",
                animationDuration: "0.55s",
                animationDelay: `${i * 0.12}s`,
                animationFillMode: "both",
              }}
            >
              {w}
            </span>
          ))}
        </div>
      );
  }
}

// ─── Single 60 FPS Preset Card Component (Zero Video Decoder Overhead) ────────
function KMPresetCard({
  preset,
  isSelected,
  onSelect,
  onOpenLivePreview,
}: {
  preset: KineticMotionPreset;
  isSelected: boolean;
  onSelect: () => void;
  onOpenLivePreview: (e: React.MouseEvent) => void;
}) {
  return (
    <div
      onClick={onSelect}
      className={`group relative rounded-[22px] border p-2.5 overflow-hidden text-left transition-all duration-200 cursor-pointer flex flex-col justify-between select-none ${
        isSelected
          ? "border-[#FF5722] ring-2 ring-[#FF5722]/50 bg-gradient-to-b from-[#FF5722]/15 via-[#0E1526] to-[#070B14] shadow-xl shadow-[#FF5722]/20 scale-[1.02] z-10"
          : "border-white/10 bg-[#0E1526] hover:border-[#FF5722]/50 hover:bg-[#131B2E] hover:shadow-lg hover:-translate-y-0.5"
      }`}
    >
      {/* Top Header: Badge + Preview Button */}
      <div className="flex items-center justify-between gap-1 z-10 mb-2">
        <span
          className="rounded-full px-2 py-0.5 text-[9px] font-black tracking-wider uppercase shadow-xs transition"
          style={{
            backgroundColor: isSelected ? preset.accentColor : "rgba(255,255,255,0.08)",
            color: isSelected ? "#000000" : "#FFFFFF",
            border: isSelected ? "none" : "1px solid rgba(255,255,255,0.15)",
          }}
        >
          {preset.badge}
        </span>

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onOpenLivePreview(e);
          }}
          className="rounded-full bg-black/60 hover:bg-[#FF5722] hover:text-black border border-white/15 p-1 text-slate-300 transition cursor-pointer flex items-center gap-1 px-2 shadow-xs"
          title="Open Full 9:16 Live Preview"
        >
          <Eye size={11} />
          <span className="text-[9px] font-bold hidden sm:inline">Preview</span>
        </button>
      </div>

      {/* 9:16 Aspect Kinetic Canvas (ZERO VIDEO LAG, 60 FPS PURE CSS/SVG) */}
      <div
        className="w-full aspect-[9/12] min-h-[140px] sm:min-h-[160px] bg-[#070B14] rounded-xl relative overflow-hidden flex flex-col items-center justify-center border border-white/10 group-hover:border-white/25 transition-all shadow-inner"
      >
        {/* Dynamic ambient radial glow matching preset accent */}
        <div
          className="absolute inset-0 opacity-20 group-hover:opacity-35 transition-opacity duration-300 pointer-events-none"
          style={{
            background: `radial-gradient(circle at center, ${preset.accentColor} 0%, transparent 75%)`,
          }}
        />

        {/* Camera frame corner notches */}
        <div className="absolute top-1.5 left-1.5 text-[8px] font-mono text-white/30 pointer-events-none">+</div>
        <div className="absolute top-1.5 right-1.5 text-[8px] font-mono text-white/30 pointer-events-none">+</div>
        <div className="absolute bottom-1.5 left-1.5 text-[8px] font-mono text-white/30 pointer-events-none">+</div>
        <div className="absolute bottom-1.5 right-1.5 text-[8px] font-mono text-white/30 pointer-events-none">+</div>

        {/* 60 FPS Micro animation stage */}
        <div className="relative z-10 w-full h-full flex items-center justify-center">
          <KMPreviewAnimation preset={preset} />
        </div>
      </div>

      {/* Card Info Footer */}
      <div className="mt-2.5 space-y-1">
        <div className="flex items-start justify-between gap-1">
          <h3 className="text-xs sm:text-sm font-black text-white leading-tight truncate">
            {preset.name}
          </h3>
          {isSelected && (
            <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-[#FF5722] text-black shadow-xs">
              <Check size={10} strokeWidth={3.5} />
            </span>
          )}
        </div>

        <p className="text-[10px] text-slate-400 font-medium leading-snug truncate">
          {preset.vibe}
        </p>

        <div className="pt-1 flex items-center justify-between border-t border-white/5">
          <span
            className="text-[9px] font-black px-2 py-0.5 rounded-full border border-white/10"
            style={{ color: preset.accentColor, backgroundColor: `${preset.accentColor}18` }}
          >
            {preset.tag}
          </span>
          <span className="text-[9px] font-mono text-emerald-400 font-bold flex items-center gap-1">
            <Zap size={9} /> 60 FPS
          </span>
        </div>
      </div>
    </div>
  );
}

// ─── Live Motion Preview Modal / Mini-Player ──────────────────────────────────
function KMLivePreviewModal({
  preset,
  isOpen,
  onClose,
  onApply,
  accentColor,
  onChangeAccentColor,
  fontFamily,
  onChangeFontFamily,
  userVideoUrl,
}: {
  preset: KineticMotionPreset;
  isOpen: boolean;
  onClose: () => void;
  onApply: () => void;
  accentColor: string;
  onChangeAccentColor: (color: string) => void;
  fontFamily: string;
  onChangeFontFamily: (font: string) => void;
  userVideoUrl?: string | null;
}) {
  const [sampleText, setSampleText] = useState(
    preset.sampleWords && preset.sampleWords.length > 0
      ? preset.sampleWords.join(" ")
      : "STOP SCROLLING NOW"
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-[#0E1526] border border-white/15 rounded-[28px] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-[#070B14]/80">
          <div className="flex items-center gap-2.5">
            <span
              className="rounded-full px-2.5 py-0.5 text-xs font-black"
              style={{ backgroundColor: preset.accentColor, color: "#000000" }}
            >
              {preset.badge}
            </span>
            <div>
              <h2 className="text-base font-black text-white">{preset.name}</h2>
              <p className="text-xs text-slate-400">{preset.vibe}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full bg-white/10 hover:bg-white/20 p-2 text-slate-300 hover:text-white transition cursor-pointer"
          >
            <X size={16} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5 overflow-y-auto">
          {/* 9:16 Canvas Mockup */}
          <div className="flex justify-center">
            <div className="w-[220px] aspect-[9/16] bg-[#070B14] rounded-2xl border-2 border-white/20 relative overflow-hidden flex flex-col items-center justify-center shadow-2xl">
              {userVideoUrl && (
                <video
                  src={userVideoUrl}
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="absolute inset-0 w-full h-full object-cover opacity-60 pointer-events-none"
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-black/60 pointer-events-none" />
              <div
                className="absolute inset-0 opacity-30 pointer-events-none"
                style={{
                  background: `radial-gradient(circle at center, ${accentColor || preset.accentColor} 0%, transparent 75%)`,
                }}
              />
              <div className="relative z-10 w-full h-full flex items-center justify-center">
                <KMPreviewAnimation
                  preset={preset}
                  customText={sampleText}
                  fontFamily={fontFamily}
                  customColor={accentColor}
                />
              </div>
            </div>
          </div>

          {/* Interactive Text Input */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-300">Live Preview Words</label>
            <input
              type="text"
              value={sampleText}
              onChange={(e) => setSampleText(e.target.value)}
              className="w-full bg-[#070B14] text-white text-xs font-bold rounded-xl border border-white/10 px-3.5 py-2.5 focus:border-[#FF5722] focus:outline-none"
              placeholder="Type test words..."
            />
          </div>

          {/* Color & Font Picker */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300">Accent Color</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={accentColor}
                  onChange={(e) => onChangeAccentColor(e.target.value)}
                  className="h-8 w-12 rounded-lg border border-white/10 bg-transparent cursor-pointer p-0.5"
                />
                <span className="text-xs font-mono text-slate-400">{accentColor}</span>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300">Font</label>
              <select
                value={fontFamily}
                onChange={(e) => onChangeFontFamily(e.target.value)}
                className="w-full bg-[#070B14] text-white text-xs font-bold rounded-xl border border-white/10 px-3 py-2 focus:border-[#FF5722] focus:outline-none cursor-pointer"
              >
                <option value="preset">Preset Default Font</option>
                <option value="Impact, sans-serif">Impact — Viral Punch</option>
                <option value="Montserrat, sans-serif">Montserrat — Clean Modern</option>
                <option value="Georgia, serif">Georgia — Editorial Serif</option>
                <option value="Courier New, monospace">Courier New — Cyber Monospace</option>
              </select>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-white/10 bg-[#070B14]/80">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 px-4 py-2 text-xs font-bold text-white transition cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => {
              onApply();
              onClose();
            }}
            className="rounded-xl bg-gradient-to-r from-[#FF5722] via-[#FF7043] to-[#FFA000] px-5 py-2 text-xs font-black text-black shadow-lg shadow-[#FF5722]/25 transition cursor-pointer hover:brightness-110 active:scale-95"
          >
            Select This Preset
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Studio Props ─────────────────────────────────────────────────────────────
export interface KineticMotionStudioProps {
  selectedFile: File | null;
  onSelectFile: (file: File | null) => void;

  selectedPreset: KineticMotionPresetId;
  onSelectPreset: (presetId: KineticMotionPresetId) => void;

  sfxIntensity: "full" | "subtle" | "none";
  onSfxIntensityChange: (val: "full" | "subtle" | "none") => void;

  pacing: "fast" | "smooth";
  onPacingChange: (val: "fast" | "smooth") => void;

  textCase: "uppercase" | "natural";
  onTextCaseChange: (val: "uppercase" | "natural") => void;

  accentColor: string;
  onAccentColorChange: (val: string) => void;

  fontFamily: string;
  onFontFamilyChange: (val: string) => void;

  intensity: "normal" | "aggressive";
  onIntensityChange: (val: "normal" | "aggressive") => void;

  aspectRatio?: "9:16" | "16:9";
  onAspectRatioChange?: (val: "9:16" | "16:9") => void;

  onGenerate: () => void;
  isGenerating: boolean;
}

// ─── Master Kinetic Motion Studio Component ───────────────────────────────────
export function KineticMotionStudio({
  selectedFile,
  onSelectFile,
  selectedPreset,
  onSelectPreset,
  sfxIntensity,
  onSfxIntensityChange,
  pacing,
  onPacingChange,
  textCase,
  onTextCaseChange,
  accentColor,
  onAccentColorChange,
  fontFamily,
  onFontFamilyChange,
  intensity,
  onIntensityChange,
  aspectRatio = "9:16",
  onAspectRatioChange,
  onGenerate,
  isGenerating,
}: KineticMotionStudioProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [activeTab, setActiveTab] = useState<"presets" | "customize">("presets");
  const [livePreviewPreset, setLivePreviewPreset] = useState<KineticMotionPreset | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const [internalRatio, setInternalRatio] = useState<"9:16" | "16:9">("9:16");
  const selectedRatio = aspectRatio !== undefined ? aspectRatio : internalRatio;
  const setRatio = (val: "9:16" | "16:9") => {
    setInternalRatio(val);
    if (onAspectRatioChange) onAspectRatioChange(val);
  };

  const activePreset =
    KINETIC_MOTION_PRESETS.find((p) => p.id === selectedPreset) ?? KINETIC_MOTION_PRESETS[0];

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) onSelectFile(file);
  };

  const userVideoUrl = React.useMemo(() => {
    if (selectedFile && selectedFile.type.startsWith("video/")) {
      return URL.createObjectURL(selectedFile);
    }
    return null;
  }, [selectedFile]);

  // Instant keyword filtering (NO CATEGORIES - ALL PRESETS DIRECTLY ACCESSIBLE)
  const filteredPresets = useMemo(() => {
    if (!searchQuery.trim()) return KINETIC_MOTION_PRESETS;
    const q = searchQuery.toLowerCase().trim();
    return KINETIC_MOTION_PRESETS.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.vibe.toLowerCase().includes(q) ||
        p.tag.toLowerCase().includes(q) ||
        p.badge.toLowerCase().includes(q) ||
        p.sampleWords.some((w) => w.toLowerCase().includes(q))
    );
  }, [searchQuery]);

  return (
    <div className="relative rounded-[28px] border border-white/10 bg-[#0E1526] p-5 sm:p-7 shadow-2xl min-w-0 max-w-full overflow-x-hidden space-y-7 text-white">
      {/* Magic UI BorderBeam Glowing Effect */}
      <BorderBeam size={280} duration={14} colorFrom="#FF5722" colorTo="#FFA000" />
      {/* Inject CSS keyframes once */}
      <style dangerouslySetInnerHTML={{ __html: KM_STYLES }} />

      {/* ── Studio Header ── */}
      <div className="border-b border-white/10 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-white sm:text-3xl flex items-center gap-2.5">
            <span>Kinetic Motion Studio</span>
          </h1>
          <p className="text-xs text-slate-300 mt-1">
            Transform speech & voiceovers into dynamic, motion-driven 60 FPS kinetic text
          </p>
        </div>

        {/* Dynamic Dual Aspect Ratio Selector */}
        <div className="flex items-center gap-1.5 rounded-2xl border border-white/10 bg-[#070B14] p-1 shrink-0">
          <button
            type="button"
            onClick={() => setRatio("9:16")}
            className={`inline-flex items-center gap-1.5 rounded-xl px-3.5 py-1.5 text-xs font-bold transition cursor-pointer ${
              selectedRatio === "9:16"
                ? "bg-[#FF5722] text-black shadow-md shadow-[#FF5722]/25 font-black"
                : "text-slate-400 hover:text-white hover:bg-white/5"
            }`}
          >
            <span>📱 9:16 Shorts (Up to 90s)</span>
          </button>

          <button
            type="button"
            onClick={() => setRatio("16:9")}
            className={`inline-flex items-center gap-1.5 rounded-xl px-3.5 py-1.5 text-xs font-bold transition cursor-pointer ${
              selectedRatio === "16:9"
                ? "bg-purple-600 text-white shadow-md shadow-purple-500/25 font-black"
                : "text-slate-400 hover:text-white hover:bg-white/5"
            }`}
          >
            <span>🎬 16:9 Cinema (Up to 5 min)</span>
          </button>
        </div>
      </div>

      {/* Process Workflow Roadmap */}
      <StudioWorkflowRoadmap mode="typographyVideo" />

      {/* ── PRE-UPLOAD STATE ── */}
      {!selectedFile ? (
        <div className="space-y-6">
          {/* Big Upload Dropzone */}
          <div
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className="relative flex flex-col items-center justify-center gap-5 rounded-[28px] border-2 border-dashed border-white/15 hover:border-[#FF5722]/60 bg-[#070B14] hover:bg-[#0A1020] min-h-[200px] p-8 text-center transition-all duration-200 cursor-pointer group"
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="video/*,audio/*"
              className="hidden"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) onSelectFile(f);
                e.currentTarget.value = "";
              }}
            />
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-[#FF5722]/30 bg-[#FF5722]/10 text-[#FF9100] group-hover:scale-110 group-hover:bg-[#FF5722]/20 transition-all duration-300 shadow-lg shadow-[#FF5722]/10">
              <Upload size={28} />
            </div>
            <div className="space-y-1.5">
              <p className="text-base font-black text-white">Upload Talking Video or Voiceover Audio</p>
              <p className="text-sm text-slate-400">MP4, MOV, MP3, WAV · Up to 3 minutes</p>
              <div className="flex flex-wrap items-center justify-center gap-2 mt-3">
                <span className="rounded-full border border-white/10 bg-[#0E1526] px-3 py-1 text-[11px] font-bold text-slate-300 flex items-center gap-1.5">
                  <Film size={11} className="text-[#FF7043]" /> MP4 / MOV Video
                </span>
                <span className="rounded-full border border-white/10 bg-[#0E1526] px-3 py-1 text-[11px] font-bold text-slate-300 flex items-center gap-1.5">
                  <FileAudio size={11} className="text-[#FF7043]" /> MP3 / WAV Audio
                </span>
              </div>
            </div>
            <div className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#FF5722] to-[#FF7043] px-6 py-2.5 text-sm font-black text-black shadow-lg shadow-[#FF5722]/25 group-hover:brightness-110 transition active:scale-95">
              <Upload size={15} />
              Browse Files
            </div>
          </div>

          {/* ══════════════════════════════════════════════════════════════════════
              DIRECT ALL STYLES GALLERY (NO CATEGORIES - 36 PRESETS DIRECTLY VISIBLE)
          ══════════════════════════════════════════════════════════════════════ */}
          <div className="rounded-[24px] border border-white/10 bg-[#070B14] p-4 sm:p-6 shadow-xl space-y-4">
            {/* Header + Search Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <Sparkles size={16} className="text-[#FF7043]" />
                <h2 className="text-sm font-black uppercase tracking-wider text-white">
                  All Motion Styles ({filteredPresets.length} Presets)
                </h2>
                <span className="rounded-full bg-[#FF5722]/15 border border-[#FF5722]/30 px-2.5 py-0.5 text-[11px] font-black text-[#FFA000]">
                  Active: {activePreset.badge} — {activePreset.name}
                </span>
              </div>

              {/* Fast Search Input */}
              <div className="relative w-full sm:w-64">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search styles (e.g. gold, vox, slam)..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-[#0E1526] pl-9 pr-8 py-2 text-xs font-semibold text-white placeholder-slate-400 focus:border-[#FF5722] focus:outline-none focus:ring-1 focus:ring-[#FF5722]/40 transition"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery("")}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white p-0.5 rounded-full cursor-pointer"
                  >
                    <X size={13} />
                  </button>
                )}
              </div>
            </div>

            {/* Direct 60 FPS Responsive Grid (Zero Video Lag) */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-3 sm:gap-4 max-h-[640px] overflow-y-auto pr-1.5 custom-scrollbar">
              {filteredPresets.map((preset) => (
                <KMPresetCard
                  key={preset.id}
                  preset={preset}
                  isSelected={selectedPreset === preset.id}
                  onSelect={() => onSelectPreset(preset.id as KineticMotionPresetId)}
                  onOpenLivePreview={() => setLivePreviewPreset(preset)}
                />
              ))}
            </div>
          </div>
        </div>
      ) : (
        /* ── POST-UPLOAD STATE — Split-pane ── */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* LEFT — File Info + Presets/Customize Tabs (col-span-7) */}
          <div className="lg:col-span-7 space-y-4">
            {/* Compact File Row */}
            <div
              onClick={() => fileInputRef.current?.click()}
              className="w-full flex items-center justify-between gap-3 rounded-2xl border border-white/10 hover:border-[#FF5722]/50 bg-[#070B14] p-3.5 transition-all cursor-pointer group"
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="video/*,audio/*"
                className="hidden"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) onSelectFile(f);
                  e.currentTarget.value = "";
                }}
              />
              <div className="flex items-center gap-3 min-w-0">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-emerald-500/30 bg-emerald-500/10 text-emerald-400">
                  {selectedFile.type.startsWith("video/") ? <Film size={16} /> : <FileAudio size={16} />}
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-extrabold text-white truncate">{selectedFile.name}</span>
                    <span className="rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-bold px-2 py-0.5 shrink-0">
                      Ready
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    {(selectedFile.size / (1024 * 1024)).toFixed(1)} MB · Click to change file
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectFile(null);
                }}
                className="rounded-xl border border-red-500/20 bg-red-500/10 hover:bg-red-500/20 p-2 text-red-400 transition shrink-0"
              >
                <Trash2 size={14} />
              </button>
            </div>

            {/* Tab Switcher: Motion Presets | Customize */}
            <div className="grid grid-cols-2 gap-1 rounded-2xl bg-[#070B14] p-1 border border-white/10">
              {(["presets", "customize"] as const).map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setActiveTab(tab)}
                  className={`rounded-xl py-2.5 text-xs font-black transition cursor-pointer flex items-center justify-center gap-1.5 ${
                    activeTab === tab
                      ? "bg-gradient-to-r from-[#FF5722] to-[#FF7043] text-black shadow-md"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  {tab === "presets" ? (
                    <>
                      <Sparkles size={13} /> Motion Presets ({filteredPresets.length})
                    </>
                  ) : (
                    <>
                      <SlidersHorizontal size={13} /> Customize
                    </>
                  )}
                </button>
              ))}
            </div>

            {/* Tab 1: Direct All Styles Grid (NO CATEGORIES) */}
            {activeTab === "presets" && (
              <div className="space-y-3">
                {/* Search Bar in Post-Upload State */}
                <div className="relative w-full">
                  <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search styles (e.g. gold, vox, slam)..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full rounded-xl border border-white/10 bg-[#070B14] pl-9 pr-8 py-2 text-xs font-semibold text-white placeholder-slate-400 focus:border-[#FF5722] focus:outline-none transition"
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => setSearchQuery("")}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white p-0.5 rounded-full cursor-pointer"
                    >
                      <X size={13} />
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-h-[580px] overflow-y-auto pr-1.5 custom-scrollbar">
                  {filteredPresets.map((preset) => (
                    <KMPresetCard
                      key={preset.id}
                      preset={preset}
                      isSelected={selectedPreset === preset.id}
                      onSelect={() => onSelectPreset(preset.id as KineticMotionPresetId)}
                      onOpenLivePreview={() => setLivePreviewPreset(preset)}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Tab 2: Customize Drawer */}
            {activeTab === "customize" && (
              <div className="rounded-[22px] border border-white/10 bg-[#070B14] p-5 space-y-5">
                {/* Font Selection */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-300 block">Font Family</label>
                  <select
                    value={fontFamily}
                    onChange={(e) => onFontFamilyChange(e.target.value)}
                    className="w-full bg-[#0E1526] text-white text-xs font-bold rounded-xl border border-white/10 px-3 py-2.5 focus:border-[#FF5722] focus:outline-none cursor-pointer"
                  >
                    <option value="preset">Preset Default Font</option>
                    <option value="Impact, sans-serif">Impact — Bold Viral</option>
                    <option value="Montserrat, sans-serif">Montserrat — Modern Clean</option>
                    <option value="Anton, sans-serif">Anton — Heavy Poster</option>
                    <option value="'Bebas Neue', sans-serif">Bebas Neue — Tall Headline</option>
                    <option value="Courier New, monospace">Courier New — Cyber Monospace</option>
                    <option value="Georgia, serif">Georgia — Editorial Serif</option>
                  </select>
                </div>

                {/* Accent Color */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-300 block">Motion Accent Color</label>
                  <div className="flex items-center gap-3">
                    <div className="flex flex-wrap gap-1.5">
                      {["#FF5722", "#FFA000", "#FACC15", "#EF4444", "#22C55E", "#38BDF8", "#A855F7", "#FFFFFF"].map((c) => (
                        <button
                          key={c}
                          type="button"
                          onClick={() => onAccentColorChange(c)}
                          className="h-7 w-7 rounded-full border-2 transition active:scale-90 cursor-pointer"
                          style={{
                            backgroundColor: c,
                            borderColor: accentColor === c ? "#FFFFFF" : "transparent",
                          }}
                        />
                      ))}
                    </div>
                    <input
                      type="color"
                      value={accentColor}
                      onChange={(e) => onAccentColorChange(e.target.value)}
                      className="h-8 w-10 rounded-lg border border-white/10 cursor-pointer bg-transparent p-0.5"
                      title="Custom color"
                    />
                  </div>
                </div>

                {/* Text Case */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-300 block">Text Case</label>
                  <div className="grid grid-cols-2 gap-1.5 rounded-2xl bg-[#0E1526] p-1 border border-white/10">
                    {[
                      { id: "uppercase", label: "UPPERCASE" },
                      { id: "natural", label: "Natural" },
                    ].map((c) => (
                      <button
                        key={c.id}
                        type="button"
                        onClick={() => onTextCaseChange(c.id as any)}
                        className={`rounded-xl py-2 text-xs font-black transition cursor-pointer ${
                          textCase === c.id
                            ? "bg-gradient-to-r from-[#FF5722] to-[#FF7043] text-black shadow-md"
                            : "text-slate-400 hover:text-white"
                        }`}
                      >
                        {c.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* SFX Intensity */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-300 block">Sound Effects</label>
                  <div className="grid grid-cols-3 gap-1.5 rounded-2xl bg-[#0E1526] p-1 border border-white/10">
                    {[
                      { id: "full", label: "💥 Full" },
                      { id: "subtle", label: "🔉 Subtle" },
                      { id: "none", label: "🔇 Off" },
                    ].map((s) => (
                      <button
                        key={s.id}
                        type="button"
                        onClick={() => onSfxIntensityChange(s.id as any)}
                        className={`rounded-xl py-2 text-xs font-bold transition cursor-pointer ${
                          sfxIntensity === s.id
                            ? "bg-gradient-to-r from-[#FF5722] to-[#FF7043] text-black shadow-md font-black"
                            : "text-slate-400 hover:text-white"
                        }`}
                      >
                        {s.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Word Motion Velocity */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-300 block">Word Motion Velocity</label>
                  <div className="grid grid-cols-2 gap-1.5 rounded-2xl bg-[#0E1526] p-1 border border-white/10">
                    {[
                      { id: "fast", label: "⚡ Viral Blitz" },
                      { id: "smooth", label: "📖 Smooth Flow" },
                    ].map((p) => (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => onPacingChange(p.id as any)}
                        className={`rounded-xl py-2 text-xs font-bold transition cursor-pointer ${
                          pacing === p.id
                            ? "bg-gradient-to-r from-[#FF5722] to-[#FF7043] text-black shadow-md font-black"
                            : "text-slate-400 hover:text-white"
                        }`}
                      >
                        {p.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Animation Intensity */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-300 block">Animation Intensity</label>
                  <div className="grid grid-cols-2 gap-1.5 rounded-2xl bg-[#0E1526] p-1 border border-white/10">
                    {[
                      { id: "normal", label: "Normal" },
                      { id: "aggressive", label: "🔥 Aggressive" },
                    ].map((v) => (
                      <button
                        key={v.id}
                        type="button"
                        onClick={() => onIntensityChange(v.id as any)}
                        className={`rounded-xl py-2 text-xs font-bold transition cursor-pointer ${
                          intensity === v.id
                            ? "bg-gradient-to-r from-[#FF5722] to-[#FF7043] text-black shadow-md font-black"
                            : "text-slate-400 hover:text-white"
                        }`}
                      >
                        {v.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* RIGHT — Active Style Stage + Generate Button (col-span-5) */}
          <div className="lg:col-span-5 space-y-4">
            {/* Active Preset Info Card */}
            <div
              className="rounded-[22px] border p-5 space-y-3"
              style={{
                borderColor: `${activePreset.accentColor}40`,
                background: `linear-gradient(135deg, ${activePreset.accentColor}12, #0E1526)`,
              }}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <span
                    className="rounded-md px-2 py-0.5 text-[10px] font-black"
                    style={{ backgroundColor: activePreset.accentColor, color: "#000000" }}
                  >
                    {activePreset.badge}
                  </span>
                  <h3 className="text-lg font-black text-white mt-2">{activePreset.name}</h3>
                  <p className="text-xs text-slate-300 mt-0.5">{activePreset.vibe}</p>
                </div>

                <button
                  type="button"
                  onClick={() => setLivePreviewPreset(activePreset)}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-white/20 bg-white/10 hover:bg-[#FF5722] hover:text-black px-3 py-1.5 text-xs font-bold text-white transition cursor-pointer"
                >
                  <Eye size={13} />
                  <span>9:16 Preview</span>
                </button>
              </div>

              {/* 9:16 Stage Preview Box */}
              <div className="rounded-xl bg-[#070B14] border border-white/10 overflow-hidden relative flex items-center justify-center" style={{ height: 140 }}>
                {userVideoUrl && (
                  <video
                    src={userVideoUrl}
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="absolute inset-0 w-full h-full object-cover opacity-50 pointer-events-none rounded-xl"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-black/60 pointer-events-none" />
                <div
                  className="absolute inset-0 opacity-25 pointer-events-none"
                  style={{
                    background: `radial-gradient(circle at center, ${activePreset.accentColor} 0%, transparent 75%)`,
                  }}
                />
                <div className="relative z-10 w-full h-full flex items-center justify-center">
                  <KMPreviewAnimation
                    preset={activePreset}
                    fontFamily={fontFamily}
                    customColor={accentColor}
                  />
                </div>
              </div>

              <div className="pt-2 border-t border-white/10 flex items-center justify-between text-[11px]">
                <span className="text-slate-400">Target Remotion Engine:</span>
                <span className="font-mono text-[#FF7043] font-bold">{activePreset.bridgeStyleId}</span>
              </div>
            </div>

            {/* Generate Button */}
            <button
              type="button"
              onClick={onGenerate}
              disabled={isGenerating}
              className="w-full inline-flex min-h-[54px] items-center justify-center gap-2.5 rounded-2xl bg-gradient-to-r from-[#FF5722] via-[#FF7043] to-[#FFA000] text-base font-black text-black shadow-xl shadow-[#FF5722]/30 hover:brightness-110 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-all"
            >
              <Sparkles size={18} />
              <span>{isGenerating ? "Rendering Kinetic Reel..." : "Generate Kinetic Motion Video"}</span>
            </button>
          </div>
        </div>
      )}

      {/* Live Preview Modal */}
      {livePreviewPreset && (
        <KMLivePreviewModal
          preset={livePreviewPreset}
          isOpen={!!livePreviewPreset}
          onClose={() => setLivePreviewPreset(null)}
          onApply={() => onSelectPreset(livePreviewPreset.id as KineticMotionPresetId)}
          accentColor={accentColor}
          onChangeAccentColor={onAccentColorChange}
          fontFamily={fontFamily}
          onChangeFontFamily={onFontFamilyChange}
          userVideoUrl={userVideoUrl}
        />
      )}
    </div>
  );
}

export default KineticMotionStudio;
