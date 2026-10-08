"use client";

import React, { ChangeEvent, useMemo, useEffect, useState, useRef } from "react";
import {
  Sparkles,
  Clock3,
  Zap,
  Upload,
  SlidersHorizontal,
  ChevronDown,
  Globe,
  FileVideo,
  Activity,
  Layers,
  Download,
} from "lucide-react";
import { SUBTITLE_PRESETS } from "@/remotion/types/subtitles";
import { AutoCaptionBeforeAfterPlayer } from "@/components/dashboard/AutoCaptionBeforeAfterPlayer";
import { AutoCaptionStyleCarousel } from "@/components/dashboard/AutoCaptionStyleCarousel";
import { BorderBeam } from "@/components/magicui/BorderBeam";
import { StudioWorkflowRoadmap } from "@/components/dashboard/StudioWorkflowRoadmap";
import { NumberTicker } from "@/components/magicui/NumberTicker";
import { AudioSpectrumVisualizer } from "@/components/dashboard/AudioSpectrumVisualizer";
import { AutoCaptionWordReplacer } from "@/components/dashboard/AutoCaptionWordReplacer";

// Helper to safely convert any color string to uppercase #RRGGBB Hex format
function toValidHex(color: string, fallbackHex: string): string {
  if (!color) return fallbackHex;
  if (color.startsWith("#")) {
    if (color.length === 4) {
      return `#${color[1]}${color[1]}${color[2]}${color[2]}${color[3]}${color[3]}`.toUpperCase();
    }
    return color.substring(0, 7).toUpperCase();
  }
  return fallbackHex;
}

// Audio Spoken Language Options
const AUDIO_SPOKEN_LANGUAGES = [
  { id: "auto", label: "Auto Detect (Recommended)" },
  { id: "hi", label: "Hindi / Hinglish (Spoken)" },
  { id: "en", label: "English (Global / US / UK)" },
  { id: "es", label: "Spanish (Español)" },
  { id: "fr", label: "French (Français)" },
  { id: "de", label: "German (Deutsch)" },
  { id: "pt", label: "Portuguese (Português)" },
  { id: "id", label: "Indonesian (Bahasa)" },
  { id: "ar", label: "Arabic" },
  { id: "ja", label: "Japanese" },
  { id: "ru", label: "Russian" },
];

const SUBTITLE_OUTPUT_LANGUAGES = [
  { id: "same", label: "Same as Audio (Roman Hinglish / English)" },
  { id: "en", label: "English (Latin Script)" },
  { id: "hi", label: "Hinglish (Roman Hindi - No Devanagari)" },
  { id: "es", label: "Spanish (Español)" },
  { id: "fr", label: "French (Français)" },
  { id: "de", label: "German (Deutsch)" },
  { id: "pt", label: "Portuguese (Português)" },
  { id: "id", label: "Indonesian (Bahasa)" },
];

export interface AutoCaptionStudioProps {
  mode?: "autoCaption" | "youtubeSubtitleGenerator";
  selectedFile: File | null;
  onSelectFile: (file: File | null) => void;

  // Subtitle Form States & Callbacks
  captionStyle: string;
  onCaptionStyleChange: (style: string) => void;
  captionPosition: "top" | "center" | "bottom";
  onCaptionPositionChange: (pos: "top" | "center" | "bottom") => void;
  captionFontSize?: "small" | "medium" | "large" | "xlarge";
  onCaptionFontSizeChange?: (size: "small" | "medium" | "large" | "xlarge") => void;
  captionFontFamily?: string;
  onCaptionFontFamilyChange?: (font: string) => void;

  // Colors, Outline & Backing
  captionTextColor: string;
  onCaptionTextColorChange: (color: string) => void;
  captionHighlightColor: string;
  onCaptionHighlightColorChange: (color: string) => void;
  captionStrokeColor?: string;
  onCaptionStrokeColorChange?: (color: string) => void;
  captionStrokeWidth?: "none" | "thin" | "medium" | "thick";
  onCaptionStrokeWidthChange?: (width: "none" | "thin" | "medium" | "thick") => void;
  captionBackgroundColor?: string;
  onCaptionBackgroundColorChange?: (color: string) => void;

  // Dual Language Options
  spokenLanguage?: string;
  onSpokenLanguageChange?: (lang: string) => void;
  captionLanguage?: string;
  onCaptionLanguageChange?: (lang: string) => void;

  // Sound & Animation (Auto Caption Only)
  wordClickSound?: boolean;
  onWordClickSoundChange?: (enabled: boolean) => void;
  captionEmphasisAnimation?: "bounce" | "glow" | "none";
  onCaptionEmphasisAnimationChange?: (anim: "bounce" | "glow" | "none") => void;

  // Margin, Casing & Word Highlight
  youtubeSubtitleSafeZone?: "standard" | "scrubber" | "high";
  onYoutubeSubtitleSafeZoneChange?: (zone: "standard" | "scrubber" | "high") => void;
  youtubeSubtitleCase?: "natural" | "uppercase";
  onYoutubeSubtitleCaseChange?: (casing: "natural" | "uppercase") => void;
  highlightActiveWord?: boolean;
  onHighlightActiveWordChange?: (val: boolean) => void;

  // User ID
  userId?: string;

  // Media Metadata
  mediaDurationSeconds: number;
  mediaAspect: string;
  onMediaMetaChange: (meta: { durationSeconds: number; mediaAspect: string }) => void;

  // Transcript Review & Edit Props
  editedTranscript?: string;
  onEditedTranscriptChange?: (text: string) => void;
  previewCaptions?: Array<{ start: number; end: number; text: string; words?: any[] }> | null;
  onPreviewCaptionsChange?: (captions: Array<{ start: number; end: number; text: string; words?: any[] }> | null) => void;
  onStartRender?: () => void;
  isWorking?: boolean;
}

export function AutoCaptionStudio({
  mode = "autoCaption",
  selectedFile,
  onSelectFile,
  captionStyle,
  onCaptionStyleChange,
  captionPosition,
  onCaptionPositionChange,
  captionFontSize = "large",
  onCaptionFontSizeChange,
  captionFontFamily = "preset",
  onCaptionFontFamilyChange,
  captionTextColor,
  onCaptionTextColorChange,
  captionHighlightColor,
  onCaptionHighlightColorChange,
  captionStrokeColor,
  onCaptionStrokeColorChange,
  captionStrokeWidth = "medium",
  onCaptionStrokeWidthChange,
  captionBackgroundColor = "#18181B",
  onCaptionBackgroundColorChange,
  captionLanguage = "en",
  onCaptionLanguageChange,
  spokenLanguage = "auto",
  onSpokenLanguageChange,
  wordClickSound,
  onWordClickSoundChange,
  captionEmphasisAnimation,
  onCaptionEmphasisAnimationChange,
  youtubeSubtitleCase = "uppercase",
  onYoutubeSubtitleCaseChange,
  highlightActiveWord = true,
  onHighlightActiveWordChange,
  userId,
  mediaDurationSeconds,
  mediaAspect,
  onMediaMetaChange,
  editedTranscript = "",
  onEditedTranscriptChange,
  previewCaptions = null,
  onPreviewCaptionsChange,
  onStartRender,
  isWorking = false,
}: AutoCaptionStudioProps) {
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [transcribeError, setTranscribeError] = useState<string | null>(null);
  const [aspectRatioError, setAspectRatioError] = useState<string | null>(null);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [localStrokeColor, setLocalStrokeColor] = useState<string>("#000000");

  const activeStrokeColor = captionStrokeColor !== undefined ? captionStrokeColor : localStrokeColor;
  const fileInputRef = useRef<HTMLInputElement>(null);



  // Reset transcript and error states on file change
  useEffect(() => {
    if (!selectedFile) {
      if (onEditedTranscriptChange) onEditedTranscriptChange("");
      if (onPreviewCaptionsChange) onPreviewCaptionsChange(null);
      setTranscribeError(null);
    }
  }, [selectedFile]);

  // Auto detect duration & aspect from selected file (strictly 9:16 vertical)
  useEffect(() => {
    if (!selectedFile) {
      onMediaMetaChange({ durationSeconds: 0, mediaAspect: "portrait" });
      return;
    }

    const type = getFileMediaType(selectedFile);
    if (type === "video") {
      const url = URL.createObjectURL(selectedFile);
      const element = document.createElement("video");
      element.src = url;
      element.preload = "metadata";

      const handleLoadedMetadata = () => {
        const width = element.videoWidth || 0;
        const height = element.videoHeight || 0;

        // Strictly reject widescreen 16:9 videos (width > height)
        if (width > 0 && height > 0 && width > height) {
          setAspectRatioError(
            "Auto Caption Studio is restricted to 9:16 Reels & Shorts videos only. For 16:9 widescreen videos, please use our YouTube Subtitle Generator."
          );
          onSelectFile(null);
          URL.revokeObjectURL(url);
          return;
        }

        setAspectRatioError(null);
        onMediaMetaChange({
          durationSeconds: element.duration || 0,
          mediaAspect: "portrait",
        });
        URL.revokeObjectURL(url);
      };

      element.addEventListener("loadedmetadata", handleLoadedMetadata);
      return () => {
        element.removeEventListener("loadedmetadata", handleLoadedMetadata);
        URL.revokeObjectURL(url);
      };
    } else if (type === "audio") {
      setAspectRatioError(null);
      const url = URL.createObjectURL(selectedFile);
      const element = document.createElement("audio");
      element.src = url;
      element.preload = "metadata";

      const handleLoadedMetadata = () => {
        onMediaMetaChange({
          durationSeconds: element.duration || 0,
          mediaAspect: "portrait",
        });
        URL.revokeObjectURL(url);
      };

      element.addEventListener("loadedmetadata", handleLoadedMetadata);
      return () => {
        element.removeEventListener("loadedmetadata", handleLoadedMetadata);
        URL.revokeObjectURL(url);
      };
    } else {
      setAspectRatioError(null);
      onMediaMetaChange({ durationSeconds: 0, mediaAspect: "portrait" });
    }
  }, [selectedFile]);

  const chooseCaptionStyle = (styleId: string) => {
    onCaptionStyleChange(styleId);
    const preset = SUBTITLE_PRESETS[styleId];
    if (preset) {
      if (preset.textColor) onCaptionTextColorChange(preset.textColor);
      if (preset.highlightColor) onCaptionHighlightColorChange(preset.highlightColor);
      if (preset.backgroundColor !== undefined && onCaptionBackgroundColorChange) {
        onCaptionBackgroundColorChange(preset.backgroundColor);
      }
    }
  };

  // Estimated speech metrics
  const estimatedWordCount = useMemo(() => {
    if (!mediaDurationSeconds || mediaDurationSeconds <= 0) return 0;
    return Math.round((mediaDurationSeconds / 60) * 140);
  }, [mediaDurationSeconds]);

  return (
    <div className="relative rounded-[28px] border border-white/10 bg-[#111218] p-4 sm:p-6 shadow-2xl min-w-0 max-w-full overflow-x-hidden space-y-6 text-white">
      {/* Magic UI BorderBeam Glowing Effect */}
      <BorderBeam size={240} duration={12} colorFrom="#FF6D00" colorTo="#FFA726" />

      {/* ── Studio Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-r from-[#FF6D00] to-[#FF8F00] text-black shadow-md shadow-[#FF6D00]/25">
            <Sparkles size={20} />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              Reel Caption Controls
            </h2>
            <p className="text-xs text-slate-400">Word-by-word captions for 9:16 Reels &amp; Shorts</p>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-[#161720] px-3 py-1 text-xs font-bold text-slate-300">
            <Clock3 size={13} className="text-[#FF8F00]" />
            9:16 Reels · Up to 3m
          </span>
        </div>
      </div>

      {/* ── Process Workflow Roadmap ── */}
      <StudioWorkflowRoadmap mode={mode || "autoCaption"} />

      {/* 16:9 Aspect Ratio Error Banner */}
      {aspectRatioError && (
        <div className="rounded-2xl border border-red-500/40 bg-red-500/10 p-4 text-xs flex items-center justify-between gap-3 text-red-200">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-red-500/20 text-red-400 flex items-center justify-center shrink-0">
              <Layers size={18} />
            </div>
            <div>
              <span className="font-black text-sm text-white block">9:16 Vertical Videos Only</span>
              <span className="text-slate-300">{aspectRatioError}</span>
            </div>
          </div>
          <a
            href="/dashboard/youtube-subtitles"
            className="shrink-0 rounded-xl bg-[#FF6D00] px-3.5 py-2 text-xs font-black text-black hover:brightness-110 transition shadow-md"
          >
            16:9 Subtitles →
          </a>
        </div>
      )}

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        accept="video/*,audio/*"
        className="hidden"
        onChange={(event: ChangeEvent<HTMLInputElement>) => {
          onSelectFile(event.target.files?.[0] || null);
          event.currentTarget.value = "";
        }}
        type="file"
      />

      {/* ═══════════════════════════════════════════════════════════════════
          PRE-UPLOAD STATE — Upload-First Canvas (9:16 Only)
      ═══════════════════════════════════════════════════════════════════ */}
      {!selectedFile ? (
        <div className="space-y-6">

          {/* Big 9:16 Upload Dropzone */}
          <div
            onClick={() => fileInputRef.current?.click()}
            onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); }}
            onDrop={(e) => {
              e.preventDefault();
              e.stopPropagation();
              if (e.dataTransfer.files?.[0]) onSelectFile(e.dataTransfer.files[0]);
            }}
            className="flex flex-col items-center justify-center gap-4 rounded-[22px] border-2 border-dashed border-white/15 hover:border-[#FF6D00]/60 bg-[#0A0C12] hover:bg-[#0E1020] min-h-[200px] sm:min-h-[230px] p-6 sm:p-8 text-center transition-all duration-200 cursor-pointer group"
          >
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-[#FF6D00]/30 bg-[#FF6D00]/10 text-[#FF9100] group-hover:scale-110 group-hover:bg-[#FF6D00]/20 transition-all duration-300 shadow-lg shadow-[#FF6D00]/10">
              <FileVideo size={26} />
            </div>
            <div className="space-y-1">
              <p className="text-base font-black text-white">
                Upload 9:16 Video
              </p>
              <p className="text-xs text-slate-400">
                Drag &amp; drop or click to browse (MP4, MOV · Up to 3 minutes)
              </p>
            </div>
            <div className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#FF6D00] to-[#FF8F00] px-5 py-2 text-xs font-black text-black shadow-lg shadow-[#FF6D00]/25 group-hover:brightness-110 transition active:scale-95 mt-1">
              <Upload size={14} />
              Select Video
            </div>
            <p className="text-[10px] font-medium text-[#FFA726]/80 flex items-center justify-center gap-1 mt-1">
              <Sparkles size={11} className="text-[#FF9100]" />
              <span>Word-level transcript replacer &amp; .SRT export unlock automatically upon file upload</span>
            </p>
          </div>

          {/* ── Essential Customization Controls Panel (Spacious 2-Row Layout) ── */}
          <div className="rounded-[24px] border border-white/10 bg-[#141824] p-5 sm:p-6 space-y-6 shadow-2xl">
            {/* Header */}
            <div className="flex items-center justify-between pb-3.5 border-b border-white/10">
              <div className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#FF6D00]/15 border border-[#FF6D00]/30 text-[#FF8F00] shadow-sm">
                  <SlidersHorizontal size={16} />
                </div>
                <h3 className="text-xs sm:text-sm font-black uppercase tracking-wider text-white font-display">
                  Essential Subtitle Customization Controls
                </h3>
              </div>
              <span className="text-[10px] font-bold text-slate-300 bg-white/5 border border-white/10 px-3 py-1 rounded-full tracking-wide">
                Live Studio Controls
              </span>
            </div>

            {/* ── ROW 1: Position, Font, Casing, Word Sync & Language ── */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 items-center pb-5 border-b border-white/10">
              {/* 1. Caption Position */}
              <div className="space-y-2">
                <label className="text-[11px] font-extrabold uppercase tracking-wider text-slate-300 block font-jakarta">
                  Caption Position
                </label>
                <div className="grid grid-cols-3 gap-1.5 p-1.5 rounded-2xl bg-[#090C15] border border-white/10">
                  {[
                    { id: "top", label: "Top" },
                    { id: "center", label: "Middle" },
                    { id: "bottom", label: "Bottom" },
                  ].map((pos) => {
                    const isCur = captionPosition === pos.id;
                    return (
                      <button
                        key={pos.id}
                        type="button"
                        onClick={() => onCaptionPositionChange(pos.id as any)}
                        className={`min-h-[38px] rounded-xl text-xs font-extrabold transition-all cursor-pointer flex items-center justify-center ${
                          isCur
                            ? "bg-gradient-to-r from-[#FF6D00] to-[#FF8F00] text-black shadow-md shadow-[#FF6D00]/25 scale-[1.02]"
                            : "text-slate-400 hover:text-white hover:bg-white/5"
                        }`}
                      >
                        {pos.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 2. Font Selection */}
              <div className="space-y-2">
                <label className="text-[11px] font-extrabold uppercase tracking-wider text-slate-300 block font-jakarta">
                  Font Selection
                </label>
                <select
                  className="w-full rounded-2xl border border-white/10 bg-[#090C15] text-slate-100 min-h-[44px] text-xs px-3.5 focus:border-[#FF6D00] focus:outline-none cursor-pointer font-extrabold shadow-inner"
                  value={captionFontFamily || "preset"}
                  onChange={(e) => { if (onCaptionFontFamilyChange) onCaptionFontFamilyChange(e.target.value); }}
                >
                  <option value="preset">Preset Default Font</option>
                  <option value="Montserrat, sans-serif">Montserrat (Popular Creator)</option>
                  <option value="Impact, sans-serif">The Bold Font / Impact (Viral)</option>
                  <option value="'Komika Axis', sans-serif">Komika Axis (Comic Kinetic)</option>
                  <option value="'Bebas Neue', sans-serif">Bebas Neue (Tall Punchy)</option>
                  <option value="Anton, sans-serif">Anton (Headline Heavy)</option>
                  <option value="Inter, sans-serif">Inter (Clean Modern)</option>
                  <option value="Oswald, sans-serif">Oswald (Condensed)</option>
                  <option value="'League Spartan', sans-serif">League Spartan (Fitness)</option>
                  <option value="'Permanent Marker', cursive">Permanent Marker (Casual)</option>
                </select>
              </div>

              {/* 3. Audio & Subtitle Language */}
              <div className="space-y-2">
                <label className="text-[11px] font-extrabold uppercase tracking-wider text-slate-300 block font-jakarta">
                  Audio Language
                </label>
                <div className="grid grid-cols-2 gap-1.5 p-1.5 rounded-2xl bg-[#090C15] border border-white/10">
                  {[
                    { id: "en", label: "English" },
                    { id: "hinglish", label: "Hinglish" },
                  ].map((lang) => {
                    const isCur = (spokenLanguage || "en") === lang.id;
                    return (
                      <button
                        key={lang.id}
                        type="button"
                        onClick={() => {
                          if (onSpokenLanguageChange) onSpokenLanguageChange(lang.id);
                          if (onCaptionLanguageChange) onCaptionLanguageChange(lang.id);
                        }}
                        className={`min-h-[38px] rounded-xl text-xs font-extrabold transition-all cursor-pointer flex items-center justify-center ${
                          isCur
                            ? "bg-gradient-to-r from-[#FF6D00] to-[#FF8F00] text-black shadow-md shadow-[#FF6D00]/25 scale-[1.02]"
                            : "text-slate-400 hover:text-white hover:bg-white/5"
                        }`}
                      >
                        {lang.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 3. Text Casing & Word Sync */}
              <div className="space-y-2">
                <label className="text-[11px] font-extrabold uppercase tracking-wider text-slate-300 block font-jakarta">
                  Casing &amp; Word Sync
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {/* Casing Toggle */}
                  <button
                    type="button"
                    onClick={() => {
                      if (onYoutubeSubtitleCaseChange) {
                        onYoutubeSubtitleCaseChange(youtubeSubtitleCase === "uppercase" ? "natural" : "uppercase");
                      }
                    }}
                    className={`min-h-[44px] rounded-2xl border px-3 py-1.5 text-xs font-black transition cursor-pointer flex items-center justify-center gap-1.5 ${
                      youtubeSubtitleCase === "uppercase"
                        ? "bg-[#FF6D00]/15 border-[#FF6D00]/40 text-[#FF8F00] shadow-sm"
                        : "bg-[#090C15] border-white/10 text-slate-400 hover:text-white"
                    }`}
                  >
                    <span>{youtubeSubtitleCase === "uppercase" ? "ALL CAPS" : "Normal Case"}</span>
                  </button>

                  {/* Word Highlight Toggle */}
                  <button
                    type="button"
                    onClick={() => {
                      if (onHighlightActiveWordChange) {
                        onHighlightActiveWordChange(!highlightActiveWord);
                      }
                    }}
                    className={`min-h-[44px] rounded-2xl border px-3 py-1.5 text-xs font-black transition cursor-pointer flex items-center justify-center gap-1.5 ${
                      highlightActiveWord
                        ? "bg-emerald-500/15 border-emerald-500/40 text-emerald-400 shadow-sm"
                        : "bg-[#090C15] border-white/10 text-slate-400 hover:text-white"
                    }`}
                  >
                    <span>Highlight: {highlightActiveWord ? "ON" : "OFF"}</span>
                  </button>
                </div>
              </div>
            </div>

            {/* ── ROW 2: Custom Color Pickers & Quick Palettes (Stacked & Spacious) ── */}
            <div className="space-y-5 pt-1">
              {/* Custom Color Pickers Section */}
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-extrabold uppercase tracking-wider text-slate-200 block font-jakarta">
                    Custom Color Pickers
                  </label>
                  <span className="text-[10px] font-extrabold text-slate-400">
                    Live Hex Accent Customizer
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                  {/* 1. Text Color */}
                  <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-[#090C15] p-3 shadow-inner hover:border-[#FF6D00]/40 transition">
                    <input
                      type="color"
                      value={toValidHex(captionTextColor, "#FFFFFF")}
                      onChange={(e) => onCaptionTextColorChange(e.target.value)}
                      className="h-9 w-9 rounded-xl border-0 cursor-pointer bg-transparent shrink-0 shadow-md"
                      title="Text Color"
                    />
                    <div className="flex flex-col min-w-0">
                      <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider">
                        Text Color
                      </span>
                      <span className="font-mono text-xs font-black text-white uppercase tracking-wider">
                        {toValidHex(captionTextColor, "#FFFFFF")}
                      </span>
                    </div>
                  </div>

                  {/* 2. Highlight Color */}
                  <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-[#090C15] p-3 shadow-inner hover:border-[#FF6D00]/40 transition">
                    <input
                      type="color"
                      value={toValidHex(captionHighlightColor, "#FF6D00")}
                      onChange={(e) => onCaptionHighlightColorChange(e.target.value)}
                      className="h-9 w-9 rounded-xl border-0 cursor-pointer bg-transparent shrink-0 shadow-md"
                      title="Highlight Color"
                    />
                    <div className="flex flex-col min-w-0">
                      <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider">
                        Highlight Color
                      </span>
                      <span className="font-mono text-xs font-black text-[#FF8F00] uppercase tracking-wider">
                        {toValidHex(captionHighlightColor, "#FF6D00")}
                      </span>
                    </div>
                  </div>

                  {/* 3. Background Color */}
                  <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-[#090C15] p-3 shadow-inner hover:border-[#FF6D00]/40 transition">
                    <input
                      type="color"
                      value={toValidHex(captionBackgroundColor, "#18181B")}
                      onChange={(e) => {
                        if (onCaptionBackgroundColorChange) onCaptionBackgroundColorChange(e.target.value);
                      }}
                      className="h-9 w-9 rounded-xl border-0 cursor-pointer bg-transparent shrink-0 shadow-md"
                      title="Background Color"
                    />
                    <div className="flex flex-col min-w-0">
                      <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider">
                        Background Color
                      </span>
                      <span className="font-mono text-xs font-black text-slate-200 uppercase tracking-wider">
                        {toValidHex(captionBackgroundColor, "#18181B")}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Color Palettes Section (Separated) */}
              <div className="space-y-2.5 pt-4 border-t border-white/10">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-extrabold uppercase tracking-wider text-slate-200 block font-jakarta">
                    Quick Color Palettes
                  </label>
                  <span className="text-[10px] font-bold text-slate-400">
                    1-Click Preset Combos
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-2.5">
                  {[
                    { name: "Viral Orange", text: "#FFFFFF", highlight: "#FF6D00", bg: "#000000", colorDot: "#FF6D00" },
                    { name: "Hot Pink", text: "#FFFFFF", highlight: "#FF2A85", bg: "#12131A", colorDot: "#FF2A85" },
                    { name: "Cyber Gold", text: "#FFFFFF", highlight: "#FACC15", bg: "#18181B", colorDot: "#FACC15" },
                    { name: "Neon Mint", text: "#FFFFFF", highlight: "#00FF9D", bg: "#0A0D14", colorDot: "#00FF9D" },
                    { name: "Electric Cyan", text: "#FFFFFF", highlight: "#00E5FF", bg: "#080B12", colorDot: "#00E5FF" },
                  ].map((theme) => (
                    <button
                      key={theme.name}
                      type="button"
                      onClick={() => {
                        onCaptionTextColorChange(theme.text);
                        onCaptionHighlightColorChange(theme.highlight);
                        if (onCaptionBackgroundColorChange) onCaptionBackgroundColorChange(theme.bg);
                      }}
                      className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-[#090C15] hover:bg-[#161A28] hover:border-[#FF6D00]/40 px-3.5 py-2 text-xs font-extrabold text-slate-200 transition cursor-pointer active:scale-95 shadow-sm"
                    >
                      <span className="h-3 w-3 rounded-full shrink-0 shadow-sm" style={{ backgroundColor: theme.colorDot }} />
                      <span>{theme.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>



          {/* Style preview gallery */}
          <div className="space-y-3">
            <AutoCaptionStyleCarousel
              selectedPresetKey={captionStyle}
              onSelectPreset={chooseCaptionStyle}
              onHighlightColorChange={onCaptionHighlightColorChange}
              mode="shorts"
            />
          </div>
        </div>

      ) : (
      /* ═══════════════════════════════════════════════════════════════════
          POST-UPLOAD STATE — Full Editor Canvas (split-pane)
      ═══════════════════════════════════════════════════════════════════ */
        <div className="space-y-6">

          {/* Duration / word count badge */}
          {mediaDurationSeconds > 0 && (
            <div className="rounded-2xl border border-[#FF6D00]/30 bg-[#FF6D00]/5 px-4 py-2.5 text-xs flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <Activity size={15} className="text-[#FF8F00]" />
                <span className="text-zinc-200 font-bold">
                  Duration: <NumberTicker value={Math.round(mediaDurationSeconds)} />s (~<NumberTicker value={estimatedWordCount} /> words)
                </span>
              </div>
              <div className="flex items-center gap-3">
                <AudioSpectrumVisualizer isPlaying={Boolean(selectedFile)} isTranscribing={isTranscribing} />
                <span className="font-black text-[#FF8F00] uppercase text-[11px] bg-[#FF6D00]/10 px-2.5 py-1 rounded-full border border-[#FF6D00]/30">
                  1080p Full HD
                </span>
              </div>
            </div>
          )}

          {/* ── File upload zone — compact version post-upload ── */}
          <div
            onClick={() => fileInputRef.current?.click()}
            onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); }}
            onDrop={(e) => {
              e.preventDefault();
              e.stopPropagation();
              if (e.dataTransfer.files?.[0]) onSelectFile(e.dataTransfer.files[0]);
            }}
            className="w-full flex items-center justify-between gap-3 rounded-2xl border border-white/10 hover:border-[#FF6D00]/50 bg-[#161720] p-3.5 transition-all cursor-pointer group"
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 shrink-0">
                <FileVideo size={16} />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-extrabold text-slate-100 truncate">{selectedFile.name}</span>
                  <span className="rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-bold px-2 py-0.5 shrink-0">Ready</span>
                </div>
                <p className="text-[11px] text-slate-400 mt-0.5">{(selectedFile.size / (1024 * 1024)).toFixed(1)} MB · Click to change file</p>
              </div>
            </div>
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); onSelectFile(null); }}
              className="rounded-xl border border-white/10 bg-[#0E1020] hover:bg-red-500/10 hover:border-red-500/30 hover:text-red-400 px-3 py-1.5 text-[11px] font-bold text-slate-300 transition shrink-0"
            >
              Remove
            </button>
          </div>

          {/* Language Controls */}
          <div className="rounded-[22px] border border-white/10 bg-[#161720] p-4 space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <div className="space-y-1.5">
                <div className="flex items-center gap-1.5 text-slate-300 text-[11px] font-bold uppercase tracking-wider">
                  <Globe size={13} className="text-[#FF8F00]" />
                  <span>Spoken Language</span>
                </div>
                <select
                  value={spokenLanguage || "auto"}
                  onChange={(e) => { if (onSpokenLanguageChange) onSpokenLanguageChange(e.target.value); }}
                  className="w-full bg-[#090A0F] text-white text-xs font-bold rounded-xl border border-white/10 px-2.5 py-2 focus:border-[#FF6D00] focus:outline-none cursor-pointer"
                >
                  {AUDIO_SPOKEN_LANGUAGES.map((lang) => (
                    <option key={lang.id} value={lang.id} className="bg-[#090A0F] text-white">{lang.label}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-1.5">
                <div className="flex items-center gap-1.5 text-slate-300 text-[11px] font-bold uppercase tracking-wider">
                  <Layers size={13} className="text-[#FFA726]" />
                  <span>Subtitle Language</span>
                </div>
                <select
                  value={captionLanguage || "same"}
                  onChange={(e) => { if (onCaptionLanguageChange) onCaptionLanguageChange(e.target.value); }}
                  className="w-full bg-[#090A0F] text-white text-xs font-bold rounded-xl border border-white/10 px-2.5 py-2 focus:border-[#FF6D00] focus:outline-none cursor-pointer"
                >
                  {SUBTITLE_OUTPUT_LANGUAGES.map((lang) => (
                    <option key={lang.id} value={lang.id} className="bg-[#090A0F] text-white">{lang.label}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Transcript Word Replacer */}
          <AutoCaptionWordReplacer
            transcript={editedTranscript}
            isTranscribing={isTranscribing}
            onTranscriptChange={(newText) => {
              if (onEditedTranscriptChange) onEditedTranscriptChange(newText);
              if (onPreviewCaptionsChange) {
                onPreviewCaptionsChange([{ start: 0, end: mediaDurationSeconds || 60, text: newText }]);
              }
            }}
          />

          {/* Style gallery — bottom, full-width */}
          <div className="w-full pt-4 border-t border-white/10 space-y-3">
            <AutoCaptionStyleCarousel
              selectedPresetKey={captionStyle}
              onSelectPreset={chooseCaptionStyle}
              onHighlightColorChange={onCaptionHighlightColorChange}
              mode="shorts"
            />
          </div>
        </div>
      )}
    </div>
  );
}

// ── Media Type Detection Helper ──

function getFileMediaType(file: File): "audio" | "video" | "image" {
  const type = file.type || "";
  const name = file.name.toLowerCase();

  if (type.startsWith("image/") || /\.(jpg|jpeg|png|webp)$/i.test(name)) return "image";
  if (type.startsWith("audio/") || /\.(mp3|wav|m4a|aac|ogg|flac)$/i.test(name)) return "audio";
  return "video";
}

// ── Client-Side SRT / VTT Subtitle Exporter ──

function exportSubtitlesAsSRTOrVTT(
  captions: Array<{ start: number; end: number; text: string }> | null,
  transcript: string,
  fileName: string,
  format: "srt" | "vtt" = "srt"
) {
  let content = "";
  if (captions && captions.length > 0) {
    if (format === "vtt") {
      content += "WEBVTT\n\n";
    }
    captions.forEach((cap, idx) => {
      const startStr = formatTimestamp(cap.start, format);
      const endStr = formatTimestamp(cap.end, format);
      content += `${idx + 1}\n${startStr} --> ${endStr}\n${cap.text}\n\n`;
    });
  } else if (transcript) {
    if (format === "vtt") content += "WEBVTT\n\n";
    content += `1\n00:00:00,000 --> 00:05:00,000\n${transcript}\n\n`;
  } else {
    alert("No captions available to export yet. Please upload video first.");
    return;
  }

  const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${fileName.replace(/\.[^/.]+$/, "") || "subtitles"}.${format}`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function formatTimestamp(seconds: number, format: "srt" | "vtt"): string {
  const pad = (num: number, size: number) => String(num).padStart(size, "0");
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);
  const ms = Math.floor((seconds % 1) * 1000);
  const sep = format === "srt" ? "," : ".";
  return `${pad(hrs, 2)}:${pad(mins, 2)}:${pad(secs, 2)}${sep}${pad(ms, 3)}`;
}
