"use client";

import React, { useState, useRef, useEffect, useMemo } from "react";
import {
  Sparkles,
  Upload,
  UploadCloud,
  Volume2,
  VolumeX,
  Check,
  CheckCircle2,
  Trash2,
  Play,
  Pause,
  AlertCircle,
  RefreshCw,
  Tv,
  FileText,
  RotateCcw,
  Music,
  Sliders,
  Film,
  Eye,
  Video,
  CheckCheck,
  Edit3,
  Save,
  ChevronLeft,
  ChevronRight,
  Type,
  ArrowRight,
  Search,
  ShieldCheck,
  Zap,
} from "lucide-react";
import { WatermarkRemoverToggle } from "@/components/dashboard/WatermarkRemoverToggle";
import { StudioStepperRow } from "@/components/dashboard/shared/StudioStepper";
import {
  AWS_BGM_TRACKS,
  getBgmTrackAudioUrl,
  THIRTY_TWO_CAPTION_STYLES,
  renderPreviewCaptionWords,
  type LibraryBgmTrack,
} from "@/components/dashboard/ImageToVideoStudio";

export const YOUTUBE_SUBTITLES_STEPS = [
  { step: 1, title: "Upload", desc: "16:9 Video or Audio" },
  { step: 2, title: "Style", desc: "Subtitles & Safe-Zone" },
] as const;

// 32 Sound Wave visualizer bars
const WAVE_BARS = [
  25, 45, 65, 30, 85, 95, 40, 70, 55, 80, 100, 60, 45, 90, 75, 35,
  60, 85, 50, 95, 70, 40, 65, 80, 55, 90, 45, 70, 85, 35, 60, 40
];

export interface CloudinarySampleVideo {
  id: string;
  name: string;
  category: string;
  videoUrl: string;
  posterUrl: string;
  durationSeconds: number;
  sampleTranscript: string;
  sampleCaptions: Array<{ start: number; end: number; text: string }>;
}

export const CLOUDINARY_SAMPLE_VIDEOS: CloudinarySampleVideo[] = [
  {
    id: "podcast-interview",
    name: "Tech & Podcast Interview",
    category: "Podcast",
    videoUrl:
      "https://res.cloudinary.com/dhouh9idx/video/upload/v1790440433/itnavideo-assets/youtube-subtitles/youtube_subtitle_preview.mp4",
    posterUrl:
      "https://res.cloudinary.com/dhouh9idx/video/upload/v1790440433/itnavideo-assets/youtube-subtitles/youtube_subtitle_preview.jpg",
    durationSeconds: 18,
    sampleTranscript:
      "The mystery behind quantum computing is that particles can exist in multiple states simultaneously.",
    sampleCaptions: [
      { start: 0, end: 4.5, text: "The mystery behind quantum computing..." },
      { start: 4.5, end: 9.8, text: "particles can exist in multiple states simultaneously" },
      { start: 9.8, end: 14.5, text: "which completely revolutionizes computational power" },
      { start: 14.5, end: 18.0, text: "and unlocks answers to previously unsolvable problems." },
    ],
  },
  {
    id: "cinematic-documentary",
    name: "Cinematic Parallax Story",
    category: "Cinematic",
    videoUrl:
      "https://res.cloudinary.com/dhouh9idx/video/upload/v1791489914/InShot_20261009_011644112_vtrkhq.mp4",
    posterUrl:
      "https://res.cloudinary.com/dhouh9idx/video/upload/so_3/v1791489914/InShot_20261009_011644112_vtrkhq.jpg",
    durationSeconds: 22,
    sampleTranscript:
      "In the heart of the ancient ruins, archaeologists uncovered a secret that rewritten history.",
    sampleCaptions: [
      { start: 0, end: 5.0, text: "In the heart of the ancient ruins..." },
      { start: 5.0, end: 11.0, text: "archaeologists uncovered a secret that rewritten history" },
      { start: 11.0, end: 16.5, text: "a lost civilization powered by mysterious energy" },
      { start: 16.5, end: 22.0, text: "buried deep beneath the golden sands." },
    ],
  },
  {
    id: "creator-explainer",
    name: "Creator Studio Explainer",
    category: "Explainer",
    videoUrl:
      "https://res.cloudinary.com/dhouh9idx/video/upload/v1791489914/InShot_20261009_011245820_oqja39.mp4",
    posterUrl:
      "https://res.cloudinary.com/dhouh9idx/video/upload/so_3/v1791489914/InShot_20261009_011245820_oqja39.jpg",
    durationSeconds: 20,
    sampleTranscript:
      "Every top YouTube creator knows that retaining viewers requires high-contrast motion subtitles.",
    sampleCaptions: [
      { start: 0, end: 4.8, text: "Every top YouTube creator knows the secret..." },
      { start: 4.8, end: 10.2, text: "retaining viewers requires high-contrast motion subtitles" },
      { start: 10.2, end: 15.0, text: "keeping audience engagement above 70 percent" },
      { start: 15.0, end: 20.0, text: "throughout the entire 10-minute broadcast." },
    ],
  },
];

export interface YoutubeSubtitlesStudioProps {
  selectedFile: File | null;
  onSelectFile: (file: File | null) => void;

  topicTitle?: string;
  onTopicTitleChange?: (val: string) => void;

  captionStyle?: string;
  onCaptionStyleChange?: (style: string) => void;

  captionPosition?: "top" | "center" | "bottom";
  onCaptionPositionChange?: (pos: "top" | "center" | "bottom") => void;

  captionFontSize?: "small" | "medium" | "large" | "xlarge";
  onCaptionFontSizeChange?: (size: "small" | "medium" | "large" | "xlarge") => void;

  youtubeSubtitleSafeZone?: "standard" | "scrubber" | "high";
  onYoutubeSubtitleSafeZoneChange?: (zone: "standard" | "scrubber" | "high") => void;

  youtubeSubtitleCase?: "natural" | "uppercase";
  onYoutubeSubtitleCaseChange?: (casing: "natural" | "uppercase") => void;

  selectedBgmTrackId?: string;
  onBgmTrackSelect?: (trackId: string, trackUrl: string) => void;

  bgmVolume?: number;
  onBgmVolumeChange?: (val: number) => void;

  onGenerate: (payload?: any) => void;
  isGenerating?: boolean;

  removeAiWatermark?: boolean;
  onRemoveAiWatermarkChange?: (enabled: boolean) => void;

  editedTranscript?: string;
  onEditedTranscriptChange?: (text: string) => void;

  previewCaptions?: Array<{ start: number; end: number; text: string }> | null;
  isTranscribing?: boolean;
}

export const YoutubeSubtitlesStudio: React.FC<YoutubeSubtitlesStudioProps> = ({
  selectedFile,
  onSelectFile,
  topicTitle = "",
  onTopicTitleChange,
  captionStyle = "glow-viral",
  onCaptionStyleChange,
  captionPosition = "bottom",
  onCaptionPositionChange,
  captionFontSize = "large",
  onCaptionFontSizeChange,
  youtubeSubtitleSafeZone = "scrubber",
  onYoutubeSubtitleSafeZoneChange,
  youtubeSubtitleCase = "natural",
  onYoutubeSubtitleCaseChange,
  selectedBgmTrackId = "none",
  onBgmTrackSelect,
  bgmVolume = 0,
  onBgmVolumeChange,
  onGenerate,
  isGenerating = false,
  removeAiWatermark = true,
  onRemoveAiWatermarkChange,
  editedTranscript = "",
  onEditedTranscriptChange,
  previewCaptions = null,
  isTranscribing = false,
}) => {
  // ── Flexible Step State (supports any number of steps) ──
  const [currentStep, setCurrentStep] = useState<number>(1);

  // Active Sample Video
  const [activeSampleId, setActiveSampleId] = useState<string>("podcast-interview");

  // Local Transcript Editor State
  const [localTranscript, setLocalTranscript] = useState(editedTranscript);
  const [isEditingTranscript, setIsEditingTranscript] = useState(false);
  const [transcriptSavedFeedback, setTranscriptSavedFeedback] = useState(false);

  // BGM & Soundtrack
  const [activeBgmVolume, setActiveBgmVolume] = useState<number>(Math.round((bgmVolume || 0) * 100));
  const [selectedBgmTrack, setSelectedBgmTrack] = useState<string>(selectedBgmTrackId || "none");
  const [playingBgmPreview, setPlayingBgmPreview] = useState<string | null>(null);

  // Caption Filter & Search
  const [captionFilter, setCaptionFilter] = useState("all");
  const [captionSearchQuery, setCaptionSearchQuery] = useState("");

  // Video / Audio Player for Preview
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [playbackTime, setPlaybackTime] = useState(0);
  const [videoDuration, setVideoDuration] = useState(18);

  const videoElementRef = useRef<HTMLVideoElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const bgmPreviewAudioRef = useRef<HTMLAudioElement | null>(null);

  // Active Sample Video Object
  const activeSampleVideo = useMemo(() => {
    return (
      CLOUDINARY_SAMPLE_VIDEOS.find((s) => s.id === activeSampleId) ||
      CLOUDINARY_SAMPLE_VIDEOS[0]
    );
  }, [activeSampleId]);

  // Uploaded Video Object URL
  const uploadedVideoUrl = useMemo(
    () => (selectedFile ? URL.createObjectURL(selectedFile) : null),
    [selectedFile]
  );

  useEffect(() => {
    return () => {
      if (uploadedVideoUrl) URL.revokeObjectURL(uploadedVideoUrl);
    };
  }, [uploadedVideoUrl]);

  // Active preview video source
  const activeVideoSrc = uploadedVideoUrl || activeSampleVideo.videoUrl;

  // Sync editedTranscript prop to local state
  useEffect(() => {
    if (editedTranscript) {
      setLocalTranscript(editedTranscript);
    }
  }, [editedTranscript]);

  // Load sample demo
  const handleSelectSample = (sample: CloudinarySampleVideo) => {
    setActiveSampleId(sample.id);
    onSelectFile(null);
    onTopicTitleChange?.(sample.name);
    setLocalTranscript(sample.sampleTranscript);
    onEditedTranscriptChange?.(sample.sampleTranscript);
    setVideoDuration(sample.durationSeconds);
  };

  // Handle file select
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    onSelectFile(file);
    if (!topicTitle) {
      onTopicTitleChange?.(file.name.replace(/\.[^/.]+$/, ""));
    }

    const type = file.type || "";
    const isVideo = type.startsWith("video/") || /\.(mp4|mov|webm)$/i.test(file.name);
    const isAudio = type.startsWith("audio/") || /\.(mp3|wav|m4a|aac)$/i.test(file.name);

    if (isVideo || isAudio) {
      const url = URL.createObjectURL(file);
      const el = document.createElement(isAudio ? "audio" : "video");
      el.src = url;
      el.preload = "metadata";
      el.onloadedmetadata = () => {
        const dur = Math.min(300, Math.round(el.duration || 60));
        setVideoDuration(dur);
        URL.revokeObjectURL(url);
      };
    }

    if (e.target) e.target.value = "";
  };

  // Play / Pause video
  const togglePlay = () => {
    const v = videoElementRef.current;
    if (!v) return;
    if (v.paused) {
      v.play()
        .then(() => setIsPlaying(true))
        .catch(() => {});
    } else {
      v.pause();
      setIsPlaying(false);
    }
  };

  const toggleMute = () => {
    const v = videoElementRef.current;
    if (!v) return;
    v.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  // Sync playback time loop
  useEffect(() => {
    let animId: number;
    const loop = () => {
      const v = videoElementRef.current;
      if (v && !v.paused) {
        setPlaybackTime(v.currentTime);
      }
      animId = requestAnimationFrame(loop);
    };
    if (isPlaying) {
      animId = requestAnimationFrame(loop);
    }
    return () => cancelAnimationFrame(animId);
  }, [isPlaying]);

  // Find active caption text at playbackTime
  const activeCaptionText = useMemo(() => {
    const caps = previewCaptions || activeSampleVideo.sampleCaptions;
    const match = caps.find((c) => playbackTime >= c.start && playbackTime <= c.end);
    if (match) {
      return youtubeSubtitleCase === "uppercase" ? match.text.toUpperCase() : match.text;
    }
    return "";
  }, [previewCaptions, activeSampleVideo, playbackTime, youtubeSubtitleCase]);

  // Preview music track
  const togglePlayBgmTrack = (track: LibraryBgmTrack) => {
    if (track.id === "none") {
      if (bgmPreviewAudioRef.current) bgmPreviewAudioRef.current.pause();
      setPlayingBgmPreview(null);
      return;
    }
    const audioUrl = getBgmTrackAudioUrl(track);
    if (playingBgmPreview === track.id) {
      if (bgmPreviewAudioRef.current) bgmPreviewAudioRef.current.pause();
      setPlayingBgmPreview(null);
    } else {
      if (bgmPreviewAudioRef.current) {
        bgmPreviewAudioRef.current.pause();
        bgmPreviewAudioRef.current.src = audioUrl;
        bgmPreviewAudioRef.current.volume = Math.max(0.05, activeBgmVolume / 100);
        bgmPreviewAudioRef.current
          .play()
          .then(() => {
            setPlayingBgmPreview(track.id);
          })
          .catch(() => setPlayingBgmPreview(null));
      }
    }
  };

  // Filter 32 caption styles
  const filteredCaptionStyles = THIRTY_TWO_CAPTION_STYLES.filter((s) => {
    const matchesCategory = captionFilter === "all" || s.category.toLowerCase() === captionFilter.toLowerCase();
    const matchesSearch =
      !captionSearchQuery.trim() ||
      s.name.toLowerCase().includes(captionSearchQuery.toLowerCase()) ||
      s.desc.toLowerCase().includes(captionSearchQuery.toLowerCase()) ||
      s.badge.toLowerCase().includes(captionSearchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const formatSec = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  return (
    <div className="flex-1 w-full flex flex-col overflow-hidden bg-white">
      {/* Hidden BGM Audio for Auditioning */}
      <audio
        ref={bgmPreviewAudioRef}
        preload="auto"
        onEnded={() => setPlayingBgmPreview(null)}
      />

      {/* ── ROW 1: Flexible Studio Stepper ── */}
      <StudioStepperRow
        steps={YOUTUBE_SUBTITLES_STEPS}
        currentStep={currentStep}
        onStepClick={(step) => setCurrentStep(step)}
      />

      {/* ── ROW 2: Scrollable Studio Workspace ── */}
      <div className="flex-1 overflow-y-auto px-4 sm:px-8 lg:px-12 py-6">
        <div className="max-w-6xl mx-auto space-y-6">

          {/* ══════════════════════════════════════════════════════════════
              STEP 1: UPLOAD (16:9 Video & Audio, Samples & Transcript)
              ══════════════════════════════════════════════════════════════ */}
          {currentStep === 1 && (
            <div className="space-y-6 animate-in fade-in duration-200">
              {/* Media Upload Zone */}
              <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div>
                    <h2 className="text-base sm:text-lg font-black text-slate-900 flex items-center gap-2">
                      <Video size={20} className="text-orange-500" />
                      <span>Upload 16:9 Video or Audio</span>
                      <span className="text-[10px] font-black uppercase tracking-wider bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full border border-emerald-200">
                        0 Credits • Free Daily Allowance
                      </span>
                    </h2>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Upload your 16:9 YouTube video (MP4, MOV, WebM) or audio file. Up to 5 minutes (300s).
                    </p>
                  </div>

                  <span className="text-xs font-bold text-slate-400 font-mono">
                    Max: 05:00 (300s)
                  </span>
                </div>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="video/*,audio/*"
                  onChange={handleFileChange}
                  className="hidden"
                />

                {!selectedFile ? (
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full py-12 border-2 border-dashed border-slate-200 hover:border-orange-500 rounded-3xl bg-slate-50/60 hover:bg-orange-50/20 transition-all flex flex-col items-center justify-center gap-3 cursor-pointer group"
                  >
                    <div className="h-14 w-14 rounded-2xl bg-white border border-slate-200 flex items-center justify-center text-orange-500 group-hover:scale-105 transition-transform shadow-xs">
                      <UploadCloud size={28} />
                    </div>
                    <div className="text-center px-4">
                      <p className="text-sm font-bold text-slate-800">
                        Click to Upload 16:9 Video File
                      </p>
                      <p className="text-xs text-slate-400 mt-1">
                        MP4, MOV, WebM, MP3, WAV • Widescreen Cinema Landscape (1920×1080)
                      </p>
                    </div>
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-[11px] font-black">
                      <CheckCircle2 size={12} />
                      <span>FREE • 5 Daily Videos Allowance</span>
                    </div>
                  </button>
                ) : (
                  <div className="rounded-2xl border border-slate-200 bg-slate-50/80 p-5 space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="h-11 w-11 rounded-xl bg-orange-100 border border-orange-200 flex items-center justify-center text-orange-600 shrink-0">
                          <CheckCircle2 size={20} />
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-black text-slate-900 truncate">
                            {selectedFile.name}
                          </p>
                          <div className="flex items-center gap-2 mt-0.5 text-xs">
                            <span className="font-mono font-bold text-slate-700">
                              {formatSec(videoDuration)} / 05:00 Max
                            </span>
                            <span className="text-slate-300">•</span>
                            <span className="font-bold text-emerald-600">
                              FREE (0 Credits)
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className="px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-100 text-xs font-bold text-slate-700 transition cursor-pointer flex items-center gap-1.5"
                        >
                          <RefreshCw size={12} />
                          <span>Replace</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            onSelectFile(null);
                            setVideoDuration(18);
                          }}
                          className="p-1.5 rounded-xl border border-red-200 bg-red-50 hover:bg-red-100 text-red-600 transition cursor-pointer"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Instant 1-Click Sample Videos */}
                <div className="pt-2">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-bold text-slate-700">
                      Or Try with 1-Click Sample Videos:
                    </span>
                    <span className="text-[11px] text-slate-400">Instant HD preview & subtitles</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {CLOUDINARY_SAMPLE_VIDEOS.map((sample) => {
                      const isSelected = !selectedFile && activeSampleId === sample.id;

                      return (
                        <button
                          key={sample.id}
                          type="button"
                          onClick={() => handleSelectSample(sample)}
                          className={`p-3 rounded-2xl border text-left transition cursor-pointer flex items-center gap-3 ${
                            isSelected
                              ? "border-orange-500 bg-orange-50/60 text-slate-900 shadow-xs ring-1 ring-orange-500"
                              : "border-slate-200 bg-slate-50/60 hover:bg-slate-100 text-slate-700"
                          }`}
                        >
                          <div className="h-10 w-14 rounded-xl bg-slate-200 overflow-hidden relative shrink-0 border border-slate-200">
                            <img src={sample.posterUrl} alt={sample.name} className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                              <Play size={10} className="fill-white text-white ml-0.5" />
                            </div>
                          </div>

                          <div className="min-w-0 flex-1">
                            <p className="text-xs font-black truncate">{sample.name}</p>
                            <span className="text-[10px] text-slate-500">{sample.durationSeconds}s • {sample.category}</span>
                          </div>

                          {isSelected && <CheckCircle2 size={16} className="text-orange-500 shrink-0" />}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Transcription Status Banner */}
              {isTranscribing && (
                <div className="rounded-2xl border border-orange-200 bg-orange-50/70 p-4 flex items-center gap-3 text-sm font-bold text-slate-800 shadow-xs animate-pulse">
                  <Sparkles size={18} className="animate-spin text-orange-500" />
                  <span>Transcribing spoken audio with Groq Whisper & creating word timestamps...</span>
                </div>
              )}

              {/* Editable Subtitle Transcript Area */}
              <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm space-y-4">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center gap-2">
                    <FileText size={18} className="text-orange-500" />
                    <h3 className="text-sm font-black uppercase tracking-wider text-slate-900">
                      Spoken Narration Transcript
                    </h3>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setIsEditingTranscript(!isEditingTranscript)}
                      className="text-xs font-bold text-orange-600 hover:text-orange-700 transition cursor-pointer"
                    >
                      {isEditingTranscript ? "Done Editing" : "Edit Words"}
                    </button>

                    {isEditingTranscript && (
                      <button
                        type="button"
                        onClick={() => {
                          onEditedTranscriptChange?.(localTranscript);
                          setTranscriptSavedFeedback(true);
                          setTimeout(() => setTranscriptSavedFeedback(false), 2000);
                        }}
                        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition cursor-pointer"
                      >
                        {transcriptSavedFeedback ? (
                          <>
                            <CheckCheck size={13} />
                            <span>Saved!</span>
                          </>
                        ) : (
                          <>
                            <Save size={13} />
                            <span>Save Transcript</span>
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </div>

                {isEditingTranscript ? (
                  <textarea
                    value={localTranscript}
                    onChange={(e) => setLocalTranscript(e.target.value)}
                    rows={4}
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 p-4 text-xs font-mono font-medium text-slate-800 focus:bg-white focus:border-orange-500 focus:outline-none transition leading-relaxed"
                  />
                ) : (
                  <div className="rounded-2xl border border-slate-200/80 bg-slate-50/50 p-4 max-h-32 overflow-y-auto">
                    <p className="text-xs text-slate-600 leading-relaxed font-sans">
                      {localTranscript || "Spoken transcript will appear here automatically upon video upload..."}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ══════════════════════════════════════════════════════════════
              STEP 2: MUSIC (Background Soundtrack & Volume Layer)
              ══════════════════════════════════════════════════════════════ */}
          {currentStep === 2 && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div>
                    <h2 className="text-base sm:text-lg font-black text-slate-900 flex items-center gap-2">
                      <Music size={20} className="text-orange-500" />
                      <span>Optional Background Music Layer</span>
                    </h2>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Keep dialogue clean, or add subtle background music from AWS S3 (default is Muted/0%).
                    </p>
                  </div>

                  <div className="flex items-center gap-2 bg-slate-100 border border-slate-200 px-3.5 py-1.5 rounded-full self-start sm:self-auto">
                    <Volume2 size={14} className="text-orange-500" />
                    <span className="text-xs font-black text-slate-800">
                      BGM Volume: {activeBgmVolume}%
                    </span>
                  </div>
                </div>

                {/* Volume Slider with Quick Presets */}
                <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-5 space-y-3">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                    <span className="flex items-center gap-1.5">
                      <Sliders size={14} className="text-orange-500" />
                      <span>Soundtrack Volume (Default: Mute 0% for pure voiceover)</span>
                    </span>
                    <span className="font-mono text-xs font-black text-orange-600 bg-white px-2.5 py-0.5 rounded-lg border border-slate-200">
                      {activeBgmVolume}%
                    </span>
                  </div>

                  <input
                    type="range"
                    min="0"
                    max="100"
                    step="1"
                    value={activeBgmVolume}
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      setActiveBgmVolume(val);
                      onBgmVolumeChange?.(val / 100);
                    }}
                    className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-orange-500"
                  />

                  <div className="flex items-center gap-2 pt-1">
                    {[
                      { label: "Mute (0% - Default)", val: 0 },
                      { label: "Subtle (12%)", val: 12 },
                      { label: "Moderate (20%)", val: 20 },
                    ].map((p) => (
                      <button
                        key={p.val}
                        type="button"
                        onClick={() => {
                          setActiveBgmVolume(p.val);
                          onBgmVolumeChange?.(p.val / 100);
                        }}
                        className={`text-xs font-bold px-3 py-1 rounded-lg border transition cursor-pointer ${
                          activeBgmVolume === p.val
                            ? "bg-orange-500 text-white border-orange-500"
                            : "bg-white border-slate-200 text-slate-600 hover:bg-slate-100"
                        }`}
                      >
                        {p.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Curated AWS S3 Music Tracks */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-700">
                      Select Background Music Track ({AWS_BGM_TRACKS.length})
                    </label>
                    <span className="text-[11px] text-slate-400">All royalty-free for YouTube monetization</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {AWS_BGM_TRACKS.map((track) => {
                      const isSelected = selectedBgmTrack === track.id;
                      const isPlayingThis = playingBgmPreview === track.id;

                      return (
                        <div
                          key={track.id}
                          onClick={() => {
                            setSelectedBgmTrack(track.id);
                            onBgmTrackSelect?.(track.id, getBgmTrackAudioUrl(track));
                          }}
                          className={`p-3.5 rounded-2xl border text-left transition cursor-pointer flex items-center justify-between gap-3 ${
                            isSelected
                              ? "border-orange-500 bg-orange-50/60 text-slate-900 shadow-xs ring-1 ring-orange-500"
                              : "border-slate-200 bg-slate-50/60 hover:bg-slate-100 text-slate-700"
                          }`}
                        >
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-1.5">
                              <span className="text-xs font-black truncate">{track.label}</span>
                              <span className="text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-slate-200 text-slate-700">
                                {track.category}
                              </span>
                            </div>
                            <span className="text-[11px] text-slate-500 truncate block mt-0.5">{track.desc}</span>
                          </div>

                          <div className="flex items-center gap-2 shrink-0">
                            {track.id !== "none" && (
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  togglePlayBgmTrack(track);
                                }}
                                title="Listen to Preview"
                                className="h-8 w-8 rounded-xl bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 transition flex items-center justify-center cursor-pointer shadow-xs"
                              >
                                {isPlayingThis ? (
                                  <Pause size={13} className="text-orange-500" />
                                ) : (
                                  <Play size={13} className="ml-0.5 text-slate-600" />
                                )}
                              </button>
                            )}

                            {isSelected && <CheckCircle2 size={16} className="text-orange-500" />}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* ── Deliverables Clarification Card (Audit PDF 4) ── */}
                <div className="rounded-2xl border border-emerald-200 bg-emerald-50/60 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                      <CheckCircle2 size={16} />
                    </div>
                    <div>
                      <p className="font-black text-slate-900">Dual Export Deliverables Guaranteed</p>
                      <p className="text-slate-600 text-[11px]">
                        Render produces a 1080p MP4 with burned-in subtitles + standalone .SRT and .VTT files for native YouTube caption upload.
                      </p>
                    </div>
                  </div>
                  <span className="font-mono font-bold text-emerald-800 bg-emerald-100 border border-emerald-300 px-2.5 py-1 rounded-lg shrink-0 self-start sm:self-auto">
                    FREE · 5 Videos/Day
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* ══════════════════════════════════════════════════════════════
              STEP 3: STYLE (32 Subtitle Themes, Safe-Zone & Casing)
              ══════════════════════════════════════════════════════════════ */}
          {currentStep === 3 && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <h2 className="text-base sm:text-lg font-black text-slate-900 flex items-center gap-2">
                      <Type size={20} className="text-orange-500" />
                      <span>32 Master Kinetic Caption Themes</span>
                    </h2>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Live animated word-by-word previews for 16:9 YouTube broadcast.
                    </p>
                  </div>

                  {/* Search Bar */}
                  <div className="relative w-full sm:w-64">
                    <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      value={captionSearchQuery}
                      onChange={(e) => setCaptionSearchQuery(e.target.value)}
                      placeholder="Search caption styles..."
                      className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 bg-slate-50 text-xs font-semibold text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-orange-500 focus:outline-none transition"
                    />
                  </div>
                </div>

                {/* Category Filter Pills */}
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                  {["all", "viral", "cinema", "modern", "creative", "minimal"].map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setCaptionFilter(cat)}
                      className={`text-xs font-extrabold uppercase px-3 py-1.5 rounded-xl border transition cursor-pointer shrink-0 ${
                        captionFilter === cat
                          ? "bg-orange-500 text-white border-orange-500 shadow-xs"
                          : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>

                {/* 32 Caption Cards Grid with Live Word Previews */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
                  {filteredCaptionStyles.map((theme) => {
                    const isSelected = captionStyle === theme.id;

                    return (
                      <button
                        key={theme.id}
                        type="button"
                        onClick={() => onCaptionStyleChange?.(theme.id)}
                        className={`p-4 rounded-2xl border text-left transition cursor-pointer flex flex-col justify-between gap-3 ${
                          isSelected
                            ? "border-orange-500 bg-orange-50/50 text-slate-900 shadow-sm ring-2 ring-orange-500/20"
                            : "border-slate-200 bg-slate-50/60 hover:bg-slate-100/80 text-slate-700"
                        }`}
                      >
                        <div className="flex items-center justify-between w-full">
                          <div className="flex items-center gap-2">
                            <div className="w-3.5 h-3.5 rounded-full shadow-xs" style={{ backgroundColor: theme.color }} />
                            <span className="text-xs font-black text-slate-900">{theme.name}</span>
                          </div>
                          <span className="text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-white border border-slate-200 text-slate-700">
                            {theme.badge}
                          </span>
                        </div>

                        {/* Live Kinetic Word Preview Strip */}
                        <div className="bg-slate-900/95 rounded-xl px-3 py-2 flex items-center justify-center min-h-[38px] overflow-hidden">
                          {renderPreviewCaptionWords(theme.id)}
                        </div>

                        <span className="text-[11px] text-slate-500 line-clamp-1">{theme.desc}</span>
                      </button>
                    );
                  })}
                </div>

                {/* YouTube Scrubber-Safe Zone & Formatting Options */}
                <div className="pt-4 border-t border-slate-200 grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {/* YouTube Safe Zone */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-700">
                      YouTube Safe-Zone Position
                    </label>
                    <div className="space-y-1.5">
                      {[
                        { id: "scrubber", label: "YouTube Web Safe (84px)", desc: "Elevated above red scrubber progress bar" },
                        { id: "high", label: "TV / Overscan Safe (120px)", desc: "Guaranteed safe on Smart TV YouTube apps" },
                        { id: "standard", label: "Standard Lower Third (64px)", desc: "Classic documentary subtitle placement" },
                      ].map((zone) => (
                        <button
                          key={zone.id}
                          type="button"
                          onClick={() => onYoutubeSubtitleSafeZoneChange?.(zone.id as any)}
                          className={`w-full p-2.5 rounded-xl border text-left text-xs font-bold transition cursor-pointer ${
                            youtubeSubtitleSafeZone === zone.id
                              ? "border-orange-500 bg-orange-50 text-orange-700 ring-2 ring-orange-500/20"
                              : "border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100"
                          }`}
                        >
                          <div>{zone.label}</div>
                          <div className="text-[10px] text-slate-500 font-normal">{zone.desc}</div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Font Size */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-700">Subtitle Size</label>
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        { id: "small", label: "Small" },
                        { id: "medium", label: "Medium" },
                        { id: "large", label: "Large (Standard)" },
                        { id: "xlarge", label: "X-Large (Pop)" },
                      ].map((size) => (
                        <button
                          key={size.id}
                          type="button"
                          onClick={() => onCaptionFontSizeChange?.(size.id as any)}
                          className={`p-2.5 rounded-xl border text-center text-xs font-bold transition cursor-pointer ${
                            captionFontSize === size.id
                              ? "border-orange-500 bg-orange-50 text-orange-600"
                              : "border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100"
                          }`}
                        >
                          {size.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Word Casing */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-700">Word Casing</label>
                    <div className="space-y-2">
                      {[
                        { id: "natural", label: "Natural Sentence Case", desc: "Original punctuation and capitalization" },
                        { id: "uppercase", label: "ALL CAPS (High Impact)", desc: "Bold punchy all-caps words" },
                      ].map((casing) => (
                        <button
                          key={casing.id}
                          type="button"
                          onClick={() => onYoutubeSubtitleCaseChange?.(casing.id as any)}
                          className={`w-full p-2.5 rounded-xl border text-left text-xs font-bold transition cursor-pointer ${
                            youtubeSubtitleCase === casing.id
                              ? "border-orange-500 bg-orange-50 text-orange-600"
                              : "border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100"
                          }`}
                        >
                          <div>{casing.label}</div>
                          <div className="text-[10px] text-slate-400 font-normal">{casing.desc}</div>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* ── Deliverables Clarification Card (Audit PDF 4) ── */}
                <div className="rounded-2xl border border-emerald-200 bg-emerald-50/60 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                      <CheckCircle2 size={16} />
                    </div>
                    <div>
                      <p className="font-black text-slate-900">Dual Export Deliverables Guaranteed</p>
                      <p className="text-slate-600 text-[11px]">
                        Render produces a 1080p MP4 with burned-in subtitles + standalone .SRT and .VTT files for native YouTube caption upload.
                      </p>
                    </div>
                  </div>
                  <span className="font-mono font-bold text-emerald-800 bg-emerald-100 border border-emerald-300 px-2.5 py-1 rounded-lg shrink-0 self-start sm:self-auto">
                    FREE · 5 Videos/Day
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* ══════════════════════════════════════════════════════════════
              STEP 4: PREVIEW (16:9 Video Monitor & Subtitle Review)
              ══════════════════════════════════════════════════════════════ */}
          {currentStep === YOUTUBE_SUBTITLES_STEPS.length && (
            <div className="space-y-6 animate-in fade-in duration-200">
              {/* 16:9 Cinema Widescreen Live Monitor */}
              <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div>
                    <h2 className="text-base sm:text-lg font-black text-slate-900 flex items-center gap-2">
                      <Eye size={20} className="text-orange-500" />
                      <span>16:9 Cinema Live Video Monitor</span>
                      <span className="text-[10px] font-black uppercase tracking-wider bg-orange-50 text-orange-600 px-2 py-0.5 rounded-full border border-orange-200">
                        Live Subtitle Overlay
                      </span>
                    </h2>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Verify subtitle placement, YouTube scrubber safe-zone height, and caption readability.
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={togglePlay}
                      className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-xs font-bold text-slate-800 transition cursor-pointer"
                    >
                      {isPlaying ? <Pause size={13} className="text-orange-500" /> : <Play size={13} className="text-slate-700 ml-0.5" />}
                      <span>{isPlaying ? "Pause Video" : "Play Video"}</span>
                    </button>
                    <button
                      type="button"
                      onClick={toggleMute}
                      className="p-1.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 transition cursor-pointer"
                    >
                      {isMuted ? <VolumeX size={14} /> : <Volume2 size={14} />}
                    </button>
                  </div>
                </div>

                {/* 16:9 Full HD Video Canvas */}
                <div className="relative aspect-video w-full rounded-2xl overflow-hidden border-2 border-slate-300 bg-black shadow-lg select-none group">
                  <video
                    ref={videoElementRef}
                    src={activeVideoSrc}
                    playsInline
                    muted={isMuted}
                    className="w-full h-full object-cover"
                    onEnded={() => setIsPlaying(false)}
                  />

                  {/* Live Burnt-In Subtitle Overlay Placed at YouTube Scrubber Safe-Zone */}
                  <div
                    className={`absolute left-0 right-0 px-6 sm:px-12 flex justify-center pointer-events-none transition-all ${
                      youtubeSubtitleSafeZone === "high"
                        ? "bottom-20 sm:bottom-28"
                        : youtubeSubtitleSafeZone === "scrubber"
                        ? "bottom-12 sm:bottom-16"
                        : "bottom-6 sm:bottom-8"
                    }`}
                  >
                    <div className="bg-black/85 backdrop-blur-md px-5 py-2.5 rounded-2xl text-center max-w-2xl border border-white/10 shadow-2xl">
                      <span className="text-sm sm:text-xl font-black text-white tracking-wide">
                        {activeCaptionText || (youtubeSubtitleCase === "uppercase" ? "SUBTITLES POWERED BY ITNAVIDEO AI" : "Subtitles powered by Itnavideo AI")}
                      </span>
                    </div>
                  </div>

                  {/* Watermark Notice in Canvas Preview */}
                  {!removeAiWatermark && (
                    <div className="absolute bottom-3 right-3 text-[10px] font-bold text-slate-300 bg-black/70 px-2 py-0.5 rounded border border-white/10">
                      Itnavideo AI
                    </div>
                  )}
                </div>

                {/* Progress bar scrubber */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-mono text-slate-500 font-bold">
                    <span>{formatSec(playbackTime)}</span>
                    <span>{formatSec(videoDuration)}</span>
                  </div>
                  <div
                    onClick={(e) => {
                      const rect = e.currentTarget.getBoundingClientRect();
                      const ratio = (e.clientX - rect.left) / rect.width;
                      const target = ratio * videoDuration;
                      if (videoElementRef.current) {
                        videoElementRef.current.currentTime = target;
                        setPlaybackTime(target);
                      }
                    }}
                    className="w-full h-2 bg-slate-200 rounded-full cursor-pointer overflow-hidden"
                  >
                    <div
                      className="h-full bg-orange-500 rounded-full transition-all"
                      style={{ width: `${videoDuration > 0 ? (playbackTime / videoDuration) * 100 : 0}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Watermark Toggle */}
              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
                <WatermarkRemoverToggle
                  checked={removeAiWatermark}
                  onChange={(val) => onRemoveAiWatermarkChange?.(val)}
                  label="Remove AI Watermark"
                  description="Export a completely clean, unbranded 1080p MP4 ready for YouTube monetized publishing."
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── ROW 3: Sticky Bottom Action Bar ── */}
      <div className="shrink-0 border-t border-slate-200/90 bg-white/95 backdrop-blur-xl px-4 sm:px-8 lg:px-12 py-3.5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 shadow-lg">
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2">
            <span className="text-xs font-bold text-slate-500">Video:</span>
            <span className="text-xs font-black text-slate-900 max-w-[200px] truncate">
              {selectedFile?.name || activeSampleVideo.name}
            </span>
          </div>
          <span className="hidden sm:inline text-slate-300">•</span>
          <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
            <CheckCircle2 size={13} className="text-emerald-600" />
            <span>FREE • 5 Daily Videos (0 Credits)</span>
          </div>
        </div>

        <div className="flex items-center gap-2.5 self-end sm:self-auto">
          {currentStep > 1 && (
            <button
              type="button"
              onClick={() => setCurrentStep((currentStep - 1))}
              className="px-4 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-100 text-xs font-bold text-slate-700 transition cursor-pointer"
            >
              Back
            </button>
          )}

          {currentStep < YOUTUBE_SUBTITLES_STEPS.length ? (
            <button
              type="button"
              onClick={() => setCurrentStep((currentStep + 1))}
              className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-xs font-black transition cursor-pointer shadow-sm shadow-orange-500/20 active:scale-95"
            >
              <span>Next: {YOUTUBE_SUBTITLES_STEPS.find(s => s.step === currentStep + 1)?.title ?? "Next"}</span>
              <ArrowRight size={14} />
            </button>
          ) : (
            <button
              type="button"
              onClick={() => onGenerate({
                captionStyle,
                captionPosition,
                captionFontSize,
                youtubeSubtitleSafeZone,
                youtubeSubtitleCase,
                bgmTrackId: selectedBgmTrack,
                bgmVolume: activeBgmVolume / 100,
                durationSeconds: videoDuration,
                removeAiWatermark,
              })}
              disabled={isGenerating || !selectedFile}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white text-xs font-black transition cursor-pointer shadow-md shadow-orange-500/25 active:scale-95 disabled:opacity-50 disabled:pointer-events-none"
            >
              <Sparkles size={14} />
              <span>Generate Subtitled Video</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

