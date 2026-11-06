"use client";

import React, { useState, useRef, useEffect, useMemo } from "react";
import Image from "next/image";
import {
  Sparkles,
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
  Flame,
  Tag,
  Music,
  Scissors,
  Wand2,
} from "lucide-react";
import { BorderBeam } from "@/components/magicui/BorderBeam";
import { KINETIC_STYLES, type KineticStyleDefinition } from "@/lib/captions/kineticStyles";

// Master AWS S3 Production Music Library (13+ Curated Tracks)
export const AWS_CLIPS_BGM_TRACKS = [
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

export interface LongVideoClipsStudioProps {
  selectedFile: File | null;
  onSelectFile: (file: File | null) => void;

  clipCount: number;
  onClipCountChange: (val: number) => void;

  clipDuration: "auto" | "under-30" | "30-60" | "60-90";
  onClipDurationChange: (val: "auto" | "under-30" | "30-60" | "60-90") => void;

  clipsHookStrategy: "auto" | "high-energy" | "actionable" | "story";
  onClipsHookStrategyChange: (val: "auto" | "high-energy" | "actionable" | "story") => void;

  layoutMode: "auto-speaker" | "split-screen" | "fit-widescreen";
  onLayoutModeChange: (val: "auto-speaker" | "split-screen" | "fit-widescreen") => void;

  enableCaptions: boolean;
  onEnableCaptionsChange: (val: boolean) => void;

  captionStyle: string;
  onCaptionStyleChange: (val: string) => void;

  bgmTrackId: string;
  onBgmTrackIdChange: (trackId: string) => void;
  bgmVolume: number;
  onBgmVolumeChange: (vol: number) => void;
  customBgmFile: File | null;
  onCustomBgmFileSelect: (file: File | null) => void;

  enableSfx: boolean;
  onEnableSfxChange: (val: boolean) => void;

  editorialTranscript: string;
  onEditorialTranscriptChange: (text: string) => void;

  onGenerate: () => void;
  isGenerating: boolean;
  renderedVideoUrl?: string;
}

export function LongVideoClipsStudio({
  selectedFile,
  onSelectFile,
  clipCount = 3,
  onClipCountChange,
  clipDuration = "30-60",
  onClipDurationChange,
  clipsHookStrategy = "auto",
  onClipsHookStrategyChange,
  layoutMode = "auto-speaker",
  onLayoutModeChange,
  enableCaptions = true,
  onEnableCaptionsChange,
  captionStyle = "Pop Word",
  onCaptionStyleChange,
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
}: LongVideoClipsStudioProps) {
  // Navigation Tabs: 'media' | 'captions' | 'audio' | 'preview'
  const [activeTab, setActiveTab] = useState<"media" | "captions" | "audio" | "preview">("media");

  // Caption category filter
  const [captionCategoryFilter, setCaptionCategoryFilter] = useState<string>("All");

  // Audio audition state
  const [playingTrackId, setPlayingTrackId] = useState<string | null>(null);
  const audioAuditionRef = useRef<HTMLAudioElement | null>(null);

  // Compulsory Preview Gate
  const [previewConfirmed, setPreviewConfirmed] = useState<boolean>(false);

  // Interactive Live Player Simulator State
  const [isPlayingPreview, setIsPlayingPreview] = useState<boolean>(false);
  const [previewProgress, setPreviewProgress] = useState<number>(0);

  // Drag and drop inputs
  const videoInputRef = useRef<HTMLInputElement | null>(null);
  const customBgmInputRef = useRef<HTMLInputElement | null>(null);

  // Preview video Object URL
  const videoPreviewUrl = useMemo(() => {
    if (!selectedFile) return null;
    return URL.createObjectURL(selectedFile);
  }, [selectedFile]);

  useEffect(() => {
    return () => {
      if (videoPreviewUrl) URL.revokeObjectURL(videoPreviewUrl);
    };
  }, [videoPreviewUrl]);

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
          return prev + 1.25;
        });
      }, 100);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPlayingPreview]);

  // Words from editorial transcript for live drawing simulation
  const transcriptWords = useMemo(() => {
    const raw = editorialTranscript.trim();
    if (!raw) {
      return ["FIND", "THE", "BEST", "VIRAL", "MOMENTS", "AUTOMATICALLY"];
    }
    return raw.split(/\s+/).slice(0, 14);
  }, [editorialTranscript]);

  const activeCaptionWordIndex = useMemo(() => {
    if (transcriptWords.length === 0) return 0;
    const step = 100 / transcriptWords.length;
    return Math.min(
      transcriptWords.length - 1,
      Math.floor(previewProgress / step)
    );
  }, [previewProgress, transcriptWords.length]);

  // Filter 50 Caption Styles
  const filteredCaptionStyles = useMemo(() => {
    if (captionCategoryFilter === "All") return KINETIC_STYLES;
    return KINETIC_STYLES.filter((s) => s.category === captionCategoryFilter);
  }, [captionCategoryFilter]);

  const selectedCaptionDef = useMemo(() => {
    return (
      KINETIC_STYLES.find((s) => s.name === captionStyle || s.id === captionStyle) ||
      KINETIC_STYLES[0]
    );
  }, [captionStyle]);

  const isReadyToRender =
    Boolean(selectedFile) &&
    previewConfirmed &&
    !isGenerating;

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6">
      {/* Top Banner: Crisp White Aesthetic */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2.5 mb-1.5">
              <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-xs font-semibold bg-orange-50 text-orange-600 border border-orange-200">
                <Scissors className="w-3.5 h-3.5" />
                Long Video to Viral Clips • 9:16 Shorts
              </span>
              <span className="text-xs text-slate-500 font-medium">
                Input up to 2 Hours • 1 Credit / Clip
              </span>
            </div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
              Viral Video Clips Studio
            </h1>
            <p className="text-sm text-slate-600 mt-1 max-w-2xl">
              Upload podcasts, lectures, or interviews up to 2 hours. AI hook detection automatically extracts high-retention 30s–60s vertical shorts with 50 viral caption styles.
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
              <Eye className="w-4 h-4 text-orange-500" />
              Live Preview
            </button>

            <button
              onClick={onGenerate}
              disabled={!isReadyToRender}
              className={`relative inline-flex items-center gap-2 px-6 py-2.5 rounded-xl font-semibold text-sm transition shadow-sm ${
                isReadyToRender
                  ? "bg-orange-500 hover:bg-orange-600 text-white cursor-pointer"
                  : "bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed"
              }`}
            >
              {isReadyToRender && (
                <BorderBeam size={80} duration={4} colorFrom="#FF5722" colorTo="#FFA000" />
              )}
              {isGenerating ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-white" />
                  Extracting Clips...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  Extract Viral Clips ({clipCount} Cr)
                </>
              )}
            </button>
          </div>
        </div>

        {/* Studio Sub-Navigation Tabs */}
        <div className="flex items-center gap-2 mt-6 border-b border-slate-100 pb-2">
          {[
            { id: "media", label: "1. Video & Hook Strategy", icon: Layers, badge: selectedFile ? "Ready" : undefined },
            { id: "captions", label: "2. 50 Caption Styles", icon: Zap, badge: selectedCaptionDef.name },
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
                        ? "bg-slate-800 text-orange-300"
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
          {/* TAB 1: VIDEO UPLOAD & HOOK STRATEGY */}
          {activeTab === "media" && (
            <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm space-y-6">
              {/* Long Video Upload */}
              <div className="border border-slate-200 rounded-xl p-5 bg-slate-50/50">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-orange-100 flex items-center justify-center text-orange-600 font-bold text-xs">
                      <Video className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-slate-900">
                        Source Long Video (Up to 2 Hours)
                      </h3>
                      <p className="text-xs text-slate-500">
                        Upload your podcast, interview, or tutorial video (16:9 or 9:16)
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
                  ref={videoInputRef}
                  accept="video/mp4,video/quicktime,video/webm"
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
                      <div className="w-10 h-10 rounded-lg bg-orange-50 flex items-center justify-center text-orange-600">
                        <Video className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-slate-800 line-clamp-1">
                          {selectedFile.name}
                        </p>
                        <p className="text-xs text-slate-500">
                          {(selectedFile.size / (1024 * 1024)).toFixed(1)} MB • Ready for AI Hook Extraction
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
                    onClick={() => videoInputRef.current?.click()}
                    className="border-2 border-dashed border-slate-300 hover:border-orange-400 bg-white rounded-xl p-6 text-center cursor-pointer transition"
                  >
                    <UploadCloud className="w-8 h-8 text-orange-500 mx-auto mb-2" />
                    <p className="text-sm font-semibold text-slate-800">
                      Upload Source Video File
                    </p>
                    <p className="text-xs text-slate-500 mt-1">
                      MP4, MOV up to 2 hours. Drag and drop or click to browse.
                    </p>
                  </div>
                )}
              </div>

              {/* Clip Count & Duration Settings */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    Number of Clips to Extract
                  </label>
                  <select
                    value={clipCount}
                    onChange={(e) => onClipCountChange(parseInt(e.target.value))}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition"
                  >
                    <option value={1}>1 Viral Clip (1 Credit)</option>
                    <option value={2}>2 Viral Clips (2 Credits)</option>
                    <option value={3}>3 Viral Clips (3 Credits)</option>
                    <option value={5}>5 Viral Clips (5 Credits)</option>
                    <option value={8}>8 Viral Clips (8 Credits)</option>
                    <option value={10}>10 Viral Clips (10 Credits)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    Clip Length Target
                  </label>
                  <select
                    value={clipDuration}
                    onChange={(e) => onClipDurationChange(e.target.value as any)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition"
                  >
                    <option value="30-60">30–60 Seconds (Recommended for Shorts)</option>
                    <option value="under-30">Under 30 Seconds (Fast Punchy)</option>
                    <option value="60-90">60–90 Seconds (Deep Insight)</option>
                    <option value="auto">Auto (AI decides based on scene)</option>
                  </select>
                </div>
              </div>

              {/* AI Hook Strategy & Layout Mode */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    AI Hook Detection Mode
                  </label>
                  <select
                    value={clipsHookStrategy}
                    onChange={(e) => onClipsHookStrategyChange(e.target.value as any)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition"
                  >
                    <option value="auto">Auto Detect Best Moments</option>
                    <option value="high-energy">High Energy & Viral Climax</option>
                    <option value="actionable">Actionable Advice & Tips</option>
                    <option value="story">Emotional Story & Narrative</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    Vertical Layout Framing
                  </label>
                  <select
                    value={layoutMode}
                    onChange={(e) => onLayoutModeChange(e.target.value as any)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition"
                  >
                    <option value="auto-speaker">Auto Speaker Pan & Crop (9:16)</option>
                    <option value="split-screen">Split Screen Stacked</option>
                    <option value="fit-widescreen">Fit 16:9 with Blur Backdrop</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: 50 STANDALONE CAPTION STYLES */}
          {activeTab === "captions" && (
            <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    50 Viral Caption Presets
                  </h3>
                  <p className="text-xs text-slate-500">
                    High-retention animated subtitle styles calibrated for vertical Shorts & Reels
                  </p>
                </div>

                {/* Category Pills */}
                <div className="flex flex-wrap gap-1.5">
                  {["All", "Single Word", "Line Captions", "Stacks", "Typewriter", "Editorial"].map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setCaptionCategoryFilter(cat)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition ${
                        captionCategoryFilter === cat
                          ? "bg-orange-500 text-white shadow-xs"
                          : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* 50 Styles Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[440px] overflow-y-auto pr-1">
                {filteredCaptionStyles.map((style) => {
                  const isSelected = captionStyle === style.name || captionStyle === style.id;
                  return (
                    <div
                      key={style.id}
                      onClick={() => onCaptionStyleChange(style.name)}
                      className={`p-3.5 rounded-xl border cursor-pointer transition relative ${
                        isSelected
                          ? "border-orange-500 bg-orange-50/30 ring-2 ring-orange-500/20"
                          : "border-slate-200 hover:border-slate-300 bg-white"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-bold text-slate-800">
                          #{style.index} {style.name}
                        </span>
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 uppercase">
                          {style.category}
                        </span>
                      </div>
                      <div className="p-2.5 rounded-lg bg-slate-950 flex items-center justify-center mt-2">
                        <span className="text-xs font-black text-amber-300 uppercase tracking-wide">
                          VIRAL MOMENT
                        </span>
                      </div>
                    </div>
                  );
                })}
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
                  Studio ducking ensures original speech stays crystal clear above background music
                </p>
              </div>

              {/* Volume Slider: Default 12% */}
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Volume2 className="w-4 h-4 text-orange-500" />
                    <span className="text-xs font-bold text-slate-800">
                      Background Music Volume (Default: 12%)
                    </span>
                  </div>
                  <span className="text-xs font-bold text-orange-600 bg-orange-50 px-2 py-0.5 rounded border border-orange-200">
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
                  <Zap className="w-4 h-4 text-orange-500" />
                  <div>
                    <p className="text-xs font-bold text-slate-800">
                      Viral Transition Sound Effects (SFX)
                    </p>
                    <p className="text-xs text-slate-500">
                      Subtle whooshes and bass drops on hook transitions
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => onEnableSfxChange(!enableSfx)}
                  className={`w-11 h-6 flex items-center rounded-full p-1 transition cursor-pointer ${
                    enableSfx ? "bg-orange-500 justify-end" : "bg-slate-300 justify-start"
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
                  {AWS_CLIPS_BGM_TRACKS.map((track) => {
                    const isSelected = bgmTrackId === track.id;
                    const isPlaying = playingTrackId === track.id;
                    return (
                      <div
                        key={track.id}
                        onClick={() => onBgmTrackIdChange(track.id)}
                        className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition ${
                          isSelected
                            ? "border-orange-500 bg-orange-50/30 ring-1 ring-orange-500/30"
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
                                ? "bg-orange-500 text-white"
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
                  Review or edit the extracted speech to fix brand names, acronyms, or spelling before final rendering
                </p>
              </div>

              <div className="relative">
                <textarea
                  rows={5}
                  value={editorialTranscript}
                  onChange={(e) => onEditorialTranscriptChange(e.target.value)}
                  placeholder="Paste or edit the spoken speech transcription here..."
                  className="w-full p-4 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 font-mono transition"
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
                    Compulsory Review Check: I have reviewed the video framing & caption preset
                  </p>
                  <p className="text-xs text-slate-600 mt-0.5">
                    Ensures your vertical portrait cropping, caption styling, and clip count are ready before starting cloud rendering.
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
                <Tv className="w-3.5 h-3.5 text-orange-500" />
                9:16 Live Preview (Viral Short)
              </span>
              <button
                onClick={() => setIsPlayingPreview(!isPlayingPreview)}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-xs font-semibold text-slate-700 transition"
              >
                {isPlayingPreview ? (
                  <>
                    <Pause className="w-3.5 h-3.5 text-orange-500" />
                    Pause
                  </>
                ) : (
                  <>
                    <Play className="w-3.5 h-3.5 text-orange-500" />
                    Simulate
                  </>
                )}
              </button>
            </div>

            {/* 9:16 Vertical Video Simulator */}
            <div className="relative mx-auto w-full max-w-[280px] aspect-[9/16] rounded-2xl overflow-hidden shadow-md border-4 border-slate-900 bg-slate-900 flex flex-col justify-between p-3.5">
              {/* TOP HOOK HEADLINE BANNER */}
              <div className="z-10 text-center">
                <div className="inline-block bg-amber-400 text-slate-950 font-black text-[10px] px-2.5 py-1 rounded-lg uppercase tracking-wide shadow-sm max-w-[90%] truncate">
                  VIRAL HOOK MOMENT
                </div>
              </div>

              {/* CENTER VIDEO SIMULATOR */}
              <div className="absolute inset-0 overflow-hidden">
                {videoPreviewUrl ? (
                  <video
                    src={videoPreviewUrl}
                    className="w-full h-full object-cover"
                    autoPlay
                    loop
                    muted
                    playsInline
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center p-4 text-center bg-slate-900">
                    <Video className="w-10 h-10 text-slate-600 mb-2" />
                    <p className="text-xs font-bold text-slate-400">
                      Upload long video
                    </p>
                    <p className="text-[10px] text-slate-500 mt-0.5">
                      Auto speaker crop (9:16)
                    </p>
                  </div>
                )}
              </div>

              {/* BOTTOM CAPTION OVERLAY */}
              <div className="z-20 text-center mb-4 pointer-events-none">
                <div className="bg-slate-950/85 backdrop-blur-xs border border-white/10 text-white rounded-xl py-1.5 px-3 max-w-[95%] mx-auto shadow-md">
                  <span className="text-[11px] font-black text-amber-300 uppercase tracking-wide">
                    {transcriptWords[activeCaptionWordIndex] || "VIRAL SHORTS"}
                  </span>
                </div>
              </div>

              {/* Live Scrubber Line */}
              <div className="absolute bottom-0 inset-x-0 h-1 bg-slate-800 z-30">
                <div
                  className="h-full bg-orange-500 transition-all duration-100"
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
                    Source Long Video Uploaded
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                  <span className="text-slate-800 font-medium">
                    {clipCount} Viral Clip{clipCount > 1 ? "s" : ""} Target ({clipCount} Credits)
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
