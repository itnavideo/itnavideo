"use client";

import React, { ChangeEvent, useMemo, useEffect, useState, useRef } from "react";
import {
  Sparkles,
  Clock3,
  Zap,
  Upload,
  SlidersHorizontal,
  Globe,
  FileVideo,
  Activity,
  Layers,
  CheckCircle2,
  Loader2,
  AlertCircle,
  RotateCcw,
  Search,
  X,
  Type,
  Palette,
  Check,
  Plus,
  Play,
  Volume2,
  VolumeX,
} from "lucide-react";
import { BorderBeam } from "@/components/magicui/BorderBeam";
import { StudioWorkflowRoadmap } from "@/components/dashboard/StudioWorkflowRoadmap";
import { NumberTicker } from "@/components/magicui/NumberTicker";
import { AudioSpectrumVisualizer } from "@/components/dashboard/AudioSpectrumVisualizer";
import { AutoCaptionWordReplacer } from "@/components/dashboard/AutoCaptionWordReplacer";
import { SUBTITLE_PRESETS } from "@/remotion/types/subtitles";

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
  theme?: "light" | "dark";
}

import {
  WHITESTAIR_TEMPLATES,
  type WhiteStairCard,
  getWhiteStairTemplate,
} from "@/lib/captions/whiteStairTemplates";

// ── WhiteStair Dynamic Templates (Vertical Cards) ──
interface DynamicTemplateCard {
  id: string;
  name: string;
  presetKey: string;
  badgeText: string;
  subtitle: string;
  accentColor: string;
}

const DYNAMIC_TEMPLATES: DynamicTemplateCard[] = [
  { id: "dyn-estate", name: "Estate", presetKey: "Estate", badgeText: "DYNAMIC", subtitle: "Real estate lower thirds", accentColor: "#F59E0B" },
  { id: "dyn-classic", name: "Classic", presetKey: "Minimal Clean", badgeText: "DYNAMIC", subtitle: "Modern walking subtitles", accentColor: "#3B82F6" },
  { id: "dyn-creator", name: "Creator", presetKey: "Creator 3", badgeText: "DYNAMIC", subtitle: "Hormozi kinetic pop", accentColor: "#10B981" },
  { id: "dyn-simple", name: "Simple", presetKey: "Shorts Karaoke", badgeText: "DYNAMIC", subtitle: "Karaoke word highlight", accentColor: "#06B6D4" },
  { id: "dyn-doctor", name: "Doctor", presetKey: "Ali Abdaal Clean Pill", badgeText: "DYNAMIC", subtitle: "Medical / education pill", accentColor: "#14B8A6" },
  { id: "dyn-luxe", name: "Luxe", presetKey: "Devane Luxury Serif", badgeText: "DYNAMIC", subtitle: "High-end luxury serif", accentColor: "#EC4899" },
  { id: "dyn-script", name: "Script Mix", presetKey: "Cursive", badgeText: "DYNAMIC", subtitle: "Dynamic script & bold", accentColor: "#8B5CF6" },
  { id: "dyn-scribble", name: "Scribble", presetKey: "Typewriter", badgeText: "DYNAMIC", subtitle: "Handwritten kinetic notes", accentColor: "#F97316" },
];

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
  captionBackgroundColor,
  onCaptionBackgroundColorChange,
  spokenLanguage = "auto",
  onSpokenLanguageChange,
  captionLanguage = "same",
  onCaptionLanguageChange,
  wordClickSound = true,
  onWordClickSoundChange,
  captionEmphasisAnimation = "bounce",
  onCaptionEmphasisAnimationChange,
  youtubeSubtitleSafeZone = "standard",
  onYoutubeSubtitleSafeZoneChange,
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
  theme = "light",
}: AutoCaptionStudioProps) {
  // 3 WhiteStair Tabs: Edit | Templates | Transitions (Script)
  const [activeTab, setActiveTab] = useState<"edit" | "templates" | "script">("templates");
  const [templateSearch, setTemplateSearch] = useState<string>("");

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [transcribeError, setTranscribeError] = useState<string | null>(null);
  const [aspectRatioError, setAspectRatioError] = useState<string | null>(null);

  // Auto-detect media duration and aspect ratio
  useEffect(() => {
    if (!selectedFile) {
      setAspectRatioError(null);
      return;
    }

    const isVideo = selectedFile.type.startsWith("video/") || /\.(mp4|mov|webm)$/i.test(selectedFile.name);
    const isAudio = selectedFile.type.startsWith("audio/") || /\.(mp3|wav|m4a|aac)$/i.test(selectedFile.name);

    if (isVideo || isAudio) {
      const url = URL.createObjectURL(selectedFile);
      const element = isVideo ? document.createElement("video") : document.createElement("audio");
      element.src = url;
      element.preload = "metadata";

      const handleLoadedMetadata = () => {
        const d = element.duration || 0;
        let aspect = "portrait";

        if (isVideo) {
          const v = element as HTMLVideoElement;
          const width = v.videoWidth || 1080;
          const height = v.videoHeight || 1920;
          aspect = width > height ? "landscape" : "portrait";

          if (width > height && mode === "autoCaption") {
            setAspectRatioError(
              `Detected 16:9 widescreen video (${width}×${height}). Auto Caption Studio renders 9:16 vertical reels. For YouTube widescreen videos, please use YouTube Subtitles Generator.`
            );
          } else {
            setAspectRatioError(null);
          }
        } else {
          setAspectRatioError(null);
        }

        onMediaMetaChange({ durationSeconds: d, mediaAspect: aspect });
        URL.revokeObjectURL(url);
      };

      element.addEventListener("loadedmetadata", handleLoadedMetadata);
      return () => {
        element.removeEventListener("loadedmetadata", handleLoadedMetadata);
        URL.revokeObjectURL(url);
      };
    }
  }, [selectedFile, mode, onMediaMetaChange]);

  // Fast cloud transcription via Groq Whisper API
  const handleTranscribeMedia = async () => {
    if (!selectedFile) return;
    setIsTranscribing(true);
    setTranscribeError(null);

    try {
      const formData = new FormData();
      formData.append("file", selectedFile);
      formData.append("fileName", selectedFile.name);
      if (spokenLanguage && spokenLanguage !== "auto") {
        formData.append("spokenLanguage", spokenLanguage);
      }

      const res = await fetch("/api/reels/transcribe", {
        method: "POST",
        body: formData,
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.ok) {
        throw new Error(data.error || "Groq Whisper transcription failed.");
      }

      const transcriptText = data.transcript || "";
      if (onEditedTranscriptChange) {
        onEditedTranscriptChange(transcriptText);
      }

      if (onPreviewCaptionsChange) {
        const segs =
          Array.isArray(data.segments) && data.segments.length > 0
            ? data.segments.map((s: any) => ({
                start: s.start ?? 0,
                end: s.end ?? 0,
                text: s.text ?? "",
                words: s.words ?? [],
              }))
            : [{ start: 0, end: mediaDurationSeconds || 60, text: transcriptText, words: data.words || [] }];
        onPreviewCaptionsChange(segs);
      }
    } catch (err: any) {
      console.error("Transcribe error:", err);
      setTranscribeError(err?.message || "Transcription failed. Please try again.");
    } finally {
      setIsTranscribing(false);
    }
  };

  const hasTranscribed = Boolean(editedTranscript && editedTranscript.trim().length > 0);

  // Filter templates by search query
  const filteredTemplates = useMemo(() => {
    if (!templateSearch.trim()) return WHITESTAIR_TEMPLATES;
    const query = templateSearch.toLowerCase().trim();
    return WHITESTAIR_TEMPLATES.filter(
      (t) => t.name.toLowerCase().includes(query) || t.presetKey.toLowerCase().includes(query)
    );
  }, [templateSearch]);

  const handleCardClick = (card: WhiteStairCard) => {
    if (card.isCustom) {
      setActiveTab("edit");
      return;
    }
    const targetKey = card.id || card.presetKey;
    onCaptionStyleChange(targetKey);
  };

  const isLight = theme === "light";

  return (
    <div
      className={`relative rounded-[28px] border p-4 sm:p-6 shadow-2xl min-w-0 max-w-full overflow-x-hidden space-y-5 transition-all ${
        isLight
          ? "bg-white border-slate-200/90 text-slate-900 shadow-slate-200/50"
          : "bg-[#0E1526] border-white/10 text-white"
      }`}
    >
      {/* Magic UI BorderBeam Glowing Effect */}
      <BorderBeam size={280} duration={14} colorFrom="#FF5722" colorTo="#FFA000" />

      {/* ── WhiteStair Caption Style Header ── */}
      <div
        className={`flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b pb-4 ${
          isLight ? "border-slate-200" : "border-white/10"
        }`}
      >
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-tr from-[#FF5722] via-[#FF7043] to-[#FFA000] text-white shadow-lg shadow-[#FF5722]/25">
            <Sparkles size={20} className="fill-white/20" />
          </div>
          <div>
            <h2
              className={`text-lg sm:text-xl font-black tracking-tight font-jakarta ${
                isLight ? "text-slate-900" : "text-white"
              }`}
            >
              Caption Style
            </h2>
            <p className={`text-xs font-medium ${isLight ? "text-slate-500" : "text-slate-400"}`}>
              Pick template, customize fonts, or review script
            </p>
          </div>
        </div>

        {/* 3 WhiteStair Tabs Switcher: [ Edit ] | [ Templates ] | [ Script & Words ] */}
        <div
          className={`flex items-center p-1 rounded-2xl border shrink-0 ${
            isLight ? "bg-slate-100 border-slate-200" : "bg-[#070B14] border-white/10"
          }`}
        >
          <button
            type="button"
            onClick={() => setActiveTab("edit")}
            className={`px-4 py-2 rounded-xl text-xs font-black transition cursor-pointer flex items-center gap-1.5 ${
              activeTab === "edit"
                ? "bg-gradient-to-r from-[#FF5722] to-[#FFA000] text-white shadow-md shadow-[#FF5722]/25 scale-[1.02]"
                : isLight
                ? "text-slate-600 hover:text-slate-900 hover:bg-slate-200/50"
                : "text-slate-400 hover:text-white hover:bg-white/5"
            }`}
          >
            <SlidersHorizontal size={13} />
            <span>Edit</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("templates")}
            className={`px-5 py-2 rounded-xl text-xs font-black transition cursor-pointer flex items-center gap-1.5 ${
              activeTab === "templates"
                ? "bg-gradient-to-r from-[#FF5722] to-[#FFA000] text-white shadow-md shadow-[#FF5722]/25 scale-[1.02]"
                : isLight
                ? "text-slate-600 hover:text-slate-900 hover:bg-slate-200/50"
                : "text-slate-400 hover:text-white hover:bg-white/5"
            }`}
          >
            <Layers size={13} />
            <span>Templates</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("script")}
            className={`px-4 py-2 rounded-xl text-xs font-black transition cursor-pointer flex items-center gap-1.5 ${
              activeTab === "script"
                ? "bg-gradient-to-r from-[#FF5722] to-[#FFA000] text-white shadow-md shadow-[#FF5722]/25 scale-[1.02]"
                : isLight
                ? "text-slate-600 hover:text-slate-900 hover:bg-slate-200/50"
                : "text-slate-400 hover:text-white hover:bg-white/5"
            }`}
          >
            <Type size={13} />
            <span>Script &amp; Words</span>
            {hasTranscribed && <span className="h-2 w-2 rounded-full bg-emerald-500 shrink-0 animate-pulse" />}
          </button>
        </div>
      </div>

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
            className="shrink-0 rounded-xl bg-[#FF5722] px-3.5 py-2 text-xs font-black text-black hover:brightness-110 transition shadow-md"
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

      {/* File Upload Dropzone (When No File Is Uploaded) */}
      {!selectedFile ? (
        <div
          onClick={() => fileInputRef.current?.click()}
          onDragOver={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
          onDrop={(e) => {
            e.preventDefault();
            e.stopPropagation();
            if (e.dataTransfer.files?.[0]) onSelectFile(e.dataTransfer.files[0]);
          }}
          className="flex flex-col items-center justify-center gap-3 rounded-[24px] border-2 border-dashed border-white/15 hover:border-[#FF5722]/60 bg-[#070B14] hover:bg-[#131B2E] p-6 text-center transition-all cursor-pointer group shadow-inner"
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-[#FF5722]/30 bg-[#FF5722]/10 text-[#FF9100] group-hover:scale-110 transition shadow-lg">
            <FileVideo size={24} />
          </div>
          <div className="space-y-0.5">
            <p className="text-sm font-black text-white font-jakarta">Upload 9:16 Reel or Short Video</p>
            <p className="text-xs text-slate-400">Drag &amp; drop or click to browse (MP4, MOV, Audio • Up to 90s)</p>
          </div>
        </div>
      ) : (
        /* Compact Active File Header Bar */
        <div
          className={`flex items-center justify-between gap-3 rounded-2xl border p-3 shadow-sm ${
            isLight ? "bg-slate-50 border-slate-200" : "bg-[#131B2E] border-white/10"
          }`}
        >
          <div className="flex items-center gap-3 min-w-0">
            <div
              className={`flex h-9 w-9 items-center justify-center rounded-xl border shrink-0 ${
                isLight
                  ? "border-emerald-300 bg-emerald-50 text-emerald-600"
                  : "border-emerald-500/30 bg-emerald-500/10 text-emerald-400"
              }`}
            >
              <FileVideo size={16} />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className={`text-xs font-black truncate ${isLight ? "text-slate-900" : "text-white"}`}>
                  {selectedFile.name}
                </span>
                <span
                  className={`rounded-md border text-[9px] font-black px-1.5 py-0.5 uppercase ${
                    isLight
                      ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                      : "bg-emerald-500/15 text-emerald-400 border-emerald-500/30"
                  }`}
                >
                  {hasTranscribed ? "Transcribed" : "Uploaded"}
                </span>
              </div>
              <p className={`text-[11px] ${isLight ? "text-slate-500" : "text-slate-400"}`}>
                {(selectedFile.size / (1024 * 1024)).toFixed(1)} MB • {Math.round(mediaDurationSeconds || 0)}s duration
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className={`rounded-xl border px-3 py-1.5 text-xs font-bold transition shrink-0 cursor-pointer ${
              isLight
                ? "border-slate-200 bg-white hover:bg-slate-100 text-slate-700 shadow-2xs"
                : "border-white/10 bg-[#070B14] hover:bg-white/10 text-slate-300"
            }`}
          >
            Change
          </button>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════════════════════
          TAB 1: TEMPLATES (WhiteStair Style Typography Cards Grid + DYNAMIC Section)
         ══════════════════════════════════════════════════════════════════════════════════ */}
      {activeTab === "templates" && (
        <div className="space-y-6">
          {/* Quick Search */}
          <div className="relative">
            <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search 40+ caption templates (e.g. Classic, Solo, Crazy, Hormozi)..."
              value={templateSearch}
              onChange={(e) => setTemplateSearch(e.target.value)}
              className={`w-full rounded-2xl border pl-10 pr-9 py-2.5 text-xs font-semibold placeholder-slate-400 focus:border-[#FF5722] focus:outline-none transition shadow-inner ${
                isLight
                  ? "border-slate-200 bg-slate-50 text-slate-900 focus:bg-white"
                  : "border-white/10 bg-[#070B14] text-white"
              }`}
            />
            {templateSearch && (
              <button
                type="button"
                onClick={() => setTemplateSearch("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white p-1"
              >
                <X size={13} />
              </button>
            )}
          </div>

          {/* WhiteStair Grid of Square Black Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-5 gap-3 max-h-[580px] overflow-y-auto pr-1 custom-scrollbar">
            {filteredTemplates.map((card) => {
              const isSelected =
                (captionStyle === card.id ||
                  captionStyle === card.presetKey ||
                  captionStyle.toLowerCase() === card.name.toLowerCase()) &&
                !card.isCustom;

              return (
                <div
                  key={card.id}
                  onClick={() => handleCardClick(card)}
                  className={`group relative flex flex-col justify-between rounded-2xl border p-3 min-h-[115px] sm:min-h-[125px] cursor-pointer transition-all duration-200 select-none ${
                    isSelected
                      ? "border-2 border-[#FF5722] bg-[#141C30] ring-4 ring-[#FF5722]/20 shadow-xl shadow-[#FF5722]/25 scale-[1.02]"
                      : "border-white/10 bg-[#070B14] hover:border-[#FF5722]/60 hover:bg-[#101726] hover:-translate-y-0.5"
                  }`}
                >
                  {/* Selected check badge */}
                  {isSelected && (
                    <div className="absolute top-2 right-2 flex h-5 w-5 items-center justify-center rounded-full bg-[#FF5722] text-black shadow-md z-10">
                      <Check size={11} strokeWidth={3.5} />
                    </div>
                  )}

                  {/* Card Content Stage */}
                  <div className="flex-1 flex flex-col items-center justify-center text-center px-1">
                    {card.isCustom ? (
                      <div className="flex flex-col items-center justify-center gap-1.5 py-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded-xl border border-dashed border-white/30 text-white/60 group-hover:border-[#FF5722] group-hover:text-[#FF7043] transition">
                          <Plus size={16} />
                        </div>
                        <span className="text-[11px] font-black text-white">Custom Theme</span>
                        <span className="text-[9px] text-slate-400">Create your own</span>
                      </div>
                    ) : card.isCrossed ? (
                      <div className="flex flex-col items-center justify-center gap-1 py-2 text-slate-400">
                        <X size={24} className="text-slate-500" />
                        <span className="text-[11px] font-bold">No Caption</span>
                      </div>
                    ) : (
                      <div className="flex flex-wrap items-center justify-center gap-1 leading-snug">
                        {card.words?.map((w, wIdx) => (
                          <span
                            key={wIdx}
                            style={{
                              color: w.color || "#FFFFFF",
                              backgroundColor: w.bg || "transparent",
                              fontStyle: w.italic ? "italic" : "normal",
                              fontWeight: w.bold ? 800 : 500,
                              textShadow: w.glow ? `0 0 10px ${w.glow}` : undefined,
                              borderRadius: w.pill ? "6px" : undefined,
                              padding: w.pill ? "1px 5px" : undefined,
                              textDecoration: w.underline ? "underline" : undefined,
                              fontFamily: w.font || undefined,
                            }}
                            className="text-xs tracking-tight"
                          >
                            {w.text}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Card Footer: Template Name & Indicators */}
                  {!card.isCustom && (
                    <div className="pt-2 border-t border-white/5 flex items-center justify-between">
                      <span className="text-[11px] font-black text-slate-200 truncate font-jakarta">
                        {card.name}
                      </span>
                      {card.hasDots && (
                        <div className="flex items-center gap-0.5">
                          <span className="h-1.5 w-1.5 rounded-full bg-slate-500" />
                          <span className="h-1.5 w-1.5 rounded-full bg-[#FF7043]" />
                          <span className="h-1.5 w-1.5 rounded-full bg-slate-500" />
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* ── WhiteStair "DYNAMIC" Section ── */}
          <div className="pt-4 border-t border-white/10 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="rounded-lg bg-gradient-to-r from-purple-500 to-indigo-500 px-2 py-0.5 text-[10px] font-black text-white tracking-wider uppercase shadow-sm">
                  DYNAMIC
                </span>
                <span className="text-xs text-slate-300 font-medium">The composition changes on the spoken words</span>
              </div>
            </div>

            {/* Vertical Phone Cards Row */}
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-4 lg:grid-cols-4 gap-3">
              {DYNAMIC_TEMPLATES.map((dyn) => {
                const isSelected = captionStyle === dyn.presetKey;
                return (
                  <div
                    key={dyn.id}
                    onClick={() => onCaptionStyleChange(dyn.presetKey)}
                    className={`group relative flex flex-col justify-between rounded-2xl border p-3.5 min-h-[140px] cursor-pointer transition-all duration-200 select-none overflow-hidden ${
                      isSelected
                        ? "border-2 border-purple-500 bg-[#161226] ring-4 ring-purple-500/25 shadow-xl scale-[1.02]"
                        : "border-white/10 bg-[#070B14] hover:border-purple-500/50 hover:bg-[#120F20]"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="rounded-md bg-purple-500/20 text-purple-300 border border-purple-500/30 text-[9px] font-black px-2 py-0.5 uppercase tracking-wider">
                        {dyn.badgeText}
                      </span>
                      {isSelected && (
                        <div className="flex h-5 w-5 items-center justify-center rounded-full bg-purple-500 text-white shadow-md">
                          <Check size={11} strokeWidth={3.5} />
                        </div>
                      )}
                    </div>

                    <div className="my-auto py-2">
                      <p className="text-sm font-black text-white font-jakarta">{dyn.name}</p>
                      <p className="text-[10px] text-slate-400 mt-0.5">{dyn.subtitle}</p>
                    </div>

                    <div className="h-1 w-full rounded-full bg-white/10 overflow-hidden">
                      <div className="h-full rounded-full bg-gradient-to-r from-purple-500 to-indigo-400" style={{ width: "65%" }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════════════════════
          TAB 2: EDIT (Position, Font, Size, Casing, Colors, Pop SFX)
         ══════════════════════════════════════════════════════════════════════════════════ */}
      {activeTab === "edit" && (
        <div
          className={`rounded-[24px] border p-5 sm:p-6 space-y-6 shadow-xl ${
            isLight
              ? "bg-slate-50/80 border-slate-200 text-slate-900"
              : "bg-[#131B2E] border-white/10 text-white shadow-2xl"
          }`}
        >
          {/* Row 1: Position, Font, Size, Casing */}
          <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pb-5 border-b ${isLight ? "border-slate-200" : "border-white/10"}`}>
            {/* Caption Position */}
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-wider text-slate-200 block font-jakarta">
                Caption Position
              </label>
              <div className="grid grid-cols-3 gap-1.5 p-1 rounded-2xl bg-[#070B14] border border-white/10">
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
                      className={`min-h-[38px] rounded-xl text-xs font-black transition-all cursor-pointer flex items-center justify-center ${
                        isCur
                          ? "bg-gradient-to-r from-[#FF5722] to-[#FFA000] text-black shadow-md shadow-[#FF5722]/25 scale-[1.02]"
                          : "text-slate-400 hover:text-white hover:bg-white/5"
                      }`}
                    >
                      {pos.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Font Selection */}
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-wider text-slate-200 block font-jakarta">
                Font Selection
              </label>
              <select
                className="w-full rounded-2xl border border-white/10 bg-[#070B14] text-white min-h-[44px] text-xs px-3.5 focus:border-[#FF5722] focus:outline-none cursor-pointer font-bold shadow-inner"
                value={captionFontFamily || "preset"}
                onChange={(e) => {
                  if (onCaptionFontFamilyChange) onCaptionFontFamilyChange(e.target.value);
                }}
              >
                <option value="preset">Preset Default Font</option>
                <option value="Montserrat, sans-serif">Montserrat (Creator Standard)</option>
                <option value="Impact, sans-serif">The Bold Font / Impact (Viral)</option>
                <option value="'Komika Axis', sans-serif">Komika Axis (Comic Kinetic)</option>
                <option value="'Bebas Neue', sans-serif">Bebas Neue (Tall Punchy)</option>
                <option value="Anton, sans-serif">Anton (Headline Heavy)</option>
                <option value="Inter, sans-serif">Inter (Clean Modern)</option>
                <option value="Oswald, sans-serif">Oswald (Condensed)</option>
                <option value="'Permanent Marker', cursive">Permanent Marker (Casual)</option>
              </select>
            </div>

            {/* Font Size */}
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-wider text-slate-200 block font-jakarta">
                Font Size
              </label>
              <div className="grid grid-cols-4 gap-1 p-1 rounded-2xl bg-[#070B14] border border-white/10">
                {(["small", "medium", "large", "xlarge"] as const).map((sz) => {
                  const isCur = captionFontSize === sz;
                  return (
                    <button
                      key={sz}
                      type="button"
                      onClick={() => onCaptionFontSizeChange && onCaptionFontSizeChange(sz)}
                      className={`min-h-[38px] rounded-xl text-xs font-black transition cursor-pointer flex items-center justify-center uppercase ${
                        isCur
                          ? "bg-[#FF5722] text-black shadow-sm"
                          : "text-slate-400 hover:text-white"
                      }`}
                    >
                      {sz === "xlarge" ? "XL" : sz[0].toUpperCase()}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Casing & Highlight Active Word */}
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-wider text-slate-200 block font-jakarta">
                Casing &amp; Word Sync
              </label>
              <div className="grid grid-cols-2 gap-1.5">
                <button
                  type="button"
                  onClick={() => {
                    if (onYoutubeSubtitleCaseChange) {
                      onYoutubeSubtitleCaseChange(youtubeSubtitleCase === "uppercase" ? "natural" : "uppercase");
                    }
                  }}
                  className={`min-h-[44px] rounded-2xl border px-3 py-1.5 text-xs font-black transition cursor-pointer flex items-center justify-center ${
                    youtubeSubtitleCase === "uppercase"
                      ? "bg-[#FF5722]/15 border-[#FF5722]/40 text-[#FFA000]"
                      : "bg-[#070B14] border-white/10 text-slate-300 hover:text-white"
                  }`}
                >
                  {youtubeSubtitleCase === "uppercase" ? "ALL CAPS" : "Normal"}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    if (onHighlightActiveWordChange) {
                      onHighlightActiveWordChange(!highlightActiveWord);
                    }
                  }}
                  className={`min-h-[44px] rounded-2xl border px-3 py-1.5 text-xs font-black transition cursor-pointer flex items-center justify-center ${
                    highlightActiveWord
                      ? "bg-emerald-500/15 border-emerald-500/40 text-emerald-400"
                      : "bg-[#070B14] border-white/10 text-slate-400 hover:text-white"
                  }`}
                >
                  Highlight: {highlightActiveWord ? "ON" : "OFF"}
                </button>
              </div>
            </div>
          </div>

          {/* Row 2: Custom Color Pickers & Palettes */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-xs font-black uppercase tracking-wider text-slate-200 block font-jakarta">
                Custom Color Pickers
              </label>
              <span className="text-[10px] font-bold text-slate-400">Live Hex Accent Customizer</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
              {/* Text Color */}
              <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-[#070B14] p-3 shadow-inner hover:border-[#FF5722]/40 transition">
                <input
                  type="color"
                  value={toValidHex(captionTextColor, "#FFFFFF")}
                  onChange={(e) => onCaptionTextColorChange(e.target.value)}
                  className="h-9 w-9 rounded-xl border-0 cursor-pointer bg-transparent shrink-0 shadow-md"
                  title="Text Color"
                />
                <div className="flex flex-col min-w-0">
                  <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Text Color</span>
                  <span className="font-mono text-xs font-black text-white uppercase tracking-wider">
                    {toValidHex(captionTextColor, "#FFFFFF")}
                  </span>
                </div>
              </div>

              {/* Highlight Color */}
              <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-[#070B14] p-3 shadow-inner hover:border-[#FF5722]/40 transition">
                <input
                  type="color"
                  value={toValidHex(captionHighlightColor, "#FF5722")}
                  onChange={(e) => onCaptionHighlightColorChange(e.target.value)}
                  className="h-9 w-9 rounded-xl border-0 cursor-pointer bg-transparent shrink-0 shadow-md"
                  title="Highlight Color"
                />
                <div className="flex flex-col min-w-0">
                  <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Highlight Color</span>
                  <span className="font-mono text-xs font-black text-[#FFA000] uppercase tracking-wider">
                    {toValidHex(captionHighlightColor, "#FF5722")}
                  </span>
                </div>
              </div>

              {/* Background Color */}
              <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-[#070B14] p-3 shadow-inner hover:border-[#FF5722]/40 transition">
                <input
                  type="color"
                  value={toValidHex(captionBackgroundColor || "#18181B", "#18181B")}
                  onChange={(e) => {
                    if (onCaptionBackgroundColorChange) onCaptionBackgroundColorChange(e.target.value);
                  }}
                  className="h-9 w-9 rounded-xl border-0 cursor-pointer bg-transparent shrink-0 shadow-md"
                  title="Background Color"
                />
                <div className="flex flex-col min-w-0">
                  <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Background Color</span>
                  <span className="font-mono text-xs font-black text-slate-200 uppercase tracking-wider">
                    {toValidHex(captionBackgroundColor || "#18181B", "#18181B")}
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Color Palettes */}
            <div className="flex flex-wrap items-center gap-2 pt-2">
              {[
                { name: "Viral Orange", text: "#FFFFFF", highlight: "#FF5722", bg: "#000000", colorDot: "#FF5722" },
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
                  className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-[#070B14] hover:bg-[#131B2E] hover:border-[#FF5722]/50 px-3 py-1.5 text-xs font-black text-slate-200 transition cursor-pointer active:scale-95 shadow-sm"
                >
                  <span className="h-2.5 w-2.5 rounded-full shrink-0 shadow-sm" style={{ backgroundColor: theme.colorDot }} />
                  <span>{theme.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════════════════════
          TAB 3: SCRIPT & WORDS (Groq Whisper Transcription + Proper Noun Replacer)
         ══════════════════════════════════════════════════════════════════════════════════ */}
      {activeTab === "script" && (
        <div
          className={`rounded-[24px] border p-5 sm:p-6 space-y-5 shadow-xl ${
            isLight
              ? "bg-slate-50/80 border-slate-200 text-slate-900"
              : "bg-[#131B2E] border-white/10 text-white"
          }`}
        >
          {/* Header */}
          <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b pb-3.5 ${isLight ? "border-slate-200" : "border-white/10"}`}>
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-tr from-[#FF5722] to-[#FFA000] text-white font-black shadow-md shadow-[#FF5722]/20">
                <Zap size={16} />
              </div>
              <div>
                <h3 className={`text-xs sm:text-sm font-black uppercase tracking-wider font-jakarta ${isLight ? "text-slate-900" : "text-white"}`}>
                  Speech-to-Text Transcription &amp; Review
                </h3>
                <p className={`text-xs ${isLight ? "text-slate-500 font-medium" : "text-slate-400"}`}>
                  {hasTranscribed
                    ? "Speech transcribed! You can fix names, proper nouns, or punctuation below."
                    : "Extract word-by-word speech using Groq Whisper Cloud (fast 2-3s)."}
                </p>
              </div>
            </div>

            {hasTranscribed && (
              <button
                type="button"
                onClick={handleTranscribeMedia}
                disabled={isTranscribing}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-[#FFA000] hover:text-[#FF7043] transition cursor-pointer"
              >
                <RotateCcw size={13} className={isTranscribing ? "animate-spin" : ""} />
                <span>Re-transcribe</span>
              </button>
            )}
          </div>

          {/* Languages */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div className="space-y-1.5">
              <label className="flex items-center gap-1.5 text-slate-200 text-xs font-black uppercase tracking-wider font-jakarta">
                <Globe size={13} className="text-[#FF7043]" />
                <span>Spoken Audio Language</span>
              </label>
              <select
                value={spokenLanguage || "auto"}
                onChange={(e) => {
                  if (onSpokenLanguageChange) onSpokenLanguageChange(e.target.value);
                }}
                className="w-full bg-[#070B14] text-white text-xs font-bold rounded-xl border border-white/10 px-3 py-2.5 focus:border-[#FF5722] focus:outline-none cursor-pointer shadow-inner"
              >
                {AUDIO_SPOKEN_LANGUAGES.map((lang) => (
                  <option key={lang.id} value={lang.id} className="bg-[#070B14] text-white">
                    {lang.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="flex items-center gap-1.5 text-slate-200 text-xs font-black uppercase tracking-wider font-jakarta">
                <Layers size={13} className="text-[#FFA000]" />
                <span>Subtitle Output Format</span>
              </label>
              <select
                value={captionLanguage || "same"}
                onChange={(e) => {
                  if (onCaptionLanguageChange) onCaptionLanguageChange(e.target.value);
                }}
                className="w-full bg-[#070B14] text-white text-xs font-bold rounded-xl border border-white/10 px-3 py-2.5 focus:border-[#FF5722] focus:outline-none cursor-pointer shadow-inner"
              >
                {SUBTITLE_OUTPUT_LANGUAGES.map((lang) => (
                  <option key={lang.id} value={lang.id} className="bg-[#070B14] text-white">
                    {lang.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Transcribe Button */}
          {!hasTranscribed ? (
            <div className="space-y-3 pt-2">
              <button
                type="button"
                onClick={handleTranscribeMedia}
                disabled={isTranscribing || !selectedFile}
                className="w-full inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#FF5722] via-[#FF7043] to-[#FFA000] px-5 py-3.5 text-xs sm:text-sm font-black text-black shadow-xl shadow-[#FF5722]/25 hover:brightness-110 active:scale-95 transition cursor-pointer disabled:opacity-50"
              >
                {isTranscribing ? (
                  <>
                    <Loader2 size={16} className="animate-spin text-black" />
                    <span>Transcribing with Groq Whisper Cloud (2-3s)...</span>
                  </>
                ) : (
                  <>
                    <Zap size={16} className="fill-black" />
                    <span>Transcribe &amp; Preview Subtitles (Free)</span>
                  </>
                )}
              </button>
            </div>
          ) : (
            /* Transcribed State: Word Replacer & Script Review */
            <div className="space-y-3">
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
            </div>
          )}

          {transcribeError && (
            <div className="flex items-center gap-2 rounded-xl bg-red-500/10 border border-red-500/30 p-3 text-xs text-red-200">
              <AlertCircle size={15} className="shrink-0 text-red-400" />
              <span>{transcribeError}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
