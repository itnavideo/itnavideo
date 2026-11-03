/* eslint-disable @next/next/no-img-element */
"use client";

import React, { useMemo, useState, useRef, useEffect } from "react";
import {
  Sparkles,
  Upload,
  Video,
  Film,
  Check,
  Loader2,
  Play,
  Pause,
  Layers,
  Music,
  Volume2,
  FileText,
  Eye,
  X,
  Lock,
  Wand2,
  Scissors,
  ZoomIn,
  Plus,
} from "lucide-react";
import { KINETIC_STYLES } from "@/lib/captions/kineticStyles";

// Master AWS S3 Production Background Music Library (13+ Curated Tracks)
export const AWS_POLISHER_BGM_TRACKS = [
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
  { id: "none", label: "No Background Music", category: "Mute", path: "none", desc: "Pure video audio only" },
];

export interface UploadedMediaItem {
  id: string;
  file: File;
  type: "video" | "image";
  previewUrl: string;
  name: string;
  size: number;
}

export interface UploadedLayerItem {
  id: string;
  file: File;
  type: "image" | "video";
  previewUrl: string;
  name: string;
  title: string;
}

export interface AiVideoPolisherStudioProps {
  primaryMediaList: UploadedMediaItem[];
  onPrimaryMediaListChange: (items: UploadedMediaItem[]) => void;

  overlayLayerList: UploadedLayerItem[];
  onOverlayLayerListChange: (items: UploadedLayerItem[]) => void;

  videoTitle: string;
  onVideoTitleChange: (val: string) => void;

  silenceJumpCuts: boolean;
  onSilenceJumpCutsChange: (val: boolean) => void;

  smartPunchIns: boolean;
  onSmartPunchInsChange: (val: boolean) => void;

  captionStyle: string;
  onCaptionStyleChange: (val: string) => void;

  bgmTrackId: string;
  onBgmTrackIdChange: (val: string) => void;

  bgmVolume: number;
  onBgmVolumeChange: (val: number) => void;

  customBgmFile: File | null;
  onCustomBgmFileSelect: (file: File | null) => void;

  enableSfx: boolean;
  onEnableSfxChange: (val: boolean) => void;

  editorialTranscript: string;
  onEditorialTranscriptChange: (val: string) => void;

  onGenerate: () => void;
  isGenerating: boolean;
}

export function AiVideoPolisherStudio({
  primaryMediaList = [],
  onPrimaryMediaListChange,
  overlayLayerList = [],
  onOverlayLayerListChange,
  videoTitle = "",
  onVideoTitleChange,
  silenceJumpCuts = true,
  onSilenceJumpCutsChange,
  smartPunchIns = true,
  onSmartPunchInsChange,
  captionStyle = "Pop Word",
  onCaptionStyleChange,
  bgmTrackId = "parasail",
  onBgmTrackIdChange,
  bgmVolume = 0.12,
  onBgmVolumeChange,
  customBgmFile = null,
  onCustomBgmFileSelect,
  enableSfx = true,
  onEnableSfxChange,
  editorialTranscript = "",
  onEditorialTranscriptChange,
  onGenerate,
  isGenerating,
}: AiVideoPolisherStudioProps) {
  // Caption categories tab
  const [captionCategoryTab, setCaptionCategoryTab] = useState<string>("All");

  const filteredCaptionStyles = useMemo(() => {
    if (captionCategoryTab === "All") return KINETIC_STYLES;
    return KINETIC_STYLES.filter((s) => s.category === captionCategoryTab);
  }, [captionCategoryTab]);

  // Audio audition state
  const [auditioningTrack, setAuditioningTrack] = useState<string | null>(null);
  const audioAuditionRef = useRef<HTMLAudioElement | null>(null);

  const toggleAudition = (track: typeof AWS_POLISHER_BGM_TRACKS[0]) => {
    if (track.path === "none") return;
    if (auditioningTrack === track.id) {
      if (audioAuditionRef.current) {
        audioAuditionRef.current.pause();
        audioAuditionRef.current = null;
      }
      setAuditioningTrack(null);
    } else {
      if (audioAuditionRef.current) {
        audioAuditionRef.current.pause();
      }
      const audio = new Audio(`https://itnavideo-media-assets.s3.ap-south-1.amazonaws.com/${track.path}`);
      audio.volume = Math.max(0.05, Math.min(1, bgmVolume * 2));
      audio.play().catch(() => {});
      audio.onended = () => setAuditioningTrack(null);
      audioAuditionRef.current = audio;
      setAuditioningTrack(track.id);
    }
  };

  useEffect(() => {
    return () => {
      if (audioAuditionRef.current) {
        audioAuditionRef.current.pause();
        audioAuditionRef.current = null;
      }
    };
  }, []);

  // Primary media handlers
  const handlePrimaryMediaSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const newItems: UploadedMediaItem[] = Array.from(files).map((f: File): UploadedMediaItem => ({
      id: `media-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      file: f,
      type: (f.type.startsWith("image/") ? "image" : "video") as "image" | "video",
      previewUrl: URL.createObjectURL(f),
      name: f.name,
      size: f.size,
    }));

    onPrimaryMediaListChange([...primaryMediaList, ...newItems]);
    if (e.target) e.target.value = "";
  };

  const removePrimaryMedia = (id: string) => {
    onPrimaryMediaListChange(primaryMediaList.filter((m) => m.id !== id));
  };

  // Overlay layer handlers (PIP callouts)
  const handleLayerSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const newLayers: UploadedLayerItem[] = Array.from(files).map((f: File): UploadedLayerItem => ({
      id: `layer-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      file: f,
      type: (f.type.startsWith("video/") ? "video" : "image") as "image" | "video",
      previewUrl: URL.createObjectURL(f),
      name: f.name,
      title: f.name.replace(/\.[^/.]+$/, ""),
    }));

    onOverlayLayerListChange([...overlayLayerList, ...newLayers]);
    if (e.target) e.target.value = "";
  };

  const removeLayerItem = (id: string) => {
    onOverlayLayerListChange(overlayLayerList.filter((l) => l.id !== id));
  };

  // Compulsory preview confirmation gate
  const [previewConfirmed, setPreviewConfirmed] = useState<boolean>(false);

  const activePrimary = primaryMediaList[0];
  const activeOverlay = overlayLayerList[0];
  const hasMedia = primaryMediaList.length > 0;

  return (
    <div className="w-full space-y-8">
      {/* Top Banner: Crisp White Header */}
      <div className="rounded-[28px] border border-slate-200 bg-white p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-3.5 py-1 text-xs font-bold text-blue-700">
              <Film size={13} className="text-blue-600" />
              <span>16:9 Widescreen Only • AI YouTube Video Co-Pilot</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 font-sans">
              AI YouTube Video Polisher
            </h1>
            <p className="text-sm text-slate-500 leading-relaxed max-w-2xl">
              Turn raw talking videos and multi-take shoots into professional, engaging YouTube widescreen videos. Auto-trims dead silence, applies dynamic +12% camera punch-in zooms, adds floating picture-in-picture callout layers, and styles phrase-based captions with 12% ducked music.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-right">
              <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">Duration &amp; Cost</span>
              <span className="text-base font-black text-slate-900">Up to 5 Min • 1 Min = 1 Cr</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Studio Grid: Left Controls (7 cols) | Right 16:9 Live Preview (5 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Form Controls */}
        <div className="lg:col-span-7 space-y-6">

          {/* Section 0: Project Title */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-3">
            <label className="text-xs font-black text-slate-900 uppercase tracking-wider block">
              Project Title (Optional)
            </label>
            <input
              type="text"
              value={videoTitle}
              onChange={(e) => onVideoTitleChange(e.target.value)}
              placeholder="e.g., My YouTube Tutorial Video..."
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 text-xs font-medium focus:bg-white focus:border-blue-500 focus:outline-none transition shadow-2xs"
            />
          </div>

          {/* Section 1: Primary Full-Screen 16:9 Media */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-blue-600 border border-blue-100">
                  <Film size={18} />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900 font-sans">1. Primary 16:9 Full-Screen Media</h3>
                  <p className="text-xs text-slate-500">Main widescreen video footage or sequential shoot takes</p>
                </div>
              </div>

              <span className="text-xs font-bold text-slate-600 bg-slate-100 px-2.5 py-1 rounded-full">
                {primaryMediaList.length} Clip{primaryMediaList.length !== 1 ? "s" : ""}
              </span>
            </div>

            {/* Upload Area */}
            <label className="relative flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-300 hover:border-blue-500 bg-slate-50 hover:bg-blue-50/20 p-6 text-center transition cursor-pointer">
              <input
                type="file"
                multiple
                accept="video/mp4,video/quicktime,video/webm,image/png,image/jpeg"
                onChange={handlePrimaryMediaSelect}
                className="hidden"
              />
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-white border border-slate-200 shadow-xs text-blue-600 mb-2">
                <Upload size={18} />
              </div>
              <p className="text-xs font-bold text-slate-800">
                Drop raw 16:9 widescreen video takes here, or <span className="text-blue-600 underline">browse</span>
              </p>
              <p className="text-[11px] text-slate-400 mt-0.5">Supports multi-take shoots up to 5 minutes total (1920×1080 MP4)</p>
            </label>

            {/* List of uploaded primary clips */}
            {primaryMediaList.length > 0 && (
              <div className="space-y-2 pt-2">
                {primaryMediaList.map((item, idx) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50/80 p-3"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-600 text-white text-[11px] font-black shrink-0">
                        {idx + 1}
                      </span>
                      {item.type === "video" ? (
                        <div className="h-10 w-16 rounded-md bg-black overflow-hidden shrink-0">
                          <video src={item.previewUrl} className="h-full w-full object-cover" muted />
                        </div>
                      ) : (
                        <div className="h-10 w-16 rounded-md bg-slate-200 overflow-hidden shrink-0">
                          <img src={item.previewUrl} alt={item.name} className="h-full w-full object-cover" />
                        </div>
                      )}
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-slate-900 truncate">{item.name}</p>
                        <p className="text-[10px] text-slate-500">{(item.size / (1024 * 1024)).toFixed(1)} MB</p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => removePrimaryMedia(item.id)}
                      className="p-1.5 rounded-lg border border-slate-200 bg-white text-slate-500 hover:text-red-600 hover:border-red-200 transition cursor-pointer"
                      title="Remove clip"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Section 2: Overlay Layers (Picture-in-Picture Callouts) */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-purple-50 text-purple-600 border border-purple-100">
                  <Layers size={18} />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900 font-sans">2. Overlay Layers (Picture-in-Picture)</h3>
                  <p className="text-xs text-slate-500">Floating callouts, product screenshots, or secondary reaction videos</p>
                </div>
              </div>

              <span className="text-xs font-bold text-slate-600 bg-slate-100 px-2.5 py-1 rounded-full">
                {overlayLayerList.length} Layer{overlayLayerList.length !== 1 ? "s" : ""}
              </span>
            </div>

            {/* Layer Upload Area */}
            <label className="relative flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-300 hover:border-purple-500 bg-slate-50 hover:bg-purple-50/20 p-5 text-center transition cursor-pointer">
              <input
                type="file"
                multiple
                accept="image/png,image/jpeg,image/webp,video/mp4"
                onChange={handleLayerSelect}
                className="hidden"
              />
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white border border-slate-200 shadow-xs text-purple-600 mb-1.5">
                <Plus size={17} />
              </div>
              <p className="text-xs font-bold text-slate-800">
                Add PIP overlay layers (Images or Videos)
              </p>
              <p className="text-[11px] text-slate-400">Appears floating in upper-right or corner</p>
            </label>

            {/* List of uploaded layers */}
            {overlayLayerList.length > 0 && (
              <div className="space-y-2 pt-1">
                {overlayLayerList.map((layer, idx) => (
                  <div
                    key={layer.id}
                    className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50/80 p-3"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-purple-600 text-white text-[11px] font-black shrink-0">
                        L{idx + 1}
                      </span>
                      {layer.type === "video" ? (
                        <div className="h-10 w-16 rounded-md bg-black overflow-hidden shrink-0">
                          <video src={layer.previewUrl} className="h-full w-full object-cover" muted />
                        </div>
                      ) : (
                        <div className="h-10 w-16 rounded-md bg-slate-200 overflow-hidden shrink-0">
                          <img src={layer.previewUrl} alt={layer.name} className="h-full w-full object-cover" />
                        </div>
                      )}
                      <div className="min-w-0">
                        <input
                          type="text"
                          value={layer.title}
                          onChange={(e) => {
                            const updated = overlayLayerList.map((l) =>
                              l.id === layer.id ? { ...l, title: e.target.value } : l
                            );
                            onOverlayLayerListChange(updated);
                          }}
                          placeholder="Overlay label..."
                          className="text-xs font-bold text-slate-900 bg-transparent border-b border-transparent hover:border-slate-300 focus:border-purple-500 focus:outline-none truncate w-full"
                        />
                        <p className="text-[10px] text-purple-700 font-semibold">Picture-in-Picture Callout</p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => removeLayerItem(layer.id)}
                      className="p-1.5 rounded-lg border border-slate-200 bg-white text-slate-500 hover:text-red-600 hover:border-red-200 transition cursor-pointer"
                      title="Remove layer"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Section 3: Smart AI Editing Toggles */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-blue-600 border border-blue-100">
                <Scissors size={18} />
              </div>
              <div>
                <h3 className="text-base font-black text-slate-900 font-sans">3. Smart AI Editing Toggles</h3>
                <p className="text-xs text-slate-500">Silence removal, jump-cuts, and camera punch-in zoom</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Silence & Gap Cutter Toggle */}
              <label className="flex items-start gap-3 rounded-xl border border-slate-200 bg-slate-50 p-4 cursor-pointer hover:bg-blue-50/20 transition">
                <input
                  type="checkbox"
                  checked={silenceJumpCuts}
                  onChange={(e) => onSilenceJumpCutsChange(e.target.checked)}
                  className="mt-0.5 rounded border-slate-300 text-blue-600 focus:ring-blue-500 h-4 w-4"
                />
                <div>
                  <span className="text-xs font-black text-slate-900 block">Auto Silence &amp; Gap Cutter</span>
                  <span className="text-[11px] text-slate-500 leading-snug block mt-0.5">
                    Trims breath pauses and dead air for crisp modern YouTube pacing.
                  </span>
                </div>
              </label>

              {/* Smart Camera Punch-In Toggle */}
              <label className="flex items-start gap-3 rounded-xl border border-slate-200 bg-slate-50 p-4 cursor-pointer hover:bg-blue-50/20 transition">
                <input
                  type="checkbox"
                  checked={smartPunchIns}
                  onChange={(e) => onSmartPunchInsChange(e.target.checked)}
                  className="mt-0.5 rounded border-slate-300 text-blue-600 focus:ring-blue-500 h-4 w-4"
                />
                <div>
                  <span className="text-xs font-black text-slate-900 block">Smart Camera Punch-Ins</span>
                  <span className="text-[11px] text-slate-500 leading-snug block mt-0.5">
                    Dynamic +12% zoom cuts on alternating sentence beats to keep viewer focus.
                  </span>
                </div>
              </label>
            </div>
          </div>

          {/* Section 4: 50 Phrase-Based Caption Styles */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-blue-600 border border-blue-100">
                  <Wand2 size={18} />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900 font-sans">4. 50 Caption Styles</h3>
                  <p className="text-xs text-slate-500">Widescreen phrase-based subtitle styling for YouTube</p>
                </div>
              </div>

              <span className="text-[11px] font-bold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full border border-blue-200">
                Active: {captionStyle}
              </span>
            </div>

            {/* Category Filter Tabs */}
            <div className="flex flex-wrap gap-1.5 border-b border-slate-100 pb-2">
              {["All", "Single Word", "Line Captions", "Stacks", "Typewriter", "Editorial"].map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setCaptionCategoryTab(tab)}
                  className={`px-3 py-1 rounded-full text-xs font-bold transition cursor-pointer ${
                    captionCategoryTab === tab
                      ? "bg-slate-900 text-white shadow-2xs"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* 50 Styles Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 max-h-72 overflow-y-auto pr-1">
              {filteredCaptionStyles.map((style) => {
                const isSelected = captionStyle === style.name;
                return (
                  <button
                    key={style.id}
                    type="button"
                    onClick={() => onCaptionStyleChange(style.name)}
                    className={`flex flex-col items-start justify-between rounded-xl border p-3 text-left transition relative cursor-pointer ${
                      isSelected
                        ? "border-blue-500 bg-blue-50/40 ring-2 ring-blue-500/20"
                        : "border-slate-200 bg-slate-50 hover:bg-white hover:border-slate-300"
                    }`}
                  >
                    <span className="text-xs font-black text-slate-900 leading-tight">{style.name}</span>
                    <div className="mt-2 flex items-center justify-between w-full">
                      <span className="text-[10px] font-semibold text-slate-500 uppercase">{style.category}</span>
                      {isSelected && <Check size={13} className="text-blue-600 stroke-[3]" />}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section 5: Background Music & Audio Level (12% Default) */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-blue-600 border border-blue-100">
                  <Music size={18} />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900 font-sans">5. Background Music &amp; Audio Level</h3>
                  <p className="text-xs text-slate-500">13+ cloud tracks ducked to 12% so voiceover stays completely clear</p>
                </div>
              </div>

              {/* SFX Toggle */}
              <label className="flex items-center gap-2 cursor-pointer bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200">
                <input
                  type="checkbox"
                  checked={enableSfx}
                  onChange={(e) => onEnableSfxChange(e.target.checked)}
                  className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 h-3.5 w-3.5"
                />
                <span className="text-xs font-bold text-slate-700">SFX Whooshes &amp; Pops</span>
              </label>
            </div>

            {/* Volume Slider */}
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-700 flex items-center gap-1.5">
                  <Volume2 size={15} className="text-blue-600" />
                  Background Music Volume
                </span>
                <span className="font-black text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-200">
                  {Math.round(bgmVolume * 100)}% (12% Default)
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="0.4"
                step="0.01"
                value={bgmVolume}
                onChange={(e) => onBgmVolumeChange(parseFloat(e.target.value))}
                className="w-full accent-blue-600 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400 font-semibold">
                <span>0% (Muted)</span>
                <span className="text-blue-600 font-bold">12% Voice Safe</span>
                <span>40% Loud</span>
              </div>
            </div>

            {/* Curated BGM Library */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-60 overflow-y-auto pr-1">
              {AWS_POLISHER_BGM_TRACKS.map((track) => {
                const isSelected = bgmTrackId === track.id;
                const isPlaying = auditioningTrack === track.id;

                return (
                  <div
                    key={track.id}
                    className={`flex items-center justify-between rounded-xl border p-2.5 transition ${
                      isSelected
                        ? "border-blue-500 bg-blue-50/40 ring-1 ring-blue-500/20"
                        : "border-slate-200 bg-slate-50 hover:bg-white"
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => onBgmTrackIdChange(track.id)}
                      className="text-left min-w-0 flex-1 mr-2 cursor-pointer"
                    >
                      <p className="text-xs font-bold text-slate-900 truncate">{track.label}</p>
                      <p className="text-[10px] text-slate-500 truncate">{track.desc}</p>
                    </button>

                    {track.path !== "none" && (
                      <button
                        type="button"
                        onClick={() => toggleAudition(track)}
                        className={`p-1.5 rounded-lg border transition shrink-0 cursor-pointer ${
                          isPlaying
                            ? "bg-blue-600 text-white border-blue-700 animate-pulse"
                            : "bg-white text-slate-600 border-slate-200 hover:text-slate-900"
                        }`}
                        title={isPlaying ? "Pause preview" : "Play preview"}
                      >
                        {isPlaying ? <Pause size={13} /> : <Play size={13} />}
                      </button>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Custom BGM Upload */}
            <div className="pt-1">
              <label className="text-xs font-bold text-slate-700 block mb-1.5">Or Upload Custom Background Music</label>
              <div className="flex items-center gap-3">
                <label className="flex items-center gap-2 px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 hover:bg-white text-xs font-bold text-slate-700 cursor-pointer transition shadow-2xs">
                  <Upload size={14} className="text-blue-600" />
                  <span>Choose MP3 / WAV</span>
                  <input
                    type="file"
                    accept="audio/mp3,audio/wav,audio/mpeg"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) onCustomBgmFileSelect(file);
                    }}
                    className="hidden"
                  />
                </label>
                {customBgmFile && (
                  <span className="text-xs font-semibold text-emerald-700 truncate max-w-xs">
                    ✓ {customBgmFile.name}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Section 6: Spoken Narration Editorial Transcript Editor */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-blue-600 border border-blue-100">
                  <FileText size={18} />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900 font-sans">6. Editorial Transcript Editor</h3>
                  <p className="text-xs text-slate-500">Correct any speech transcription spelling mistakes before rendering</p>
                </div>
              </div>
            </div>

            <textarea
              rows={3}
              value={editorialTranscript}
              onChange={(e) => onEditorialTranscriptChange(e.target.value)}
              placeholder="Paste or review the spoken dialogue text here to fix typos, technical keywords, or brand names..."
              className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 text-xs font-mono focus:bg-white focus:border-blue-500 focus:outline-none transition leading-relaxed shadow-2xs"
            />
          </div>
        </div>

        {/* Right Column: Compulsory 16:9 Live Widescreen Preview Simulator & Gate */}
        <div className="lg:col-span-5 lg:sticky lg:top-24 space-y-5">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Eye size={16} className="text-blue-600" />
                <h3 className="text-sm font-black text-slate-900 font-sans">Compulsory 16:9 Player Preview</h3>
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
                Interactive Mockup
              </span>
            </div>

            {/* 16:9 Widescreen Canvas Simulator */}
            <div className="relative mx-auto w-full aspect-video rounded-2xl border-[4px] border-slate-900 bg-slate-950 overflow-hidden shadow-2xl flex flex-col justify-between p-3.5">
              {/* Main Full-Screen Media */}
              {activePrimary ? (
                activePrimary.type === "video" ? (
                  <video
                    src={activePrimary.previewUrl}
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="absolute inset-0 h-full w-full object-cover scale-105 transition-transform duration-500"
                  />
                ) : (
                  <img
                    src={activePrimary.previewUrl}
                    alt="Preview"
                    className="absolute inset-0 h-full w-full object-cover scale-105"
                  />
                )
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-500 gap-1.5 bg-radial from-slate-900 via-slate-950 to-black">
                  <Film size={32} className="text-blue-500" />
                  <span className="text-xs font-bold text-slate-400">16:9 YouTube Screen</span>
                  <span className="text-[10px] text-slate-600">Upload primary widescreen clips on left</span>
                </div>
              )}

              {/* Status Badges: Smart Zoom + Silence Jump-Cut */}
              <div className="relative z-10 flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  {smartPunchIns && (
                    <span className="flex items-center gap-1 bg-black/75 backdrop-blur-md text-blue-400 px-2 py-0.5 rounded-md text-[8px] font-black border border-blue-500/30 uppercase">
                      <ZoomIn size={10} />
                      +12% ZOOM
                    </span>
                  )}
                  {silenceJumpCuts && (
                    <span className="flex items-center gap-1 bg-black/75 backdrop-blur-md text-emerald-400 px-2 py-0.5 rounded-md text-[8px] font-black border border-emerald-500/30 uppercase">
                      <Scissors size={10} />
                      GAP CUTTER
                    </span>
                  )}
                </div>
              </div>

              {/* Floating Picture-in-Picture (Overlay Layer) in Upper-Right */}
              {activeOverlay && (
                <div className="absolute top-4 right-4 z-20 w-32 aspect-video rounded-xl overflow-hidden border-2 border-white/60 shadow-xl bg-slate-900">
                  {activeOverlay.type === "video" ? (
                    <video src={activeOverlay.previewUrl} autoPlay loop muted playsInline className="h-full w-full object-cover" />
                  ) : (
                    <img src={activeOverlay.previewUrl} alt={activeOverlay.title} className="h-full w-full object-cover" />
                  )}
                  {activeOverlay.title && (
                    <div className="absolute bottom-0 inset-x-0 bg-black/75 px-1 py-0.5 text-[7px] font-bold text-white truncate">
                      {activeOverlay.title}
                    </div>
                  )}
                </div>
              )}

              {/* Lower-Third 16:9 Caption Mockup */}
              <div className="relative z-10 flex justify-center mb-2">
                <div className="bg-black/85 backdrop-blur-md border border-blue-500/60 rounded-xl px-4 py-1.5 text-center shadow-lg max-w-[85%]">
                  <span className="text-xs font-black text-white tracking-tight">
                    [{captionStyle}] WIDESCREEN YOUTUBE CAPTIONS
                  </span>
                </div>
              </div>
            </div>

            {/* Compulsory Review Checkbox Gate */}
            <div className="rounded-xl border border-amber-200 bg-amber-50/60 p-3.5 space-y-2">
              <label className="flex items-start gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={previewConfirmed}
                  onChange={(e) => setPreviewConfirmed(e.target.checked)}
                  className="mt-0.5 rounded border-amber-400 text-blue-600 focus:ring-blue-500 h-4 w-4"
                />
                <span className="text-xs font-bold text-amber-950 leading-tight">
                  I have reviewed this 16:9 widescreen preview and approve generating the final render.
                </span>
              </label>
              <p className="text-[11px] text-amber-700 pl-6">
                Preview confirmation is compulsory before cloud rendering to avoid wasting credits.
              </p>
            </div>

            {/* Primary Action Button */}
            <button
              type="button"
              onClick={onGenerate}
              disabled={!hasMedia || !previewConfirmed || isGenerating}
              className={`w-full py-4 px-6 rounded-xl text-sm font-black transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md ${
                hasMedia && previewConfirmed && !isGenerating
                  ? "bg-blue-600 hover:bg-blue-700 text-white active:scale-[0.99] shadow-blue-500/25"
                  : "bg-slate-200 text-slate-400 cursor-not-allowed border border-slate-300"
              }`}
            >
              {isGenerating ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  <span>Submitting Polisher Render Job...</span>
                </>
              ) : !previewConfirmed ? (
                <>
                  <Lock size={15} />
                  <span>Confirm Preview Above to Unlock</span>
                </>
              ) : !hasMedia ? (
                <>
                  <Video size={15} />
                  <span>Upload Raw 16:9 Video to Render</span>
                </>
              ) : (
                <>
                  <Sparkles size={16} />
                  <span>Render 16:9 Video (1 Min = 1 Cr)</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
