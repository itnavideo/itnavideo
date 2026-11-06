"use client";

import React, { useState, useRef, useEffect, useMemo } from "react";
import Image from "next/image";
import {
  Sparkles,
  Upload,
  UploadCloud,
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
  Tag,
  Music,
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
  Split,
  User,
} from "lucide-react";
import { BorderBeam } from "@/components/magicui/BorderBeam";

// Master AWS S3 Production Music Library
export const AWS_SPLIT_BGM_TRACKS = [
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

// 20 Master YouTube 9:16 Caption Styles
export const TWENTY_SPLIT_CAPTION_STYLES = [
  { id: "glow-viral", name: "Flame Glow Yellow", category: "Viral", color: "#FFD700", badge: "Popular", desc: "High-energy glowing yellow active word highlight" },
  { id: "mrbeast", name: "MrBeast Yellow Box", category: "Viral", color: "#FFEB3B", badge: "Creator", desc: "Punchy yellow bounding box with bold pop" },
  { id: "netflix-yellow", name: "Cinema Gold Subtitle", category: "Cinema", color: "#FACC15", badge: "Clean", desc: "Classic yellow bold font with black outline" },
  { id: "hormozi-bold", name: "Hormozi Lime Punch", category: "Viral", color: "#22C55E", badge: "Retention", desc: "High-contrast punchy green & yellow caps" },
  { id: "neon-city", name: "Cyberpunk Electric Cyan", category: "Modern", color: "#00F0FF", badge: "Glow", desc: "Cyan and magenta neon electric pulse" },
  { id: "daily-look", name: "Sunny Vlog Rounded", category: "Friendly", color: "#FDE047", badge: "Vlog", desc: "Friendly rounded stroke with sunny glow" },
  { id: "blockbuster", name: "Blockbuster Flame", category: "News", color: "#FF5722", badge: "Bold", desc: "Heavyweight slab headlines with Flame Orange" },
  { id: "handwriting-pop", name: "Organic Script Pop", category: "Creative", color: "#FB7185", badge: "Script", desc: "Authentic cursive handwriting with dynamic line" },
  { id: "vox-docu", name: "Vox Documentary Serif", category: "Editorial", color: "#FFFFFF", badge: "Docu", desc: "Editorial serif with dark glass backdrop" },
  { id: "minimal-clean", name: "Minimal Ice Blue", category: "Modern", color: "#38BDF8", badge: "Minimal", desc: "Ultra-crisp modern sans-serif with slate pill" },
  { id: "cyber-ops", name: "Radar Military Green", category: "Tech", color: "#4ADE80", badge: "Tech", desc: "High-tech stencil with radar green glow" },
  { id: "premium-gold", name: "Wealth Metallic Gold", category: "Finance", color: "#FBBF24", badge: "Wealth", desc: "Rich warm metallic gold for business & finance" },
  { id: "word-highlight", name: "Flame Word Pop", category: "Kinetic", color: "#FF5722", badge: "Dynamic", desc: "Active word pops with vibrant flame orange" },
  { id: "classic-clean", name: "Timeless White Cinema", category: "Cinema", color: "#FFFFFF", badge: "Classic", desc: "Crisp white typography with deep drop shadow" },
  { id: "documentary-serif", name: "Classical Book Serif", category: "Book", color: "#E2E8F0", badge: "Book", desc: "Elegant serif captions for non-fiction literature" },
  { id: "karaoke-glow", name: "Karaoke Amber Pulse", category: "Karaoke", color: "#FFA000", badge: "Karaoke", desc: "Golden amber electric glow following speech" },
  { id: "box-pill", name: "Dark Slate Pill Box", category: "Modern", color: "#00FFCC", badge: "Pill", desc: "Solid dark badge background behind spoken words" },
  { id: "neon-cyber", name: "Magenta Cyber Pulse", category: "Modern", color: "#FF007F", badge: "Neon", desc: "High-contrast cyan & magenta glowing text" },
  { id: "minimal-lower-third", name: "Scrubber Lower Third", category: "Subtle", color: "#CBD5E1", badge: "Clean", desc: "Clean studio strip at the bottom of the frame" },
  { id: "editorial-book", name: "Author Emerald Accent", category: "Book", color: "#10B981", badge: "Editorial", desc: "Distinguished emerald highlight on solid white" },
];

export interface VisualUploadItem {
  id: string;
  file: File;
  previewUrl: string;
  type: "image" | "video";
}

export interface SplitScreenExplainerStudioProps {
  // Bottom 50%: Creator Video
  creatorVideoFile: File | null;
  onCreatorVideoSelect: (file: File | null) => void;

  // Top 50%: Explanation Visuals (Images & Video Clips)
  explanationItems: VisualUploadItem[];
  onAddExplanationFiles: (files: File[]) => void;
  onRemoveExplanationItem: (id: string) => void;

  topicTitle: string;
  onTopicTitleChange: (val: string) => void;

  subtitleStyle: string;
  onSubtitleStyleChange: (style: string) => void;

  bgmTrackId: string;
  onBgmTrackIdChange: (trackId: string) => void;

  bgmVolume: number;
  onBgmVolumeChange: (val: number) => void;

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

export const SplitScreenExplainerStudio: React.FC<SplitScreenExplainerStudioProps> = ({
  creatorVideoFile,
  onCreatorVideoSelect,
  explanationItems,
  onAddExplanationFiles,
  onRemoveExplanationItem,
  topicTitle,
  onTopicTitleChange,
  subtitleStyle,
  onSubtitleStyleChange,
  bgmTrackId,
  onBgmTrackIdChange,
  bgmVolume,
  onBgmVolumeChange,
  customBgmFile,
  onCustomBgmFileSelect,
  enableSfx,
  onEnableSfxChange,
  editorialTranscript,
  onEditorialTranscriptChange,
  onGenerate,
  isGenerating,
  renderedVideoUrl,
}) => {
  // Active Navigation Tab: 'media' | 'captions' | 'audio' | 'preview'
  const [activeTab, setActiveTab] = useState<"media" | "captions" | "audio" | "preview">("media");

  // Filter tabs for 20 caption styles
  const [captionCategoryFilter, setCaptionCategoryFilter] = useState<string>("All");

  // Audio audition state
  const [playingTrackId, setPlayingTrackId] = useState<string | null>(null);
  const audioAuditionRef = useRef<HTMLAudioElement | null>(null);

  // Compulsory Preview Gate
  const [previewConfirmed, setPreviewConfirmed] = useState<boolean>(false);

  // Interactive Live Player Simulator State
  const [isPlayingPreview, setIsPlayingPreview] = useState<boolean>(false);
  const [previewProgress, setPreviewProgress] = useState<number>(0);
  const [activeSlideIndex, setActiveSlideIndex] = useState<number>(0);

  // Drag and Drop State
  const [isDraggingCreator, setIsDraggingCreator] = useState<boolean>(false);
  const [isDraggingVisuals, setIsDraggingVisuals] = useState<boolean>(false);

  const creatorInputRef = useRef<HTMLInputElement | null>(null);
  const visualsInputRef = useRef<HTMLInputElement | null>(null);
  const customBgmInputRef = useRef<HTMLInputElement | null>(null);

  // Creator Video Object URL for preview
  const creatorVideoUrl = useMemo(() => {
    if (!creatorVideoFile) return null;
    return URL.createObjectURL(creatorVideoFile);
  }, [creatorVideoFile]);

  // Clean up Object URL
  useEffect(() => {
    return () => {
      if (creatorVideoUrl) URL.revokeObjectURL(creatorVideoUrl);
    };
  }, [creatorVideoUrl]);

  // Caption Categories
  const captionCategories = useMemo(() => {
    const cats = Array.from(new Set(TWENTY_SPLIT_CAPTION_STYLES.map((s) => s.category)));
    return ["All", ...cats];
  }, []);

  const filteredCaptionStyles = useMemo(() => {
    if (captionCategoryFilter === "All") return TWENTY_SPLIT_CAPTION_STYLES;
    return TWENTY_SPLIT_CAPTION_STYLES.filter((s) => s.category === captionCategoryFilter);
  }, [captionCategoryFilter]);

  // Play/Pause BGM Audition
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

  // Stop audio on unmount
  useEffect(() => {
    return () => {
      if (audioAuditionRef.current) {
        audioAuditionRef.current.pause();
        audioAuditionRef.current = null;
      }
    };
  }, []);

  // Update audition volume on slider change
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
          return prev + 1.25; // cycle every ~8 seconds
        });
      }, 100);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPlayingPreview]);

  // Sync active slide index based on progress
  useEffect(() => {
    if (explanationItems.length > 0) {
      const step = 100 / explanationItems.length;
      const idx = Math.min(
        explanationItems.length - 1,
        Math.floor(previewProgress / step)
      );
      setActiveSlideIndex(idx);
    }
  }, [previewProgress, explanationItems.length]);

  // Words from editorial transcript for live caption display
  const transcriptWords = useMemo(() => {
    const raw = editorialTranscript.trim();
    if (!raw) {
      return ["Master", "every", "concept", "with", "dual", "split-screen", "clarity"];
    }
    return raw.split(/\s+/).slice(0, 14);
  }, [editorialTranscript]);

  const activeCaptionWordIndex = useMemo(() => {
    if (transcriptWords.length === 0) return 0;
    const wordStep = 100 / transcriptWords.length;
    return Math.min(
      transcriptWords.length - 1,
      Math.floor(previewProgress / wordStep)
    );
  }, [previewProgress, transcriptWords.length]);

  // Selected Caption Object
  const currentCaptionStyle = useMemo(() => {
    return (
      TWENTY_SPLIT_CAPTION_STYLES.find((s) => s.id === subtitleStyle) ||
      TWENTY_SPLIT_CAPTION_STYLES[0]
    );
  }, [subtitleStyle]);

  // Check if ready to generate
  const isReadyToRender =
    Boolean(creatorVideoFile) &&
    explanationItems.length > 0 &&
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
                <Split className="w-3.5 h-3.5" />
                9:16 Vertical • 50/50 Dual Split
              </span>
              <span className="text-xs text-slate-500 font-medium">
                Max 90s • 1 Flat Credit
              </span>
            </div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
              Book Split-Screen Explainer Studio
            </h1>
            <p className="text-sm text-slate-600 mt-1 max-w-2xl">
              Create engaging vertical videos with a 50/50 split: Top 50% shows rich explanation visuals (images & video clips), and Bottom 50% shows your creator talking-head video.
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
                  Rendering Cloud MP4...
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
            { id: "media", label: "1. Media (50/50 Split)", icon: Layers, badge: creatorVideoFile && explanationItems.length > 0 ? "Ready" : undefined },
            { id: "captions", label: "2. Captions (20 Styles)", icon: Zap, badge: currentCaptionStyle.name.split(" ")[0] },
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
          {/* TAB 1: 50/50 MEDIA UPLOADS */}
          {activeTab === "media" && (
            <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm space-y-6">
              {/* Video Title Input */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Topic Title / Headline Badge
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={topicTitle}
                    onChange={(e) => onTopicTitleChange(e.target.value)}
                    placeholder="e.g. ATOMIC HABITS: The 1% Rule Explained"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition"
                  />
                  <Tag className="absolute right-3.5 top-3 w-4 h-4 text-slate-400" />
                </div>
                <p className="text-xs text-slate-500 mt-1.5">
                  Appears in the flame divider pill separating top and bottom screens.
                </p>
              </div>

              {/* Bottom 50% Section: Creator Talking Head */}
              <div className="border border-slate-200 rounded-xl p-5 bg-slate-50/50">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-orange-100 flex items-center justify-center text-orange-600 font-bold text-xs">
                      <User className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-slate-900">
                        Bottom 50%: Creator Video (1080×960)
                      </h3>
                      <p className="text-xs text-slate-500">
                        Your talking head recording or camera presenter clip
                      </p>
                    </div>
                  </div>
                  {creatorVideoFile && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-600 border border-emerald-200">
                      <Check className="w-3.5 h-3.5" />
                      Loaded
                    </span>
                  )}
                </div>

                <input
                  type="file"
                  ref={creatorInputRef}
                  accept="video/mp4,video/quicktime,video/webm"
                  className="hidden"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      onCreatorVideoSelect(e.target.files[0]);
                    }
                  }}
                />

                {creatorVideoFile ? (
                  <div className="relative flex items-center justify-between p-3.5 bg-white border border-slate-200 rounded-xl">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-orange-50 flex items-center justify-center text-orange-600">
                        <Video className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-slate-800 line-clamp-1">
                          {creatorVideoFile.name}
                        </p>
                        <p className="text-xs text-slate-500">
                          {(creatorVideoFile.size / (1024 * 1024)).toFixed(1)} MB • Talking Head Video
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => onCreatorVideoSelect(null)}
                      className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition"
                      title="Remove file"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div
                    onDragOver={(e) => {
                      e.preventDefault();
                      setIsDraggingCreator(true);
                    }}
                    onDragLeave={() => setIsDraggingCreator(false)}
                    onDrop={(e) => {
                      e.preventDefault();
                      setIsDraggingCreator(false);
                      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                        onCreatorVideoSelect(e.dataTransfer.files[0]);
                      }
                    }}
                    onClick={() => creatorInputRef.current?.click()}
                    className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition ${
                      isDraggingCreator
                        ? "border-orange-500 bg-orange-50/50"
                        : "border-slate-300 hover:border-orange-400 bg-white"
                    }`}
                  >
                    <UploadCloud className="w-8 h-8 text-orange-500 mx-auto mb-2" />
                    <p className="text-sm font-semibold text-slate-800">
                      Upload Creator Talking-Head Video
                    </p>
                    <p className="text-xs text-slate-500 mt-1">
                      MP4, MOV up to 90 seconds. Drag and drop or click to browse.
                    </p>
                  </div>
                )}
              </div>

              {/* Top 50% Section: Explanation Visuals (Multiple Images & Video Clips) */}
              <div className="border border-slate-200 rounded-xl p-5 bg-slate-50/50">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-orange-100 flex items-center justify-center text-orange-600 font-bold text-xs">
                      <Layers className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-slate-900">
                        Top 50%: Explanation Visuals (1080×960)
                      </h3>
                      <p className="text-xs text-slate-500">
                        Upload multiple images & video clips that cycle to explain the topic
                      </p>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-slate-600 px-2.5 py-1 bg-white border border-slate-200 rounded-lg">
                    {explanationItems.length} Visuals
                  </span>
                </div>

                <input
                  type="file"
                  ref={visualsInputRef}
                  accept="image/png,image/jpeg,image/webp,video/mp4,video/quicktime"
                  multiple
                  className="hidden"
                  onChange={(e) => {
                    if (e.target.files && e.target.files.length > 0) {
                      onAddExplanationFiles(Array.from(e.target.files));
                    }
                  }}
                />

                <div
                  onDragOver={(e) => {
                    e.preventDefault();
                    setIsDraggingVisuals(true);
                  }}
                  onDragLeave={() => setIsDraggingVisuals(false)}
                  onDrop={(e) => {
                    e.preventDefault();
                    setIsDraggingVisuals(false);
                    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
                      onAddExplanationFiles(Array.from(e.dataTransfer.files));
                    }
                  }}
                  onClick={() => visualsInputRef.current?.click()}
                  className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition ${
                    isDraggingVisuals
                      ? "border-orange-500 bg-orange-50/50"
                      : "border-slate-300 hover:border-orange-400 bg-white"
                  }`}
                >
                  <Plus className="w-8 h-8 text-orange-500 mx-auto mb-2" />
                  <p className="text-sm font-semibold text-slate-800">
                    Add Explanation Images & Video Clips
                  </p>
                  <p className="text-xs text-slate-500 mt-1">
                    Upload PNG, JPG, or MP4 clips. These appear on the top screen during explanation.
                  </p>
                </div>

                {/* Grid of uploaded explanation items */}
                {explanationItems.length > 0 && (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
                    {explanationItems.map((item, idx) => (
                      <div
                        key={item.id}
                        className="relative group rounded-xl overflow-hidden border border-slate-200 bg-white aspect-video shadow-xs"
                      >
                        {item.type === "image" ? (
                          <img
                            src={item.previewUrl}
                            alt={`Explanation Visual ${idx + 1}`}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-slate-900 flex items-center justify-center text-white text-xs">
                            <Film className="w-5 h-5 text-orange-400 mb-1" />
                          </div>
                        )}
                        <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-between p-2">
                          <span className="text-[10px] font-bold text-white bg-slate-900/80 px-1.5 py-0.5 rounded">
                            #{idx + 1}
                          </span>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onRemoveExplanationItem(item.id);
                            }}
                            className="p-1 rounded bg-rose-500 text-white hover:bg-rose-600 transition"
                            title="Delete"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 2: 20 MASTER YOUTUBE CAPTION STYLES */}
          {activeTab === "captions" && (
            <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    20 Master YouTube Caption Styles
                  </h3>
                  <p className="text-xs text-slate-500">
                    High-retention animated typography synced perfectly to spoken speech
                  </p>
                </div>

                {/* Category Filter Pills */}
                <div className="flex flex-wrap gap-1.5">
                  {captionCategories.map((cat) => (
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

              {/* 20 Caption Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[460px] overflow-y-auto pr-1">
                {filteredCaptionStyles.map((style) => {
                  const isSelected = subtitleStyle === style.id;
                  return (
                    <div
                      key={style.id}
                      onClick={() => onSubtitleStyleChange(style.id)}
                      className={`p-3.5 rounded-xl border cursor-pointer transition relative ${
                        isSelected
                          ? "border-orange-500 bg-orange-50/30 ring-2 ring-orange-500/20"
                          : "border-slate-200 hover:border-slate-300 bg-white"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-xs font-bold text-slate-800">
                          {style.name}
                        </span>
                        <span
                          className="text-[10px] font-bold px-1.5 py-0.5 rounded uppercase"
                          style={{
                            backgroundColor: `${style.color}20`,
                            color: style.color === "#FFFFFF" ? "#0F172A" : style.color,
                            border: `1px solid ${style.color}40`,
                          }}
                        >
                          {style.badge}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 line-clamp-1 mb-2">
                        {style.desc}
                      </p>
                      {/* Mini Live Preview Badge */}
                      <div className="p-2 rounded-lg bg-slate-950 flex items-center justify-center">
                        <span
                          className="text-xs font-black tracking-wide"
                          style={{ color: style.color }}
                        >
                          RETENTION HOOK
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
                  Studio ducking ensures speech stays crystal clear above background music
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
                      Subtle Motion Sound Effects (SFX)
                    </p>
                    <p className="text-xs text-slate-500">
                      Smooth whooshes and subtle pops when explanation visuals swap
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
                  {AWS_SPLIT_BGM_TRACKS.map((track) => {
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
                  Edit the transcript to fix any spoken names, brand spellings, or phonetic mistakes before rendering
                </p>
              </div>

              <div className="relative">
                <textarea
                  rows={5}
                  value={editorialTranscript}
                  onChange={(e) => onEditorialTranscriptChange(e.target.value)}
                  placeholder="Paste or edit the spoken narration script here. Your subtitles will follow these exact words..."
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
                    Compulsory Review Check: I have reviewed the 50/50 split layout & captions
                  </p>
                  <p className="text-xs text-slate-600 mt-0.5">
                    Ensures your top visuals, bottom creator camera, and subtitle alignment look right before cloud rendering.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: 9:16 Vertical 50/50 Live Visual Preview */}
        <div className="lg:col-span-5">
          <div className="sticky top-6 bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                <Tv className="w-3.5 h-3.5 text-orange-500" />
                9:16 Live Preview (50/50 Split)
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

            {/* 9:16 Vertical Canvas Container */}
            <div className="relative mx-auto w-full max-w-[280px] aspect-[9/16] rounded-2xl overflow-hidden shadow-md border-4 border-slate-900 bg-[#FAFAFA] flex flex-col">
              {/* TOP 50%: EXPLANATION ZONE */}
              <div className="relative h-1/2 w-full bg-slate-100 overflow-hidden border-b border-orange-500/40">
                {explanationItems.length > 0 ? (
                  <div className="w-full h-full relative">
                    {explanationItems[activeSlideIndex]?.type === "image" ? (
                      <img
                        src={explanationItems[activeSlideIndex]?.previewUrl}
                        alt="Explanation Top Slide"
                        className="w-full h-full object-cover transition-transform duration-700 scale-105"
                      />
                    ) : (
                      <div className="w-full h-full bg-slate-900 flex items-center justify-center">
                        <Film className="w-8 h-8 text-orange-400" />
                      </div>
                    )}
                    <div className="absolute top-2 left-2 bg-slate-900/80 text-white text-[9px] font-bold px-2 py-0.5 rounded backdrop-blur-xs">
                      TOP: #{activeSlideIndex + 1}/{explanationItems.length}
                    </div>
                  </div>
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center p-4 text-center">
                    <ImageIcon className="w-8 h-8 text-slate-300 mb-1" />
                    <p className="text-[11px] font-bold text-slate-400">
                      Top 50%: Explanation Zone
                    </p>
                    <p className="text-[9px] text-slate-400">
                      Upload slides, images, or clips
                    </p>
                  </div>
                )}
              </div>

              {/* CENTER SPLIT DIVIDER BAR */}
              <div className="relative z-10 w-full h-1 bg-gradient-to-r from-orange-500 via-amber-400 to-orange-500 shadow-sm flex items-center justify-center">
                <div className="absolute bg-slate-900 text-white text-[8px] font-bold px-2 py-0.5 rounded-full border border-orange-400 shadow-xs max-w-[85%] truncate">
                  {topicTitle.trim() || "50/50 EXPLAINER"}
                </div>
              </div>

              {/* BOTTOM 50%: CREATOR TALKING-HEAD ZONE */}
              <div className="relative h-1/2 w-full bg-slate-800 overflow-hidden">
                {creatorVideoUrl ? (
                  <video
                    src={creatorVideoUrl}
                    className="w-full h-full object-cover"
                    autoPlay
                    loop
                    muted
                    playsInline
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center p-4 text-center">
                    <User className="w-8 h-8 text-slate-500 mb-1" />
                    <p className="text-[11px] font-bold text-slate-400">
                      Bottom 50%: Creator Video
                    </p>
                    <p className="text-[9px] text-slate-500">
                      Upload talking-head video
                    </p>
                  </div>
                )}

                {/* FLOATING SUBTITLE BAR */}
                <div className="absolute bottom-4 inset-x-2 flex justify-center z-20 pointer-events-none">
                  <div
                    className="px-2.5 py-1 rounded-lg backdrop-blur-xs shadow-md text-center max-w-[90%]"
                    style={{
                      backgroundColor: "rgba(15, 23, 42, 0.85)",
                      border: "1px solid rgba(255, 255, 255, 0.15)",
                    }}
                  >
                    <span
                      className="text-[10px] font-black uppercase tracking-wide"
                      style={{ color: currentCaptionStyle.color }}
                    >
                      {transcriptWords[activeCaptionWordIndex] || "SPLIT SCREEN"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Live Scrubber Line */}
              <div className="absolute bottom-0 inset-x-0 h-1 bg-slate-200">
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
                  {creatorVideoFile ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                  ) : (
                    <AlertCircle className="w-3.5 h-3.5 text-slate-400" />
                  )}
                  <span className={creatorVideoFile ? "text-slate-800 font-medium" : "text-slate-500"}>
                    Creator Video Loaded (Bottom 50%)
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  {explanationItems.length > 0 ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                  ) : (
                    <AlertCircle className="w-3.5 h-3.5 text-slate-400" />
                  )}
                  <span className={explanationItems.length > 0 ? "text-slate-800 font-medium" : "text-slate-500"}>
                    Explanation Visuals Loaded (Top 50%)
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
};

