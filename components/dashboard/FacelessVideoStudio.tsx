"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import {
  Sparkles,
  Upload,
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
  RotateCcw,
  BookOpen,
  Tag,
  Music,
  Headphones,
  Sliders,
  ChevronDown,
  ChevronUp,
  Layers,
  Zap,
} from "lucide-react";
import { FacelessStoryboardTimeline } from "@/components/dashboard/FacelessStoryboardTimeline";
import { diffBasedAlignTranscript } from "@/services/ai/transcriptAlignment";
import { YOUTUBE_BGM_TRACKS, type BgmTrack } from "@/lib/music/youtubeBgmCatalog";

export interface FacelessVideoStudioProps {
  selectedFile: File | null;
  onSelectFile: (file: File | null) => void;

  topicTitle?: string;
  onTopicTitleChange?: (val: string) => void;

  subtitleStyle?: string;
  onSubtitleStyleChange?: (style: string) => void;

  captionAnimationStyle?: "mrbeast" | "handwriting" | "bouncy" | "smooth" | "capsule" | "decodingyt";
  onCaptionAnimationStyleChange?: (val: "mrbeast" | "handwriting" | "bouncy" | "smooth" | "capsule" | "decodingyt") => void;

  captionPosition?: "bottom" | "center" | "top";
  onCaptionPositionChange?: (val: "bottom" | "center" | "top") => void;

  facelessBgmMood?: "lofi" | "tech" | "mystery" | "acoustic" | "upbeat" | "dynamic" | "none";
  onBgmMoodChange?: (val: "lofi" | "tech" | "mystery" | "acoustic" | "upbeat" | "dynamic" | "none") => void;

  selectedBgmTrackId?: string;
  onBgmTrackSelect?: (trackId: string, trackUrl: string) => void;

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

export function FacelessVideoStudio({
  selectedFile,
  onSelectFile,
  topicTitle = "",
  onTopicTitleChange,
  subtitleStyle = "ali-editorial",
  onSubtitleStyleChange,
  captionAnimationStyle = "smooth",
  onCaptionAnimationStyleChange,
  captionPosition = "bottom",
  onCaptionPositionChange,
  facelessBgmMood = "upbeat",
  onBgmMoodChange,
  selectedBgmTrackId,
  onBgmTrackSelect,
  facelessBgmVolume = 0.14,
  onBgmVolumeChange,
  facelessEnableSfx = true,
  onEnableSfxChange,
  facelessPacingStyle = "cinematic",
  onPacingStyleChange,
  visualArtStyle = "realistic",
  onVisualArtStyleChange,
  backgroundTheme = "solid-white",
  onBackgroundThemeChange,
  customBgUrl = "",
  onCustomBgUrlChange,
  onGenerate,
  isGenerating = false,
  uploadedImageFiles = [],
  onTranscribeAndPlan,
  isPlanning = false,
  planningMessage = "",
  planningError = null,
  onClearPlanningError,
}: FacelessVideoStudioProps) {
  // Drag and drop audio state
  const [isDraggingAudio, setIsDraggingAudio] = useState(false);

  // YouTube BGM selection & live preview state
  const [activeBgmTrackId, setActiveBgmTrackId] = useState<string>(
    selectedBgmTrackId || "not-for-nothing-otis-mcdonald"
  );
  const [bgmMoodFilter, setBgmMoodFilter] = useState<string>("all");
  const [playingBgmPreviewId, setPlayingBgmPreviewId] = useState<string | null>(null);
  const bgmPreviewAudioRef = useRef<HTMLAudioElement | null>(null);

  // Expandable dictionary section
  const [showBrandDictionary, setShowBrandDictionary] = useState(false);

  useEffect(() => {
    if (selectedBgmTrackId) {
      setActiveBgmTrackId(selectedBgmTrackId);
    }
  }, [selectedBgmTrackId]);

  // Clean up BGM preview audio on unmount
  useEffect(() => {
    return () => {
      if (bgmPreviewAudioRef.current) {
        bgmPreviewAudioRef.current.pause();
        bgmPreviewAudioRef.current = null;
      }
    };
  }, []);

  const handleTogglePreviewBgm = (e: React.MouseEvent, track: BgmTrack) => {
    e.stopPropagation();
    if (playingBgmPreviewId === track.id) {
      bgmPreviewAudioRef.current?.pause();
      setPlayingBgmPreviewId(null);
    } else {
      if (bgmPreviewAudioRef.current) {
        bgmPreviewAudioRef.current.pause();
      }
      const audio = new Audio(track.s3Url);
      audio.volume = Math.min(1.0, (facelessBgmVolume || 0.14) * 2.5);
      audio.play().then(() => {
        setPlayingBgmPreviewId(track.id);
      }).catch(() => {
        setPlayingBgmPreviewId(null);
      });
      audio.onended = () => setPlayingBgmPreviewId(null);
      bgmPreviewAudioRef.current = audio;
    }
  };

  const handleSelectTrack = (track: BgmTrack) => {
    setActiveBgmTrackId(track.id);
    onBgmMoodChange?.(track.mood as any);
    onBgmTrackSelect?.(track.id, track.s3Url);
  };

  // Audio preview player state
  const audioPlayerRef = useRef<HTMLAudioElement | null>(null);
  const [audioObjectUrl, setAudioObjectUrl] = useState<string>("");
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [audioCurrentTime, setAudioCurrentTime] = useState(0);
  const [audioDurationSec, setAudioDurationSec] = useState(0);

  // Transcript state
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
  const transcribingTargetFileRef = useRef<File | null>(null);

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
      transcribingTargetFileRef.current = null;
    }
  }, [selectedFile]);

  const handleAudioLoadedMetadata = () => {
    if (audioPlayerRef.current) {
      const dur = audioPlayerRef.current.duration;
      if (Number.isFinite(dur) && dur > 0) {
        setAudioDurationSec(dur);
      }
    }
  };

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

  const handleDeleteAudio = () => {
    if (audioPlayerRef.current) {
      audioPlayerRef.current.pause();
    }
    setIsPlayingAudio(false);
    onClearPlanningError?.();
    transcribingTargetFileRef.current = null;
    setTranscriptText("");
    setOriginalTranscriptText("");
    setTranscriptSegments([]);
    setSceneBlueprint([]);
    setBrollUrls({});
    setShowReviewPopup(false);
    onSelectFile(null);
  };

  const triggerTranscription = (file: File, customHint?: string) => {
    if (!onTranscribeAndPlan) return;
    transcribingTargetFileRef.current = file;
    onClearPlanningError?.();

    const hint = customHint !== undefined ? customHint : brandNamesHint;

    onTranscribeAndPlan(file, hint)
      .then((planRes) => {
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

        setShowReviewPopup(true);
        if (popupTimerRef.current) clearTimeout(popupTimerRef.current);
        popupTimerRef.current = setTimeout(() => {
          setShowReviewPopup(false);
        }, 6000);
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

  // Final Generate Video action
  const handleGenerateVideo = () => {
    if (!transcriptText.trim()) return;

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
      facelessPacingStyle,
      assetSourceMode: "library",
      visualArtStyle,
      aspectRatio: "16:9",
      bgmUrl: facelessBgmMood === "none" ? "" : (YOUTUBE_BGM_TRACKS.find((t) => t.id === activeBgmTrackId)?.s3Url || ""),
      bgmTrackId: facelessBgmMood === "none" ? "" : activeBgmTrackId,
    };

    onGenerate(payload);
  };

  const wordCount = transcriptText
    .trim()
    .split(/\s+/)
    .filter(Boolean).length;
  const formattedDuration = audioDurationSec > 0
    ? `${Math.floor(audioDurationSec / 60)}:${Math.floor(audioDurationSec % 60)
        .toString()
        .padStart(2, "0")}`
    : "--:--";

  return (
    <div className="rounded-3xl border border-white/[0.08] bg-[#0E0F13] p-5 sm:p-7 shadow-2xl text-white space-y-7">
      {/* Hidden audio element for preview */}
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

      {/* ── HEADER & META BAR ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-white/[0.07]">
        <div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-white/[0.08] bg-[#16171D] px-3 py-1 text-xs font-semibold text-zinc-300">
              <Tv size={13} className="text-orange-400" />
              <span>16:9 Widescreen • Up to 5 Min • 1080p Full HD</span>
            </span>
            <span className="rounded-full bg-white/[0.05] border border-white/[0.08] px-2.5 py-0.5 text-xs font-medium text-zinc-400">
              1 Min = 1 Credit
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white mt-2">
            Faceless Video Workspace
          </h2>
          <p className="text-xs sm:text-sm text-zinc-400 mt-0.5">
            Convert voiceover narration into high-definition YouTube widescreen explainers with synchronized diagrams, scene beats, and background music.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/dashboard/widescreen-preview"
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] border border-white/[0.08] text-zinc-300 hover:text-white text-xs font-semibold transition"
          >
            <Tv size={14} className="text-orange-400" />
            <span>16:9 Canvas Preview</span>
          </Link>
        </div>
      </div>

      {/* ── FLOATING NOTIFICATION / TOAST (Fixed position prevents layout jumps) ── */}
      {showReviewPopup && (
        <div className="fixed bottom-20 sm:bottom-6 right-4 sm:right-6 z-50 max-w-sm rounded-2xl border border-emerald-500/40 bg-[#0E1526]/95 backdrop-blur-xl p-4 flex items-start justify-between gap-3 text-emerald-200 text-xs shadow-2xl animate-in fade-in slide-in-from-bottom-3 duration-300">
          <div className="flex items-start gap-3">
            <CheckCircle2 size={18} className="text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <p className="text-xs sm:text-sm font-bold text-emerald-300">
                Transcription ready!
              </p>
              <p className="text-xs text-emerald-100/90 mt-0.5 leading-relaxed">
                Review your script and adjust any text if needed. Audio timestamps stay locked.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setShowReviewPopup(false)}
            className="text-emerald-400/80 hover:text-white p-1 transition cursor-pointer"
          >
            <X size={15} />
          </button>
        </div>
      )}

      {planningError && !isPlanning && (
        <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-xs text-red-300 flex items-start justify-between gap-3">
          <div className="flex items-start gap-2.5">
            <AlertCircle size={16} className="text-red-400 shrink-0 mt-0.5" />
            <div className="space-y-0.5">
              <p className="font-bold text-red-200">Transcription Alert</p>
              <p className="text-zinc-300 leading-relaxed">{planningError}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => selectedFile && triggerTranscription(selectedFile)}
            className="rounded-lg border border-red-500/40 bg-red-500/20 px-3 py-1.5 text-xs font-semibold text-white hover:bg-red-500/30 transition cursor-pointer shrink-0"
          >
            Retry Transcription
          </button>
        </div>
      )}

      {/* ── STAGE 1: BALANCED 2-COLUMN AUDIO & SCRIPT STUDIO ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Left Column (5 cols): Audio Ingest & Playback */}
        <div className="lg:col-span-5 flex flex-col justify-between space-y-4">
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
              className={`h-full min-h-[220px] rounded-2xl border-2 border-dashed p-7 text-center transition cursor-pointer flex flex-col items-center justify-center gap-3 ${
                isDraggingAudio
                  ? "border-orange-500 bg-orange-500/10"
                  : "border-white/[0.12] bg-[#141519] hover:border-orange-500/40 hover:bg-[#181A20]"
              }`}
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/[0.05] border border-white/[0.08] text-orange-400 shadow-sm">
                <Upload size={22} />
              </div>
              <div>
                <p className="text-sm sm:text-base font-semibold text-white">
                  Upload Voiceover Audio
                </p>
                <p className="text-xs text-zinc-400 mt-1">
                  MP3, WAV, M4A • Up to 5 minutes (300s)
                </p>
              </div>
              <span className="rounded-xl bg-orange-500 hover:bg-orange-600 px-4 py-2 text-xs font-bold text-white shadow-md shadow-orange-500/20 transition">
                Select Audio File
              </span>
            </label>
          ) : (
            <div className="rounded-2xl border border-white/[0.08] bg-[#141519] p-5 space-y-4 flex-1 flex flex-col justify-between min-h-[220px]">
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-white/[0.06]">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">
                    Narration Track
                  </span>
                  <span className="rounded-full bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 text-[10px] font-semibold text-emerald-400">
                    Confirmed
                  </span>
                </div>

                <div className="flex items-center gap-3.5 mt-3 min-w-0">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-orange-500/10 border border-orange-500/25 text-orange-400 font-bold">
                    <Headphones size={20} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-bold text-white truncate">
                      {selectedFile.name}
                    </p>
                    <p className="text-xs text-zinc-400 mt-0.5">
                      {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
                      {audioDurationSec > 0 && ` • ${formattedDuration} duration`}
                    </p>
                  </div>
                </div>
              </div>

              {/* Audio progress & playback controls */}
              <div className="space-y-3 pt-2 min-h-[72px]">
                {audioDurationSec > 0 && (
                  <div className="space-y-1.5">
                    <div className="h-1.5 rounded-full bg-white/[0.08] overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-orange-500 to-amber-400 rounded-full transition-all duration-100"
                        style={{
                          width: `${Math.min(
                            100,
                            (audioCurrentTime / audioDurationSec) * 100
                          )}%`,
                        }}
                      />
                    </div>
                    <div className="flex items-center justify-between text-[11px] font-mono text-zinc-400 px-0.5">
                      <span>
                        {Math.floor(audioCurrentTime / 60)}:
                        {Math.floor(audioCurrentTime % 60)
                          .toString()
                          .padStart(2, "0")}
                      </span>
                      <span>{formattedDuration}</span>
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between gap-2 pt-1 border-t border-white/[0.06]">
                  <button
                    type="button"
                    onClick={togglePlayAudio}
                    className="inline-flex items-center gap-1.5 rounded-xl border border-white/[0.08] bg-[#1A1C24] px-3.5 py-2 text-xs font-semibold text-zinc-200 hover:text-white hover:border-white/20 transition cursor-pointer"
                  >
                    {isPlayingAudio ? (
                      <>
                        <Pause size={14} className="text-orange-400" />
                        <span>Pause Preview</span>
                      </>
                    ) : (
                      <>
                        <Play size={14} className="text-orange-400 ml-0.5" />
                        <span>Play Audio</span>
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={handleDeleteAudio}
                    className="inline-flex items-center gap-1.5 rounded-xl border border-red-500/25 bg-red-500/10 px-3 py-2 text-xs font-semibold text-red-300 hover:bg-red-500/20 transition cursor-pointer"
                    title="Remove audio and choose another file"
                  >
                    <Trash2 size={13} />
                    <span>Replace Audio</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Collapsible Proper Names / Whisper Vocabulary Drawer */}
          <div className="rounded-2xl border border-white/[0.07] bg-[#141519] p-4 space-y-2.5">
            <button
              type="button"
              onClick={() => setShowBrandDictionary(!showBrandDictionary)}
              className="w-full flex items-center justify-between text-left text-xs font-semibold text-zinc-300 hover:text-white transition cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <Tag size={13} className="text-orange-400" />
                <span>Vocabulary &amp; Proper Names Hint</span>
                {brandNamesHint && (
                  <span className="text-[10px] text-emerald-400 font-mono bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">
                    Active
                  </span>
                )}
              </div>
              {showBrandDictionary ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            </button>

            {showBrandDictionary && (
              <div className="space-y-2 pt-1 animate-in fade-in duration-200">
                <input
                  type="text"
                  value={brandNamesHint}
                  onChange={(e) => handleBrandNamesChange(e.target.value)}
                  placeholder="e.g. NVIDIA, OpenAI, Jensen Huang, Remotion, ItnaVideo"
                  className="w-full rounded-xl border border-white/[0.08] bg-[#0E0F13] px-3.5 py-2 text-xs text-white placeholder-zinc-500 focus:border-orange-500 focus:outline-none transition font-mono"
                />
                <p className="text-[11px] text-zinc-400 leading-relaxed">
                  Provide custom spelling hints so Whisper captures technical terms, company names, and people accurately.
                </p>
                {selectedFile && !isPlanning && (
                  <button
                    type="button"
                    onClick={() => triggerTranscription(selectedFile, brandNamesHint)}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-orange-500/15 hover:bg-orange-500/25 border border-orange-500/30 text-[11px] font-bold text-orange-300 transition cursor-pointer"
                  >
                    <RotateCcw size={12} />
                    <span>Re-Transcribe with Vocabulary</span>
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Right Column (7 cols): Script Editor & Diff Alignment */}
        <div className="lg:col-span-7 rounded-2xl border border-white/[0.08] bg-[#141519] p-5 sm:p-6 space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/[0.06] pb-3">
              <div className="flex items-center gap-2">
                <FileText size={15} className="text-orange-400" />
                <h3 className="text-sm sm:text-base font-bold text-white">
                  Voiceover Script &amp; Review
                </h3>
                {isPlanning && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-orange-500/10 border border-orange-500/30 px-2.5 py-0.5 text-[10px] font-bold text-orange-400 animate-pulse">
                    <RefreshCw size={10} className="animate-spin" />
                    <span>Transcribing...</span>
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2 text-xs">
                {transcriptText ? (
                  <>
                    <span className="rounded-full bg-white/[0.05] border border-white/[0.08] px-2.5 py-0.5 font-mono text-[11px] text-zinc-300">
                      {wordCount} words
                    </span>
                    <button
                      type="button"
                      onClick={() => setShowWordReview(!showWordReview)}
                      className="text-[11px] font-semibold text-orange-400 hover:text-orange-300 transition cursor-pointer ml-1"
                    >
                      {showWordReview ? "Hide Highlights" : "Diff Highlights"}
                    </button>
                    {hasEditedTranscript && (
                      <button
                        type="button"
                        onClick={handleResetTranscript}
                        className="inline-flex items-center gap-1 rounded-full border border-amber-500/30 bg-amber-500/10 px-2.5 py-0.5 text-[11px] text-amber-300 hover:text-white transition cursor-pointer"
                        title="Reset to original transcribed text"
                      >
                        <RotateCcw size={11} />
                        <span>Reset</span>
                      </button>
                    )}
                  </>
                ) : selectedFile ? (
                  <button
                    type="button"
                    onClick={() => triggerTranscription(selectedFile)}
                    className="inline-flex items-center gap-1.5 rounded-full border border-orange-500/30 bg-orange-500/10 px-3 py-1 text-xs font-semibold text-orange-300 hover:text-white hover:bg-orange-500/20 transition cursor-pointer"
                  >
                    <RefreshCw size={11} />
                    <span>Transcribe Speech</span>
                  </button>
                ) : (
                  <span className="text-[11px] text-zinc-500">
                    Pending audio upload
                  </span>
                )}
              </div>
            </div>

            {/* Word Review Visual Diff Highlighter */}
            {showWordReview && transcriptText && (
              <div className="rounded-xl border border-amber-500/30 bg-amber-500/5 p-3 text-xs text-slate-200 leading-relaxed font-sans max-h-32 overflow-y-auto mt-3">
                <p className="text-[10px] font-bold uppercase tracking-wider text-amber-400 mb-1.5">
                  Diff Sync • Yellow highlighted words modified locally
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
                            : "bg-amber-400/20 text-amber-300 border border-amber-400/30 font-semibold"
                        }`}
                      >
                        {word}
                      </span>
                    );
                  })}
                </div>
              </div>
            )}

            <div className="mt-3">
              <textarea
                value={transcriptText}
                onChange={(e) => setTranscriptText(e.target.value)}
                rows={7}
                disabled={isPlanning}
                placeholder={
                  isPlanning
                    ? "Transcribing your voiceover speech in the background... Please wait 2-4 seconds."
                    : "Your transcribed script will appear here. Edit any words or typos freely, or type your narration text manually..."
                }
                className="w-full rounded-xl border border-white/[0.08] bg-[#0E0F13] p-4 text-xs sm:text-sm text-slate-100 placeholder-zinc-500 focus:border-orange-500 focus:outline-none transition leading-relaxed resize-y min-h-[170px] font-sans disabled:opacity-60"
              />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between text-[11px] text-zinc-400 gap-1 pt-1 border-t border-white/[0.05]">
            <span>Diff-based synchronization preserves exact Whisper timestamps for unchanged words.</span>
            {hasEditedTranscript ? (
              <span className="text-amber-400 font-semibold">Custom edits applied</span>
            ) : transcriptText ? (
              <span className="text-emerald-400 font-semibold flex items-center gap-1">
                <Check size={12} />
                <span>Audio synced</span>
              </span>
            ) : null}
          </div>
        </div>
      </div>

      {/* ── STAGE 2: VISUAL CANVAS & YOUTUBE AUDIO LIBRARY ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column (5 cols): Canvas & Visual Storytelling Specs */}
        <div className="lg:col-span-5 space-y-4">
          <div className="rounded-2xl border border-white/[0.08] bg-[#141519] p-5 space-y-3.5">
            <div className="flex items-center justify-between border-b border-white/[0.06] pb-2.5">
              <div className="flex items-center gap-2">
                <Layers size={15} className="text-orange-400" />
                <h4 className="text-sm font-bold text-white">Widescreen Visual Direction</h4>
              </div>
              <span className="rounded-full bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 text-[10px] font-bold text-emerald-400">
                #FFFFFF Studio Standard
              </span>
            </div>

            <p className="text-xs text-zinc-300 leading-relaxed">
              Every scene pairs structured visual diagrams, charts, and procedural vector storytelling directly with narrative cues on an editorial canvas.
            </p>

            <div className="space-y-2 pt-1">
              <div className="rounded-xl bg-white/[0.03] border border-white/[0.06] p-3 flex items-start gap-2.5">
                <CheckCircle2 size={15} className="text-orange-400 shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-semibold text-white">Dynamic SVG Diagrams &amp; Comparisons</p>
                  <p className="text-[11px] text-zinc-400 mt-0.5">Step workflows, metric charts, and battle cards reveal in sync with your speech.</p>
                </div>
              </div>

              <div className="rounded-xl bg-white/[0.03] border border-white/[0.06] p-3 flex items-start gap-2.5">
                <CheckCircle2 size={15} className="text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-semibold text-white">Drawing-Based Storytelling</p>
                  <p className="text-[11px] text-zinc-400 mt-0.5">Narrative scenes automatically render hand-drawn vector elements for natural visual flow.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column (7 cols): YouTube Royalty-Free BGM & Mix */}
        <div className="lg:col-span-7 rounded-2xl border border-white/[0.08] bg-[#141519] p-5 sm:p-6 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/[0.06] pb-3">
            <div className="flex items-center gap-2">
              <Music className="w-4 h-4 text-orange-400" />
              <h4 className="text-sm font-bold text-white">Background Music (YouTube Library)</h4>
              <span className="rounded-full bg-orange-500/10 border border-orange-500/30 px-2 py-0.5 text-[10px] font-bold text-orange-400">
                13 S3 Tracks
              </span>
            </div>
            <p className="text-[11px] text-zinc-400">
              Royalty-free tracks hosted on AWS S3 with live preview.
            </p>
          </div>

          {/* Mood category tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            {[
              { id: "all", label: "All Tracks (13)" },
              { id: "upbeat", label: "Upbeat & Creator (3)" },
              { id: "chill", label: "Chill & Lo-Fi (3)" },
              { id: "mystery", label: "Mystery & Tension (2)" },
              { id: "tech", label: "Tech & Energy (2)" },
              { id: "acoustic", label: "Acoustic (2)" },
              { id: "dynamic", label: "Dynamic (1)" },
              { id: "none", label: "No Music" },
            ].map((filter) => {
              const isSelected =
                filter.id === "none"
                  ? facelessBgmMood === "none"
                  : bgmMoodFilter === filter.id && facelessBgmMood !== "none";
              return (
                <button
                  key={filter.id}
                  type="button"
                  onClick={() => {
                    if (filter.id === "none") {
                      onBgmMoodChange?.("none");
                    } else {
                      if (facelessBgmMood === "none") {
                        onBgmMoodChange?.("mystery");
                      }
                      setBgmMoodFilter(filter.id);
                    }
                  }}
                  className={`px-3 py-1 rounded-xl text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
                    isSelected
                      ? "bg-orange-500 text-white font-bold shadow-sm"
                      : "bg-white/[0.04] border border-white/[0.08] text-zinc-400 hover:text-white hover:bg-white/[0.08]"
                  }`}
                >
                  {filter.label}
                </button>
              );
            })}
          </div>

          {/* Track selector grid */}
          {facelessBgmMood !== "none" ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-2.5 max-h-[220px] overflow-y-auto pr-1">
              {YOUTUBE_BGM_TRACKS.filter(
                (t) => bgmMoodFilter === "all" || t.mood === bgmMoodFilter
              ).map((track) => {
                const isSelected = activeBgmTrackId === track.id;
                const isPlayingThis = playingBgmPreviewId === track.id;

                return (
                  <div
                    key={track.id}
                    onClick={() => handleSelectTrack(track)}
                    className={`rounded-xl border p-2.5 flex items-center justify-between gap-2.5 transition cursor-pointer ${
                      isSelected
                        ? "border-orange-500 bg-orange-500/10 ring-1 ring-orange-500/40"
                        : "border-white/[0.07] bg-[#17181E] hover:border-white/20 hover:bg-[#1B1D24]"
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <button
                        type="button"
                        onClick={(e) => handleTogglePreviewBgm(e, track)}
                        className={`w-7 h-7 rounded-lg flex items-center justify-center transition shrink-0 ${
                          isPlayingThis
                            ? "bg-orange-500 text-white animate-pulse"
                            : isSelected
                            ? "bg-orange-500/20 text-orange-400"
                            : "bg-white/[0.06] text-zinc-300 hover:text-white"
                        }`}
                        title={isPlayingThis ? "Pause" : "Play preview"}
                      >
                        {isPlayingThis ? <Pause size={12} /> : <Play size={12} className="ml-0.5" />}
                      </button>

                      <div className="min-w-0">
                        <p className="text-xs font-bold text-white truncate">
                          {track.title}
                        </p>
                        <p className="text-[10px] text-zinc-400 truncate">
                          {track.artist}
                        </p>
                      </div>
                    </div>

                    <div className="shrink-0">
                      {isSelected ? (
                        <div className="w-5 h-5 rounded-full bg-orange-500 text-white flex items-center justify-center">
                          <Check size={12} />
                        </div>
                      ) : (
                        <div className="w-5 h-5 rounded-full border border-white/[0.15]" />
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="p-4 rounded-xl border border-white/[0.08] bg-white/[0.02] text-center text-xs text-zinc-400 italic">
              Background music disabled. Video will render with narration audio and sound effects.
            </div>
          )}

          {/* Sound effects toggle & volume ducking */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3 border-t border-white/[0.06]">
            <div className="flex items-center justify-between rounded-xl border border-white/[0.07] bg-[#16171D] p-3">
              <div>
                <p className="text-xs font-bold text-white flex items-center gap-1.5">
                  <Volume2 size={13} className="text-orange-400" />
                  <span>Beat Sound Effects (SFX)</span>
                </p>
                <p className="text-[10.5px] text-zinc-400">Pops &amp; transition cues</p>
              </div>
              <button
                type="button"
                onClick={() => onEnableSfxChange?.(!facelessEnableSfx)}
                className={`relative inline-flex h-5 w-10 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
                  facelessEnableSfx ? "bg-orange-500" : "bg-white/20"
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
              <div className="rounded-xl border border-white/[0.07] bg-[#16171D] p-3 space-y-1">
                <div className="flex items-center justify-between text-xs font-semibold text-zinc-300">
                  <span>Music Ducking Volume</span>
                  <span className="font-mono text-white">{Math.round((facelessBgmVolume || 0.14) * 100)}%</span>
                </div>
                <input
                  type="range"
                  min="0.05"
                  max="0.30"
                  step="0.01"
                  value={facelessBgmVolume ?? 0.14}
                  onChange={(e) => onBgmVolumeChange?.(parseFloat(e.target.value))}
                  className="w-full accent-orange-500 cursor-pointer"
                />
              </div>
            ) : (
              <div className="rounded-xl border border-white/[0.07] bg-[#16171D] p-3 flex items-center text-xs text-zinc-500 italic">
                Background score muted
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── STAGE 3: FULL-WIDTH SCENE STORYBOARD & TIMELINE ── */}
      {sceneBlueprint && sceneBlueprint.length > 0 && (
        <div className="pt-2">
          <FacelessStoryboardTimeline
            scenes={sceneBlueprint}
            brollUrls={brollUrls}
            onBrollUrlsChange={setBrollUrls}
            uploadedAssets={taggedUploadedAssets}
            uploadedImageFiles={uploadedImageFiles}
            onSeekAudio={(time) => {
              if (audioPlayerRef.current) {
                audioPlayerRef.current.currentTime = time;
                audioPlayerRef.current.play().catch(() => {});
                setIsPlayingAudio(true);
              }
            }}
          />
        </div>
      )}

      {/* ── FINAL GENERATE ACTION BAR (FIXED BOTTOM / DOCKED SUMMARY) ── */}
      <div className="rounded-2xl border border-white/[0.08] bg-[#141519] p-4 sm:p-5 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Specs Overview */}
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-zinc-300">
          <div className="flex items-center gap-1.5">
            <span className="text-zinc-400 font-medium">Output:</span>
            <span className="font-bold text-white">16:9 Widescreen (1080p 30 FPS)</span>
          </div>

          <span className="text-zinc-600 hidden sm:inline">•</span>

          <div className="flex items-center gap-1.5">
            <span className="text-zinc-400 font-medium">Duration:</span>
            <span className="font-semibold text-white">
              {audioDurationSec > 0 ? formattedDuration : "Upload audio"}
            </span>
          </div>

          {sceneBlueprint.length > 0 && (
            <>
              <span className="text-zinc-600 hidden sm:inline">•</span>
              <div className="flex items-center gap-1.5">
                <span className="text-zinc-400 font-medium">Storyboard:</span>
                <span className="font-semibold text-emerald-400">
                  {sceneBlueprint.length} Scenes Ready
                </span>
              </div>
            </>
          )}

          <span className="text-zinc-600 hidden sm:inline">•</span>

          <div className="flex items-center gap-1.5">
            <span className="text-zinc-400 font-medium">Credit Rate:</span>
            <span className="font-semibold text-white">1 Min = 1 Credit</span>
          </div>
        </div>

        {/* Action Button */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={handleGenerateVideo}
            disabled={!selectedFile || isPlanning || isGenerating || !transcriptText.trim()}
            className="w-full md:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-orange-500 hover:bg-orange-600 px-6 py-3.5 text-xs sm:text-sm font-bold text-white shadow-lg shadow-orange-500/25 transition active:scale-98 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
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
              <span>Transcribing Narration...</span>
            ) : (
              <>
                <Sparkles size={16} />
                <span>Generate 1080p Video</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* ── MOBILE-ONLY DOCKED GENERATE ACTION BAR (Fixed Bottom for Instant Access) ── */}
      <div className="fixed bottom-0 left-0 right-0 z-40 sm:hidden p-3 bg-[#0B0F19]/95 backdrop-blur-xl border-t border-white/10 shadow-2xl flex items-center justify-between gap-3">
        <div className="min-w-0 flex-1">
          <p className="text-xs font-bold text-white truncate">
            {selectedFile ? selectedFile.name : "Select Voiceover Audio"}
          </p>
          <p className="text-[10px] text-zinc-400 mt-0.5">
            {audioDurationSec > 0 ? formattedDuration : "Up to 5 min"} • 1 Credit/Min
          </p>
        </div>
        <button
          type="button"
          onClick={handleGenerateVideo}
          disabled={!selectedFile || isPlanning || isGenerating || !transcriptText.trim()}
          className="shrink-0 px-4 py-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-400 text-black font-black text-xs shadow-lg shadow-orange-500/20 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer inline-flex items-center gap-1.5"
        >
          {isGenerating ? (
            <>
              <RefreshCw size={12} className="animate-spin" />
              <span>Rendering...</span>
            </>
          ) : isPlanning ? (
            <>
              <RefreshCw size={12} className="animate-spin" />
              <span>Transcribing...</span>
            </>
          ) : (
            <>
              <Sparkles size={13} />
              <span>Generate 1080p</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}

export default FacelessVideoStudio;
