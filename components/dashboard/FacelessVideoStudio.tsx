"use client";

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import {
  Sparkles,
  Upload,
  UploadCloud,
  Layers,
  Video,
  Image as ImageIcon,
  Volume2,
  Check,
  CheckCircle2,
  Trash2,
  Play,
  Pause,
  AlertCircle,
  RefreshCw,
  Tv,
  X,
  FileText,
  Sliders,
  RotateCcw,
  ChevronDown,
  BookOpen,
  Tag,
} from "lucide-react";
import { BackgroundPicker } from "./BackgroundPicker";
import { diffBasedAlignTranscript } from "@/services/ai/transcriptAlignment";
import { FacelessStoryboardTimeline } from "./FacelessStoryboardTimeline";

export interface FacelessVideoStudioProps {
  selectedFile: File | null;
  onSelectFile: (file: File | null) => void;

  topicTitle?: string;
  onTopicTitleChange?: (val: string) => void;

  subtitleStyle?: string;
  onSubtitleStyleChange?: (style: string) => void;

  captionAnimationStyle?: "mrbeast" | "handwriting" | "bouncy" | "smooth";
  onCaptionAnimationStyleChange?: (val: "mrbeast" | "handwriting" | "bouncy" | "smooth") => void;

  captionPosition?: "bottom" | "center" | "top";
  onCaptionPositionChange?: (val: "bottom" | "center" | "top") => void;

  facelessBgmMood?: "lofi" | "tech" | "mystery" | "acoustic" | "none";
  onBgmMoodChange?: (val: "lofi" | "tech" | "mystery" | "acoustic" | "none") => void;

  facelessBgmVolume?: number;
  onBgmVolumeChange?: (val: number) => void;

  facelessPacingStyle?: "clean" | "cinematic" | "documentary" | "dynamic";
  onPacingStyleChange?: (style: "clean" | "cinematic" | "documentary" | "dynamic") => void;

  facelessEnableSfx?: boolean;
  onEnableSfxChange?: (enabled: boolean) => void;

  visualArtStyle?: "realistic" | "3d" | "2d" | string;
  onVisualArtStyleChange?: (style: any) => void;

  backgroundTheme?: string;
  onBackgroundThemeChange?: (theme: string) => void;
  customBgUrl?: string;
  onCustomBgUrlChange?: (url: string) => void;
  onCustomBgFileSelect?: (file: File | null) => void;

  onGenerate: (storyboardPayload?: any) => void;
  isGenerating: boolean;
  renderedVideoUrl?: string;

  assetSourceMode: "library" | "upload" | "mix";
  onAssetSourceModeChange: (mode: "library" | "upload" | "mix") => void;

  uploadedImageFiles: File[];
  onUploadedImageFilesChange: (files: File[]) => void;

  onTranscribeAndPlan?: (audioFile: File, brandNamesHint?: string) => Promise<{
    transcript: string;
    segments: Array<{ start: number; end: number; text: string }>;
    words?: Array<{ word: string; start: number; end: number }>;
    sceneBlueprint: any[];
    brollUrls: Record<number, string>;
    durationSeconds: number;
    warnings?: string[];
    uploadedAssets?: any[];
  } | null>;
  isPlanning?: boolean;
  planningMessage?: string;
  planningError?: string | null;
  onClearPlanningError?: () => void;
}

// ── TOP 10 HIGH-RETENTION CREATOR CAPTION TEMPLATES (GOOGLE FONTS CLOUD CDN) ──
export interface FacelessSubtitleStyle {
  id: string;
  title: string;
  fontName: string;
  fontFamily: string;
  badge: string;
  desc: string;
  textColor: string;
  highlightColor: string;
  highlightBg?: string;
  textShadow?: string;
  defaultAnimation: "mrbeast" | "handwriting" | "bouncy" | "smooth";
}

export const FACELESS_SUBTITLE_STYLES: FacelessSubtitleStyle[] = [
  {
    id: "mrbeast",
    title: "MrBeast Yellow",
    fontName: "Titan One",
    fontFamily: "'Titan One', cursive, sans-serif",
    badge: "🔥 VIRAL #1",
    desc: "Signature active yellow bounding box with punchy bold pop.",
    textColor: "#FFFFFF",
    highlightColor: "#000000",
    highlightBg: "#FFEB3B",
    textShadow: "0 4px 16px rgba(0, 0, 0, 0.95)",
    defaultAnimation: "mrbeast",
  },
  {
    id: "hormozi-bold",
    title: "Hormozi Bold",
    fontName: "Anton",
    fontFamily: "'Anton', sans-serif",
    badge: "⚡ RETENTION",
    desc: "All-caps punchy yellow & lime bold typography for viral retention.",
    textColor: "#FFFFFF",
    highlightColor: "#22C55E",
    textShadow: "0 4px 0 #000000, 0 0 14px rgba(0, 0, 0, 0.9)",
    defaultAnimation: "bouncy",
  },
  {
    id: "neon-city",
    title: "Neon City",
    fontName: "Bangers",
    fontFamily: "'Bangers', cursive, sans-serif",
    badge: "✨ NEON FX",
    desc: "Cyberpunk electric cyan and magenta neon pulse on dark b-roll.",
    textColor: "#00F0FF",
    highlightColor: "#FF007F",
    textShadow: "0 0 16px #00F0FF, 0 0 28px #FF007F",
    defaultAnimation: "bouncy",
  },
  {
    id: "daily-look",
    title: "Daily Look",
    fontName: "Londrina Solid",
    fontFamily: "'Londrina Solid', cursive, sans-serif",
    badge: "🌟 TRENDING",
    desc: "Friendly rounded cartoon stroke with warm sunny yellow glow.",
    textColor: "#FFFFFF",
    highlightColor: "#FDE047",
    textShadow: "0 3px 0 #000000, 0 0 10px rgba(0, 0, 0, 0.8)",
    defaultAnimation: "bouncy",
  },
  {
    id: "blockbuster",
    title: "Blockbuster",
    fontName: "Alfa Slab One",
    fontFamily: "'Alfa Slab One', serif",
    badge: "💥 HIGH ENERGY",
    desc: "Heavyweight powerhouse slab headlines with Flame Orange accents.",
    textColor: "#FFFFFF",
    highlightColor: "#FF5722",
    textShadow: "0 4px 0 #000000, 0 8px 20px rgba(0, 0, 0, 0.9)",
    defaultAnimation: "bouncy",
  },
  {
    id: "handwriting-pop",
    title: "Handwriting Pop",
    fontName: "Kaushan Script",
    fontFamily: "'Kaushan Script', cursive",
    badge: "✍️ HANDWRITING",
    desc: "Authentic organic script handwriting with dynamic active underline.",
    textColor: "#F8FAFC",
    highlightColor: "#FB7185",
    textShadow: "0 2px 8px rgba(0, 0, 0, 0.85)",
    defaultAnimation: "handwriting",
  },
  {
    id: "vox-docu",
    title: "Vox Docu",
    fontName: "Cinzel",
    fontFamily: "'Cinzel', serif",
    badge: "🎬 DOCUMENTARY",
    desc: "Editorial classical serif with frosted dark obsidian backdrop.",
    textColor: "#94A3B8",
    highlightColor: "#FFFFFF",
    highlightBg: "rgba(7, 11, 20, 0.85)",
    textShadow: "0 2px 10px rgba(0, 0, 0, 0.95)",
    defaultAnimation: "smooth",
  },
  {
    id: "minimal-clean",
    title: "Minimal Clean",
    fontName: "Montserrat",
    fontFamily: "'Montserrat', sans-serif",
    badge: "💎 MINIMAL",
    desc: "Ultra-crisp modern sans-serif with ice blue highlight pill.",
    textColor: "#E2E8F0",
    highlightColor: "#38BDF8",
    highlightBg: "rgba(15, 23, 42, 0.85)",
    defaultAnimation: "smooth",
  },
  {
    id: "cyber-ops",
    title: "Cyber Ops",
    fontName: "Black Ops One",
    fontFamily: "'Black Ops One', cursive, sans-serif",
    badge: "🛡️ TECH OPS",
    desc: "High-tech military stencil typography with radar green glow.",
    textColor: "#FFFFFF",
    highlightColor: "#4ADE80",
    textShadow: "0 0 16px rgba(74, 222, 128, 0.9)",
    defaultAnimation: "bouncy",
  },
  {
    id: "premium-gold",
    title: "Premium Gold",
    fontName: "Outfit",
    fontFamily: "'Outfit', sans-serif",
    badge: "👑 WEALTH",
    desc: "Metallic warm gold gradient typography for finance & luxury.",
    textColor: "#E2E8F0",
    highlightColor: "#FBBF24",
    textShadow: "0 0 18px rgba(251, 191, 36, 0.75), 0 2px 8px rgba(0, 0, 0, 0.9)",
    defaultAnimation: "bouncy",
  },
];

export function FacelessVideoStudio({
  selectedFile,
  onSelectFile,
  topicTitle = "",
  onTopicTitleChange,
  subtitleStyle = "netflix-yellow",
  onSubtitleStyleChange,
  captionAnimationStyle = "mrbeast",
  onCaptionAnimationStyleChange,
  captionPosition = "bottom",
  onCaptionPositionChange,
  facelessBgmMood = "mystery",
  onBgmMoodChange,
  facelessBgmVolume = 0.12,
  onBgmVolumeChange,
  facelessEnableSfx = true,
  onEnableSfxChange,
  visualArtStyle = "realistic",
  onVisualArtStyleChange,
  backgroundTheme = "midnight-mesh",
  onBackgroundThemeChange,
  customBgUrl = "",
  onCustomBgUrlChange,
  onCustomBgFileSelect,
  onGenerate,
  isGenerating = false,
  assetSourceMode = "library",
  onAssetSourceModeChange,
  uploadedImageFiles = [],
  onUploadedImageFilesChange,
  onTranscribeAndPlan,
  isPlanning = false,
  planningMessage = "",
  planningError = null,
  onClearPlanningError,
}: FacelessVideoStudioProps) {
  // Drag and drop audio state
  const [isDraggingAudio, setIsDraggingAudio] = useState(false);

  // Audio preview player state
  const audioPlayerRef = useRef<HTMLAudioElement | null>(null);
  const [audioObjectUrl, setAudioObjectUrl] = useState<string>("");
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [audioCurrentTime, setAudioCurrentTime] = useState(0);
  const [audioDurationSec, setAudioDurationSec] = useState(0);

  // Transcript state (Clean single-paragraph presentation)
  const [transcriptText, setTranscriptText] = useState("");
  const [originalTranscriptText, setOriginalTranscriptText] = useState("");
  const [transcriptSegments, setTranscriptSegments] = useState<
    Array<{ start: number; end: number; text: string }>
  >([]);
  const [originalWords, setOriginalWords] = useState<
    Array<{ word: string; start: number; end: number }>
  >([]);
  const [sceneBlueprint, setSceneBlueprint] = useState<any[]>([]);
  const [brollUrls, setBrollUrls] = useState<Record<number, string>>({});
  const [taggedUploadedAssets, setTaggedUploadedAssets] = useState<any[]>([]);

  // Brand and Names vocabulary bias prompt (saved in localStorage)
  const [brandNamesHint, setBrandNamesHint] = useState("");
  const [showWordReview, setShowWordReview] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("itnavideo_brand_dict");
      if (saved) setBrandNamesHint(saved);
    } catch {}
  }, []);

  const handleBrandNamesChange = (val: string) => {
    setBrandNamesHint(val);
    try {
      localStorage.setItem("itnavideo_brand_dict", val);
    } catch {}
  };

  // Review pop-up alert state (auto-dismissing)
  const [showReviewPopup, setShowReviewPopup] = useState(false);
  const popupTimerRef = useRef<NodeJS.Timeout | null>(null);

  // In-flight tracking to prevent duplicate auto-transcriptions
  const autoTranscribedFileRef = useRef<File | null>(null);

  // Create & revoke audio object URL when selectedFile changes
  useEffect(() => {
    if (selectedFile) {
      const url = URL.createObjectURL(selectedFile);
      setAudioObjectUrl(url);
      setIsPlayingAudio(false);
      setAudioCurrentTime(0);

      return () => {
        URL.revokeObjectURL(url);
      };
    } else {
      setAudioObjectUrl("");
      setIsPlayingAudio(false);
      setAudioCurrentTime(0);
      setAudioDurationSec(0);
      setTranscriptText("");
      setOriginalTranscriptText("");
      setTranscriptSegments([]);
      setSceneBlueprint([]);
      setBrollUrls({});
      setTaggedUploadedAssets([]);
      setShowReviewPopup(false);
      autoTranscribedFileRef.current = null;
    }
  }, [selectedFile]);

  // Read audio duration when metadata loads
  const handleAudioLoadedMetadata = () => {
    if (audioPlayerRef.current) {
      const dur = audioPlayerRef.current.duration;
      if (Number.isFinite(dur) && dur > 0) {
        setAudioDurationSec(dur);
      }
    }
  };

  // Play / Pause audio preview
  const togglePlayAudio = () => {
    if (!audioPlayerRef.current) return;
    if (isPlayingAudio) {
      audioPlayerRef.current.pause();
      setIsPlayingAudio(false);
    } else {
      audioPlayerRef.current
        .play()
        .then(() => setIsPlayingAudio(true))
        .catch(() => setIsPlayingAudio(false));
    }
  };

  // Handle explicit Delete / Remove action
  const handleDeleteAudio = () => {
    if (audioPlayerRef.current) {
      audioPlayerRef.current.pause();
    }
    setIsPlayingAudio(false);
    onClearPlanningError?.();
    autoTranscribedFileRef.current = null;
    setTranscriptText("");
    setOriginalTranscriptText("");
    setTranscriptSegments([]);
    setSceneBlueprint([]);
    setBrollUrls({});
    setShowReviewPopup(false);
    onSelectFile(null);
  };

  // ── AUTO-START BACKGROUND TRANSCRIPTION ENGINE ──
  // Track currently processing file to prevent duplicate triggers while ensuring state updates are never dropped
  const transcribingTargetFileRef = useRef<File | null>(null);

  const triggerTranscription = (file: File, customHint?: string) => {
    if (!onTranscribeAndPlan) return;
    transcribingTargetFileRef.current = file;
    onClearPlanningError?.();

    const hint = customHint !== undefined ? customHint : brandNamesHint;

    onTranscribeAndPlan(file, hint)
      .then((planRes) => {
        // Guard against file switch during network latency
        if (transcribingTargetFileRef.current !== file) return;
        if (!planRes) return;

        const text = planRes.transcript || "";
        setTranscriptText(text);
        setOriginalTranscriptText(text);
        setTranscriptSegments(planRes.segments || []);
        setOriginalWords(planRes.words || []);
        setSceneBlueprint(planRes.sceneBlueprint || []);
        setBrollUrls(planRes.brollUrls || {});
        if (planRes.durationSeconds > 0) {
          setAudioDurationSec(planRes.durationSeconds);
        }
        if (Array.isArray(planRes.uploadedAssets)) {
          setTaggedUploadedAssets(planRes.uploadedAssets);
        }

        // Trigger auto-dismissing Review Pop-up Alert
        setShowReviewPopup(true);
        if (popupTimerRef.current) clearTimeout(popupTimerRef.current);
        popupTimerRef.current = setTimeout(() => {
          setShowReviewPopup(false);
        }, 6500);
      })
      .catch((err) => {
        console.error("[AUTO_TRANSCRIBE_ERROR]", err);
      });
  };

  useEffect(() => {
    if (!selectedFile) {
      transcribingTargetFileRef.current = null;
      return;
    }
    // Only trigger if this exact file instance has not yet started transcribing
    if (transcribingTargetFileRef.current !== selectedFile) {
      triggerTranscription(selectedFile);
    }
  }, [selectedFile]);

  const hasEditedTranscript =
    originalTranscriptText.length > 0 &&
    transcriptText.trim() !== originalTranscriptText.trim();

  const handleResetTranscript = () => {
    setTranscriptText(originalTranscriptText);
  };

  // ── FINAL ACTION: "Generate Video" (DIFF-BASED ALIGNMENT) ──
  const handleGenerateVideo = () => {
    if (!transcriptText.trim()) return;

    // Diff-based alignment: unchanged words preserve exact Whisper timestamps
    let finalSegments = transcriptSegments;
    if (hasEditedTranscript && transcriptSegments.length > 0) {
      const { segments: alignedSegments } = diffBasedAlignTranscript(
        originalWords,
        transcriptText,
        audioDurationSec || (transcriptSegments[transcriptSegments.length - 1]?.end ?? 60)
      );
      if (alignedSegments.length > 0) {
        finalSegments = alignedSegments;
      }
    }

    // Align blueprint scene narration with edited script
    const updatedScenes =
      sceneBlueprint.length > 0
        ? sceneBlueprint.map((scene, i) => {
            const matchingSeg = finalSegments[i] || finalSegments[0];
            if (matchingSeg) {
              return {
                ...scene,
                narrationSegment: {
                  ...scene.narrationSegment,
                  text: matchingSeg.text,
                },
                heading:
                  scene.heading || matchingSeg.text.slice(0, 30).toUpperCase(),
              };
            }
            return scene;
          })
        : [];

    // Build snappy 3-4 word kinetic caption chunks with millisecond word timestamps
    const validWords = (originalWords || []).filter(
      (w) => w.word && Number.isFinite(w.start) && Number.isFinite(w.end)
    );

    let approvedCaptions: Array<{
      start: number;
      end: number;
      text: string;
      words: Array<{ word: string; start: number; end: number }>;
    }> = [];

    if (validWords.length > 0) {
      let group: typeof validWords = [];
      const MAX_WORDS = 4;
      const MAX_DURATION = 1.8;

      const flush = () => {
        if (!group.length) return;
        approvedCaptions.push({
          start: group[0].start,
          end: Math.max(group[group.length - 1].end, group[0].start + 0.45),
          text: group.map((g) => g.word).join(" "),
          words: group.map((g) => ({ word: g.word, start: g.start, end: g.end })),
        });
        group = [];
      };

      for (const w of validWords) {
        if (group.length) {
          const groupStart = group[0].start;
          const lastWord = group[group.length - 1];
          const endsSentence = /[.!?]$/.test(lastWord.word);
          const pause = w.start - lastWord.end;
          if (
            group.length >= MAX_WORDS ||
            w.end - groupStart > MAX_DURATION ||
            pause > 0.4 ||
            endsSentence
          ) {
            flush();
          }
        }
        group.push(w);
      }
      flush();
    }

    if (approvedCaptions.length === 0) {
      approvedCaptions = finalSegments.map((s) => {
        const wordsInText = (s.text || "").trim().split(/\s+/).filter(Boolean);
        const dur = Math.max(0.4, s.end - s.start);
        const timePerWord = dur / Math.max(1, wordsInText.length);
        const words = wordsInText.map((word, idx) => ({
          word,
          start: s.start + idx * timePerWord,
          end: s.start + (idx + 1) * timePerWord,
        }));
        return {
          start: s.start,
          end: s.end,
          text: s.text,
          words: (s as any).words && (s as any).words.length > 0 ? (s as any).words : words,
        };
      });
    }

    const payload = {
      sceneBlueprint: updatedScenes,
      brollUrls,
      transcript: transcriptText,
      segments: finalSegments,
      durationSeconds: audioDurationSec,
      approvedCaptions,
      topicTitle:
        topicTitle.trim() ||
        (selectedFile
          ? selectedFile.name.replace(/\.[^/.]+$/, "")
          : "Faceless Video"),
      brandNamesHint,
      backgroundTheme,
      customBgUrl,
      subtitleStyle,
      captionAnimationStyle,
      captionPosition,
      facelessBgmMood,
      facelessBgmVolume,
      facelessEnableSfx,
      assetSourceMode,
      visualArtStyle,
      aspectRatio: "16:9",
    };

    onGenerate(payload);
  };

  // Word count & formatted duration
  const wordCount = transcriptText
    .trim()
    .split(/\s+/)
    .filter(Boolean).length;
  const formattedDuration = audioDurationSec > 0
    ? `${Math.floor(audioDurationSec / 60)}:${Math.floor(audioDurationSec % 60)
        .toString()
        .padStart(2, "0")}`
    : "--:--";

  const selectedSubtitleObj =
    FACELESS_SUBTITLE_STYLES.find((s) => s.id === subtitleStyle) ||
    FACELESS_SUBTITLE_STYLES[0];

  return (
    <div className="rounded-3xl border border-white/10 bg-[#0B0D13] p-6 sm:p-8 shadow-2xl text-white space-y-8">
      {/* Hidden audio element for preview playback */}
      {audioObjectUrl && (
        <audio
          ref={audioPlayerRef}
          src={audioObjectUrl}
          onLoadedMetadata={handleAudioLoadedMetadata}
          onTimeUpdate={() =>
            setAudioCurrentTime(audioPlayerRef.current?.currentTime || 0)
          }
          onEnded={() => setIsPlayingAudio(false)}
        />
      )}

      {/* ── HEADER ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-[#0E1526] px-3 py-1 text-xs font-semibold text-zinc-300">
              <Tv size={13} className="text-[#FF5722]" />
              <span>16:9 Widescreen Only · Up to 10 min · 1080p Full HD</span>
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white mt-2">
            Faceless Video Generator
          </h2>
          <p className="text-xs sm:text-sm text-zinc-400 mt-0.5">
            Turn your voiceover audio into a complete 1080p widescreen YouTube explainer video with auto B-roll, subtitles, and music.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="rounded-full bg-white/5 border border-white/10 px-3 py-1 text-xs font-medium text-zinc-300">
            1 Min = 1 Credit
          </span>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────────── */}
      {/* 1. AUDIO UPLOAD & CONFIRMATION WITH DELETE CAPABILITY               */}
      {/* ─────────────────────────────────────────────────────────────────── */}
      <div className="space-y-4">
        <input
          type="file"
          accept="audio/*"
          id="faceless-voiceover-input"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0] || null;
            if (file) {
              onClearPlanningError?.();
              onSelectFile(file);
            }
          }}
        />

        {!selectedFile ? (
          <label
            htmlFor="faceless-voiceover-input"
            onDragOver={(e) => {
              e.preventDefault();
              setIsDraggingAudio(true);
            }}
            onDragLeave={() => setIsDraggingAudio(false)}
            onDrop={(e) => {
              e.preventDefault();
              setIsDraggingAudio(false);
              const file = e.dataTransfer.files?.[0] || null;
              if (file) {
                onClearPlanningError?.();
                onSelectFile(file);
              }
            }}
            className={`rounded-2xl border-2 border-dashed p-8 sm:p-10 text-center transition cursor-pointer flex flex-col items-center justify-center gap-3.5 ${
              isDraggingAudio
                ? "border-orange-500 bg-orange-500/10"
                : "border-white/15 bg-[#0D111D] hover:border-orange-500/40 hover:bg-[#121624]"
            }`}
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#0E1526] border border-white/10 text-[#FF5722] shadow-sm">
              <Upload size={22} />
            </div>
            <div>
              <p className="text-sm sm:text-base font-semibold text-white">
                Upload Voiceover Audio File
              </p>
              <p className="text-xs text-zinc-400 mt-1">
                MP3, WAV, M4A · 16:9 Full HD format · Up to 10 minutes (600s)
              </p>
            </div>
            <span className="rounded-full bg-gradient-to-r from-[#FF5722] via-[#FF7043] to-[#FFA000] hover:brightness-110 px-5 py-2.5 text-xs font-bold text-white shadow-md shadow-orange-500/20 transition">
              Browse File
            </span>
          </label>
        ) : (
          /* Confirmation & Preview Card with Explicit Delete / Remove Option */
          <div className="rounded-2xl border border-white/10 bg-[#0D111D] p-5 shadow-xl space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3.5 min-w-0">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-orange-500/10 border border-orange-500/30 text-[#FF5722] text-lg font-bold shadow-sm">
                  🎙️
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-bold text-white truncate max-w-sm sm:max-w-md">
                      {selectedFile.name}
                    </p>
                    <span className="shrink-0 rounded-full bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 text-[10px] font-semibold text-emerald-400">
                      Confirmed
                    </span>
                  </div>
                  <p className="text-xs text-zinc-400 mt-0.5">
                    {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
                    {audioDurationSec > 0 && ` · ${formattedDuration} duration`}
                  </p>
                </div>
              </div>

              {/* Action Buttons: Play/Pause Audio Preview + Explicit Delete Button */}
              <div className="flex items-center gap-2.5 self-end sm:self-auto">
                {audioObjectUrl && (
                  <button
                    type="button"
                    onClick={togglePlayAudio}
                    className="inline-flex items-center gap-1.5 rounded-xl border border-white/10 bg-[#121624] px-3.5 py-2 text-xs font-semibold text-zinc-300 hover:text-white hover:border-white/25 transition cursor-pointer"
                    title={isPlayingAudio ? "Pause Audio" : "Listen to Audio"}
                  >
                    {isPlayingAudio ? (
                      <>
                        <Pause size={14} className="text-[#FFA000]" />
                        <span>Pause</span>
                      </>
                    ) : (
                      <>
                        <Play size={14} className="text-[#FFA000]" />
                        <span>Play Preview</span>
                      </>
                    )}
                  </button>
                )}

                {/* Explicit Delete / Remove Button */}
                <button
                  type="button"
                  onClick={handleDeleteAudio}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-red-500/30 bg-red-500/10 px-3.5 py-2 text-xs font-semibold text-red-300 hover:bg-red-500/20 hover:text-red-200 transition cursor-pointer"
                  title="Delete uploaded audio and choose another file"
                >
                  <Trash2 size={14} />
                  <span>Remove Audio</span>
                </button>
              </div>
            </div>

            {/* Audio Progress Scrubber */}
            {audioDurationSec > 0 && (
              <div className="pt-2 border-t border-white/5 flex items-center gap-3">
                <span className="text-[11px] font-mono text-zinc-400">
                  {Math.floor(audioCurrentTime / 60)}:
                  {Math.floor(audioCurrentTime % 60)
                    .toString()
                    .padStart(2, "0")}
                </span>
                <div className="flex-1 h-1.5 rounded-full bg-white/10 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-[#FF5722] to-[#FFA000] rounded-full transition-all duration-100"
                    style={{
                      width: `${Math.min(
                        100,
                        (audioCurrentTime / audioDurationSec) * 100
                      )}%`,
                    }}
                  />
                </div>
                <span className="text-[11px] font-mono text-zinc-400">
                  {formattedDuration}
                </span>
              </div>
            )}
          </div>
        )}

        {/* ── 2. AUTO-DISMISSING REVIEW POP-UP ALERT ── */}
        {showReviewPopup && (
          <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/15 p-4 flex items-start justify-between gap-3 text-emerald-200 text-xs shadow-lg animate-in fade-in slide-in-from-top-2 duration-300">
            <div className="flex items-start gap-3">
              <CheckCircle2 size={18} className="text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <p className="text-xs sm:text-sm font-bold text-emerald-300">
                  Transcription completed!
                </p>
                <p className="text-xs text-emerald-100/90 mt-0.5 leading-relaxed">
                  Please review your voiceover text below and fix any spelling or wording errors before generating your video.
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setShowReviewPopup(false)}
              className="text-emerald-400/80 hover:text-white p-1 transition cursor-pointer"
              title="Dismiss alert"
            >
              <X size={16} />
            </button>
          </div>
        )}
      </div>

      {/* ─────────────────────────────────────────────────────────────────── */}
      {/* 3. VOICEOVER SCRIPT REVIEW & CAPTION OPTIONS (ALWAYS VISIBLE)        */}
      {/* ─────────────────────────────────────────────────────────────────── */}
      <div className="rounded-2xl border border-white/10 bg-[#0D111D] p-5 sm:p-6 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-3.5">
          <div className="flex items-center gap-2.5">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-orange-500/10 text-orange-400 text-xs font-bold border border-orange-500/30">
              <FileText size={14} />
            </span>
            <div>
              <h3 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
                <span>Voiceover Script & Subtitles</span>
                {isPlanning && (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-orange-500/15 border border-orange-500/30 px-2.5 py-0.5 text-[10px] font-bold text-orange-400 animate-pulse">
                    <RefreshCw size={10} className="animate-spin" />
                    <span>Transcribing...</span>
                  </span>
                )}
              </h3>
              <p className="text-xs text-zinc-400">
                Review and edit your voiceover text. This text is used for your on-screen animated subtitles.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs">
            {isPlanning ? (
              <span className="rounded-full bg-orange-500/10 border border-orange-500/25 px-3 py-1 font-mono text-[11px] text-orange-300">
                Groq Whisper AI
              </span>
            ) : transcriptText ? (
              <>
                <span className="rounded-full bg-white/5 border border-white/10 px-3 py-1 font-mono text-zinc-300">
                  {wordCount} words
                </span>
                {hasEditedTranscript && (
                  <button
                    type="button"
                    onClick={handleResetTranscript}
                    className="inline-flex items-center gap-1 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-amber-300 hover:text-white transition cursor-pointer"
                    title="Reset to original transcribed text"
                  >
                    <RotateCcw size={12} />
                    <span>Reset to Original</span>
                  </button>
                )}
              </>
            ) : selectedFile ? (
              <button
                type="button"
                onClick={() => triggerTranscription(selectedFile)}
                className="inline-flex items-center gap-1.5 rounded-full border border-orange-500/30 bg-orange-500/10 px-3 py-1 text-xs font-semibold text-orange-300 hover:text-white hover:bg-orange-500/20 transition cursor-pointer"
              >
                <RefreshCw size={12} />
                <span>Transcribe Speech</span>
              </button>
            ) : (
              <span className="rounded-full bg-white/5 border border-white/10 px-3 py-1 font-mono text-[11px] text-zinc-400">
                Auto-transcribes on audio upload
              </span>
            )}
          </div>
        </div>

          {/* Transcription Error Alert with Retry */}
          {planningError && !isPlanning && (
            <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-xs text-red-300 flex items-start justify-between gap-3">
              <div className="flex items-start gap-2.5">
                <AlertCircle size={16} className="text-red-400 shrink-0 mt-0.5" />
                <div className="space-y-0.5">
                  <p className="font-bold text-red-200">Transcription Note</p>
                  <p className="text-zinc-300 leading-relaxed">{planningError}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => selectedFile && triggerTranscription(selectedFile)}
                className="rounded-lg border border-red-500/40 bg-red-500/20 px-3 py-1.5 text-xs font-semibold text-white hover:bg-red-500/30 transition cursor-pointer shrink-0"
              >
                Retry
              </button>
            </div>
          )}

          {/* ── 1-CLICK CAPTION TEMPLATES (CAPCUT-STYLE VISUAL THUMBNAILS) ── */}
          <div className="rounded-2xl border border-white/10 bg-[#121624] p-4 sm:p-5 space-y-4 shadow-xl">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-3">
              <div>
                <div className="flex items-center gap-2">
                  <Sparkles size={16} className="text-[#FFA000]" />
                  <h4 className="text-sm sm:text-base font-bold text-white">
                    Caption Templates
                  </h4>
                  <span className="rounded-full bg-orange-500/10 border border-orange-500/30 px-2 py-0.5 text-[10px] font-bold text-orange-400">
                    Top 10 Creator Styles
                  </span>
                </div>
                <p className="text-xs text-zinc-400 mt-0.5">
                  1-Click Apply: Pre-designed viral combinations of fonts, kinetic motion, and colors.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className="rounded-full bg-white/5 border border-white/10 px-2.5 py-1 text-[11px] font-mono text-zinc-300">
                  Google Fonts Cloud CDN
                </span>
              </div>
            </div>

            {/* 10 Visual Cards Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
              {FACELESS_SUBTITLE_STYLES.map((tpl) => {
                const isSelected =
                  subtitleStyle === tpl.id ||
                  (subtitleStyle === "netflix-yellow" && tpl.id === "mrbeast");

                return (
                  <button
                    key={tpl.id}
                    type="button"
                    onClick={() => {
                      onSubtitleStyleChange?.(tpl.id);
                      onCaptionAnimationStyleChange?.(tpl.defaultAnimation);
                    }}
                    className={`group relative rounded-xl border p-3 text-left transition-all duration-150 cursor-pointer flex flex-col justify-between ${
                      isSelected
                        ? "border-[#FF5722] bg-[#161C2E] ring-2 ring-orange-500/50 shadow-lg shadow-orange-500/15"
                        : "border-white/10 bg-[#0E1322] hover:border-white/25 hover:bg-[#121829]"
                    }`}
                  >
                    {/* Card Top: Category Badge + Check Icon */}
                    <div className="flex items-center justify-between gap-1 w-full">
                      <span className="text-[9px] font-extrabold uppercase tracking-wider text-zinc-400 group-hover:text-zinc-300 truncate">
                        {tpl.badge}
                      </span>
                      {isSelected && (
                        <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-gradient-to-tr from-[#FF5722] to-[#FFA000] text-white shadow-sm">
                          <Check size={10} strokeWidth={3} />
                        </span>
                      )}
                    </div>

                    {/* Center: Real Visual Font Thumbnail */}
                    <div className="my-2 h-14 w-full rounded-lg bg-[#070B14] border border-white/5 flex items-center justify-center px-2 py-1 text-center overflow-hidden">
                      <div
                        style={{
                          fontFamily: tpl.fontFamily,
                        }}
                        className="text-xs sm:text-[13px] leading-tight select-none"
                      >
                        {tpl.id === "mrbeast" ? (
                          <span>
                            <span className="text-white mr-1 text-[11px]">THIS IS</span>
                            <span className="bg-[#FFEB3B] text-black font-extrabold px-1.5 py-0.5 rounded shadow-sm text-xs">
                              INSANE
                            </span>
                          </span>
                        ) : tpl.id === "hormozi-bold" ? (
                          <span>
                            <span className="text-white mr-1 text-[11px]">SCALE</span>
                            <span className="text-[#22C55E] font-black text-xs" style={{ textShadow: "0 2px 0 #000" }}>
                              BUSINESS
                            </span>
                          </span>
                        ) : tpl.id === "neon-city" ? (
                          <span
                            className="text-[#00F0FF] font-bold tracking-wider text-xs"
                            style={{ textShadow: "0 0 10px #00F0FF, 0 0 18px #FF007F" }}
                          >
                            FUTURE NOW
                          </span>
                        ) : tpl.id === "daily-look" ? (
                          <span className="text-[#FDE047] font-black text-xs" style={{ textShadow: "0 2px 0 #000" }}>
                            DAILY VLOG
                          </span>
                        ) : tpl.id === "blockbuster" ? (
                          <span className="text-[#FF5722] font-black tracking-tight text-xs" style={{ textShadow: "0 2px 0 #000" }}>
                            CRISIS HOOK
                          </span>
                        ) : tpl.id === "handwriting-pop" ? (
                          <span className="text-[#FB7185] font-bold underline decoration-2 underline-offset-4 text-xs">
                            Secret Hacks
                          </span>
                        ) : tpl.id === "vox-docu" ? (
                          <span className="text-slate-100 text-[10px] tracking-widest uppercase font-semibold">
                            THE UNTOLD
                          </span>
                        ) : tpl.id === "minimal-clean" ? (
                          <span>
                            <span className="text-white mr-1 text-[11px]">CLEAN</span>
                            <span className="text-[#38BDF8] font-bold px-1 py-0.5 rounded bg-sky-950/80 border border-sky-400/30 text-[11px]">
                              PRO
                            </span>
                          </span>
                        ) : tpl.id === "cyber-ops" ? (
                          <span className="text-[#4ADE80] font-bold tracking-widest text-[11px]" style={{ textShadow: "0 0 8px rgba(74,222,128,0.8)" }}>
                            MISSION ON
                          </span>
                        ) : (
                          <span className="text-[#FBBF24] font-black tracking-wider text-xs" style={{ textShadow: "0 0 10px rgba(251,191,36,0.6)" }}>
                            WEALTH
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Bottom: Template Title & Visible Font Name */}
                    <div className="w-full pt-1.5 border-t border-white/5 space-y-0.5">
                      <p className="text-xs font-bold text-white truncate">{tpl.title}</p>
                      <div className="flex items-center justify-between text-[10px]">
                        <span className="text-zinc-500">Font:</span>
                        <span className="font-mono font-bold text-amber-400 truncate max-w-[85px]">
                          {tpl.fontName}
                        </span>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Micro Controls & Live Active Details Strip */}
            <div className="rounded-xl border border-white/5 bg-[#090C16] p-3 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
              {/* Active Selection Readout */}
              <div className="flex flex-wrap items-center gap-2 min-w-0">
                <span className="text-zinc-400 text-[11px]">Active:</span>
                <span className="font-bold text-white">
                  {selectedSubtitleObj?.title || "MrBeast Yellow"}
                </span>
                <span className="text-zinc-600">•</span>
                <span className="rounded-md bg-amber-500/10 border border-amber-500/25 px-2 py-0.5 text-[10px] font-mono text-amber-300">
                  Font: {selectedSubtitleObj?.fontName || "Titan One"}
                </span>
              </div>

              {/* Quick Position & Motion Kinetics Tweaks */}
              <div className="flex flex-wrap items-center gap-2">
                {/* Position Segmented Switch */}
                <div className="flex items-center rounded-lg bg-[#0E1526] p-0.5 border border-white/10 text-[11px]">
                  {(["bottom", "center", "top"] as const).map((pos) => (
                    <button
                      key={pos}
                      type="button"
                      onClick={() => onCaptionPositionChange?.(pos)}
                      className={`px-2.5 py-1 rounded-md font-semibold capitalize transition cursor-pointer ${
                        captionPosition === pos
                          ? "bg-gradient-to-r from-[#FF5722] to-[#FFA000] text-white shadow-sm"
                          : "text-zinc-400 hover:text-white"
                      }`}
                    >
                      {pos === "bottom" ? "Bottom (16:9)" : pos === "center" ? "Center" : "Top"}
                    </button>
                  ))}
                </div>

                {/* Motion Kinetics Switch */}
                <div className="flex items-center rounded-lg bg-[#0E1526] p-0.5 border border-white/10 text-[11px]">
                  {(["mrbeast", "bouncy", "handwriting", "smooth"] as const).map((anim) => (
                    <button
                      key={anim}
                      type="button"
                      onClick={() => onCaptionAnimationStyleChange?.(anim)}
                      className={`px-2.5 py-1 rounded-md font-semibold capitalize transition cursor-pointer ${
                        captionAnimationStyle === anim
                          ? "bg-orange-500/20 border border-orange-500/40 text-orange-300 shadow-sm"
                          : "text-zinc-400 hover:text-white"
                      }`}
                    >
                      {anim === "mrbeast" ? "Yellow Box" : anim === "bouncy" ? "Bounce" : anim === "handwriting" ? "Handwriting" : "Smooth"}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* ── BRAND & PROPER NAMES VOCABULARY BIAS (WHISPER PROMPT) ── */}
          <div className="rounded-2xl border border-white/10 bg-[#0E1526]/80 p-4 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <Tag size={14} className="text-[#FF7043]" />
                <span className="text-xs font-bold text-white tracking-wide">
                  Brand &amp; Proper Names Hint (Whisper Vocabulary Prompt)
                </span>
                <span className="text-[10px] text-amber-300 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20 font-semibold flex items-center gap-1">
                  <BookOpen size={10} />
                  <span>Saved Dictionary</span>
                </span>
              </div>

              {selectedFile && !isPlanning && (
                <button
                  type="button"
                  onClick={() => triggerTranscription(selectedFile, brandNamesHint)}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-orange-500/15 hover:bg-orange-500/25 border border-orange-500/30 text-[11px] font-bold text-orange-300 transition cursor-pointer self-start sm:self-auto"
                >
                  <RotateCcw size={12} />
                  <span>Re-Transcribe with Brand Bias</span>
                </button>
              )}
            </div>

            <div className="space-y-1">
              <input
                type="text"
                value={brandNamesHint}
                onChange={(e) => handleBrandNamesChange(e.target.value)}
                placeholder="e.g. OpenAI, Jensen Huang, Remotion, ItnaVideo, ChatGPT, NVIDIA, WebGL"
                className="w-full rounded-xl border border-white/10 bg-[#070B14] px-3.5 py-2 text-xs text-white placeholder-zinc-500 focus:border-[#FF5722] focus:ring-1 focus:ring-[#FF5722] focus:outline-none transition shadow-inner font-mono"
              />
              <p className="text-[10px] text-zinc-400">
                Whisper uses these hints as vocabulary context to transcribe difficult proper nouns, acronyms, and names with 100% accuracy on the first pass.
              </p>
            </div>
          </div>

          {/* Clean Document View / Editable Textarea */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-zinc-300 px-1">
              <span>Transcribed Script &amp; Review</span>
              <button
                type="button"
                onClick={() => setShowWordReview(!showWordReview)}
                className="text-[11px] font-bold text-[#FF7043] hover:text-[#FFA000] transition flex items-center gap-1 cursor-pointer"
              >
                <span>{showWordReview ? "Hide Edit Highlights" : "Highlight Word Edits"}</span>
              </button>
            </div>

            {/* Word Review Visual Highlighter */}
            {showWordReview && transcriptText && (
              <div className="rounded-xl border border-amber-500/30 bg-amber-500/5 p-3.5 text-xs text-slate-200 leading-relaxed font-sans max-h-36 overflow-y-auto">
                <p className="text-[10px] font-black uppercase tracking-wider text-amber-400 mb-2">
                  DIFF SYNC PREVIEW &bull; YELLOW WORDS ADJUSTED LOCALLY
                </p>
                <div className="flex flex-wrap gap-1">
                  {transcriptText.split(/\s+/).filter(Boolean).map((word, wIdx) => {
                    const clean = word.toLowerCase().replace(/[^a-z0-9]/g, "");
                    const isUnchanged = originalWords.some(
                      (ow) => ow.word.toLowerCase().replace(/[^a-z0-9]/g, "") === clean
                    );
                    return (
                      <span
                        key={wIdx}
                        className={`px-1.5 py-0.5 rounded ${
                          isUnchanged
                            ? "text-slate-300"
                            : "bg-amber-400/20 text-amber-300 border border-amber-400/40 font-semibold"
                        }`}
                      >
                        {word}
                      </span>
                    );
                  })}
                </div>
              </div>
            )}

            <textarea
              value={transcriptText}
              onChange={(e) => setTranscriptText(e.target.value)}
              rows={6}
              disabled={isPlanning}
              placeholder={
                isPlanning
                  ? "Transcribing your voiceover speech in the background... Please wait 2-4 seconds."
                  : "Your transcribed script will appear here. Edit any words or typos freely, or type your narration text manually..."
              }
              className="w-full rounded-xl border border-white/10 bg-[#0E1526] p-4 text-xs sm:text-sm text-slate-100 placeholder-zinc-500 focus:border-[#FF5722] focus:ring-1 focus:ring-[#FF5722] focus:outline-none transition leading-relaxed resize-y min-h-[140px] font-sans shadow-inner disabled:opacity-60"
            />
            <div className="flex flex-col sm:flex-row sm:items-center justify-between text-[11px] text-zinc-400 gap-1 px-1">
              <span>Diff-based audio alignment ensures unchanged words maintain 100% exact Whisper timestamps.</span>
              {hasEditedTranscript ? (
                <span className="text-amber-400 font-medium">Edited text ready for render</span>
              ) : transcriptText ? (
                <span className="text-emerald-400 font-medium flex items-center gap-1">
                  <Check size={12} />
                  <span>Ready for 1080p render</span>
                </span>
              ) : null}
            </div>
          </div>
        </div>

      {/* ─────────────────────────────────────────────────────────────────── */}
      {/* 4. CREATIVE STYLING & AUDIO CONTROLS (NO SCENE NUMBERS)            */}
      {/* ─────────────────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column (8 cols): Styling options */}
        <div className="lg:col-span-8 space-y-6">



          {/* Visual Assets & Media Source (Realistic Photos & B-Roll + Custom Uploads) */}
          <div className="rounded-2xl border border-white/10 bg-[#0D111D] p-5 shadow-xl space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-3">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-300">
                  Visual Assets &amp; Media Source
                </h3>
                <p className="text-[11px] text-zinc-400 mt-0.5">
                  Default Style: <span className="text-orange-400 font-semibold">Assets / Realistic Photos &amp; B-Roll</span> (1080p Documentary Standard)
                </p>
              </div>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 px-2.5 py-0.5 text-[10px] font-bold text-emerald-400">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Consistent Photorealistic
              </span>
            </div>

            {/* Source Mode Toggle: Library vs Mix vs Upload */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              {[
                {
                  id: "library",
                  icon: Sparkles,
                  label: "AI Auto-Match Library",
                  desc: "300+ curated 1080p realistic photos & b-roll matched to narration",
                },
                {
                  id: "mix",
                  icon: Layers,
                  label: "Mix (Uploads + AI)",
                  desc: "Prioritize your uploaded media, fill remaining scenes with AI library",
                },
                {
                  id: "upload",
                  icon: UploadCloud,
                  label: "Upload Custom Media Only",
                  desc: "Exclusively use your own uploaded photos & video clips",
                },
              ].map((opt) => {
                const active = (assetSourceMode || "library") === opt.id;
                const Icon = opt.icon;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => onAssetSourceModeChange?.(opt.id as any)}
                    className={`rounded-xl border p-3 text-left transition cursor-pointer relative ${
                      active
                        ? "border-[#FF5722] bg-[#161C2E] ring-1 ring-[#FF5722]/50 shadow-md"
                        : "border-white/10 bg-[#121624] text-zinc-400 hover:border-white/20 hover:text-white"
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <Icon size={14} className={active ? "text-[#FF5722]" : "text-zinc-400"} />
                      <p className={`text-xs font-bold ${active ? "text-white" : "text-zinc-300"}`}>
                        {opt.label}
                      </p>
                    </div>
                    <p className="text-[10.5px] text-zinc-400 leading-tight">{opt.desc}</p>
                  </button>
                );
              })}
            </div>

            {/* Custom Media Upload Dropzone (When mode is "upload" or "mix") */}
            {(assetSourceMode === "upload" || assetSourceMode === "mix") && (
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-zinc-300">
                    Upload Photos &amp; Video Clips
                  </label>
                  <span className="text-[11px] text-zinc-400 font-mono">
                    {uploadedImageFiles.length} file{uploadedImageFiles.length === 1 ? "" : "s"} selected
                  </span>
                </div>

                {/* Dropzone container */}
                <div className="relative rounded-xl border border-dashed border-white/20 bg-[#121624]/60 p-4 text-center hover:border-[#FF5722]/50 transition cursor-pointer">
                  <input
                    type="file"
                    accept="image/png,image/jpeg,image/jpg,image/webp,video/mp4,video/webm,video/quicktime,video/mov"
                    multiple
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    onChange={(e) => {
                      const files = Array.from(e.target.files || []);
                      if (files.length > 0) {
                        onUploadedImageFilesChange?.([...uploadedImageFiles, ...files]);
                      }
                      e.target.value = "";
                    }}
                  />
                  <div className="flex flex-col items-center gap-1.5 pointer-events-none">
                    <div className="p-2 rounded-full bg-[#FF5722]/10 border border-[#FF5722]/30 text-[#FF5722]">
                      <UploadCloud size={20} />
                    </div>
                    <p className="text-xs font-bold text-white">
                      Click to browse or drop photos &amp; video clips
                    </p>
                    <p className="text-[10.5px] text-zinc-400">
                      Supports JPG, PNG, WebP, MP4, MOV, WebM (Auto-integrated into scene timeline)
                    </p>
                  </div>
                </div>

                {/* File Previews List */}
                {uploadedImageFiles.length > 0 && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-zinc-400 font-medium">Selected Visual Media:</span>
                      <button
                        type="button"
                        onClick={() => onUploadedImageFilesChange?.([])}
                        className="text-red-400 hover:text-red-300 transition text-[11px] font-semibold"
                      >
                        Clear All
                      </button>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-2 max-h-48 overflow-y-auto pr-1">
                      {uploadedImageFiles.map((file, idx) => {
                        const isVideoFile = file.type.startsWith("video/") || /\.(mp4|webm|mov|m4v)$/i.test(file.name);
                        return (
                          <div
                            key={`${file.name}-${idx}`}
                            className="relative group rounded-lg border border-white/10 bg-[#161C2E] p-1.5 flex flex-col items-center justify-center text-center overflow-hidden"
                          >
                            <div className="w-full h-12 bg-black/40 rounded flex items-center justify-center overflow-hidden mb-1">
                              {isVideoFile ? (
                                <Video size={18} className="text-orange-400" />
                              ) : (
                                <ImageIcon size={18} className="text-blue-400" />
                              )}
                            </div>
                            <span className="text-[9.5px] font-mono text-zinc-300 truncate w-full px-1">
                              {file.name}
                            </span>
                            <span className="text-[8.5px] font-bold text-zinc-500 uppercase mt-0.5">
                              {isVideoFile ? "Video Clip" : "Photo"}
                            </span>
                            <button
                              type="button"
                              onClick={() => {
                                onUploadedImageFilesChange?.(uploadedImageFiles.filter((_, i) => i !== idx));
                              }}
                              className="absolute top-1 right-1 p-0.5 rounded-full bg-red-500 text-white opacity-0 group-hover:opacity-100 transition shadow"
                              title="Remove"
                            >
                              <X size={10} />
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* 5. INTERACTIVE SCENE STORYBOARD & VISUAL ASSET TIMELINE */}
          {sceneBlueprint.length > 0 && (
            <FacelessStoryboardTimeline
              scenes={sceneBlueprint}
              brollUrls={brollUrls}
              onBrollUrlsChange={setBrollUrls}
              uploadedAssets={taggedUploadedAssets}
              uploadedImageFiles={uploadedImageFiles}
              onSeekAudio={(timeSec) => {
                if (audioPlayerRef.current) {
                  audioPlayerRef.current.currentTime = timeSec;
                  setAudioCurrentTime(timeSec);
                }
              }}
            />
          )}

          {/* Video Background Picker (Code-based SVG/CSS/Canvas + Custom Upload) */}
          <BackgroundPicker
            selectedTheme={backgroundTheme}
            onSelectTheme={(themeId) => onBackgroundThemeChange?.(themeId)}
            customBgUrl={customBgUrl}
            onCustomBgUrlChange={onCustomBgUrlChange}
            onCustomFileSelect={onCustomBgFileSelect}
          />

          {/* Background Music & SFX */}
          <div className="rounded-2xl border border-white/10 bg-[#0D111D] p-5 shadow-xl space-y-4">
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-zinc-300">Background Music Mood</label>
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

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3 border-t border-white/10">
              <div className="flex items-center justify-between rounded-xl border border-white/10 bg-[#121624] p-3">
                <div>
                  <p className="text-xs font-bold text-white flex items-center gap-1.5">
                    <Volume2 size={14} className="text-zinc-300" />
                    <span>Beat Sound Effects (SFX)</span>
                  </p>
                  <p className="text-[11px] text-zinc-400">Pops &amp; transition whooshes</p>
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
                    <span>Music Mix Volume (Auto-Ducked)</span>
                    <span className="font-mono text-white">{Math.round((facelessBgmVolume || 0.12) * 100)}%</span>
                  </div>
                  <input
                    type="range"
                    min="0.05"
                    max="0.30"
                    step="0.01"
                    value={facelessBgmVolume ?? 0.12}
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

        {/* Right Column (4 cols): Summary Specs & 5. FINAL ACTION GENERATE BUTTON */}
        <div className="lg:col-span-4 sticky top-24 space-y-6">
          <div className="rounded-2xl border border-white/10 bg-[#0D111D] p-5 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                Video Specifications
              </h3>
              <span className="rounded-full bg-white/5 border border-white/10 px-2 py-0.5 text-[10px] font-bold text-zinc-300">
                16:9 Full HD
              </span>
            </div>

            <div className="space-y-2.5 text-xs text-zinc-300">
              <div className="flex items-center justify-between py-1 border-b border-white/5">
                <span className="text-zinc-400">Aspect Ratio</span>
                <span className="font-semibold text-white">16:9 Widescreen</span>
              </div>
              <div className="flex items-center justify-between py-1 border-b border-white/5">
                <span className="text-zinc-400">Resolution</span>
                <span className="font-semibold text-white">1920×1080 @ 30 FPS</span>
              </div>
              <div className="flex items-center justify-between py-1 border-b border-white/5">
                <span className="text-zinc-400">Audio Duration</span>
                <span className="font-semibold text-white">
                  {audioDurationSec > 0 ? formattedDuration : "Upload audio"}
                </span>
              </div>
              <div className="flex items-center justify-between py-1 border-b border-white/5">
                <span className="text-zinc-400">Script Review</span>
                <span className="font-semibold text-white">
                  {isPlanning
                    ? "Transcribing..."
                    : transcriptText
                    ? `${wordCount} words (Ready)`
                    : selectedFile
                    ? "Script ready to edit"
                    : "Pending audio"}
                </span>
              </div>
              {sceneBlueprint.length > 0 && (
                <div className="flex items-center justify-between py-1 border-b border-white/5">
                  <span className="text-zinc-400">Storyboard Beats</span>
                  <span className="font-semibold text-emerald-400">{sceneBlueprint.length} Scenes Ready</span>
                </div>
              )}
              <div className="flex items-center justify-between py-1">
                <span className="text-zinc-400">Credit Rate</span>
                <span className="font-semibold text-white">1 Min = 1 Credit</span>
              </div>
            </div>

            {/* ── 5. FINAL ACTION: "GENERATE VIDEO" BUTTON ── */}
            {/* Show only once audio is uploaded and transcript is ready for review */}
            <div className="pt-2">
              <button
                type="button"
                onClick={handleGenerateVideo}
                disabled={!selectedFile || isPlanning || isGenerating || !transcriptText.trim()}
                className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#FF5722] via-[#FF7043] to-[#FFA000] hover:brightness-110 p-4 text-xs sm:text-sm font-bold text-white shadow-xl shadow-orange-500/25 transition active:scale-98 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
              >
                {isGenerating ? (
                  <>
                    <RefreshCw size={15} className="animate-spin" />
                    <span>Rendering Video on Cloud...</span>
                  </>
                ) : isPlanning ? (
                  <>
                    <RefreshCw size={15} className="animate-spin" />
                    <span>Transcribing Speech...</span>
                  </>
                ) : !selectedFile ? (
                  <span>Upload Audio to Begin</span>
                ) : !transcriptText.trim() ? (
                  <span>Add Script Text to Generate</span>
                ) : (
                  <>
                    <Sparkles size={16} />
                    <span>Generate Video</span>
                  </>
                )}
              </button>

              <p className="text-[11px] text-center text-zinc-500 mt-2.5">
                Zero credits deducted for interrupted or failed render attempts.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FacelessVideoStudio;
