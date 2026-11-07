"use client";

import React, { useState, useRef, useEffect, useMemo } from "react";
import Image from "next/image";
import {
  Sparkles,
  Columns,
  Upload,
  UploadCloud,
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
  Volume2,
  Sliders,
  Layers,
  Zap,
  Film,
  Eye,
  Video,
  Image as ImageIcon,
  CheckCheck,
  Edit3,
  Lock,
  ChevronLeft,
  ChevronRight,
  Plus,
  Trophy,
  Swords,
  Tag,
  Music,
} from "lucide-react";
import { BorderBeam } from "@/components/magicui/BorderBeam";

// Master AWS S3 Production Music Library (13+ Curated Tracks)
export const AWS_COMPARE_BGM_TRACKS = [
  { id: "parasail", label: "Calm Lofi (Recommended)", category: "Lo-Fi", path: "assets/reusable/music/parasail-silent-partner.mp3", desc: "Warm acoustic lofi guitar" },
  { id: "19th-floor", label: "Deep Focus & Ambient", category: "Piano", path: "assets/reusable/music/19th-floor-bobby-richards.mp3", desc: "Inspiring subtle piano tone" },
  { id: "dutty-vibe", label: "Optimistic Beat", category: "Upbeat", path: "assets/reusable/music/dutty-vibe-tracks.mp3", desc: "Gentle positive acoustic rhythm" },
  { id: "book-rental", label: "Energetic Narrative", category: "Story", path: "assets/reusable/music/book-the-rental-wit-it-rage.mp3", desc: "Dynamic narrative flow" },
  { id: "crimson-fly", label: "Cinematic Drama", category: "Cinematic", path: "assets/reusable/music/crimson-fly-huma-huma.mp3", desc: "Emotional documentary drive" },
  { id: "crock-pot", label: "Funky Chill Groove", category: "Chill", path: "assets/reusable/music/crock-pot-diamond-ortiz.mp3", desc: "Playful lofi pulse" },
  { id: "illusions", label: "Modern Swagger Beat", category: "Beats", path: "assets/reusable/music/illusions-anno-domini-beats.mp3", desc: "Modern high-production beat" },
  { id: "not-for-nothing", label: "Lounge Instrumental", category: "Lounge", path: "assets/reusable/music/not-for-nothing-otis-mcdonald.mp3", desc: "Smooth brass & relaxed tempo" },
  { id: "something-going", label: "Philosophical Mystery", category: "Deep", path: "assets/reusable/music/something-is-going-on-godmode.mp3", desc: "Pensive intrigue & discovery" },
  { id: "bar-scene", label: "Acoustic Folk Narrative", category: "Acoustic", path: "assets/reusable/music/that-one-bar-scene-rkvc.mp3", desc: "Warm acoustic guitar storytelling" },
  { id: "true-messiah", label: "Victorious Inspiration", category: "Epic", path: "assets/reusable/music/true-messiah-dj-freedem.mp3", desc: "Triumphant motivational melody" },
  { id: "vishnu", label: "Zen Reflection", category: "Zen", path: "assets/reusable/music/vishnu-patrick-patrikios.mp3", desc: "Serene ambient meditation" },
  { id: "what-it-is", label: "Smooth Motown", category: "Motown", path: "assets/reusable/music/what-it-is-silent-partner.mp3", desc: "Catchy positive baseline" },
  { id: "none", label: "No Background Music", category: "Mute", path: "none", desc: "Pure spoken voiceover only" },
];

export interface CompareExplainerStudioProps {
  // Dual comparison images
  comparisonFiles: File[];
  onComparisonFilesChange: (files: File[]) => void;

  // Voiceover narration audio/video
  selectedFile: File | null;
  onSelectFile: (file: File | null) => void;

  // Header Titles & Handle
  compareLeftTitle: string;
  onLeftTitleChange: (val: string) => void;
  compareRightTitle: string;
  onRightTitleChange: (val: string) => void;
  topicTitle: string;
  onTopicTitleChange: (val: string) => void;
  compareHandle: string;
  onHandleChange: (val: string) => void;

  // Visual Theme & Tone
  compareTheme: string;
  onThemeChange: (val: string) => void;
  compareTone: string;
  onToneChange: (val: string) => void;
  compareWinner: string;
  onWinnerChange: (val: string) => void;
  stickerStyle: string;
  onStickerStyleChange: (val: string) => void;

  // Audio & BGM
  bgmTrackId: string;
  onBgmTrackIdChange: (trackId: string) => void;
  bgmVolume: number;
  onBgmVolumeChange: (vol: number) => void;
  customBgmFile: File | null;
  onCustomBgmFileSelect: (file: File | null) => void;
  enableSfx: boolean;
  onEnableSfxChange: (val: boolean) => void;

  // Editorial Transcript
  editorialTranscript: string;
  onEditorialTranscriptChange: (text: string) => void;

  // Actions
  onGenerate: () => void;
  isGenerating: boolean;
  renderedVideoUrl?: string;
}

export function CompareExplainerStudio({
  comparisonFiles,
  onComparisonFilesChange,
  selectedFile,
  onSelectFile,
  compareLeftTitle,
  onLeftTitleChange,
  compareRightTitle,
  onRightTitleChange,
  topicTitle,
  onTopicTitleChange,
  compareHandle,
  onHandleChange,
  compareTheme = "white",
  onThemeChange,
  compareTone = "versus",
  onToneChange,
  compareWinner = "none",
  onWinnerChange,
  stickerStyle = "3d-presenter-man",
  onStickerStyleChange,
  bgmTrackId = "parasail",
  onBgmTrackIdChange,
  bgmVolume = 0.12,
  onBgmVolumeChange,
  customBgmFile,
  onCustomBgmFileSelect,
  enableSfx = true,
  onEnableSfxChange,
  editorialTranscript,
  onEditorialTranscriptChange,
  onGenerate,
  isGenerating,
  renderedVideoUrl,
}: CompareExplainerStudioProps) {
  // Navigation Tabs: 'media' | 'topics' | 'audio' | 'preview'
  const [activeTab, setActiveTab] = useState<"media" | "topics" | "audio" | "preview">("media");

  // Audio audition state
  const [playingTrackId, setPlayingTrackId] = useState<string | null>(null);
  const audioAuditionRef = useRef<HTMLAudioElement | null>(null);

  // Compulsory Preview Gate
  const [previewConfirmed, setPreviewConfirmed] = useState<boolean>(false);

  // Interactive Live Player Simulator State
  const [isPlayingPreview, setIsPlayingPreview] = useState<boolean>(false);
  const [previewProgress, setPreviewProgress] = useState<number>(0);
  const [activeSide, setActiveSide] = useState<"left" | "right" | "both">("both");

  // Drag and drop inputs
  const leftImageInputRef = useRef<HTMLInputElement | null>(null);
  const rightImageInputRef = useRef<HTMLInputElement | null>(null);
  const audioInputRef = useRef<HTMLInputElement | null>(null);
  const customBgmInputRef = useRef<HTMLInputElement | null>(null);

  // Preview URLs for images
  const leftImageUrl = useMemo(() => {
    if (comparisonFiles[0]) return URL.createObjectURL(comparisonFiles[0]);
    return null;
  }, [comparisonFiles[0]]);

  const rightImageUrl = useMemo(() => {
    if (comparisonFiles[1]) return URL.createObjectURL(comparisonFiles[1]);
    return null;
  }, [comparisonFiles[1]]);

  // Clean up Object URLs on unmount/change
  useEffect(() => {
    return () => {
      if (leftImageUrl) URL.revokeObjectURL(leftImageUrl);
      if (rightImageUrl) URL.revokeObjectURL(rightImageUrl);
    };
  }, [leftImageUrl, rightImageUrl]);

  // Audio Audition Toggle
  const togglePlayAudio = (trackId: string, trackPath: string) => {
    if (trackPath === "none") {
      if (audioAuditionRef.current) {
        audioAuditionRef.current.pause();
        audioAuditionRef.current = null;
      }
      setPlayingTrackId(null);
      return;
    }

    if (playingTrackId === trackId) {
      if (audioAuditionRef.current) {
        audioAuditionRef.current.pause();
      }
      setPlayingTrackId(null);
      return;
    }

    if (audioAuditionRef.current) {
      audioAuditionRef.current.pause();
    }

    const audioUrl = `https://remotionlambda-useast1-2zq6twaok1.s3.us-east-1.amazonaws.com/${trackPath}`;
    const newAudio = new Audio(audioUrl);
    newAudio.volume = bgmVolume;
    newAudio.play().catch(() => {});
    audioAuditionRef.current = newAudio;
    setPlayingTrackId(trackId);

    newAudio.onended = () => {
      setPlayingTrackId(null);
    };
  };

  useEffect(() => {
    return () => {
      if (audioAuditionRef.current) {
        audioAuditionRef.current.pause();
        audioAuditionRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (audioAuditionRef.current) {
      audioAuditionRef.current.volume = bgmVolume;
    }
  }, [bgmVolume]);

  // Interactive Live Player Simulator Timer
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isPlayingPreview) {
      interval = setInterval(() => {
        setPreviewProgress((prev) => {
          if (prev >= 100) {
            setIsPlayingPreview(false);
            return 0;
          }
          return prev + 1.5;
        });
      }, 100);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPlayingPreview]);

  // Alternate active side in live player
  useEffect(() => {
    if (previewProgress < 30) {
      setActiveSide("both");
    } else if (previewProgress < 65) {
      setActiveSide("left");
    } else {
      setActiveSide("right");
    }
  }, [previewProgress]);

  // Words from editorial transcript for live preview subtitle
  const transcriptWords = useMemo(() => {
    const raw = editorialTranscript.trim();
    if (!raw) {
      return ["Which", "option", "wins?", "Let's", "break", "down", "the", "comparison"];
    }
    return raw.split(/\s+/).slice(0, 16);
  }, [editorialTranscript]);

  const activeCaptionWordIndex = useMemo(() => {
    if (transcriptWords.length === 0) return 0;
    const wordStep = 100 / transcriptWords.length;
    return Math.min(
      transcriptWords.length - 1,
      Math.floor(previewProgress / wordStep)
    );
  }, [previewProgress, transcriptWords.length]);

  const handleSetLeftFile = (file: File | null) => {
    if (!file) {
      onComparisonFilesChange(comparisonFiles[1] ? [comparisonFiles[1]] : []);
      return;
    }
    const right = comparisonFiles[1] || null;
    onComparisonFilesChange(right ? [file, right] : [file]);
  };

  const handleSetRightFile = (file: File | null) => {
    if (!file) {
      onComparisonFilesChange(comparisonFiles[0] ? [comparisonFiles[0]] : []);
      return;
    }
    const left = comparisonFiles[0] || null;
    if (left) {
      onComparisonFilesChange([left, file]);
    } else {
      onComparisonFilesChange([file]);
    }
  };

  const isReadyToRender =
    Boolean(selectedFile) &&
    comparisonFiles.length === 2 &&
    compareLeftTitle.trim().length > 0 &&
    compareRightTitle.trim().length > 0 &&
    previewConfirmed &&
    !isGenerating;

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6">
      {/* Top Banner: Crisp White Aesthetic */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2.5 mb-1.5">
              <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-[#0066FF] border border-blue-200">
                <Swords className="w-3.5 h-3.5" />
                9:16 Vertical • Side-by-Side Versus
              </span>
              <span className="text-xs text-slate-500 font-medium">
                Max 90s • 1 Flat Credit
              </span>
            </div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
              Compare Explainer Studio
            </h1>
            <p className="text-sm text-slate-600 mt-1 max-w-2xl">
              Upload your voiceover narration, 2 versus images, and topic titles. AI animates split-screen focus, animated presenter stickman, and the final winner reveal.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                setActiveTab("preview");
                setIsPlayingPreview(true);
              }}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 text-sm font-medium transition"
            >
              <Eye className="w-4 h-4 text-[#0066FF]" />
              Live Preview
            </button>

            <button
              onClick={onGenerate}
              disabled={!isReadyToRender}
              className={`relative inline-flex items-center gap-2 px-6 py-2.5 rounded-xl font-semibold text-sm transition shadow-sm ${
                isReadyToRender
                  ? "bg-[#0066FF] hover:bg-[#0052CC] text-white cursor-pointer"
                  : "bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed"
              }`}
            >
              {isReadyToRender && (
                <BorderBeam size={80} duration={4} colorFrom="#0066FF" colorTo="#2563EB" />
              )}
              {isGenerating ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-white" />
                  Rendering Cloud Video...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  Render Cloud Video (1 Credit)
                </>
              )}
            </button>
          </div>
        </div>

        {/* Studio Sub-Navigation Tabs */}
        <div className="flex items-center gap-2 mt-6 border-b border-slate-100 pb-2">
          {[
            { id: "media", label: "1. Media & Voiceover", icon: Layers, badge: selectedFile && comparisonFiles.length === 2 ? "Ready" : undefined },
            { id: "topics", label: "2. Titles & Winner", icon: Trophy, badge: compareLeftTitle && compareRightTitle ? "Set" : undefined },
            { id: "audio", label: "3. Audio & SFX (12% BGM)", icon: Music, badge: `${Math.round(bgmVolume * 100)}%` },
            { id: "preview", label: "4. Editorial & Preview", icon: Eye, badge: previewConfirmed ? "Confirmed" : "Compulsory" },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition ${
                  isActive
                    ? "bg-slate-900 text-white shadow-sm"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {tab.label}
                {tab.badge && (
                  <span
                    className={`ml-1 px-1.5 py-0.5 rounded text-[10px] ${
                      isActive
                        ? "bg-slate-800 text-blue-300"
                        : "bg-slate-100 text-slate-500"
                    }`}
                  >
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Studio Work Area */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Interactive Controls */}
        <div className="lg:col-span-7 space-y-6">
          {/* TAB 1: MEDIA & VOICEOVER */}
          {activeTab === "media" && (
            <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm space-y-6">
              {/* Voiceover Upload */}
              <div className="border border-slate-200 rounded-xl p-5 bg-slate-50/50">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-blue-100 flex items-center justify-center text-[#0066FF] font-bold text-xs">
                      <Volume2 className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-slate-900">
                        Speech Voiceover Narration
                      </h3>
                      <p className="text-xs text-slate-500">
                        MP3, WAV, or MP4 speech audio driving split-screen timing
                      </p>
                    </div>
                  </div>
                  {selectedFile && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-600 border border-emerald-200">
                      <Check className="w-3.5 h-3.5" />
                      Loaded
                    </span>
                  )}
                </div>

                <input
                  type="file"
                  ref={audioInputRef}
                  accept="audio/*,video/*"
                  className="hidden"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      onSelectFile(e.target.files[0]);
                    }
                  }}
                />

                {selectedFile ? (
                  <div className="relative flex items-center justify-between p-3.5 bg-white border border-slate-200 rounded-xl">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center text-[#0066FF]">
                        <Volume2 className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-slate-800 line-clamp-1">
                          {selectedFile.name}
                        </p>
                        <p className="text-xs text-slate-500">
                          {(selectedFile.size / (1024 * 1024)).toFixed(1)} MB • Ready for Groq cloud alignment
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => onSelectFile(null)}
                      className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition"
                      title="Remove file"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div
                    onClick={() => audioInputRef.current?.click()}
                    className="border-2 border-dashed border-slate-300 hover:border-orange-400 bg-white rounded-xl p-6 text-center cursor-pointer transition"
                  >
                    <UploadCloud className="w-8 h-8 text-[#0066FF] mx-auto mb-2" />
                    <p className="text-sm font-semibold text-slate-800">
                      Upload Narration Audio or Video
                    </p>
                    <p className="text-xs text-slate-500 mt-1">
                      MP3, WAV, M4A, or MP4 up to 90 seconds. Click to browse.
                    </p>
                  </div>
                )}
              </div>

              {/* Dual Compare Images Upload */}
              <div className="border border-slate-200 rounded-xl p-5 bg-slate-50/50">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-blue-100 flex items-center justify-center text-[#0066FF] font-bold text-xs">
                      <Columns className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-slate-900">
                        Side-by-Side Visuals (Left vs Right)
                      </h3>
                      <p className="text-xs text-slate-500">
                        Upload 2 product screenshots, logos, or portrait photos
                      </p>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-slate-600 px-2.5 py-1 bg-white border border-slate-200 rounded-lg">
                    {comparisonFiles.length}/2 Images
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Left Image Slot */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Left Visual (Option A)
                    </label>
                    <input
                      type="file"
                      ref={leftImageInputRef}
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          handleSetLeftFile(e.target.files[0]);
                        }
                      }}
                    />
                    {leftImageUrl ? (
                      <div className="relative rounded-xl overflow-hidden border border-slate-200 bg-white aspect-[4/3] group">
                        <img
                          src={leftImageUrl}
                          alt="Left Option"
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-between p-3">
                          <span className="text-xs font-bold text-white bg-slate-900/80 px-2 py-0.5 rounded">
                            Left Side
                          </span>
                          <button
                            onClick={() => handleSetLeftFile(null)}
                            className="p-1.5 rounded-lg bg-rose-500 text-white hover:bg-rose-600 transition"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div
                        onClick={() => leftImageInputRef.current?.click()}
                        className="border-2 border-dashed border-slate-300 hover:border-orange-400 bg-white rounded-xl aspect-[4/3] flex flex-col items-center justify-center p-4 text-center cursor-pointer transition"
                      >
                        <Plus className="w-6 h-6 text-[#0066FF] mb-1" />
                        <p className="text-xs font-semibold text-slate-700">Upload Left Image</p>
                        <p className="text-[10px] text-slate-400 mt-0.5">PNG, JPG, WEBP</p>
                      </div>
                    )}
                  </div>

                  {/* Right Image Slot */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Right Visual (Option B)
                    </label>
                    <input
                      type="file"
                      ref={rightImageInputRef}
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          handleSetRightFile(e.target.files[0]);
                        }
                      }}
                    />
                    {rightImageUrl ? (
                      <div className="relative rounded-xl overflow-hidden border border-slate-200 bg-white aspect-[4/3] group">
                        <img
                          src={rightImageUrl}
                          alt="Right Option"
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-between p-3">
                          <span className="text-xs font-bold text-white bg-slate-900/80 px-2 py-0.5 rounded">
                            Right Side
                          </span>
                          <button
                            onClick={() => handleSetRightFile(null)}
                            className="p-1.5 rounded-lg bg-rose-500 text-white hover:bg-rose-600 transition"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div
                        onClick={() => rightImageInputRef.current?.click()}
                        className="border-2 border-dashed border-slate-300 hover:border-orange-400 bg-white rounded-xl aspect-[4/3] flex flex-col items-center justify-center p-4 text-center cursor-pointer transition"
                      >
                        <Plus className="w-6 h-6 text-[#0066FF] mb-1" />
                        <p className="text-xs font-semibold text-slate-700">Upload Right Image</p>
                        <p className="text-[10px] text-slate-400 mt-0.5">PNG, JPG, WEBP</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: TITLES, WINNER & THEME */}
          {activeTab === "topics" && (
            <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm space-y-6">
              {/* Left & Right Titles */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    Left Title / Option A
                  </label>
                  <input
                    type="text"
                    value={compareLeftTitle}
                    onChange={(e) => onLeftTitleChange(e.target.value)}
                    placeholder="e.g. iPhone 16 Pro"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#0066FF]/20 focus:border-[#0066FF] transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    Right Title / Option B
                  </label>
                  <input
                    type="text"
                    value={compareRightTitle}
                    onChange={(e) => onRightTitleChange(e.target.value)}
                    placeholder="e.g. Galaxy S24 Ultra"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#0066FF]/20 focus:border-[#0066FF] transition"
                  />
                </div>
              </div>

              {/* Topic Headline & Handle */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    Topic Headline
                  </label>
                  <input
                    type="text"
                    value={topicTitle}
                    onChange={(e) => onTopicTitleChange(e.target.value)}
                    placeholder="e.g. ULTIMATE FLAGSHIP BATTLE"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#0066FF]/20 focus:border-[#0066FF] transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    Creator Watermark Handle
                  </label>
                  <input
                    type="text"
                    value={compareHandle}
                    onChange={(e) => onHandleChange(e.target.value)}
                    placeholder="e.g. @tech_reviewer"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#0066FF]/20 focus:border-[#0066FF] transition"
                  />
                </div>
              </div>

              {/* Winner Selection & Tone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    Comparison Tone
                  </label>
                  <select
                    value={compareTone}
                    onChange={(e) => onToneChange?.(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#0066FF]/20 focus:border-[#0066FF] transition"
                  >
                    <option value="versus">Standard Versus (Blue vs Purple)</option>
                    <option value="goodBad">Good vs Bad (Green vs Red)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    Winner Reveal Crown
                  </label>
                  <select
                    value={compareWinner}
                    onChange={(e) => onWinnerChange?.(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#0066FF]/20 focus:border-[#0066FF] transition"
                  >
                    <option value="none">No Winner (Neutral Comparison)</option>
                    <option value="left">Left Side Wins (Crown Left)</option>
                    <option value="right">Right Side Wins (Crown Right)</option>
                  </select>
                </div>
              </div>

              {/* Canvas Theme Selection: White Theme Option */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Canvas Background Theme
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { id: "white", name: "Solid Clean White", desc: "Crisp white studio background" },
                    { id: "light", name: "Light Studio Gradient", desc: "Soft subtle blue tint" },
                    { id: "dark", name: "Dark Modern Slate", desc: "Deep cinematic contrast" },
                  ].map((t) => (
                    <div
                      key={t.id}
                      onClick={() => onThemeChange?.(t.id)}
                      className={`p-3 rounded-xl border cursor-pointer transition ${
                        compareTheme === t.id
                          ? "border-[#0066FF] bg-blue-50/40 ring-2 ring-orange-500/20"
                          : "border-slate-200 hover:border-slate-300 bg-white"
                      }`}
                    >
                      <p className="text-xs font-bold text-slate-800">{t.name}</p>
                      <p className="text-[11px] text-slate-500 mt-0.5">{t.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: AUDIO & SFX (12% DEFAULT BGM) */}
          {activeTab === "audio" && (
            <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm space-y-6">
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  Audio & Sound Design
                </h3>
                <p className="text-xs text-slate-500">
                  Studio ducking ensures voiceover speech stays crystal clear above background music
                </p>
              </div>

              {/* Volume Slider: Default 12% */}
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Volume2 className="w-4 h-4 text-[#0066FF]" />
                    <span className="text-xs font-bold text-slate-800">
                      Background Music Volume (Default: 12%)
                    </span>
                  </div>
                  <span className="text-xs font-bold text-[#0066FF] bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                    {Math.round(bgmVolume * 100)}%
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="0.4"
                  step="0.01"
                  value={bgmVolume}
                  onChange={(e) => onBgmVolumeChange(parseFloat(e.target.value))}
                  className="w-full accent-orange-500 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                  <span>Mute (0%)</span>
                  <span className="font-semibold text-slate-600">Standard Voiceover Duck (12%)</span>
                  <span>Loud (40%)</span>
                </div>
              </div>

              {/* SFX Toggle */}
              <div className="flex items-center justify-between p-4 rounded-xl border border-slate-200 bg-slate-50/50">
                <div className="flex items-center gap-2.5">
                  <Zap className="w-4 h-4 text-[#0066FF]" />
                  <div>
                    <p className="text-xs font-bold text-slate-800">
                      Versus Motion Sound Effects (SFX)
                    </p>
                    <p className="text-xs text-slate-500">
                      Punchy whooshes, versus badge slam, and winner victory chime
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => onEnableSfxChange(!enableSfx)}
                  className={`w-11 h-6 flex items-center rounded-full p-1 transition cursor-pointer ${
                    enableSfx ? "bg-[#0066FF] justify-end" : "bg-slate-300 justify-start"
                  }`}
                >
                  <div className="w-4 h-4 rounded-full bg-white shadow-xs" />
                </button>
              </div>

              {/* Custom BGM Upload */}
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50">
                <input
                  type="file"
                  ref={customBgmInputRef}
                  accept="audio/mp3,audio/wav,audio/m4a"
                  className="hidden"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      onCustomBgmFileSelect(e.target.files[0]);
                      onBgmTrackIdChange("custom");
                    }
                  }}
                />
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold text-slate-800">
                      Upload Custom Background Track
                    </p>
                    <p className="text-xs text-slate-500">
                      {customBgmFile
                        ? `Loaded: ${customBgmFile.name}`
                        : "Upload your own MP3/WAV background music"}
                    </p>
                  </div>
                  <button
                    onClick={() => customBgmInputRef.current?.click()}
                    className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 text-xs font-semibold text-slate-700 transition"
                  >
                    {customBgmFile ? "Replace File" : "Upload MP3"}
                  </button>
                </div>
              </div>

              {/* AWS S3 Music Catalog */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  AWS S3 Studio Background Tracks (13+ Curated Tracks)
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-[280px] overflow-y-auto pr-1">
                  {AWS_COMPARE_BGM_TRACKS.map((track) => {
                    const isSelected = bgmTrackId === track.id;
                    const isPlaying = playingTrackId === track.id;
                    return (
                      <div
                        key={track.id}
                        onClick={() => onBgmTrackIdChange(track.id)}
                        className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition ${
                          isSelected
                            ? "border-[#0066FF] bg-blue-50/30 ring-1 ring-orange-500/30"
                            : "border-slate-200 hover:border-slate-300 bg-white"
                        }`}
                      >
                        <div className="min-w-0 pr-2">
                          <p className="text-xs font-bold text-slate-800 truncate">
                            {track.label}
                          </p>
                          <p className="text-[11px] text-slate-500 truncate">
                            {track.desc}
                          </p>
                        </div>
                        {track.path !== "none" && (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              togglePlayAudio(track.id, track.path);
                            }}
                            className={`p-2 rounded-lg transition ${
                              isPlaying
                                ? "bg-[#0066FF] text-white"
                                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                            }`}
                            title={isPlaying ? "Pause audition" : "Play audition"}
                          >
                            {isPlaying ? (
                              <Pause className="w-3.5 h-3.5" />
                            ) : (
                              <Play className="w-3.5 h-3.5" />
                            )}
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: EDITORIAL TRANSCRIPT & COMPULSORY PREVIEW GATE */}
          {activeTab === "preview" && (
            <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm space-y-6">
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  Editorial Spoken Transcript & Typo Fixer
                </h3>
                <p className="text-xs text-slate-500">
                  Edit the transcript to fix any spoken names, brand spellings, or phonetic mistakes before rendering
                </p>
              </div>

              <div className="relative">
                <textarea
                  rows={5}
                  value={editorialTranscript}
                  onChange={(e) => onEditorialTranscriptChange(e.target.value)}
                  placeholder="Paste or edit the spoken voiceover narration here. Captions will follow these exact words..."
                  className="w-full p-4 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#0066FF]/20 focus:border-[#0066FF] font-mono transition"
                />
                <Edit3 className="absolute right-3.5 top-3.5 w-4 h-4 text-slate-400" />
              </div>

              {/* Compulsory Preview Confirmation Box */}
              <div
                onClick={() => setPreviewConfirmed(!previewConfirmed)}
                className={`p-4 rounded-xl border cursor-pointer transition flex items-start gap-3.5 ${
                  previewConfirmed
                    ? "border-emerald-500 bg-emerald-50/30"
                    : "border-amber-300 bg-amber-50/40"
                }`}
              >
                <div
                  className={`w-5 h-5 rounded flex items-center justify-center mt-0.5 transition ${
                    previewConfirmed
                      ? "bg-emerald-500 text-white"
                      : "border border-amber-400 bg-white"
                  }`}
                >
                  {previewConfirmed && <Check className="w-3.5 h-3.5" />}
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-900">
                    Compulsory Review Check: I have reviewed the versus split layout & titles
                  </p>
                  <p className="text-xs text-slate-600 mt-0.5">
                    Ensures both left & right images, versus titles, and subtitle alignment look right before cloud rendering.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: 9:16 Vertical Live Visual Preview */}
        <div className="lg:col-span-5">
          <div className="sticky top-6 bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                <Tv className="w-3.5 h-3.5 text-[#0066FF]" />
                9:16 Live Preview (Versus Canvas)
              </span>
              <button
                onClick={() => setIsPlayingPreview(!isPlayingPreview)}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-xs font-semibold text-slate-700 transition"
              >
                {isPlayingPreview ? (
                  <>
                    <Pause className="w-3.5 h-3.5 text-[#0066FF]" />
                    Pause
                  </>
                ) : (
                  <>
                    <Play className="w-3.5 h-3.5 text-[#0066FF]" />
                    Simulate
                  </>
                )}
              </button>
            </div>

            {/* 9:16 Vertical Canvas Simulator */}
            <div className="relative mx-auto w-full max-w-[280px] aspect-[9/16] rounded-2xl overflow-hidden shadow-md border-4 border-slate-900 bg-[#FAFAFA] flex flex-col justify-between p-3.5">
              {/* TOP HEADER & WATERMARK */}
              <div className="text-center space-y-1 z-10">
                <span className="text-[9px] font-bold tracking-widest text-slate-400 uppercase">
                  {compareHandle.trim() || "@itnavideo"}
                </span>
                <div className="bg-slate-900 text-white text-[10px] font-black px-2.5 py-1 rounded-lg max-w-[90%] mx-auto truncate shadow-xs">
                  {topicTitle.trim() || "VERSUS COMPARISON"}
                </div>
              </div>

              {/* DUAL SIDE-BY-SIDE CARDS */}
              <div className="relative grid grid-cols-2 gap-2 my-auto z-10">
                {/* Left Card */}
                <div
                  className={`rounded-xl border overflow-hidden transition-all duration-300 p-1.5 bg-white shadow-xs ${
                    activeSide === "left" || activeSide === "both"
                      ? "ring-2 ring-blue-500 border-blue-400 scale-102"
                      : "opacity-75 border-slate-200"
                  }`}
                >
                  <div className="aspect-square rounded-lg bg-slate-100 overflow-hidden mb-1.5">
                    {leftImageUrl ? (
                      <img
                        src={leftImageUrl}
                        alt="Left Preview"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-300">
                        <ImageIcon className="w-6 h-6" />
                      </div>
                    )}
                  </div>
                  <p className="text-[10px] font-black text-slate-800 text-center truncate">
                    {compareLeftTitle.trim() || "Option A"}
                  </p>
                </div>

                {/* Right Card */}
                <div
                  className={`rounded-xl border overflow-hidden transition-all duration-300 p-1.5 bg-white shadow-xs ${
                    activeSide === "right" || activeSide === "both"
                      ? "ring-2 ring-purple-500 border-purple-400 scale-102"
                      : "opacity-75 border-slate-200"
                  }`}
                >
                  <div className="aspect-square rounded-lg bg-slate-100 overflow-hidden mb-1.5">
                    {rightImageUrl ? (
                      <img
                        src={rightImageUrl}
                        alt="Right Preview"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-300">
                        <ImageIcon className="w-6 h-6" />
                      </div>
                    )}
                  </div>
                  <p className="text-[10px] font-black text-slate-800 text-center truncate">
                    {compareRightTitle.trim() || "Option B"}
                  </p>
                </div>

                {/* Center VS Badge */}
                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-gradient-to-tr from-[#0066FF] to-amber-400 text-white font-black text-[10px] flex items-center justify-center border-2 border-white shadow-md z-20">
                  VS
                </div>
              </div>

              {/* BOTTOM SUBTITLE STRIP */}
              <div className="z-10 text-center">
                <div className="bg-slate-900/90 backdrop-blur-xs border border-white/10 text-white rounded-xl py-1.5 px-2.5 max-w-[95%] mx-auto shadow-sm">
                  <span className="text-[10px] font-black tracking-wide text-amber-300 uppercase">
                    {transcriptWords[activeCaptionWordIndex] || "VERSUS BATTLE"}
                  </span>
                </div>
              </div>

              {/* Live Scrubber Line */}
              <div className="absolute bottom-0 inset-x-0 h-1 bg-slate-200">
                <div
                  className="h-full bg-[#0066FF] transition-all duration-100"
                  style={{ width: `${previewProgress}%` }}
                />
              </div>
            </div>

            {/* Validation Checklist */}
            <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
              <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block">
                Render Prerequisites
              </span>
              <div className="space-y-1.5 text-xs">
                <div className="flex items-center gap-2">
                  {selectedFile ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                  ) : (
                    <AlertCircle className="w-3.5 h-3.5 text-slate-400" />
                  )}
                  <span className={selectedFile ? "text-slate-800 font-medium" : "text-slate-500"}>
                    Voiceover Audio Loaded
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  {comparisonFiles.length === 2 ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                  ) : (
                    <AlertCircle className="w-3.5 h-3.5 text-slate-400" />
                  )}
                  <span className={comparisonFiles.length === 2 ? "text-slate-800 font-medium" : "text-slate-500"}>
                    2 Split Visuals Uploaded (Left & Right)
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  {compareLeftTitle && compareRightTitle ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                  ) : (
                    <AlertCircle className="w-3.5 h-3.5 text-slate-400" />
                  )}
                  <span className={compareLeftTitle && compareRightTitle ? "text-slate-800 font-medium" : "text-slate-500"}>
                    Left & Right Option Titles Entered
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  {previewConfirmed ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                  ) : (
                    <AlertCircle className="w-3.5 h-3.5 text-amber-500" />
                  )}
                  <span className={previewConfirmed ? "text-slate-800 font-medium" : "text-slate-500"}>
                    Compulsory Visual Review Confirmed
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
