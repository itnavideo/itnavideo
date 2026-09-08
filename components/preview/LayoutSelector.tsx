"use client";

import { ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";
import { SUBTITLE_PRESETS } from "@/components/ui/SubtitleStylePicker";
import type { PreviewLayout } from "./types";

type Props = {
  layout: PreviewLayout;
  videoTypeId: string;
  captionStyle: string;
  captionFontFamily: string;
  captionFontSize: string;
  captionTextColor: string;
  captionHighlightColor: string;
  accentColor?: string;
  onLayoutChange: (layout: PreviewLayout) => void;
  onCaptionStyleChange: (style: string) => void;
  onCaptionFontFamilyChange: (font: string) => void;
  onCaptionFontSizeChange: (size: string) => void;
  onCaptionTextColorChange: (color: string) => void;
  onCaptionHighlightColorChange: (color: string) => void;
  onAccentColorChange?: (color: string) => void;
};

const VIDEO_LAYOUTS = [
  { value: "fullscreen", label: "Fullscreen", icon: "⬛" },
  { value: "blur-bg", label: "Blur BG", icon: "🌫️" },
  { value: "split", label: "Split", icon: "⬒" },
] as const;

const CAPTION_POSITIONS = [
  { value: "bottom", label: "Bottom" },
  { value: "center", label: "Center" },
  { value: "top", label: "Top" },
] as const;

const PROGRESS_STYLES = [
  { value: "glow", label: "Glow" },
  { value: "line", label: "Line" },
  { value: "none", label: "None" },
] as const;

const CAPTION_STYLES = SUBTITLE_PRESETS.map((preset) => ({
  value: preset.key,
  label: preset.label,
}));

const CAPTION_FONTS = [
  { value: "Inter, sans-serif", label: "Inter" },
  { value: "Impact, sans-serif", label: "Impact" },
  { value: "Arial Black, sans-serif", label: "Arial Black" },
  { value: "Georgia, serif", label: "Georgia" },
  { value: "Courier New, monospace", label: "Courier New" },
  { value: "sans-serif", label: "Sans Serif" },
] as const;

const CAPTION_SIZES = [
  { value: "small", label: "Small" },
  { value: "medium", label: "Medium" },
  { value: "large", label: "Large" },
  { value: "xlarge", label: "Extra large" },
] as const;

const normalizeCaptionFont = (font: string) => {
  const key = font.split(",")[0]?.trim().toLowerCase();
  if (key === "impact") return "Impact, sans-serif";
  if (key === "arial black") return "Arial Black, sans-serif";
  if (key === "georgia") return "Georgia, serif";
  if (key === "courier new") return "Courier New, monospace";
  if (key === "sans-serif") return "sans-serif";
  return "Inter, sans-serif";
};

export function LayoutSelector({
  layout,
  videoTypeId,
  captionStyle,
  captionFontFamily,
  captionFontSize,
  captionTextColor,
  captionHighlightColor,
  accentColor,
  onLayoutChange,
  onCaptionStyleChange,
  onCaptionFontFamilyChange,
  onCaptionFontSizeChange,
  onCaptionTextColorChange,
  onCaptionHighlightColorChange,
  onAccentColorChange,
}: Props) {
  const [expanded, setExpanded] = useState(true);
  const showVideoLayout = videoTypeId === "DYNAMIC_CREATOR_REEL";
  const showAccentColor = videoTypeId === "DYNAMIC_CREATOR_REEL";
  const showProgressStyle = videoTypeId !== "AUTO_CAPTION_GENERATOR";

  return (
    <div className="bg-zinc-900 rounded-xl border border-zinc-800 overflow-hidden">
      <button
        onClick={() => setExpanded((v) => !v)}
        className="w-full flex items-center justify-between px-4 py-3 text-sm font-semibold text-white hover:bg-zinc-800 transition-colors"
      >
        <span className="flex items-center gap-2">
          <span className="text-cyan-300">🎨</span>
          Style & Layout
        </span>
        {expanded ? <ChevronUp size={14} className="text-zinc-500" /> : <ChevronDown size={14} className="text-zinc-500" />}
      </button>

      {expanded && (
        <div className="px-4 pb-4 space-y-4">
          {/* Video Layout */}
          {showVideoLayout && (
            <div>
              <label className="text-xs text-zinc-500 mb-2 block">Video Layout</label>
              <div className="flex gap-2">
                {VIDEO_LAYOUTS.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => onLayoutChange({ ...layout, videoLayout: opt.value })}
                    className={`flex-1 py-2 rounded-lg text-xs font-medium transition-all border ${
                      layout.videoLayout === opt.value
                        ? "bg-emerald-600 border-emerald-500 text-white"
                        : "bg-zinc-800 border-zinc-700 text-zinc-400 hover:border-zinc-600"
                    }`}
                  >
                    {opt.icon} {opt.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Caption Style */}
          <div>
            <label className="text-xs text-zinc-500 mb-2 block">Caption Style</label>
            <select
              value={captionStyle}
              onChange={(e) => {
                const nextStyle = e.target.value;
                onCaptionStyleChange(nextStyle);
                const preset = SUBTITLE_PRESETS.find((item) => item.key === nextStyle || item.style === nextStyle);
                if (preset) {
                  onCaptionFontFamilyChange(normalizeCaptionFont(preset.font));
                  onCaptionTextColorChange(preset.textColor);
                  onCaptionHighlightColorChange(preset.highlightColor);
                }
              }}
              className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-emerald-500"
            >
              {CAPTION_STYLES.map((s) => (
                <option key={s.value} value={s.value}>{s.label}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-zinc-500 mb-2 block">Font</label>
              <select
                value={captionFontFamily}
                onChange={(e) => onCaptionFontFamilyChange(e.target.value)}
                className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-emerald-500"
              >
                {CAPTION_FONTS.map((font) => (
                  <option key={font.value} value={font.value}>{font.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs text-zinc-500 mb-2 block">Size</label>
              <select
                value={captionFontSize}
                onChange={(e) => onCaptionFontSizeChange(e.target.value)}
                className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-emerald-500"
              >
                {CAPTION_SIZES.map((size) => (
                  <option key={size.value} value={size.value}>{size.label}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Caption Position */}
          <div>
            <label className="text-xs text-zinc-500 mb-2 block">Caption Position</label>
            <div className="flex gap-2">
              {CAPTION_POSITIONS.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => onLayoutChange({ ...layout, captionPosition: opt.value })}
                  className={`flex-1 py-2 rounded-lg text-xs font-medium transition-all border ${
                    layout.captionPosition === opt.value
                      ? "bg-emerald-600 border-emerald-500 text-white"
                      : "bg-zinc-800 border-zinc-700 text-zinc-400 hover:border-zinc-600"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Colors */}
          <div className="flex gap-3">
            <div className="flex-1">
              <label className="text-xs text-zinc-500 mb-2 block">Text Color</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={captionTextColor}
                  onChange={(e) => onCaptionTextColorChange(e.target.value)}
                  className="w-8 h-8 rounded cursor-pointer border-0 bg-transparent"
                />
                <span className="text-xs text-zinc-500 font-mono">{captionTextColor}</span>
              </div>
            </div>
            <div className="flex-1">
              <label className="text-xs text-zinc-500 mb-2 block">Highlight</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={captionHighlightColor}
                  onChange={(e) => onCaptionHighlightColorChange(e.target.value)}
                  className="w-8 h-8 rounded cursor-pointer border-0 bg-transparent"
                />
                <span className="text-xs text-zinc-500 font-mono">{captionHighlightColor}</span>
              </div>
            </div>
          </div>

          {/* Accent color for DynamicCreator */}
          {showAccentColor && onAccentColorChange && (
            <div>
              <label className="text-xs text-zinc-500 mb-2 block">Accent Color</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={accentColor || "#10B981"}
                  onChange={(e) => onAccentColorChange(e.target.value)}
                  className="w-8 h-8 rounded cursor-pointer border-0 bg-transparent"
                />
                <span className="text-xs text-zinc-500 font-mono">{accentColor || "#10B981"}</span>
              </div>
            </div>
          )}

          {/* Progress style */}
          {showProgressStyle && (
          <div>
            <label className="text-xs text-zinc-500 mb-2 block">Progress Bar</label>
            <div className="flex gap-2">
              {PROGRESS_STYLES.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => onLayoutChange({ ...layout, progressStyle: opt.value })}
                  className={`flex-1 py-2 rounded-lg text-xs font-medium transition-all border ${
                    layout.progressStyle === opt.value
                      ? "bg-emerald-600 border-emerald-500 text-white"
                      : "bg-zinc-800 border-zinc-700 text-zinc-400 hover:border-zinc-600"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
          )}
        </div>
      )}
    </div>
  );
}
