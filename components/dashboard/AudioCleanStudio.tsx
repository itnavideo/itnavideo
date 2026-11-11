"use client";

import React, { useState, useMemo, useRef, useEffect } from "react";
import {
  Mic,
  FileText,
  Upload,
  CheckCircle2,
  Download,
  Sparkles,
  RefreshCw,
  Plus,
  Play,
  Pause,
  Check,
  ChevronDown,
  ChevronUp,
  Copy,
  Scissors,
  Sliders,
  ShieldCheck,
  Music2,
  FileAudio,
  ArrowRightLeft,
  RotateCcw,
  ClipboardPaste,
  ArrowRight,
  Clock,
  Volume2,
  Edit3,
  Layers,
  Activity,
  Zap,
  Radio,
  ArrowUpRight,
} from "lucide-react";
import type {
  AudioCleanOptions,
  AudioCleanResult,
  AudioAnalysisResult,
  AudioTranscriptData,
  DetectedPause,
} from "@/services/ai/audioCleanService";
import { blocksToMarkdown } from "@/services/ai/structuredScriptService";

export type AudioCleanStudioOptions = AudioCleanOptions & {
  exportFormat: "mp3" | "wav" | "m4a";
  vocalTone?: "warmth" | "clarity" | "natural";
};

export type AudioCleanStudioAnalysis = AudioAnalysisResult & {
  mediaKey: string;
  rawTranscript?: AudioTranscriptData;
};

export type AudioCleanStudioResult = Omit<
  AudioCleanResult,
  "outputUrl" | "originalDuration" | "cleanedDuration" | "stats"
> & {
  outputUrl: string;
  originalDuration: number;
  cleanedDuration: number;
  stats: NonNullable<AudioCleanResult["stats"]> & {
    voiceMode?: string;
    changesSummary?: string[];
  };
};

interface AudioCleanStudioProps {
  selectedFile: File | null;
  onSelectFile: (file: File | null) => void;
  audioCleanOptions?: any;
  setAudioCleanOptions?: any;
  audioCleanAnalysis?: any;
  setAudioCleanAnalysis?: any;
  isAnalyzingAudio?: boolean;
  onReanalyzeWithScript?: (pastedScript: string) => Promise<void>;
  audioCleanResult?: any;
  onCleanAudio?: () => void;
  isCleaning?: boolean;
  onReset?: () => void;
  onBackToEdit?: () => void;
}

export function AudioCleanStudio({
  selectedFile,
  onSelectFile,
  audioCleanOptions,
  setAudioCleanOptions,
  audioCleanAnalysis,
  setAudioCleanAnalysis,
  isAnalyzingAudio,
  onReanalyzeWithScript,
  audioCleanResult,
  onCleanAudio,
  isCleaning,
  onReset,
  onBackToEdit,
}: AudioCleanStudioProps) {
  // 4-Step Stepper State
  const [currentStep, setCurrentStep] = useState<"upload" | "pacing" | "transcript" | "master">("upload");
  const [showPauseList, setShowPauseList] = useState(false);
  const [copiedScript, setCopiedScript] = useState(false);
  const [compareMode, setCompareMode] = useState<"after" | "before">("after");
  const [isDragging, setIsDragging] = useState(false);
  const [hasDownloaded, setHasDownloaded] = useState(false);

  // Audio playback state
  const [isPlayingBefore, setIsPlayingBefore] = useState(false);
  const [isPlayingAfter, setIsPlayingAfter] = useState(false);
  const [currentTimeBefore, setCurrentTimeBefore] = useState(0);
  const [currentTimeAfter, setCurrentTimeAfter] = useState(0);
  const [durationBefore, setDurationBefore] = useState(0);
  const [durationAfter, setDurationAfter] = useState(0);

  const rawAudioRef = useRef<HTMLAudioElement | null>(null);
  const cleanAudioRef = useRef<HTMLAudioElement | null>(null);
  const [rawAudioUrl, setRawAudioUrl] = useState<string | null>(null);

  // Audio Blob URL Memory Protection
  useEffect(() => {
    if (!selectedFile) {
      setRawAudioUrl(null);
      return;
    }
    const url = URL.createObjectURL(selectedFile);
    setRawAudioUrl(url);
    return () => {
      URL.revokeObjectURL(url);
    };
  }, [selectedFile]);

  // Automatically navigate steps based on pipeline progression
  useEffect(() => {
    if (audioCleanResult) {
      setCurrentStep("master");
    } else if (audioCleanAnalysis && !isAnalyzingAudio) {
      if (currentStep === "upload") {
        setCurrentStep("pacing");
      }
    }
  }, [audioCleanResult, audioCleanAnalysis, isAnalyzingAudio]);

  // Handle playing Before audio with proportional A/B scrub sync
  const handleTogglePlayBefore = () => {
    if (!rawAudioRef.current) return;
    if (isPlayingBefore) {
      rawAudioRef.current.pause();
      setIsPlayingBefore(false);
    } else {
      if (cleanAudioRef.current && isPlayingAfter) {
        const currentCleanTime = cleanAudioRef.current.currentTime || 0;
        const cleanDur = cleanAudioRef.current.duration || audioCleanResult?.cleanedDuration || 1;
        const origDur = rawAudioRef.current.duration || audioCleanResult?.originalDuration || 1;
        if (cleanDur > 0 && origDur > 0) {
          rawAudioRef.current.currentTime = Math.min(origDur, (currentCleanTime / cleanDur) * origDur);
        }
        cleanAudioRef.current.pause();
        setIsPlayingAfter(false);
      }
      setCompareMode("before");
      rawAudioRef.current
        .play()
        .then(() => setIsPlayingBefore(true))
        .catch(() => { });
    }
  };

  // Handle playing After audio with proportional A/B scrub sync
  const handleTogglePlayAfter = () => {
    if (!cleanAudioRef.current) return;
    if (isPlayingAfter) {
      cleanAudioRef.current.pause();
      setIsPlayingAfter(false);
    } else {
      if (rawAudioRef.current && isPlayingBefore) {
        const currentRawTime = rawAudioRef.current.currentTime || 0;
        const origDur = rawAudioRef.current.duration || audioCleanResult?.originalDuration || 1;
        const cleanDur = cleanAudioRef.current.duration || audioCleanResult?.cleanedDuration || 1;
        if (origDur > 0 && cleanDur > 0) {
          cleanAudioRef.current.currentTime = Math.min(cleanDur, (currentRawTime / origDur) * cleanDur);
        }
        rawAudioRef.current.pause();
        setIsPlayingBefore(false);
      }
      setCompareMode("after");
      cleanAudioRef.current
        .play()
        .then(() => setIsPlayingAfter(true))
        .catch(() => { });
    }
  };

  // Complete State Reset Handler
  const handleFullReset = () => {
    if (rawAudioRef.current) {
      rawAudioRef.current.pause();
      rawAudioRef.current.currentTime = 0;
    }
    if (cleanAudioRef.current) {
      cleanAudioRef.current.pause();
      cleanAudioRef.current.currentTime = 0;
    }
    setIsPlayingBefore(false);
    setIsPlayingAfter(false);
    setCurrentTimeBefore(0);
    setCurrentTimeAfter(0);
    setHasDownloaded(false);
    setCopiedScript(false);
    setCurrentStep("upload");
    if (onReset) onReset();
  };

  // Instant seamless A/B toggle
  const handleInstantABSwitch = () => {
    const targetMode = compareMode === "after" ? "before" : "after";
    setCompareMode(targetMode);

    if (targetMode === "before") {
      const currentCleanTime = cleanAudioRef.current?.currentTime || 0;
      const cleanDur = cleanAudioRef.current?.duration || audioCleanResult?.cleanedDuration || 1;
      const origDur = rawAudioRef.current?.duration || audioCleanResult?.originalDuration || 1;
      const targetTime = Math.min(origDur, (currentCleanTime / cleanDur) * origDur);

      if (cleanAudioRef.current) {
        cleanAudioRef.current.pause();
        setIsPlayingAfter(false);
      }
      if (rawAudioRef.current) {
        rawAudioRef.current.currentTime = targetTime;
        rawAudioRef.current
          .play()
          .then(() => setIsPlayingBefore(true))
          .catch(() => { });
      }
    } else {
      const currentRawTime = rawAudioRef.current?.currentTime || 0;
      const origDur = rawAudioRef.current?.duration || audioCleanResult?.originalDuration || 1;
      const cleanDur = cleanAudioRef.current?.duration || audioCleanResult?.cleanedDuration || 1;
      const targetTime = Math.min(cleanDur, (currentRawTime / origDur) * cleanDur);

      if (rawAudioRef.current) {
        rawAudioRef.current.pause();
        setIsPlayingBefore(false);
      }
      if (cleanAudioRef.current) {
        cleanAudioRef.current.currentTime = targetTime;
        cleanAudioRef.current
          .play()
          .then(() => setIsPlayingAfter(true))
          .catch(() => { });
      }
    }
  };

  const formatTime = (seconds: number) => {
    if (!seconds || isNaN(seconds)) return "00:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const currentMarkdown = useMemo(() => {
    if (!audioCleanAnalysis) return "";
    if (audioCleanAnalysis.markdown) return audioCleanAnalysis.markdown;
    if (audioCleanAnalysis.structuredBlocks) return blocksToMarkdown(audioCleanAnalysis.structuredBlocks);
    return audioCleanAnalysis.transcript || "";
  }, [audioCleanAnalysis]);

  const handleMarkdownChange = (newMarkdown: string) => {
    if (!setAudioCleanAnalysis || !audioCleanAnalysis) return;
    const words = newMarkdown.trim().split(/\s+/).filter(Boolean).length;
    setAudioCleanAnalysis({
      ...audioCleanAnalysis,
      markdown: newMarkdown,
      stats: {
        ...audioCleanAnalysis.stats,
        totalWords: words,
      },
    });
  };

  const handleResetToOriginal = () => {
    if (!setAudioCleanAnalysis || !audioCleanAnalysis) return;
    const originalText = audioCleanAnalysis.transcript || "";
    const words = originalText.trim().split(/\s+/).filter(Boolean).length;
    setAudioCleanAnalysis({
      ...audioCleanAnalysis,
      markdown: originalText,
      stats: {
        ...audioCleanAnalysis.stats,
        totalWords: words,
      },
    });
  };

  const handlePasteClipboard = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) {
        handleMarkdownChange(text);
      }
    } catch {
      // Ignore if clipboard permission denied
    }
  };

  const handleCopyScript = () => {
    const textToCopy = currentMarkdown;
    if (textToCopy) {
      navigator.clipboard.writeText(textToCopy);
      setCopiedScript(true);
      setTimeout(() => setCopiedScript(false), 2000);
    }
  };

  const wordCount = useMemo(() => {
    if (audioCleanAnalysis?.stats?.totalWords) return audioCleanAnalysis.stats.totalWords;
    if (audioCleanAnalysis?.transcript) {
      return audioCleanAnalysis.transcript.trim().split(/\s+/).filter(Boolean).length;
    }
    return 0;
  }, [audioCleanAnalysis]);

  const detectedPauses: DetectedPause[] = useMemo(() => {
    if (audioCleanAnalysis?.detectedPauses && Array.isArray(audioCleanAnalysis.detectedPauses)) {
      return audioCleanAnalysis.detectedPauses;
    }
    return [];
  }, [audioCleanAnalysis]);

  const exportFmt = audioCleanOptions?.exportFormat || "mp3";

  return (
    <div className="h-full flex flex-col bg-white overflow-hidden text-slate-800">
      {/* ── ROW 1: 4-STEP GUIDED STEPPER BAR (Unified Studio Stepper) ── */}
      <div className="border-b border-slate-200/90 bg-white px-4 sm:px-8 py-3 shrink-0 shadow-2xs">
        <div className="max-w-6xl mx-auto flex items-center justify-center">
          {/* Stepper Navigation Pills */}
          <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto no-scrollbar py-0.5 bg-slate-50 border border-slate-200/90 rounded-2xl p-1.5 shadow-2xs">
            {[
              { id: "upload", label: "Upload", icon: Upload, completed: !!selectedFile },
              { id: "pacing", label: "Pacing", icon: Sliders, completed: !!audioCleanOptions?.pacing },
              { id: "transcript", label: "Transcript", icon: FileText, completed: !!audioCleanAnalysis },
              { id: "master", label: "Master", icon: Music2, completed: !!audioCleanResult },
            ].map((step, idx) => {
              const Icon = step.icon;
              const isActive = currentStep === step.id;
              const isDone = step.completed && !isActive;

              return (
                <button
                  key={step.id}
                  type="button"
                  onClick={() => setCurrentStep(step.id as any)}
                  className={`inline-flex items-center gap-2 px-3 sm:px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    isActive
                      ? "bg-white text-orange-600 shadow-xs border border-orange-200/60 ring-1 ring-orange-500/20"
                      : isDone
                        ? "text-slate-800 hover:text-slate-900 hover:bg-white/60"
                        : "text-slate-400 hover:text-slate-600"
                  }`}
                >
                  <span
                    className={`flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-black ${
                      isActive
                        ? "bg-orange-600 text-white"
                        : isDone
                          ? "bg-emerald-500 text-white"
                          : "bg-slate-200 text-slate-600"
                    }`}
                  >
                    {isDone ? <Check size={11} strokeWidth={3} /> : idx + 1}
                  </span>
                  <span>{step.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── ROW 2: STEP CONTENT (SCROLLABLE WORKSPACE) ── */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
        <div className="max-w-5xl mx-auto space-y-6">

          {/* ──────────────── STEP 1: UPLOAD AUDIO / VIDEO ──────────────── */}
          {currentStep === "upload" && (
            <div className="space-y-6">
              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDragging(true);
                }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={(e) => {
                  e.preventDefault();
                  setIsDragging(false);
                  const file = e.dataTransfer.files?.[0];
                  if (file) onSelectFile(file);
                }}
                className={`relative flex flex-col items-center justify-center rounded-3xl border-2 border-dashed p-10 text-center transition-all ${isDragging
                  ? "border-orange-500 bg-orange-50/30 scale-[1.01]"
                  : selectedFile
                    ? "border-emerald-400 bg-emerald-50/40"
                    : "border-slate-300 bg-slate-50/60 hover:border-orange-400 hover:bg-slate-50"
                  }`}
              >
                {selectedFile ? (
                  <div className="flex flex-col items-center gap-3">
                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700 border border-emerald-300 shadow-xs">
                      <FileAudio size={32} />
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center justify-center gap-2">
                        <p className="text-base font-bold text-slate-900">{selectedFile.name}</p>
                        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-0.5 text-[11px] font-bold text-emerald-800 border border-emerald-300">
                          <Check size={12} /> Ready
                        </span>
                      </div>
                      <p className="text-xs text-slate-500">
                        {(selectedFile.size / (1024 * 1024)).toFixed(1)} MB • Audio track ready for silence scanning
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 mt-3">
                      <label className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2 text-xs font-bold text-slate-700 transition hover:bg-slate-100 shadow-2xs">
                        <Upload size={13} />
                        Change Audio File
                        <input
                          type="file"
                          accept="audio/*,video/*,.mp3,.m4a,.wav,.aac,.mp4,.mov"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) onSelectFile(file);
                          }}
                        />
                      </label>

                      <button
                        type="button"
                        onClick={() => setCurrentStep("pacing")}
                        className="inline-flex items-center gap-2 rounded-xl bg-orange-600 px-5 py-2 text-xs font-bold text-white shadow-xs hover:bg-orange-700 transition cursor-pointer"
                      >
                        <span>Configure Pacing</span>
                        <ArrowRight size={14} />
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-3">
                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-orange-50 text-orange-600 border border-orange-200 shadow-xs">
                      <Upload size={28} className="text-orange-600" />
                    </div>
                    <div className="space-y-1 text-center">
                      <h3 className="text-lg sm:text-xl font-black text-slate-900">
                        Upload your voiceover or video
                      </h3>
                      <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto">
                        Remove dead air and awkward silences while keeping your voice tone 100% natural.
                      </p>
                    </div>

                    <div className="flex flex-col items-center gap-2.5 mt-2">
                      <label className="inline-flex cursor-pointer items-center justify-center gap-2.5 rounded-2xl bg-orange-600 hover:bg-orange-700 px-8 py-3.5 text-sm font-black text-white shadow-md shadow-orange-500/20 transition active:scale-95 cursor-pointer">
                        <Upload size={16} />
                        Upload Audio or Video
                        <input
                          type="file"
                          accept="audio/*,video/*,.mp3,.m4a,.wav,.aac,.mp4,.mov"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) onSelectFile(file);
                          }}
                        />
                      </label>

                      <button
                        type="button"
                        onClick={() => {
                          const sampleBlob = new Blob([new Uint8Array(1024)], { type: "audio/mp3" });
                          const sampleFile = new File([sampleBlob], "sample_voiceover_recording.mp3", {
                            type: "audio/mp3",
                          });
                          onSelectFile(sampleFile);
                        }}
                        className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-4 py-1.5 text-xs font-bold text-slate-700 transition hover:bg-slate-100 cursor-pointer shadow-2xs mt-1"
                      >
                        <Sparkles size={13} className="text-orange-600" />
                        <span>Or test with sample audio</span>
                      </button>

                      <p className="text-[11px] text-slate-400 mt-1">
                        Audio: MP3 • WAV • M4A • AAC &nbsp;|&nbsp; Video: MP4 • MOV (Auto extracted) • Up to 12 mins
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Analysis Loading Card */}
              {isAnalyzingAudio && (
                <div className="rounded-2xl border border-orange-200 bg-orange-50/30 p-8 text-center space-y-3">
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-orange-100 text-orange-600">
                    <RefreshCw size={22} className="animate-spin" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">Transcribing &amp; Scanning Audio Timeline...</h3>
                    <p className="mt-1 text-xs text-slate-600 max-w-md mx-auto leading-relaxed">
                      Measuring speech cadence and mapping all silence gaps across the recording.
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ──────────────── STEP 2: PACING & MASTERING OPTIONS ──────────────── */}
          {currentStep === "pacing" && (
            <div className="space-y-6">
              <div className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-xs space-y-6">
                <div>
                  <h3 className="text-base font-bold text-slate-900">Select Voice Pacing &amp; Silence Threshold</h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Choose how aggressively dead air should be trimmed across the spoken timeline.
                  </p>
                </div>

                {/* 3 Pacing Presets */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
                  {[
                    {
                      id: "fast",
                      title: "⚡ Fast Retention",
                      timing: "300ms trigger → 100ms gap",
                      desc: "Cuts every pause >300ms down to a crisp 100ms buffer. Eliminates dead air for high-retention video.",
                      recommended: true,
                    },
                    {
                      id: "natural",
                      title: "🎙️ Natural Flow",
                      timing: "300ms trigger → 140ms gap",
                      desc: "Maintains smooth natural speech cadence while trimming excessive hesitation.",
                      recommended: false,
                    },
                    {
                      id: "relaxed",
                      title: "☕ Relaxed Cadence",
                      timing: "450ms trigger → 200ms gap",
                      desc: "Subtle pause trimming suitable for audiobooks, calm interviews, and relaxed lectures.",
                      recommended: false,
                    },
                  ].map((p) => {
                    const isSelected = (audioCleanOptions?.pacing || "fast") === p.id;
                    return (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() =>
                          setAudioCleanOptions?.((prev: any) => ({
                            ...prev,
                            pacing: p.id,
                          }))
                        }
                        className={`relative rounded-xl border p-4 text-left transition-all cursor-pointer ${isSelected
                          ? "border-orange-600 bg-orange-50/30 ring-2 ring-orange-500/20"
                          : "border-slate-200 bg-slate-50/50 hover:bg-slate-100/70"
                          }`}
                      >
                        {p.recommended && (
                          <span className="absolute top-3 right-3 text-[10px] font-black uppercase tracking-wider text-orange-600 bg-orange-100/80 px-2 py-0.5 rounded-full">
                            Recommended
                          </span>
                        )}
                        <h4 className="text-sm font-bold text-slate-900">{p.title}</h4>
                        <p className="text-[11px] font-mono font-semibold text-orange-600 mt-1">{p.timing}</p>
                        <p className="text-xs text-slate-600 mt-2 leading-relaxed">{p.desc}</p>
                      </button>
                    );
                  })}
                </div>

                {/* Export Format & Vocal Tuning */}
                <div className="pt-4 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Export Format */}
                  <div>
                    <label className="text-xs font-bold text-slate-800 block mb-2">Master Audio Export Format</label>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { id: "mp3", label: "MP3 320kbps", sub: "Universal" },
                        { id: "wav", label: "WAV Lossless", sub: "Production" },
                        { id: "m4a", label: "M4A AAC", sub: "Apple Master" },
                      ].map((fmt) => {
                        const isFmt = (audioCleanOptions?.exportFormat || "mp3") === fmt.id;
                        return (
                          <button
                            key={fmt.id}
                            type="button"
                            onClick={() =>
                              setAudioCleanOptions?.((prev: any) => ({
                                ...prev,
                                exportFormat: fmt.id,
                              }))
                            }
                            className={`rounded-xl border p-2.5 text-center transition cursor-pointer ${isFmt
                              ? "border-orange-600 bg-orange-50 text-blue-900 font-bold"
                              : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                              }`}
                          >
                            <p className="text-xs font-bold">{fmt.label}</p>
                            <p className="text-[10px] text-slate-500">{fmt.sub}</p>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Vocal Tone */}
                  <div>
                    <label className="text-xs font-bold text-slate-800 block mb-2">Vocal Character</label>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { id: "natural", label: "Natural Original", desc: "100% Intact" },
                        { id: "clarity", label: "Studio Clarity", desc: "+2dB Highs" },
                        { id: "warmth", label: "Warmth Boost", desc: "Pro Podcast" },
                      ].map((v) => {
                        const isTone = (audioCleanOptions?.vocalTone || "natural") === v.id;
                        return (
                          <button
                            key={v.id}
                            type="button"
                            onClick={() =>
                              setAudioCleanOptions?.((prev: any) => ({
                                ...prev,
                                vocalTone: v.id,
                              }))
                            }
                            className={`rounded-xl border p-2.5 text-center transition cursor-pointer ${isTone
                              ? "border-orange-600 bg-orange-50 text-blue-900 font-bold"
                              : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                              }`}
                          >
                            <p className="text-xs font-bold">{v.label}</p>
                            <p className="text-[10px] text-slate-500">{v.desc}</p>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Step 2 Bottom Navigation */}
                <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => setCurrentStep("upload")}
                    className="text-xs font-bold text-slate-600 hover:text-slate-900 transition"
                  >
                    ← Back to Upload
                  </button>

                  <button
                    type="button"
                    onClick={() => setCurrentStep("transcript")}
                    className="inline-flex items-center gap-2 rounded-xl bg-orange-600 px-6 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-orange-700 transition cursor-pointer"
                  >
                    <span>Next: Review Transcript</span>
                    <ArrowRight size={14} />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ──────────────── STEP 3: TRANSCRIPT REVIEW & CLEAN TRIGGER ──────────────── */}
          {currentStep === "transcript" && (
            <div className="space-y-6">
              <div className="rounded-2xl border border-slate-200/90 bg-white shadow-xs overflow-hidden">
                {/* Transcript Header Ribbon */}
                <div className="flex flex-col gap-3 border-b border-slate-200 p-4 sm:flex-row sm:items-center sm:justify-between sm:px-6 bg-slate-50">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-orange-200 bg-orange-100/70 px-3 py-1 text-xs font-bold text-blue-800">
                      <Edit3 size={13} className="text-orange-700" />
                      Review &amp; Edit Spoken Script
                    </span>
                    <span className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-white px-2.5 py-0.5 text-xs font-medium text-slate-700">
                      <FileText size={12} className="text-slate-400" />
                      {wordCount} Words
                    </span>
                    {audioCleanAnalysis?.originalDuration && (
                      <span className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-white px-2.5 py-0.5 text-xs font-medium text-slate-700">
                        <Clock size={12} className="text-slate-400" />
                        Original: {formatTime(audioCleanAnalysis.originalDuration)}
                      </span>
                    )}
                    {detectedPauses.length > 0 && (
                      <span className="inline-flex items-center gap-1 rounded-full border border-amber-300 bg-amber-50 px-2.5 py-0.5 text-xs font-bold text-amber-800">
                        <Scissors size={12} className="text-amber-700" />
                        {detectedPauses.length} Gaps Detected
                      </span>
                    )}
                  </div>

                  {/* Transcript Action Buttons */}
                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      type="button"
                      onClick={handlePasteClipboard}
                      className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-100 transition cursor-pointer shadow-2xs"
                    >
                      <ClipboardPaste size={13} className="text-amber-600" />
                      <span>Paste Script</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleResetToOriginal}
                      className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-100 transition cursor-pointer shadow-2xs"
                    >
                      <RotateCcw size={13} className="text-slate-500" />
                      <span>Reset</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleCopyScript}
                      className="inline-flex items-center gap-1.5 rounded-xl border border-emerald-300 bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-800 hover:bg-emerald-100 transition cursor-pointer shadow-2xs"
                    >
                      {copiedScript ? <Check size={14} className="text-emerald-600" /> : <Copy size={14} />}
                      <span>{copiedScript ? "Copied" : "Copy"}</span>
                    </button>
                  </div>
                </div>

                {/* Editable Textarea */}
                <div className="p-5 sm:p-6 space-y-3">
                  <div className="relative rounded-xl border border-slate-200 bg-slate-50 p-3 focus-within:border-orange-500 focus-within:bg-white transition">
                    <textarea
                      value={currentMarkdown}
                      onChange={(e) => handleMarkdownChange(e.target.value)}
                      placeholder="Transcript will appear here once audio analysis completes. You can correct misspelled brand names, technical terms, or paste your pre-written script..."
                      rows={10}
                      className="w-full resize-y bg-transparent font-mono text-xs leading-relaxed text-slate-800 placeholder:text-slate-400 focus:outline-none"
                    />
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between text-[11px] text-slate-500 gap-2">
                    <span>
                      💡 <strong>Voice Preservation Guarantee:</strong> Only dead air pauses are removed. Your tone, cadence, and vocal character remain 100% natural.
                    </span>
                    <span className="font-mono text-slate-400 shrink-0">{currentMarkdown.length} characters</span>
                  </div>
                </div>

                {/* Collapsible Detected Pauses Timeline Inspector */}
                {detectedPauses.length > 0 && (
                  <div className="border-t border-slate-200 p-4 sm:p-6 bg-slate-50/50">
                    <button
                      type="button"
                      onClick={() => setShowPauseList(!showPauseList)}
                      className="flex w-full items-center justify-between text-left text-xs font-bold text-slate-700 hover:text-slate-900 cursor-pointer"
                    >
                      <span className="flex items-center gap-2">
                        <Activity size={14} className="text-orange-600" />
                        <span>View Detected Silence Regions ({detectedPauses.length} timeline gaps)</span>
                      </span>
                      {showPauseList ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
                    </button>

                    {showPauseList && (
                      <div className="mt-3 max-h-56 overflow-y-auto space-y-1.5 pr-1 no-scrollbar">
                        {detectedPauses.map((pause) => (
                          <div
                            key={pause.id}
                            className="flex items-center justify-between rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs shadow-2xs"
                          >
                            <div className="flex items-center gap-2 min-w-0">
                              <span className="font-mono text-[10px] font-bold text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
                                #{pause.index}
                              </span>
                              <span className="font-mono text-slate-700 text-[11px]">
                                {formatTime(pause.start)} → {formatTime(pause.end)}
                              </span>
                              <span className="truncate text-slate-500 text-[11px]">{pause.description}</span>
                            </div>
                            <div className="flex items-center gap-2 shrink-0">
                              <span className="font-mono text-[11px] font-bold text-amber-700">
                                -{pause.cutDuration.toFixed(2)}s cut
                              </span>
                              <span className="font-mono text-[10px] text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">
                                leaves {pause.compressedGap.toFixed(2)}s
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Clean Audio CTA Footer */}
                <div className="border-t border-slate-200 p-5 sm:p-6 bg-slate-50 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="text-center sm:text-left">
                    <p className="text-xs font-bold text-slate-800 flex items-center justify-center sm:justify-start gap-1.5">
                      <Sparkles size={13} className="text-orange-600" />
                      Ready to clean audio with smart pause removal
                    </p>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Non-destructive FFmpeg slicing with 8ms anti-pop crossfades.
                    </p>
                  </div>

                  <div className="flex items-center gap-3 w-full sm:w-auto">
                    <button
                      type="button"
                      disabled={isCleaning || !audioCleanAnalysis}
                      onClick={onCleanAudio}
                      className="group flex-1 sm:flex-none flex items-center justify-center gap-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 px-8 py-3 text-sm font-black text-white shadow-md shadow-orange-500/20 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                    >
                      {isCleaning ? (
                        <>
                          <RefreshCw size={16} className="animate-spin" />
                          <span>Cleaning Audio Pauses...</span>
                        </>
                      ) : (
                        <>
                          <Sparkles size={16} className="transition group-hover:rotate-12" />
                          <span>Clean Audio &amp; Remove Silences ({detectedPauses.length} Gaps)</span>
                          <ArrowRight size={15} />
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ──────────────── STEP 4: MASTER PREVIEW & LIVE A/B COMPARE ──────────────── */}
          {currentStep === "master" && (
            <div className="space-y-6">
              {audioCleanResult ? (
                <div className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-xs space-y-6">
                  {/* Master Header & Time Saved Bar */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
                    <div className="flex items-center gap-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700 border border-emerald-300 shadow-2xs">
                        <CheckCircle2 size={24} />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-base sm:text-lg font-black text-slate-900">Your Cleaned Audio is Ready</h3>
                          <span className="rounded-full bg-orange-100 border border-orange-300 px-2.5 py-0.5 text-[11px] font-bold text-blue-800">
                            Studio Master
                          </span>
                        </div>
                        <p className="text-xs text-slate-500">
                          Audition and compare both tracks below to hear the before and after difference.
                        </p>
                      </div>
                    </div>

                    {/* Stats Pill */}
                    <div className="flex flex-wrap items-center gap-2 bg-slate-100 border border-slate-200 rounded-xl px-3.5 py-2 text-xs">
                      <span className="text-slate-500">Time Saved:</span>
                      <span className="font-bold text-orange-600 font-mono">
                        {audioCleanResult.stats?.durationSavedSeconds
                          ? `${audioCleanResult.stats.durationSavedSeconds.toFixed(1)}s`
                          : `${Math.max(0, audioCleanResult.originalDuration - audioCleanResult.cleanedDuration).toFixed(1)}s`}
                      </span>
                      <span className="text-slate-300">•</span>
                      <span className="text-slate-500">Format:</span>
                      <span className="font-black text-slate-800 font-mono uppercase">{exportFmt}</span>
                      {Boolean(audioCleanResult.stats?.silencesCut) && (
                        <>
                          <span className="text-slate-300">•</span>
                          <span className="text-slate-500">Gaps Cut:</span>
                          <span className="font-bold text-amber-600 font-mono">
                            {audioCleanResult.stats?.silencesCut}
                          </span>
                        </>
                      )}
                    </div>
                  </div>

                  {/* DUAL AUDIO PLAYERS: SIDE-BY-SIDE BEFORE & AFTER */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* CARD 1: BEFORE (ORIGINAL AUDIO) */}
                    <div
                      className={`rounded-2xl border p-5 transition-all ${isPlayingBefore
                        ? "border-rose-400 bg-rose-50/50 shadow-xs"
                        : "border-slate-200 bg-slate-50/60 hover:border-slate-300"
                        }`}
                    >
                      <div className="flex items-center justify-between border-b border-slate-200/80 pb-3">
                        <div className="flex items-center gap-2">
                          <span
                            className={`h-2.5 w-2.5 rounded-full ${isPlayingBefore ? "bg-rose-500 animate-ping" : "bg-rose-400"
                              }`}
                          />
                          <div>
                            <h4 className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                              🔴 Before <span className="text-slate-500 font-normal">(Original Recording)</span>
                            </h4>
                            <p className="text-[10px] text-slate-500">Contains dead air pauses</p>
                          </div>
                        </div>
                        <span className="rounded-full bg-rose-100 border border-rose-200 px-2.5 py-0.5 text-xs font-mono font-bold text-rose-800">
                          {formatTime(durationBefore || audioCleanResult.originalDuration)}
                        </span>
                      </div>

                      <div className="mt-4 space-y-3">
                        <div className="flex items-center gap-3">
                          <button
                            type="button"
                            onClick={handleTogglePlayBefore}
                            disabled={!rawAudioUrl}
                            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full transition-all cursor-pointer shadow-xs active:scale-95 ${isPlayingBefore
                              ? "bg-rose-600 text-white"
                              : "bg-white text-rose-700 border border-slate-300 hover:bg-rose-50"
                              } disabled:opacity-40`}
                          >
                            {isPlayingBefore ? <Pause size={16} /> : <Play size={16} className="ml-0.5" />}
                          </button>

                          <div className="flex-1 space-y-1">
                            <input
                              type="range"
                              min="0"
                              max={durationBefore || audioCleanResult.originalDuration || 1}
                              step="0.05"
                              value={currentTimeBefore}
                              onChange={(e) => {
                                const newTime = parseFloat(e.target.value);
                                setCurrentTimeBefore(newTime);
                                if (rawAudioRef.current) rawAudioRef.current.currentTime = newTime;
                              }}
                              className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-rose-600"
                            />
                            <div className="flex justify-between text-[10px] font-mono text-slate-500">
                              <span className={isPlayingBefore ? "text-rose-700 font-bold" : ""}>
                                {formatTime(currentTimeBefore)}
                              </span>
                              <span>{formatTime(durationBefore || audioCleanResult.originalDuration)}</span>
                            </div>
                          </div>
                        </div>

                        {/* Visual EQ Bars */}
                        <div className="flex items-center justify-between rounded-xl bg-white px-3 py-2 border border-slate-200">
                          <span className="text-[11px] text-slate-500">
                            {isPlayingBefore ? "Playing Original Track..." : "Click Play to audition raw audio"}
                          </span>
                          <div className="flex items-center gap-0.5 h-3.5">
                            {[40, 70, 30, 90, 60, 45, 80].map((h, i) => (
                              <span
                                key={i}
                                className={`w-1 rounded-full transition-all duration-300 ${isPlayingBefore ? "bg-rose-500 animate-pulse" : "bg-slate-300"
                                  }`}
                                style={{ height: isPlayingBefore ? `${h}%` : "25%" }}
                              />
                            ))}
                          </div>
                        </div>
                      </div>

                      <audio
                        ref={rawAudioRef}
                        src={rawAudioUrl || audioCleanResult.outputUrl}
                        onTimeUpdate={() => setCurrentTimeBefore(rawAudioRef.current?.currentTime || 0)}
                        onLoadedMetadata={() =>
                          setDurationBefore(rawAudioRef.current?.duration || audioCleanResult.originalDuration)
                        }
                        onEnded={() => setIsPlayingBefore(false)}
                        onPlay={() => {
                          setIsPlayingBefore(true);
                          setIsPlayingAfter(false);
                        }}
                        onPause={() => setIsPlayingBefore(false)}
                        className="hidden"
                      />
                    </div>

                    {/* CARD 2: AFTER (CLEANED STUDIO MASTER) */}
                    <div
                      className={`rounded-2xl border p-5 transition-all ${isPlayingAfter
                        ? "border-blue-400 bg-orange-50/30 shadow-xs"
                        : "border-orange-200 bg-orange-50/30 hover:border-orange-300"
                        }`}
                    >
                      <div className="flex items-center justify-between border-b border-orange-200/80 pb-3">
                        <div className="flex items-center gap-2">
                          <span
                            className={`h-2.5 w-2.5 rounded-full ${isPlayingAfter ? "bg-orange-600 animate-ping" : "bg-orange-500"
                              }`}
                          />
                          <div>
                            <h4 className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                              ✨ After <span className="text-orange-700 font-normal">(Silences Cut • Clean Master)</span>
                            </h4>
                            <p className="text-[10px] text-slate-500">100% natural voice preserved</p>
                          </div>
                        </div>
                        <span className="rounded-full bg-orange-100 border border-orange-300 px-2.5 py-0.5 text-xs font-mono font-bold text-blue-800">
                          {formatTime(durationAfter || audioCleanResult.cleanedDuration)}
                        </span>
                      </div>

                      <div className="mt-4 space-y-3">
                        <div className="flex items-center gap-3">
                          <button
                            type="button"
                            onClick={handleTogglePlayAfter}
                            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full transition-all cursor-pointer shadow-xs active:scale-95 ${isPlayingAfter
                              ? "bg-orange-600 text-white"
                              : "bg-white text-orange-700 border border-orange-300 hover:bg-orange-50"
                              }`}
                          >
                            {isPlayingAfter ? <Pause size={16} /> : <Play size={16} className="ml-0.5" />}
                          </button>

                          <div className="flex-1 space-y-1">
                            <input
                              type="range"
                              min="0"
                              max={durationAfter || audioCleanResult.cleanedDuration || 1}
                              step="0.05"
                              value={currentTimeAfter}
                              onChange={(e) => {
                                const newTime = parseFloat(e.target.value);
                                setCurrentTimeAfter(newTime);
                                if (cleanAudioRef.current) cleanAudioRef.current.currentTime = newTime;
                              }}
                              className="w-full h-1.5 bg-blue-200 rounded-lg appearance-none cursor-pointer accent-orange-500"
                            />
                            <div className="flex justify-between text-[10px] font-mono text-slate-500">
                              <span className={isPlayingAfter ? "text-orange-700 font-bold" : ""}>
                                {formatTime(currentTimeAfter)}
                              </span>
                              <span>{formatTime(durationAfter || audioCleanResult.cleanedDuration)}</span>
                            </div>
                          </div>
                        </div>

                        {/* Visual EQ Bars */}
                        <div className="flex items-center justify-between rounded-xl bg-white px-3 py-2 border border-orange-200">
                          <span className="text-[11px] text-slate-500">
                            {isPlayingAfter ? "Playing Clean Studio Master..." : "Click Play to audition cleaned track"}
                          </span>
                          <div className="flex items-center gap-0.5 h-3.5">
                            {[50, 85, 45, 95, 75, 60, 90].map((h, i) => (
                              <span
                                key={i}
                                className={`w-1 rounded-full transition-all duration-300 ${isPlayingAfter ? "bg-orange-600 animate-pulse" : "bg-slate-300"
                                  }`}
                                style={{ height: isPlayingAfter ? `${h}%` : "25%" }}
                              />
                            ))}
                          </div>
                        </div>
                      </div>

                      <audio
                        ref={cleanAudioRef}
                        src={audioCleanResult.outputUrl}
                        onTimeUpdate={() => setCurrentTimeAfter(cleanAudioRef.current?.currentTime || 0)}
                        onLoadedMetadata={() =>
                          setDurationAfter(cleanAudioRef.current?.duration || audioCleanResult.cleanedDuration)
                        }
                        onEnded={() => setIsPlayingAfter(false)}
                        onPlay={() => {
                          setIsPlayingAfter(true);
                          setIsPlayingBefore(false);
                        }}
                        onPause={() => setIsPlayingAfter(false)}
                        className="hidden"
                      />
                    </div>
                  </div>

                  {/* INSTANT A/B COMPARISON SWITCHER BAR */}
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200">
                    <div className="flex items-center gap-3 w-full sm:w-auto">
                      <button
                        type="button"
                        onClick={handleInstantABSwitch}
                        disabled={!rawAudioUrl}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-slate-300 hover:bg-slate-100 text-xs font-bold text-slate-800 transition active:scale-95 cursor-pointer shadow-2xs disabled:opacity-50"
                      >
                        <ArrowRightLeft size={14} className="text-orange-600" />
                        <span>Instant A/B Audio Switch</span>
                      </button>
                      <div className="text-xs">
                        <span className="text-slate-500">Auditioning: </span>
                        <span
                          className={`font-bold ${compareMode === "after" ? "text-orange-600" : "text-rose-600"}`}
                        >
                          {compareMode === "after" ? "✨ Cleaned (Pauses Cut)" : "🔴 Original (Before)"}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      <ShieldCheck size={14} className="text-emerald-600 shrink-0" />
                      <span>Original vocal frequency &amp; timbre 100% intact</span>
                    </div>
                  </div>

                  {/* BOTTOM ACTION BAR */}
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-200">
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setCurrentStep("transcript")}
                        className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 px-4 py-2.5 text-xs font-bold text-slate-700 transition cursor-pointer shadow-2xs"
                      >
                        <Edit3 size={13} />
                        <span>Re-edit Script</span>
                      </button>

                      <button
                        type="button"
                        onClick={handleFullReset}
                        className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 px-4 py-2.5 text-xs font-bold text-slate-700 transition cursor-pointer shadow-2xs"
                      >
                        <RotateCcw size={13} />
                        <span>Clean Another</span>
                      </button>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto justify-end">
                      {/* Send to Image AI Studio */}
                      <a
                        href={`/dashboard/image-to-video?audioUrl=${encodeURIComponent(audioCleanResult.outputUrl)}`}
                        className="inline-flex items-center gap-1.5 rounded-xl border border-orange-200 bg-orange-50 hover:bg-orange-100/70 px-4 py-2.5 text-xs font-bold text-orange-700 transition active:scale-95"
                      >
                        <Sparkles size={14} />
                        <span>Send to Image AI Studio</span>
                      </a>

                      {/* Download Master Button */}
                      <a
                        href={`/api/download?url=${encodeURIComponent(audioCleanResult.outputUrl)}&filename=${encodeURIComponent(`itnavideo-clean-audio.${exportFmt}`)}`}
                        download={`itnavideo-clean-audio.${exportFmt}`}
                        onClick={() => setHasDownloaded(true)}
                        className="inline-flex items-center gap-2 rounded-xl bg-orange-600 hover:bg-orange-700 px-6 py-2.5 text-xs font-black text-white shadow-md shadow-orange-500/20 transition active:scale-95 cursor-pointer"
                      >
                        <Download size={14} />
                        <span>Download Clean Audio ({exportFmt.toUpperCase()})</span>
                      </a>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="rounded-2xl border border-slate-200 bg-slate-50/60 p-12 text-center space-y-3">
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-white border border-slate-200 text-slate-400 shadow-2xs">
                    <Music2 size={26} />
                  </div>
                  <h3 className="text-base font-bold text-slate-800">No Cleaned Audio Yet</h3>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto">
                    Complete Step 1 (Upload) and Step 3 (Review Script), then click &quot;Clean Audio&quot; to generate your master.
                  </p>
                  <button
                    type="button"
                    onClick={() => setCurrentStep(audioCleanAnalysis ? "transcript" : "upload")}
                    className="inline-flex items-center gap-2 rounded-xl bg-orange-600 px-5 py-2 text-xs font-bold text-white hover:bg-orange-700 transition cursor-pointer"
                  >
                    <span>{audioCleanAnalysis ? "Go to Transcript" : "Go to Upload"}</span>
                    <ArrowRight size={14} />
                  </button>
                </div>
              )}
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
