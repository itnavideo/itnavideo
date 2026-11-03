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
} from "lucide-react";
import { BorderBeam } from "@/components/magicui/BorderBeam";

// Master AWS S3 Production Music Library
export const AWS_SHORTS_BGM_TRACKS = [
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
export const TWENTY_SHORTS_CAPTION_STYLES = [
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

export interface FacelessShortsStudioProps {
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

  uploadedVideoFiles?: File[];
  onUploadedVideoFilesChange?: (files: File[]) => void;

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

export function FacelessShortsStudio({
  selectedFile,
  onSelectFile,
  topicTitle = "",
  onTopicTitleChange,
  subtitleStyle = "glow-viral",
  onSubtitleStyleChange,
  captionAnimationStyle = "smooth",
  onCaptionAnimationStyleChange,
  captionPosition = "bottom",
  onCaptionPositionChange,
  facelessBgmVolume = 0.12,
  onBgmVolumeChange,
  facelessEnableSfx = true,
  onEnableSfxChange,
  visualArtStyle = "realistic",
  onVisualArtStyleChange,
  backgroundTheme = "solid-white",
  onBackgroundThemeChange,
  onGenerate,
  isGenerating = false,
  assetSourceMode = "upload",
  onAssetSourceModeChange,
  uploadedImageFiles = [],
  onUploadedImageFilesChange,
  uploadedVideoFiles = [],
  onUploadedVideoFilesChange,
  onTranscribeAndPlan,
  isPlanning = false,
  planningMessage = "",
  planningError = null,
  onClearPlanningError,
}: FacelessShortsStudioProps) {
  // Navigation tabs
  const [activeTab, setActiveTab] = useState<'media' | 'captions' | 'audio' | 'preview'>('media');

  // Preview & Audition States
  const [playingBgmId, setPlayingBgmId] = useState<string | null>(null);
  const [selectedBgmPath, setSelectedBgmPath] = useState<string>("assets/reusable/music/parasail-silent-partner.mp3");
  const [customBgmFile, setCustomBgmFile] = useState<File | null>(null);
  const [previewConfirmed, setPreviewConfirmed] = useState<boolean>(false);
  const [captionCategory, setCaptionCategory] = useState<string>('All');
  const [inputError, setInputError] = useState<string | null>(null);

  // Audio Duration & Preview States
  const [audioDuration, setAudioDuration] = useState<number>(60);
  const [audioPreviewUrl, setAudioPreviewUrl] = useState<string>('');

  // Editorial Transcript Editor
  const [showTranscriptEditor, setShowTranscriptEditor] = useState<boolean>(false);
  const [editableTranscript, setEditableTranscript] = useState<string>(
    "Here is the secret to 10x retention on vertical shorts. Hook your audience in the first 3 seconds, deliver continuous visual payoffs, and close with an irresistible takeaway."
  );
  const [transcriptSavedFeedback, setTranscriptSavedFeedback] = useState<boolean>(false);

  // Local object URLs for previewing uploaded images & video clips
  const [imageObjectUrls, setImageObjectUrls] = useState<string[]>([]);
  const [videoObjectUrls, setVideoObjectUrls] = useState<string[]>([]);
  const [activePreviewSceneIdx, setActivePreviewSceneIdx] = useState<number>(0);

  // Audio refs
  const bgmAudioRef = useRef<HTMLAudioElement | null>(null);
  const audioFileInputRef = useRef<HTMLInputElement | null>(null);
  const imageFileInputRef = useRef<HTMLInputElement | null>(null);
  const videoFileInputRef = useRef<HTMLInputElement | null>(null);
  const bgmFileInputRef = useRef<HTMLInputElement | null>(null);

  // Clean object URLs for images
  useEffect(() => {
    const urls = uploadedImageFiles.map((file) => URL.createObjectURL(file));
    setImageObjectUrls(urls);
    return () => {
      urls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [uploadedImageFiles]);

  // Clean object URLs for video clips
  useEffect(() => {
    const urls = uploadedVideoFiles.map((file) => URL.createObjectURL(file));
    setVideoObjectUrls(urls);
    return () => {
      urls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [uploadedVideoFiles]);

  // Detect Audio Duration (Up to 90s strictly per Rule 4.1 for 9:16 Shorts)
  useEffect(() => {
    if (!selectedFile) {
      setAudioPreviewUrl('');
      return;
    }
    const url = URL.createObjectURL(selectedFile);
    setAudioPreviewUrl(url);

    const audioEl = new Audio(url);
    audioEl.onloadedmetadata = () => {
      if (audioEl.duration && Number.isFinite(audioEl.duration)) {
        const detected = Math.round(audioEl.duration);
        if (detected > 90) {
          setInputError('Faceless Shorts 9:16 strictly supports audio up to 90 seconds (90s). Please trim your audio file.');
        } else {
          setInputError(null);
        }
        setAudioDuration(detected);
      }
    };

    return () => {
      URL.revokeObjectURL(url);
    };
  }, [selectedFile]);

  // Filter caption styles by category
  const filteredCaptionStyles = useMemo(() => {
    if (captionCategory === 'All') return TWENTY_SHORTS_CAPTION_STYLES;
    return TWENTY_SHORTS_CAPTION_STYLES.filter((c) => c.category === captionCategory);
  }, [captionCategory]);

  const captionCategories = ['All', 'Viral', 'Cinema', 'Modern', 'Tech', 'Book', 'Editorial', 'Creative'];

  // Handle BGM Audition Play/Pause
  const handleTogglePlayBgm = (track: typeof AWS_SHORTS_BGM_TRACKS[0]) => {
    if (track.path === 'none') {
      if (bgmAudioRef.current) bgmAudioRef.current.pause();
      setPlayingBgmId(null);
      setSelectedBgmPath('none');
      return;
    }

    if (playingBgmId === track.id) {
      if (bgmAudioRef.current) bgmAudioRef.current.pause();
      setPlayingBgmId(null);
    } else {
      if (bgmAudioRef.current) bgmAudioRef.current.pause();
      const audio = new Audio(track.path.startsWith('http') ? track.path : `/${track.path.replace(/^\/+/, '')}`);
      audio.volume = Math.max(0, Math.min(1, facelessBgmVolume || 0.12));
      audio.loop = true;
      audio.play().catch(() => {});
      bgmAudioRef.current = audio;
      setPlayingBgmId(track.id);
      setSelectedBgmPath(track.path);
    }
  };

  // Handle Audio File Selection
  const handleAudioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('audio/') && !file.name.match(/\.(mp3|wav|m4a|aac|ogg)$/i)) {
        setInputError('Please upload a valid audio file (MP3, WAV, M4A, AAC).');
        return;
      }
      setInputError(null);
      onSelectFile(file);
      setPreviewConfirmed(false);
    }
  };

  // Handle Multi-Image Upload
  const handleImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const files = Array.from(e.target.files);
      onUploadedImageFilesChange([...uploadedImageFiles, ...files]);
      setPreviewConfirmed(false);
    }
  };

  // Handle Multi-Video Clips Upload
  const handleVideosChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0 && onUploadedVideoFilesChange) {
      const files = Array.from(e.target.files);
      onUploadedVideoFilesChange([...uploadedVideoFiles, ...files]);
      setPreviewConfirmed(false);
    }
  };

  // Handle Custom BGM Upload
  const handleBgmFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setCustomBgmFile(file);
      setPreviewConfirmed(false);
    }
  };

  // Sample Demo Loader
  const handleLoadSampleDemo = () => {
    if (onTopicTitleChange) onTopicTitleChange("3 Habits of Top 1% Creators");
    setEditableTranscript(
      "The top 1 percent of creators don't work harder. They build scalable leverage, master high-hook retention, and test relentlessly every single week."
    );
    setPreviewConfirmed(false);
  };

  // Total assets count
  const totalAssetsCount = uploadedImageFiles.length + uploadedVideoFiles.length;

  return (
    <div className="w-full space-y-6">
      {/* Studio Header Card (Clean White Surface) */}
      <div className="relative rounded-[28px] border border-slate-200 bg-white p-6 sm:p-8 shadow-xs overflow-hidden">
        <BorderBeam size={220} duration={14} delay={0} colorFrom="#FF5722" colorTo="#FFA000" />
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 rounded-full border border-orange-200 bg-orange-50 px-3 py-1 text-xs font-black text-[#FF5722]">
              <Sparkles size={13} />
              <span>9:16 Vertical Shorts · Clean White Studio</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Faceless AI Shorts Studio (9:16)
            </h1>
            <p className="text-sm text-slate-600 max-w-2xl leading-relaxed">
              Generate vertical 9:16 short-form viral videos (up to 90s) with kinetic typography, 20 animated subtitle styles, multiple images/clips, and auto-ducked music.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={handleLoadSampleDemo}
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs font-bold text-slate-700 hover:bg-slate-100 hover:text-slate-900 transition cursor-pointer shadow-xs"
            >
              <RotateCcw size={13} />
              <span>Load Sample Demo</span>
            </button>

            <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-center shadow-xs">
              <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-500">Shorts Rate</span>
              <span className="text-sm font-black text-[#FF5722]">1 Credit / Short (90s Max)</span>
            </div>
          </div>
        </div>

        {/* Error Notification Banner */}
        {(inputError || planningError) && (
          <div className="mt-4 flex items-center justify-between rounded-2xl border border-red-200 bg-red-50 p-4 text-xs font-bold text-red-700">
            <div className="flex items-center gap-2.5">
              <AlertCircle size={16} className="shrink-0 text-red-600" />
              <span>{inputError || planningError}</span>
            </div>
            {onClearPlanningError && (
              <button
                type="button"
                onClick={onClearPlanningError}
                className="text-red-500 hover:text-red-700 font-black cursor-pointer"
              >
                Dismiss
              </button>
            )}
          </div>
        )}

        {/* Navigation Tabs */}
        <div className="mt-6 flex flex-wrap items-center gap-2 border-t border-slate-100 pt-4">
          <button
            type="button"
            onClick={() => setActiveTab('media')}
            className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold transition cursor-pointer ${
              activeTab === 'media'
                ? 'bg-[#FF5722] text-white shadow-md shadow-[#FF5722]/20'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
            }`}
          >
            <Video size={14} />
            <span>1. Voiceover &amp; Media ({totalAssetsCount})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('captions')}
            className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold transition cursor-pointer ${
              activeTab === 'captions'
                ? 'bg-[#FF5722] text-white shadow-md shadow-[#FF5722]/20'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
            }`}
          >
            <Layers size={14} />
            <span>2. 20 Caption Styles</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('audio')}
            className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold transition cursor-pointer ${
              activeTab === 'audio'
                ? 'bg-[#FF5722] text-white shadow-md shadow-[#FF5722]/20'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
            }`}
          >
            <Music size={14} />
            <span>3. Background Music &amp; SFX ({Math.round((facelessBgmVolume || 0.12) * 100)}%)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('preview')}
            className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold transition cursor-pointer ${
              activeTab === 'preview'
                ? 'bg-[#FF5722] text-white shadow-md shadow-[#FF5722]/20'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
            }`}
          >
            <Eye size={14} />
            <span>4. Compulsory 9:16 Live Preview</span>
            {previewConfirmed && <Check size={12} className="text-emerald-300 stroke-[3]" />}
          </button>
        </div>
      </div>

      {/* TAB 1: VOICEOVER & MULTI-MEDIA ASSETS (IMAGES & VIDEO CLIPS) */}
      {activeTab === 'media' && (
        <div className="space-y-6">
          {/* Audio Upload Card */}
          <div className="rounded-[28px] border border-slate-200 bg-white p-6 sm:p-8 shadow-xs space-y-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-2.5 rounded-xl bg-orange-50 text-[#FF5722] border border-orange-200">
                  <UploadCloud size={20} />
                </div>
                <div>
                  <h2 className="text-lg font-black text-slate-900">1. Spoken Narration Audio (9:16 Shorts)</h2>
                  <p className="text-xs text-slate-500">Upload your voiceover track (MP3, WAV, M4A, up to 90 seconds max)</p>
                </div>
              </div>

              {selectedFile && (
                <span className="inline-flex items-center gap-1 text-xs font-black text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                  <CheckCircle2 size={13} />
                  <span>{audioDuration}s detected</span>
                </span>
              )}
            </div>

            <input
              type="file"
              ref={audioFileInputRef}
              onChange={handleAudioChange}
              accept="audio/*,.mp3,.wav,.m4a,.aac"
              className="hidden"
            />

            {!selectedFile ? (
              <div
                onClick={() => audioFileInputRef.current?.click()}
                className="border-2 border-dashed border-slate-200 hover:border-[#FF5722] bg-slate-50 hover:bg-orange-50/30 rounded-2xl p-8 text-center cursor-pointer transition flex flex-col items-center justify-center gap-3 group"
              >
                <div className="p-3.5 rounded-2xl bg-white text-slate-400 group-hover:text-[#FF5722] shadow-xs border border-slate-200 transition">
                  <UploadCloud size={28} />
                </div>
                <div>
                  <p className="text-sm font-black text-slate-800">Click or drag &amp; drop your voiceover audio here</p>
                  <p className="text-xs text-slate-500 mt-1">Supports MP3, WAV, M4A, AAC · Maximum 90 Seconds</p>
                </div>
              </div>
            ) : (
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3.5 w-full sm:w-auto">
                  <div className="p-3 rounded-xl bg-white text-[#FF5722] border border-slate-200 shadow-xs">
                    <Volume2 size={20} />
                  </div>
                  <div className="truncate">
                    <p className="text-sm font-black text-slate-900 truncate max-w-sm">{selectedFile.name}</p>
                    <p className="text-xs text-slate-500">
                      {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB · {audioDuration}s duration
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                  {audioPreviewUrl && (
                    <audio controls src={audioPreviewUrl} className="h-9 max-w-[220px]" />
                  )}
                  <button
                    type="button"
                    onClick={() => audioFileInputRef.current?.click()}
                    className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-700 hover:bg-slate-100 transition cursor-pointer"
                  >
                    Replace
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      onSelectFile(null);
                      setAudioPreviewUrl('');
                    }}
                    className="p-2 rounded-xl border border-slate-200 bg-white text-slate-400 hover:text-red-500 hover:border-red-200 transition cursor-pointer"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Multi-Asset Media Upload Card (Images & Video Clips) */}
          <div className="rounded-[28px] border border-slate-200 bg-white p-6 sm:p-8 shadow-xs space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-2.5">
                <div className="p-2.5 rounded-xl bg-orange-50 text-[#FF5722] border border-orange-200">
                  <Video size={20} />
                </div>
                <div>
                  <h2 className="text-lg font-black text-slate-900">2. Custom Visual Media (Images &amp; Video Clips)</h2>
                  <p className="text-xs text-slate-500">Upload multiple photos and MP4 video clips to populate your 9:16 vertical scenes</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="file"
                  ref={imageFileInputRef}
                  onChange={handleImagesChange}
                  accept="image/*"
                  multiple
                  className="hidden"
                />
                <input
                  type="file"
                  ref={videoFileInputRef}
                  onChange={handleVideosChange}
                  accept="video/mp4,video/quicktime,video/webm"
                  multiple
                  className="hidden"
                />

                <button
                  type="button"
                  onClick={() => imageFileInputRef.current?.click()}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-100 text-slate-800 px-3.5 py-2 text-xs font-bold shadow-xs transition cursor-pointer"
                >
                  <ImageIcon size={14} className="text-[#FF5722]" />
                  <span>+ Add Images</span>
                </button>

                <button
                  type="button"
                  onClick={() => videoFileInputRef.current?.click()}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-100 text-slate-800 px-3.5 py-2 text-xs font-bold shadow-xs transition cursor-pointer"
                >
                  <Video size={14} className="text-[#FF5722]" />
                  <span>+ Add Video Clips</span>
                </button>

                {totalAssetsCount > 0 && (
                  <button
                    type="button"
                    onClick={() => {
                      onUploadedImageFilesChange([]);
                      if (onUploadedVideoFilesChange) onUploadedVideoFilesChange([]);
                    }}
                    className="inline-flex items-center gap-1 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-500 hover:text-red-500 transition cursor-pointer"
                  >
                    <Trash2 size={13} />
                    <span>Clear</span>
                  </button>
                )}
              </div>
            </div>

            {/* Media Upload Grid or Empty State */}
            {totalAssetsCount === 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div
                  onClick={() => imageFileInputRef.current?.click()}
                  className="border-2 border-dashed border-slate-200 hover:border-[#FF5722] bg-slate-50 hover:bg-orange-50/30 rounded-2xl p-6 text-center cursor-pointer transition flex flex-col items-center justify-center gap-2 group"
                >
                  <div className="p-3 rounded-2xl bg-white text-slate-400 group-hover:text-[#FF5722] shadow-xs border border-slate-200">
                    <ImageIcon size={24} />
                  </div>
                  <p className="text-xs font-black text-slate-800">Upload Multiple Images</p>
                  <p className="text-[11px] text-slate-500">Supports PNG, JPG, WEBP</p>
                </div>

                <div
                  onClick={() => videoFileInputRef.current?.click()}
                  className="border-2 border-dashed border-slate-200 hover:border-[#FF5722] bg-slate-50 hover:bg-orange-50/30 rounded-2xl p-6 text-center cursor-pointer transition flex flex-col items-center justify-center gap-2 group"
                >
                  <div className="p-3 rounded-2xl bg-white text-slate-400 group-hover:text-[#FF5722] shadow-xs border border-slate-200">
                    <Video size={24} />
                  </div>
                  <p className="text-xs font-black text-slate-800">Upload Video Clips</p>
                  <p className="text-[11px] text-slate-500">Supports MP4, MOV, WebM</p>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                {/* Uploaded Images */}
                {uploadedImageFiles.map((file, idx) => (
                  <div
                    key={`img-${idx}`}
                    className="relative group rounded-xl border border-slate-200 bg-slate-50 overflow-hidden shadow-xs flex flex-col"
                  >
                    <div className="relative aspect-[9/16] w-full bg-slate-200 overflow-hidden">
                      {imageObjectUrls[idx] && (
                        <img
                          src={imageObjectUrls[idx]}
                          alt={file.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      )}
                      <div className="absolute top-1.5 left-1.5 px-1.5 py-0.5 rounded-md bg-black/75 backdrop-blur-sm text-[9px] font-black text-white">
                        Photo #{idx + 1}
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          const updated = uploadedImageFiles.filter((_, i) => i !== idx);
                          onUploadedImageFilesChange(updated);
                        }}
                        className="absolute top-1.5 right-1.5 p-1 rounded-md bg-red-600 text-white opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer shadow-sm"
                      >
                        <Trash2 size={11} />
                      </button>
                    </div>
                    <div className="p-1.5">
                      <p className="text-[10px] font-bold text-slate-800 truncate">{file.name}</p>
                    </div>
                  </div>
                ))}

                {/* Uploaded Video Clips */}
                {uploadedVideoFiles.map((file, idx) => (
                  <div
                    key={`vid-${idx}`}
                    className="relative group rounded-xl border border-slate-200 bg-slate-50 overflow-hidden shadow-xs flex flex-col"
                  >
                    <div className="relative aspect-[9/16] w-full bg-slate-900 overflow-hidden flex items-center justify-center">
                      {videoObjectUrls[idx] && (
                        <video
                          src={videoObjectUrls[idx]}
                          className="w-full h-full object-cover"
                          muted
                        />
                      )}
                      <div className="absolute top-1.5 left-1.5 px-1.5 py-0.5 rounded-md bg-orange-600 text-[9px] font-black text-white">
                        Clip #{idx + 1}
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          if (onUploadedVideoFilesChange) {
                            const updated = uploadedVideoFiles.filter((_, i) => i !== idx);
                            onUploadedVideoFilesChange(updated);
                          }
                        }}
                        className="absolute top-1.5 right-1.5 p-1 rounded-md bg-red-600 text-white opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer shadow-sm"
                      >
                        <Trash2 size={11} />
                      </button>
                    </div>
                    <div className="p-1.5">
                      <p className="text-[10px] font-bold text-slate-800 truncate">{file.name}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Project Details Card */}
          <div className="rounded-[28px] border border-slate-200 bg-white p-6 sm:p-8 shadow-xs space-y-4">
            <h2 className="text-lg font-black text-slate-900">3. Short Story Details</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Short Title / Topic</label>
                <input
                  type="text"
                  value={topicTitle}
                  onChange={(e) => onTopicTitleChange && onTopicTitleChange(e.target.value)}
                  placeholder="e.g. 3 Habits of High Performers..."
                  className="w-full mt-1.5 rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs font-bold text-slate-800 focus:outline-none focus:border-[#FF5722] shadow-xs"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Canvas Background</label>
                <select
                  value={backgroundTheme}
                  onChange={(e) => onBackgroundThemeChange && onBackgroundThemeChange(e.target.value)}
                  className="w-full mt-1.5 rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs font-bold text-slate-800 focus:outline-none focus:border-[#FF5722] shadow-xs cursor-pointer"
                >
                  <option value="solid-white">Clean Pure White (Recommended)</option>
                  <option value="warm-editorial">Warm Editorial Sand</option>
                  <option value="minimal-slate">Subtle Studio Slate</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: 20 MASTER CAPTION STYLES */}
      {activeTab === 'captions' && (
        <div className="space-y-6">
          <div className="rounded-[28px] border border-slate-200 bg-white p-6 sm:p-8 shadow-xs space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-black text-slate-900">20 Master YouTube 9:16 Caption Styles</h2>
                <p className="text-xs text-slate-500">High-retention animated typography synchronized strictly to your spoken narration</p>
              </div>

              {/* Category Filter Pills */}
              <div className="flex flex-wrap items-center gap-1.5">
                {captionCategories.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setCaptionCategory(cat)}
                    className={`rounded-lg px-2.5 py-1 text-[11px] font-bold transition cursor-pointer ${
                      captionCategory === cat
                        ? 'bg-[#FF5722] text-white shadow-xs'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* 20 Caption Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
              {filteredCaptionStyles.map((style) => {
                const isSelected = subtitleStyle === style.id;
                return (
                  <div
                    key={style.id}
                    onClick={() => onSubtitleStyleChange && onSubtitleStyleChange(style.id)}
                    className={`rounded-2xl border-2 p-4 cursor-pointer transition flex flex-col justify-between gap-3 ${
                      isSelected
                        ? 'border-[#FF5722] bg-orange-50/50 shadow-md ring-2 ring-[#FF5722]/20'
                        : 'border-slate-200 bg-slate-50 hover:border-slate-300 hover:bg-white'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md bg-white border border-slate-200 text-slate-700">
                        {style.category}
                      </span>
                      {isSelected && (
                        <div className="w-5 h-5 rounded-full bg-[#FF5722] text-white flex items-center justify-center">
                          <Check size={12} strokeWidth={3} />
                        </div>
                      )}
                    </div>

                    <div className="h-16 rounded-xl bg-white border border-slate-200 shadow-xs flex items-center justify-center p-3 text-center">
                      <span
                        className="text-xs font-black uppercase tracking-wide"
                        style={{ color: style.color }}
                      >
                        {style.name}
                      </span>
                    </div>

                    <div className="space-y-0.5">
                      <p className="text-xs font-black text-slate-900">{style.name}</p>
                      <p className="text-[11px] text-slate-500 leading-tight">{style.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: BACKGROUND MUSIC & SFX */}
      {activeTab === 'audio' && (
        <div className="space-y-6">
          <div className="rounded-[28px] border border-slate-200 bg-white p-6 sm:p-8 shadow-xs space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-black text-slate-900">AWS S3 Background Music Catalog</h2>
                <p className="text-xs text-slate-500">Audition atmospheric soundtracks ducked under your speech at 12% default volume</p>
              </div>

              {/* Volume Slider Card */}
              <div className="flex items-center gap-3 bg-slate-50 border border-slate-200 px-4 py-2 rounded-2xl">
                <Volume2 size={16} className="text-[#FF5722]" />
                <span className="text-xs font-bold text-slate-700">Volume:</span>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={facelessBgmVolume}
                  onChange={(e) => onBgmVolumeChange && onBgmVolumeChange(parseFloat(e.target.value))}
                  className="w-24 accent-[#FF5722] cursor-pointer"
                />
                <span className="text-xs font-black text-slate-900 min-w-[36px]">
                  {Math.round((facelessBgmVolume || 0.12) * 100)}%
                </span>
              </div>
            </div>

            {/* Volume Presets */}
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold text-slate-500">Volume Presets:</span>
              {[
                { label: 'Mute (0%)', val: 0 },
                { label: 'Subtle (5%)', val: 0.05 },
                { label: 'Studio (12% Default)', val: 0.12 },
                { label: 'Rich (20%)', val: 0.20 },
                { label: 'Full (35%)', val: 0.35 },
              ].map((preset) => (
                <button
                  key={preset.label}
                  type="button"
                  onClick={() => onBgmVolumeChange && onBgmVolumeChange(preset.val)}
                  className={`rounded-lg px-2.5 py-1 text-[11px] font-bold transition cursor-pointer ${
                    Math.abs((facelessBgmVolume || 0.12) - preset.val) < 0.02
                      ? 'bg-[#FF5722] text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {preset.label}
                </button>
              ))}
            </div>

            {/* BGM Track List */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {AWS_SHORTS_BGM_TRACKS.map((track) => {
                const isSelected = selectedBgmPath === track.path;
                const isPlaying = playingBgmId === track.id;

                return (
                  <div
                    key={track.id}
                    className={`rounded-2xl border p-4 flex items-center justify-between gap-3 transition cursor-pointer ${
                      isSelected
                        ? 'border-[#FF5722] bg-orange-50/40 shadow-xs'
                        : 'border-slate-200 bg-slate-50 hover:bg-white'
                    }`}
                    onClick={() => setSelectedBgmPath(track.path)}
                  >
                    <div className="flex items-center gap-3 truncate">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleTogglePlayBgm(track);
                        }}
                        className={`p-2.5 rounded-xl transition cursor-pointer shadow-xs ${
                          isPlaying
                            ? 'bg-[#FF5722] text-white'
                            : 'bg-white text-slate-700 hover:text-[#FF5722] border border-slate-200'
                        }`}
                      >
                        {isPlaying ? <Pause size={14} /> : <Play size={14} />}
                      </button>

                      <div className="truncate">
                        <p className="text-xs font-black text-slate-900 truncate">{track.label}</p>
                        <p className="text-[10px] text-slate-500 truncate">{track.desc}</p>
                      </div>
                    </div>

                    <div className="shrink-0">
                      {isSelected ? (
                        <div className="w-5 h-5 rounded-full bg-[#FF5722] text-white flex items-center justify-center">
                          <Check size={12} strokeWidth={3} />
                        </div>
                      ) : (
                        <span className="text-[10px] font-bold text-slate-400 uppercase">{track.category}</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Custom BGM Upload */}
            <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <p className="text-xs font-black text-slate-800">Upload your own background music track</p>
                <p className="text-[11px] text-slate-500">Supports MP3 and WAV files</p>
              </div>

              <input
                type="file"
                ref={bgmFileInputRef}
                onChange={handleBgmFileChange}
                accept="audio/*"
                className="hidden"
              />

              <div className="flex items-center gap-2">
                {customBgmFile ? (
                  <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200">
                    {customBgmFile.name}
                  </span>
                ) : null}
                <button
                  type="button"
                  onClick={() => bgmFileInputRef.current?.click()}
                  className="rounded-xl border border-slate-200 bg-white hover:bg-slate-100 px-4 py-2 text-xs font-bold text-slate-700 transition cursor-pointer shadow-xs"
                >
                  {customBgmFile ? 'Replace BGM' : 'Upload Custom BGM'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: COMPULSORY LIVE PREVIEW & EDITORIAL TRANSCRIPT */}
      {activeTab === 'preview' && (
        <div className="space-y-6">
          {/* Spoken Narration Editorial Markdown Editor */}
          <div className="rounded-[28px] border border-slate-200 bg-white p-6 sm:p-8 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-orange-50 text-[#FF5722] border border-orange-200">
                  <FileText size={18} />
                </div>
                <div>
                  <h3 className="text-sm font-black text-slate-900">Spoken Transcript Editorial Editor</h3>
                  <p className="text-xs text-slate-500">Fix any spelling mistakes, brand names, or typos before final rendering</p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setShowTranscriptEditor(!showTranscriptEditor)}
                className={`inline-flex items-center gap-1.5 rounded-xl border px-3.5 py-1.5 text-xs font-bold transition cursor-pointer ${
                  showTranscriptEditor
                    ? 'border-orange-500 bg-orange-50 text-[#FF5722]'
                    : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-100'
                }`}
              >
                <Edit3 size={13} />
                <span>{showTranscriptEditor ? 'Collapse Editor' : 'Edit Spoken Transcript'}</span>
              </button>
            </div>

            {showTranscriptEditor && (
              <div className="space-y-3 pt-2">
                <textarea
                  value={editableTranscript}
                  onChange={(e) => setEditableTranscript(e.target.value)}
                  rows={4}
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 p-4 text-xs font-medium text-slate-800 leading-relaxed focus:outline-none focus:border-[#FF5722] shadow-xs"
                  placeholder="Edit spoken words here..."
                />

                <div className="flex items-center justify-between">
                  <span className="text-[11px] text-slate-400">
                    {editableTranscript.length} characters · {editableTranscript.split(/\s+/).filter(Boolean).length} words
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      setTranscriptSavedFeedback(true);
                      setTimeout(() => setTranscriptSavedFeedback(false), 2000);
                    }}
                    className="inline-flex items-center gap-1 rounded-xl bg-slate-900 hover:bg-black text-white px-3.5 py-1.5 text-xs font-bold transition cursor-pointer"
                  >
                    {transcriptSavedFeedback ? <CheckCheck size={13} className="text-emerald-400" /> : <Check size={13} />}
                    <span>{transcriptSavedFeedback ? 'Saved!' : 'Save Corrections'}</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Interactive 9:16 Vertical Live Preview Player */}
          <div className="rounded-[28px] border border-slate-200 bg-white p-6 sm:p-8 shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-black text-slate-900">Interactive 9:16 Vertical Shorts Preview</h2>
                <p className="text-xs text-slate-500">Verify your vertical safe-zones, subtitle placement, and pacing before rendering</p>
              </div>

              {/* Compulsory Review State Banner */}
              <div
                className={`inline-flex items-center gap-2 rounded-2xl px-4 py-2 text-xs font-black border transition ${
                  previewConfirmed
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                    : 'bg-amber-50 text-amber-800 border-amber-200'
                }`}
              >
                {previewConfirmed ? (
                  <>
                    <CheckCircle2 size={15} className="text-emerald-600" />
                    <span>Preview Verified · Ready to Render</span>
                  </>
                ) : (
                  <>
                    <Lock size={15} className="text-amber-600" />
                    <span>Compulsory Review: Confirm Preview below to unlock render</span>
                  </>
                )}
              </div>
            </div>

            {/* 9:16 Vertical Canvas Container */}
            <div className="flex justify-center py-2">
              <div className="relative aspect-[9/16] w-full max-w-[320px] rounded-3xl overflow-hidden border-4 border-slate-800 shadow-2xl bg-[#FAFAFA] flex items-center justify-center">
                {/* Dot Grid Background */}
                <div
                  className="absolute inset-0 pointer-events-none opacity-60"
                  style={{
                    backgroundImage: 'radial-gradient(rgba(0, 0, 0, 0.06) 1.5px, transparent 1.5px)',
                    backgroundSize: '24px 24px',
                  }}
                />

                {/* Active Image or Video Visual */}
                {imageObjectUrls.length > 0 && imageObjectUrls[activePreviewSceneIdx] ? (
                  <img
                    src={imageObjectUrls[activePreviewSceneIdx]}
                    alt="Scene Visual"
                    className="w-full h-full object-cover"
                  />
                ) : videoObjectUrls.length > 0 ? (
                  <video
                    src={videoObjectUrls[0]}
                    className="w-full h-full object-cover"
                    muted
                    autoPlay
                    loop
                  />
                ) : (
                  <div className="p-6 text-center text-slate-400 space-y-2">
                    <Tv size={36} className="mx-auto opacity-40 text-[#FF5722]" />
                    <p className="text-xs font-black text-slate-800">Dynamic 9:16 Scene</p>
                    <p className="text-[10px] text-slate-500">Vector graphics, illustrations &amp; typography will animate here</p>
                  </div>
                )}

                {/* Subtitle Overlay Preview */}
                <div className="absolute bottom-16 left-4 right-4 flex justify-center pointer-events-none">
                  <div className="text-center bg-black/80 backdrop-blur-md rounded-2xl px-4 py-2 border border-white/20 shadow-xl max-w-[90%]">
                    <p className="text-xs font-black text-[#FFD700] tracking-wide">
                      {editableTranscript.slice(0, 60)}...
                    </p>
                  </div>
                </div>

                {/* Top Flame Orange Progress Bar */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#FF5722] via-[#FF7043] to-[#FFA000]" />
              </div>
            </div>

            {/* Compulsory Review Confirmation Checkbox */}
            <div className="rounded-2xl border-2 border-orange-200 bg-orange-50/50 p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="confirm-shorts-preview-checkbox"
                  checked={previewConfirmed}
                  onChange={(e) => setPreviewConfirmed(e.target.checked)}
                  className="w-5 h-5 accent-[#FF5722] cursor-pointer rounded"
                />
                <label htmlFor="confirm-shorts-preview-checkbox" className="text-xs font-bold text-slate-800 cursor-pointer">
                  I have verified the 9:16 vertical framing, caption styling, and narration pacing. Unlock final render.
                </label>
              </div>

              <button
                type="button"
                onClick={() => setPreviewConfirmed(true)}
                className={`rounded-xl px-4 py-2 text-xs font-black transition cursor-pointer ${
                  previewConfirmed
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'bg-[#FF5722] hover:bg-[#FF7043] text-white shadow-md shadow-[#FF5722]/20'
                }`}
              >
                {previewConfirmed ? 'Verified ✓' : 'Confirm Preview Now'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* FINAL RENDER ACTION BAR (Guarded by Compulsory Preview) */}
      <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-slate-500">Duration:</span>
          <span className="ml-1 text-sm font-black text-slate-900">{audioDuration}s</span>
          <span className="mx-2 text-slate-300">·</span>
          <span className="text-xs font-bold text-slate-500">Format:</span>
          <span className="ml-1 text-xs font-black text-slate-800">9:16 Vertical (1080×1920)</span>
          <span className="mx-2 text-slate-300">·</span>
          <span className="text-xs font-bold text-slate-500">Credits:</span>
          <span className="ml-1 text-sm font-black text-[#FF5722]">1 Credit / Short</span>
        </div>

        <button
          type="button"
          onClick={() => {
            if (onGenerate) {
              onGenerate({
                topicTitle,
                subtitleStyle,
                captionAnimationStyle,
                captionPosition,
                facelessBgmVolume,
                facelessEnableSfx,
                selectedBgmPath,
                customBgmFile,
                editableTranscript,
                durationSeconds: audioDuration,
              });
            }
          }}
          disabled={isGenerating || !previewConfirmed || !selectedFile}
          className={`w-full sm:w-auto inline-flex items-center justify-center gap-2.5 rounded-2xl px-8 py-4 text-sm font-black transition-all duration-200 ${
            !previewConfirmed || !selectedFile
              ? 'bg-slate-200 text-slate-400 cursor-not-allowed border border-slate-300'
              : isGenerating
              ? 'bg-gradient-to-r from-[#FF5722] via-[#FF7043] to-[#FFA000] text-white opacity-80 cursor-wait animate-pulse shadow-xl'
              : 'bg-gradient-to-r from-[#FF5722] via-[#FF7043] to-[#FFA000] text-white shadow-xl shadow-[#FF5722]/30 hover:brightness-110 active:scale-95 cursor-pointer'
          }`}
        >
          {!previewConfirmed ? (
            <>
              <Lock size={16} className="text-slate-400" />
              <span>Preview Required to Unlock Render</span>
            </>
          ) : (
            <>
              <Film size={16} className="stroke-[2.5]" />
              <span>
                {isGenerating
                  ? 'Submitting Cloud Render...'
                  : 'Render 9:16 Vertical Short (1 Credit)'}
              </span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
