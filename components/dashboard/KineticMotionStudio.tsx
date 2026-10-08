"use client";

import React, { useState, useRef, useEffect } from "react";
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
} from "lucide-react";
import { BorderBeam } from "@/components/magicui/BorderBeam";
import { StudioWorkflowRoadmap } from "@/components/dashboard/StudioWorkflowRoadmap";
import {
  KINETIC_MOTION_PRESETS,
  KM_LAST_PRESET_KEY,
  type KineticMotionPreset,
  type KineticMotionPresetId,
} from "@/lib/kineticMotion/kineticMotionPresets";

import { getPresetVideoUrl } from "@/components/dashboard/AutoCaptionStyleCarousel";

// ─── Cloudinary background video loops mapped for 11 Kinetic Motion Presets ─────
export const KM_PRESET_VIDEO_MAP: Record<string, string> = {
  "km-01-slam": "https://res.cloudinary.com/dhouh9idx/video/upload/q_auto,f_mp4,w_360,vc_h264/itnavideo-assets/autocaptionvideos/mrbeast-shorts-impact.mp4",
  "km-02-elastic-bounce": "https://res.cloudinary.com/dhouh9idx/video/upload/q_auto,f_mp4,w_360,vc_h264/itnavideo-assets/autocaptionvideos/kinetic.mp4",
  "km-03-word-cascade": "https://res.cloudinary.com/dhouh9idx/video/upload/q_auto,f_mp4,w_360,vc_h264/itnavideo-assets/autocaptionvideos/crazy.mp4",
  "km-04-cinematic-flip": "https://res.cloudinary.com/dhouh9idx/video/upload/q_auto,f_mp4,w_360,vc_h264/itnavideo-assets/autocaptionvideos/cinema-depth-3d.mp4",
  "km-05-masked-slide": "https://res.cloudinary.com/dhouh9idx/video/upload/q_auto,f_mp4,w_360,vc_h264/itnavideo-assets/autocaptionvideos/ali-abdaal-clean-pill.mp4",
  "km-06-glitch-scramble": "https://res.cloudinary.com/dhouh9idx/video/upload/q_auto,f_mp4,w_360,vc_h264/itnavideo-assets/autocaptionvideos/gamer.mp4",
  "km-07-typewriter-cursor": "https://res.cloudinary.com/dhouh9idx/video/upload/q_auto,f_mp4,w_360,vc_h264/itnavideo-assets/autocaptionvideos/bbc-netflix-closed-captions.mp4",
  "km-08-particle-burst": "https://res.cloudinary.com/dhouh9idx/video/upload/q_auto,f_mp4,w_360,vc_h264/itnavideo-assets/autocaptionvideos/spark.mp4",
  "km-09-highlighter-sweep": "https://res.cloudinary.com/dhouh9idx/video/upload/q_auto,f_mp4,w_360,vc_h264/itnavideo-assets/autocaptionvideos/kurzgesagt-explainer.mp4",
  "km-10-zoom-through": "https://res.cloudinary.com/dhouh9idx/video/upload/q_auto,f_mp4,w_360,vc_h264/itnavideo-assets/autocaptionvideos/impact.mp4",
  "km-11-fluid-wave": "https://res.cloudinary.com/dhouh9idx/video/upload/q_auto,f_mp4,w_360,vc_h264/itnavideo-assets/autocaptionvideos/submagic-glow.mp4",
};

// ─── Preset micro-preview words ───────────────────────────────────────────────
const PREVIEW_WORDS = ["YOUR", "WORDS", "MOVE"];

// ─── CSS keyframe animations injected once ────────────────────────────────────
const KM_STYLES = `
@keyframes kmSlam {
  0%   { transform: scale(3) translateY(-12px); opacity: 0; filter: blur(4px); }
  60%  { transform: scale(0.92) translateY(2px); opacity: 1; filter: blur(0); }
  80%  { transform: scale(1.06) translateY(-1px); }
  100% { transform: scale(1) translateY(0); opacity: 1; }
}

@keyframes kmBounce {
  0%   { transform: scale(0) translateY(30px); opacity: 0; }
  55%  { transform: scale(1.3) translateY(-6px); opacity: 1; }
  72%  { transform: scale(0.88) translateY(2px); }
  88%  { transform: scale(1.1) translateY(-1px); }
  100% { transform: scale(1) translateY(0); opacity: 1; }
}

@keyframes kmCascade {
  0%   { transform: translateX(28px) translateY(14px) scale(0.8); opacity: 0; }
  100% { transform: translateX(0) translateY(0) scale(1); opacity: 1; }
}

@keyframes kmFlip {
  0%   { transform: perspective(500px) rotateX(-90deg) scale(0.8); opacity: 0; }
  100% { transform: perspective(500px) rotateX(0deg) scale(1); opacity: 1; }
}

@keyframes kmSlide {
  0%   { transform: translateY(110%); opacity: 0; }
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
  0%   { transform: scale(0.2); opacity: 0; filter: brightness(2); }
  50%  { transform: scale(1.35); opacity: 1; filter: brightness(1.5); }
  75%  { transform: scale(0.95); }
  100% { transform: scale(1); opacity: 1; filter: brightness(1); }
}

@keyframes kmHighlight {
  0%   { width: 0%; }
  100% { width: 100%; }
}

@keyframes kmZoom {
  0%   { transform: scale(0.5); opacity: 0; }
  50%  { transform: scale(1.2); opacity: 1; }
  90%  { transform: scale(1.8); opacity: 0; }
  100% { transform: scale(1); opacity: 0; }
}

@keyframes kmWave {
  0%, 100% { transform: translateY(0px) rotate(0deg); }
  25% { transform: translateY(-6px) rotate(-2deg); }
  75% { transform: translateY(6px) rotate(2deg); }
}

@keyframes kmPulseGlow {
  0%, 100% { opacity: 0.3; transform: scale(0.98); }
  50% { opacity: 0.8; transform: scale(1.02); }
}
`;

// ─── Per-preset micro-preview renderer ────────────────────────────────────────
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
    const t = setInterval(() => setTick((n) => n + 1), 1800);
    return () => clearInterval(t);
  }, []);

  const words = customText
    ? customText.split(/\s+/).filter(Boolean).slice(0, 4)
    : PREVIEW_WORDS;

  const font = fontFamily && fontFamily !== "preset" ? fontFamily : preset.previewFont;
  const accent = customColor || preset.accentColor;
  const key = `${preset.id}-${tick}`;

  const wordStyle: React.CSSProperties = {
    fontFamily: font,
    color: "#FFFFFF",
    fontSize: words.length > 3 ? 12 : 14,
    fontWeight: 900,
    letterSpacing: "0.04em",
    lineHeight: 1.1,
    display: "inline-block",
  };

  switch (preset.id) {
    case "km-01-slam":
      return (
        <div className="flex flex-wrap gap-1.5 items-center justify-center h-full text-center p-2">
          {words.map((w, i) => (
            <span
              key={`${key}-${i}`}
              style={{
                ...wordStyle,
                color: i === 1 ? accent : "#fff",
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
    case "km-02-elastic-bounce":
      return (
        <div className="flex flex-wrap gap-1.5 items-center justify-center h-full text-center p-2">
          {words.map((w, i) => (
            <span
              key={`${key}-${i}`}
              style={{
                ...wordStyle,
                color: i === 1 ? accent : "#fff",
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
    case "km-03-word-cascade":
      return (
        <div className="flex flex-wrap gap-1.5 items-center justify-center h-full text-center p-2">
          {words.map((w, i) => (
            <span
              key={`${key}-${i}`}
              style={{
                ...wordStyle,
                color: i === 1 ? "#000" : "#fff",
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
    case "km-04-cinematic-flip":
      return (
        <div className="flex flex-wrap gap-1.5 items-center justify-center h-full text-center p-2" style={{ perspective: 600 }}>
          {words.map((w, i) => (
            <span
              key={`${key}-${i}`}
              style={{
                ...wordStyle,
                color: i === 1 ? accent : "#fff",
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
    case "km-05-masked-slide":
      return (
        <div className="flex flex-wrap gap-1.5 items-center justify-center h-full text-center p-2">
          {words.map((w, i) => (
            <span key={`${key}-${i}`} style={{ overflow: "hidden", display: "inline-block" }}>
              <span
                style={{
                  ...wordStyle,
                  color: i === 1 ? accent : "#fff",
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
    case "km-06-glitch-scramble":
      return (
        <div className="flex flex-wrap gap-1.5 items-center justify-center h-full text-center p-2">
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
    case "km-08-particle-burst":
      return (
        <div className="flex flex-wrap gap-1.5 items-center justify-center h-full text-center p-2">
          {words.map((w, i) => (
            <span
              key={`${key}-${i}`}
              style={{
                ...wordStyle,
                color: i === 1 ? accent : "#fff",
                textShadow: i === 1 ? `0 0 14px ${accent}` : "none",
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
    case "km-09-highlighter-sweep":
      return (
        <div className="flex flex-wrap gap-1.5 items-center justify-center h-full text-center p-2">
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
              <span style={{ ...wordStyle, color: "#fff", position: "relative", zIndex: 1 }}>{w}</span>
            </span>
          ))}
        </div>
      );
    case "km-10-zoom-through":
      return (
        <div className="flex flex-wrap gap-1.5 items-center justify-center h-full text-center p-2">
          {words.map((w, i) => (
            <span
              key={`${key}-${i}`}
              style={{
                ...wordStyle,
                color: i === 1 ? accent : "#fff",
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
    case "km-11-fluid-wave":
      return (
        <div className="flex flex-wrap gap-0.5 items-center justify-center h-full text-center p-2">
          {words.join(" ").split("").map((ch, i) => (
            <span
              key={`${key}-${i}`}
              style={{
                ...wordStyle,
                fontSize: 12,
                color: i % 3 === 0 ? accent : "#cbd5e1",
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
    default:
      return (
        <div className="flex flex-wrap gap-1.5 items-center justify-center h-full text-center p-2">
          {words.map((w) => (
            <span key={w} style={wordStyle}>{w}</span>
          ))}
        </div>
      );
  }
}

// ─── Preset Card Component ───────────────────────────────────────────────────
function KMPresetCard({
  preset,
  isSelected,
  onSelect,
  onOpenLivePreview,
  userVideoUrl,
}: {
  preset: KineticMotionPreset;
  isSelected: boolean;
  onSelect: () => void;
  onOpenLivePreview: (e: React.MouseEvent) => void;
  userVideoUrl?: string | null;
}) {
  const stockVideoUrl = KM_PRESET_VIDEO_MAP[preset.id] || "https://res.cloudinary.com/dhouh9idx/video/upload/q_auto,f_mp4,w_360,vc_h264/itnavideo-assets/autocaptionvideos/kinetic.mp4";
  const videoSrc = userVideoUrl || stockVideoUrl;

  return (
    <div
      onClick={onSelect}
      className={`group relative rounded-[20px] border p-2.5 overflow-hidden text-left transition-all duration-300 cursor-pointer flex flex-col justify-between ${
        isSelected
          ? "border-[#FF6D00] ring-2 ring-[#FF6D00]/40 bg-gradient-to-b from-[#FF6D00]/15 via-[#0E1526] to-[#070B14] shadow-xl shadow-[#FF6D00]/20 scale-[1.02]"
          : "border-white/10 bg-[#0E1526]/90 hover:border-[#FF6D00]/50 hover:bg-[#151E30] hover:shadow-lg"
      }`}
    >
      {/* Top badges */}
      <div className="flex items-center justify-between gap-1 z-10 mb-2">
        <span
          className="rounded-full px-2 py-0.5 text-[9px] font-black tracking-wider uppercase shadow-xs"
          style={{
            backgroundColor: isSelected ? preset.accentColor : "rgba(0,0,0,0.65)",
            color: isSelected ? "#000" : "#ffffff",
            border: isSelected ? "none" : "1px solid rgba(255,255,255,0.2)",
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
          className="rounded-full bg-black/70 hover:bg-[#FF6D00] hover:text-black border border-white/20 p-1 text-zinc-200 transition-all cursor-pointer flex items-center gap-1 px-2 shadow-xs"
          title="Open Full 9:16 Live Preview"
        >
          <Eye size={11} />
          <span className="text-[9px] font-bold hidden sm:inline">Preview</span>
        </button>
      </div>

      {/* 9:16 Vertical Video Preview Frame */}
      <div
        className="w-full aspect-[9/12] min-h-[140px] sm:min-h-[160px] bg-[#070B14] rounded-xl relative overflow-hidden flex flex-col items-center justify-center border border-white/10 group-hover:border-white/25 transition-all shadow-inner"
      >
        {/* Real 9:16 Video Background Loop */}
        <video
          src={videoSrc}
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:opacity-85 transition-opacity duration-300 pointer-events-none rounded-xl"
        />

        {/* Dark Vignette Overlay for High Contrast Text Legibility */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-black/70 pointer-events-none" />

        {/* Ambient radial glow background matching preset accent */}
        <div
          className="absolute inset-0 opacity-25 pointer-events-none"
          style={{
            background: `radial-gradient(circle at center, ${preset.accentColor} 0%, transparent 75%)`,
          }}
        />

        {/* Camera frame corner notches */}
        <div className="absolute top-1.5 left-1.5 text-[8px] font-mono text-white/40 pointer-events-none">+</div>
        <div className="absolute top-1.5 right-1.5 text-[8px] font-mono text-white/40 pointer-events-none">+</div>
        <div className="absolute bottom-1.5 left-1.5 text-[8px] font-mono text-white/40 pointer-events-none">+</div>
        <div className="absolute bottom-1.5 right-1.5 text-[8px] font-mono text-white/40 pointer-events-none">+</div>

        {/* Micro animation stage overlaid on top of video */}
        <div className="relative z-10 w-full h-full flex items-center justify-center">
          <KMPreviewAnimation preset={preset} />
        </div>
      </div>

      {/* Card Info Footer */}
      <div className="mt-2.5 space-y-1">
        <div className="flex items-start justify-between gap-1">
          <h3 className="text-xs sm:text-sm font-black text-white leading-tight whitespace-normal break-words">
            {preset.name}
          </h3>
          {isSelected && (
            <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-[#FF6D00] text-black">
              <Check size={10} strokeWidth={3} />
            </span>
          )}
        </div>

        <p className="text-[10px] text-zinc-400 font-medium leading-snug whitespace-normal break-words">
          {preset.vibe}
        </p>

        <div className="pt-1 flex items-center justify-between">
          <span
            className="text-[9px] font-bold px-2 py-0.5 rounded-full border border-white/10"
            style={{ color: preset.accentColor, backgroundColor: `${preset.accentColor}18` }}
          >
            {preset.tag}
          </span>
          <span className="text-[9px] font-mono text-zinc-500">9:16 Video</span>
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
  const [sampleText, setSampleText] = useState("YOUR WORDS MOVE IN SYNC WITH THE BEAT");

  if (!isOpen) return null;

  const stockVideoUrl = KM_PRESET_VIDEO_MAP[preset.id] || "https://res.cloudinary.com/dhouh9idx/video/upload/q_auto,f_mp4,w_360,vc_h264/itnavideo-assets/autocaptionvideos/kinetic.mp4";
  const modalVideoSrc = userVideoUrl || stockVideoUrl;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-[#0E1526] border border-white/15 rounded-[28px] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-[#070B14]/80">
          <div className="flex items-center gap-2.5">
            <span
              className="rounded-full px-2.5 py-0.5 text-xs font-black"
              style={{ backgroundColor: preset.accentColor, color: "#000" }}
            >
              {preset.badge}
            </span>
            <div>
              <h2 className="text-base font-black text-white">{preset.name}</h2>
              <p className="text-xs text-zinc-400">{preset.vibe}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full bg-white/10 hover:bg-white/20 p-2 text-zinc-300 transition cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            {/* Left: Smartphone 9:16 Preview Player */}
            <div className="md:col-span-6 flex justify-center">
              <div className="relative aspect-[9/16] w-[240px] sm:w-[270px] bg-[#070B14] rounded-[28px] border-4 border-zinc-800 shadow-2xl p-4 flex flex-col justify-between overflow-hidden">
                {/* Smartphone top notch */}
                <div className="absolute top-2 left-1/2 -translate-x-1/2 w-20 h-3 bg-zinc-900 rounded-full z-20 flex items-center justify-center">
                  <div className="w-2 h-2 rounded-full bg-zinc-800" />
                </div>

                {/* Real 9:16 Video Background Loop */}
                <video
                  src={modalVideoSrc}
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="absolute inset-0 w-full h-full object-cover opacity-65 pointer-events-none rounded-[24px]"
                />

                {/* Dark Vignette Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-black/75 pointer-events-none" />

                {/* Ambient radial glow background */}
                <div
                  className="absolute inset-0 opacity-30 pointer-events-none"
                  style={{
                    background: `radial-gradient(circle at 50% 50%, ${accentColor || preset.accentColor} 0%, transparent 80%)`,
                  }}
                />

                {/* Grid Overlay */}
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none" />

                {/* Header Tag */}
                <div className="relative z-10 pt-4 flex items-center justify-between text-[10px] text-zinc-300 font-mono font-bold">
                  <span>9:16 FULL HD</span>
                  <span className="flex items-center gap-1 text-emerald-400">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> LIVE
                  </span>
                </div>

                {/* Live Kinetic Motion Stage */}
                <div className="relative z-10 my-auto py-6 flex items-center justify-center">
                  <KMPreviewAnimation
                    preset={preset}
                    customText={sampleText}
                    fontFamily={fontFamily}
                    customColor={accentColor}
                  />
                </div>

                {/* Bottom Bar Info */}
                <div className="relative z-10 text-center space-y-1">
                  <span
                    className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold"
                    style={{ backgroundColor: `${accentColor || preset.accentColor}25`, color: accentColor || preset.accentColor }}
                  >
                    {preset.tag}
                  </span>
                  <p className="text-[9px] font-mono text-zinc-500">Kinetic Typography Engine</p>
                </div>
              </div>
            </div>

            {/* Right: Live Controls & Sample Text Input */}
            <div className="md:col-span-6 space-y-4">
              {/* Sample Text Input */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300 block">
                  Test Your Sample Text
                </label>
                <input
                  type="text"
                  value={sampleText}
                  onChange={(e) => setSampleText(e.target.value)}
                  placeholder="e.g. YOUR WORDS MOVE IN SYNC WITH THE BEAT"
                  className="w-full bg-[#070B14] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white font-medium focus:border-[#FF6D00] focus:outline-none"
                />
                <p className="text-[10px] text-zinc-400">Type words to see live motion animation in real-time.</p>
              </div>

              {/* Accent Color Picker */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300 block">Accent Color</label>
                <div className="flex items-center gap-2 flex-wrap">
                  {["#FACC15", "#FF6D00", "#EF4444", "#22C55E", "#38BDF8", "#A855F7", "#FFFFFF"].map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => onChangeAccentColor(c)}
                      className={`h-7 w-7 rounded-full border-2 transition cursor-pointer ${
                        accentColor === c ? "border-white scale-110 shadow-lg" : "border-transparent opacity-80"
                      }`}
                      style={{ backgroundColor: c }}
                    />
                  ))}
                  <input
                    type="color"
                    value={accentColor}
                    onChange={(e) => onChangeAccentColor(e.target.value)}
                    className="h-7 w-9 bg-transparent border border-white/20 rounded-lg cursor-pointer p-0.5"
                  />
                </div>
              </div>

              {/* Font Picker */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300 block">Font Family</label>
                <select
                  value={fontFamily}
                  onChange={(e) => onChangeFontFamily(e.target.value)}
                  className="w-full bg-[#070B14] text-white text-xs font-bold rounded-xl border border-white/10 px-3 py-2 focus:border-[#FF6D00] focus:outline-none"
                >
                  <option value="preset">Preset Default ({preset.previewFont.split(",")[0]})</option>
                  <option value="Impact, sans-serif">Impact — Viral Heavy</option>
                  <option value="Montserrat, sans-serif">Montserrat — Modern Clean</option>
                  <option value="Anton, sans-serif">Anton — Poster Headline</option>
                  <option value="'Bebas Neue', sans-serif">Bebas Neue — Tall Bold</option>
                  <option value="Courier New, monospace">Courier New — Cyber Monospace</option>
                  <option value="Georgia, serif">Georgia — Editorial Serif</option>
                </select>
              </div>

              {/* Animation Spec Note */}
              <div className="rounded-xl bg-[#070B14] p-3 border border-white/10 space-y-1">
                <span className="text-[10px] font-bold text-[#FF8F00] uppercase tracking-wider block">Animation Physics</span>
                <p className="text-[11px] text-zinc-300 leading-relaxed">{preset.animationSpec}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-white/10 bg-[#070B14] flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl border border-white/10 text-xs font-bold text-zinc-300 hover:bg-white/10 transition cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => {
              onApply();
              onClose();
            }}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#FF6D00] to-[#FF8F00] text-xs font-black text-black shadow-lg shadow-[#FF6D00]/25 hover:brightness-110 active:scale-95 transition cursor-pointer"
          >
            <Check size={14} strokeWidth={3} />
            Apply Motion Style
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Props ────────────────────────────────────────────────────────────────────
export interface KineticMotionStudioProps {
  selectedFile: File | null;
  onSelectFile: (file: File | null) => void;
  selectedPreset: KineticMotionPresetId;
  onSelectPreset: (id: KineticMotionPresetId) => void;
  sfxIntensity: "full" | "subtle" | "none";
  onSfxIntensityChange: (val: "full" | "subtle" | "none") => void;
  pacing: "fast" | "smooth";
  onPacingChange: (val: "fast" | "smooth") => void;
  textCase: "uppercase" | "natural";
  onTextCaseChange: (val: "uppercase" | "natural") => void;
  accentColor: string;
  onAccentColorChange: (color: string) => void;
  fontFamily: string;
  onFontFamilyChange: (font: string) => void;
  intensity: "normal" | "aggressive";
  onIntensityChange: (val: "normal" | "aggressive") => void;
  onGenerate: () => void;
  isGenerating: boolean;
}

// ─── Main Studio ──────────────────────────────────────────────────────────────
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
  onGenerate,
  isGenerating,
}: KineticMotionStudioProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [activeTab, setActiveTab] = useState<"presets" | "customize">("presets");
  const [livePreviewPreset, setLivePreviewPreset] = useState<KineticMotionPreset | null>(null);

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

  return (
    <div className="relative rounded-[28px] border border-white/10 bg-[#111218] p-5 sm:p-7 shadow-2xl min-w-0 max-w-full overflow-x-hidden space-y-7 text-white">
      {/* Magic UI BorderBeam Glowing Effect */}
      <BorderBeam size={280} duration={14} colorFrom="#FF6D00" colorTo="#FFA726" />
      {/* Inject CSS keyframes once */}
      <style dangerouslySetInnerHTML={{ __html: KM_STYLES }} />

      {/* ── Studio Header ── */}
      <div className="border-b border-white/10 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-white sm:text-3xl flex items-center gap-2.5">
            <span>Kinetic Motion Studio</span>
            <span className="rounded-full bg-[#FF6D00]/15 border border-[#FF6D00]/30 px-3 py-0.5 text-xs font-mono font-bold text-[#FF9100]">
              9:16 · 1080p Full HD
            </span>
          </h1>
          <p className="text-xs text-zinc-400 mt-1">
            Transform speech & voiceovers into dynamic, motion-driven kinetic text
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-[#161720] px-3 py-1 text-xs font-bold text-slate-300">
            <Zap size={13} className="text-amber-500" />
            1 Video
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-[#FF6D00]/40 bg-[#FF6D00]/10 px-3 py-1 text-xs font-bold text-[#FFA726]">
            <Type size={13} className="text-[#FF8F00]" />
            {activePreset.badge} · {activePreset.name}
          </span>
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
            className="relative flex flex-col items-center justify-center gap-5 rounded-[28px] border-2 border-dashed border-white/15 hover:border-[#FF6D00]/60 bg-[#0A0C12] hover:bg-[#0E1020] min-h-[220px] p-8 text-center transition-all duration-200 cursor-pointer group"
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
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-[#FF6D00]/30 bg-[#FF6D00]/10 text-[#FF9100] group-hover:scale-110 group-hover:bg-[#FF6D00]/20 transition-all duration-300 shadow-lg shadow-[#FF6D00]/10">
              <Upload size={28} />
            </div>
            <div className="space-y-1.5">
              <p className="text-base font-black text-white">Upload Talking Video or Voiceover Audio</p>
              <p className="text-sm text-zinc-400">MP4, MOV, MP3, WAV · Up to 3 minutes</p>
              <div className="flex flex-wrap items-center justify-center gap-2 mt-3">
                <span className="rounded-full border border-white/10 bg-[#161720] px-3 py-1 text-[11px] font-bold text-slate-300 flex items-center gap-1.5">
                  <Film size={11} className="text-[#FF8F00]" /> MP4 / MOV Video
                </span>
                <span className="rounded-full border border-white/10 bg-[#161720] px-3 py-1 text-[11px] font-bold text-slate-300 flex items-center gap-1.5">
                  <FileAudio size={11} className="text-[#FF8F00]" /> MP3 / WAV Audio
                </span>
              </div>
            </div>
            <div className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#FF6D00] to-[#FF8F00] px-6 py-2.5 text-sm font-black text-black shadow-lg shadow-[#FF6D00]/25 group-hover:brightness-110 transition active:scale-95">
              <Upload size={15} />
              Browse Files
            </div>
          </div>

          {/* Redesigned 11 Motion Styles Selector */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles size={16} className="text-[#FF8F00]" />
                <h2 className="text-sm font-black uppercase tracking-wider text-white">
                  Pick Your Motion Style (11 Presets)
                </h2>
                <span className="rounded-full bg-[#FF6D00]/15 border border-[#FF6D00]/30 px-2.5 py-0.5 text-[11px] font-black text-[#FFA726]">
                  Active: {activePreset.badge} — {activePreset.name}
                </span>
              </div>
              <span className="text-xs text-zinc-400 hidden sm:inline">
                Click any card to select or preview 9:16 live motion
              </span>
            </div>

            {/* Responsive 2 to 4 Column Grid with 9:16 Aspect Ratio */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-3 sm:gap-4">
              {KINETIC_MOTION_PRESETS.map((preset) => (
                <KMPresetCard
                  key={preset.id}
                  preset={preset}
                  isSelected={selectedPreset === preset.id}
                  onSelect={() => onSelectPreset(preset.id as KineticMotionPresetId)}
                  onOpenLivePreview={() => setLivePreviewPreset(preset)}
                  userVideoUrl={userVideoUrl}
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
              className="w-full flex items-center justify-between gap-3 rounded-2xl border border-white/10 hover:border-[#FF6D00]/50 bg-[#161720] p-3.5 transition-all cursor-pointer group"
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
            <div className="grid grid-cols-2 gap-1 rounded-2xl bg-[#161720] p-1 border border-white/10">
              {(["presets", "customize"] as const).map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setActiveTab(tab)}
                  className={`rounded-xl py-2.5 text-xs font-black transition cursor-pointer flex items-center justify-center gap-1.5 ${
                    activeTab === tab
                      ? "bg-gradient-to-r from-[#FF6D00] to-[#FF8F00] text-black shadow-md"
                      : "text-zinc-400 hover:text-white"
                  }`}
                >
                  {tab === "presets" ? (
                    <>
                      <Sparkles size={13} /> Motion Presets
                    </>
                  ) : (
                    <>
                      <SlidersHorizontal size={13} /> Customize
                    </>
                  )}
                </button>
              ))}
            </div>

            {/* Tab 1: Motion Style Grid */}
            {activeTab === "presets" && (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {KINETIC_MOTION_PRESETS.map((preset) => (
                  <KMPresetCard
                    key={preset.id}
                    preset={preset}
                    isSelected={selectedPreset === preset.id}
                    onSelect={() => onSelectPreset(preset.id as KineticMotionPresetId)}
                    onOpenLivePreview={() => setLivePreviewPreset(preset)}
                    userVideoUrl={userVideoUrl}
                  />
                ))}
              </div>
            )}

            {/* Tab 2: Customize Drawer */}
            {activeTab === "customize" && (
              <div className="rounded-[22px] border border-white/10 bg-[#161720] p-5 space-y-5">
                {/* Font Selection */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-300 block">Font Family</label>
                  <select
                    value={fontFamily}
                    onChange={(e) => onFontFamilyChange(e.target.value)}
                    className="w-full bg-[#090A0F] text-white text-xs font-bold rounded-xl border border-white/10 px-3 py-2.5 focus:border-[#FF6D00] focus:outline-none cursor-pointer"
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
                      {["#FACC15", "#FF6D00", "#EF4444", "#22C55E", "#38BDF8", "#A855F7", "#FFFFFF"].map((c) => (
                        <button
                          key={c}
                          type="button"
                          onClick={() => onAccentColorChange(c)}
                          className="h-7 w-7 rounded-full border-2 transition active:scale-90 cursor-pointer"
                          style={{
                            backgroundColor: c,
                            borderColor: accentColor === c ? "#fff" : "transparent",
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
                  <div className="grid grid-cols-2 gap-1.5 rounded-2xl bg-[#0E1020] p-1 border border-white/10">
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
                            ? "bg-gradient-to-r from-[#FF6D00] to-[#FF8F00] text-black shadow-md"
                            : "text-zinc-400 hover:text-white"
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
                  <div className="grid grid-cols-3 gap-1.5 rounded-2xl bg-[#0E1020] p-1 border border-white/10">
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
                            ? "bg-gradient-to-r from-[#FF6D00] to-[#FF8F00] text-black shadow-md font-black"
                            : "text-zinc-400 hover:text-white"
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
                  <div className="grid grid-cols-2 gap-1.5 rounded-2xl bg-[#0E1020] p-1 border border-white/10">
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
                            ? "bg-gradient-to-r from-[#FF6D00] to-[#FF8F00] text-black shadow-md font-black"
                            : "text-zinc-400 hover:text-white"
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
                  <div className="grid grid-cols-2 gap-1.5 rounded-2xl bg-[#0E1020] p-1 border border-white/10">
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
                            ? "bg-gradient-to-r from-[#FF6D00] to-[#FF8F00] text-black shadow-md font-black"
                            : "text-zinc-400 hover:text-white"
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
                    style={{ backgroundColor: activePreset.accentColor, color: "#000" }}
                  >
                    {activePreset.badge}
                  </span>
                  <h3 className="text-lg font-black text-white mt-2">{activePreset.name}</h3>
                  <p className="text-xs text-zinc-300 mt-0.5">{activePreset.vibe}</p>
                </div>

                <button
                  type="button"
                  onClick={() => setLivePreviewPreset(activePreset)}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-white/20 bg-white/10 hover:bg-[#FF6D00] hover:text-black px-3 py-1.5 text-xs font-bold text-white transition cursor-pointer"
                >
                  <Eye size={13} />
                  <span>9:16 Live Preview</span>
                </button>
              </div>

              {/* 9:16 Stage Preview Box */}
              <div className="rounded-xl bg-[#070B14] border border-white/10 overflow-hidden relative flex items-center justify-center" style={{ height: 130 }}>
                <video
                  src={userVideoUrl || KM_PRESET_VIDEO_MAP[activePreset.id] || "https://res.cloudinary.com/dhouh9idx/video/upload/q_auto,f_mp4,w_360,vc_h264/itnavideo-assets/autocaptionvideos/kinetic.mp4"}
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="absolute inset-0 w-full h-full object-cover opacity-60 pointer-events-none rounded-xl"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/60 pointer-events-none" />
                <div className="relative z-10 w-full h-full flex items-center justify-center">
                  <KMPreviewAnimation
                    preset={activePreset}
                    fontFamily={fontFamily}
                    customColor={accentColor}
                  />
                </div>
              </div>

              <div className="pt-2 border-t border-white/10 flex items-center justify-between text-[11px]">
                <span className="text-zinc-400">Bridge Target:</span>
                <span className="font-mono text-[#FF8F00] font-bold">{activePreset.bridgeStyleId}</span>
              </div>
            </div>

            {/* Generate Button */}
            <button
              type="button"
              onClick={onGenerate}
              disabled={isGenerating}
              className="w-full inline-flex min-h-[54px] items-center justify-center gap-2.5 rounded-2xl bg-gradient-to-r from-[#FF6D00] via-[#FF8F00] to-[#FFA726] text-base font-black text-black shadow-xl shadow-[#FF6D00]/30 hover:brightness-110 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-all"
            >
              <Sparkles size={18} />
              <span>{isGenerating ? "Syncing Kinetic Motion..." : "Generate Kinetic Motion Video"}</span>
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
