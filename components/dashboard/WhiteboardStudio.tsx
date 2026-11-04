/* eslint-disable @next/next/no-img-element */
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
  VolumeX,
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
  PenTool,
  Type,
  Tag,
  Music,
  Hand,
  Palette,
  Activity,
  MousePointer,
  RotateCcw,
} from "lucide-react";
import { BorderBeam } from "@/components/magicui/BorderBeam";

// Master AWS S3 Production Music Library (13+ Curated Tracks)
export const AWS_WHITEBOARD_BGM_TRACKS = [
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
  { id: "none", label: "No Background Music", category: "Mute", path: "none", desc: "Pure voiceover narration only" },
];

export const WHITEBOARD_FONTS_CATALOG = [
  { id: "balsamiq", name: "Balsamiq Sans (Default)", desc: "Clean, hand-drawn comic look", badge: "Default", sample: "The 1% Rule Explained", cssFamily: "'Balsamiq Sans', cursive, sans-serif" },
  { id: "permanent-marker", name: "Permanent Marker", desc: "Bold, natural whiteboard marker", badge: "Bold", sample: "THE 1% RULE EXPLAINED", cssFamily: "'Permanent Marker', cursive, sans-serif" },
  { id: "kids-hand", name: "Kids Hand (Gochi)", desc: "Casual playful script handwriting", badge: "Playful", sample: "The 1% Rule Explained", cssFamily: "'Gochi Hand', cursive, sans-serif" },
  { id: "comic-neue", name: "Comic Neue", desc: "Crisp and friendly rounded type", badge: "Friendly", sample: "The 1% Rule Explained", cssFamily: "'Comic Neue', cursive, sans-serif" },
  { id: "caveat", name: "Caveat", desc: "Quick cursive handwritten notes", badge: "Cursive", sample: "The 1% Rule Explained", cssFamily: "'Caveat', cursive, sans-serif" },
  { id: "kalam", name: "Kalam Handwriting", desc: "Authentic marker pen strokes", badge: "Authentic", sample: "The 1% Rule Explained", cssFamily: "'Kalam', cursive, sans-serif" },
  { id: "architect", name: "Architects Daughter", desc: "Architectural blueprint lettering", badge: "Design", sample: "The 1% Rule Explained", cssFamily: "'Architects Daughter', cursive, sans-serif" },
  { id: "handlee", name: "Handlee", desc: "Sweet, personal handwriting font", badge: "Personal", sample: "The 1% Rule Explained", cssFamily: "'Handlee', cursive, sans-serif" },
  { id: "shadows", name: "Shadows Into Light", desc: "Neat modern condensed hand", badge: "Clean", sample: "The 1% Rule Explained", cssFamily: "'Shadows Into Light', cursive, sans-serif" },
  { id: "schoolbell", name: "Schoolbell", desc: "Classroom chalkboard style", badge: "Classic", sample: "The 1% Rule Explained", cssFamily: "'Schoolbell', cursive, sans-serif" },
  { id: "indie-flower", name: "Indie Flower", desc: "Bubbly casual handwritten script", badge: "Casual", sample: "The 1% Rule Explained", cssFamily: "'Indie Flower', cursive, sans-serif" },
  { id: "comic-relief", name: "Comic Relief", desc: "Fun, vibrant cartoon lettering", badge: "Vibrant", sample: "The 1% Rule Explained", cssFamily: "'Comic Neue', cursive, sans-serif" },
];

export const MARKER_COLOR_PALETTE = [
  { id: "auto", name: "Dynamic Colorful", hex: "#2563EB", ringHex: "#3B82F6", desc: "AI automatically pairs contrasting marker colors per scene" },
  { id: "charcoal", name: "Classic Charcoal", hex: "#0F172A", ringHex: "#334155", desc: "Deep dry-erase black marker for high clarity" },
  { id: "blue", name: "Executive Royal Blue", hex: "#2563EB", ringHex: "#60A5FA", desc: "Professional blueprint & corporate explainer blue" },
  { id: "crimson", name: "Crimson Red", hex: "#DC2626", ringHex: "#F87171", desc: "High-urgency hook, warning, and contrast red" },
  { id: "emerald", name: "Emerald Green", hex: "#059669", ringHex: "#34D399", desc: "Money, compounding growth, and positive milestones" },
  { id: "amber", name: "Sunset Amber", hex: "#D97706", ringHex: "#FBBF24", desc: "Warm creative concept and spotlight gold" },
];

export const HAND_DRAWING_STYLES = [
  { id: "right", name: "Right Hand (Default)", desc: "Photorealistic human hand holding marker (AWS S3)", icon: "✋", badge: "Realistic" },
  { id: "left", name: "Left Hand (Mirrored)", desc: "Natural left-handed drawing stroke angle", icon: "🤚", badge: "Mirrored" },
  { id: "none", name: "No Hand (Pure Draw)", desc: "Direct stroke drawing animation without hand blocking view", icon: "⚡", badge: "Fast Draw" },
];

export interface WhiteboardStudioProps {
  selectedFile: File | null;
  onSelectFile: (file: File | null) => void;

  topicTitle: string;
  onTopicTitleChange: (val: string) => void;

  fontPersonality: string;
  onFontPersonalityChange: (val: string) => void;

  markerColor: string;
  onMarkerColorChange: (val: string) => void;

  handStyle?: string;
  onHandStyleChange?: (val: string) => void;

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

export function WhiteboardStudio({
  selectedFile,
  onSelectFile,
  topicTitle,
  onTopicTitleChange,
  fontPersonality = "balsamiq",
  onFontPersonalityChange,
  markerColor = "auto",
  onMarkerColorChange,
  handStyle = "right",
  onHandStyleChange,
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
}: WhiteboardStudioProps) {
  // Navigation Tabs: 'media' | 'style' | 'audio' | 'preview'
  const [activeTab, setActiveTab] = useState<"media" | "style" | "audio" | "preview">("media");

  // Audio audition state for BGM
  const [playingTrackId, setPlayingTrackId] = useState<string | null>(null);
  const audioAuditionRef = useRef<HTMLAudioElement | null>(null);

  // Voiceover Narration Audio Preview State
  const [voiceoverAudioUrl, setVoiceoverAudioUrl] = useState<string | null>(null);
  const [isVoiceoverPlaying, setIsVoiceoverPlaying] = useState<boolean>(false);
  const [voiceoverDuration, setVoiceoverDuration] = useState<number>(0);
  const [voiceoverCurrentTime, setVoiceoverCurrentTime] = useState<number>(0);
  const voiceoverAudioRef = useRef<HTMLAudioElement | null>(null);

  // Compulsory Preview Gate
  const [previewConfirmed, setPreviewConfirmed] = useState<boolean>(false);

  // Interactive Live Player Simulator State
  const [isPlayingPreview, setIsPlayingPreview] = useState<boolean>(false);
  const [previewProgress, setPreviewProgress] = useState<number>(0);

  // File Inputs
  const audioInputRef = useRef<HTMLInputElement | null>(null);
  const customBgmInputRef = useRef<HTMLInputElement | null>(null);

  // Create voiceover audio object URL when selectedFile changes
  useEffect(() => {
    if (!selectedFile) {
      if (voiceoverAudioUrl) {
        URL.revokeObjectURL(voiceoverAudioUrl);
        setVoiceoverAudioUrl(null);
      }
      setIsVoiceoverPlaying(false);
      setVoiceoverCurrentTime(0);
      setVoiceoverDuration(0);
      return;
    }

    const url = URL.createObjectURL(selectedFile);
    setVoiceoverAudioUrl(url);

    const tempAudio = new Audio(url);
    tempAudio.onloadedmetadata = () => {
      setVoiceoverDuration(tempAudio.duration || 30);
    };

    return () => {
      URL.revokeObjectURL(url);
    };
  }, [selectedFile]);

  // Voiceover Audio Toggle
  const togglePlayVoiceover = () => {
    if (!voiceoverAudioRef.current) return;
    if (isVoiceoverPlaying) {
      voiceoverAudioRef.current.pause();
      setIsVoiceoverPlaying(false);
    } else {
      if (audioAuditionRef.current) {
        audioAuditionRef.current.pause();
        setPlayingTrackId(null);
      }
      voiceoverAudioRef.current.play().then(() => {
        setIsVoiceoverPlaying(true);
      }).catch(() => {});
    }
  };

  // Audio Audition Toggle for BGM
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

    if (voiceoverAudioRef.current && isVoiceoverPlaying) {
      voiceoverAudioRef.current.pause();
      setIsVoiceoverPlaying(false);
    }

    const audioUrl = `https://itnavideo-media-assets.s3.ap-south-1.amazonaws.com/${trackPath}`;
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
      if (voiceoverAudioRef.current) {
        voiceoverAudioRef.current.pause();
        voiceoverAudioRef.current = null;
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
          return prev + 1.2;
        });
      }, 100);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPlayingPreview]);

  // Words from editorial transcript for live drawing simulation
  const transcriptSentences = useMemo(() => {
    const raw = editorialTranscript?.trim();
    if (!raw) {
      return [
        "1. Start with daily 1% compounding actions",
        "2. Small habits eliminate wasted friction",
        "3. Exponential results after 365 days",
      ];
    }
    const lines = raw.split(/[.\n]+/).map((s) => s.trim()).filter(Boolean);
    return lines.slice(0, 3);
  }, [editorialTranscript]);

  const activeSentenceIndex = useMemo(() => {
    if (transcriptSentences.length === 0) return 0;
    const step = 100 / transcriptSentences.length;
    return Math.min(
      transcriptSentences.length - 1,
      Math.floor(previewProgress / step)
    );
  }, [previewProgress, transcriptSentences.length]);

  const selectedFontObj = useMemo(() => {
    return (
      WHITEBOARD_FONTS_CATALOG.find((f) => f.id === fontPersonality) ||
      WHITEBOARD_FONTS_CATALOG[0]
    );
  }, [fontPersonality]);

  const selectedMarkerObj = useMemo(() => {
    return (
      MARKER_COLOR_PALETTE.find((m) => m.id === markerColor) ||
      MARKER_COLOR_PALETTE[0]
    );
  }, [markerColor]);

  const selectedHandObj = useMemo(() => {
    return (
      HAND_DRAWING_STYLES.find((h) => h.id === handStyle) ||
      HAND_DRAWING_STYLES[0]
    );
  }, [handStyle]);

  // FIX: Editorial transcript is OPTIONAL. If voiceover audio is uploaded and preview confirmed, ready to render!
  const isReadyToRender =
    Boolean(selectedFile) &&
    previewConfirmed &&
    !isGenerating;

  const formatSeconds = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6">
      {/* Inject Google Handwriting Fonts for instant live browser rendering */}
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Architects+Daughter&family=Balsamiq+Sans:wght@700&family=Caveat:wght@700&family=Comic+Neue:wght@700&family=Gochi+Hand&family=Handlee&family=Indie+Flower&family=Kalam:wght@700&family=Permanent+Marker&family=Schoolbell&family=Shadows+Into+Light&display=swap"
      />

      {/* Top Banner: Crisp Clean White Aesthetic */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2.5 mb-1.5 flex-wrap">
              <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-xs font-semibold bg-orange-50 text-orange-600 border border-orange-200">
                <PenTool className="w-3.5 h-3.5" />
                9:16 Vertical • Whiteboard Explainer
              </span>
              <span className="text-xs text-slate-500 font-medium">
                Max 90s • 1 Flat Credit
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200">
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: selectedMarkerObj.hex }} />
                {selectedMarkerObj.name}
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200">
                <span>{selectedHandObj.icon}</span>
                {selectedHandObj.name.split(" ")[0]}
              </span>
            </div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
              Whiteboard Video Studio
            </h1>
            <p className="text-sm text-slate-600 mt-1 max-w-2xl">
              Turn voiceover narration into high-retention hand-drawn whiteboard animations. AI plans sequential scenes, sketches vector stickman drawings, and animates realistic marker strokes.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                setActiveTab("preview");
                setIsPlayingPreview(true);
              }}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 text-sm font-medium transition cursor-pointer"
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
        <div className="flex items-center gap-2 mt-6 border-b border-slate-100 pb-2 overflow-x-auto">
          {[
            { id: "media", label: "1. Narration & Waveform", icon: Layers, badge: selectedFile ? "Ready" : undefined },
            { id: "style", label: "2. Font, Color & Hand Style", icon: Palette, badge: selectedFontObj.name.split(" ")[0] },
            { id: "audio", label: "3. Music & SFX", icon: Music, badge: customBgmFile ? "Custom" : `${Math.round(bgmVolume * 100)}%` },
            { id: "preview", label: "4. Script & Preview Gate", icon: Eye, badge: previewConfirmed ? "Confirmed" : "Compulsory" },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition shrink-0 cursor-pointer ${
                  isActive
                    ? "bg-slate-900 text-white shadow-xs"
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
          {/* TAB 1: VOICEOVER NARRATION & AUDIO WAVEFORM */}
          {activeTab === "media" && (
            <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs space-y-6">
              {/* Topic Title */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Topic Title / Whiteboard Headline
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={topicTitle}
                    onChange={(e) => onTopicTitleChange(e.target.value)}
                    placeholder="e.g. Why You Should Save Money?"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition font-medium"
                  />
                  <Tag className="absolute right-3.5 top-3 w-4 h-4 text-slate-400" />
                </div>
                <p className="text-xs text-slate-500 mt-1.5">
                  Drawn at the top of the whiteboard with animated marker strokes.
                </p>
              </div>

              {/* Voiceover Upload */}
              <div className="border border-slate-200 rounded-xl p-5 bg-slate-50/50 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-orange-100 flex items-center justify-center text-orange-600 font-bold text-xs">
                      <Volume2 className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-slate-900">
                        Speech Voiceover Narration
                      </h3>
                      <p className="text-xs text-slate-500">
                        MP3, WAV, or MP4 speech audio driving whiteboard sketch timing
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
                  <div className="space-y-3">
                    <div className="relative flex items-center justify-between p-3.5 bg-white border border-slate-200 rounded-xl shadow-xs">
                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          onClick={togglePlayVoiceover}
                          className="w-10 h-10 rounded-lg bg-orange-500 hover:bg-orange-600 text-white flex items-center justify-center transition cursor-pointer shadow-xs"
                          title={isVoiceoverPlaying ? "Pause narration" : "Play narration"}
                        >
                          {isVoiceoverPlaying ? (
                            <Pause className="w-4 h-4" />
                          ) : (
                            <Play className="w-4 h-4 ml-0.5" />
                          )}
                        </button>
                        <div>
                          <p className="text-sm font-bold text-slate-800 line-clamp-1">
                            {selectedFile.name}
                          </p>
                          <p className="text-xs text-slate-500">
                            {(selectedFile.size / (1024 * 1024)).toFixed(1)} MB • {voiceoverDuration > 0 ? formatSeconds(voiceoverDuration) : "Ready"}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => onSelectFile(null)}
                        className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition cursor-pointer"
                        title="Remove file"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Interactive Audio Waveform Visualizer */}
                    <div className="p-3.5 bg-white border border-slate-200 rounded-xl space-y-2">
                      <div className="flex items-center justify-between text-xs text-slate-500">
                        <span className="flex items-center gap-1.5 font-semibold text-slate-700">
                          <Activity className="w-3.5 h-3.5 text-orange-500" />
                          Narration Audio Waveform
                        </span>
                        <span className="font-mono text-[11px] font-semibold text-slate-600">
                          {formatSeconds(voiceoverCurrentTime)} / {formatSeconds(voiceoverDuration)}
                        </span>
                      </div>

                      {/* Visual Waveform Bar Representation */}
                      <div className="flex items-center justify-between gap-1 h-9 px-2 py-1 bg-slate-50 border border-slate-100 rounded-lg">
                        {Array.from({ length: 36 }).map((_, barIdx) => {
                          const barProgress = (barIdx / 36) * 100;
                          const currentProgress = voiceoverDuration > 0 ? (voiceoverCurrentTime / voiceoverDuration) * 100 : 0;
                          const isPlayed = barProgress <= currentProgress;
                          // Simulated natural waveform bar heights
                          const waveHeight = [35, 60, 45, 80, 95, 65, 40, 85, 100, 75, 55, 90, 80, 60, 45, 70, 85, 100, 60, 45, 90, 75, 40, 65, 85, 50, 70, 95, 60, 40, 75, 90, 55, 40, 30, 20][barIdx % 36];

                          return (
                            <div
                              key={barIdx}
                              className="flex-1 rounded-full transition-all duration-150"
                              style={{
                                height: `${waveHeight}%`,
                                backgroundColor: isPlayed
                                  ? '#FF5722'
                                  : isVoiceoverPlaying
                                  ? '#CBD5E1'
                                  : '#E2E8F0',
                              }}
                            />
                          );
                        })}
                      </div>

                      {/* Hidden HTML5 Audio Element for playback */}
                      {voiceoverAudioUrl && (
                        <audio
                          ref={voiceoverAudioRef}
                          src={voiceoverAudioUrl}
                          onTimeUpdate={(e) => {
                            setVoiceoverCurrentTime(e.currentTarget.currentTime);
                          }}
                          onEnded={() => {
                            setIsVoiceoverPlaying(false);
                            setVoiceoverCurrentTime(0);
                          }}
                        />
                      )}
                    </div>
                  </div>
                ) : (
                  <div
                    onClick={() => audioInputRef.current?.click()}
                    className="border-2 border-dashed border-slate-300 hover:border-orange-400 bg-white rounded-xl p-8 text-center cursor-pointer transition"
                  >
                    <UploadCloud className="w-10 h-10 text-orange-500 mx-auto mb-2" />
                    <p className="text-sm font-bold text-slate-800">
                      Upload Narration Audio or Video
                    </p>
                    <p className="text-xs text-slate-500 mt-1">
                      MP3, WAV, M4A, or MP4 up to 90 seconds. Click to browse.
                    </p>
                  </div>
                )}
              </div>

              {/* Hand Drawing Highlight Banner */}
              <div className="border border-orange-200 bg-orange-50/50 rounded-xl p-4 flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-lg bg-orange-500 text-white flex items-center justify-center shrink-0 shadow-xs">
                  <Hand className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">
                    Real Photorealistic Human Hand (AWS S3)
                  </h4>
                  <p className="text-xs text-slate-600 mt-0.5">
                    Draws smoothly using authentic high-definition hand photography from AWS S3. You can toggle right-handed, left-handed, or pure drawing in Tab 2.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: FONT, MARKER COLOR & HAND DRAWING STYLE */}
          {activeTab === "style" && (
            <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs space-y-6">
              {/* Feature 1: Marker Ink Color Palette */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                      <Palette className="w-4 h-4 text-orange-500" />
                      Marker Ink Color Palette
                    </h3>
                    <p className="text-xs text-slate-500">
                      Choose the dry-erase marker ink color for drawings, bullet numbers, and underlines
                    </p>
                  </div>
                  <span
                    className="text-xs font-bold px-2.5 py-1 rounded-lg border"
                    style={{
                      color: selectedMarkerObj.hex,
                      backgroundColor: `${selectedMarkerObj.hex}14`,
                      borderColor: `${selectedMarkerObj.hex}33`,
                    }}
                  >
                    {selectedMarkerObj.name}
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {MARKER_COLOR_PALETTE.map((marker) => {
                    const isSelected = markerColor === marker.id;
                    return (
                      <div
                        key={marker.id}
                        onClick={() => onMarkerColorChange(marker.id)}
                        className={`p-3 rounded-xl border cursor-pointer transition flex items-center gap-2.5 ${
                          isSelected
                            ? "border-orange-500 bg-orange-50/30 ring-2 ring-orange-500/20 shadow-xs"
                            : "border-slate-200 hover:border-slate-300 bg-white"
                        }`}
                      >
                        <div
                          className="w-5 h-5 rounded-full shrink-0 border border-black/10 shadow-xs"
                          style={{ backgroundColor: marker.hex }}
                        />
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-slate-800 truncate">
                            {marker.name}
                          </p>
                          <p className="text-[10px] text-slate-500 truncate">
                            {marker.id === "auto" ? "Vibrant contrast" : marker.hex}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Feature 2: Hand Drawing Style & No-Hand Pure Draw */}
              <div className="pt-4 border-t border-slate-100">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                      <Hand className="w-4 h-4 text-orange-500" />
                      Hand Drawing Style
                    </h3>
                    <p className="text-xs text-slate-500">
                      Select hand orientation or enable Pure Draw (direct stroke animation without a hand)
                    </p>
                  </div>
                  <span className="text-xs font-bold text-slate-700 bg-slate-100 border border-slate-200 px-2.5 py-1 rounded-lg">
                    {selectedHandObj.badge}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  {HAND_DRAWING_STYLES.map((style) => {
                    const isSelected = handStyle === style.id;
                    return (
                      <div
                        key={style.id}
                        onClick={() => onHandStyleChange?.(style.id)}
                        className={`p-3.5 rounded-xl border cursor-pointer transition ${
                          isSelected
                            ? "border-orange-500 bg-orange-50/30 ring-2 ring-orange-500/20 shadow-xs"
                            : "border-slate-200 hover:border-slate-300 bg-white"
                        }`}
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-base">{style.icon}</span>
                          <span className="text-xs font-bold text-slate-800">
                            {style.name}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 leading-tight">
                          {style.desc}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Feature 3: Whiteboard Handwriting Font Catalog */}
              <div className="pt-4 border-t border-slate-100">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                      <Type className="w-4 h-4 text-orange-500" />
                      Whiteboard Handwriting Font
                    </h3>
                    <p className="text-xs text-slate-500">
                      12 natural whiteboard marker fonts rendered live in the browser
                    </p>
                  </div>
                  <span className="text-xs font-bold text-orange-600 bg-orange-50 border border-orange-200 px-2.5 py-1 rounded-lg">
                    {selectedFontObj.name}
                  </span>
                </div>

                {/* 12 Font Cards Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[360px] overflow-y-auto pr-1">
                  {WHITEBOARD_FONTS_CATALOG.map((font) => {
                    const isSelected = fontPersonality === font.id;
                    return (
                      <div
                        key={font.id}
                        onClick={() => onFontPersonalityChange(font.id)}
                        className={`p-3.5 rounded-xl border cursor-pointer transition relative ${
                          isSelected
                            ? "border-orange-500 bg-orange-50/30 ring-2 ring-orange-500/20 shadow-xs"
                            : "border-slate-200 hover:border-slate-300 bg-white"
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-bold text-slate-800">
                            {font.name}
                          </span>
                          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 uppercase">
                            {font.badge}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 mb-2">{font.desc}</p>
                        {/* Live Font Sample */}
                        <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center">
                          <span
                            className="text-sm text-slate-900 font-bold truncate"
                            style={{ fontFamily: font.cssFamily }}
                          >
                            {font.sample}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: AUDIO & SFX */}
          {activeTab === "audio" && (
            <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs space-y-6">
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  Audio & Sound Design
                </h3>
                <p className="text-xs text-slate-500">
                  Studio voiceover ducking keeps speech front-and-center above music
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

              {/* Marker SFX Toggle */}
              <div className="flex items-center justify-between p-4 rounded-xl border border-slate-200 bg-slate-50/50">
                <div className="flex items-center gap-2.5">
                  <Zap className="w-4 h-4 text-orange-500" />
                  <div>
                    <p className="text-xs font-bold text-slate-800">
                      Marker Writing & Paper Sound Effects (SFX)
                    </p>
                    <p className="text-xs text-slate-500">
                      Subtle marker squeaks while writing and paper swipe when advancing boards
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
                    className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 text-xs font-semibold text-slate-700 transition cursor-pointer"
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
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-[260px] overflow-y-auto pr-1">
                  {AWS_WHITEBOARD_BGM_TRACKS.map((track) => {
                    const isSelected = bgmTrackId === track.id;
                    const isPlaying = playingTrackId === track.id;
                    return (
                      <div
                        key={track.id}
                        onClick={() => onBgmTrackIdChange(track.id)}
                        className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition ${
                          isSelected
                            ? "border-orange-500 bg-orange-50/30 ring-1 ring-orange-500/30 shadow-xs"
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
                            className={`p-2 rounded-lg transition cursor-pointer ${
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
            <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs space-y-6">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <h3 className="text-sm font-bold text-slate-900">
                    Whiteboard Script Text (Optional)
                  </h3>
                  <span className="text-xs font-medium text-emerald-600 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">
                    Auto-Transcribe Active
                  </span>
                </div>
                <p className="text-xs text-slate-500">
                  Leave blank to let Groq Whisper transcribe automatically from your voiceover, or type your script here to fix brand names and punctuation.
                </p>
              </div>

              <div className="relative">
                <textarea
                  rows={5}
                  value={editorialTranscript}
                  onChange={(e) => onEditorialTranscriptChange(e.target.value)}
                  placeholder="Optional: Type or paste your spoken narration script here to guarantee 100% accurate spelling of names and technical terms..."
                  className="w-full p-4 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 font-mono transition"
                />
                <Edit3 className="absolute right-3.5 top-3.5 w-4 h-4 text-slate-400" />
              </div>

              {/* Compulsory Preview Confirmation Box */}
              <div
                onClick={() => setPreviewConfirmed(!previewConfirmed)}
                className={`p-4 rounded-xl border cursor-pointer transition flex items-start gap-3.5 ${
                  previewConfirmed
                    ? "border-emerald-500 bg-emerald-50/40"
                    : "border-amber-300 bg-amber-50/50"
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
                    Compulsory Review Check: I have reviewed the whiteboard settings
                  </p>
                  <p className="text-xs text-slate-600 mt-0.5">
                    Confirms you have verified your voiceover narration, handwriting font, and marker color before launching cloud render.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: 9:16 Vertical Live Visual Preview */}
        <div className="lg:col-span-5">
          <div className="sticky top-6 bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                <Tv className="w-3.5 h-3.5 text-orange-500" />
                9:16 Whiteboard Simulator
              </span>
              <button
                onClick={() => setIsPlayingPreview(!isPlayingPreview)}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-xs font-semibold text-slate-700 transition cursor-pointer"
              >
                {isPlayingPreview ? (
                  <>
                    <Pause className="w-3.5 h-3.5 text-orange-500" />
                    Pause
                  </>
                ) : (
                  <>
                    <Play className="w-3.5 h-3.5 text-orange-500" />
                    Draw Simulation
                  </>
                )}
              </button>
            </div>

            {/* 9:16 Vertical Pure Whiteboard Simulator with Stickman & Animated Drawing Tip */}
            <div className="relative mx-auto w-full max-w-[280px] aspect-[9/16] rounded-2xl overflow-hidden shadow-md border-4 border-slate-900 bg-white flex flex-col justify-between p-4">
              {/* WHITEBOARD HEADER */}
              <div className="text-center z-10 pt-2">
                <div
                  className="inline-block px-3 py-1 rounded-lg bg-slate-50 border border-slate-200 text-slate-900 font-bold text-xs max-w-[90%] truncate shadow-xs"
                  style={{ fontFamily: selectedFontObj.cssFamily }}
                >
                  {topicTitle.trim() || "WHY SAVE MONEY?"}
                </div>
                <div
                  className="w-16 h-1 mx-auto mt-2 rounded-full transition-all duration-300"
                  style={{ backgroundColor: selectedMarkerObj.hex }}
                />
              </div>

              {/* CENTER HERO ILLUSTRATION: STICKMAN / CONCEPT SKETCH */}
              <div className="relative my-auto z-10 flex flex-col items-center justify-center py-2">
                <svg
                  viewBox="0 0 100 100"
                  className="w-24 h-24 stroke-current transition-all duration-300"
                  style={{ color: selectedMarkerObj.hex }}
                  fill="none"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  {/* Authentic Stickman Figure */}
                  <circle cx="50" cy="22" r="12" />
                  <line x1="50" y1="34" x2="50" y2="65" />
                  <line x1="50" y1="45" x2="28" y2="35" />
                  <line x1="50" y1="45" x2="72" y2="35" />
                  <line x1="50" y1="65" x2="35" y2="92" />
                  <line x1="50" y1="65" x2="65" y2="92" />
                  {/* Floating Lightbulb idea */}
                  <path d="M 74 20 A 4 4 0 0 1 82 20 C 82 23 79 25 79 28 L 77 28" stroke="#F59E0B" strokeWidth="2.5" />
                </svg>

                <span
                  className="mt-1 text-[11px] font-bold text-slate-800 tracking-tight"
                  style={{ fontFamily: selectedFontObj.cssFamily }}
                >
                  Scene 1: Core Concept
                </span>
              </div>

              {/* DYNAMIC HAND-DRAWN POINTS */}
              <div className="space-y-2.5 z-10 px-1 mb-2">
                {transcriptSentences.map((sentence, idx) => {
                  const isDrawn = idx <= activeSentenceIndex;
                  return (
                    <div
                      key={idx}
                      className={`p-2.5 rounded-xl border transition-all duration-500 ${
                        isDrawn
                          ? "bg-slate-50/90 border-slate-200 opacity-100 translate-x-0 shadow-xs"
                          : "opacity-0 -translate-x-4 border-transparent"
                      }`}
                    >
                      <div className="flex items-center gap-1.5 mb-0.5">
                        <span
                          className="w-4 h-4 rounded-full text-white text-[9px] font-bold flex items-center justify-center shrink-0"
                          style={{ backgroundColor: selectedMarkerObj.hex }}
                        >
                          {idx + 1}
                        </span>
                        <span className="text-[9px] font-bold text-slate-600 uppercase tracking-wider">
                          Key Takeaway
                        </span>
                      </div>
                      <p
                        className="text-[11px] text-slate-900 font-bold line-clamp-2 leading-snug"
                        style={{ fontFamily: selectedFontObj.cssFamily }}
                      >
                        {sentence}
                      </p>
                    </div>
                  );
                })}
              </div>

              {/* REAL HAND MARKER PREVIEW BADGE */}
              <div className="z-10 flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-200 text-[10px]">
                <span className="font-bold text-slate-700 flex items-center gap-1.5">
                  <Hand className="w-3.5 h-3.5 text-orange-500" />
                  {selectedHandObj.name.split(" ")[0]} Hand
                </span>
                <span
                  className="font-bold truncate max-w-[110px]"
                  style={{ color: selectedMarkerObj.hex, fontFamily: selectedFontObj.cssFamily }}
                >
                  {selectedFontObj.name.split(" ")[0]}
                </span>
              </div>

              {/* ANIMATED MARKER PEN / HAND SKETCHING TIP (Active when simulation is playing) */}
              {isPlayingPreview && handStyle !== "none" && (
                <div
                  className="absolute z-30 pointer-events-none transition-all duration-300"
                  style={{
                    bottom: `${Math.min(75, Math.max(25, 25 + activeSentenceIndex * 22))}%`,
                    right: `${handStyle === "left" ? "auto" : "20px"}`,
                    left: `${handStyle === "left" ? "20px" : "auto"}`,
                    transform: handStyle === "left" ? "scaleX(-1) rotate(-15deg)" : "rotate(-15deg)",
                  }}
                >
                  <div className="flex items-center gap-1">
                    <span className="text-2xl drop-shadow-md animate-bounce">✍️</span>
                  </div>
                </div>
              )}

              {/* Live Scrubber Line */}
              <div className="absolute bottom-0 inset-x-0 h-1.5 bg-slate-100">
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
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                  ) : (
                    <AlertCircle className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  )}
                  <span className={selectedFile ? "text-slate-800 font-medium" : "text-slate-500"}>
                    Voiceover Audio Loaded {selectedFile && `(${(selectedFile.size / (1024 * 1024)).toFixed(1)}MB)`}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                  <span className="text-slate-800 font-medium">
                    {editorialTranscript?.trim().length > 0 ? "Custom Script Text Provided" : "Auto-Transcribe Active (Groq Cloud)"}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  {previewConfirmed ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                  ) : (
                    <AlertCircle className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                  )}
                  <span className={previewConfirmed ? "text-slate-800 font-medium" : "text-slate-500"}>
                    Visual Review Check Confirmed
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
