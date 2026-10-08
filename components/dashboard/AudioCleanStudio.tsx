"use client";

import React, { useState, useMemo, useRef } from "react";
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
} from "lucide-react";
import { BorderBeam } from "@/components/magicui/BorderBeam";
import { StudioWorkflowRoadmap } from "@/components/dashboard/StudioWorkflowRoadmap";
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

export type AudioCleanStudioResult = Omit<AudioCleanResult, "outputUrl" | "originalDuration" | "cleanedDuration" | "stats"> & {
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
  audioCleanResult,
  onCleanAudio,
  isCleaning,
  onReset,
  onBackToEdit,
}: AudioCleanStudioProps) {
  const [showAdvanced, setShowAdvanced] = useState(false);
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

  // Audio Blob URL Memory Protection: revoke object URL on file change or unmount
  React.useEffect(() => {
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
      rawAudioRef.current.play().then(() => {
        setIsPlayingBefore(true);
      }).catch(() => {});
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
      cleanAudioRef.current.play().then(() => {
        setIsPlayingAfter(true);
      }).catch(() => {});
    }
  };

  // Complete State Reset Handler for Clean Another Audio
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
    if (onReset) {
      onReset();
    }
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
        rawAudioRef.current.play().then(() => setIsPlayingBefore(true)).catch(() => {});
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
        cleanAudioRef.current.play().then(() => setIsPlayingAfter(true)).catch(() => {});
      }
    }
  };

  // Format seconds to mm:ss
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
      // Ignore if clipboard permission not granted
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

  const handleToggleOption = (key: keyof AudioCleanStudioOptions) => {
    setAudioCleanOptions((prev: AudioCleanStudioOptions) => ({
      ...prev,
      [key]: !prev[key],
    }));
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

  const exportFmt = audioCleanOptions.exportFormat || "mp3";

  return (
    <div className="relative rounded-[28px] border border-white/10 bg-[#111218] p-5 sm:p-7 shadow-2xl min-w-0 max-w-full overflow-x-hidden space-y-7 text-white">
      {/* Magic UI BorderBeam Glowing Effect */}
      <BorderBeam size={280} duration={14} colorFrom="#FF6D00" colorTo="#FFA726" />


      {/* ── STEP 1: UPLOAD ZONE (Only active when no file or re-uploading) ── */}
      {!audioCleanAnalysis && !isAnalyzingAudio && !audioCleanResult && (
        <div className="rounded-[28px] border border-white/10 bg-[#111218] p-6 shadow-2xl sm:p-8 space-y-6">
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
            className={`relative flex flex-col items-center justify-center rounded-3xl border-2 border-dashed p-10 text-center transition-all ${
              isDragging
                ? "border-[#FF6D00] bg-[#FF6D00]/10 scale-[1.01]"
                : selectedFile
                  ? "border-emerald-500/40 bg-[#161720]/80"
                  : "border-white/15 bg-[#161720]/50 hover:border-[#FF6D00]/50 hover:bg-[#161720]"
            }`}
          >
            {selectedFile ? (
              <div className="flex flex-col items-center gap-3">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 shadow-lg">
                  <FileAudio size={32} />
                </div>
                <div className="space-y-1">
                  <div className="flex items-center justify-center gap-2">
                    <p className="text-base font-bold text-white">{selectedFile.name}</p>
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/20 px-2.5 py-0.5 text-[11px] font-bold text-emerald-400 border border-emerald-500/30">
                      <Check size={12} /> Ready
                    </span>
                  </div>
                  <p className="text-xs text-zinc-400">
                    {(selectedFile.size / (1024 * 1024)).toFixed(1)} MB • Audio track detected
                  </p>
                </div>
                <label className="mt-2 inline-flex cursor-pointer items-center justify-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-xs font-semibold text-zinc-200 transition hover:bg-white/10 hover:border-white/30">
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
              </div>
            ) : (
              <div className="flex flex-col items-center gap-3">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#FF6D00]/10 text-orange-400 border border-[#FF6D00]/20 shadow-md">
                  <Upload size={28} className="text-[#FF9100]" />
                </div>
                <div className="space-y-1 text-center">
                  <h3 className="text-lg sm:text-xl font-black text-white">
                    Upload your audio or video
                  </h3>
                  <p className="text-xs sm:text-sm text-zinc-400 max-w-md mx-auto">
                    Remove unwanted pauses and silence while keeping your voice natural.
                  </p>
                </div>
                <div className="flex flex-col items-center gap-2.5 mt-2">
                  <label className="inline-flex cursor-pointer items-center justify-center gap-2.5 rounded-full bg-gradient-to-r from-[#FF6D00] via-[#FF8F00] to-[#FFA726] px-8 py-3 text-sm font-black text-black shadow-xl shadow-[#FF6D00]/25 transition hover:brightness-110 active:scale-95">
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
                      const sampleFile = new File([sampleBlob], "sample_podcast_recording.mp3", { type: "audio/mp3" });
                      onSelectFile(sampleFile);
                    }}
                    className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs font-bold text-zinc-300 transition hover:bg-white/10 hover:text-white cursor-pointer mt-1"
                  >
                    <Sparkles size={13} className="text-[#FF9100]" />
                    <span>Or test with a sample audio</span>
                  </button>
                  <p className="text-[11px] text-zinc-500 mt-1">
                    Audio: MP3 • WAV • M4A • AAC &nbsp;|&nbsp; Video: MP4 • MOV (Auto extracted)
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── STEP 2: TRANSCRIBING & SILENCE DETECTION PROGRESS CARD ── */}
      {isAnalyzingAudio && (
        <div className="rounded-[28px] border border-white/10 bg-[#111218] p-10 text-center shadow-xl space-y-4">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#FF6D00]/10 text-[#FF9100] border border-[#FF6D00]/20">
            <RefreshCw size={26} className="animate-spin" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Transcribing &amp; Scanning Audio Timeline...</h3>
            <p className="mt-1 text-xs text-zinc-400 max-w-md mx-auto leading-relaxed">
              Generating word-level timestamps and detecting all silence intervals across your recording.
            </p>
          </div>
        </div>
      )}

      {/* ── STEP 3: REVIEW / EDIT TRANSCRIPT & SMART PAUSE CONTROLS ── */}
      {audioCleanAnalysis && !isAnalyzingAudio && !audioCleanResult && (
        <div className="space-y-6">
          {/* Main Review & Edit Card */}
          <div className="rounded-[28px] border border-white/10 bg-[#111218] shadow-2xl overflow-hidden">
            {/* Top Stats Ribbon */}
            <div className="flex flex-col gap-3 border-b border-white/10 p-5 sm:flex-row sm:items-center sm:justify-between sm:px-6 bg-[#161720]">
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-[#FF6D00]/30 bg-[#FF6D00]/10 px-3 py-1 text-xs font-black text-orange-300 uppercase tracking-wider">
                  <Edit3 size={13} className="text-orange-300" />
                  Review &amp; Edit Script
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-[#111218] px-3 py-1 text-xs font-semibold text-zinc-200">
                  <FileText size={12} className="text-zinc-400" />
                  {wordCount} Words
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-[#111218] px-3 py-1 text-xs font-semibold text-zinc-200">
                  <Clock size={12} className="text-zinc-400" />
                  Original: {formatTime(audioCleanAnalysis.originalDuration)} → Estimated Clean: {formatTime(audioCleanAnalysis.estimatedCleanDuration)}
                </span>
                {detectedPauses.length > 0 && (
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs font-bold text-amber-300">
                    <Scissors size={12} />
                    {detectedPauses.length} Silence Gaps Detected
                  </span>
                )}
              </div>

              {/* Action Buttons: Paste, Reset, Copy */}
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={handlePasteClipboard}
                  title="Paste script from clipboard"
                  className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-bold text-zinc-300 transition hover:bg-white/10 cursor-pointer"
                >
                  <ClipboardPaste size={13} className="text-amber-400" />
                  <span>Paste Script</span>
                </button>

                <button
                  type="button"
                  onClick={handleResetToOriginal}
                  title="Reset to original transcript"
                  className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-bold text-zinc-300 transition hover:bg-white/10 cursor-pointer"
                >
                  <RotateCcw size={13} className="text-zinc-400" />
                  <span>Reset</span>
                </button>

                <button
                  type="button"
                  onClick={handleCopyScript}
                  className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3.5 py-1.5 text-xs font-bold text-emerald-300 transition hover:bg-emerald-500/20 cursor-pointer"
                >
                  {copiedScript ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                  {copiedScript ? "Copied" : "Copy Markdown"}
                </button>
              </div>
            </div>

            {/* Editable Markdown Textarea */}
            <div className="p-5 sm:p-6 space-y-3">
              <div className="relative rounded-2xl border border-white/10 bg-[#090A0F] p-4 focus-within:border-[#FF6D00]/60 transition">
                <textarea
                  value={currentMarkdown}
                  onChange={(e) => handleMarkdownChange(e.target.value)}
                  placeholder="Review the generated transcript, correct any typos, format headings, or paste your pre-written script..."
                  rows={10}
                  className="w-full resize-y bg-transparent font-mono text-xs leading-relaxed text-zinc-200 placeholder:text-zinc-600 focus:outline-none selection:bg-[#FF6D00]/30 selection:text-[#FFA726]"
                />
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between text-[11px] text-zinc-400 gap-2 px-1">
                <span>
                  💡 <strong>Script Review:</strong> You can edit words, correct transcription mistakes, or paste your exact script. The original voice is 100% preserved.
                </span>
                <span className="font-mono text-zinc-500 shrink-0">{currentMarkdown.length} characters</span>
              </div>
            </div>

            {/* Video Narration Pacing Selector (Image-to-Video Retention Tuning) */}
            <div className="border-t border-white/10 p-5 sm:p-6 bg-[#161720] space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                    Smart Pause Compression Pacing
                  </h4>
                  <p className="text-[11px] text-zinc-400 mt-0.5">
                    Calibrated specifically for Image to Video AI (visuals changing every 5–6 seconds)
                  </p>
                </div>
                <span className="text-[11px] text-orange-400 font-bold hidden sm:inline">
                  ⚡ Recommended: Fast Retention
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  {
                    id: "fast",
                    label: "⚡ Fast Retention (Image to Video)",
                    desc: "Compresses pauses >0.40s down to ~0.28s. Eliminates dead air so viewers stay engaged during visual transitions.",
                  },
                  {
                    id: "natural",
                    label: "🎙️ Natural Conversational",
                    desc: "Compresses pauses >0.50s down to ~0.35s. Standard conversational breathing space.",
                  },
                  {
                    id: "relaxed",
                    label: "☕ Relaxed Flow",
                    desc: "Compresses pauses >0.65s down to ~0.45s. Suitable for slow-paced educational podcasts.",
                  },
                ].map((p) => {
                  const isSelected = (audioCleanOptions.pacing || "fast") === p.id;
                  return (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => setAudioCleanOptions((prev: AudioCleanStudioOptions) => ({ ...prev, pacing: p.id as "fast" | "natural" | "relaxed" }))}
                      className={`rounded-2xl border p-3.5 text-left transition cursor-pointer ${
                        isSelected
                          ? "border-[#FF6D00] bg-[#FF6D00]/10 text-white shadow-lg shadow-[#FF6D00]/15"
                          : "border-white/5 bg-[#161720] text-zinc-400 hover:text-white hover:border-white/15"
                      }`}
                    >
                      <p className={`text-xs font-black ${isSelected ? "text-[#FFA726]" : "text-white"}`}>
                        {p.label}
                      </p>
                      <p className="text-[11px] text-zinc-400 mt-1 leading-relaxed">
                        {p.desc}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Detected Silence Timeline Inspector (Collapsible) */}
            {detectedPauses.length > 0 && (
              <div className="border-t border-white/10 p-5 sm:p-6 bg-[#111218]">
                <button
                  type="button"
                  onClick={() => setShowPauseList(!showPauseList)}
                  className="flex w-full items-center justify-between text-left text-xs font-bold text-zinc-300 hover:text-white cursor-pointer"
                >
                  <span className="flex items-center gap-2">
                    <Activity size={14} className="text-[#FFA726]" />
                    <span>View Detected Pauses Across Timeline ({detectedPauses.length} silence regions)</span>
                  </span>
                  {showPauseList ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
                </button>

                {showPauseList && (
                  <div className="mt-4 max-h-60 overflow-y-auto space-y-2 pr-1 no-scrollbar">
                    {detectedPauses.map((pause) => (
                      <div
                        key={pause.id}
                        className="flex items-center justify-between rounded-xl border border-white/5 bg-[#161720] px-3.5 py-2 text-xs"
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <span className="font-mono text-[10px] font-bold text-zinc-400 bg-white/5 px-2 py-0.5 rounded">
                            #{pause.index}
                          </span>
                          <span className="font-mono text-zinc-300 text-[11px]">
                            {formatTime(pause.start)} – {formatTime(pause.end)}
                          </span>
                          <span className="truncate text-zinc-400 text-[11px]">{pause.description}</span>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <span className="font-mono text-[11px] font-bold text-amber-400">
                            -{pause.cutDuration.toFixed(2)}s cut
                          </span>
                          <span className="font-mono text-[10px] text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded">
                            leaves {pause.compressedGap.toFixed(2)}s
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Primary Action Button (Start Audio Cleaning) */}
            <div className="border-t border-white/10 p-6 bg-[#161720] flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="space-y-0.5 text-center sm:text-left">
                <p className="text-xs font-bold text-white flex items-center justify-center sm:justify-start gap-1.5">
                  <Sparkles size={13} className="text-[#FF9100]" />
                  Ready to clean audio with smart pause removal
                </p>
                <p className="text-[11px] text-zinc-400">
                  Outputs 1080p-synchronized clean audio with zero pitch shift or voice alteration.
                </p>
              </div>

              <button
                type="button"
                disabled={isCleaning}
                onClick={onCleanAudio}
                className="group relative flex h-13 w-full sm:w-auto items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-[#FF6D00] via-[#FF8F00] to-[#FFA726] px-8 text-sm font-black text-black shadow-xl shadow-[#FF6D00]/25 transition-all hover:brightness-110 active:scale-95 disabled:cursor-not-allowed disabled:opacity-60 cursor-pointer"
              >
                <Sparkles size={17} className="transition group-hover:rotate-12" />
                <span>Clean Audio &amp; Remove Silences ({detectedPauses.length} Gaps)</span>
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── STEP 4: CLEANING SPINNER ── */}
      {isCleaning && (
        <div className="rounded-[28px] border border-white/10 bg-[#111218] p-10 text-center shadow-xl space-y-4">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#FF6D00]/10 text-[#FF9100] border border-[#FF6D00]/20">
            <Scissors size={26} className="animate-pulse" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Compressing Pauses &amp; Splicing Audio...</h3>
            <p className="mt-1 text-xs text-zinc-400 max-w-md mx-auto leading-relaxed">
              Applying sample-accurate FFmpeg cuts with 8ms anti-pop crossfades. 100% of your original voice is preserved.
            </p>
          </div>
        </div>
      )}

      {/* ── STEP 5: PREVIEW & DOWNLOAD (LIVE A/B COMPARE) ── */}
      {audioCleanResult && (
        <div className="rounded-[28px] border border-white/10 bg-[#111218] p-6 shadow-2xl sm:p-8 space-y-6">
          {/* Header & Stats Bar */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-white/10 pb-5">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#FF6D00]/10 text-[#FF9100] border border-[#FF6D00]/20">
                <Music2 size={24} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-lg font-bold text-white">Your Cleaned Audio is Ready</h4>
                  <span className="rounded-full bg-[#FF6D00]/20 border border-[#FF6D00]/40 px-2.5 py-0.5 text-[11px] font-bold text-[#FF9100]">
                    Smart Silence Cut
                  </span>
                </div>
                <p className="text-xs text-zinc-400">
                  Play both Before &amp; After tracks below to listen and compare how your audio sounded before vs now.
                </p>
              </div>
            </div>

            {/* Quick Stat Highlights & Top Reset Button */}
            <div className="flex flex-wrap items-center gap-2.5">
              <div className="flex flex-wrap items-center gap-2 bg-black/40 border border-white/10 rounded-2xl px-3.5 py-2 text-xs">
                <span className="text-zinc-400">Time Saved:</span>
                <span className="font-bold text-[#FF9100] font-mono">
                  {audioCleanResult.stats?.durationSavedSeconds
                    ? `${audioCleanResult.stats.durationSavedSeconds.toFixed(1)}s`
                    : `${Math.max(0, audioCleanResult.originalDuration - audioCleanResult.cleanedDuration).toFixed(1)}s`}
                </span>
                <span className="text-zinc-600">•</span>
                <span className="text-zinc-400">Format:</span>
                <span className="font-black text-[#FFA726] font-mono uppercase">{exportFmt}</span>
                {Boolean(audioCleanResult.stats?.silencesCut) && (
                  <>
                    <span className="text-zinc-600">•</span>
                    <span className="text-zinc-400">Gaps Cut:</span>
                    <span className="font-bold text-amber-400 font-mono">{audioCleanResult.stats?.silencesCut}</span>
                  </>
                )}
              </div>

              {onReset && (
                <button
                  type="button"
                  onClick={handleFullReset}
                  className="inline-flex items-center gap-1.5 rounded-2xl border border-white/20 bg-white/10 hover:bg-white/20 px-3.5 py-2 text-xs font-bold text-white transition cursor-pointer active:scale-95 shadow-sm"
                  title="Upload a new audio file without refreshing"
                >
                  <Plus size={14} className="text-[#FFA726]" />
                  <span>Upload New Audio</span>
                </button>
              )}
            </div>
          </div>

          {/* ── DUAL AUDIO PLAYERS: SIDE-BY-SIDE BEFORE & AFTER ── */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* 🔴 CARD 1: BEFORE (ORIGINAL AUDIO) */}
            <div
              className={`rounded-2xl border p-5 transition-all ${
                isPlayingBefore
                  ? "border-rose-500 bg-rose-950/20 shadow-xl shadow-rose-500/10"
                  : "border-white/10 bg-[#161720] hover:border-white/20"
              }`}
            >
              {/* Card Header */}
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div className="flex items-center gap-2">
                  <span className={`h-3 w-3 rounded-full ${isPlayingBefore ? "bg-rose-500 animate-ping" : "bg-rose-400"}`} />
                  <div>
                    <h5 className="text-sm font-bold text-white flex items-center gap-1.5">
                      🔴 Before <span className="text-xs text-rose-300 font-medium">(Original Recording)</span>
                    </h5>
                    <p className="text-[11px] text-zinc-400">With dead air pauses and silences</p>
                  </div>
                </div>
                <span className="rounded-full bg-rose-500/20 border border-rose-500/30 px-2.5 py-1 text-xs font-mono font-bold text-rose-300">
                  {formatTime(durationBefore || audioCleanResult.originalDuration)}
                </span>
              </div>

              {/* Player Controls & Scrubber */}
              <div className="mt-4 space-y-3">
                <div className="flex items-center gap-3">
                  {/* Play / Pause Button */}
                  <button
                    type="button"
                    onClick={handleTogglePlayBefore}
                    disabled={!rawAudioUrl}
                    className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full transition-all cursor-pointer active:scale-90 ${
                      isPlayingBefore
                        ? "bg-rose-500 text-white shadow-lg shadow-rose-500/30"
                        : "bg-white/10 text-rose-300 hover:bg-rose-500 hover:text-white"
                    } disabled:opacity-40 disabled:cursor-not-allowed`}
                    title={isPlayingBefore ? "Pause Before Audio" : "Play Before Audio"}
                  >
                    {isPlayingBefore ? <Pause size={18} /> : <Play size={18} className="ml-0.5" />}
                  </button>

                  {/* Scrubber & Time Display */}
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
                      className="w-full h-1.5 bg-white/15 rounded-lg appearance-none cursor-pointer accent-rose-500"
                    />
                    <div className="flex justify-between text-[11px] font-mono text-zinc-400">
                      <span className={isPlayingBefore ? "text-rose-300 font-bold" : ""}>
                        {formatTime(currentTimeBefore)}
                      </span>
                      <span>{formatTime(durationBefore || audioCleanResult.originalDuration)}</span>
                    </div>
                  </div>
                </div>

                {/* Animated Equalizer Waveform Indicator */}
                <div className="flex items-center justify-between rounded-xl bg-black/40 px-3 py-2 border border-white/5">
                  <span className="text-[11px] text-zinc-400">
                    {isPlayingBefore ? "Playing Original Track..." : "Click Play to listen to raw audio"}
                  </span>
                  <div className="flex items-center gap-0.5 h-4">
                    {[40, 70, 30, 90, 60, 45, 80].map((h, i) => (
                      <span
                        key={i}
                        className={`w-1 rounded-full transition-all duration-300 ${
                          isPlayingBefore ? "bg-rose-400 animate-pulse" : "bg-zinc-700"
                        }`}
                        style={{ height: isPlayingBefore ? `${h}%` : "20%" }}
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* Hidden HTML Audio Element */}
              <audio
                ref={rawAudioRef}
                src={rawAudioUrl || audioCleanResult.outputUrl}
                onTimeUpdate={() => setCurrentTimeBefore(rawAudioRef.current?.currentTime || 0)}
                onLoadedMetadata={() => setDurationBefore(rawAudioRef.current?.duration || audioCleanResult.originalDuration)}
                onEnded={() => setIsPlayingBefore(false)}
                onPlay={() => {
                  setIsPlayingBefore(true);
                  setIsPlayingAfter(false);
                }}
                onPause={() => setIsPlayingBefore(false)}
                className="hidden"
              />
            </div>

            {/* ✨ CARD 2: AFTER (CLEANED STUDIO MASTER) */}
            <div
              className={`rounded-2xl border p-5 transition-all ${
                isPlayingAfter
                  ? "border-[#FF6D00] bg-[#FF6D00]/10 shadow-xl shadow-[#FF6D00]/15"
                  : "border-[#FF6D00]/40 bg-[#161720] hover:border-[#FF6D00]/60"
              }`}
            >
              {/* Card Header */}
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div className="flex items-center gap-2">
                  <span className={`h-3 w-3 rounded-full ${isPlayingAfter ? "bg-[#FF6D00] animate-ping" : "bg-[#FF9100]"}`} />
                  <div>
                    <h5 className="text-sm font-bold text-white flex items-center gap-1.5">
                      ✨ After <span className="text-xs text-[#FF9100] font-medium">(Silences Cut &amp; Voice Preserved)</span>
                    </h5>
                    <p className="text-[11px] text-zinc-400">100% natural voice • Smooth fast flow</p>
                  </div>
                </div>
                <span className="rounded-full bg-[#FF6D00]/20 border border-[#FF6D00]/30 px-2.5 py-1 text-xs font-mono font-bold text-[#FF9100]">
                  {formatTime(durationAfter || audioCleanResult.cleanedDuration)}
                </span>
              </div>

              {/* Player Controls & Scrubber */}
              <div className="mt-4 space-y-3">
                <div className="flex items-center gap-3">
                  {/* Play / Pause Button */}
                  <button
                    type="button"
                    onClick={handleTogglePlayAfter}
                    className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full transition-all cursor-pointer active:scale-90 ${
                      isPlayingAfter
                        ? "bg-gradient-to-r from-[#FF6D00] to-[#FF8F00] text-black shadow-lg shadow-[#FF6D00]/30"
                        : "bg-[#FF6D00]/20 text-[#FF9100] hover:bg-[#FF6D00] hover:text-black"
                    }`}
                    title={isPlayingAfter ? "Pause Cleaned Audio" : "Play Cleaned Audio"}
                  >
                    {isPlayingAfter ? <Pause size={18} /> : <Play size={18} className="ml-0.5" />}
                  </button>

                  {/* Scrubber & Time Display */}
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
                      className="w-full h-1.5 bg-white/15 rounded-lg appearance-none cursor-pointer accent-[#FF6D00]"
                    />
                    <div className="flex justify-between text-[11px] font-mono text-zinc-400">
                      <span className={isPlayingAfter ? "text-[#FF9100] font-bold" : ""}>
                        {formatTime(currentTimeAfter)}
                      </span>
                      <span>{formatTime(durationAfter || audioCleanResult.cleanedDuration)}</span>
                    </div>
                  </div>
                </div>

                {/* Animated Equalizer Waveform Indicator */}
                <div className="flex items-center justify-between rounded-xl bg-black/40 px-3 py-2 border border-white/5">
                  <span className="text-[11px] text-zinc-400">
                    {isPlayingAfter ? "Playing Clean Studio Master..." : "Click Play to listen to cleaned audio"}
                  </span>
                  <div className="flex items-center gap-0.5 h-4">
                    {[50, 85, 45, 95, 75, 60, 90].map((h, i) => (
                      <span
                        key={i}
                        className={`w-1 rounded-full transition-all duration-300 ${
                          isPlayingAfter ? "bg-[#FF6D00] animate-pulse" : "bg-zinc-700"
                        }`}
                        style={{ height: isPlayingAfter ? `${h}%` : "20%" }}
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* Hidden HTML Audio Element */}
              <audio
                ref={cleanAudioRef}
                src={audioCleanResult.outputUrl}
                onTimeUpdate={() => setCurrentTimeAfter(cleanAudioRef.current?.currentTime || 0)}
                onLoadedMetadata={() => setDurationAfter(cleanAudioRef.current?.duration || audioCleanResult.cleanedDuration)}
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

          {/* ── INSTANT A/B COMPARISON SWITCHER BAR ── */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-black/50 border border-white/10">
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <button
                type="button"
                onClick={handleInstantABSwitch}
                disabled={!rawAudioUrl}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-500/40 hover:bg-amber-500/30 text-xs font-bold text-amber-300 transition active:scale-95 cursor-pointer disabled:opacity-50"
                title="Seamlessly switch playback between Before and After to hear the difference"
              >
                <ArrowRightLeft size={15} className="text-[#FFA726]" />
                <span>Instant A/B Audio Switch</span>
              </button>
              <div className="text-xs">
                <span className="text-zinc-400">Current Track: </span>
                <span className={`font-bold ${compareMode === "after" ? "text-[#FF9100]" : "text-rose-400"}`}>
                  {compareMode === "after" ? "✨ Cleaned (Gaps Cut)" : "🔴 Original (Before)"}
                </span>
              </div>
            </div>

            {/* Quick Status Info */}
            <div className="flex items-center gap-2 text-xs text-zinc-400">
              <ShieldCheck size={14} className="text-emerald-400 shrink-0" />
              <span>Exact vocal timbre &amp; frequency response preserved</span>
            </div>
          </div>

          {/* ── POST-DOWNLOAD PROMPT / NEW UPLOAD BANNER ── */}
          {hasDownloaded && (
            <div className="rounded-2xl border border-[#FF6D00]/40 bg-gradient-to-r from-[#FF6D00]/15 via-black/40 to-[#FF6D00]/10 p-5 shadow-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 animate-in fade-in duration-300">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#FF6D00]/20 text-[#FF9100] border border-[#FF6D00]/40">
                  <CheckCircle2 size={20} />
                </div>
                <div>
                  <h5 className="text-sm font-bold text-white">Audio Downloaded Successfully!</h5>
                  <p className="text-xs text-zinc-300">
                    Ready to clean another voiceover or video recording? Click below to upload a new file.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2.5 w-full sm:w-auto">
                {onReset && (
                  <button
                    type="button"
                    onClick={handleFullReset}
                    className="inline-flex flex-1 sm:flex-none items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#FF6D00] via-[#FF8F00] to-[#FFA726] px-5 py-2.5 text-xs font-black text-black shadow-md transition hover:brightness-110 active:scale-95 cursor-pointer"
                  >
                    <Plus size={15} />
                    <span>Upload &amp; Clean Another Audio</span>
                  </button>
                )}
                {onBackToEdit && (
                  <button
                    type="button"
                    onClick={onBackToEdit}
                    className="inline-flex items-center gap-1.5 rounded-xl border border-white/20 bg-white/10 hover:bg-white/15 px-3.5 py-2.5 text-xs font-bold text-zinc-200 transition cursor-pointer"
                  >
                    <Edit3 size={13} />
                    <span>Re-edit</span>
                  </button>
                )}
              </div>
            </div>
          )}

          {/* ── BOTTOM ACTIONS: DOWNLOAD, SEND TO STUDIO, RE-EDIT ── */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-[#161720] border border-white/10">
            <div className="flex items-center gap-2 text-xs text-zinc-400">
              <FileAudio size={15} className="text-[#FF9100]" />
              <span>Studio Master Export • 100% Quality</span>
            </div>

            <div className="flex flex-wrap items-center gap-2.5 w-full sm:w-auto justify-end">
              {/* Send to Image-to-Video Studio Button */}
              <a
                href={`/dashboard/image-to-video?audioUrl=${encodeURIComponent(audioCleanResult.outputUrl)}`}
                className="inline-flex items-center gap-2 rounded-2xl border border-[#FF6D00]/40 bg-[#FF6D00]/10 hover:bg-[#FF6D00]/20 px-5 py-3 text-xs font-bold text-[#FF9100] transition active:scale-95 cursor-pointer"
              >
                <Sparkles size={15} />
                <span>Send to Image AI Studio</span>
              </a>

              {/* Primary Download Button */}
              <a
                href={`/api/download?url=${encodeURIComponent(audioCleanResult.outputUrl)}&filename=${encodeURIComponent(`itnavideo-clean-audio.${exportFmt}`)}`}
                download={`itnavideo-clean-audio.${exportFmt}`}
                onClick={() => setHasDownloaded(true)}
                className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-[#FF6D00] via-[#FF8F00] to-[#FFA726] px-6 py-3 text-xs font-black text-black shadow-lg shadow-[#FF6D00]/25 transition hover:brightness-110 active:scale-95 cursor-pointer"
              >
                <Download size={15} />
                <span>Download Clean Audio ({exportFmt.toUpperCase()})</span>
              </a>

              {/* Re-edit Script Button */}
              {onBackToEdit && (
                <button
                  type="button"
                  onClick={onBackToEdit}
                  className="inline-flex items-center gap-1.5 rounded-2xl border border-white/15 bg-white/5 hover:bg-white/10 px-4 py-3 text-xs font-bold text-zinc-300 transition cursor-pointer active:scale-95"
                >
                  <Edit3 size={14} />
                  <span>Re-edit Script</span>
                </button>
              )}

              {/* Clean Another / Upload New Audio Button */}
              {onReset && (
                <button
                  type="button"
                  onClick={handleFullReset}
                  className="inline-flex items-center gap-1.5 rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10 px-4 py-3 text-xs font-bold text-zinc-300 transition cursor-pointer active:scale-95"
                  title="Upload a new audio file without reloading the page"
                >
                  <RotateCcw size={14} />
                  <span>Clean Another</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
