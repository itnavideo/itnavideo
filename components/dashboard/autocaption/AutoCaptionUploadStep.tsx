"use client";

import React, { useRef, useState, ChangeEvent } from "react";
import Link from "next/link";
import {
  Upload,
  Globe,
  FileVideo,
  Sparkles,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  Loader2,
  X,
  Play,
  Layers,
  Zap,
} from "lucide-react";
import BrandLogo from "@/components/brand/BrandLogo";

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

const CAPTION_LANGUAGES = [
  { id: "same", label: "Same as Audio (Roman Hinglish / English)" },
  { id: "en", label: "English (Latin Script)" },
  { id: "hi", label: "Hinglish (Roman Hindi - No Devanagari)" },
  { id: "es", label: "Spanish (Español)" },
  { id: "fr", label: "French (Français)" },
  { id: "de", label: "German (Deutsch)" },
  { id: "pt", label: "Portuguese (Português)" },
  { id: "id", label: "Indonesian (Bahasa)" },
];

export interface AutoCaptionUploadStepProps {
  selectedFile: File | null;
  onSelectFile: (file: File | null) => void;
  spokenLanguage: string;
  onSpokenLanguageChange: (lang: string) => void;
  captionLanguage: string;
  onCaptionLanguageChange: (lang: string) => void;
  onContinue: () => Promise<void>;
  isProcessing: boolean;
  processingProgress: number;
  processingMessage: string;
  processingError: string | null;
  onClearError: () => void;
  creditsRemaining?: number;
}

export function AutoCaptionUploadStep({
  selectedFile,
  onSelectFile,
  spokenLanguage,
  onSpokenLanguageChange,
  captionLanguage,
  onCaptionLanguageChange,
  onContinue,
  isProcessing,
  processingProgress,
  processingMessage,
  processingError,
  onClearError,
  creditsRemaining,
}: AutoCaptionUploadStepProps) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      onSelectFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onSelectFile(e.target.files[0]);
    }
    e.target.value = "";
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 flex flex-col selection:bg-[#FF5722]/20 selection:text-slate-900 font-sans">
      {/* ── Top Header Bar (Clean YouTube Studio White) ── */}
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <BrandLogo size="sm" showBadge={false} variant="light" />
            <div className="h-4 w-px bg-slate-200 hidden sm:block" />
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-slate-50 hover:bg-slate-100 hover:border-slate-300 px-3 py-1.5 text-xs font-bold text-slate-700 hover:text-slate-900 transition group"
            >
              <ArrowLeft size={13} className="group-hover:-translate-x-0.5 transition-transform text-[#FF5722]" />
              <span className="hidden sm:inline">Back to Dashboard</span>
            </Link>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 rounded-full border border-orange-200 bg-orange-50/80 px-3 py-1.5 text-xs font-black text-slate-800 shadow-2xs">
              <Zap size={13} className="text-[#FF5722] fill-[#FF5722]" />
              <span>{creditsRemaining !== undefined ? `${creditsRemaining} Credits` : "908 Credits"}</span>
            </div>
            <Link
              href="/auto-caption/templates"
              className="hidden sm:inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white hover:bg-slate-50 px-3.5 py-1.5 text-xs font-bold text-slate-700 hover:text-[#FF5722] transition"
            >
              <Sparkles size={13} className="text-[#FF5722]" />
              <span>Templates</span>
            </Link>
          </div>
        </div>
      </header>

      {/* ── Main Upload Canvas ── */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-10 sm:py-16">
        <div className="w-full max-w-xl space-y-6">
          {/* Headline & Subtitle */}
          <div className="text-center space-y-2">
            <h1 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight font-jakarta">
              Create{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF5722] via-[#FF7043] to-[#FFA000]">
                Captioned Reels
              </span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 font-medium">
              Upload your video and generate automatic word-synchronized captions
            </p>
          </div>

          {/* Centered White Card (WhiteStair Style) */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-xl shadow-slate-200/60 p-6 sm:p-8 space-y-6 transition-all">
            {/* Hidden native input */}
            <input
              ref={fileInputRef}
              type="file"
              accept="video/*,audio/*"
              className="hidden"
              onChange={handleFileChange}
              disabled={isProcessing}
            />

            {/* Error Banner */}
            {processingError && (
              <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-xs flex items-start justify-between gap-3 text-red-700 animate-in fade-in">
                <div className="flex items-start gap-2.5">
                  <AlertCircle size={16} className="text-red-500 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold block text-red-900">Transcription Note</span>
                    <span>{processingError}</span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={onClearError}
                  className="text-red-400 hover:text-red-700 p-1"
                >
                  <X size={14} />
                </button>
              </div>
            )}

            {/* Upload Area */}
            {!selectedFile ? (
              <div
                onClick={() => !isProcessing && fileInputRef.current?.click()}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`relative flex flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed p-8 sm:p-12 text-center transition-all cursor-pointer group ${
                  isDragging
                    ? "border-[#FF5722] bg-orange-50/70 scale-[1.01]"
                    : "border-slate-300 hover:border-[#FF5722]/80 bg-slate-50/60 hover:bg-orange-50/30"
                }`}
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-100/80 text-[#FF5722] group-hover:scale-110 transition-transform shadow-xs">
                  <Upload size={24} strokeWidth={2.4} />
                </div>
                <div className="space-y-1">
                  <p className="text-sm sm:text-base font-black text-slate-800 font-jakarta">
                    Click or drag video here
                  </p>
                  <p className="text-xs text-slate-400 font-medium">
                    MP4, MOV, Audio • Max 90s • 9:16 Vertical Recommended
                  </p>
                </div>

                <div className="pt-2">
                  <button
                    type="button"
                    onClick={async (e) => {
                      e.stopPropagation();
                      try {
                        const res = await fetch("/assets/reusable/testing1.mp3");
                        const blob = await res.blob();
                        const sampleFile = new File([blob], "confident-people-reel.mp3", { type: "audio/mpeg" });
                        onSelectFile(sampleFile);
                      } catch (err) {
                        console.warn("Could not load sample audio:", err);
                      }
                    }}
                    className="inline-flex items-center gap-1.5 rounded-full border border-orange-200 bg-orange-50 hover:bg-orange-100 text-xs font-bold text-[#FF5722] px-3.5 py-1.5 transition cursor-pointer shadow-2xs hover:scale-105 active:scale-95"
                  >
                    <Sparkles size={13} className="text-[#FF5722]" />
                    <span>Try with sample clip</span>
                  </button>
                </div>
              </div>
            ) : (
              /* Selected File Preview Box */
              <div className="relative rounded-2xl border border-slate-200 bg-slate-50/70 p-4 sm:p-5 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-orange-100 text-[#FF5722] shrink-0">
                    <FileVideo size={22} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-black text-slate-900 truncate font-jakarta">
                      {selectedFile.name}
                    </p>
                    <p className="text-xs text-slate-500 font-medium mt-0.5">
                      {(selectedFile.size / (1024 * 1024)).toFixed(1)} MB • Ready for processing
                    </p>
                  </div>
                </div>

                {!isProcessing && (
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="shrink-0 rounded-xl border border-slate-200 bg-white hover:bg-slate-100 px-3.5 py-1.5 text-xs font-bold text-slate-700 transition shadow-2xs"
                  >
                    Change
                  </button>
                )}
              </div>
            )}

            {/* Language Controls (Only 2 Selectors as requested) */}
            <div className="space-y-4 pt-1">
              {/* 1. Audio Spoken Selector */}
              <div className="space-y-1.5">
                <label className="flex items-center gap-2 text-xs font-bold text-slate-700">
                  <Globe size={14} className="text-[#FF5722]" />
                  <span>Audio Spoken</span>
                </label>
                <div className="relative">
                  <select
                    value={spokenLanguage}
                    onChange={(e) => onSpokenLanguageChange(e.target.value)}
                    disabled={isProcessing}
                    className="w-full appearance-none rounded-xl border border-slate-200 bg-slate-50/80 hover:bg-slate-100/60 px-4 py-3 text-xs sm:text-sm font-semibold text-slate-800 focus:border-[#FF5722] focus:bg-white focus:outline-none focus:ring-3 focus:ring-[#FF5722]/15 transition cursor-pointer"
                  >
                    {AUDIO_SPOKEN_LANGUAGES.map((lang) => (
                      <option key={lang.id} value={lang.id}>
                        {lang.label}
                      </option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-slate-400">
                    ▼
                  </div>
                </div>
              </div>

              {/* 2. Caption Language Selector */}
              <div className="space-y-1.5">
                <label className="flex items-center gap-2 text-xs font-bold text-slate-700">
                  <Globe size={14} className="text-[#FFA000]" />
                  <span>Caption Language</span>
                </label>
                <div className="relative">
                  <select
                    value={captionLanguage}
                    onChange={(e) => onCaptionLanguageChange(e.target.value)}
                    disabled={isProcessing}
                    className="w-full appearance-none rounded-xl border border-slate-200 bg-slate-50/80 hover:bg-slate-100/60 px-4 py-3 text-xs sm:text-sm font-semibold text-slate-800 focus:border-[#FF5722] focus:bg-white focus:outline-none focus:ring-3 focus:ring-[#FF5722]/15 transition cursor-pointer"
                  >
                    {CAPTION_LANGUAGES.map((lang) => (
                      <option key={lang.id} value={lang.id}>
                        {lang.label}
                      </option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-slate-400">
                    ▼
                  </div>
                </div>
              </div>
            </div>

            {/* Processing Progress State (When Upload & Transcription is active) */}
            {isProcessing && (
              <div className="rounded-2xl border border-orange-200 bg-orange-50/60 p-4 space-y-2.5 animate-in fade-in">
                <div className="flex items-center justify-between text-xs font-bold">
                  <span className="flex items-center gap-2 text-slate-800">
                    <Loader2 size={14} className="animate-spin text-[#FF5722]" />
                    <span>{processingMessage || "Processing video & transcribing speech..."}</span>
                  </span>
                  <span className="text-[#FF5722] font-black">{Math.round(processingProgress)}%</span>
                </div>
                {/* Progress bar */}
                <div className="h-2 w-full rounded-full bg-orange-100 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-[#FF5722] to-[#FFA000] transition-all duration-300 rounded-full"
                    style={{ width: `${Math.max(5, processingProgress)}%` }}
                  />
                </div>
                <p className="text-[11px] text-slate-500 text-center font-medium">
                  Please keep this page open while we prepare your caption workspace
                </p>
              </div>
            )}

            {/* Action CTA Button */}
            <button
              type="button"
              onClick={onContinue}
              disabled={!selectedFile || isProcessing}
              className={`w-full min-h-[52px] rounded-2xl text-sm font-black transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm ${
                !selectedFile
                  ? "bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed"
                  : isProcessing
                  ? "bg-gradient-to-r from-[#FF5722] to-[#FF7043] text-white cursor-wait opacity-90"
                  : "bg-gradient-to-r from-[#FF5722] via-[#FF7043] to-[#FFA000] text-white hover:brightness-105 active:scale-98 shadow-lg shadow-[#FF5722]/25 font-jakarta"
              }`}
            >
              {isProcessing ? (
                <>
                  <Loader2 size={16} className="animate-spin text-white" />
                  <span>Processing Transcription...</span>
                </>
              ) : !selectedFile ? (
                <span>Upload Video First</span>
              ) : (
                <>
                  <Sparkles size={16} className="text-white" />
                  <span>Upload Video &amp; Continue →</span>
                </>
              )}
            </button>
          </div>

          {/* Clean Micro Features / Trust badges */}
          <div className="grid grid-cols-3 gap-2 text-center pt-2">
            <div className="p-2">
              <span className="text-xs font-black text-slate-800 block">Fast Transcription</span>
              <span className="text-[11px] text-slate-400">Groq Whisper Engine</span>
            </div>
            <div className="p-2">
              <span className="text-xs font-black text-slate-800 block">40+ Styles</span>
              <span className="text-[11px] text-slate-400">Viral Kinetic Motion</span>
            </div>
            <div className="p-2">
              <span className="text-xs font-black text-slate-800 block">1080p Export</span>
              <span className="text-[11px] text-slate-400">Clean 60/30 FPS MP4</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
