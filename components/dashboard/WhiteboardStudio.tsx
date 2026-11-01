"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  Sparkles,
  Upload,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize2,
  Check,
  CheckCircle2,
  Cloud,
  Undo2,
  Redo2,
  ChevronRight,
  Info,
  Mic,
  FileText,
  Music,
  Edit2,
  LayoutDashboard,
  FolderKanban,
  LayoutGrid,
  Image as ImageIcon,
  Sliders,
  HelpCircle,
  LogOut,
  X,
  Clock,
  Sparkle,
  MessageSquare,
} from "lucide-react";

export interface WhiteboardStudioProps {
  selectedFile: File | null;
  onSelectFile: (file: File | null) => void;
  transcript: string;
  onTranscriptChange: (text: string) => void;
  isTranscribing: boolean;
  transcriptionError?: string | null;
  onReTranscribe?: () => void;
  markerColor?: string;
  onMarkerColorChange?: (val: string) => void;
  fontPersonality?: string;
  onFontPersonalityChange?: (val: string) => void;
  enableSfx?: boolean;
  onToggleSfx?: (val: boolean) => void;
  onOpenPreview?: () => void;
  onGenerate: () => void;
  onPlanStoryboard?: () => void;
  isPlanning?: boolean;
  plan?: any;
  setPlan?: (plan: any) => void;
  studioStep?: "inputs" | "storyboard";
  setStudioStep?: (step: "inputs" | "storyboard") => void;
  isGenerating: boolean;
}

// ── 12 POPULAR WHITEBOARD FONTS (From Image 1) ──────────────────────────────────
export const POPULAR_WHITEBOARD_FONTS = [
  {
    id: "balsamiq",
    number: "1",
    name: "BALSAMIQ SANS",
    fontFamily: "'Balsamiq Sans', cursive, sans-serif",
    subtext: "Clean, hand-drawn look (Default)",
    previewText: "AI is growing rapidly!",
    tag: "Used in previous example",
  },
  {
    id: "permanent-marker",
    number: "2",
    name: "PERMANENT MARKER",
    fontFamily: "'Permanent Marker', cursive, sans-serif",
    subtext: "Bold and natural marker look",
    previewText: "AI IS GROWING RAPIDLY!",
    tag: "Bold marker style",
  },
  {
    id: "kids-hand",
    number: "3",
    name: "KIDS HAND",
    fontFamily: "'Gochi Hand', cursive, sans-serif",
    subtext: "Kids handwriting style",
    previewText: "AI is growing rapidly!",
    tag: "Playful script",
  },
  {
    id: "comic-neue",
    number: "4",
    name: "COMIC NEUE",
    fontFamily: "'Comic Neue', cursive, sans-serif",
    subtext: "Clean and friendly look",
    previewText: "AI is growing rapidly!",
    tag: "Readable friendly",
  },
  {
    id: "caveat",
    number: "5",
    name: "CAVEAT",
    fontFamily: "'Caveat', cursive, sans-serif",
    subtext: "Natural handwritten style",
    previewText: "AI is growing rapidly!",
    tag: "Fluid cursive",
  },
  {
    id: "archivo-handwritten",
    number: "6",
    name: "ARCHIVO HANDWRITTEN",
    fontFamily: "system-ui, sans-serif",
    subtext: "Neat handwriting style",
    previewText: "AI is growing rapidly!",
    tag: "Modern neat",
  },
  {
    id: "shadows-into-light",
    number: "7",
    name: "SHADOWS INTO LIGHT",
    fontFamily: "'Shadows Into Light', cursive, sans-serif",
    subtext: "Pencil sketch style",
    previewText: "AI is growing rapidly!",
    tag: "Sketch style",
  },
  {
    id: "schoolbell",
    number: "8",
    name: "SCHOOLBELL",
    fontFamily: "'Schoolbell', cursive, sans-serif",
    subtext: "School writing style",
    previewText: "AI is growing rapidly!",
    tag: "Notebook writing",
  },
  {
    id: "handlee",
    number: "9",
    name: "HANDLEE",
    fontFamily: "'Handlee', cursive, sans-serif",
    subtext: "Rounded handwritten style",
    previewText: "AI is growing rapidly!",
    tag: "Smooth rounded",
  },
  {
    id: "noto-sans-handwriting",
    number: "10",
    name: "NOTO SANS HANDWRITING",
    fontFamily: "sans-serif",
    subtext: "Google handwriting style",
    previewText: "AI is growing rapidly!",
    tag: "Structured clean",
  },
  {
    id: "indie-flower",
    number: "11",
    name: "INDIE FLOWER",
    fontFamily: "'Indie Flower', cursive, sans-serif",
    subtext: "Casual handwritten style",
    previewText: "AI is growing rapidly!",
    tag: "Bubbly casual",
  },
  {
    id: "comic-relief",
    number: "12",
    name: "COMIC RELIEF",
    fontFamily: "'Comic Relief', cursive, sans-serif",
    subtext: "Fun and playful style",
    previewText: "AI is growing rapidly!",
    tag: "Playful comic",
  },
];

// Helper to look up active font CSS
export const getFontFamilyCss = (fontId: string) => {
  const match = POPULAR_WHITEBOARD_FONTS.find((f) => f.id === fontId);
  return match ? match.fontFamily : "'Balsamiq Sans', cursive, sans-serif";
};

export function WhiteboardStudio({
  selectedFile,
  onSelectFile,
  transcript,
  onTranscriptChange,
  isTranscribing,
  transcriptionError,
  onReTranscribe,
  markerColor = "auto",
  onMarkerColorChange,
  fontPersonality = "balsamiq",
  onFontPersonalityChange,
  enableSfx = true,
  onToggleSfx,
  onOpenPreview,
  onGenerate,
  isGenerating,
}: WhiteboardStudioProps) {
  // Local state matching the visual dashboard in Image 2
  const [projectTitle, setProjectTitle] = useState("My First Whiteboard Animation");
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [activeSidebar, setActiveSidebar] = useState("dashboard");
  const [aspectRatio, setAspectRatio] = useState<"16:9" | "9:16">("16:9");
  const [backgroundType, setBackgroundType] = useState<"whiteboard" | "custom">("whiteboard");
  const [customBgColor, setCustomBgColor] = useState("#FFFFFF");

  // Hand animation: 'realistic' | 'minimal' | 'none'
  const [handAnimation, setHandAnimation] = useState<"realistic" | "minimal" | "none">("realistic");
  const [handEnabled, setHandEnabled] = useState(true);

  // Sound FX: 'classic' | 'soft' | 'marker' | 'none'
  const [sfxOption, setSfxOption] = useState<"classic" | "soft" | "marker" | "none">("classic");
  const [sfxEnabled, setSfxEnabled] = useState(enableSfx);

  // Background Music
  const [bgMusicEnabled, setBgMusicEnabled] = useState(true);

  // More Fonts Modal
  const [isMoreFontsOpen, setIsMoreFontsOpen] = useState(false);

  // Video playback simulation
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTimeSec, setCurrentTimeSec] = useState(4);
  const totalDurationSec = 165; // 02:45
  const [isMuted, setIsMuted] = useState(false);

  // Active Storyboard Scene
  const [activeSceneIndex, setActiveSceneIndex] = useState(0);

  // Script paste toggle
  const [showScriptInput, setShowScriptInput] = useState(false);

  // Simulated playback ticker
  useEffect(() => {
    let interval: any = null;
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentTimeSec((prev) => (prev >= totalDurationSec ? 0 : prev + 1));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  const activeFont = fontPersonality || "balsamiq";
  const activeFontFamily = getFontFamilyCss(activeFont);

  const setFont = (id: string) => {
    if (onFontPersonalityChange) {
      onFontPersonalityChange(id);
    }
  };

  // Format seconds to mm:ss
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  // 6 Storyboard scenes matching screenshot
  const scenes = [
    {
      id: 1,
      title: "Student to Company",
      duration: "6s",
      sketch: "student_walk",
    },
    {
      id: 2,
      title: "Interview Desk",
      duration: "4s",
      sketch: "interview",
    },
    {
      id: 3,
      title: "Hard Working",
      duration: "4s",
      sketch: "laptop",
    },
    {
      id: 4,
      title: "Got Selected",
      duration: "4s",
      sketch: "handshake",
    },
    {
      id: 5,
      title: "₹1,00,000 / Month",
      duration: "5s",
      sketch: "salary",
    },
    {
      id: 6,
      title: "Happy Future",
      duration: "4s",
      sketch: "celebrate",
    },
  ];

  return (
    <div className="w-full min-h-screen bg-[#F8FAFC] text-[#0F172A] flex flex-col font-sans select-none antialiased">
      {/* ── TOP HEADER BAR (Matching Image 2) ─────────────────────────────── */}
      <header className="w-full h-16 bg-white border-b border-[#E2E8F0] px-4 sm:px-6 flex items-center justify-between sticky top-0 z-30 shadow-xs">
        {/* Left: Studio Brand */}
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 text-white shadow-md shadow-blue-500/20">
            <svg
              className="w-5 h-5 fill-current"
              viewBox="0 0 24 24"
            >
              <path d="M4 4h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2zm0 2v12h16V6H4zm6 3l6 3-6 3V9z" />
            </svg>
          </div>
          <div>
            <h1 className="text-base font-black tracking-tight text-[#0F172A] leading-tight">
              Whiteboard Animation Studio
            </h1>
            <p className="text-[11px] text-[#64748B] font-medium leading-none">
              Create. Explain. Engage.
            </p>
          </div>
        </div>

        {/* Center: Interactive Project Title */}
        <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-slate-50 transition border border-transparent hover:border-slate-200 cursor-pointer">
          <span className="text-xs font-semibold text-slate-400">Project Title</span>
          {isEditingTitle ? (
            <input
              type="text"
              value={projectTitle}
              autoFocus
              onBlur={() => setIsEditingTitle(false)}
              onChange={(e) => setProjectTitle(e.target.value)}
              className="text-sm font-bold text-slate-800 bg-white border border-blue-400 rounded px-2 py-0.5 focus:outline-none"
            />
          ) : (
            <span
              onClick={() => setIsEditingTitle(true)}
              className="text-sm font-bold text-[#0F172A] flex items-center gap-1.5"
            >
              <span>{projectTitle}</span>
              <Edit2 size={13} className="text-slate-400 hover:text-blue-600 transition" />
            </span>
          )}
        </div>

        {/* Right: Actions, Save, Generate, Profile */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Cloud Auto-Saved indicator */}
          <div className="hidden lg:flex items-center gap-1.5 text-xs text-slate-500">
            <Cloud size={14} className="text-slate-400" />
            <span>Saved 2 mins ago</span>
          </div>

          {/* Undo / Redo */}
          <div className="hidden sm:flex items-center gap-1 border-r border-slate-200 pr-2">
            <button
              type="button"
              title="Undo"
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
            >
              <Undo2 size={15} />
            </button>
            <button
              type="button"
              title="Redo"
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
            >
              <Redo2 size={15} />
            </button>
          </div>

          {/* Save Draft */}
          <button
            type="button"
            className="px-3 sm:px-4 py-1.5 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition"
          >
            Save Draft
          </button>

          {/* Generate Video (Primary Action) */}
          <button
            type="button"
            onClick={onGenerate}
            disabled={isGenerating}
            className="inline-flex items-center gap-1.5 px-4 sm:px-5 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm shadow-blue-600/30 transition duration-150 cursor-pointer active:scale-95 disabled:opacity-50"
          >
            <span>{isGenerating ? "Rendering..." : "Generate Video"}</span>
            <ChevronRight size={14} />
          </button>

          {/* User Avatar Circle */}
          <div className="h-8 w-8 rounded-full bg-teal-400 text-teal-950 font-bold text-xs flex items-center justify-center border-2 border-white shadow-xs">
            AK
          </div>
        </div>
      </header>

      {/* ── MAIN WORKSPACE (SIDEBAR + 2-COLUMN STUDIO) ───────────────────── */}
      <div className="flex-1 flex w-full">
        {/* ── LEFT NAVIGATION SIDEBAR ─────────────────────────────────────── */}
        <aside className="w-56 bg-white border-r border-[#E2E8F0] p-4 hidden md:flex flex-col justify-between shrink-0">
          <nav className="space-y-1">
            {[
              { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
              { id: "projects", label: "My Projects", icon: FolderKanban },
              { id: "templates", label: "Templates", icon: LayoutGrid },
              { id: "media", label: "Media Library", icon: ImageIcon },
              { id: "voiceover", label: "Voiceover", icon: Mic },
              { id: "music", label: "Music Library", icon: Music },
              { id: "settings", label: "Settings", icon: Sliders },
            ].map((item) => {
              const Icon = item.icon;
              const isActive = activeSidebar === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setActiveSidebar(item.id)}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition text-left cursor-pointer ${
                    isActive
                      ? "bg-blue-50 text-blue-700"
                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                  }`}
                >
                  <Icon size={16} className={isActive ? "text-blue-600" : "text-slate-400"} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Bottom Sidebar: Credits Left Card & Support */}
          <div className="space-y-4 pt-6 border-t border-slate-100">
            {/* Credits Card */}
            <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-3.5 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-700">Credits Left</span>
              </div>
              <div className="text-lg font-black text-slate-900 leading-none">
                120 <span className="text-xs font-medium text-slate-500">/ 200 mins</span>
              </div>
              {/* Progress bar */}
              <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden">
                <div className="h-full bg-blue-600 rounded-full w-3/5" />
              </div>
              <button
                type="button"
                className="w-full mt-1 py-1.5 text-xs font-bold text-blue-600 bg-white border border-blue-200 rounded-lg hover:bg-blue-50 transition shadow-2xs"
              >
                Upgrade Plan
              </button>
            </div>

            {/* Help & Logout */}
            <div className="space-y-1 text-xs text-slate-500">
              <button
                type="button"
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-slate-50 hover:text-slate-800 transition"
              >
                <HelpCircle size={15} />
                <span>Help & Support</span>
              </button>
              <button
                type="button"
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-slate-50 hover:text-slate-800 transition"
              >
                <LogOut size={15} />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </aside>

        {/* ── STUDIO CONTENT (2 COLUMNS) ─────────────────────────────────── */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-[1560px] mx-auto w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
            {/* ── LEFT COLUMN: INPUTS & CUSTOMIZATION (7 COLS) ──────────── */}
            <div className="lg:col-span-7 space-y-6">
              {/* ── CARD 1: ADD AUDIO / SCRIPT ──────────────────────────── */}
              <div className="bg-white rounded-2xl border border-[#E2E8F0] p-5 sm:p-6 shadow-xs space-y-4">
                {/* Header Badge */}
                <div className="flex items-center gap-2.5">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-600 text-white text-xs font-black">
                    1
                  </span>
                  <h2 className="text-sm sm:text-base font-black text-[#0F172A]">
                    Add Audio / Script
                  </h2>
                </div>

                {/* Upload Drag & Drop Area */}
                <div
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => {
                    e.preventDefault();
                    const file = e.dataTransfer.files?.[0];
                    if (file) onSelectFile(file);
                  }}
                  className="border-2 border-dashed border-[#CBD5E1] hover:border-blue-500 rounded-2xl bg-[#F8FAFC] p-6 text-center transition flex flex-col items-center justify-center space-y-2 relative group"
                >
                  <input
                    type="file"
                    accept="audio/*,video/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) onSelectFile(file);
                    }}
                    className="absolute inset-0 opacity-0 cursor-pointer w-full h-full z-10"
                  />
                  <div className="h-10 w-10 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600">
                    <Upload size={18} />
                  </div>
                  <p className="text-xs sm:text-sm font-semibold text-slate-700">
                    Drag & drop your audio file here
                  </p>
                  <span className="text-[11px] text-slate-400">or</span>
                  <button
                    type="button"
                    className="px-4 py-1.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-xs transition"
                  >
                    Upload Audio
                  </button>
                  <p className="text-[10px] text-slate-400 pt-1">
                    Supports: MP3, WAV, M4A (Max size: 100MB)
                  </p>
                </div>

                {/* Loaded Audio Player Bar (Matching Image 2) */}
                <div className="bg-white border border-[#E2E8F0] rounded-xl p-3 flex items-center justify-between gap-3 shadow-2xs">
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <button
                      type="button"
                      onClick={() => setIsPlaying(!isPlaying)}
                      className="h-8 w-8 rounded-full bg-blue-600 text-white flex items-center justify-center shrink-0 hover:bg-blue-700 transition"
                    >
                      {isPlaying ? <Pause size={14} /> : <Play size={14} className="ml-0.5" />}
                    </button>
                    <span className="text-xs font-bold text-slate-800 truncate">
                      {selectedFile ? selectedFile.name : "job_story_audio.mp3"}
                    </span>
                    <span className="text-[11px] font-mono text-slate-400 shrink-0">02:45</span>
                    {/* Animated waveform bars */}
                    <div className="flex items-center gap-0.5 h-4 flex-1 max-w-[180px]">
                      {[40, 70, 30, 90, 60, 100, 45, 80, 55, 95, 65, 40, 85, 30, 75, 50].map((h, i) => (
                        <span
                          key={i}
                          style={{ height: `${isPlaying ? h : Math.max(20, h * 0.4)}%` }}
                          className={`w-1 rounded-full transition-all duration-200 ${
                            isPlaying ? "bg-blue-500" : "bg-slate-300"
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                  <CheckCircle2 size={16} className="text-emerald-500 shrink-0" />
                </div>

                {/* Sub Action Links */}
                <div className="flex items-center justify-between text-xs text-blue-600 font-semibold px-1 pt-1">
                  <button
                    type="button"
                    onClick={() => alert("Microphone recording initialized.")}
                    className="flex items-center gap-1.5 hover:underline"
                  >
                    <Mic size={14} />
                    <span>Record Audio</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowScriptInput(!showScriptInput)}
                    className="flex items-center gap-1.5 hover:underline"
                  >
                    <FileText size={14} />
                    <span>{showScriptInput ? "Hide script box" : "Or paste script"}</span>
                  </button>
                </div>

                {/* Optional Script Paste Textarea */}
                {showScriptInput && (
                  <div className="pt-2 space-y-1.5">
                    <textarea
                      rows={3}
                      value={transcript}
                      onChange={(e) => onTranscriptChange(e.target.value)}
                      placeholder="Paste speech script here..."
                      className="w-full text-xs font-mono p-3 rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:border-blue-500 text-slate-800"
                    />
                  </div>
                )}
              </div>

              {/* ── CARD 2: STYLE & CUSTOMIZATION ───────────────────────── */}
              <div className="bg-white rounded-2xl border border-[#E2E8F0] p-5 sm:p-6 shadow-xs space-y-6">
                {/* Header Badge */}
                <div className="flex items-center gap-2.5">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-600 text-white text-xs font-black">
                    2
                  </span>
                  <h2 className="text-sm sm:text-base font-black text-[#0F172A]">
                    Style & Customization
                  </h2>
                </div>

                {/* ── FONT SELECTION (With Balsamiq Sans as Default) ─────── */}
                <div className="space-y-2.5">
                  <label className="text-xs font-bold text-slate-700 block">Font</label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
                    {[
                      {
                        id: "balsamiq",
                        label: "Balsamiq Sans",
                        sub: "(Default)",
                        fontFamily: "'Balsamiq Sans', cursive, sans-serif",
                      },
                      {
                        id: "permanent-marker",
                        label: "Permanent Marker",
                        sub: "",
                        fontFamily: "'Permanent Marker', cursive, sans-serif",
                      },
                      {
                        id: "caveat",
                        label: "Caveat",
                        sub: "",
                        fontFamily: "'Caveat', cursive, sans-serif",
                      },
                      {
                        id: "comic-neue",
                        label: "Comic Neue",
                        sub: "",
                        fontFamily: "'Comic Neue', cursive, sans-serif",
                      },
                      {
                        id: "handlee",
                        label: "Handlee",
                        sub: "",
                        fontFamily: "'Handlee', cursive, sans-serif",
                      },
                      {
                        id: "more",
                        label: "... More",
                        sub: "",
                        fontFamily: "inherit",
                        isMore: true,
                      },
                    ].map((f) => {
                      if (f.isMore) {
                        return (
                          <button
                            key={f.id}
                            type="button"
                            onClick={() => setIsMoreFontsOpen(true)}
                            className="p-2.5 rounded-xl border border-dashed border-slate-300 hover:border-blue-500 bg-slate-50 hover:bg-blue-50/50 text-slate-600 hover:text-blue-600 text-center flex flex-col items-center justify-center transition cursor-pointer"
                          >
                            <span className="text-xs font-bold">... More</span>
                            <span className="text-[9px] text-slate-400">12 fonts</span>
                          </button>
                        );
                      }
                      const isSelected = activeFont === f.id;
                      return (
                        <button
                          key={f.id}
                          type="button"
                          onClick={() => setFont(f.id)}
                          style={{ fontFamily: f.fontFamily }}
                          className={`relative p-2.5 rounded-xl border text-center flex flex-col items-center justify-center transition cursor-pointer min-h-[58px] ${
                            isSelected
                              ? "border-blue-600 bg-blue-50/40 text-blue-900 ring-1 ring-blue-600 shadow-2xs"
                              : "border-slate-200 bg-white hover:border-slate-300 text-slate-700"
                          }`}
                        >
                          {isSelected && (
                            <span className="absolute top-1 right-1 h-3.5 w-3.5 bg-blue-600 rounded-full text-white flex items-center justify-center text-[9px]">
                              ✓
                            </span>
                          )}
                          <span className="text-xs font-bold leading-tight truncate max-w-full">
                            {f.label}
                          </span>
                          {f.sub && (
                            <span className="text-[10px] text-slate-500 font-sans leading-tight">
                              {f.sub}
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {/* Font Preview Sentence Box (Styled Live with Selected Font!) */}
                  <div className="bg-[#F8FAFC] border border-slate-200 rounded-xl px-4 py-2.5 flex items-center gap-2 text-xs text-slate-600">
                    <span className="font-semibold text-slate-400 font-sans shrink-0">
                      - Font Preview:
                    </span>
                    <span
                      style={{ fontFamily: activeFontFamily }}
                      className="text-sm font-semibold text-slate-800 truncate"
                    >
                      • The quick brown fox jumps over the lazy dog.
                    </span>
                  </div>
                </div>

                {/* ── BACKGROUND SELECTION ─────────────────────────────────── */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-700 block">Background</label>
                  <div className="flex items-center gap-3">
                    {/* Whiteboard Tile */}
                    <button
                      type="button"
                      onClick={() => setBackgroundType("whiteboard")}
                      className={`relative flex items-center gap-2.5 px-4 py-2 rounded-xl border transition ${
                        backgroundType === "whiteboard"
                          ? "border-blue-600 bg-blue-50/30 text-slate-900 ring-1 ring-blue-600"
                          : "border-slate-200 bg-white text-slate-600"
                      }`}
                    >
                      <div className="h-5 w-5 rounded-md border border-slate-300 bg-white flex items-center justify-center shadow-2xs">
                        {backgroundType === "whiteboard" && <Check size={12} className="text-blue-600" />}
                      </div>
                      <span className="text-xs font-bold">Whiteboard</span>
                    </button>

                    {/* Custom Color Tile */}
                    <div className="relative">
                      <button
                        type="button"
                        onClick={() => setBackgroundType("custom")}
                        className={`flex items-center gap-2.5 px-4 py-2 rounded-xl border transition ${
                          backgroundType === "custom"
                            ? "border-blue-600 bg-blue-50/30 text-slate-900 ring-1 ring-blue-600"
                            : "border-slate-200 bg-white text-slate-600"
                        }`}
                      >
                        <div
                          style={{ backgroundColor: customBgColor }}
                          className="h-5 w-5 rounded-md border border-slate-300 shadow-2xs"
                        />
                        <span className="text-xs font-bold">Custom Color</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* ── HAND ANIMATION (Matching Image 2) ───────────────────── */}
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                      <span>Hand Animation</span>
                      <Info size={13} className="text-slate-400" />
                    </span>
                    {/* Toggle Switch */}
                    <button
                      type="button"
                      onClick={() => setHandEnabled(!handEnabled)}
                      className={`w-9 h-5 flex items-center rounded-full p-1 cursor-pointer transition duration-200 ${
                        handEnabled ? "bg-blue-600 justify-end" : "bg-slate-300 justify-start"
                      }`}
                    >
                      <div className="bg-white w-3.5 h-3.5 rounded-full shadow-md" />
                    </button>
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    {[
                      {
                        id: "realistic" as const,
                        name: "Realistic Hand",
                        icon: "✍️",
                      },
                      {
                        id: "minimal" as const,
                        name: "Minimal Hand",
                        icon: "🖊️",
                      },
                      {
                        id: "none" as const,
                        name: "No Hand",
                        icon: "✕",
                      },
                    ].map((item) => {
                      const isSelected = handAnimation === item.id;
                      return (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => setHandAnimation(item.id)}
                          className={`relative p-3 rounded-xl border text-center flex flex-col items-center justify-center transition cursor-pointer min-h-[72px] ${
                            isSelected && handEnabled
                              ? "border-blue-600 bg-blue-50/40 text-blue-900 ring-1 ring-blue-600"
                              : "border-slate-200 bg-white text-slate-600 hover:border-slate-300"
                          }`}
                        >
                          {isSelected && handEnabled && (
                            <span className="absolute top-1.5 right-1.5 h-3.5 w-3.5 bg-blue-600 rounded-full text-white flex items-center justify-center text-[9px]">
                              ✓
                            </span>
                          )}
                          <span className="text-xl mb-1">{item.icon}</span>
                          <span className="text-xs font-bold">{item.name}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* ── SOUND EFFECTS (PEN CLICK) (Matching Image 2) ───────── */}
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                      <span>Sound Effects (Pen Click)</span>
                      <Info size={13} className="text-slate-400" />
                    </span>
                    {/* Toggle Switch */}
                    <button
                      type="button"
                      onClick={() => {
                        const next = !sfxEnabled;
                        setSfxEnabled(next);
                        if (onToggleSfx) onToggleSfx(next);
                      }}
                      className={`w-9 h-5 flex items-center rounded-full p-1 cursor-pointer transition duration-200 ${
                        sfxEnabled ? "bg-blue-600 justify-end" : "bg-slate-300 justify-start"
                      }`}
                    >
                      <div className="bg-white w-3.5 h-3.5 rounded-full shadow-md" />
                    </button>
                  </div>

                  <div className="grid grid-cols-4 gap-2.5">
                    {[
                      { id: "classic" as const, name: "Classic Click", icon: Volume2 },
                      { id: "soft" as const, name: "Soft Click", icon: Volume2 },
                      { id: "marker" as const, name: "Marker Sound", icon: Volume2 },
                      { id: "none" as const, name: "No Sound", icon: VolumeX },
                    ].map((item) => {
                      const Icon = item.icon;
                      const isSelected = sfxOption === item.id;
                      return (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => setSfxOption(item.id)}
                          className={`relative p-2.5 rounded-xl border text-center flex flex-col items-center justify-center transition cursor-pointer min-h-[64px] ${
                            isSelected && sfxEnabled
                              ? "border-blue-600 bg-blue-50/40 text-blue-900 ring-1 ring-blue-600"
                              : "border-slate-200 bg-white text-slate-600 hover:border-slate-300"
                          }`}
                        >
                          {isSelected && sfxEnabled && (
                            <span className="absolute top-1 right-1 h-3.5 w-3.5 bg-blue-600 rounded-full text-white flex items-center justify-center text-[9px]">
                              ✓
                            </span>
                          )}
                          <Icon size={16} className="mb-1 text-slate-600" />
                          <span className="text-[11px] font-bold leading-tight">{item.name}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* ── BACKGROUND MUSIC (OPTIONAL) ─────────────────────────── */}
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                      <span>Background Music (Optional)</span>
                      <Info size={13} className="text-slate-400" />
                    </span>
                    {/* Toggle Switch */}
                    <button
                      type="button"
                      onClick={() => setBgMusicEnabled(!bgMusicEnabled)}
                      className={`w-9 h-5 flex items-center rounded-full p-1 cursor-pointer transition duration-200 ${
                        bgMusicEnabled ? "bg-blue-600 justify-end" : "bg-slate-300 justify-start"
                      }`}
                    >
                      <div className="bg-white w-3.5 h-3.5 rounded-full shadow-md" />
                    </button>
                  </div>

                  {bgMusicEnabled && (
                    <div className="bg-white border border-[#E2E8F0] rounded-xl p-3 flex items-center justify-between gap-3 shadow-2xs">
                      <div className="flex items-center gap-3 min-w-0 flex-1">
                        <div className="h-8 w-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                          <Music size={15} />
                        </div>
                        <span className="text-xs font-bold text-slate-800 truncate">
                          Inspiring Background Track
                        </span>
                        <span className="text-[11px] font-mono text-slate-400 shrink-0">02:30</span>
                        {/* Audio Waveform */}
                        <div className="flex items-center gap-0.5 h-3.5 flex-1 max-w-[140px]">
                          {[60, 90, 40, 80, 50, 100, 70, 40, 85, 60, 95, 30].map((h, i) => (
                            <span
                              key={i}
                              style={{ height: `${h}%` }}
                              className="w-1 bg-slate-300 rounded-full"
                            />
                          ))}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Volume2 size={16} className="text-slate-400" />
                        <button
                          type="button"
                          className="px-2.5 py-1 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition"
                        >
                          Change
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* ── RIGHT COLUMN: LIVE PREVIEW & STORYBOARD (5 COLS) ───────── */}
            <div className="lg:col-span-5 space-y-6">
              {/* ── PREVIEW (ESTIMATED) ─────────────────────────────────── */}
              <div className="bg-white rounded-2xl border border-[#E2E8F0] p-5 shadow-xs space-y-4">
                {/* Header with Aspect Ratio Toggle */}
                <div className="flex items-center justify-between pb-1">
                  <span className="text-xs font-black text-slate-800 flex items-center gap-1.5">
                    <span>Preview (Estimated)</span>
                    <Info size={13} className="text-slate-400" />
                  </span>

                  {/* 16:9 / 9:16 Aspect Ratio Switcher */}
                  <div className="flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200">
                    <button
                      type="button"
                      onClick={() => setAspectRatio("16:9")}
                      className={`px-2.5 py-1 text-[11px] font-bold rounded-md transition flex items-center gap-1 ${
                        aspectRatio === "16:9"
                          ? "bg-white text-blue-600 shadow-2xs"
                          : "text-slate-500 hover:text-slate-800"
                      }`}
                    >
                      <span className="w-3 h-2 border border-current rounded-xs" />
                      <span>16:9</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setAspectRatio("9:16")}
                      className={`px-2.5 py-1 text-[11px] font-bold rounded-md transition flex items-center gap-1 ${
                        aspectRatio === "9:16"
                          ? "bg-white text-blue-600 shadow-2xs"
                          : "text-slate-500 hover:text-slate-800"
                      }`}
                    >
                      <span className="w-2 h-3 border border-current rounded-xs" />
                      <span>9:16</span>
                    </button>
                  </div>
                </div>

                {/* Video Player Canvas (Matches exact scene in Image 2!) */}
                <div
                  className={`w-full rounded-2xl border-2 border-slate-200 bg-[#FAFAFA] relative overflow-hidden flex flex-col justify-between shadow-inner transition-all duration-300 ${
                    aspectRatio === "16:9" ? "aspect-video" : "aspect-[9/16] max-w-[280px] mx-auto"
                  }`}
                >
                  {/* Scene Sketch Canvas */}
                  <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between relative">
                    {/* Scene Text rendered in selected Whiteboard Font (Default: Balsamiq Sans) */}
                    <div>
                      <h3
                        style={{ fontFamily: activeFontFamily }}
                        className="text-sm sm:text-base font-bold text-slate-900 tracking-wide uppercase leading-tight"
                      >
                        A COLLEGE STUDENT
                      </h3>
                      <h3
                        style={{ fontFamily: activeFontFamily }}
                        className="text-sm sm:text-base font-bold tracking-wide uppercase leading-tight text-blue-600"
                      >
                        GOES FOR A <span className="underline decoration-2">JOB...</span>
                      </h3>
                    </div>

                    {/* Vector Sketch: Student walking with backpack -> dotted arrow -> COMPANY building */}
                    <div className="flex items-center justify-between px-2 sm:px-4 my-auto relative">
                      {/* Student character sketch */}
                      <div className="flex flex-col items-center">
                        <svg className="w-14 h-24 sm:w-16 sm:h-28" viewBox="0 0 60 100">
                          {/* Head */}
                          <circle cx="30" cy="20" r="10" stroke="#0F172A" strokeWidth="2.5" fill="none" />
                          {/* Face hair */}
                          <path d="M22 18 Q30 10 38 18" stroke="#0F172A" strokeWidth="2" fill="none" />
                          {/* Body */}
                          <path d="M30 30 L30 65" stroke="#0F172A" strokeWidth="2.5" />
                          {/* Backpack */}
                          <rect x="15" y="34" width="10" height="18" rx="3" stroke="#0F172A" strokeWidth="2" fill="none" />
                          {/* Legs walking */}
                          <path d="M30 65 L20 95" stroke="#0F172A" strokeWidth="2.5" />
                          <path d="M30 65 L42 90" stroke="#0F172A" strokeWidth="2.5" />
                          {/* Arms */}
                          <path d="M30 40 L45 55" stroke="#0F172A" strokeWidth="2" />
                        </svg>
                      </div>

                      {/* Dotted Arrow: ------> */}
                      <div className="flex-1 px-2 flex items-center justify-center">
                        <svg className="w-full h-8" viewBox="0 0 100 30">
                          <path
                            d="M 5 20 Q 50 5 95 18"
                            stroke="#0F172A"
                            strokeWidth="2"
                            strokeDasharray="4 4"
                            fill="none"
                          />
                          <polygon points="95,14 100,20 93,24" fill="#0F172A" />
                        </svg>
                      </div>

                      {/* COMPANY Building Sketch */}
                      <div className="relative">
                        <svg className="w-20 h-24 sm:w-24 sm:h-28" viewBox="0 0 90 100">
                          {/* Building Outline */}
                          <rect x="10" y="25" width="70" height="70" stroke="#0F172A" strokeWidth="2.5" fill="none" />
                          {/* Rooftop sign */}
                          <rect x="25" y="10" width="40" height="15" stroke="#0F172A" strokeWidth="1.5" fill="none" />
                          <text x="45" y="21" fontSize="8" fontWeight="bold" textAnchor="middle" fill="#0F172A">
                            COMPANY
                          </text>
                          {/* Windows Grid */}
                          <line x1="20" y1="40" x2="35" y2="40" stroke="#0F172A" strokeWidth="1.5" />
                          <line x1="45" y1="40" x2="60" y2="40" stroke="#0F172A" strokeWidth="1.5" />
                          <line x1="20" y1="52" x2="35" y2="52" stroke="#0F172A" strokeWidth="1.5" />
                          <line x1="45" y1="52" x2="60" y2="52" stroke="#0F172A" strokeWidth="1.5" />
                          {/* Door */}
                          <rect x="35" y="70" width="20" height="25" stroke="#0F172A" strokeWidth="2" fill="none" />
                          {/* Bushes */}
                          <circle cx="6" cy="90" r="6" stroke="#0F172A" strokeWidth="1.5" fill="none" />
                          <circle cx="84" cy="90" r="6" stroke="#0F172A" strokeWidth="1.5" fill="none" />
                        </svg>

                        {/* Hand holding black marker pen actively drawing! (Image 2) */}
                        {handEnabled && (
                          <div className="absolute -bottom-2 -right-4 pointer-events-none transform translate-x-2 translate-y-2">
                            <svg className="w-24 h-24 sm:w-28 sm:h-28" viewBox="0 0 100 100">
                              {/* Marker Pen */}
                              <polygon points="18,30 22,26 48,52 44,56" fill="#0F172A" />
                              <polygon points="12,36 18,30 22,34" fill="#000000" />
                              <polygon points="10,38 13,35 15,37" fill="#2563EB" />
                              {/* Realistic Hand Silhouette / Fingers */}
                              <path
                                d="M40 45 C 50 35, 70 40, 85 55 C 95 65, 95 85, 80 95 C 65 95, 50 80, 42 65 Z"
                                fill="#F1C27D"
                                stroke="#D49B55"
                                strokeWidth="1.5"
                              />
                              <path
                                d="M38 52 C 45 48, 55 52, 60 62"
                                stroke="#D49B55"
                                strokeWidth="1"
                                fill="none"
                              />
                            </svg>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Video Player Controls Bar */}
                  <div className="bg-black/90 text-white px-3 py-2 flex items-center justify-between text-xs z-10 backdrop-blur-xs">
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => setIsPlaying(!isPlaying)}
                        className="hover:text-blue-400 transition"
                      >
                        {isPlaying ? <Pause size={14} /> : <Play size={14} />}
                      </button>
                      <span className="font-mono text-[11px] text-slate-300">
                        {formatTime(currentTimeSec)} / 02:45
                      </span>
                    </div>

                    {/* Timeline Seeker */}
                    <div className="flex-1 mx-3 h-1.5 bg-white/20 rounded-full overflow-hidden cursor-pointer">
                      <div
                        style={{ width: `${(currentTimeSec / totalDurationSec) * 100}%` }}
                        className="h-full bg-blue-500 rounded-full"
                      />
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setIsMuted(!isMuted)}
                        className="hover:text-blue-400 transition"
                      >
                        {isMuted ? <VolumeX size={14} /> : <Volume2 size={14} />}
                      </button>
                      <Maximize2 size={14} className="hover:text-blue-400 transition cursor-pointer" />
                    </div>
                  </div>
                </div>

                {/* ── TRANSCRIPT SECTION (Matching Image 2) ─────────────── */}
                <div className="space-y-2 pt-2 border-t border-slate-100">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                      <span>Transcript</span>
                      <Info size={13} className="text-slate-400" />
                    </span>
                    <button
                      type="button"
                      onClick={() => setShowScriptInput(!showScriptInput)}
                      className="text-xs font-bold text-slate-600 hover:text-blue-600 border border-slate-200 px-2.5 py-0.5 rounded-lg hover:bg-slate-50 transition"
                    >
                      Edit
                    </button>
                  </div>

                  {/* Transcript Items with Timestamps */}
                  <div className="space-y-1.5 text-xs font-sans text-slate-700 max-h-40 overflow-y-auto pr-1">
                    {[
                      { time: "00:00", text: "A college student goes for a", highlight: "job." },
                      { time: "00:03", text: "He attends the interview.", highlight: "" },
                      { time: "00:07", text: "He works hard and impresses everyone.", highlight: "" },
                      { time: "00:11", text: "Finally, he gets", highlight: "selected." },
                      { time: "00:15", text: "He got a salary of", highlight: "one lakh rupees per month." },
                      { time: "00:20", text: "He is very", highlight: "happy and excited for his future." },
                    ].map((item, idx) => (
                      <div key={idx} className="flex items-start gap-2.5 hover:bg-slate-50 p-1 rounded-md transition">
                        <span className="font-mono text-[10px] text-slate-400 pt-0.5 shrink-0">
                          {item.time}
                        </span>
                        <p className="text-xs leading-relaxed">
                          {item.text}{" "}
                          {item.highlight && (
                            <span className="font-bold text-blue-600 underline decoration-1">
                              {item.highlight}
                            </span>
                          )}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* ── SCENES (6) STORYBOARD ROW ─────────────────────────── */}
                <div className="space-y-2 pt-2 border-t border-slate-100">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-700">
                      Scenes ({scenes.length})
                    </span>
                    <button
                      type="button"
                      onClick={() => onOpenPreview && onOpenPreview()}
                      className="text-xs font-bold text-slate-600 hover:text-blue-600 border border-slate-200 px-2.5 py-0.5 rounded-lg hover:bg-slate-50 transition"
                    >
                      Edit Scenes
                    </button>
                  </div>

                  {/* Horizontal Scroll of 6 Scene Cards */}
                  <div className="flex items-center gap-2 overflow-x-auto pb-1">
                    {scenes.map((s, idx) => {
                      const isActive = activeSceneIndex === idx;
                      return (
                        <div
                          key={s.id}
                          onClick={() => setActiveSceneIndex(idx)}
                          className={`flex-1 min-w-[72px] rounded-xl border p-1.5 flex flex-col justify-between items-center text-center transition cursor-pointer ${
                            isActive
                              ? "border-blue-600 bg-blue-50/50 shadow-xs"
                              : "border-slate-200 bg-white hover:border-slate-300"
                          }`}
                        >
                          <span className="text-[10px] font-bold text-slate-500 self-start">
                            {s.id}
                          </span>
                          {/* Mini vector icon */}
                          <div className="h-10 w-full flex items-center justify-center text-slate-700 my-1">
                            {idx === 0 && (
                              <svg className="w-10 h-8" viewBox="0 0 60 40">
                                <circle cx="15" cy="12" r="5" stroke="#0F172A" strokeWidth="1.5" fill="none" />
                                <line x1="15" y1="17" x2="15" y2="30" stroke="#0F172A" strokeWidth="1.5" />
                                <rect x="35" y="10" width="18" height="20" stroke="#0F172A" strokeWidth="1.5" fill="none" />
                              </svg>
                            )}
                            {idx === 1 && (
                              <svg className="w-10 h-8" viewBox="0 0 60 40">
                                <circle cx="15" cy="12" r="4" stroke="#0F172A" strokeWidth="1.5" fill="none" />
                                <circle cx="45" cy="12" r="4" stroke="#0F172A" strokeWidth="1.5" fill="none" />
                                <rect x="22" y="20" width="16" height="8" stroke="#0F172A" strokeWidth="1.5" fill="none" />
                              </svg>
                            )}
                            {idx === 2 && (
                              <svg className="w-10 h-8" viewBox="0 0 60 40">
                                <circle cx="30" cy="12" r="5" stroke="#0F172A" strokeWidth="1.5" fill="none" />
                                <rect x="20" y="24" width="20" height="10" stroke="#0F172A" strokeWidth="1.5" fill="none" />
                              </svg>
                            )}
                            {idx === 3 && (
                              <span className="text-base">🤝</span>
                            )}
                            {idx === 4 && (
                              <span className="text-[10px] font-black text-slate-900 leading-none">
                                ₹1,00,000<br/><span className="text-[8px] font-normal text-slate-500">PER MONTH</span>
                              </span>
                            )}
                            {idx === 5 && (
                              <span className="text-base">🙌</span>
                            )}
                          </div>
                          <span className="text-[9px] font-mono font-bold text-slate-400">
                            {s.duration}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* ── FOOTER STATS BAR (Matching Image 2) ───────────────── */}
                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] font-semibold text-slate-500">
                  <span>Video length (estimated): 02:45</span>
                  <span>Scenes: 6</span>
                  <span>Words: 75</span>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* ── FLOATING CHAT / HELP BUTTON (Bottom Right) ────────────────────── */}
      <div className="fixed bottom-6 right-6 z-40">
        <button
          type="button"
          onClick={() => alert("Itnavideo Support Assistant ready to help.")}
          className="h-12 w-12 rounded-full bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-600/30 flex items-center justify-center transition cursor-pointer active:scale-95"
        >
          <MessageSquare size={20} />
        </button>
      </div>

      {/* ── MODAL: 12 POPULAR WHITEBOARD FONTS (From Image 1) ─────────────── */}
      {isMoreFontsOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto flex flex-col p-6 animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <h3 className="text-lg font-black text-[#0F172A] tracking-tight">
                  OTHER POPULAR FONTS FOR WHITEBOARD ANIMATION
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Click any font style to instantly apply it to your whiteboard presentation.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsMoreFontsOpen(false)}
                className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-800 transition"
              >
                <X size={18} />
              </button>
            </div>

            {/* 12 Popular Fonts Grid (Matching Image 1) */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 pt-6">
              {POPULAR_WHITEBOARD_FONTS.map((font) => {
                const isSelected = activeFont === font.id;
                return (
                  <button
                    key={font.id}
                    type="button"
                    onClick={() => {
                      setFont(font.id);
                      setIsMoreFontsOpen(false);
                    }}
                    className={`relative p-3 rounded-2xl border text-center flex flex-col justify-between items-center transition cursor-pointer min-h-[160px] ${
                      isSelected
                        ? "border-blue-600 bg-blue-50/50 ring-2 ring-blue-600 shadow-md"
                        : "border-slate-200 bg-white hover:border-blue-400 hover:shadow-xs"
                    }`}
                  >
                    {/* Number & Name Header */}
                    <div className="w-full">
                      <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wider block">
                        {font.number}. {font.name}
                      </span>
                    </div>

                    {/* Font Preview Line */}
                    <div className="my-auto py-2">
                      <p
                        style={{ fontFamily: font.fontFamily }}
                        className="text-sm font-bold text-slate-900 leading-tight"
                      >
                        {font.previewText}
                      </p>
                    </div>

                    {/* Subtext description */}
                    <div className="w-full border-t border-slate-100 pt-1.5">
                      <span className="text-[10px] text-slate-500 leading-tight block">
                        {font.subtext}
                      </span>
                    </div>

                    {isSelected && (
                      <span className="absolute top-2 right-2 h-4 w-4 bg-blue-600 text-white rounded-full flex items-center justify-center text-[10px]">
                        ✓
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Modal Footer */}
            <div className="pt-6 border-t border-slate-100 mt-6 flex items-center justify-between">
              <span className="text-xs text-slate-500">
                Selected font: <strong className="text-blue-600 font-bold">{activeFont.toUpperCase()}</strong>
              </span>
              <button
                type="button"
                onClick={() => setIsMoreFontsOpen(false)}
                className="px-5 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
export default WhiteboardStudio;
