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
} from "lucide-react";
import { SUBTITLE_PRESETS } from "@/remotion/types/subtitles";
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

  // Trigger fast cloud transcription via Groq Whisper API
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
        const segs = Array.isArray(data.segments) && data.segments.length > 0
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

  // Estimated speech metrics
  const estimatedWordCount = useMemo(() => {
    if (!mediaDurationSeconds || mediaDurationSeconds <= 0) return 0;
    return Math.round((mediaDurationSeconds / 60) * 140);
  }, [mediaDurationSeconds]);

  const hasTranscribed = Boolean(editedTranscript && editedTranscript.trim().length > 0);

  return (
    <div className="relative rounded-[28px] border border-white/10 bg-[#0E1526] p-5 sm:p-7 shadow-2xl min-w-0 max-w-full overflow-x-hidden space-y-7 text-white">
      {/* Magic UI BorderBeam Glowing Effect */}
      <BorderBeam size={280} duration={14} colorFrom="#FF5722" colorTo="#FFA000" />

      {/* ── 1. Studio Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-tr from-[#FF5722] via-[#FF7043] to-[#FFA000] text-black shadow-lg shadow-[#FF5722]/25">
            <Sparkles size={22} className="fill-black/20" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight font-jakarta">
              Reel Caption Studio
            </h2>
            <p className="text-xs text-slate-300 font-medium">Word-by-word kinetic subtitles for 9:16 Reels &amp; Shorts</p>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-orange-500/30 bg-orange-500/10 px-3.5 py-1.5 text-xs font-black text-[#FFA000] tracking-wide">
            <Clock3 size={13} className="text-[#FF7043]" />
            9:16 Vertical · Up to 90s
          </span>
        </div>
      </div>

      {/* ── 2. Process Workflow Roadmap ── */}
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

      {/* ── 3. Step 1: Upload Video Dropzone ── */}
      {!selectedFile ? (
        <div
          onClick={() => fileInputRef.current?.click()}
          onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); }}
          onDrop={(e) => {
            e.preventDefault();
            e.stopPropagation();
            if (e.dataTransfer.files?.[0]) onSelectFile(e.dataTransfer.files[0]);
          }}
          className="flex flex-col items-center justify-center gap-4 rounded-[24px] border-2 border-dashed border-white/15 hover:border-[#FF5722]/60 bg-[#070B14] hover:bg-[#131B2E] min-h-[210px] sm:min-h-[240px] p-6 sm:p-8 text-center transition-all duration-200 cursor-pointer group shadow-inner"
        >
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-[#FF5722]/30 bg-[#FF5722]/10 text-[#FF9100] group-hover:scale-110 group-hover:bg-[#FF5722]/20 transition-all duration-300 shadow-lg shadow-[#FF5722]/10">
            <FileVideo size={28} />
          </div>
          <div className="space-y-1">
            <p className="text-base sm:text-lg font-black text-white font-jakarta">
              Upload 9:16 Reel or Short Video
            </p>
            <p className="text-xs text-slate-300 font-medium">
              Drag &amp; drop or click to browse (MP4, MOV, Audio · Up to 90 seconds)
            </p>
          </div>
          <div className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#FF5722] via-[#FF7043] to-[#FFA000] px-6 py-2.5 text-xs sm:text-sm font-black text-black shadow-lg shadow-[#FF5722]/25 group-hover:brightness-110 transition active:scale-95 mt-1">
            <Upload size={15} />
            <span>Select Video File</span>
          </div>
          <p className="text-[11px] font-bold text-[#FFA000] flex items-center justify-center gap-1.5 mt-1">
            <Sparkles size={12} className="text-[#FF9100]" />
            <span>Word-level transcript replacer &amp; live preview unlock automatically</span>
          </p>
        </div>
      ) : (
        /* Compact File Active Card */
        <div className="space-y-4">
          {mediaDurationSeconds > 0 && (
            <div className="rounded-2xl border border-[#FF5722]/30 bg-[#FF5722]/5 px-4 py-3 text-xs flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <Activity size={16} className="text-[#FF7043]" />
                <span className="text-slate-200 font-bold">
                  Duration: <NumberTicker value={Math.round(mediaDurationSeconds)} />s (~<NumberTicker value={estimatedWordCount} /> spoken words)
                </span>
              </div>
              <div className="flex items-center gap-3">
                <AudioSpectrumVisualizer isPlaying={Boolean(selectedFile)} isTranscribing={isTranscribing} />
                <span className="font-black text-[#FFA000] uppercase text-[11px] bg-[#FF5722]/10 px-3 py-1 rounded-full border border-[#FF5722]/30">
                  1080p Full HD
                </span>
              </div>
            </div>
          )}

          <div
            onClick={() => fileInputRef.current?.click()}
            className="w-full flex items-center justify-between gap-3 rounded-2xl border border-white/10 hover:border-[#FF5722]/50 bg-[#131B2E] p-4 transition-all cursor-pointer group shadow-md"
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 shrink-0">
                <FileVideo size={18} />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-xs sm:text-sm font-extrabold text-white truncate font-jakarta">{selectedFile.name}</span>
                  <span className="rounded-md bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 text-[10px] font-black px-2 py-0.5 shrink-0 uppercase tracking-wider">
                    {hasTranscribed ? "Transcribed" : "Uploaded"}
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">{(selectedFile.size / (1024 * 1024)).toFixed(1)} MB · Click to change file</p>
              </div>
            </div>
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); onSelectFile(null); }}
              className="rounded-xl border border-white/10 bg-[#070B14] hover:bg-red-500/15 hover:border-red-500/30 hover:text-red-400 px-3.5 py-1.5 text-xs font-bold text-slate-300 transition shrink-0 cursor-pointer"
            >
              Change File
            </button>
          </div>
        </div>
      )}

      {/* ── 4. Step 2: Speech-to-Text Transcription & Script Review ── */}
      {selectedFile && (
        <div className="rounded-[24px] border border-white/10 bg-[#131B2E] p-5 sm:p-6 space-y-4 shadow-xl">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-3.5">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-tr from-[#FF5722] to-[#FFA000] text-black font-black">
                <Zap size={16} />
              </div>
              <div>
                <h3 className="text-xs sm:text-sm font-black uppercase tracking-wider text-white font-jakarta">
                  Speech-to-Text Transcription
                </h3>
                <p className="text-xs text-slate-300">
                  {hasTranscribed
                    ? "Speech transcribed! You can fix names, proper nouns, or punctuation below."
                    : "Extract word-by-word speech using Groq Whisper Cloud (ultra-fast 2-3s)."}
                </p>
              </div>
            </div>

            {hasTranscribed && (
              <button
                type="button"
                onClick={handleTranscribeMedia}
                disabled={isTranscribing}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-[#FFA000] hover:text-[#FF7043] transition cursor-pointer self-start sm:self-auto"
              >
                <RotateCcw size={13} className={isTranscribing ? "animate-spin" : ""} />
                <span>Re-transcribe</span>
              </button>
            )}
          </div>

          {/* Spoken & Output Language Selection */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div className="space-y-1.5">
              <label className="flex items-center gap-1.5 text-slate-200 text-xs font-black uppercase tracking-wider font-jakarta">
                <Globe size={13} className="text-[#FF7043]" />
                <span>Spoken Audio Language</span>
              </label>
              <select
                value={spokenLanguage || "auto"}
                onChange={(e) => { if (onSpokenLanguageChange) onSpokenLanguageChange(e.target.value); }}
                className="w-full bg-[#070B14] text-white text-xs font-bold rounded-xl border border-white/10 px-3 py-2.5 focus:border-[#FF5722] focus:outline-none cursor-pointer shadow-inner"
              >
                {AUDIO_SPOKEN_LANGUAGES.map((lang) => (
                  <option key={lang.id} value={lang.id} className="bg-[#070B14] text-white">{lang.label}</option>
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
                onChange={(e) => { if (onCaptionLanguageChange) onCaptionLanguageChange(e.target.value); }}
                className="w-full bg-[#070B14] text-white text-xs font-bold rounded-xl border border-white/10 px-3 py-2.5 focus:border-[#FF5722] focus:outline-none cursor-pointer shadow-inner"
              >
                {SUBTITLE_OUTPUT_LANGUAGES.map((lang) => (
                  <option key={lang.id} value={lang.id} className="bg-[#070B14] text-white">{lang.label}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Action: Transcribe Button (Shown if not yet transcribed) */}
          {!hasTranscribed ? (
            <div className="space-y-3 pt-2">
              <button
                type="button"
                onClick={handleTranscribeMedia}
                disabled={isTranscribing}
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

              <p className="text-center text-xs text-slate-400">
                ⚡ Transcription is fast and cloud-based. You can also skip directly to Generate Video on the right.
              </p>
            </div>
          ) : (
            /* Transcribed State: Word Replacer & Script Review */
            <div className="space-y-4 pt-1">
              <div className="flex items-center justify-between rounded-xl bg-emerald-500/10 border border-emerald-500/30 px-3.5 py-2.5 text-xs text-emerald-400 font-bold">
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={16} className="shrink-0" />
                  <span>Audio speech transcribed! Click any word below to edit or replace proper nouns.</span>
                </div>
              </div>

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

      {/* ── 5. Step 3: Essential Subtitle Customization Controls ── */}
      <div className="rounded-[24px] border border-white/10 bg-[#131B2E] p-5 sm:p-6 space-y-6 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between pb-3.5 border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#FF5722]/15 border border-[#FF5722]/30 text-[#FF7043] shadow-sm">
              <SlidersHorizontal size={16} />
            </div>
            <h3 className="text-xs sm:text-sm font-black uppercase tracking-wider text-white font-jakarta">
              Essential Subtitle Customization Controls
            </h3>
          </div>
          <span className="text-[10px] font-bold text-slate-300 bg-white/5 border border-white/10 px-3 py-1 rounded-full tracking-wide">
            Live Controls
          </span>
        </div>

        {/* ROW 1: Position, Font, Casing, Word Sync */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-center pb-5 border-b border-white/10">
          {/* 1. Caption Position */}
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

          {/* 2. Font Selection */}
          <div className="space-y-2">
            <label className="text-xs font-black uppercase tracking-wider text-slate-200 block font-jakarta">
              Font Selection
            </label>
            <select
              className="w-full rounded-2xl border border-white/10 bg-[#070B14] text-white min-h-[44px] text-xs px-3.5 focus:border-[#FF5722] focus:outline-none cursor-pointer font-bold shadow-inner"
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

          {/* 3. Audio Language Selector (Quick) */}
          <div className="space-y-2">
            <label className="text-xs font-black uppercase tracking-wider text-slate-200 block font-jakarta">
              Audio Language
            </label>
            <div className="grid grid-cols-2 gap-1.5 p-1 rounded-2xl bg-[#070B14] border border-white/10">
              <button
                type="button"
                onClick={() => { if (onSpokenLanguageChange) onSpokenLanguageChange("en"); }}
                className={`min-h-[38px] rounded-xl text-xs font-black transition cursor-pointer flex items-center justify-center ${
                  spokenLanguage === "en"
                    ? "bg-[#FF5722] text-black shadow-sm"
                    : "text-slate-300 hover:text-white"
                }`}
              >
                English
              </button>
              <button
                type="button"
                onClick={() => { if (onSpokenLanguageChange) onSpokenLanguageChange("hi"); }}
                className={`min-h-[38px] rounded-xl text-xs font-black transition cursor-pointer flex items-center justify-center ${
                  spokenLanguage === "hi"
                    ? "bg-[#FFA000] text-black shadow-sm"
                    : "text-slate-300 hover:text-white"
                }`}
              >
                Hinglish
              </button>
            </div>
          </div>

          {/* 4. Casing & Word Sync */}
          <div className="space-y-2">
            <label className="text-xs font-black uppercase tracking-wider text-slate-200 block font-jakarta">
              Casing &amp; Word Sync
            </label>
            <div className="grid grid-cols-2 gap-2">
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
                <span>{youtubeSubtitleCase === "uppercase" ? "ALL CAPS" : "Normal"}</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  if (onHighlightActiveWordChange) {
                    onHighlightActiveWordChange(!highlightActiveWord);
                  }
                }}
                className={`min-h-[44px] rounded-2xl border px-3 py-1.5 text-xs font-black transition cursor-pointer flex items-center justify-center gap-1.5 ${
                  highlightActiveWord
                    ? "bg-emerald-500/15 border-emerald-500/40 text-emerald-400"
                    : "bg-[#070B14] border-white/10 text-slate-400 hover:text-white"
                }`}
              >
                <span>Highlight: {highlightActiveWord ? "ON" : "OFF"}</span>
              </button>
            </div>
          </div>
        </div>

        {/* ROW 2: Custom Color Pickers & Quick Palettes */}
        <div className="space-y-5 pt-1">
          {/* Custom Color Pickers */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-black uppercase tracking-wider text-slate-200 block font-jakarta">
                Custom Color Pickers
              </label>
              <span className="text-[10px] font-bold text-slate-400">
                Live Hex Accent Customizer
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
              {/* 1. Text Color */}
              <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-[#070B14] p-3 shadow-inner hover:border-[#FF5722]/40 transition">
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
              <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-[#070B14] p-3 shadow-inner hover:border-[#FF5722]/40 transition">
                <input
                  type="color"
                  value={toValidHex(captionHighlightColor, "#FF5722")}
                  onChange={(e) => onCaptionHighlightColorChange(e.target.value)}
                  className="h-9 w-9 rounded-xl border-0 cursor-pointer bg-transparent shrink-0 shadow-md"
                  title="Highlight Color"
                />
                <div className="flex flex-col min-w-0">
                  <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider">
                    Highlight Color
                  </span>
                  <span className="font-mono text-xs font-black text-[#FFA000] uppercase tracking-wider">
                    {toValidHex(captionHighlightColor, "#FF5722")}
                  </span>
                </div>
              </div>

              {/* 3. Background Color */}
              <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-[#070B14] p-3 shadow-inner hover:border-[#FF5722]/40 transition">
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

          {/* Quick Color Palettes Section */}
          <div className="space-y-2.5 pt-4 border-t border-white/10">
            <div className="flex items-center justify-between">
              <label className="text-xs font-black uppercase tracking-wider text-slate-200 block font-jakarta">
                Quick Color Palettes
              </label>
              <span className="text-[10px] font-bold text-slate-400">
                1-Click Preset Combos
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
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
                  className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-[#070B14] hover:bg-[#131B2E] hover:border-[#FF5722]/50 px-3.5 py-2 text-xs font-black text-slate-200 transition cursor-pointer active:scale-95 shadow-sm"
                >
                  <span className="h-3 w-3 rounded-full shrink-0 shadow-sm" style={{ backgroundColor: theme.colorDot }} />
                  <span>{theme.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── 6. Step 4: Full Caption Styles Gallery (Top 8 Demos + 100+ Styles) ── */}
      <AutoCaptionStyleCarousel
        selectedPresetKey={captionStyle}
        onSelectPreset={chooseCaptionStyle}
        onHighlightColorChange={onCaptionHighlightColorChange}
        mode="shorts"
      />
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
