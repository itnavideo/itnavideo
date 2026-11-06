"use client";

import { WatermarkRemoverToggle } from "@/components/dashboard/WatermarkRemoverToggle";
import React, { useState, useEffect, useMemo, useRef } from "react";
import Link from "next/link";
import {
  Search,
  Film,
  Sparkles,
  ChevronDown,
  ChevronRight,
  Upload,
  Check,
  Play,
  RotateCcw,
  FileVideo,
  CheckCircle2,
  Globe,
} from "lucide-react";
import {
  KINETIC_STYLES,
  getKineticStyle,
  isKineticCaptionStyle,
  type KineticStyleDefinition,
} from "@/lib/captions/kineticStyles";
import { KineticCaptionLiveRenderer } from "@/components/captions/KineticCaptionLiveRenderer";

// Audio Spoken Language Options
export const AUDIO_SPOKEN_LANGUAGES = [
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

export const CAPTION_LANGUAGES = [
  { id: "same", label: "Same as Audio (Roman Hinglish / English)" },
  { id: "en", label: "English (Latin Script)" },
  { id: "hi", label: "Hinglish (Roman Hindi - No Devanagari)" },
  { id: "es", label: "Spanish (Español)" },
  { id: "fr", label: "French (Français)" },
  { id: "de", label: "German (Deutsch)" },
  { id: "pt", label: "Portuguese (Português)" },
  { id: "id", label: "Indonesian (Bahasa)" },
];

export interface CaptionStyleItem {
  id: string;
  name: string;
  presetKey: string;
  category: "popular" | "popular bold" | "bold" | "popular minimal" | "minimal";
  filterCategory: "All" | "Popular" | "Minimal" | "Bold";
}

// Curated Caption Style Names (Matching Reference Screenshot Sequence)
export const CAPTION_NAME_STYLES: CaptionStyleItem[] = [
  { id: "pop-word", name: "Pop Word", presetKey: "Pop Word", category: "popular bold", filterCategory: "Bold" },
  { id: "karaoke-line", name: "Karaoke Line", presetKey: "Karaoke Line", category: "popular", filterCategory: "Popular" },
  { id: "box-highlight", name: "Box Highlight", presetKey: "Box Highlight", category: "popular bold", filterCategory: "Bold" },
  { id: "neon-glow", name: "Neon Glow", presetKey: "Neon Glow", category: "bold", filterCategory: "Bold" },
  { id: "typewriter", name: "Typewriter", presetKey: "Typewriter", category: "minimal", filterCategory: "Minimal" },
  { id: "slam-headline", name: "Slam Headline", presetKey: "Slam Headline", category: "popular bold", filterCategory: "Bold" },
  { id: "word-stack", name: "Word Stack", presetKey: "Word Stack", category: "popular", filterCategory: "Popular" },
  { id: "editorial-mix", name: "Editorial Mix", presetKey: "Editorial Mix", category: "popular minimal", filterCategory: "Minimal" },
  { id: "pill-highlight", name: "Pill Highlight", presetKey: "Pill Highlight", category: "popular minimal", filterCategory: "Minimal" },
  { id: "subtitle-classic", name: "Subtitle Classic", presetKey: "Subtitle Classic", category: "minimal", filterCategory: "Minimal" },
  { id: "highlighter", name: "Highlighter", presetKey: "Highlighter", category: "bold", filterCategory: "Bold" },
  { id: "underline-track", name: "Underline Track", presetKey: "Underline Track", category: "minimal", filterCategory: "Minimal" },
  { id: "color-fill", name: "Color Fill", presetKey: "Color Fill", category: "popular", filterCategory: "Popular" },
  { id: "hormozi-pop", name: "Hormozi Viral Pop", presetKey: "Hormozi Viral Pop", category: "popular bold", filterCategory: "Bold" },
  { id: "mrbeast-impact", name: "MrBeast Shorts Impact", presetKey: "MrBeast Shorts Impact", category: "popular bold", filterCategory: "Bold" },
  { id: "solo-word-pop", name: "Solo Word Pop", presetKey: "Solo Word Pop", category: "popular", filterCategory: "Popular" },
  { id: "crazy-kinetic", name: "Crazy Kinetic", presetKey: "Crazy Kinetic", category: "bold", filterCategory: "Bold" },
  { id: "submagic-glow", name: "Submagic Glow", presetKey: "Submagic Glow", category: "bold", filterCategory: "Bold" },
  { id: "simple-clean", name: "Simple Clean", presetKey: "Simple Clean", category: "minimal", filterCategory: "Minimal" },
  { id: "ali-abdaal", name: "Ali Abdaal Modern", presetKey: "Ali Abdaal Modern", category: "popular minimal", filterCategory: "Minimal" },
  { id: "doctor-pill", name: "Doctor Pill", presetKey: "Doctor Pill", category: "minimal", filterCategory: "Minimal" },
  { id: "luxe-serif", name: "Devane Luxury Serif", presetKey: "Devane Luxury Serif", category: "minimal", filterCategory: "Minimal" },
  { id: "cinema-classic", name: "Cinema Classic", presetKey: "Cinema Classic", category: "minimal", filterCategory: "Minimal" },
  { id: "podcast-studio", name: "Podcast Studio Master", presetKey: "Podcast Studio Master", category: "popular", filterCategory: "Popular" },
  { id: "deep-discussion", name: "Deep Discussion", presetKey: "Deep Discussion", category: "minimal", filterCategory: "Minimal" },
  { id: "discipline-bold", name: "Discipline Bold", presetKey: "Discipline Bold", category: "bold", filterCategory: "Bold" },
  { id: "red-wipe", name: "Red Wipe Highlight", presetKey: "Red Wipe Highlight", category: "bold", filterCategory: "Bold" },
  { id: "spark-yellow", name: "Spark Yellow", presetKey: "Spark Yellow", category: "popular bold", filterCategory: "Bold" },
  { id: "scribble-notes", name: "Scribble Handwritten", presetKey: "Scribble Handwritten", category: "popular", filterCategory: "Popular" },
  { id: "editorial-dark-gold", name: "Editorial Dark Gold", presetKey: "Editorial Dark Gold", category: "popular minimal", filterCategory: "Minimal" },
  { id: "gradient-word", name: "Gradient Word", presetKey: "Gradient Word", category: "popular bold", filterCategory: "Bold" },
  { id: "zoom-punch", name: "Zoom Punch", presetKey: "Zoom Punch", category: "popular bold", filterCategory: "Bold" },
];

// Curated order for Tab 2 Kinetic matching reference screenshot
const PREFERRED_KINETIC_ORDER = [
  "Editorial Mix",
  "Slam Headline",
  "Word Stack",
  "Pop Word",
  "Gradient Word",
  "Editorial Dark Gold",
  "Zoom Punch",
  "Terminal Typewriter",
  "Drop Bounce",
  "Marker Tag",
  "Glitch",
  "Flip Card",
  "Blur Reveal",
  "Spin In",
  "Outline Only",
  "Serif Italic",
  "Retro Shadow",
  "Sticker",
  "3D Extrude",
  "Terminal Tag",
  "Heartbeat",
  "Underline Swipe",
];

export interface AutoCaptionDualTabStudioProps {
  selectedFile: File | null;
  onSelectFile: (file: File | null) => void;
  captionStyle: string;
  onCaptionStyleChange: (style: string) => void;
  mediaDurationSeconds: number;
  isWorking: boolean;
  onStartRender: () => void;
  editedTranscript?: string;
  onEditedTranscriptChange?: (text: string) => void;
  previewCaptions?: Array<{ start: number; end: number; text: string; words?: any[] }> | null;
  spokenLanguage?: string;
  onSpokenLanguageChange?: (lang: string) => void;
  captionLanguage?: string;
  onCaptionLanguageChange?: (lang: string) => void;
  removeAiWatermark?: boolean;
  onRemoveAiWatermarkChange?: (enabled: boolean) => void;
}

export function AutoCaptionDualTabStudio({
  selectedFile,
  onSelectFile,
  captionStyle,
  onCaptionStyleChange,
  mediaDurationSeconds,
  isWorking,
  onStartRender,
  editedTranscript = "",
  onEditedTranscriptChange,
  previewCaptions = null,
  spokenLanguage,
  onSpokenLanguageChange,
  captionLanguage,
  onCaptionLanguageChange,
  removeAiWatermark = true,
  onRemoveAiWatermarkChange,
}: AutoCaptionDualTabStudioProps) {
  const [localSpokenLang, setLocalSpokenLang] = useState<string>("auto");
  const [localCaptionLang, setLocalCaptionLang] = useState<string>("same");
  const [isHeroDragging, setIsHeroDragging] = useState(false);

  const currentSpokenLang = spokenLanguage || localSpokenLang;
  const currentCaptionLang = captionLanguage || localCaptionLang;
  const handleSpokenLangChange = onSpokenLanguageChange || setLocalSpokenLang;
  const handleCaptionLangChange = onCaptionLanguageChange || setLocalCaptionLang;

  // Top 2-Part Tab: "captions" (Names Only) | "kinetic" (With Videos)
  const [activeTab, setActiveTab] = useState<"captions" | "kinetic">(() => {
    return isKineticCaptionStyle(captionStyle) ? "kinetic" : "captions";
  });

  // Captions Tab Filters & Search
  const [captionFilter, setCaptionFilter] = useState<"All" | "Popular" | "Minimal" | "Bold">("All");
  const [captionSearch, setCaptionSearch] = useState<string>("");

  // Kinetic Tab Filters
  const [kineticTag, setKineticTag] = useState<string>("All");
  const [kineticVideoType, setKineticVideoType] = useState<string>("walking");
  const [hoveredKineticId, setHoveredKineticId] = useState<string | null>(null);

  // Transcript Accordion
  const [showTranscript, setShowTranscript] = useState<boolean>(false);

  // Hidden File Input for Replace Button
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Looping Playback Timer for Live Previews (0s -> 6s)
  const [playbackTime, setPlaybackTime] = useState<number>(1.2);
  useEffect(() => {
    let animId: number;
    let lastTime = performance.now();
    const loop = (now: number) => {
      const dt = (now - lastTime) / 1000;
      lastTime = now;
      setPlaybackTime((prev) => (prev + dt > 6 ? 0 : prev + dt));
      animId = requestAnimationFrame(loop);
    };
    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, []);

  // Filtered Captions (Tab 1)
  const filteredCaptions = useMemo(() => {
    return CAPTION_NAME_STYLES.filter((item) => {
      if (captionFilter !== "All" && item.filterCategory !== captionFilter) {
        return false;
      }
      if (captionSearch.trim()) {
        const q = captionSearch.toLowerCase().trim();
        return item.name.toLowerCase().includes(q) || item.category.toLowerCase().includes(q);
      }
      return true;
    });
  }, [captionFilter, captionSearch]);

  // Filtered Kinetic Styles (Tab 2) sorted to match reference screenshot
  const filteredKineticStyles = useMemo(() => {
    let list = [...KINETIC_STYLES];
    // Sort so preferred order comes first
    list.sort((a, b) => {
      const idxA = PREFERRED_KINETIC_ORDER.indexOf(a.name);
      const idxB = PREFERRED_KINETIC_ORDER.indexOf(b.name);
      if (idxA !== -1 && idxB !== -1) return idxA - idxB;
      if (idxA !== -1) return -1;
      if (idxB !== -1) return 1;
      return a.index - b.index;
    });

    if (kineticTag === "All") return list;
    if (kineticTag === "Walking") return list.filter((s) => s.layout === "o" || s.layout === "e");
    if (kineticTag === "Sitting") return list.filter((s) => s.layout === "l" || s.layout === "e" || s.layout === "s");
    if (kineticTag === "Podcast") return list.filter((s) => s.layout === "s" || s.layout === "t");
    if (kineticTag === "Motivational") return list.filter((s) => s.layout === "o" || s.layout === "s");
    return list;
  }, [kineticTag]);

  // Auto-pick recommendation
  const handleAutoPick = () => {
    const popularPicks = ["Editorial Mix", "Slam Headline", "Word Stack", "Zoom Punch", "Pop Word", "Gradient Word"];
    const randomPick = popularPicks[Math.floor(Math.random() * popularPicks.length)];
    onCaptionStyleChange(randomPick);
  };

  // Video status display text
  const videoFileName = selectedFile?.name || "sample_walking.mp4";
  const videoDurationText = mediaDurationSeconds > 0
    ? `0:${Math.round(mediaDurationSeconds).toString().padStart(2, "0")}`
    : "0:32";

  // Demo words for live phone preview
  const demoWords = useMemo(() => {
    if (previewCaptions && previewCaptions.length > 0) {
      const flattened: any[] = [];
      previewCaptions.forEach((c) => {
        if (c.words && c.words.length > 0) {
          flattened.push(...c.words);
        } else {
          flattened.push({ word: c.text, start: c.start, end: c.end });
        }
      });
      if (flattened.length > 0) return flattened;
    }
    return [
      { word: "I", start: 0.1, end: 0.4 },
      { word: "stopped", start: 0.4, end: 0.9 },
      { word: "waiting", start: 0.9, end: 1.5 },
      { word: "for", start: 1.5, end: 1.9 },
      { word: "perfect.", start: 1.9, end: 3.2, isKeyword: true },
      { word: "And", start: 3.2, end: 3.5 },
      { word: "started", start: 3.5, end: 4.1 },
      { word: "building", start: 4.1, end: 4.8, isKeyword: true },
      { word: "now.", start: 4.8, end: 5.8 },
    ];
  }, [previewCaptions]);

  // Brand purple color definition
  const BRAND_PURPLE = "#5850ec";

  return (
    <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-5 space-y-4 font-sans select-none">
      {/* Hidden File Input for Replace / Upload */}
      <input
        ref={fileInputRef}
        type="file"
        accept="video/*,audio/*"
        className="hidden"
        onChange={(e) => {
          if (e.target.files?.[0]) {
            onSelectFile(e.target.files[0]);
          }
          e.currentTarget.value = "";
        }}
      />

      {/* Top Header: Breadcrumbs + Title + Subtitle */}
      <div>
        <div className="text-xs text-slate-500 mb-0.5">
          <Link href="/dashboard" className="hover:text-slate-800 transition">Video Types</Link>
          <span className="mx-1.5 text-slate-400">&gt;</span>
          <span className="text-slate-700 font-semibold">Auto Captions</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight font-jakarta">
          Auto Captions
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-0.5 font-medium">
          Upload your video or use a sample clip, then compare kinetic styles and download your 1080p reel.
        </p>
      </div>

      {/* ── BIG HERO UPLOAD SECTION AT TOP (Generous space, clean & premium) ── */}
      <section className="w-full rounded-3xl border border-slate-200/90 bg-white p-6 sm:p-8 shadow-sm space-y-6 transition-all">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-3 border-b border-slate-100">
          <div>
            <h2 className="text-lg sm:text-xl font-black text-slate-900 font-jakarta flex items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-orange-100 text-[#FF5722] text-xs font-black">
                1
              </span>
              <span>Upload Video or Try Sample Clip</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 font-medium mt-0.5">
              Upload your video or audio to automatically generate styled kinetic captions with Groq Whisper AI.
            </p>
          </div>
          {selectedFile && (
            <span className="inline-flex items-center gap-1.5 self-start sm:self-auto rounded-full bg-emerald-50 border border-emerald-200 px-3.5 py-1 text-xs font-bold text-emerald-700 shadow-2xs">
              <CheckCircle2 size={13} className="text-emerald-600" />
              Active Media Loaded
            </span>
          )}
        </div>

        {/* Upload Dropzone or Active Media Card */}
        {!selectedFile ? (
          <div
            onClick={() => !isWorking && fileInputRef.current?.click()}
            onDragOver={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setIsHeroDragging(true);
            }}
            onDragLeave={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setIsHeroDragging(false);
            }}
            onDrop={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setIsHeroDragging(false);
              if (e.dataTransfer.files?.[0]) onSelectFile(e.dataTransfer.files[0]);
            }}
            className={`relative flex flex-col items-center justify-center gap-4 rounded-2xl border-2 border-dashed p-8 sm:p-12 text-center transition-all cursor-pointer group ${
              isHeroDragging
                ? "border-[#FF5722] bg-orange-50/70 scale-[1.005]"
                : "border-slate-300/80 bg-slate-50/60 hover:bg-orange-50/30 hover:border-[#FF5722]/60"
            }`}
          >
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-orange-100 text-[#FF5722] group-hover:scale-110 transition-transform shadow-sm">
              <Upload size={28} />
            </div>

            <div className="space-y-1">
              <p className="text-base sm:text-lg font-black text-slate-900 font-jakarta">
                Click or drag video here
              </p>
              <p className="text-xs sm:text-sm text-slate-500 font-medium">
                MP4, MOV, Audio • Max 90s • 9:16 Vertical Recommended
              </p>
            </div>

            <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
              <button
                type="button"
                onClick={async (e) => {
                  e.stopPropagation();
                  try {
                    const res = await fetch("/assets/reusable/testing1.mp3");
                    const blob = await res.blob();
                    const sampleFile = new File([blob], "sample_walking.mp4", { type: "audio/mpeg" });
                    onSelectFile(sampleFile);
                  } catch (err) {
                    console.warn("Could not load sample audio:", err);
                  }
                }}
                className="inline-flex items-center gap-2 rounded-full border border-orange-200 bg-orange-50 hover:bg-orange-100 text-xs font-bold text-[#FF5722] px-4 py-2 transition shadow-2xs hover:scale-105 active:scale-95 cursor-pointer"
              >
                <Sparkles size={14} className="text-[#FF5722]" />
                <span>Try with sample clip</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="relative rounded-2xl border border-slate-200 bg-slate-50/80 p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs">
            <div className="flex items-center gap-4 min-w-0">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-100 text-[#FF5722] shrink-0 shadow-xs">
                <FileVideo size={26} />
              </div>
              <div className="min-w-0">
                <p className="text-base font-black text-slate-900 truncate font-jakarta">
                  {selectedFile.name}
                </p>
                <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 font-medium mt-1">
                  <span>{(selectedFile.size / (1024 * 1024)).toFixed(1)} MB</span>
                  <span>•</span>
                  <span>{videoDurationText} Duration</span>
                  <span>•</span>
                  <span className="text-emerald-700 font-bold">9:16 Ready</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2.5 shrink-0 self-start sm:self-auto">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="rounded-xl border border-slate-200 bg-white hover:bg-slate-50 px-4 py-2 text-xs font-bold text-slate-700 transition shadow-xs cursor-pointer hover:border-slate-300"
              >
                Replace Video
              </button>
              <button
                type="button"
                onClick={async () => {
                  try {
                    const res = await fetch("/assets/reusable/testing1.mp3");
                    const blob = await res.blob();
                    const sampleFile = new File([blob], "sample_walking.mp4", { type: "audio/mpeg" });
                    onSelectFile(sampleFile);
                  } catch (err) {
                    console.warn("Could not load sample audio:", err);
                  }
                }}
                className="rounded-xl border border-orange-200 bg-orange-50 hover:bg-orange-100 px-3.5 py-2 text-xs font-bold text-[#FF5722] transition shadow-xs cursor-pointer"
              >
                Use Sample Clip
              </button>
            </div>
          </div>
        )}

        {/* Language Selection Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
          {/* Spoken Language Dropdown */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
              <Globe size={13} className="text-[#FF5722]" />
              <span>Audio Spoken</span>
            </label>
            <div className="relative">
              <select
                value={currentSpokenLang}
                onChange={(e) => handleSpokenLangChange(e.target.value)}
                className="w-full appearance-none rounded-xl border border-slate-200 bg-slate-50/70 hover:bg-slate-50 px-3.5 py-2.5 text-xs font-bold text-slate-900 focus:border-[#FF5722] focus:outline-none transition cursor-pointer shadow-2xs pr-8"
              >
                {AUDIO_SPOKEN_LANGUAGES.map((lang) => (
                  <option key={lang.id} value={lang.id}>
                    {lang.label}
                  </option>
                ))}
              </select>
              <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            </div>
          </div>

          {/* Caption Output Language Dropdown */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
              <Sparkles size={13} className="text-[#FF5722]" />
              <span>Caption Language</span>
            </label>
            <div className="relative">
              <select
                value={currentCaptionLang}
                onChange={(e) => handleCaptionLangChange(e.target.value)}
                className="w-full appearance-none rounded-xl border border-slate-200 bg-slate-50/70 hover:bg-slate-50 px-3.5 py-2.5 text-xs font-bold text-slate-900 focus:border-[#FF5722] focus:outline-none transition cursor-pointer shadow-2xs pr-8"
              >
                {CAPTION_LANGUAGES.map((lang) => (
                  <option key={lang.id} value={lang.id}>
                    {lang.label}
                  </option>
                ))}
              </select>
              <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Feature Badges Footer */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 border-t border-slate-100 text-center">
          <div className="py-2.5 px-3 rounded-xl bg-slate-50/90 border border-slate-100">
            <p className="text-xs font-black text-slate-800">Fast Transcription</p>
            <p className="text-[11px] text-slate-500 font-medium">Groq Whisper Cloud AI</p>
          </div>
          <div className="py-2.5 px-3 rounded-xl bg-slate-50/90 border border-slate-100">
            <p className="text-xs font-black text-slate-800">40+ Motion Styles</p>
            <p className="text-[11px] text-slate-500 font-medium">Viral Kinetic Animations</p>
          </div>
          <div className="py-2.5 px-3 rounded-xl bg-slate-50/90 border border-slate-100">
            <p className="text-xs font-black text-slate-800">1080p Export</p>
            <p className="text-[11px] text-slate-500 font-medium">Clean 30 FPS Full HD MP4</p>
          </div>
        </div>
      </section>

      {/* Full-width 2-Part Switcher Tab: [ Captions ] | [ Kinetic NEW ] */}
      <div className="w-full rounded-2xl border border-slate-200 bg-white p-1 shadow-2xs flex gap-2">
        <button
          type="button"
          onClick={() => setActiveTab("captions")}
          style={{
            backgroundColor: activeTab === "captions" ? BRAND_PURPLE : "transparent",
            color: activeTab === "captions" ? "#FFFFFF" : "#475569",
          }}
          className="flex-1 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all text-center cursor-pointer hover:opacity-95"
        >
          Captions
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("kinetic")}
          style={{
            backgroundColor: activeTab === "kinetic" ? BRAND_PURPLE : "transparent",
            color: activeTab === "kinetic" ? "#FFFFFF" : "#475569",
          }}
          className="flex-1 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-2 cursor-pointer hover:opacity-95"
        >
          <span>Kinetic</span>
          <span className="bg-[#FFE14D] text-black text-[9px] font-black px-1.5 py-0.5 rounded-md leading-none shadow-2xs">
            NEW
          </span>
        </button>
      </div>

      {/* Main 2-Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* ── LEFT COLUMN (STEP 1 Video + STEP 3 Preview + CTA) ── */}
        <div className="lg:col-span-4 xl:col-span-3.5 space-y-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
          {/* STEP 1 · VIDEO */}
          <div className="space-y-1.5">
            <div className="text-[10px] font-black uppercase tracking-wider text-slate-400">
              STEP 1 · VIDEO
            </div>
            <div className="rounded-xl border border-slate-200 bg-slate-50/80 p-2.5 flex items-center justify-between gap-2 shadow-2xs">
              <div className="flex items-center gap-2 min-w-0">
                <div
                  className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
                  style={{ backgroundColor: `${BRAND_PURPLE}15`, color: BRAND_PURPLE }}
                >
                  <Film size={14} />
                </div>
                <div className="text-xs font-bold text-slate-800 truncate">
                  {videoFileName} · {videoDurationText} <span className="text-emerald-600">✓</span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-50 shadow-2xs shrink-0 cursor-pointer transition"
              >
                Replace
              </button>
            </div>
          </div>

          {/* STEP 3 · PREVIEW */}
          <div className="space-y-2.5">
            <div className="text-[10px] font-black uppercase tracking-wider text-slate-400">
              STEP 3 · PREVIEW
            </div>

            {/* 9:16 Phone Mockup Canvas with Real Looping Video Background */}
            <div
              className="relative aspect-[9/16] w-full max-w-[270px] mx-auto rounded-2xl overflow-hidden border border-slate-800 shadow-xl flex items-center justify-center bg-black"
            >
              {/* Real Looping Creator Video in Background */}
              <video
                src="/visuals/homepage/autocaption.mp4"
                autoPlay
                loop
                muted
                playsInline
                className="absolute inset-0 w-full h-full object-cover opacity-60 pointer-events-none"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-black/70 pointer-events-none" />

              {/* Dynamic Live Captions Rendering (Kinetic or Standard) */}
              <div className="relative z-10 w-full px-3 text-center pointer-events-none">
                <UniversalCaptionLiveRenderer
                  styleName={captionStyle}
                  words={demoWords}
                  playbackTime={playbackTime}
                  isPlaying={true}
                />
              </div>
            </div>

            {/* Selected Style Indicator */}
            <div className="text-xs font-bold text-slate-900 pt-1">
              Selected: <span style={{ color: BRAND_PURPLE }}>{captionStyle}</span>
            </div>

            {/* Primary CTA Button */}
            <button
              type="button"
              onClick={onStartRender}
              disabled={isWorking}
              style={{ backgroundColor: BRAND_PURPLE }}
              className={`w-full rounded-xl py-3 px-4 text-xs font-bold text-white shadow-md transition-all cursor-pointer flex items-center justify-center gap-2 hover:brightness-105 active:scale-[0.99] ${
                isWorking ? "opacity-80 cursor-wait animate-pulse" : ""
              }`}
            >
              <span>{isWorking ? "Rendering Reel 1080p..." : `Generate video with ${captionStyle}`}</span>
            </button>

            {/* Collapsible Transcript Accordion */}
            <div className="pt-1">
              <button
                type="button"
                onClick={() => setShowTranscript((prev) => !prev)}
                className="text-xs font-bold text-slate-500 hover:text-slate-800 flex items-center gap-1.5 transition cursor-pointer select-none"
              >
                <span className={`text-[10px] transition-transform ${showTranscript ? "rotate-90" : ""}`}>
                  ▶
                </span>
                <span>Transcript (Shared across tabs)</span>
              </button>

              {showTranscript && (
                <div className="mt-2 p-3 rounded-xl border border-slate-200 bg-slate-50 text-xs text-slate-700 space-y-2">
                  <p className="text-[11px] font-semibold text-slate-500">
                    Live editable transcript synced across both Captions and Kinetic styles:
                  </p>
                  <textarea
                    value={editedTranscript || "I stopped waiting for perfect and started building now. We had one hundred customers in two weeks."}
                    onChange={(e) => onEditedTranscriptChange?.(e.target.value)}
                    rows={3}
                    className="w-full rounded-lg border border-slate-200 bg-white p-2 text-xs text-slate-800 focus:outline-none focus:border-indigo-500"
                    placeholder="Enter transcript words..."
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ── RIGHT COLUMN (STEP 2 Style Chuno) ── */}
        <div className="lg:col-span-8 xl:col-span-8.5 rounded-2xl border border-slate-200 bg-white p-5 shadow-xs space-y-4">
          <div className="text-[10px] font-black uppercase tracking-wider text-slate-400">
            STEP 2 · STYLE CHUNO
          </div>

          {/* ─────────────────────────────────────────────────────────────
              TAB 2: KINETIC STYLES (WITH LIVE 9:16 VIDEOS)
             ───────────────────────────────────────────────────────────── */}
          {activeTab === "kinetic" && (
            <div className="space-y-4">
              <div className="text-sm font-bold text-slate-900">
                Kinetic · typography + keyword emphasis
              </div>

              {/* Controls Row: Category Pills + Video Type + Auto-pick */}
              <div className="flex flex-wrap items-center justify-between gap-2.5">
                <div className="flex flex-wrap items-center gap-1.5">
                  {["All", "Walking", "Sitting", "Podcast", "Motivational"].map((filter) => (
                    <button
                      key={filter}
                      type="button"
                      onClick={() => setKineticTag(filter)}
                      className={`rounded-full px-3 py-1 text-xs font-bold transition cursor-pointer ${
                        kineticTag === filter
                          ? "bg-slate-900 text-white shadow-xs"
                          : "bg-white border border-slate-200 text-slate-700 hover:bg-slate-50"
                      }`}
                    >
                      {filter}
                    </button>
                  ))}
                </div>

                <div className="flex items-center gap-2">
                  <select
                    value={kineticVideoType}
                    onChange={(e) => setKineticVideoType(e.target.value)}
                    className="rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-xs font-medium text-slate-700 cursor-pointer focus:outline-none"
                  >
                    <option value="walking">Video: Walking ▾</option>
                    <option value="sitting">Video: Sitting ▾</option>
                    <option value="podcast">Video: Podcast ▾</option>
                  </select>

                  <button
                    type="button"
                    onClick={handleAutoPick}
                    className="rounded-lg border border-amber-200 bg-amber-50 hover:bg-amber-100 text-amber-800 px-3 py-1 text-xs font-bold flex items-center gap-1 transition cursor-pointer"
                  >
                    <Sparkles size={12} className="text-amber-600" />
                    <span>Auto-pick for me</span>
                  </button>
                </div>
              </div>

              {/* Grid of 5-column 9:16 Kinetic Video Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 max-h-[620px] overflow-y-auto pr-1">
                {filteredKineticStyles.map((item) => {
                  const isSelected =
                    captionStyle === item.name ||
                    captionStyle.toLowerCase() === item.name.toLowerCase();
                  const isHovered = hoveredKineticId === item.id;

                  return (
                    <div
                      key={item.id}
                      onClick={() => onCaptionStyleChange(item.name)}
                      onMouseEnter={() => setHoveredKineticId(item.id)}
                      onMouseLeave={() => setHoveredKineticId(null)}
                      className="group cursor-pointer select-none"
                    >
                      {/* 9:16 Preview Card */}
                      <div
                        style={{
                          background: "radial-gradient(circle at 50% 50%, #1c2b26 0%, #0d1416 85%)",
                          borderColor: isSelected ? BRAND_PURPLE : undefined,
                          borderWidth: isSelected ? 2 : 1,
                        }}
                        className={`aspect-[9/16] rounded-xl overflow-hidden relative border transition-all duration-200 flex items-center justify-center p-2 ${
                          isSelected
                            ? "shadow-md ring-2 ring-indigo-500/20"
                            : "border-slate-200 hover:border-slate-400 hover:shadow-2xs"
                        }`}
                      >
                        {/* Dark Silhouette figure in card */}
                        <svg
                          className="absolute inset-0 w-full h-full pointer-events-none opacity-30"
                          viewBox="0 0 100 178"
                          fill="none"
                        >
                          <circle cx="50" cy="62" r="11" fill="#314941" />
                          <path d="M34 88 C34 74, 66 74, 66 88 L70 160 L30 160 Z" fill="#263b34" />
                        </svg>

                        {/* Top pill badge: hover to play */}
                        <div className="absolute top-2 left-1/2 -translate-x-1/2 bg-black/60 backdrop-blur-xs text-white text-[8px] font-semibold px-1.5 py-0.5 rounded-full flex items-center gap-0.5 pointer-events-none whitespace-nowrap z-10">
                          <span>▶ hover to play</span>
                        </div>

                        {/* Top-left Last used badge if selected */}
                        {isSelected && (
                          <div
                            style={{ backgroundColor: BRAND_PURPLE }}
                            className="absolute top-2 left-2 text-white text-[8px] font-bold px-1.5 py-0.5 rounded-md shadow-xs z-20 pointer-events-none"
                          >
                            Last used
                          </div>
                        )}

                        {/* Kinetic Typography Simulation inside Card */}
                        <div className="relative z-10 w-full text-center pointer-events-none">
                          <KineticCardSimulation
                            item={item}
                            isHovered={isHovered}
                            playbackTime={playbackTime}
                          />
                        </div>
                      </div>

                      {/* Card Title & Tags below */}
                      <div className="mt-1.5">
                        <div className="text-xs font-bold text-slate-900 truncate">
                          {item.name === "Terminal Typewriter" ? "Typewriter" : item.name}
                        </div>
                        <div className="text-[10px] text-slate-400 font-medium truncate">
                          {item.name === "Editorial Mix" || item.name === "Editorial Dark Gold"
                            ? "sitting"
                            : item.name === "Word Stack"
                            ? "podcast sitting"
                            : item.name === "Terminal Typewriter"
                            ? "podcast"
                            : item.name === "Gradient Word"
                            ? "sitting podcast"
                            : "walking motivational"}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ─────────────────────────────────────────────────────────────
              TAB 1: CAPTIONS STYLE TEMPLATES (NAMES ONLY - NO VIDEOS)
             ───────────────────────────────────────────────────────────── */}
          {activeTab === "captions" && (
            <div className="space-y-4">
              {/* Featured Video Showcase Banner for Captions */}
              <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-gradient-to-r from-slate-900 via-slate-900 to-indigo-950 p-4 text-white shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3.5">
                <div className="space-y-1">
                  <div className="inline-flex items-center gap-1.5 rounded-full bg-[#FFE14D]/20 px-2.5 py-0.5 text-[10px] font-black uppercase text-[#FFE14D] tracking-wide">
                    <Sparkles size={11} className="text-[#FFE14D]" />
                    <span>Style Showcase · {captionStyle}</span>
                  </div>
                  <h4 className="text-sm sm:text-base font-black tracking-tight text-white font-jakarta">
                    Auto-Sync Motion Captions
                  </h4>
                  <p className="text-xs text-slate-300 max-w-md">
                    Choose from 32 viral subtitle styles. Real-time spoken word highlighting & typography.
                  </p>
                </div>

                <div className="relative w-full sm:w-44 aspect-video rounded-xl overflow-hidden border border-white/20 shadow-md shrink-0 bg-black">
                  <video
                    src="/visuals/homepage/autocaption.mp4"
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="w-full h-full object-cover opacity-90"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex items-end p-2">
                    <div className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      <span className="text-[10px] font-bold text-white truncate max-w-[120px]">
                        {captionStyle}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Controls Row: Title + Search Bar */}
              <div className="flex flex-wrap items-center justify-between gap-2.5">
                <div className="text-sm font-bold text-slate-900">
                  Captions · style names
                </div>

                <div className="relative w-full sm:w-64">
                  <input
                    type="text"
                    value={captionSearch}
                    onChange={(e) => setCaptionSearch(e.target.value)}
                    placeholder="Search styles..."
                    className="w-full rounded-lg border border-slate-200 bg-white pl-8 pr-3 py-1.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-indigo-500"
                  />
                  <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                </div>
              </div>

              {/* Style Name Boxes (Spacious 4-per-line grid matching reference image) */}
              <div
                style={{
                  maxWidth: "760px",
                  fontFamily: 'var(--font-inter), "Inter", "Segoe UI", -apple-system, BlinkMacSystemFont, sans-serif',
                }}
                className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1 max-h-[500px] overflow-y-auto pr-1.5"
              >
                {filteredCaptions.map((item) => {
                  const isSelected =
                    captionStyle.toLowerCase().trim() === item.name.toLowerCase().trim() ||
                    captionStyle.toLowerCase().trim() === item.id.toLowerCase().trim() ||
                    captionStyle.toLowerCase().trim() === item.presetKey.toLowerCase().trim();

                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => onCaptionStyleChange(item.name)}
                      title={item.name}
                      style={{
                        height: "40px",
                        borderRadius: "7px",
                        fontFamily: 'var(--font-inter), "Inter", "Segoe UI", -apple-system, BlinkMacSystemFont, sans-serif',
                        fontSize: "13px",
                        letterSpacing: "-0.01em",
                        backgroundColor: isSelected ? "#FBDD6B" : "#FFFFFF",
                        border: isSelected ? "1px solid #FBDD6B" : "1px solid #d4d4d8",
                        color: isSelected ? "#000000" : "#374151",
                        fontWeight: isSelected ? 700 : 500,
                        boxShadow: "none",
                      }}
                      className="px-3 text-center transition-all cursor-pointer select-none truncate flex items-center justify-center hover:bg-slate-50"
                    >
                      <span className="truncate">{item.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Helper: Animated Simulation Inside Each Kinetic 9:16 Card ──
function KineticCardSimulation({
  item,
  isHovered,
  playbackTime,
}: {
  item: KineticStyleDefinition;
  isHovered: boolean;
  playbackTime: number;
}) {
  const name = item.name.toLowerCase();

  // 1. Editorial Mix & Editorial Dark Gold
  if (name.includes("editorial")) {
    const isDarkGold = name.includes("dark gold");
    return (
      <div className="space-y-1 px-1">
        <p className="text-[8px] text-slate-300 font-serif italic tracking-wide">
          i stopped waiting for
        </p>
        <p
          className={`text-sm sm:text-base font-black uppercase tracking-tight ${
            isDarkGold
              ? "bg-gradient-to-r from-[#ffe35a] via-[#f59e0b] to-[#b45309] bg-clip-text text-transparent drop-shadow"
              : "bg-gradient-to-r from-[#fff59a] to-[#e9b81c] bg-clip-text text-transparent drop-shadow"
          }`}
        >
          PERFECT
        </p>
      </div>
    );
  }

  // 2. Word Stack
  if (name.includes("stack")) {
    return (
      <div className="space-y-1 px-1 text-center">
        <div className="rounded-md bg-white/10 px-2 py-0.5 text-[8px] font-bold text-slate-400">
          WAITING
        </div>
        <div className="rounded-md bg-white/10 px-2 py-0.5 text-[8px] font-bold text-slate-400">
          FOR
        </div>
        <div className="rounded-md bg-[#FFE14D] px-2 py-0.5 text-[9px] font-black text-black shadow-sm">
          PERFECT
        </div>
      </div>
    );
  }

  // 3. Zoom Punch & Slam Headline
  if (name.includes("punch") || name.includes("slam")) {
    return (
      <div className="px-1">
        <span className="text-base sm:text-lg font-black uppercase text-[#FFE14D] tracking-wider drop-shadow-md">
          PERFECT
        </span>
      </div>
    );
  }

  // 4. Gradient Word
  if (name.includes("gradient")) {
    return (
      <div className="px-1">
        <span className="text-sm sm:text-base font-black uppercase bg-gradient-to-r from-[#ff5ea8] to-[#ffb347] bg-clip-text text-transparent drop-shadow-md">
          PERFECT
        </span>
      </div>
    );
  }

  // 5. Typewriter
  if (name.includes("typewriter") || name.includes("terminal")) {
    return (
      <div className="inline-block px-1.5 py-1 rounded bg-black/80 border border-white/15 text-[8px] font-mono text-white text-left">
        <span>i stopped waiting for perfect</span>
        <span className="inline-block w-1.5 h-2.5 bg-[#FFE14D] ml-0.5 animate-pulse align-middle" />
      </div>
    );
  }

  // Default: Anton / Impact Single Word
  return (
    <div className="px-1">
      <span className="text-sm sm:text-base font-black uppercase text-[#FFE14D] drop-shadow-md">
        PERFECT
      </span>
    </div>
  );
}

// ── Master Live Caption Renderer for Preview Mockup ──
function UniversalCaptionLiveRenderer({
  styleName,
  words,
  playbackTime,
  isPlaying,
}: {
  styleName: string;
  words: Array<{ word: string; start: number; end: number; isKeyword?: boolean }>;
  playbackTime: number;
  isPlaying: boolean;
}) {
  const norm = styleName.toLowerCase().trim();

  // If it matches a defined kinetic style, use KineticCaptionLiveRenderer directly
  if (isKineticCaptionStyle(styleName)) {
    return (
      <KineticCaptionLiveRenderer
        styleName={styleName}
        words={words}
        playbackTime={playbackTime}
        isPlaying={isPlaying}
        accentColor="#FFE14D"
      />
    );
  }

  // Active word index from playback loop
  const activeIdx = useMemo(() => {
    if (!words || words.length === 0) return 0;
    const idx = words.findIndex((w) => playbackTime >= w.start && playbackTime <= w.end);
    if (idx !== -1) return idx;
    const recent = words.findIndex((w) => playbackTime >= w.start && playbackTime <= w.end + 0.35);
    if (recent !== -1) return recent;
    return 0;
  }, [words, playbackTime]);

  const activeWordObj = words[activeIdx] || words[0];
  const activeWordText = activeWordObj?.word || "building";

  // Visible window of 3 words
  const windowStart = Math.max(0, Math.min(activeIdx - 1, Math.max(0, words.length - 3)));
  const visibleWords = words.slice(windowStart, windowStart + 3);

  // 1. Hormozi Viral Pop
  if (norm.includes("hormozi")) {
    return (
      <div className="flex flex-wrap items-center justify-center gap-2 select-none">
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
  if (norm.includes("mrbeast") || norm.includes("impact")) {
    return (
      <div className="flex flex-wrap items-center justify-center gap-2 select-none">
        {visibleWords.map((w, idx) => {
          const isActive = w.word === activeWordText;
          return (
            <span
              key={`${w.word}-${idx}`}
              style={{
                fontFamily: "Impact, Anton, sans-serif",
                WebkitTextStroke: "2.5px #000",
                textShadow: "0 3px 0 #000, 0 6px 14px rgba(0,0,0,0.9)",
                color: isActive ? "#FFE600" : "#FFFFFF",
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

  // 3. Solo Word Pop
  if (norm.includes("solo")) {
    return (
      <div className="flex items-center justify-center select-none py-2">
        <span
          style={{
            fontFamily: "Anton, Impact, sans-serif",
            WebkitTextStroke: "2px #000",
            textShadow: "0 4px 12px rgba(0,0,0,0.9)",
            color: "#FFE14D",
          }}
          className="text-2xl sm:text-3xl font-black uppercase tracking-wide transition-transform animate-pulse inline-block"
        >
          {activeWordText}
        </span>
      </div>
    );
  }

  // 4. Crazy Kinetic
  if (norm.includes("crazy")) {
    return (
      <div className="flex flex-wrap items-center justify-center gap-2 select-none">
        {visibleWords.map((w, idx) => {
          const isActive = w.word === activeWordText;
          const rotate = idx % 2 === 0 ? "-4deg" : "4deg";
          return (
            <span
              key={`${w.word}-${idx}`}
              style={{
                fontFamily: "Bangers, Anton, sans-serif",
                WebkitTextStroke: "1.5px #000",
                color: isActive ? "#FF007F" : idx % 2 === 0 ? "#00F5FF" : "#FFE600",
                transform: `rotate(${rotate}) ${isActive ? "scale(1.2)" : "scale(1)"}`,
              }}
              className="text-base sm:text-lg font-black uppercase tracking-wider transition-all inline-block"
            >
              {w.word}
            </span>
          );
        })}
      </div>
    );
  }

  // 5. Submagic Glow
  if (norm.includes("submagic")) {
    return (
      <div className="flex flex-wrap items-center justify-center gap-2 select-none">
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

  // 6. Simple Clean
  if (norm.includes("simple") || norm.includes("clean")) {
    return (
      <div className="flex flex-wrap items-center justify-center gap-1.5 select-none bg-black/60 backdrop-blur-xs px-3.5 py-1.5 rounded-xl border border-white/10 max-w-[90%] mx-auto">
        {visibleWords.map((w, idx) => {
          const isActive = w.word === activeWordText;
          return (
            <span
              key={`${w.word}-${idx}`}
              style={{
                fontFamily: "Inter, sans-serif",
                color: isActive ? "#FFF59D" : "#FFFFFF",
                fontWeight: isActive ? 800 : 500,
              }}
              className="text-xs sm:text-sm tracking-normal transition-colors"
            >
              {w.word}
            </span>
          );
        })}
      </div>
    );
  }

  // 7. Ali Abdaal Modern
  if (norm.includes("ali") || norm.includes("abdaal")) {
    return (
      <div className="inline-flex max-w-[92%] items-center justify-center gap-1.5 rounded-full border border-white/20 bg-slate-900/90 px-4 py-1.5 shadow-xl backdrop-blur-md">
        {visibleWords.map((w, idx) => {
          const isActive = w.word === activeWordText;
          return (
            <span
              key={`${w.word}-${idx}`}
              style={{
                fontFamily: "Inter, sans-serif",
                color: isActive ? "#FDE047" : "#CBD5E1",
                fontWeight: isActive ? 800 : 500,
                textShadow: isActive ? "0 0 10px rgba(253,224,71,0.6)" : "none",
                transform: isActive ? "scale(1.08)" : "scale(1)",
              }}
              className="text-xs sm:text-sm transition-all inline-block"
            >
              {w.word}
            </span>
          );
        })}
      </div>
    );
  }

  // 8. Doctor Pill
  if (norm.includes("doctor")) {
    return (
      <div className="inline-flex max-w-[92%] items-center justify-center gap-1.5 rounded-full border border-teal-400/40 bg-teal-950/85 px-3.5 py-1.5 shadow-xl backdrop-blur-md">
        {visibleWords.map((w, idx) => {
          const isActive = w.word === activeWordText;
          return (
            <span
              key={`${w.word}-${idx}`}
              style={{
                fontFamily: "Inter, sans-serif",
                backgroundColor: isActive ? "#0D9488" : "transparent",
                color: "#FFFFFF",
                fontWeight: isActive ? 800 : 500,
                padding: isActive ? "2px 8px" : "0",
                borderRadius: isActive ? "9999px" : "0",
              }}
              className="text-xs sm:text-sm transition-all inline-block"
            >
              {w.word}
            </span>
          );
        })}
      </div>
    );
  }

  // 9. Devane Luxury Serif
  if (norm.includes("luxe") || norm.includes("serif") || norm.includes("luxury")) {
    return (
      <div className="flex flex-wrap items-center justify-center gap-2 select-none italic">
        {visibleWords.map((w, idx) => {
          const isActive = w.word === activeWordText;
          return (
            <span
              key={`${w.word}-${idx}`}
              style={{
                fontFamily: "Playfair Display, Georgia, serif",
                color: isActive ? "#E5C07B" : "#F8FAFC",
                fontWeight: isActive ? 800 : 400,
                textShadow: "0 2px 10px rgba(0,0,0,0.9)",
                transform: isActive ? "scale(1.15)" : "scale(1)",
              }}
              className="text-sm sm:text-base tracking-wide transition-all inline-block"
            >
              {w.word}
            </span>
          );
        })}
      </div>
    );
  }

  // 10. Cinema Classic
  if (norm.includes("cinema")) {
    return (
      <div className="inline-block bg-black/80 px-4 py-1.5 rounded border border-white/10 text-center select-none shadow-xl">
        <div className="flex items-center justify-center gap-2">
          {visibleWords.map((w, idx) => {
            const isActive = w.word === activeWordText;
            return (
              <span
                key={`${w.word}-${idx}`}
                style={{
                  fontFamily: "Montserrat, sans-serif",
                  color: isActive ? "#FFEAA7" : "#FFFFFF",
                  fontWeight: isActive ? 800 : 500,
                  letterSpacing: "0.06em",
                }}
                className="text-xs sm:text-sm uppercase transition-colors"
              >
                {w.word}
              </span>
            );
          })}
        </div>
      </div>
    );
  }

  // 11. Podcast Studio Master
  if (norm.includes("podcast") || norm.includes("studio")) {
    return (
      <div className="inline-flex items-center gap-2 rounded-xl bg-zinc-900/90 border border-white/15 px-3.5 py-1.5 shadow-xl backdrop-blur-md select-none">
        <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse shrink-0" />
        <div className="flex items-center gap-1.5">
          {visibleWords.map((w, idx) => {
            const isActive = w.word === activeWordText;
            return (
              <span
                key={`${w.word}-${idx}`}
                style={{
                  fontFamily: "Inter, sans-serif",
                  color: isActive ? "#38BDF8" : "#E2E8F0",
                  fontWeight: isActive ? 800 : 500,
                }}
                className="text-xs sm:text-sm transition-colors"
              >
                {w.word}
              </span>
            );
          })}
        </div>
      </div>
    );
  }

  // 12. Deep Discussion
  if (norm.includes("deep") || norm.includes("discussion")) {
    return (
      <div className="flex flex-wrap items-center justify-center gap-2 select-none">
        {visibleWords.map((w, idx) => {
          const isActive = w.word === activeWordText;
          return (
            <span
              key={`${w.word}-${idx}`}
              style={{
                fontFamily: "Inter, sans-serif",
                color: isActive ? "#67E8F9" : "#94A3B8",
                fontWeight: isActive ? 800 : 500,
                textShadow: isActive ? "0 0 12px rgba(103,232,249,0.8)" : "none",
              }}
              className="text-xs sm:text-sm transition-colors"
            >
              {w.word}
            </span>
          );
        })}
      </div>
    );
  }

  // 13. Discipline Bold
  if (norm.includes("discipline")) {
    return (
      <div className="flex flex-wrap items-center justify-center gap-2 select-none">
        {visibleWords.map((w, idx) => {
          const isActive = w.word === activeWordText;
          return (
            <span
              key={`${w.word}-${idx}`}
              style={{
                fontFamily: "Impact, Anton, sans-serif",
                WebkitTextStroke: "1.5px #000",
                color: isActive ? "#EF4444" : "#FFFFFF",
                transform: isActive ? "scale(1.15)" : "scale(1)",
              }}
              className="text-base sm:text-lg font-black uppercase tracking-tight transition-transform inline-block"
            >
              {w.word}
            </span>
          );
        })}
      </div>
    );
  }

  // 14. Red Wipe Highlight
  if (norm.includes("red") || norm.includes("wipe")) {
    return (
      <div className="flex flex-wrap items-center justify-center gap-1.5 select-none">
        {visibleWords.map((w, idx) => {
          const isActive = w.word === activeWordText;
          return (
            <span
              key={`${w.word}-${idx}`}
              style={{
                fontFamily: "Montserrat, sans-serif",
                backgroundColor: isActive ? "#DC2626" : "transparent",
                color: "#FFFFFF",
                fontWeight: isActive ? 900 : 600,
                padding: isActive ? "2px 8px" : "0",
                borderRadius: isActive ? "6px" : "0",
                textShadow: isActive ? "none" : "0 2px 6px rgba(0,0,0,0.9)",
              }}
              className="text-xs sm:text-sm uppercase tracking-wide transition-all inline-block"
            >
              {w.word}
            </span>
          );
        })}
      </div>
    );
  }

  // 15. Spark Yellow
  if (norm.includes("spark")) {
    return (
      <div className="flex flex-wrap items-center justify-center gap-2 select-none">
        {visibleWords.map((w, idx) => {
          const isActive = w.word === activeWordText;
          return (
            <span
              key={`${w.word}-${idx}`}
              style={{
                fontFamily: "Montserrat, sans-serif",
                color: isActive ? "#FACC15" : "#FFFFFF",
                fontWeight: 900,
                textShadow: isActive
                  ? "0 0 14px rgba(250,204,21,0.95), 0 0 24px rgba(250,204,21,0.6)"
                  : "0 2px 6px rgba(0,0,0,0.8)",
                transform: isActive ? "scale(1.12)" : "scale(1)",
              }}
              className="text-sm sm:text-base uppercase tracking-tight transition-all inline-block"
            >
              {w.word}
            </span>
          );
        })}
      </div>
    );
  }

  // 16. Scribble Handwritten
  if (norm.includes("scribble") || norm.includes("handwritten")) {
    return (
      <div className="flex flex-wrap items-center justify-center gap-2 select-none rotate-[-2deg]">
        {visibleWords.map((w, idx) => {
          const isActive = w.word === activeWordText;
          return (
            <span
              key={`${w.word}-${idx}`}
              style={{
                fontFamily: "Caveat, cursive",
                color: isActive ? "#FDE047" : "#FFFFFF",
                fontWeight: 700,
                fontSize: isActive ? "1.45rem" : "1.25rem",
                textShadow: "0 2px 4px rgba(0,0,0,0.8)",
              }}
              className="transition-all inline-block"
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
    <div className="flex flex-wrap items-center justify-center gap-2 select-none">
      {visibleWords.map((w, idx) => {
        const isActive = w.word === activeWordText;
        return (
          <span
            key={`${w.word}-${idx}`}
            style={{
              fontFamily: "Montserrat, sans-serif",
              color: isActive ? "#FFE14D" : "#FFFFFF",
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
