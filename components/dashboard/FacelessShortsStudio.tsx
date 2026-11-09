/* eslint-disable @next/next/no-img-element */
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
  AlertTriangle,
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
  ArrowRight,
  ArrowLeft,
  Search,
  Wand2,
  Bookmark,
  BookmarkCheck,
  Star,
  SlidersHorizontal,
  ShieldCheck,
  Mic,
} from "lucide-react";
import { WatermarkRemoverToggle } from "@/components/dashboard/WatermarkRemoverToggle";
import { FacelessStoryboardTimeline } from "@/components/dashboard/FacelessStoryboardTimeline";
import { PlatformSafeZoneOverlay, type SafeZonePlatform } from "@/components/dashboard/PlatformSafeZoneOverlay";
import {
  AWS_BGM_TRACKS,
  getBgmTrackAudioUrl,
  THIRTY_TWO_CAPTION_STYLES,
  renderPreviewCaptionWords,
  type LibraryBgmTrack,
} from "@/components/dashboard/ImageToVideoStudio";
import { Player, type PlayerRef } from "@remotion/player";
import { FacelessShortsTemplate } from "@/remotion/templates/FACELESS_SHORTS/template";
import type { DynamicTextLayer } from "@/remotion/components/library/MultiLayerTextOverlay";
import type { DynamicImageLayer } from "@/remotion/components/library/MultiLayerImageOverlay";
import type { DynamicSvgLayer } from "@/remotion/components/library/MultiLayerSvgOverlay";
import type { DynamicEffectLayer } from "@/remotion/components/library/MultiLayerEffectsOverlay";
import type { DynamicAdjustmentLayer } from "@/remotion/components/library/MultiLayerAdjustmentOverlay";
import type { DynamicTransitionEvent } from "@/remotion/components/library/MultiLayerTransitionOverlay";
import type { DynamicMaskLayer } from "@/remotion/components/library/MultiLayerMaskOverlay";
import type { DynamicPatternLayer } from "@/remotion/components/library/MultiLayerPatternOverlay";
import type { DynamicCalloutLayer } from "@/remotion/components/library/MultiLayerCalloutOverlay";
import type { DynamicIsometricLayer } from "@/remotion/components/library/IsometricPerspectiveOverlay";
import type { DynamicGaugeLayer } from "@/remotion/components/library/MultiLayerGaugeOverlay";
import type { DynamicAudioVisualizerLayer } from "@/remotion/components/library/MultiLayerAudioVisualizerOverlay";
import type { VirtualCameraConfig } from "@/remotion/components/library/VirtualCameraLayer";
import { MASTER_THEMES, type VideoVisualTheme } from "@/services/design/visualDesignSystem";

export const SHORTS_STEPS = [
  { step: 1, title: "Upload", desc: "Voiceover & Visuals" },
  { step: 2, title: "Music", desc: "Soundtrack & Audio" },
  { step: 3, title: "Style", desc: "Captions & Pacing" },
  { step: 4, title: "Preview", desc: "9:16 Shorts Simulator" },
] as const;

// Legacy export aliases for backward compatibility
export const AWS_SHORTS_BGM_TRACKS = AWS_BGM_TRACKS;
export const TWENTY_SHORTS_CAPTION_STYLES = THIRTY_TWO_CAPTION_STYLES;

export interface FacelessBrandKit {
  id: string;
  name: string;
  creatorHandle: string;
  subtitleStyle: string;
  captionPosition: "bottom" | "center" | "top";
  captionAnimationStyle: "mrbeast" | "handwriting" | "bouncy" | "smooth" | "capsule" | "decodingyt";
  backgroundTheme: string;
  selectedBgmId: string;
  bgmVolume: number;
  enableSfx: boolean;
  denoiseVoice: boolean;
  isDefault?: boolean;
}

export const PREBUILT_BRAND_KITS: FacelessBrandKit[] = [
  {
    id: "kit-viral-beast",
    name: "Viral Beast",
    creatorHandle: "@creator",
    subtitleStyle: "mrbeast",
    captionPosition: "bottom",
    captionAnimationStyle: "bouncy",
    backgroundTheme: "solid-slate",
    selectedBgmId: "parasail",
    bgmVolume: 0.12,
    enableSfx: true,
    denoiseVoice: true,
    isDefault: false,
  },
  {
    id: "kit-docu-essay",
    name: "Docu Essay",
    creatorHandle: "@documentary",
    subtitleStyle: "vox-docu",
    captionPosition: "bottom",
    captionAnimationStyle: "smooth",
    backgroundTheme: "solid-cream",
    selectedBgmId: "19th-floor",
    bgmVolume: 0.10,
    enableSfx: true,
    denoiseVoice: true,
    isDefault: false,
  },
  {
    id: "kit-tech-glow",
    name: "Tech Alpha",
    creatorHandle: "@tech_insider",
    subtitleStyle: "neon-pulse",
    captionPosition: "bottom",
    captionAnimationStyle: "smooth",
    backgroundTheme: "neon-twilight",
    selectedBgmId: "dutty-vibe",
    bgmVolume: 0.14,
    enableSfx: true,
    denoiseVoice: true,
    isDefault: false,
  },
];

export interface FacelessCanvasTheme {
  id: string;
  name: string;
  tag: string;
  niche: string;
  description: string;
  bgHex: string;
  textColor: string;
  accentColor: string;
  isDark: boolean;
  borderPreview: string;
}

export const FACELESS_CANVAS_THEMES: FacelessCanvasTheme[] = [
  {
    id: "solid-white",
    name: "Light",
    tag: "Clean Studio",
    niche: "Productivity, Habits, Mindset & Health",
    description: "Crisp studio white (#FAFAFA) with subtle micro-dot grid. Clean, bright, and effortless reading.",
    bgHex: "#FAFAFA",
    textColor: "#0F172A",
    accentColor: "#FF5722",
    isDark: false,
    borderPreview: "border-slate-300",
  },
  {
    id: "solid-slate",
    name: "Dark",
    tag: "Obsidian Slate",
    niche: "Finance, Crypto, Crime & Mystery",
    description: "Deep obsidian slate (#0F172A) with crisp white text. Serious, cinematic, and authoritative high contrast.",
    bgHex: "#0F172A",
    textColor: "#FFFFFF",
    accentColor: "#10B981",
    isDark: true,
    borderPreview: "border-slate-800",
  },
  {
    id: "neon-twilight",
    name: "Neon",
    tag: "Cyber Glow",
    niche: "Tech, AI, Coding & Viral Trends",
    description: "Cyberpunk abyss with electric cyan & violet ambient glow. High energy aesthetic for modern hooks.",
    bgHex: "#05050A",
    textColor: "#FFFFFF",
    accentColor: "#06B6D4",
    isDark: true,
    borderPreview: "border-cyan-500/40",
  },
  {
    id: "solid-cream",
    name: "Paper",
    tag: "Vintage Kraft",
    niche: "Books, History & Storytelling",
    description: "Warm textured parchment (#FAF8F5) with deep charcoal ink. Editorial magazine storytelling look.",
    bgHex: "#FAF8F5",
    textColor: "#1C1917",
    accentColor: "#B45309",
    isDark: false,
    borderPreview: "border-amber-200",
  },
];

export interface FacelessShortsStudioProps {
  selectedFile: File | null;
  onSelectFile: (file: File | null) => void;

  topicTitle?: string;
  onTopicTitleChange?: (val: string) => void;

  creatorHandle?: string;
  onCreatorHandleChange?: (val: string) => void;

  denoiseVoice?: boolean;
  onDenoiseVoiceChange?: (val: boolean) => void;

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

  visualTheme?: string;
  onVisualThemeChange?: (themeId: string) => void;

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

  onTranscribeAndPlan?: (audioFile: File, brandNamesHint?: string) => Promise<any>;
  isPlanning?: boolean;
  planningMessage?: string;
  planningError?: string | null;
  onClearPlanningError?: () => void;

  removeAiWatermark?: boolean;
  onRemoveAiWatermarkChange?: (val: boolean) => void;
}

export function FacelessShortsStudio({
  selectedFile,
  onSelectFile,
  topicTitle = "",
  onTopicTitleChange,
  creatorHandle = "",
  onCreatorHandleChange,
  denoiseVoice = true,
  onDenoiseVoiceChange,
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
  visualTheme = "modern-saas",
  onVisualThemeChange,
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
  removeAiWatermark = true,
  onRemoveAiWatermarkChange,
}: FacelessShortsStudioProps) {
  // Audio Health & Error State
  const [audioError, setAudioError] = useState<string | null>(null);
  const [audioWarning, setAudioWarning] = useState<string | null>(null);
  const [audioHealth, setAudioHealth] = useState<{
    status: 'good' | 'silent' | 'clipping' | 'exceeds90s' | 'corrupt';
    message: string;
  } | null>(null);

  // Brand Kit State & Saved Presets
  const [savedBrandKits, setSavedBrandKits] = useState<FacelessBrandKit[]>(PREBUILT_BRAND_KITS);
  const [brandKitNameInput, setBrandKitNameInput] = useState<string>("");
  const [isBrandKitModalOpen, setIsBrandKitModalOpen] = useState<boolean>(false);
  const [brandKitSaveMessage, setBrandKitSaveMessage] = useState<string | null>(null);
  const [selectedBrandKitId, setSelectedBrandKitId] = useState<string | null>(null);

  // Stepper State
  const [currentStep, setCurrentStep] = useState<number>(1);

  // Audio Duration & Object URL
  const [audioDuration, setAudioDuration] = useState<number>(60);
  const [rawAudioDuration, setRawAudioDuration] = useState<number>(60);
  const [overlayPlatform, setOverlayPlatform] = useState<SafeZonePlatform>("youtube");
  const [studioBlueprint, setStudioBlueprint] = useState<any[]>([]);
  const [studioBrollUrls, setStudioBrollUrls] = useState<Record<number, string>>({});
  const [audioPlaybackRate, setAudioPlaybackRate] = useState<number>(1.0);
  const [audioTrimStartSec, setAudioTrimStartSec] = useState<number>(0);
  const [audioTrimEndSec, setAudioTrimEndSec] = useState<number>(90);
  const [audioPreviewUrl, setAudioPreviewUrl] = useState<string>("");
  const [customTextLayers, setCustomTextLayers] = useState<DynamicTextLayer[]>([]);
  const [customImageLayers, setCustomImageLayers] = useState<DynamicImageLayer[]>([]);
  const [customSvgLayers, setCustomSvgLayers] = useState<DynamicSvgLayer[]>([]);
  const [customEffectLayers, setCustomEffectLayers] = useState<DynamicEffectLayer[]>([]);
  const [customAdjustmentLayers, setCustomAdjustmentLayers] = useState<DynamicAdjustmentLayer[]>([]);
  const [customTransitionEvents, setCustomTransitionEvents] = useState<DynamicTransitionEvent[]>([]);
  const [customMaskLayers, setCustomMaskLayers] = useState<DynamicMaskLayer[]>([]);
  const [customPatternLayers, setCustomPatternLayers] = useState<DynamicPatternLayer[]>([]);
  const [customCalloutLayers, setCustomCalloutLayers] = useState<DynamicCalloutLayer[]>([]);
  const [customIsometricLayers, setCustomIsometricLayers] = useState<DynamicIsometricLayer[]>([]);
  const [customGaugeLayers, setCustomGaugeLayers] = useState<DynamicGaugeLayer[]>([]);
  const [customAudioVisualizerLayers, setCustomAudioVisualizerLayers] = useState<DynamicAudioVisualizerLayer[]>([]);
  const [customCameraConfig, setCustomCameraConfig] = useState<VirtualCameraConfig | undefined>(undefined);
  const [activeVisualTheme, setActiveVisualTheme] = useState<string>(visualTheme || "modern-saas");

  useEffect(() => {
    if (visualTheme) {
      setActiveVisualTheme(visualTheme);
    }
  }, [visualTheme]);

  // Music Audition State
  const [selectedBgmId, setSelectedBgmId] = useState<string>("parasail");
  const [playingBgmId, setPlayingBgmId] = useState<string | null>(null);
  const [customBgmFile, setCustomBgmFile] = useState<File | null>(null);
  const [musicCategory, setMusicCategory] = useState<string>("All");
  const audioAuditionRef = useRef<HTMLAudioElement | null>(null);

  // Caption Filter State
  const [captionCategoryTab, setCaptionCategoryTab] = useState<string>("All");
  const [captionSearchQuery, setCaptionSearchQuery] = useState<string>("");

  // Load Brand Kits from localStorage on Mount
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const saved = localStorage.getItem("itnavideo_faceless_brand_kits");
      if (saved) {
        const parsed: FacelessBrandKit[] = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setSavedBrandKits(parsed);
          const defaultKit = parsed.find((k) => k.isDefault);
          if (defaultKit) {
            applyBrandKit(defaultKit, false);
          }
        }
      }
    } catch {}
  }, []);

  const applyBrandKit = (kit: FacelessBrandKit, userTriggered = true) => {
    setSelectedBrandKitId(kit.id);
    if (onSubtitleStyleChange) onSubtitleStyleChange(kit.subtitleStyle);
    if (onCaptionPositionChange) onCaptionPositionChange(kit.captionPosition);
    if (onCaptionAnimationStyleChange) onCaptionAnimationStyleChange(kit.captionAnimationStyle);
    if (onBackgroundThemeChange) onBackgroundThemeChange(kit.backgroundTheme);
    if (onBgmVolumeChange) onBgmVolumeChange(kit.bgmVolume);
    if (onEnableSfxChange) onEnableSfxChange(kit.enableSfx);
    if (onDenoiseVoiceChange) onDenoiseVoiceChange(kit.denoiseVoice);
    if (onCreatorHandleChange) onCreatorHandleChange(kit.creatorHandle);
    setSelectedBgmId(kit.selectedBgmId || "parasail");
    if (userTriggered) {
      setBrandKitSaveMessage(`Applied preset "${kit.name}"!`);
      setTimeout(() => setBrandKitSaveMessage(null), 3500);
    }
  };

  const handleSaveBrandKit = (name: string, makeDefault: boolean) => {
    if (!name.trim()) return;
    const newKit: FacelessBrandKit = {
      id: `kit-${Date.now()}`,
      name: name.trim(),
      creatorHandle: creatorHandle || "",
      subtitleStyle: subtitleStyle || "glow-viral",
      captionPosition: captionPosition || "bottom",
      captionAnimationStyle: captionAnimationStyle || "smooth",
      backgroundTheme: backgroundTheme || "solid-white",
      selectedBgmId: selectedBgmId || "parasail",
      bgmVolume: facelessBgmVolume ?? 0.12,
      enableSfx: facelessEnableSfx ?? true,
      denoiseVoice: denoiseVoice ?? true,
      isDefault: makeDefault,
    };

    setSavedBrandKits((prev) => {
      const updated = makeDefault
        ? prev.map((k) => ({ ...k, isDefault: false }))
        : [...prev];
      const next = [newKit, ...updated.filter((k) => k.id !== newKit.id)];
      try {
        localStorage.setItem("itnavideo_faceless_brand_kits", JSON.stringify(next));
      } catch {}
      return next;
    });

    setSelectedBrandKitId(newKit.id);
    setBrandKitNameInput("");
    setIsBrandKitModalOpen(false);
    setBrandKitSaveMessage(`Saved "${newKit.name}" brand kit!`);
    setTimeout(() => setBrandKitSaveMessage(null), 4000);
  };

  const handleDeleteBrandKit = (kitId: string) => {
    setSavedBrandKits((prev) => {
      const next = prev.filter((k) => k.id !== kitId);
      try {
        localStorage.setItem("itnavideo_faceless_brand_kits", JSON.stringify(next));
      } catch {}
      return next;
    });
    if (selectedBrandKitId === kitId) setSelectedBrandKitId(null);
  };

  const handleSetDefaultBrandKit = (kitId: string) => {
    setSavedBrandKits((prev) => {
      const next = prev.map((k) => ({
        ...k,
        isDefault: k.id === kitId,
      }));
      try {
        localStorage.setItem("itnavideo_faceless_brand_kits", JSON.stringify(next));
      } catch {}
      return next;
    });
    setBrandKitSaveMessage("Default brand kit updated!");
    setTimeout(() => setBrandKitSaveMessage(null), 3000);
  };

  // Editorial Transcript Editor
  const [editableTranscript, setEditableTranscript] = useState<string>(
    "Here is the secret to 10x retention on vertical shorts. Hook your audience in the first 3 seconds, deliver continuous visual payoffs, and close with an irresistible takeaway."
  );
  const [wordToFind, setWordToFind] = useState("");
  const [wordToReplace, setWordToReplace] = useState("");
  const [replaceNotice, setReplaceNotice] = useState<string | null>(null);

  // Object URLs for uploaded visuals
  const [imageObjectUrls, setImageObjectUrls] = useState<string[]>([]);
  const [videoObjectUrls, setVideoObjectUrls] = useState<string[]>([]);

  // Remotion Player Ref & Client Mount State
  const playerRef = useRef<PlayerRef>(null);
  const [isMounted, setIsMounted] = useState<boolean>(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const previewDurationSec = Math.max(5, Math.min(90, audioDuration || 15));
  const previewDurationInFrames = Math.round(previewDurationSec * 30);

  const previewCaptions = useMemo(() => {
    const sampleWords = [
      { text: "Stop", start: 0.2, end: 0.5 },
      { text: "wasting", start: 0.5, end: 0.9 },
      { text: "hours", start: 0.9, end: 1.4 },
      { text: "on", start: 1.4, end: 1.7 },
      { text: "manual", start: 1.7, end: 2.2 },
      { text: "editing.", start: 2.2, end: 2.8 },
      { text: "This", start: 3.1, end: 3.4 },
      { text: "system", start: 3.4, end: 3.8 },
      { text: "automates", start: 3.8, end: 4.4 },
      { text: "viral", start: 4.4, end: 4.9 },
      { text: "shorts", start: 4.9, end: 5.4 },
      { text: "instantly.", start: 5.4, end: 6.0 },
    ];
    return sampleWords;
  }, []);

  const previewScenes = useMemo(() => {
    if (studioBlueprint && studioBlueprint.length > 0) {
      return studioBlueprint;
    }
    const half = Math.min(6, previewDurationSec / 2);
    return [
      {
        sceneNumber: 1,
        sceneType: "hook" as const,
        layoutType: "hook" as const,
        heading: topicTitle?.trim() || "THE 10X SHORT-FORM BLUEPRINT",
        supportingText: "Watch till the end to see the full breakdown",
        categoryPill: "KEY TAKEAWAY",
        startSec: 0,
        endSec: half,
        durationSec: half,
        narrationText: "Here is the secret to 10x retention on vertical shorts.",
        isHookScene: true,
      },
      {
        sceneNumber: 2,
        sceneType: "stat" as const,
        layoutType: "stat_card" as const,
        heading: "PROVEN IMPACT METRIC",
        supportingText: "Compound reach multiplier measured across viral channels",
        categoryPill: "THE NUMBERS",
        statValue: "+142%",
        statLabel: "AUDIENCE RETENTION",
        startSec: half,
        endSec: previewDurationSec,
        durationSec: previewDurationSec - half,
        narrationText: "Deliver continuous visual payoffs and 10x your organic growth.",
        vectorDrawingId: "mindset_focus_lane",
      },
    ];
  }, [topicTitle, previewDurationSec]);
  const [activePreviewIndex, setActivePreviewIndex] = useState<number>(0);

  // Auto-Plan with Cloud Intelligence on Voiceover Upload
  useEffect(() => {
    if (!selectedFile || audioError || !onTranscribeAndPlan) return;
    onTranscribeAndPlan(selectedFile, topicTitle)
      .then((res) => {
        if (res && res.sceneBlueprint && Array.isArray(res.sceneBlueprint)) {
          setStudioBlueprint(res.sceneBlueprint);
        }
        if (res && res.brollUrls) {
          setStudioBrollUrls(res.brollUrls);
        }
      })
      .catch((err) => console.warn("[SHORTS_AUTO_PLAN_FAIL]", err));
  }, [selectedFile, audioError]);

  // Manage Image URLs
  useEffect(() => {
    const urls = uploadedImageFiles.map((file) => URL.createObjectURL(file));
    setImageObjectUrls(urls);
    return () => {
      urls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [uploadedImageFiles]);

  // Manage Video URLs
  useEffect(() => {
    const urls = (uploadedVideoFiles || []).map((file) => URL.createObjectURL(file));
    setVideoObjectUrls(urls);
    return () => {
      urls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [uploadedVideoFiles]);

  // Clean audio preview URL on voiceover change & perform deep health analysis
  useEffect(() => {
    setAudioError(null);
    setAudioWarning(null);
    setAudioHealth(null);

    if (!selectedFile) {
      setAudioPreviewUrl("");
      return;
    }

    if (selectedFile.size === 0) {
      setAudioError("The uploaded file is empty (0 bytes). Please upload a valid voiceover audio file.");
      setAudioHealth({ status: 'corrupt', message: 'Empty 0-byte file' });
      return;
    }

    const url = URL.createObjectURL(selectedFile);
    setAudioPreviewUrl(url);

    // 1. Audio Element decoding & duration inspection
    const tempAudio = document.createElement("audio");
    tempAudio.preload = "metadata";

    tempAudio.onerror = () => {
      setAudioError("Audio file is corrupt, damaged, or in an unsupported format. Please export as standard MP3, WAV, or M4A.");
      setAudioHealth({ status: 'corrupt', message: 'Corrupted or unreadable audio format' });
    };

    tempAudio.onloadedmetadata = () => {
      const dur = tempAudio.duration;
      if (!dur || !Number.isFinite(dur)) {
        setAudioError("Unable to calculate audio duration. File may be corrupted.");
        setAudioHealth({ status: 'corrupt', message: 'Indeterminate duration' });
        return;
      }

      if (dur < 3) {
        setAudioError(`Audio is too short (${dur.toFixed(1)}s). Vertical shorts require a spoken voiceover of at least 3 seconds.`);
        setAudioHealth({ status: 'corrupt', message: 'Too short (< 3 seconds)' });
        return;
      }

      setRawAudioDuration(dur);
      if (dur > 90) {
        setAudioDuration(90);
        setAudioTrimEndSec(Math.min(90, Math.round(dur)));
        if (dur <= 95) {
          const needed = Number((dur / 89.0).toFixed(2));
          setAudioWarning(`Audio is ${Math.round(dur)}s (slightly over the 90s Shorts limit). Auto-Speedup (${needed}x) is available below to fit your entire thought without cutting.`);
          setAudioHealth({ status: 'exceeds90s', message: `Audio is ${Math.round(dur)}s (92-95s auto-speedup available)` });
        } else {
          setAudioWarning(`Audio duration is ${Math.round(dur)}s (exceeds the 90-second Shorts limit). Use the visual trimmer below or switch to 16:9 Faceless Video (up to 5 min).`);
          setAudioHealth({ status: 'exceeds90s', message: `Audio is ${Math.round(dur)}s (Exceeds 90s limit)` });
        }
      } else {
        setAudioDuration(Math.round(dur));
        setAudioHealth({ status: 'good', message: `Voiceover Ready (~${Math.round(dur)}s) • Healthy Duration` });
      }

      // 2. Client-side Web Audio loudness & silence check (lightweight slice)
      try {
        const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
        if (AudioCtx) {
          const reader = new FileReader();
          reader.onload = async (e) => {
            try {
              const buffer = e.target?.result as ArrayBuffer;
              if (buffer) {
                const ctx = new AudioCtx();
                const audioDecoded = await ctx.decodeAudioData(buffer.slice(0, 500000));
                const channelData = audioDecoded.getChannelData(0);
                let sumSquares = 0;
                let peak = 0;
                for (let i = 0; i < channelData.length; i++) {
                  const val = Math.abs(channelData[i]);
                  if (val > peak) peak = val;
                  sumSquares += val * val;
                }
                const rms = Math.sqrt(sumSquares / channelData.length);
                ctx.close();

                if (rms < 0.005) {
                  setAudioWarning("Very low voiceover volume detected (near-silent). AI Voice Isolation & Auto-Normalization will automatically boost speech clarity.");
                  setAudioHealth({ status: 'silent', message: 'Low speech volume detected (-45dB) • Auto-normalization active' });
                } else if (peak >= 0.99) {
                  setAudioWarning("High audio clipping / loud distortion detected. Studio auto-limiter will normalize audio peaks on render.");
                  setAudioHealth({ status: 'clipping', message: 'Audio clipping detected • Studio limiter will balance peaks' });
                }
              }
            } catch {
              // Non-blocking fallback
            }
          };
          reader.readAsArrayBuffer(selectedFile.slice(0, 500000));
        }
      } catch {}
    };

    tempAudio.src = url;

    return () => {
      URL.revokeObjectURL(url);
    };
  }, [selectedFile]);

  // Stop audition audio on unmount
  useEffect(() => {
    return () => {
      if (audioAuditionRef.current) {
        audioAuditionRef.current.pause();
        audioAuditionRef.current = null;
      }
    };
  }, []);

  const handleToggleAudition = (track: LibraryBgmTrack) => {
    if (track.id === "none") {
      if (audioAuditionRef.current) audioAuditionRef.current.pause();
      setPlayingBgmId(null);
      return;
    }

    if (playingBgmId === track.id) {
      if (audioAuditionRef.current) audioAuditionRef.current.pause();
      setPlayingBgmId(null);
    } else {
      if (audioAuditionRef.current) audioAuditionRef.current.pause();
      const url = getBgmTrackAudioUrl(track);
      const audio = new Audio(url);
      audio.volume = Math.max(0.1, Math.min(1, (facelessBgmVolume || 0.12) * 2.5));
      audio.play().catch(() => {});
      audio.onended = () => setPlayingBgmId(null);
      audioAuditionRef.current = audio;
      setPlayingBgmId(track.id);
    }
  };

  // Image & Video file additions
  const handleAddImages = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    onUploadedImageFilesChange([...uploadedImageFiles, ...Array.from(files)]);
    if (e.target) e.target.value = "";
  };

  const handleRemoveImage = (idx: number) => {
    const copy = [...uploadedImageFiles];
    copy.splice(idx, 1);
    onUploadedImageFilesChange(copy);
  };

  const handleAddVideos = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0 || !onUploadedVideoFilesChange) return;
    onUploadedVideoFilesChange([...(uploadedVideoFiles || []), ...Array.from(files)]);
    if (e.target) e.target.value = "";
  };

  const handleRemoveVideo = (idx: number) => {
    if (!onUploadedVideoFilesChange || !uploadedVideoFiles) return;
    const copy = [...uploadedVideoFiles];
    copy.splice(idx, 1);
    onUploadedVideoFilesChange(copy);
  };

  // Music filter
  const filteredTracks = useMemo(() => {
    if (musicCategory === "All") return AWS_BGM_TRACKS;
    return AWS_BGM_TRACKS.filter((t) => t.category.toLowerCase() === musicCategory.toLowerCase());
  }, [musicCategory]);

  const musicCategories = useMemo(() => {
    const cats = Array.from(new Set(AWS_BGM_TRACKS.map((t) => t.category))).filter((c) => c !== "Mute");
    return ["All", ...cats, "Mute"];
  }, []);

  // Caption filter
  const filteredCaptionStyles = useMemo(() => {
    let result = THIRTY_TWO_CAPTION_STYLES;
    if (captionCategoryTab !== "All") {
      result = result.filter((s) => s.category.toLowerCase() === captionCategoryTab.toLowerCase());
    }
    if (captionSearchQuery.trim()) {
      const q = captionSearchQuery.toLowerCase();
      result = result.filter(
        (s) => s.name.toLowerCase().includes(q) || s.description.toLowerCase().includes(q)
      );
    }
    return result;
  }, [captionCategoryTab, captionSearchQuery]);

  const captionCategories = useMemo(() => {
    const cats = Array.from(new Set(THIRTY_TWO_CAPTION_STYLES.map((s) => s.category)));
    return ["All", ...cats];
  }, []);

  // Word Replacer
  const applyWordReplacement = () => {
    if (!wordToFind.trim()) return;
    const pattern = new RegExp(wordToFind.trim(), "gi");
    const updated = editableTranscript.replace(pattern, wordToReplace.trim());
    if (updated !== editableTranscript) {
      setEditableTranscript(updated);
      setReplaceNotice(`Replaced "${wordToFind}" with "${wordToReplace}"`);
      setTimeout(() => setReplaceNotice(null), 3000);
      setWordToFind("");
      setWordToReplace("");
    } else {
      setReplaceNotice(`"${wordToFind}" was not found in transcript.`);
      setTimeout(() => setReplaceNotice(null), 3000);
    }
  };

  // Preview Helpers
  const selectedTrackObj = useMemo(() => {
    return AWS_BGM_TRACKS.find((t) => t.id === selectedBgmId) || AWS_BGM_TRACKS[0];
  }, [selectedBgmId]);

  const allPreviewMedia = useMemo(() => {
    const list: Array<{ url: string; type: "image" | "video"; name: string }> = [];
    imageObjectUrls.forEach((url, i) => {
      list.push({ url, type: "image", name: uploadedImageFiles[i]?.name || `Image #${i + 1}` });
    });
    videoObjectUrls.forEach((url, i) => {
      list.push({ url, type: "video", name: (uploadedVideoFiles || [])[i]?.name || `Clip #${i + 1}` });
    });
    return list;
  }, [imageObjectUrls, videoObjectUrls, uploadedImageFiles, uploadedVideoFiles]);

  const activeMedia = allPreviewMedia[activePreviewIndex] || allPreviewMedia[0];

  const canProceedToMusic = Boolean(selectedFile) && !audioError;
  const totalAssetsCount = uploadedImageFiles.length + (uploadedVideoFiles ? uploadedVideoFiles.length : 0);

  return (
    <div className="w-full flex-1 flex flex-col min-h-0 bg-slate-50/50">
      {/* 4-Step Stepper Bar */}
      <div className="bg-white border-b border-slate-200/80 px-4 sm:px-8 py-3.5 shrink-0 shadow-2xs">
        <div className="max-w-5xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
          {SHORTS_STEPS.map((s) => {
            const isActive = currentStep === s.step;
            const isCompleted = currentStep > s.step;
            return (
              <button
                key={s.step}
                type="button"
                onClick={() => setCurrentStep(s.step)}
                className={`flex items-center gap-2.5 p-2 rounded-xl border text-left transition-all ${
                  isActive
                    ? "bg-orange-50/80 border-orange-200 text-orange-950 ring-1 ring-orange-400/40 shadow-xs"
                    : isCompleted
                    ? "bg-slate-50 border-slate-200/80 text-slate-700 hover:bg-slate-100/80 cursor-pointer"
                    : "bg-white/60 border-slate-200/60 text-slate-400 hover:text-slate-600 cursor-pointer"
                }`}
              >
                <div
                  className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-xs font-black transition-all ${
                    isActive
                      ? "bg-orange-600 text-white shadow-2xs"
                      : isCompleted
                      ? "bg-emerald-600 text-white"
                      : "bg-slate-100 text-slate-500 border border-slate-200"
                  }`}
                >
                  {isCompleted ? <Check size={14} strokeWidth={3} /> : s.step}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-black truncate leading-tight tracking-tight">
                    {s.title}
                  </p>
                  <p className="text-[10px] text-slate-500 truncate leading-tight font-medium mt-0.5">
                    {s.desc}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Studio Body */}
      <div className="flex-1 overflow-y-auto px-4 sm:px-8 py-6">
        <div className="max-w-5xl mx-auto space-y-6">

          {/* STEP 1: Upload (Voiceover & Visual Media) */}
          {currentStep === 1 && (
            <div className="space-y-6 animate-fadeIn">
              {/* Topic Headline Card */}
              <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-black text-slate-800 uppercase tracking-wider flex items-center gap-2">
                    <Tag size={14} className="text-orange-600" />
                    Shorts Topic / Title
                  </label>
                  <span className="text-[11px] font-semibold text-slate-400">Optional</span>
                </div>
                <input
                  type="text"
                  value={topicTitle}
                  onChange={(e) => onTopicTitleChange && onTopicTitleChange(e.target.value)}
                  placeholder="e.g. 3 Psychological Tricks to Double Your Productivity..."
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 placeholder:text-slate-400 text-xs font-medium focus:bg-white focus:border-orange-500 focus:outline-none transition shadow-2xs"
                />
              </div>

              {/* Primary Audio Narration Upload */}
              <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-50 border border-orange-200 text-orange-600">
                      <Music size={20} />
                    </div>
                    <div>
                      <h3 className="text-sm font-black text-slate-900">
                        Voiceover Narration Audio
                      </h3>
                      <p className="text-xs text-slate-500">
                        Upload spoken audio voiceover (.mp3, .wav, .m4a, .aac) up to 90 seconds
                      </p>
                    </div>
                  </div>
                  {selectedFile && (
                    <span className={`text-xs font-black px-2.5 py-1 rounded-full border ${
                      audioError
                        ? "bg-rose-50 text-rose-700 border-rose-200"
                        : audioWarning
                        ? "bg-amber-50 text-amber-700 border-amber-200"
                        : "bg-emerald-50 text-emerald-700 border-emerald-200"
                    }`}>
                      {audioError ? "Error in Audio" : `~${audioDuration}s Loaded`}
                    </span>
                  )}
                </div>

                {/* Audio Corrupted / Invalid Error Banner */}
                {audioError && (
                  <div className="flex items-start gap-3 rounded-xl border border-rose-200 bg-rose-50/80 p-4 text-rose-900 animate-fadeIn">
                    <AlertCircle size={18} className="text-rose-600 shrink-0 mt-0.5" />
                    <div className="text-xs space-y-1 flex-1">
                      <p className="font-black text-rose-950">Audio Error Detected</p>
                      <p className="text-rose-700 leading-relaxed">{audioError}</p>
                    </div>
                  </div>
                )}

                {/* Audio Duration (>90s) / Volume Notice Banner */}
                {!audioError && audioWarning && (
                  <div className="flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50/80 p-4 text-amber-900 animate-fadeIn">
                    <AlertTriangle size={18} className="text-amber-600 shrink-0 mt-0.5" />
                    <div className="text-xs space-y-1.5 flex-1">
                      <p className="font-black text-amber-950">Audio Optimization Notice</p>
                      <p className="text-amber-800 leading-relaxed">{audioWarning}</p>
                      {audioDurationSec > 90 && (
                        <div className="pt-1">
                          <a
                            href="/dashboard/faceless-video"
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-bold text-[11px] transition shadow-xs cursor-pointer"
                          >
                            Switch to 16:9 Faceless Video (Up to 5 Min)
                            <ArrowRight size={13} />
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {selectedFile ? (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between gap-3 rounded-xl border border-emerald-200 bg-emerald-50/40 p-4">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className={`flex h-10 w-10 items-center justify-center rounded-lg text-white shrink-0 ${
                          audioError ? "bg-rose-600" : "bg-emerald-600"
                        }`}>
                          {audioError ? <AlertCircle size={20} /> : <Check size={20} />}
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-black text-slate-900 truncate">
                            {selectedFile.name}
                          </p>
                          <p className="text-[11px] text-slate-500">
                            {(selectedFile.size / (1024 * 1024)).toFixed(1)} MB • {audioError ? "Upload replacement file" : "Voiceover Ready"}
                          </p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => onSelectFile(null)}
                        className="p-2 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition cursor-pointer"
                        title="Remove Voiceover"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>

                    {/* Auto-Speedup Option for 91s - 95s Audio */}
                    {rawAudioDuration > 90 && rawAudioDuration <= 95 && (
                      <div className="flex items-center justify-between p-3.5 rounded-xl bg-orange-50 border border-orange-200 text-orange-950 animate-fadeIn">
                        <div className="flex items-start gap-2.5 min-w-0 pr-3">
                          <Zap size={16} className="text-orange-600 shrink-0 mt-0.5" />
                          <div className="text-xs">
                            <p className="font-bold text-orange-950">
                              Auto-Fit into 90s Limit ({Math.round(rawAudioDuration)}s → 89s)
                            </p>
                            <p className="text-[11px] text-orange-800 leading-relaxed mt-0.5">
                              Pacing speedup ({(rawAudioDuration / 89).toFixed(2)}x) fits your complete voiceover &amp; final thought cleanly without cutting.
                            </p>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            const rate = Number((rawAudioDuration / 89).toFixed(2));
                            setAudioPlaybackRate((prev) => (prev > 1.0 ? 1.0 : rate));
                          }}
                          className={`shrink-0 px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                            audioPlaybackRate > 1.0
                              ? "bg-orange-600 text-white shadow-xs"
                              : "bg-white border border-orange-300 text-orange-700 hover:bg-orange-100"
                          }`}
                        >
                          {audioPlaybackRate > 1.0 ? `Speedup Active (${audioPlaybackRate}x)` : `Enable ${(rawAudioDuration / 89).toFixed(2)}x`}
                        </button>
                      </div>
                    )}

                    {/* Visual Audio Trimmer for >95s Audio */}
                    {rawAudioDuration > 95 && (
                      <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3 animate-fadeIn">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <SlidersHorizontal size={14} className="text-orange-600" />
                            <span className="text-xs font-bold text-slate-800">
                              Visual Audio Trimmer (Max 90s Range)
                            </span>
                          </div>
                          <span className="text-[11px] font-bold text-orange-600">
                            Selected: {audioTrimStartSec}s – {Math.min(audioTrimStartSec + 90, Math.round(rawAudioDuration))}s ({Math.min(90, Math.round(rawAudioDuration) - audioTrimStartSec)}s clip)
                          </span>
                        </div>
                        <div className="space-y-1.5">
                          <input
                            type="range"
                            min={0}
                            max={Math.max(0, Math.round(rawAudioDuration) - 90)}
                            value={audioTrimStartSec}
                            onChange={(e) => {
                              const start = Number(e.target.value);
                              setAudioTrimStartSec(start);
                              setAudioTrimEndSec(Math.min(start + 90, Math.round(rawAudioDuration)));
                            }}
                            className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-orange-600"
                          />
                          <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                            <span>Start: {audioTrimStartSec}s</span>
                            <span>End of file: {Math.round(rawAudioDuration)}s</span>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Audio Health Diagnostic Pill */}
                    {audioHealth && (
                      <div className="flex items-center justify-between px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-[11px]">
                        <div className="flex items-center gap-2 min-w-0">
                          {audioHealth.status === 'good' ? (
                            <CheckCircle2 size={14} className="text-emerald-600 shrink-0" />
                          ) : audioHealth.status === 'exceeds90s' ? (
                            <AlertTriangle size={14} className="text-amber-600 shrink-0" />
                          ) : audioHealth.status === 'corrupt' ? (
                            <AlertCircle size={14} className="text-rose-600 shrink-0" />
                          ) : (
                            <SlidersHorizontal size={14} className="text-blue-600 shrink-0" />
                          )}
                          <span className="font-bold text-slate-800 truncate">{audioHealth.message}</span>
                        </div>
                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider shrink-0 ml-2">
                          Audio Diagnostics
                        </span>
                      </div>
                    )}
                  </div>
                ) : (
                  <label className="relative flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-300 hover:border-orange-500 bg-slate-50/60 hover:bg-orange-50/20 p-8 text-center transition cursor-pointer group">
                    <input
                      type="file"
                      accept="audio/mp3,audio/wav,audio/m4a,audio/aac,audio/ogg"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) onSelectFile(file);
                      }}
                      className="hidden"
                    />
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white border border-slate-200 text-orange-600 shadow-xs group-hover:scale-105 transition mb-2.5">
                      <Upload size={20} />
                    </div>
                    <p className="text-xs font-black text-slate-800">
                      Click to browse or drop narration audio here
                    </p>
                    <p className="text-[11px] text-slate-500 mt-1">
                      Up to 90 seconds (90s max) • Strictly 9:16 Vertical Shorts
                    </p>
                  </label>
                )}

                {/* Speaker & Background Noise Suppression Toggle */}
                <div className="pt-3 border-t border-slate-200/80 flex items-center justify-between">
                  <div className="flex items-start gap-2.5 pr-3">
                    <div className="p-1.5 rounded-lg bg-orange-50 border border-orange-200 text-orange-600 mt-0.5 shrink-0">
                      <ShieldCheck size={16} />
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="text-xs font-black text-slate-900">
                          AI Studio Voice Isolation &amp; De-Noise
                        </span>
                        <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 uppercase tracking-wider">
                          Recommended
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 leading-relaxed mt-0.5">
                        Filters ceiling fan hum, AC rumble, room reverb, street traffic, and phone mic distortion for 99.8% transcription accuracy.
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => onDenoiseVoiceChange && onDenoiseVoiceChange(!denoiseVoice)}
                    className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                      denoiseVoice ? "bg-orange-600" : "bg-slate-200"
                    }`}
                  >
                    <span
                      className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                        denoiseVoice ? "translate-x-5" : "translate-x-0"
                      }`}
                    />
                  </button>
                </div>
              </div>

              {/* Supporting Visual Media (Images & Video Clips) */}
              <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 border border-blue-200 text-blue-600">
                      <Layers size={20} />
                    </div>
                    <div>
                      <h3 className="text-sm font-black text-slate-900">
                        Supporting Visual Media (Images &amp; B-Roll)
                      </h3>
                      <p className="text-xs text-slate-500">
                        Add screenshots, diagrams, product images, or B-roll video clips
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <label className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-bold transition cursor-pointer shadow-2xs">
                      <Plus size={14} />
                      <span>Add Images</span>
                      <input
                        type="file"
                        multiple
                        accept="image/png,image/jpeg,image/webp"
                        onChange={handleAddImages}
                        className="hidden"
                      />
                    </label>
                    <label className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-bold transition cursor-pointer shadow-2xs">
                      <Plus size={14} />
                      <span>Add Video Clips</span>
                      <input
                        type="file"
                        multiple
                        accept="video/mp4,video/quicktime,video/webm"
                        onChange={handleAddVideos}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>

                {totalAssetsCount === 0 ? (
                  <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50/50 p-6 text-center">
                    <p className="text-xs font-semibold text-slate-500">
                      No custom visuals added. The AI director will use rich animated vector illustrations, typographic hooks, and SVG diagrams automatically.
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3 pt-1">
                    {uploadedImageFiles.map((file, idx) => (
                      <div
                        key={`img-${idx}`}
                        className="group relative aspect-square rounded-xl overflow-hidden border border-slate-200 bg-slate-900 shadow-2xs"
                      >
                        <img
                          src={imageObjectUrls[idx]}
                          alt={file.name}
                          className="h-full w-full object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveImage(idx)}
                          className="absolute top-1 right-1 p-1 rounded-md bg-black/70 text-white hover:bg-rose-600 transition opacity-0 group-hover:opacity-100"
                          title="Remove Image"
                        >
                          <X size={12} />
                        </button>
                        <span className="absolute bottom-1 left-1 px-1 rounded bg-black/70 text-[9px] font-bold text-white">
                          IMG #{idx + 1}
                        </span>
                      </div>
                    ))}

                    {(uploadedVideoFiles || []).map((file, idx) => (
                      <div
                        key={`vid-${idx}`}
                        className="group relative aspect-square rounded-xl overflow-hidden border border-slate-200 bg-slate-900 shadow-2xs"
                      >
                        <video
                          src={videoObjectUrls[idx]}
                          className="h-full w-full object-cover"
                          muted
                          playsInline
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveVideo(idx)}
                          className="absolute top-1 right-1 p-1 rounded-md bg-black/70 text-white hover:bg-rose-600 transition opacity-0 group-hover:opacity-100"
                          title="Remove Video Clip"
                        >
                          <X size={12} />
                        </button>
                        <span className="absolute bottom-1 left-1 px-1 rounded bg-black/70 text-[9px] font-bold text-white">
                          CLIP #{idx + 1}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Next Button */}
              <div className="flex justify-end pt-2">
                <button
                  type="button"
                  disabled={!canProceedToMusic}
                  onClick={() => setCurrentStep(2)}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-orange-600 hover:bg-orange-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-black text-xs shadow-md shadow-orange-600/20 transition cursor-pointer active:scale-98"
                >
                  <span>Next: Soundtrack &amp; Audio</span>
                  <ArrowRight size={16} />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: Music (Soundtrack & Audio Design) */}
          {currentStep === 2 && (
            <div className="space-y-6 animate-fadeIn">
              <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-50 border border-orange-200 text-orange-600">
                      <Music size={20} />
                    </div>
                    <div>
                      <h3 className="text-sm font-black text-slate-900">
                        14 Curated AWS S3 Background Tracks
                      </h3>
                      <p className="text-xs text-slate-500">
                        Ducked automatically during spoken narration
                      </p>
                    </div>
                  </div>

                  {/* Category Pills */}
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {musicCategories.map((cat) => (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => setMusicCategory(cat)}
                        className={`text-[11px] font-bold px-2.5 py-1 rounded-full transition cursor-pointer ${
                          musicCategory === cat
                            ? "bg-orange-600 text-white shadow-2xs"
                            : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Tracks Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {filteredTracks.map((track) => {
                    const isSelected = selectedBgmId === track.id;
                    const isAuditioning = playingBgmId === track.id;
                    return (
                      <div
                        key={track.id}
                        onClick={() => setSelectedBgmId(track.id)}
                        className={`group relative flex items-center justify-between p-3.5 rounded-xl border transition-all cursor-pointer ${
                          isSelected
                            ? "border-orange-500 bg-orange-50/50 shadow-xs ring-1 ring-orange-400/40"
                            : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/60"
                        }`}
                      >
                        <div className="min-w-0 flex-1 pr-2">
                          <div className="flex items-center gap-1.5">
                            <p className="text-xs font-black text-slate-900 truncate">
                              {track.label}
                            </p>
                            {isSelected && (
                              <CheckCircle2 size={14} className="text-orange-600 shrink-0" />
                            )}
                          </div>
                          <p className="text-[11px] text-slate-500 truncate mt-0.5">
                            {track.desc}
                          </p>
                        </div>

                        {track.id !== "none" && (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleToggleAudition(track);
                            }}
                            className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border transition ${
                              isAuditioning
                                ? "bg-orange-600 border-orange-600 text-white"
                                : "bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-700"
                            }`}
                            title={isAuditioning ? "Pause Preview" : "Play Preview"}
                          >
                            {isAuditioning ? <Pause size={13} /> : <Play size={13} className="ml-0.5" />}
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Volume Slider & Custom Upload */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3 border-t border-slate-200/80">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-black text-slate-800 flex items-center gap-1.5">
                        <Volume2 size={14} className="text-orange-600" />
                        BGM Ducking Volume
                      </label>
                      <span className="text-xs font-bold text-slate-600">
                        {Math.round((facelessBgmVolume || 0.12) * 100)}%
                      </span>
                    </div>
                    <input
                      type="range"
                      min={0}
                      max={0.5}
                      step={0.01}
                      value={facelessBgmVolume}
                      onChange={(e) => onBgmVolumeChange && onBgmVolumeChange(parseFloat(e.target.value))}
                      className="w-full accent-orange-600 cursor-pointer"
                    />
                    <p className="text-[10px] text-slate-500">
                      Standard YouTube Shorts default is 12% to keep narration clear.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-black text-slate-800 flex items-center gap-1.5">
                      <Upload size={14} className="text-orange-600" />
                      Custom Audio Upload
                    </label>
                    <div className="flex items-center gap-2">
                      <label className="flex-1 px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-semibold truncate transition cursor-pointer text-center">
                        {customBgmFile ? customBgmFile.name : "Upload MP3/WAV"}
                        <input
                          type="file"
                          accept="audio/mp3,audio/wav,audio/m4a,audio/aac"
                          onChange={(e) => {
                            const f = e.target.files?.[0];
                            if (f) setCustomBgmFile(f);
                          }}
                          className="hidden"
                        />
                      </label>
                      {customBgmFile && (
                        <button
                          type="button"
                          onClick={() => setCustomBgmFile(null)}
                          className="p-2 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-500 hover:text-rose-600 transition"
                          title="Clear Custom Audio"
                        >
                          <X size={14} />
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {/* SFX Toggle */}
                <div className="pt-3 border-t border-slate-200/80 flex items-center justify-between">
                  <div>
                    <p className="text-xs font-black text-slate-900">
                      Dynamic Transition Sound Effects (SFX)
                    </p>
                    <p className="text-[11px] text-slate-500">
                      Subtle whoosh &amp; pop cues on scene cuts and visual callouts
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => onEnableSfxChange && onEnableSfxChange(!facelessEnableSfx)}
                    className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                      facelessEnableSfx ? "bg-orange-600" : "bg-slate-200"
                    }`}
                  >
                    <span
                      className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                        facelessEnableSfx ? "translate-x-5" : "translate-x-0"
                      }`}
                    />
                  </button>
                </div>
              </div>

              {/* Navigation */}
              <div className="flex items-center justify-between pt-2">
                <button
                  type="button"
                  onClick={() => setCurrentStep(1)}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs shadow-2xs transition cursor-pointer"
                >
                  <ArrowLeft size={16} />
                  <span>Back to Upload</span>
                </button>
                <button
                  type="button"
                  onClick={() => setCurrentStep(3)}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-black text-xs shadow-md shadow-orange-600/20 transition cursor-pointer active:scale-98"
                >
                  <span>Next: Style &amp; Captions</span>
                  <ArrowRight size={16} />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: Style (Captions & Pacing) */}
          {currentStep === 3 && (
            <div className="space-y-6 animate-fadeIn">
              {/* Creator Brand Kit & Saved Style Presets Card */}
              <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-50 border border-orange-200 text-orange-600">
                      <Bookmark size={20} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm font-black text-slate-900">
                          Creator Brand Kit &amp; Style Presets
                        </h3>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-orange-50 text-orange-700 border border-orange-200">
                          1-Click Reuse
                        </span>
                      </div>
                      <p className="text-xs text-slate-500">
                        Save your theme, caption preset, soundtrack, and watermark handle to reuse across every video
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setIsBrandKitModalOpen(!isBrandKitModalOpen)}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-orange-200 bg-orange-50 hover:bg-orange-100/70 text-orange-950 font-bold text-xs transition cursor-pointer shadow-2xs shrink-0 self-start sm:self-auto"
                  >
                    <BookmarkCheck size={14} className="text-orange-600" />
                    <span>Save Current as Brand Kit</span>
                  </button>
                </div>

                {/* Save Confirmation Message */}
                {brandKitSaveMessage && (
                  <div className="flex items-center gap-2 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-bold animate-fadeIn">
                    <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
                    <span>{brandKitSaveMessage}</span>
                  </div>
                )}

                {/* Save New Brand Kit Form */}
                {isBrandKitModalOpen && (
                  <div className="p-4 rounded-xl border border-orange-200 bg-orange-50/40 space-y-3 animate-fadeIn">
                    <p className="text-xs font-black text-slate-900">
                      Save Current Configuration as a Brand Preset
                    </p>
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                      <input
                        type="text"
                        value={brandKitNameInput}
                        onChange={(e) => setBrandKitNameInput(e.target.value)}
                        placeholder="e.g. My Channel Brand (Dark Slate + Beast Captions)"
                        className="flex-1 px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs text-slate-900 focus:outline-none focus:border-orange-500 shadow-2xs font-medium"
                      />
                      <button
                        type="button"
                        onClick={() => handleSaveBrandKit(brandKitNameInput, false)}
                        disabled={!brandKitNameInput.trim()}
                        className="px-4 py-2 rounded-xl bg-orange-600 hover:bg-orange-500 disabled:opacity-40 text-white font-bold text-xs shadow-2xs transition cursor-pointer"
                      >
                        Save Preset
                      </button>
                      <button
                        type="button"
                        onClick={() => handleSaveBrandKit(brandKitNameInput, true)}
                        disabled={!brandKitNameInput.trim()}
                        className="px-4 py-2 rounded-xl border border-orange-300 bg-white hover:bg-orange-50 text-orange-800 font-bold text-xs shadow-2xs transition cursor-pointer flex items-center gap-1 justify-center"
                      >
                        <Star size={13} className="text-orange-600 fill-orange-500" />
                        <span>Save &amp; Set Default</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setIsBrandKitModalOpen(false)}
                        className="p-2 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-500 text-xs transition"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  </div>
                )}

                {/* Creator Channel Handle / Watermark Input */}
                <div className="space-y-1.5 pt-1">
                  <label className="text-xs font-black text-slate-800 flex items-center gap-1.5 uppercase tracking-wider">
                    <Tag size={13} className="text-orange-600" />
                    <span>Channel Watermark &amp; Creator Handle</span>
                    <span className="text-[10px] font-semibold text-slate-400 capitalize">(Optional)</span>
                  </label>
                  <div className="flex items-center gap-2">
                    <div className="relative flex-1">
                      <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-xs">@</span>
                      <input
                        type="text"
                        value={creatorHandle.replace(/^@/, '')}
                        onChange={(e) => onCreatorHandleChange && onCreatorHandleChange(e.target.value ? `@${e.target.value.replace(/^@/, '')}` : '')}
                        placeholder="yourchannel (e.g. founder_daily)"
                        className="w-full pl-8 pr-4 py-2 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 placeholder:text-slate-400 text-xs font-bold focus:bg-white focus:border-orange-500 focus:outline-none transition shadow-2xs"
                      />
                    </div>
                    {creatorHandle && (
                      <span className="text-[11px] font-bold px-3 py-2 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 shrink-0">
                        Watermark HUD Active
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-500">
                    Renders an official subtle channel chip in the top-right safe zone of your vertical video.
                  </p>
                </div>

                {/* Saved Brand Kits Selector Grid */}
                <div className="pt-2 border-t border-slate-200/80 space-y-2.5">
                  <span className="text-[11px] font-black text-slate-700 uppercase tracking-wider block">
                    Quick-Load Presets &amp; Brand Kits
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                    {savedBrandKits.map((kit) => {
                      const isActive = selectedBrandKitId === kit.id;
                      return (
                        <div
                          key={kit.id}
                          onClick={() => applyBrandKit(kit)}
                          className={`group relative flex items-center justify-between p-3 rounded-xl border text-left transition-all cursor-pointer ${
                            isActive
                              ? "border-orange-500 bg-orange-50/60 ring-1 ring-orange-400/40 shadow-xs"
                              : "border-slate-200 bg-slate-50/60 hover:bg-slate-100 hover:border-slate-300"
                          }`}
                        >
                          <div className="min-w-0 flex-1 pr-2">
                            <div className="flex items-center gap-1.5">
                              <span className="text-xs font-black text-slate-900 truncate">
                                {kit.name}
                              </span>
                              {kit.isDefault && (
                                <span className="inline-flex items-center gap-0.5 text-[9px] font-black px-1.5 py-0.2 rounded-full bg-amber-50 text-amber-700 border border-amber-200 shrink-0">
                                  <Star size={9} className="fill-amber-500 text-amber-600" />
                                  Default
                                </span>
                              )}
                            </div>
                            <p className="text-[10px] text-slate-500 truncate mt-0.5">
                              {kit.backgroundTheme} • {kit.subtitleStyle} • {kit.creatorHandle || 'No handle'}
                            </p>
                          </div>

                          <div className="flex items-center gap-1 shrink-0" onClick={(e) => e.stopPropagation()}>
                            {!kit.isDefault && (
                              <button
                                type="button"
                                onClick={() => handleSetDefaultBrandKit(kit.id)}
                                className="p-1 rounded-md text-slate-400 hover:text-amber-600 hover:bg-amber-50 transition"
                                title="Make Default Preset"
                              >
                                <Star size={13} />
                              </button>
                            )}
                            {kit.id.startsWith("kit-") && !kit.id.startsWith("kit-viral") && !kit.id.startsWith("kit-docu") && !kit.id.startsWith("kit-tech") && (
                              <button
                                type="button"
                                onClick={() => handleDeleteBrandKit(kit.id)}
                                className="p-1 rounded-md text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition"
                                title="Delete Custom Kit"
                              >
                                <Trash2 size={13} />
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
              {/* 32 Caption Styles Card */}
              <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-50 border border-orange-200 text-orange-600">
                      <FileText size={20} />
                    </div>
                    <div>
                      <h3 className="text-sm font-black text-slate-900">
                        32 Animated Kinetic &amp; Viral Caption Styles
                      </h3>
                      <p className="text-xs text-slate-500">
                        Master vertical presets with millisecond word synchronization
                      </p>
                    </div>
                  </div>

                  {/* Search Bar */}
                  <div className="relative w-full sm:w-64">
                    <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      value={captionSearchQuery}
                      onChange={(e) => setCaptionSearchQuery(e.target.value)}
                      placeholder="Search styles..."
                      className="w-full pl-8 pr-3 py-1.5 rounded-xl border border-slate-200 bg-slate-50 text-xs text-slate-800 placeholder:text-slate-400 focus:bg-white focus:border-orange-500 focus:outline-none transition shadow-2xs"
                    />
                  </div>
                </div>

                {/* Category Pills */}
                <div className="flex items-center gap-1.5 flex-wrap">
                  {captionCategories.map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setCaptionCategoryTab(cat)}
                      className={`text-[11px] font-bold px-2.5 py-1 rounded-full transition cursor-pointer ${
                        captionCategoryTab === cat
                          ? "bg-orange-600 text-white shadow-2xs"
                          : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>

                {/* Caption Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 max-h-[340px] overflow-y-auto pr-1">
                  {filteredCaptionStyles.map((style) => {
                    const isSelected = subtitleStyle === style.id;
                    return (
                      <button
                        key={style.id}
                        type="button"
                        onClick={() => onSubtitleStyleChange && onSubtitleStyleChange(style.id)}
                        className={`group relative flex flex-col items-center justify-between p-3 rounded-xl border text-center transition cursor-pointer min-h-[110px] ${
                          isSelected
                            ? "border-orange-500 bg-orange-50/50 shadow-xs ring-1 ring-orange-400/40"
                            : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/60"
                        }`}
                      >
                        <div className="w-full h-12 flex items-center justify-center rounded-lg bg-slate-950 p-2 overflow-hidden shadow-inner">
                          {renderPreviewCaptionWords(style.id)}
                        </div>

                        <div className="w-full mt-2">
                          <p className="text-[11px] font-black text-slate-800 truncate">
                            {style.name}
                          </p>
                          <span className="text-[9px] font-semibold text-slate-400 uppercase tracking-wider block">
                            {style.category}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Caption Position & Animation Style */}
              <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-4">
                <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider">
                  Caption Layout &amp; Animation Dynamics
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1.5">
                      Vertical Safe-Zone Placement
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {(["bottom", "center", "top"] as const).map((pos) => (
                        <button
                          key={pos}
                          type="button"
                          onClick={() => onCaptionPositionChange && onCaptionPositionChange(pos)}
                          className={`py-2 rounded-xl text-xs font-bold capitalize transition border ${
                            captionPosition === pos
                              ? "bg-orange-600 border-orange-600 text-white shadow-2xs"
                              : "bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100"
                          }`}
                        >
                          {pos}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1.5">
                      Animation Flavor
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {(["smooth", "bouncy", "capsule"] as const).map((flavor) => (
                        <button
                          key={flavor}
                          type="button"
                          onClick={() =>
                            onCaptionAnimationStyleChange &&
                            onCaptionAnimationStyleChange(flavor as any)
                          }
                          className={`py-2 rounded-xl text-xs font-bold capitalize transition border ${
                            captionAnimationStyle === flavor
                              ? "bg-orange-600 border-orange-600 text-white shadow-2xs"
                              : "bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100"
                          }`}
                        >
                          {flavor}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Unified Visual Design System (12-System Master Theme Engine) */}
              <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider flex items-center gap-2">
                      <Sparkles size={14} className="text-orange-600" />
                      Unified Visual Design System (Shared Brand Language)
                    </h4>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Controls typography, colors, backgrounds, SVGs, images, shapes, and motion with 100% aesthetic harmony across all scenes
                    </p>
                  </div>
                  <span className="text-[11px] font-bold text-orange-600 bg-orange-50 border border-orange-200 px-2.5 py-1 rounded-full shrink-0">
                    6 Master Themes
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {Object.values(MASTER_THEMES).map((theme) => {
                    const isSelected = activeVisualTheme === theme.id;
                    return (
                      <button
                        key={theme.id}
                        type="button"
                        onClick={() => {
                          setActiveVisualTheme(theme.id);
                          onVisualThemeChange?.(theme.id);
                        }}
                        className={`group relative flex flex-col p-4 rounded-xl border text-left transition cursor-pointer ${
                          isSelected
                            ? "border-orange-500 bg-orange-50/40 shadow-xs ring-2 ring-orange-400/40"
                            : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/60"
                        }`}
                      >
                        {/* Theme Header & Check */}
                        <div className="flex items-center justify-between w-full mb-2.5">
                          <span className="text-xs font-black text-slate-900 tracking-tight">
                            {theme.name}
                          </span>
                          {isSelected && (
                            <div className="flex h-5 w-5 items-center justify-center rounded-full bg-orange-600 text-white shadow-xs">
                              <Check size={12} strokeWidth={3} />
                            </div>
                          )}
                        </div>

                        {/* Palette Preview Swatches */}
                        <div
                          className="w-full h-12 rounded-lg mb-3 flex items-center justify-between px-3 border shadow-inner"
                          style={{
                            backgroundColor: theme.colors.background,
                            borderColor: theme.colors.border,
                          }}
                        >
                          <div className="flex items-center gap-1.5">
                            <span
                              className="w-4 h-4 rounded-full shadow-2xs"
                              style={{ backgroundColor: theme.colors.primary }}
                            />
                            <span
                              className="w-4 h-4 rounded-full shadow-2xs"
                              style={{ backgroundColor: theme.colors.accent }}
                            />
                            <span
                              className="w-4 h-4 rounded-full shadow-2xs"
                              style={{ backgroundColor: theme.colors.surface }}
                            />
                          </div>
                          <span
                            className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                            style={{
                              backgroundColor: theme.colors.badgeBg,
                              color: theme.colors.accent,
                            }}
                          >
                            {theme.typography.id.toUpperCase()}
                          </span>
                        </div>

                        {/* Typography & Specs */}
                        <p className="text-[11px] text-slate-600 font-medium leading-relaxed mb-2.5">
                          {theme.description}
                        </p>
                        <div className="flex items-center justify-between text-[10px] font-bold text-slate-500 pt-2 border-t border-slate-100 mt-auto">
                          <span>{theme.typography.headingFont.split(',')[0].replace(/['"]/g, '')}</span>
                          <span className="capitalize">{theme.motion.defaultTransition}</span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Canvas Background Theme & Niche Palette */}
              <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider flex items-center gap-2">
                      <Layers size={14} className="text-orange-600" />
                      Canvas Theme &amp; Niche Color Palette
                    </h4>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Choose an atmospheric studio tone tailored to your video niche (Light, Dark, Neon, Paper)
                    </p>
                  </div>
                  <span className="text-[11px] font-bold text-orange-600 bg-orange-50 border border-orange-200 px-2.5 py-1 rounded-full shrink-0">
                    4 Niche Themes
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  {FACELESS_CANVAS_THEMES.map((theme) => {
                    const isSelected = (backgroundTheme || "solid-white") === theme.id;
                    return (
                      <button
                        key={theme.id}
                        type="button"
                        onClick={() => onBackgroundThemeChange && onBackgroundThemeChange(theme.id)}
                        className={`group relative flex flex-col p-3.5 rounded-xl border text-left transition cursor-pointer ${
                          isSelected
                            ? "border-orange-500 bg-orange-50/40 shadow-xs ring-2 ring-orange-400/40"
                            : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/60"
                        }`}
                      >
                        {/* Swatch Preview Box */}
                        <div
                          className={`w-full h-16 rounded-lg mb-3 flex items-center justify-between px-3 border shadow-inner ${theme.borderPreview}`}
                          style={{
                            backgroundColor: theme.bgHex,
                            background:
                              theme.id === "neon-twilight"
                                ? "linear-gradient(135deg, #05050A 0%, #1E1035 50%, #061B2E 100%)"
                                : theme.bgHex,
                          }}
                        >
                          <div className="flex flex-col">
                            <span className="text-[11px] font-black tracking-tight" style={{ color: theme.textColor }}>
                              Aa Visual
                            </span>
                            <span className="text-[9px] font-bold opacity-80" style={{ color: theme.accentColor }}>
                              ● {theme.name}
                            </span>
                          </div>
                          {isSelected && (
                            <div className="flex h-5 w-5 items-center justify-center rounded-full bg-orange-600 text-white shadow-xs">
                              <Check size={12} strokeWidth={3} />
                            </div>
                          )}
                        </div>

                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-black text-slate-900">{theme.name}</span>
                          <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-md bg-slate-100 text-slate-600 uppercase">
                            {theme.tag}
                          </span>
                        </div>

                        <p className="text-[10px] text-slate-500 line-clamp-2 leading-relaxed">
                          {theme.description}
                        </p>

                        <div className="mt-2.5 pt-2 border-t border-slate-100 text-[10px] font-bold text-orange-600 truncate">
                          Best for: {theme.niche}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Misheard Word / Brand Name Replacer */}
              <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider flex items-center gap-2">
                    <Wand2 size={14} className="text-orange-600" />
                    Misheard Word &amp; Brand Name Replacer
                  </h4>
                  {replaceNotice && (
                    <span className="text-[11px] font-bold text-emerald-600 animate-fadeIn">
                      {replaceNotice}
                    </span>
                  )}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-12 gap-2">
                  <input
                    type="text"
                    value={wordToFind}
                    onChange={(e) => setWordToFind(e.target.value)}
                    placeholder="Find mistranscribed word..."
                    className="sm:col-span-5 px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-xs text-slate-800 focus:bg-white focus:border-orange-500 focus:outline-none"
                  />
                  <input
                    type="text"
                    value={wordToReplace}
                    onChange={(e) => setWordToReplace(e.target.value)}
                    placeholder="Replace with correct word/brand..."
                    className="sm:col-span-5 px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-xs text-slate-800 focus:bg-white focus:border-orange-500 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={applyWordReplacement}
                    disabled={!wordToFind.trim()}
                    className="sm:col-span-2 px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 disabled:opacity-40 text-white font-bold text-xs transition cursor-pointer"
                  >
                    Apply
                  </button>
                </div>
              </div>

              {/* Scene-by-Scene Timeline Editor (Manual Overrides) */}
              <div className="space-y-3">
                <FacelessStoryboardTimeline
                  scenes={studioBlueprint.length > 0 ? studioBlueprint : (previewScenes as any)}
                  brollUrls={studioBrollUrls}
                  onBrollUrlsChange={setStudioBrollUrls}
                  onSceneChange={setStudioBlueprint}
                  uploadedImageFiles={uploadedImageFiles}
                  title="Scene-by-Scene Timeline Editor (Manual Overrides)"
                  subtitle="Fine-tune individual scenes: change visual layouts (Stat, Comparison, SVG, B-roll), swap custom media, or edit headings."
                />
              </div>

              {/* Navigation */}
              <div className="flex items-center justify-between pt-2">
                <button
                  type="button"
                  onClick={() => setCurrentStep(2)}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs shadow-2xs transition cursor-pointer"
                >
                  <ArrowLeft size={16} />
                  <span>Back to Music</span>
                </button>
                <button
                  type="button"
                  onClick={() => setCurrentStep(4)}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-black text-xs shadow-md shadow-orange-600/20 transition cursor-pointer active:scale-98"
                >
                  <span>Next: 9:16 Preview Simulator</span>
                  <ArrowRight size={16} />
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: Preview (9:16 Shorts Simulator) */}
          {currentStep === 4 && (
            <div className="space-y-6 animate-fadeIn">
              <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-50 border border-orange-200 text-orange-600">
                      <Tv size={20} />
                    </div>
                    <div>
                      <h3 className="text-sm font-black text-slate-900">
                        9:16 Mobile Phone Simulator
                      </h3>
                      <p className="text-xs text-slate-500">
                        Safe-zone verified preview with live kinetic typography
                      </p>
                    </div>
                  </div>

                  <span className="text-[10px] font-black uppercase px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                    1080×1920 Vertical
                  </span>
                </div>

                {/* Platform Safe-Zone Simulator Selector */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-orange-100 text-orange-600 shrink-0">
                      <ShieldCheck size={16} />
                    </div>
                    <div>
                      <span className="text-xs font-black text-slate-800 block">Smart Video Safe-Zone Simulator</span>
                      <p className="text-[11px] text-slate-500">Preview real platform overlays to verify captions &amp; cards never get hidden</p>
                    </div>
                  </div>

                  <div className="inline-flex rounded-xl bg-slate-200/80 p-1 gap-1 self-stretch sm:self-auto justify-between sm:justify-start">
                    {(["youtube", "instagram", "tiktok", "clean"] as const).map((plt) => (
                      <button
                        key={plt}
                        type="button"
                        onClick={() => setOverlayPlatform(plt)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold capitalize transition cursor-pointer ${
                          overlayPlatform === plt
                            ? "bg-white text-slate-900 shadow-xs"
                            : "text-slate-600 hover:text-slate-900"
                        }`}
                      >
                        {plt === "youtube" ? "YouTube Shorts" : plt === "instagram" ? "Instagram Reels" : plt === "tiktok" ? "TikTok" : "Clean View"}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 9:16 Phone Frame with Shared Remotion Player */}
                <div className="flex flex-col items-center justify-center py-2">
                  <div className="relative w-64 sm:w-72 aspect-[9/16] rounded-3xl bg-slate-950 overflow-hidden border-4 border-slate-900 shadow-2xl flex flex-col">
                    {/* Top Status Bar Notch */}
                    <div className="absolute top-2 left-1/2 -translate-x-1/2 w-20 h-3.5 bg-slate-900 rounded-full shrink-0 z-30 pointer-events-none" />

                    {/* Platform Safe-Zone Overlay (YouTube, Instagram, TikTok UI simulator) */}
                    <PlatformSafeZoneOverlay
                      platform={overlayPlatform}
                      creatorHandle={creatorHandle || "@yourchannel"}
                      topicTitle={topicTitle || "Faceless AI Short"}
                    />

                    {isMounted ? (
                      <Player
                        ref={playerRef}
                        component={FacelessShortsTemplate}
                        durationInFrames={previewDurationInFrames}
                        compositionWidth={1080}
                        compositionHeight={1920}
                        fps={30}
                        style={{
                          width: "100%",
                          height: "100%",
                        }}
                        controls
                        loop
                        autoPlay={false}
                        inputProps={{
                          audioSrc: audioPreviewUrl || undefined,
                          title: topicTitle || "Faceless Short",
                          creatorHandle: creatorHandle || undefined,
                          durationSeconds: audioPlaybackRate > 1.0 ? Math.min(90, Math.round(previewDurationSec / audioPlaybackRate)) : Math.min(90, previewDurationSec),
                          audioPlaybackRate: audioPlaybackRate,
                          mediaTrimStartSeconds: audioTrimStartSec,
                          backgroundTheme: backgroundTheme || "solid-white",
                          musicUrl: selectedTrackObj.id !== "none" ? getBgmTrackAudioUrl(selectedTrackObj) : "",
                          musicVolume: facelessBgmVolume ?? 0.12,
                          enableKineticEmojis: true,
                          templateConfig: {
                            captionThemeId: subtitleStyle || "glow-viral",
                            lowerThirdId: "tech_modern",
                            stickerPackId: "none",
                          },
                          captions: previewCaptions as any,
                          subtitleChunks: previewCaptions as any,
                          sceneBlueprint: previewScenes as any,
                          brollUrls: imageObjectUrls.length > 0 ? imageObjectUrls : undefined,
                          textLayers: customTextLayers,
                          imageLayers: customImageLayers,
                          svgLayers: customSvgLayers,
                          effectsLayers: customEffectLayers,
                          adjustmentLayers: customAdjustmentLayers,
                          transitionEvents: customTransitionEvents,
                          maskLayers: customMaskLayers,
                          patternLayers: customPatternLayers,
                          calloutLayers: customCalloutLayers,
                          isometricLayers: customIsometricLayers,
                          gaugeLayers: customGaugeLayers,
                          audioVisualizerLayers: customAudioVisualizerLayers,
                          cameraConfig: customCameraConfig,
                          visualTheme: activeVisualTheme,
                        }}
                      />
                    ) : (
                      <div className="h-full w-full flex items-center justify-center bg-slate-950 text-slate-500 text-xs">
                        Loading Remotion Composition...
                      </div>
                    )}
                  </div>
                  <p className="text-[11px] font-bold text-slate-500 mt-2.5 flex items-center gap-1.5">
                    <CheckCircle2 size={13} className="text-emerald-500" />
                    <span>100% Shared Remotion Composition &amp; WebFont Engine (Zero Lambda Mismatch)</span>
                  </p>
                </div>

                {/* Summary Recap Cards */}
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                  <div className="rounded-xl border border-slate-200 bg-slate-50/60 p-3 text-center">
                    <span className="text-[10px] font-bold text-slate-500 uppercase block">Duration</span>
                    <span className="text-sm font-black text-slate-900">~{audioDuration}s</span>
                  </div>
                  <div className="rounded-xl border border-slate-200 bg-slate-50/60 p-3 text-center">
                    <span className="text-[10px] font-bold text-slate-500 uppercase block">Assets</span>
                    <span className="text-sm font-black text-slate-900">
                      {totalAssetsCount} Uploaded
                    </span>
                  </div>
                  <div className="rounded-xl border border-slate-200 bg-slate-50/60 p-3 text-center">
                    <span className="text-[10px] font-bold text-slate-500 uppercase block">Canvas Theme</span>
                    <span className="text-sm font-black text-slate-900 capitalize truncate block">
                      {FACELESS_CANVAS_THEMES.find((t) => t.id === (backgroundTheme || "solid-white"))?.name || "Light"}
                    </span>
                  </div>
                  <div className="rounded-xl border border-slate-200 bg-slate-50/60 p-3 text-center">
                    <span className="text-[10px] font-bold text-slate-500 uppercase block">Soundtrack</span>
                    <span className="text-sm font-black text-slate-900 truncate block">
                      {selectedTrackObj.label}
                    </span>
                  </div>
                  <div className="rounded-xl border border-slate-200 bg-slate-50/60 p-3 text-center">
                    <span className="text-[10px] font-bold text-slate-500 uppercase block">Captions</span>
                    <span className="text-sm font-black text-slate-900 capitalize truncate block">
                      {subtitleStyle}
                    </span>
                  </div>
                </div>

                {/* Watermark Remover Toggle */}
                {onRemoveAiWatermarkChange && (
                  <div className="pt-2">
                    <WatermarkRemoverToggle
                      removeAiWatermark={removeAiWatermark}
                      onToggle={onRemoveAiWatermarkChange}
                    />
                  </div>
                )}
              </div>

              {/* Action Banner */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs">
                <div>
                  <h4 className="text-sm font-black text-slate-900">
                    Ready to Generate Your 9:16 Faceless Short?
                  </h4>
                  <p className="text-xs text-slate-500 mt-0.5">
                    1 Credit Flat per video • 1080×1920 30 FPS MP4 • Rendered in AWS Cloud
                  </p>
                </div>

                <div className="flex items-center gap-3 w-full sm:w-auto">
                  <button
                    type="button"
                    onClick={() => setCurrentStep(3)}
                    className="flex-1 sm:flex-none px-5 py-3 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs transition cursor-pointer"
                  >
                    Back to Style
                  </button>
                  <button
                    type="button"
                    disabled={isGenerating || !selectedFile || Boolean(audioError)}
                    onClick={() =>
                      onGenerate({
                        topicTitle,
                        creatorHandle,
                        denoiseVoice,
                        subtitleStyle,
                        captionPosition,
                        captionAnimationStyle,
                        backgroundTheme,
                        selectedBgmPath: selectedTrackObj.id !== "none" ? getBgmTrackAudioUrl(selectedTrackObj) : undefined,
                        facelessBgmVolume,
                        facelessEnableSfx,
                        enableKineticEmojis: true,
                        textLayers: customTextLayers,
                        imageLayers: customImageLayers,
                        svgLayers: customSvgLayers,
                        effectsLayers: customEffectLayers,
                        adjustmentLayers: customAdjustmentLayers,
                        transitionEvents: customTransitionEvents,
                        maskLayers: customMaskLayers,
                        patternLayers: customPatternLayers,
                        calloutLayers: customCalloutLayers,
                        isometricLayers: customIsometricLayers,
                        gaugeLayers: customGaugeLayers,
                        audioVisualizerLayers: customAudioVisualizerLayers,
                        cameraConfig: customCameraConfig,
                        customBgmFile,
                        durationSeconds: audioDuration,
                      })
                    }
                    className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl bg-orange-600 hover:bg-orange-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-black text-sm shadow-md shadow-orange-600/25 transition cursor-pointer active:scale-98"
                  >
                    {isGenerating ? (
                      <>
                        <RefreshCw size={16} className="animate-spin" />
                        <span>Rendering Cloud Short...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles size={16} />
                        <span>Render 9:16 Cloud Short</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
