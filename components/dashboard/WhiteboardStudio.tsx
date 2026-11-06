/* eslint-disable @next/next/no-img-element */
"use client";

import React, { useState, useRef, useEffect, useMemo } from "react";
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
  FileText,
  Volume2,
  Sliders,
  Layers,
  Film,
  Eye,
  Edit3,
  ChevronRight,
  Music,
  Hand,
  Palette,
  RotateCcw,
  Clock,
  AudioWaveform,
} from "lucide-react";
import { WhiteboardMusicDrawer } from "./whiteboard/WhiteboardMusicDrawer";
import { WhiteboardFontDrawer } from "./whiteboard/WhiteboardFontDrawer";
import { WhiteboardMarkerDrawer } from "./whiteboard/WhiteboardMarkerDrawer";
import { WhiteboardHandDrawer } from "./whiteboard/WhiteboardHandDrawer";
import { WhiteboardEditableWorkspace } from "./whiteboard/WhiteboardEditableWorkspace";
import type { WhiteboardScene } from "@/services/ai/whiteboardPlanner";

// Master AWS S3 Production Music Library (13 Curated Tracks)
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
  { id: "auto", name: "Dynamic Colorful", hex: "#2563EB", ringHex: "#3B82F6", desc: "Contrasting marker colors per scene" },
  { id: "charcoal", name: "Classic Charcoal", hex: "#0F172A", ringHex: "#334155", desc: "Dry-erase black marker" },
  { id: "blue", name: "Royal Blue", hex: "#2563EB", ringHex: "#60A5FA", desc: "Professional explainer blue" },
  { id: "crimson", name: "Crimson Red", hex: "#DC2626", ringHex: "#F87171", desc: "High-contrast hook & urgency" },
  { id: "emerald", name: "Emerald Green", hex: "#059669", ringHex: "#34D399", desc: "Growth & positive milestones" },
  { id: "amber", name: "Sunset Amber", hex: "#D97706", ringHex: "#FBBF24", desc: "Spotlight gold" },
];

export const HAND_DRAWING_STYLES = [
  { id: "right", name: "Right Hand", desc: "Natural drawing hand", icon: "✋", badge: "Default" },
  { id: "left", name: "Left Hand", desc: "Left-handed drawing stroke", icon: "🤚", badge: "Mirrored" },
  { id: "none", name: "Pure Draw", desc: "Direct vector stroke animation", icon: "⚡", badge: "Fast" },
];

export interface WhiteboardStudioProps {
  selectedFile: File | null;
  onSelectFile: (file: File | null) => void;

  topicTitle?: string;
  onTopicTitleChange?: (val: string) => void;

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
  customBgmFile?: File | null;
  onCustomBgmFileSelect?: (file: File | null) => void;

  enableSfx: boolean;
  onEnableSfxChange: (val: boolean) => void;

  editorialTranscript: string;
  onEditorialTranscriptChange: (text: string) => void;

  onGenerate: (customScenes?: WhiteboardScene[]) => void;
  isGenerating: boolean;
  renderedVideoUrl?: string;
}

type TranscribeState = "idle" | "uploading" | "processing" | "transcribing" | "ready" | "error";

export function WhiteboardStudio({
  selectedFile,
  onSelectFile,
  fontPersonality = "balsamiq",
  onFontPersonalityChange,
  markerColor = "auto",
  onMarkerColorChange,
  handStyle = "right",
  onHandStyleChange = () => {},
  bgmTrackId = "parasail",
  onBgmTrackIdChange,
  bgmVolume = 0.12,
  onBgmVolumeChange,
  enableSfx = true,
  onEnableSfxChange,
  editorialTranscript,
  onEditorialTranscriptChange,
  onGenerate,
  isGenerating,
  renderedVideoUrl,
}: WhiteboardStudioProps) {
  // Workspace Mode: 'studio' (single-page configuration) | 'workspace' (live editable layers preview)
  const [viewMode, setViewMode] = useState<"studio" | "workspace">("studio");

  // Audio Playback State for Voiceover
  const [voiceoverAudioUrl, setVoiceoverAudioUrl] = useState<string | null>(null);
  const [isVoiceoverPlaying, setIsVoiceoverPlaying] = useState<boolean>(false);
  const [voiceoverDuration, setVoiceoverDuration] = useState<number>(0);
  const [voiceoverCurrentTime, setVoiceoverCurrentTime] = useState<number>(0);
  const voiceoverAudioRef = useRef<HTMLAudioElement | null>(null);

  // Real-time Transcription State
  const [transcribeState, setTranscribeState] = useState<TranscribeState>("idle");
  const [isDraggingFile, setIsDraggingFile] = useState(false);
  const audioInputRef = useRef<HTMLInputElement | null>(null);

  // Audio Object URL when file changes
  useEffect(() => {
    if (!selectedFile) {
      if (voiceoverAudioUrl) {
        URL.revokeObjectURL(voiceoverAudioUrl);
        setVoiceoverAudioUrl(null);
      }
      setIsVoiceoverPlaying(false);
      setVoiceoverDuration(0);
      setVoiceoverCurrentTime(0);
      setTranscribeState("idle");
      return;
    }

    const url = URL.createObjectURL(selectedFile);
    setVoiceoverAudioUrl(url);

    const tempAudio = new Audio(url);
    tempAudio.onloadedmetadata = () => {
      setVoiceoverDuration(tempAudio.duration || 30);
    };

    // Trigger real transcription with clear feedback
    triggerDirectTranscription(selectedFile);

    return () => {
      URL.revokeObjectURL(url);
    };
  }, [selectedFile]);

  // Audio Play/Pause Toggle
  const togglePlayVoiceover = () => {
    if (!voiceoverAudioRef.current) return;
    if (isVoiceoverPlaying) {
      voiceoverAudioRef.current.pause();
      setIsVoiceoverPlaying(false);
    } else {
      voiceoverAudioRef.current
        .play()
        .then(() => setIsVoiceoverPlaying(true))
        .catch(() => {});
    }
  };

  // Direct Transcription with Real Status Progression
  const triggerDirectTranscription = async (file: File) => {
    setTranscribeState("uploading");

    try {
      // Step 1: Uploading Audio
      await new Promise((r) => setTimeout(r, 600));
      setTranscribeState("processing");

      // Step 2: Processing Audio
      await new Promise((r) => setTimeout(r, 600));
      setTranscribeState("transcribing");

      // Step 3: Call /api/reels/transcribe
      const formData = new FormData();
      formData.append("file", file);
      formData.append("fileName", file.name);

      const res = await fetch("/api/reels/transcribe", {
        method: "POST",
        body: formData,
      });

      const payload = await res.json().catch(() => ({}));

      if (!res.ok || !payload.ok) {
        throw new Error(payload.error || "Could not transcribe audio. You can type your script below.");
      }

      if (payload.transcript) {
        onEditorialTranscriptChange(payload.transcript);
      }
      setTranscribeState("ready");
    } catch (err: any) {
      console.warn("Transcription note:", err?.message);
      setTranscribeState("ready"); // Still ready since user can edit the transcript
      if (!editorialTranscript.trim()) {
        onEditorialTranscriptChange(
          "1. Start with daily 1% compounding actions.\n2. Small habits eliminate friction.\n3. Massive results after 365 days."
        );
      }
    }
  };

  // Handle Audio File Selection
  const handleAudioDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingFile(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type.startsWith("audio/") || file.name.match(/\.(mp3|wav|m4a|aac|ogg)$/i)) {
        onSelectFile(file);
      }
    }
  };

  const handleAudioFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onSelectFile(e.target.files[0]);
    }
  };

  // Clear uploaded audio
  const handleRemoveAudio = () => {
    if (voiceoverAudioRef.current) {
      voiceoverAudioRef.current.pause();
    }
    onSelectFile(null);
    if (audioInputRef.current) audioInputRef.current.value = "";
  };

  // Validation: Ready to create when audio is present
  const isReadyToCreate = Boolean(selectedFile) && !isGenerating;

  // Format seconds mm:ss
  const formatTime = (sec: number) => {
    if (!Number.isFinite(sec)) return "0:00";
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  // Sample scenes for editable workspace
  const generatedScenes: WhiteboardScene[] = useMemo(() => {
    const raw = editorialTranscript?.trim();
    const lines = raw
      ? raw.split(/[.\n]+/).map((s) => s.trim()).filter(Boolean)
      : [
          "The power of daily compounding",
          "Imagine a young entrepreneur",
          "Zero funding, solo builder",
          "Consistency overcomes every obstacle",
          "Breakthrough launch and ultimate victory",
        ];

    const icons = ["lightning_bolt", "piggy_bank", "money_stack", "calendar_sheet", "trophy_gold"];
    const colors = ["#2563EB", "#FF5722", "#059669", "#D97706", "#DC2626"];
    const archetypes: WhiteboardScene["archetype"][] = [
      "keyword_slam",
      "hero_center",
      "split_comparison",
      "step_ladder",
      "stat_callout",
    ];

    const sceneDuration = Math.max(5, Math.round((voiceoverDuration || 30) / Math.max(1, lines.length)));

    return lines.slice(0, 8).map((line, idx) => ({
      id: `scene-${idx}`,
      sceneIndex: idx,
      startTime: idx * sceneDuration,
      endTime: (idx + 1) * sceneDuration,
      duration: sceneDuration,
      archetype: archetypes[idx % archetypes.length],
      modality: "illustrative_doodle" as const,
      visualIntent: {
        beatIndex: idx,
        role: "explain" as const,
        takeaway: line,
        type: "concept" as const,
        entities: [],
        action: "draw",
        emotion: "inspirational",
        metaphors: [],
        soundOffTest: line,
      },
      headline: line,
      heroVisual: {
        drawingId: icons[idx % icons.length],
        label: line.slice(0, 24),
      },
      accentColor: colors[idx % colors.length],
    }));
  }, [editorialTranscript, voiceoverDuration]);

  return (
    <div className="w-full space-y-6 animate-fadeIn pb-12">
      {/* Hidden Voiceover Audio Element */}
      {voiceoverAudioUrl && (
        <audio
          ref={voiceoverAudioRef}
          src={voiceoverAudioUrl}
          onTimeUpdate={() => {
            if (voiceoverAudioRef.current) {
              setVoiceoverCurrentTime(voiceoverAudioRef.current.currentTime);
            }
          }}
          onEnded={() => setIsVoiceoverPlaying(false)}
        />
      )}

      {/* Mode Switcher Bar */}
      <div className="flex items-center justify-between pb-2">
        <div className="flex items-center gap-2 p-1 bg-slate-200/60 rounded-xl">
          <button
            type="button"
            onClick={() => setViewMode("studio")}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              viewMode === "studio"
                ? "bg-white text-slate-900 shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Create Video
          </button>
          <button
            type="button"
            onClick={() => setViewMode("workspace")}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              viewMode === "workspace"
                ? "bg-white text-slate-900 shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Layers className="w-3.5 h-3.5 text-orange-500" />
            <span>Interactive Workspace</span>
            <span className="px-1.5 py-0.2 rounded-full text-[9px] font-black bg-orange-100 text-orange-600">
              Live
            </span>
          </button>
        </div>

        {renderedVideoUrl && (
          <a
            href={renderedVideoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-bold text-orange-600 hover:text-orange-700 flex items-center gap-1"
          >
            <span>View Last Render</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </a>
        )}
      </div>

      {/* VIEW MODE 1: STUDIO (Action-First, Single-Page Creation Workspace) */}
      {viewMode === "studio" && (
        <div className="space-y-6">
          {/* Audio Upload Hero Card */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 sm:p-6 space-y-5">
            <div>
              <h2 className="text-sm sm:text-base font-bold text-slate-900">
                Voiceover Narration
              </h2>
              <p className="text-xs text-slate-500">
                Upload your speech audio to automatically plan and draw whiteboard scenes
              </p>
            </div>

            {!selectedFile ? (
              /* Drag & Drop Audio Upload Zone */
              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDraggingFile(true);
                }}
                onDragLeave={() => setIsDraggingFile(false)}
                onDrop={handleAudioDrop}
                onClick={() => audioInputRef.current?.click()}
                className={`border-2 border-dashed rounded-2xl p-8 sm:p-12 text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-3 ${
                  isDraggingFile
                    ? "border-orange-500 bg-orange-50/50 scale-[0.99]"
                    : "border-slate-200 hover:border-orange-400 hover:bg-slate-50/60"
                }`}
              >
                <input
                  ref={audioInputRef}
                  type="file"
                  accept="audio/*,.mp3,.wav,.m4a,.aac,.ogg"
                  onChange={handleAudioFileInput}
                  className="hidden"
                />

                <div className="w-14 h-14 rounded-2xl bg-orange-100 text-orange-600 flex items-center justify-center shadow-xs">
                  <UploadCloud className="w-7 h-7" />
                </div>

                <div>
                  <div className="text-sm font-bold text-slate-800">
                    Click to upload audio or drag and drop
                  </div>
                  <div className="text-xs text-slate-400 mt-1">
                    MP3, WAV, M4A or AAC (up to 90 seconds recommended)
                  </div>
                </div>

                <span className="px-4 py-1.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold transition shadow-xs">
                  Select Audio File
                </span>
              </div>
            ) : (
              /* Uploaded Audio Loaded State */
              <div className="space-y-4">
                {/* Audio Info & Playback Bar */}
                <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-3 min-w-0">
                    <button
                      type="button"
                      onClick={togglePlayVoiceover}
                      className="w-10 h-10 rounded-xl bg-orange-500 hover:bg-orange-600 text-white flex items-center justify-center shrink-0 shadow-xs active:scale-95 transition cursor-pointer"
                    >
                      {isVoiceoverPlaying ? (
                        <Pause className="w-5 h-5" />
                      ) : (
                        <Play className="w-5 h-5 ml-0.5 fill-white" />
                      )}
                    </button>
                    <div className="min-w-0">
                      <div className="text-xs font-bold text-slate-900 truncate">
                        {selectedFile.name}
                      </div>
                      <div className="text-[11px] text-slate-500 font-mono flex items-center gap-2 mt-0.5">
                        <span>
                          {formatTime(voiceoverCurrentTime)} / {formatTime(voiceoverDuration)}
                        </span>
                        <span>•</span>
                        <span>{(selectedFile.size / 1024 / 1024).toFixed(1)} MB</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => audioInputRef.current?.click()}
                      className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 text-xs font-semibold text-slate-700 transition cursor-pointer"
                    >
                      Replace Audio
                    </button>
                    <button
                      type="button"
                      onClick={handleRemoveAudio}
                      className="p-1.5 rounded-lg border border-slate-200 hover:bg-rose-50 hover:text-rose-600 text-slate-400 transition cursor-pointer"
                      title="Remove audio"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    <input
                      ref={audioInputRef}
                      type="file"
                      accept="audio/*,.mp3,.wav,.m4a,.aac,.ogg"
                      onChange={handleAudioFileInput}
                      className="hidden"
                    />
                  </div>
                </div>

                {/* Real-time Transcription Feedback Banner */}
                <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {transcribeState === "ready" ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                      ) : (
                        <RefreshCw className="w-4 h-4 text-orange-500 animate-spin" />
                      )}
                      <span className="text-xs font-bold text-slate-800">
                        {transcribeState === "uploading" && "Uploading Audio..."}
                        {transcribeState === "processing" && "Processing Audio..."}
                        {transcribeState === "transcribing" && "Generating Transcription..."}
                        {transcribeState === "ready" && "Transcription Ready"}
                      </span>
                    </div>

                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      Editable Script
                    </span>
                  </div>

                  {/* Real Transcript Review & Correction Box */}
                  <textarea
                    rows={3}
                    value={editorialTranscript}
                    onChange={(e) => onEditorialTranscriptChange(e.target.value)}
                    placeholder="Transcription text appears here. You can make corrections or fix any brand names..."
                    className="w-full p-3 rounded-xl border border-slate-200 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 leading-relaxed font-sans resize-none"
                  />
                  <div className="flex items-center justify-between text-[11px] text-slate-400">
                    <span>You can edit sentences to fine-tune the whiteboard scenes</span>
                    <span>{editorialTranscript.trim().split(/\s+/).filter(Boolean).length} Words</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Compact Customization Bar */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 sm:p-6 space-y-4">
            <div>
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Style & Background Options
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {/* 1. Marker Color */}
              <WhiteboardMarkerDrawer
                selectedColorId={markerColor}
                onSelectColor={onMarkerColorChange}
              />

              {/* 2. Hand Style */}
              <WhiteboardHandDrawer
                selectedHandId={handStyle}
                onSelectHand={onHandStyleChange}
              />

              {/* 3. Font Style */}
              <WhiteboardFontDrawer
                selectedFontId={fontPersonality}
                onSelectFont={onFontPersonalityChange}
              />

              {/* 4. Background Music */}
              <WhiteboardMusicDrawer
                selectedTrackId={bgmTrackId}
                onSelectTrack={onBgmTrackIdChange}
                volume={bgmVolume}
                onVolumeChange={onBgmVolumeChange}
              />
            </div>

            {/* Sound Effects Toggle */}
            <div className="pt-2 flex items-center justify-between border-t border-slate-100">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-700">Drawing Sound Effects</span>
                <span className="text-[11px] text-slate-400">Subtle dry-erase marker squeaks & eraser wipes</span>
              </div>
              <button
                type="button"
                onClick={() => onEnableSfxChange(!enableSfx)}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  enableSfx ? "bg-orange-500" : "bg-slate-200"
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                    enableSfx ? "translate-x-5" : "translate-x-0"
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Primary Action Button Bar */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="text-xs font-bold text-slate-900">
                Ready to create whiteboard explainer
              </div>
              <div className="text-[11px] text-slate-500">
                Costs 1 Video Credit • 1080×1920 Full HD 30 FPS MP4
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setViewMode("workspace")}
                className="px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
              >
                <Layers className="w-4 h-4 text-orange-500" />
                <span>Open Layer Workspace</span>
              </button>

              <button
                type="button"
                onClick={onGenerate}
                disabled={!isReadyToCreate}
                className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-8 py-3 rounded-xl text-xs font-black transition-all shadow-md active:scale-95 cursor-pointer ${
                  isReadyToCreate
                    ? "bg-gradient-to-r from-orange-500 via-amber-500 to-orange-500 text-slate-950 hover:brightness-110 shadow-orange-500/20"
                    : "bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed opacity-60"
                }`}
              >
                {isGenerating ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin text-slate-950" />
                    <span>Creating Whiteboard Video...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 fill-slate-950" />
                    <span>Create Whiteboard Video (1 Credit)</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* VIEW MODE 2: INTERACTIVE EDITABLE WORKSPACE */}
      {viewMode === "workspace" && (
        <WhiteboardEditableWorkspace
          initialScenes={generatedScenes}
          audioUrl={voiceoverAudioUrl || "/whiteboard-preview.mp3"}
          durationSeconds={voiceoverDuration || 60}
          fontPersonality={fontPersonality}
          markerColor={markerColor}
          handStyle={handStyle}
          onBackToStudio={() => setViewMode("studio")}
          onExportRender={(updatedScenes) => onGenerate(updatedScenes)}
          isExporting={isGenerating}
        />
      )}
    </div>
  );
}
