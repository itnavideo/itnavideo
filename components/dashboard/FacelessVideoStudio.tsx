"use client";

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import {
  Sparkles,
  Upload,
  Film,
  Plus,
  Music,
  Volume2,
  Subtitles,
  Check,
  CheckCircle2,
  Trash2,
  FileText,
  Clock3,
  Tv,
  Layers,
  ArrowRight,
  ArrowLeft,
  Play,
  Pause,
  AlertCircle,
  RefreshCw,
  Sliders,
  Palette,
  Eye,
  Scissors,
  HelpCircle,
} from "lucide-react";

export interface FacelessVideoStudioProps {
  selectedFile: File | null;
  onSelectFile: (file: File | null) => void;

  topicTitle?: string;
  onTopicTitleChange?: (val: string) => void;

  subtitleStyle?: string;
  onSubtitleStyleChange?: (style: string) => void;

  facelessBgmMood?: "lofi" | "tech" | "mystery" | "acoustic" | "none";
  onBgmMoodChange?: (val: "lofi" | "tech" | "mystery" | "acoustic" | "none") => void;

  facelessBgmVolume?: number;
  onBgmVolumeChange?: (val: number) => void;

  facelessPacingStyle?: "clean" | "cinematic" | "documentary" | "dynamic";
  onPacingStyleChange?: (style: "clean" | "cinematic" | "documentary" | "dynamic") => void;

  facelessEnableSfx?: boolean;
  onEnableSfxChange?: (enabled: boolean) => void;

  visualArtStyle?: "realistic" | "3d" | "2d";
  onVisualArtStyleChange?: (style: "realistic" | "3d" | "2d") => void;

  backgroundTheme?: string;
  onBackgroundThemeChange?: (theme: string) => void;

  onGenerate: (storyboardPayload?: any) => void;
  isGenerating: boolean;
  renderedVideoUrl?: string;

  assetSourceMode: "library" | "upload" | "mix";
  onAssetSourceModeChange: (mode: "library" | "upload" | "mix") => void;

  uploadedImageFiles: File[];
  onUploadedImageFilesChange: (files: File[]) => void;

  onTranscribeAndPlan?: (audioFile: File) => Promise<{
    transcript: string;
    segments: Array<{ start: number; end: number; text: string }>;
    words?: Array<{ word: string; start: number; end: number }>;
    sceneBlueprint: any[];
    brollUrls: Record<number, string>;
    durationSeconds: number;
    warnings?: string[];
  } | null>;
  isPlanning?: boolean;
}

// ── KINETIC SUBTITLE PRESETS (Crisp Light Studio Design) ──
export const FACELESS_SUBTITLE_STYLES = [
  {
    id: "netflix-yellow",
    title: "Netflix Yellow",
    desc: "Classic yellow bold font with crisp black outline shadow.",
    badge: "Cinema Classic",
    previewText: "UNCOVERING THE LOST SECRET",
    highlightWord: "LOST SECRET",
    textColor: "#FDE047",
  },
  {
    id: "documentary-serif",
    title: "Documentary Serif",
    desc: "Editorial serif captions with elegant dark glass backdrop.",
    badge: "Editorial",
    previewText: "History holds answers to future mysteries.",
    highlightWord: "",
    textColor: "#F4F4F5",
  },
  {
    id: "parallax-modern",
    title: "Parallax Modern",
    desc: "Bold white kinetic word zoom with violet brand highlight.",
    badge: "High Retention",
    previewText: "THIS CHANGED EVERYTHING",
    highlightWord: "EVERYTHING",
    textColor: "#FFFFFF",
  },
  {
    id: "minimal-clean",
    title: "Minimal Clean",
    desc: "Crisp white typography with soft ambient drop shadow.",
    badge: "Minimalist",
    previewText: "Simple, powerful narrative storytelling.",
    highlightWord: "",
    textColor: "#FFFFFF",
  },
  {
    id: "gold-editorial",
    title: "Gold Editorial",
    desc: "Metallic warm gold gradient headline typography.",
    badge: "Premium Gold",
    previewText: "THE GOLDEN ERA OF CREATION",
    highlightWord: "GOLDEN ERA",
    textColor: "#FBBF24",
  },
];

export const BACKGROUND_THEMES = [
  { id: "studio-white", label: "Studio White", color: "#FFFFFF", border: "#E2E8F0" },
  { id: "warm-cream", label: "Warm Cream", color: "#F5F3EF", border: "#E5E1D8" },
  { id: "soft-slate", label: "Soft Slate", color: "#F1F5F9", border: "#CBD5E1" },
  { id: "midnight-obsidian", label: "Midnight Slate", color: "#0F172A", border: "#334155" },
  { id: "royal-navy", label: "Royal Navy", color: "#1E293B", border: "#475569" },
  { id: "purple-vignette", label: "Studio Purple", color: "#2E1065", border: "#581C87" },
];

export function FacelessVideoStudio({
  selectedFile,
  onSelectFile,
  topicTitle = "",
  onTopicTitleChange,
  subtitleStyle = "netflix-yellow",
  onSubtitleStyleChange,
  facelessBgmMood = "mystery",
  onBgmMoodChange,
  facelessBgmVolume = 0.15,
  onBgmVolumeChange,
  facelessPacingStyle = "cinematic",
  onPacingStyleChange,
  facelessEnableSfx = true,
  onEnableSfxChange,
  visualArtStyle = "realistic",
  onVisualArtStyleChange,
  backgroundTheme = "studio-white",
  onBackgroundThemeChange,
  onGenerate,
  isGenerating,
  renderedVideoUrl,
  assetSourceMode,
  onAssetSourceModeChange,
  uploadedImageFiles,
  onUploadedImageFilesChange,
  onTranscribeAndPlan,
  isPlanning = false,
}: FacelessVideoStudioProps) {
  // Wizard Steps: 1 = Inputs & Settings, 2 = Transcript Approval, 3 = Storyboard Confirmation
  const [studioStep, setStudioStep] = useState<"inputs" | "transcript" | "storyboard">("inputs");

  // Plan data states
  const [transcriptText, setTranscriptText] = useState("");
  const [originalTranscriptText, setOriginalTranscriptText] = useState("");
  const [transcriptSegments, setTranscriptSegments] = useState<Array<{ start: number; end: number; text: string }>>([]);
  const [sceneBlueprint, setSceneBlueprint] = useState<any[]>([]);
  const [brollUrls, setBrollUrls] = useState<Record<number, string>>({});
  const [audioDurationSec, setAudioDurationSec] = useState<number>(60);
  const [planWarnings, setPlanWarnings] = useState<string[]>([]);
  const [hasEditedTranscript, setHasEditedTranscript] = useState(false);

  // Audio preview playback
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [audioCurrentTime, setAudioCurrentTime] = useState(0);
  const audioPlayerRef = useRef<HTMLAudioElement | null>(null);

  // Local object URL for voiceover audio preview
  const [audioObjectUrl, setAudioObjectUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!selectedFile) {
      setAudioObjectUrl(null);
      setStudioStep("inputs");
      return;
    }
    const url = URL.createObjectURL(selectedFile);
    setAudioObjectUrl(url);
    return () => {
      URL.revokeObjectURL(url);
    };
  }, [selectedFile]);

  // Audio player time updates
  const togglePlayAudio = () => {
    if (!audioPlayerRef.current) return;
    if (isPlayingAudio) {
      audioPlayerRef.current.pause();
      setIsPlayingAudio(false);
    } else {
      audioPlayerRef.current.play().catch(() => {});
      setIsPlayingAudio(true);
    }
  };

  const handleMediaUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      onUploadedImageFilesChange([...uploadedImageFiles, ...Array.from(files)]);
      e.target.value = "";
    }
  };

  const removeMediaFile = (index: number) => {
    onUploadedImageFilesChange(uploadedImageFiles.filter((_, i) => i !== index));
  };

  // Step 1 -> Step 2: Trigger transcription & initial planning
  const handleProceedToTranscript = async () => {
    if (!selectedFile) return;

    if (onTranscribeAndPlan) {
      const planRes = await onTranscribeAndPlan(selectedFile);
      if (planRes) {
        setTranscriptText(planRes.transcript || "");
        setOriginalTranscriptText(planRes.transcript || "");
        setTranscriptSegments(planRes.segments || []);
        setSceneBlueprint(planRes.sceneBlueprint || []);
        setBrollUrls(planRes.brollUrls || {});
        setAudioDurationSec(planRes.durationSeconds || 60);
        setPlanWarnings(planRes.warnings || []);
        setHasEditedTranscript(false);
        setStudioStep("transcript");
        return;
      }
    }

    // Fallback if no plan handler provided
    setStudioStep("transcript");
  };

  // Handle transcript segment text editing
  const handleSegmentChange = (index: number, newText: string) => {
    const updated = [...transcriptSegments];
    updated[index] = { ...updated[index], text: newText };
    setTranscriptSegments(updated);
    setTranscriptText(updated.map((s) => s.text).join(" "));
    setHasEditedTranscript(true);
  };

  const handleResetTranscript = () => {
    setTranscriptText(originalTranscriptText);
    setHasEditedTranscript(false);
  };

  // Step 2 -> Step 3: Approve transcript & advance to storyboard
  const handleApproveTranscript = () => {
    // If user edited text, update blueprint scene texts to match
    if (hasEditedTranscript && sceneBlueprint.length > 0) {
      const updatedScenes = sceneBlueprint.map((scene, i) => {
        const matchingSeg = transcriptSegments[i] || transcriptSegments[0];
        if (matchingSeg) {
          return {
            ...scene,
            narrationSegment: {
              ...scene.narrationSegment,
              text: matchingSeg.text,
            },
            heading: scene.heading || matchingSeg.text.slice(0, 30).toUpperCase(),
          };
        }
        return scene;
      });
      setSceneBlueprint(updatedScenes);
    }
    setStudioStep("storyboard");
  };

  // Final Action: User confirms storyboard and initiates render
  const handleConfirmAndRender = () => {
    const payload = {
      sceneBlueprint,
      brollUrls,
      transcript: transcriptText,
      segments: transcriptSegments,
      durationSeconds: audioDurationSec,
      approvedCaptions: transcriptSegments.map((s) => ({
        start: s.start,
        end: s.end,
        text: s.text,
      })),
      topicTitle: topicTitle.trim() || (selectedFile ? selectedFile.name.replace(/\.[^/.]+$/, "") : "Faceless Video"),
      backgroundTheme,
      subtitleStyle,
      facelessBgmMood,
      facelessBgmVolume,
      facelessEnableSfx,
      assetSourceMode,
      visualArtStyle,
      aspectRatio: "16:9",
    };
    onGenerate(payload);
  };

  return (
    <div className="rounded-3xl border border-white/10 bg-[#0B0D13] p-6 sm:p-8 shadow-2xl text-white space-y-8">
      {/* Hidden audio element for preview */}
      {audioObjectUrl && (
        <audio
          ref={audioPlayerRef}
          src={audioObjectUrl}
          onTimeUpdate={() => setAudioCurrentTime(audioPlayerRef.current?.currentTime || 0)}
          onEnded={() => setIsPlayingAudio(false)}
        />
      )}

      {/* ── HEADER & STEPPER ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-[#0E1526] px-3 py-1 text-xs font-semibold text-zinc-300">
              <Tv size={13} className="text-[#FF5722]" />
              <span>16:9 Widescreen Only · Up to 10 min</span>
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white mt-2">
            Faceless Video Studio
          </h2>
          <p className="text-xs sm:text-sm text-zinc-400 mt-0.5">
            Turn voiceovers into complete 1080p widescreen YouTube explainer videos with verified transcripts and cinematic visuals.
          </p>
        </div>

        {/* 3-Step Wizard Navigation Indicator */}
        <div className="flex items-center gap-2 text-xs font-medium bg-[#0B0F19] border border-white/10 rounded-full p-1.5 self-start sm:self-auto">
          {[
            { id: "inputs", label: "1. Voiceover & Setup" },
            { id: "transcript", label: "2. Transcript Review" },
            { id: "storyboard", label: "3. Storyboard" },
          ].map((s) => {
            const isActive = studioStep === s.id;
            const isCompleted =
              (s.id === "inputs" && studioStep !== "inputs") ||
              (s.id === "transcript" && studioStep === "storyboard");

            return (
              <button
                key={s.id}
                type="button"
                onClick={() => {
                  if (s.id === "inputs") setStudioStep("inputs");
                  if (s.id === "transcript" && (transcriptText || studioStep === "storyboard")) setStudioStep("transcript");
                  if (s.id === "storyboard" && sceneBlueprint.length > 0) setStudioStep("storyboard");
                }}
                disabled={s.id !== "inputs" && !transcriptText && sceneBlueprint.length === 0}
                className={`flex items-center gap-1.5 rounded-full px-3.5 py-1.5 transition cursor-pointer disabled:opacity-40 disabled:pointer-events-none ${
                  isActive
                    ? "bg-gradient-to-r from-[#FF5722] via-[#FF7043] to-[#FFA000] text-white font-bold shadow-md shadow-orange-500/20"
                    : isCompleted
                    ? "text-emerald-400 hover:text-white"
                    : "text-zinc-400 hover:text-white"
                }`}
              >
                {isCompleted && <Check size={12} className="text-emerald-400" />}
                <span>{s.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────────── */}
      {/* STEP 1: VOICEOVER AUDIO & STUDIO SETTINGS                           */}
      {/* ─────────────────────────────────────────────────────────────────── */}
      {studioStep === "inputs" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column (8 cols): Primary Inputs */}
          <div className="lg:col-span-8 space-y-6">
            {/* 1. Audio Voiceover Upload Dropzone */}
            <div className="rounded-2xl border border-white/10 bg-[#0D111D] p-6 shadow-xl space-y-4">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div className="flex items-center gap-2.5">
                  <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-orange-500/10 text-orange-400 text-xs font-bold border border-orange-500/30">
                    1
                  </span>
                  <div>
                    <h3 className="text-sm sm:text-base font-bold text-white">
                      Upload Voiceover Audio
                    </h3>
                    <p className="text-xs text-zinc-400">
                      Upload spoken voiceover track (MP3, WAV, M4A up to 10 minutes / 600s).
                    </p>
                  </div>
                </div>

                <span
                  className={`rounded-full px-2.5 py-0.5 text-xs font-medium border ${
                    selectedFile
                      ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                      : "bg-white/5 text-zinc-400 border border-white/10"
                  }`}
                >
                  {selectedFile ? "Audio Loaded" : "Required"}
                </span>
              </div>

              <div>
                <input
                  type="file"
                  accept="audio/*"
                  id="faceless-voiceover-input"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0] || null;
                    if (file) onSelectFile(file);
                  }}
                />
                {!selectedFile ? (
                  <label
                    htmlFor="faceless-voiceover-input"
                    className="rounded-xl border-2 border-dashed border-white/15 bg-[#121624]/60 p-8 text-center transition cursor-pointer flex flex-col items-center justify-center gap-3 hover:border-orange-500/40 hover:bg-[#121624]"
                  >
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#0E1526] border border-white/10 text-[#FF5722] shadow-sm">
                      <Upload size={20} />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-white">Choose voiceover audio file</p>
                      <p className="text-xs text-zinc-400 mt-0.5">MP3, WAV, M4A · 16:9 Full HD format · Up to 10 minutes</p>
                    </div>
                    <span className="rounded-full bg-gradient-to-r from-[#FF5722] via-[#FF7043] to-[#FFA000] hover:brightness-110 px-4 py-2 text-xs font-bold text-white shadow-md shadow-orange-500/20 transition">
                      Browse File
                    </span>
                  </label>
                ) : (
                  <div className="rounded-xl border border-white/10 bg-[#121624] p-4 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white/5 border border-white/10 text-white font-bold text-sm shadow-sm">
                        🎙️
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-white truncate max-w-md">{selectedFile.name}</p>
                        <p className="text-[11px] text-zinc-400 mt-0.5">
                          {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB · Ready for speech transcription
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => onSelectFile(null)}
                        className="rounded-lg border border-white/10 bg-white/5 p-2 text-zinc-400 hover:text-red-400 hover:border-red-500/40 transition cursor-pointer"
                        title="Remove audio"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Video Title / Topic (Optional) */}
              <div className="space-y-1.5 pt-2">
                <label className="block text-xs font-semibold text-zinc-300">
                  Video Topic or Channel Headline (Optional)
                </label>
                <input
                  type="text"
                  value={topicTitle}
                  onChange={(e) => onTopicTitleChange?.(e.target.value)}
                  placeholder="e.g. How The Global Semiconductor Race Changed Technology"
                  className="w-full rounded-xl border border-white/10 bg-[#121624] px-3.5 py-2.5 text-xs text-white placeholder:text-zinc-500 focus:border-[#FF5722] focus:outline-none transition"
                />
              </div>
            </div>

            {/* 2. Visual Media Source & Art Style */}
            <div className="rounded-2xl border border-white/10 bg-[#0D111D] p-6 shadow-xl space-y-5">
              <div className="flex items-center gap-2.5 border-b border-white/10 pb-3">
                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-orange-500/10 text-orange-400 text-xs font-bold border border-orange-500/30">
                  2
                </span>
                <div>
                  <h3 className="text-sm sm:text-base font-bold text-white">
                    Visual Media &amp; Art Direction
                  </h3>
                  <p className="text-xs text-zinc-400">
                    Choose how scene visuals and B-roll will be matched to your voiceover.
                  </p>
                </div>
              </div>

              {/* Source Mode Options */}
              <div className="space-y-2">
                <label className="block text-xs font-semibold text-zinc-300">Asset Source Mode</label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {[
                    { id: "library", label: "Curated Stock Library", desc: "AI matches verified high-definition B-roll" },
                    { id: "upload", label: "Custom Uploads Only", desc: "Uses only your uploaded images & clips" },
                    { id: "mix", label: "Mix Both", desc: "Places your uploads at beats, fills with stock" },
                  ].map((opt) => {
                    const active = assetSourceMode === opt.id;
                    return (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => onAssetSourceModeChange(opt.id as any)}
                        className={`rounded-xl border p-3.5 text-left transition cursor-pointer ${
                          active
                            ? "border-orange-500/60 bg-[#161C2E] text-white font-semibold ring-1 ring-orange-500/40 shadow-sm"
                            : "border-white/10 bg-[#121624] text-zinc-400 hover:border-white/20 hover:text-white"
                        }`}
                      >
                        <p className="text-xs font-bold text-white">{opt.label}</p>
                        <p className="text-[11px] text-zinc-400 mt-1 leading-snug">{opt.desc}</p>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Visual Art Style Selector */}
              <div className="space-y-2 pt-2 border-t border-white/10">
                <label className="block text-xs font-semibold text-zinc-300">Visual Art Style</label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { id: "realistic", label: "📸 Realistic Photo", desc: "Authentic documentary photography" },
                    { id: "3d", label: "🧊 3D Render", desc: "Modern depth isometric visuals" },
                    { id: "2d", label: "🎨 2D Vector", desc: "Clean editorial illustration" },
                  ].map((style) => {
                    const active = visualArtStyle === style.id;
                    return (
                      <button
                        key={style.id}
                        type="button"
                        onClick={() => onVisualArtStyleChange?.(style.id as any)}
                        className={`rounded-xl border p-3 text-left transition cursor-pointer ${
                          active
                            ? "border-orange-500/60 bg-[#161C2E] font-semibold text-white ring-1 ring-orange-500/40 shadow-sm"
                            : "border-white/10 bg-[#121624] text-zinc-400 hover:border-white/20 hover:text-white"
                        }`}
                      >
                        <p className="text-xs font-bold text-white">{style.label}</p>
                        <p className="text-[10px] text-zinc-400 mt-0.5">{style.desc}</p>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Custom Uploads Zone (if Upload or Mix chosen) */}
              {(assetSourceMode === "upload" || assetSourceMode === "mix") && (
                <div className="space-y-3 pt-3 border-t border-white/10">
                  <label className="flex items-center justify-center gap-2 rounded-xl border border-dashed border-white/20 bg-white/5 p-4 text-xs font-semibold text-zinc-300 hover:border-orange-500/40 hover:text-white transition cursor-pointer">
                    <input
                      type="file"
                      multiple
                      accept="image/*,video/*"
                      onChange={handleMediaUpload}
                      className="hidden"
                    />
                    <Plus size={15} className="text-zinc-400" />
                    <span>Upload Custom Images or Clips ({uploadedImageFiles.length} selected)</span>
                  </label>

                  {uploadedImageFiles.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {uploadedImageFiles.map((file, idx) => (
                        <div
                          key={idx}
                          className="flex items-center gap-2 rounded-lg border border-white/10 bg-[#121624] px-2.5 py-1 text-xs text-zinc-300 shadow-xs"
                        >
                          <span className="text-xs">{file.type.startsWith("image") ? "🖼️" : "🎬"}</span>
                          <span className="truncate max-w-[130px] text-[11px] font-medium">{file.name}</span>
                          <button
                            type="button"
                            onClick={() => removeMediaFile(idx)}
                            className="text-zinc-400 hover:text-red-400 text-xs ml-1 cursor-pointer"
                          >
                            ✕
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* 3. Subtitle Preset Picker */}
            <div className="rounded-2xl border border-white/10 bg-[#0D111D] p-6 shadow-xl space-y-4">
              <div className="flex items-center gap-2.5 border-b border-white/10 pb-3">
                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-orange-500/10 text-orange-400 text-xs font-bold border border-orange-500/30">
                  3
                </span>
                <div>
                  <h3 className="text-sm sm:text-base font-bold text-white">
                    Subtitle Typography Style
                  </h3>
                  <p className="text-xs text-zinc-400">
                    Word-synced animated lower-third subtitle styles.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {FACELESS_SUBTITLE_STYLES.map((style) => {
                  const isSelected = subtitleStyle === style.id;
                  return (
                    <button
                      key={style.id}
                      type="button"
                      onClick={() => onSubtitleStyleChange?.(style.id)}
                      className={`rounded-xl border p-3.5 text-left transition cursor-pointer flex flex-col justify-between ${
                        isSelected
                          ? "border-orange-500/60 bg-[#161C2E] ring-1 ring-orange-500/40 shadow-md"
                          : "border-white/10 bg-[#121624] hover:border-white/20"
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">
                            {style.badge}
                          </span>
                          {isSelected && <Check size={14} className="text-[#FFA000]" />}
                        </div>
                        <p className="text-xs font-bold text-white mt-1">{style.title}</p>
                        <p className="text-[11px] text-zinc-400 mt-0.5 line-clamp-1">{style.desc}</p>
                      </div>

                      {/* Mini Preview Box */}
                      <div className="mt-3 rounded-lg bg-[#070B14] border border-white/10 p-2 text-center text-[10px] font-bold text-white">
                        {style.highlightWord ? (
                          <span>
                            {style.previewText.replace(style.highlightWord, "")}
                            <span style={{ color: style.textColor }}>{style.highlightWord}</span>
                          </span>
                        ) : (
                          <span style={{ color: style.textColor }}>{style.previewText}</span>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 4. Audio Score: BGM & SFX */}
            <div className="rounded-2xl border border-white/10 bg-[#0D111D] p-6 shadow-xl space-y-4">
              <div className="flex items-center gap-2.5 border-b border-white/10 pb-3">
                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-orange-500/10 text-orange-400 text-xs font-bold border border-orange-500/30">
                  4
                </span>
                <div>
                  <h3 className="text-sm sm:text-base font-bold text-white">
                    Background Music &amp; Audio Pacing
                  </h3>
                  <p className="text-xs text-zinc-400">
                    Smart audio ducking during speech + beat transition sound effects.
                  </p>
                </div>
              </div>

              {/* Music Mood Grid */}
              <div className="space-y-2">
                <label className="block text-xs font-semibold text-zinc-300">Music Mood</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {[
                    { id: "mystery", label: "🕯️ Mystery Cinema" },
                    { id: "lofi", label: "🎧 Ambient Lo-Fi" },
                    { id: "tech", label: "⚡ Tech Pulse" },
                    { id: "none", label: "🔇 No Music" },
                  ].map((bgm) => {
                    const active = facelessBgmMood === bgm.id;
                    return (
                      <button
                        key={bgm.id}
                        type="button"
                        onClick={() => onBgmMoodChange?.(bgm.id as any)}
                        className={`rounded-xl border p-2.5 text-center text-xs font-semibold transition cursor-pointer ${
                          active
                            ? "border-orange-500/60 bg-[#161C2E] text-white font-bold ring-1 ring-orange-500/40"
                            : "border-white/10 bg-[#121624] text-zinc-400 hover:border-white/20 hover:text-white"
                        }`}
                      >
                        {bgm.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Volume & SFX Toggles */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3 border-t border-white/10">
                <div className="flex items-center justify-between rounded-xl border border-white/10 bg-[#121624] p-3">
                  <div>
                    <p className="text-xs font-bold text-white flex items-center gap-1.5">
                      <Volume2 size={14} className="text-zinc-300" />
                      <span>Beat Sound Effects (SFX)</span>
                    </p>
                    <p className="text-[11px] text-zinc-400">Whooshes &amp; stat impact sounds</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => onEnableSfxChange?.(!facelessEnableSfx)}
                    className={`relative inline-flex h-5 w-10 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
                      facelessEnableSfx ? "bg-[#FF5722]" : "bg-white/20"
                    }`}
                  >
                    <span
                      className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                        facelessEnableSfx ? "translate-x-5" : "translate-x-0"
                      }`}
                    />
                  </button>
                </div>

                {facelessBgmMood !== "none" ? (
                  <div className="rounded-xl border border-white/10 bg-[#121624] p-3 space-y-1">
                    <div className="flex items-center justify-between text-xs font-semibold text-zinc-300">
                      <span>Music Mix Volume</span>
                      <span className="font-mono text-white">{Math.round((facelessBgmVolume || 0.15) * 100)}%</span>
                    </div>
                    <input
                      type="range"
                      min="0.05"
                      max="0.4"
                      step="0.05"
                      value={facelessBgmVolume || 0.15}
                      onChange={(e) => onBgmVolumeChange?.(parseFloat(e.target.value))}
                      className="w-full accent-[#FF5722] cursor-pointer"
                    />
                  </div>
                ) : (
                  <div className="rounded-xl border border-white/10 bg-[#121624]/40 p-3 flex items-center text-xs text-zinc-500 italic">
                    Background music disabled
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column (4 cols): Summary & Direct Next Action */}
          <div className="lg:col-span-4 sticky top-24 space-y-6">
            <div className="rounded-2xl border border-white/10 bg-[#0D111D] p-5 shadow-xl space-y-4">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                  Video Specifications
                </h3>
                <span className="rounded-full bg-white/5 border border-white/10 px-2 py-0.5 text-[10px] font-bold text-zinc-300">
                  16:9 1080p Full HD
                </span>
              </div>

              {/* Video Specs Breakdown */}
              <div className="space-y-2.5 text-xs text-zinc-300">
                <div className="flex items-center justify-between py-1 border-b border-white/5">
                  <span className="text-zinc-400">Aspect Ratio</span>
                  <span className="font-semibold text-white">16:9 Widescreen Cinema</span>
                </div>
                <div className="flex items-center justify-between py-1 border-b border-white/5">
                  <span className="text-zinc-400">Resolution</span>
                  <span className="font-semibold text-white">1920×1080 @ 30 FPS</span>
                </div>
                <div className="flex items-center justify-between py-1 border-b border-white/5">
                  <span className="text-zinc-400">Max Duration</span>
                  <span className="font-semibold text-white">Up to 10 Minutes (600s)</span>
                </div>
                <div className="flex items-center justify-between py-1 border-b border-white/5">
                  <span className="text-zinc-400">Audio Sync</span>
                  <span className="font-semibold text-white">Word-Level Groq Whisper</span>
                </div>
                <div className="flex items-center justify-between py-1">
                  <span className="text-zinc-400">Credit Rate</span>
                  <span className="font-semibold text-white">1 Min = 1 Credit</span>
                </div>
              </div>

              {/* Next Button: Advance to Step 2 Transcript Review */}
              <button
                type="button"
                onClick={handleProceedToTranscript}
                disabled={!selectedFile || isPlanning}
                className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#FF5722] via-[#FF7043] to-[#FFA000] hover:brightness-110 p-3.5 text-xs font-bold text-white shadow-lg shadow-orange-500/20 transition active:scale-98 disabled:opacity-40 disabled:pointer-events-none cursor-pointer"
              >
                {isPlanning ? (
                  <>
                    <RefreshCw size={14} className="animate-spin" />
                    <span>Transcribing Speech...</span>
                  </>
                ) : (
                  <>
                    <span>Transcribe Voiceover &amp; Plan</span>
                    <ArrowRight size={14} />
                  </>
                )}
              </button>

              <p className="text-[11px] text-center text-zinc-500">
                Step 2 allows you to review the transcript and verify timestamps before video generation.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────────── */}
      {/* STEP 2: TRANSCRIPT REVIEW & TIMESTAMP VALIDATION                    */}
      {/* ─────────────────────────────────────────────────────────────────── */}
      {studioStep === "transcript" && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
            <div>
              <h3 className="text-base font-bold text-white">
                Step 2: Review &amp; Approve Transcript
              </h3>
              <p className="text-xs text-zinc-400">
                Verify speech recognition accuracy. You can edit any sentence below. Spoken audio is preserved.
              </p>
            </div>

            <div className="flex items-center gap-2">
              {audioObjectUrl && (
                <button
                  type="button"
                  onClick={togglePlayAudio}
                  className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-[#0E1526] px-3.5 py-1.5 text-xs font-semibold text-zinc-300 hover:bg-[#141B2D] hover:text-white shadow-xs transition cursor-pointer"
                >
                  {isPlayingAudio ? <Pause size={13} /> : <Play size={13} />}
                  <span>{isPlayingAudio ? "Pause Audio" : "Listen to Narration"}</span>
                </button>
              )}
            </div>
          </div>

          {/* Edit Warning Notice if text modified */}
          {hasEditedTranscript && (
            <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-4 flex items-start gap-3 text-amber-200 text-xs">
              <AlertCircle size={16} className="text-amber-400 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <p className="font-bold">Transcript modified</p>
                <p className="text-amber-300/90 leading-relaxed">
                  Original voiceover audio will play unchanged. Your edited text will appear in subtitles and on-screen cards. If words were significantly added or removed, subtitle timing may slightly diverge from spoken voice.
                </p>
              </div>
            </div>
          )}

          {/* Transcript Chunks / Segments Editor */}
          <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2">
            {transcriptSegments.map((segment, idx) => (
              <div
                key={idx}
                className="rounded-xl border border-white/10 bg-[#0D111D] p-3.5 space-y-2 hover:border-white/20 transition"
              >
                <div className="flex items-center justify-between text-[11px] text-zinc-400 font-mono">
                  <span className="font-semibold text-zinc-300">Sentence {idx + 1}</span>
                  <span>
                    {Math.floor(segment.start / 60)}:{(segment.start % 60).toFixed(1).padStart(4, "0")} —{" "}
                    {Math.floor(segment.end / 60)}:{(segment.end % 60).toFixed(1).padStart(4, "0")}
                  </span>
                </div>
                <textarea
                  value={segment.text}
                  onChange={(e) => handleSegmentChange(idx, e.target.value)}
                  rows={2}
                  className="w-full rounded-lg border border-white/10 bg-[#121624] p-2.5 text-xs text-white focus:border-[#FF5722] focus:outline-none transition leading-relaxed resize-none"
                />
              </div>
            ))}
          </div>

          {/* Action Row */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-white/10">
            <button
              type="button"
              onClick={() => setStudioStep("inputs")}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-zinc-400 hover:text-white cursor-pointer"
            >
              <ArrowLeft size={13} />
              <span>Back to Audio Settings</span>
            </button>

            <div className="flex items-center gap-3">
              {hasEditedTranscript && (
                <button
                  type="button"
                  onClick={handleResetTranscript}
                  className="text-xs font-medium text-zinc-400 hover:text-white cursor-pointer"
                >
                  Reset to Original
                </button>
              )}
              <button
                type="button"
                onClick={handleApproveTranscript}
                className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#FF5722] via-[#FF7043] to-[#FFA000] hover:brightness-110 px-5 py-2.5 text-xs font-bold text-white shadow-md shadow-orange-500/20 transition active:scale-98 cursor-pointer"
              >
                <span>Approve Transcript &amp; View Storyboard</span>
                <ArrowRight size={13} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────────── */}
      {/* STEP 3: STORYBOARD & SCENE CONFIRMATION                             */}
      {/* ─────────────────────────────────────────────────────────────────── */}
      {studioStep === "storyboard" && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
            <div>
              <h3 className="text-base font-bold text-white">
                Step 3: Storyboard &amp; Scene Confirmation
              </h3>
              <p className="text-xs text-zinc-400">
                Review matched visual layouts, transitions, and B-roll for each scene before rendering.
              </p>
            </div>

            <div className="flex items-center gap-2 text-xs text-zinc-300 font-medium">
              <span className="rounded-full bg-white/5 border border-white/10 px-3 py-1">
                {sceneBlueprint.length} Planned Scenes
              </span>
              <span className="rounded-full bg-white/5 border border-white/10 px-3 py-1">
                {Math.round(audioDurationSec)}s Duration
              </span>
            </div>
          </div>

          {/* Storyboard Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {sceneBlueprint.map((scene, idx) => {
              const assignedUrl = brollUrls[scene.sceneNumber];
              const transitionName = (scene.transition || "dissolve").toUpperCase();
              const layoutType = (scene.layoutType || "typography").replace(/_/g, " ");

              return (
                <div
                  key={idx}
                  className="rounded-2xl border border-white/10 bg-[#0D111D] p-4 space-y-3 shadow-md hover:border-orange-500/40 hover:bg-[#121624] transition flex flex-col justify-between"
                >
                  {/* Top Metadata */}
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-zinc-500 font-mono">
                        SCENE {scene.sceneNumber || idx + 1}
                      </span>
                      <span className="inline-flex items-center gap-1 rounded-md bg-white/5 border border-white/10 px-2 py-0.5 text-[10px] font-bold uppercase text-zinc-300">
                        {transitionName}
                      </span>
                    </div>

                    <span className="inline-block rounded-md bg-orange-500/10 border border-orange-500/30 px-2 py-0.5 text-[10px] font-bold uppercase text-orange-400">
                      {layoutType}
                    </span>
                  </div>

                  {/* Visual Preview Thumbnail Box */}
                  <div className="relative aspect-video w-full rounded-xl overflow-hidden border border-white/10 bg-[#070B14] flex items-center justify-center text-center p-3">
                    {assignedUrl ? (
                      <Image
                        src={assignedUrl}
                        alt={`Scene ${scene.sceneNumber}`}
                        fill
                        className="object-cover"
                        unoptimized
                      />
                    ) : (
                      <div className="space-y-1 text-zinc-400">
                        <Film size={20} className="mx-auto text-zinc-500" />
                        <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">
                          Kinetic Typography Card
                        </p>
                      </div>
                    )}

                    {/* Headline Overlay Badge */}
                    <div className="absolute inset-x-2 bottom-2 rounded-lg bg-black/85 backdrop-blur-xs p-1.5 text-center border border-white/10">
                      <p className="text-[10px] font-bold text-white truncate">
                        {scene.heading || "SCENE HEADLINE"}
                      </p>
                    </div>
                  </div>

                  {/* Narration Segment Quote */}
                  <div className="space-y-1">
                    <p className="text-[11px] text-zinc-300 line-clamp-2 leading-relaxed">
                      "{scene.narrationSegment?.text || scene.supportingText}"
                    </p>
                    <p className="text-[10px] text-zinc-500 font-mono">
                      {(scene.narrationSegment?.startSeconds || 0).toFixed(1)}s — {(scene.narrationSegment?.endSeconds || 0).toFixed(1)}s
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Action Row: Confirm Storyboard & Render */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-white/10">
            <button
              type="button"
              onClick={() => setStudioStep("transcript")}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-zinc-400 hover:text-white cursor-pointer"
            >
              <ArrowLeft size={13} />
              <span>Back to Transcript Review</span>
            </button>

            <button
              type="button"
              onClick={handleConfirmAndRender}
              disabled={isGenerating}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#FF5722] via-[#FF7043] to-[#FFA000] hover:brightness-105 px-6 py-3.5 text-xs font-bold text-white shadow-lg shadow-orange-500/20 transition active:scale-98 disabled:opacity-40 cursor-pointer"
            >
              <Sparkles size={15} />
              <span>{isGenerating ? "Rendering Faceless Video..." : "Confirm Storyboard & Render Video"}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default FacelessVideoStudio;
