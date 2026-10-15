"use client";

import React, { useState, useEffect, useRef, useMemo, ChangeEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import BrandLogo from "@/components/brand/BrandLogo";
import { useAuth } from "@/components/auth/AuthContext";
import { uploadFileViaPresign } from "@/lib/media/presignedUpload";
import {
  ArrowLeft,
  Sparkles,
  Zap,
  Film,
  Download,
  CheckCircle2,
  AlertCircle,
  Loader2,
  RefreshCw,
  Layers3,
  Upload,
  Clapperboard,
  Tv,
  FileText,
  ShieldCheck,
  Play,
  Pause,
  Volume2,
  VolumeX,
  SlidersHorizontal,
  ChevronDown,
  Globe,
  Layers,
  Activity,
  Trash2,
  Check,
  Search,
  Clock,
  Video,
} from "lucide-react";
import { SUBTITLE_PRESETS } from "@/remotion/types/subtitles";
import { BorderBeam } from "@/components/magicui/BorderBeam";
import { NumberTicker } from "@/components/magicui/NumberTicker";
import { AudioSpectrumVisualizer } from "@/components/dashboard/AudioSpectrumVisualizer";
import InteractiveRenderEngine from "@/components/render/InteractiveRenderEngine";

// Cloudinary-hosted 16:9 test videos for instant zero-friction preview & testing
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

type BillingEntitlement = {
  active: boolean;
  planId: string;
  planName: string;
  monthlyVideoLimit: number;
  expiresAt?: string | number;
  usage?: {
    used: number;
    limit: number;
    remaining: number;
  };
};

type JobStatus = {
  state: "idle" | "uploading" | "starting" | "rendering" | "ready" | "error";
  message?: string;
  progress?: number;
  outputFile?: string;
  renderId?: string;
  bucketName?: string;
  title?: string;
  diagnostics?: string[];
};

type RecentRender = {
  id: string;
  title: string;
  mode: string;
  design?: string;
  outputFile: string;
  createdAt: number;
  expiresAt: number;
};

// 16:9 Broadcast Presets tailored for widescreen cinema & long-form YouTube
export const BROADCAST_PRESETS = [
  {
    id: "BBC / Netflix Closed Captions",
    title: "Clean Documentary",
    desc: "Classic lower-third closed captions",
    specimen: "The mystery behind quantum computing...",
    badge: "16:9 Standard",
    category: "cinematic",
    fontFamily: "Inter, sans-serif",
    textColor: "#FFFFFF",
    highlightColor: "#FFFFFF",
    backgroundColor: "rgba(0, 0, 0, 0.88)",
  },
  {
    id: "Sharp Yellow",
    title: "Netflix Yellow",
    desc: "High-contrast bold yellow subtitle box",
    specimen: "SUBTITLES POWERED BY AI",
    badge: "High Legibility",
    category: "cinematic",
    fontFamily: "Impact, sans-serif",
    textColor: "#000000",
    highlightColor: "#FACC15",
    backgroundColor: "#FACC15",
  },
  {
    id: "Minimal Clean",
    title: "Amber Minimal",
    desc: "Clean warm highlight with dark backing",
    specimen: "Clear spoken word alignment...",
    badge: "Podcast Favorite",
    category: "minimal",
    fontFamily: "Inter, sans-serif",
    textColor: "#FFFFFF",
    highlightColor: "#F59E0B",
    backgroundColor: "rgba(18, 18, 18, 0.85)",
  },
  {
    id: "Studio Podcast",
    title: "Podcast Editorial",
    desc: "Clean multi-line conversational layout",
    specimen: "Episode 42: Building the Future",
    badge: "Long Form",
    category: "podcast",
    fontFamily: "Playfair Display, Georgia, serif",
    textColor: "#F8FAFC",
    highlightColor: "#38BDF8",
    backgroundColor: "rgba(10, 10, 10, 0.90)",
  },
  {
    id: "MKBHD Tech Studio",
    title: "Tech Modern",
    desc: "Cyber neon orange highlight text",
    specimen: "NEXT-GEN VIDEO AI ENGINE",
    badge: "Viral Tech",
    category: "viral",
    fontFamily: "Inter, sans-serif",
    textColor: "#FFFFFF",
    highlightColor: "#FF5722",
    backgroundColor: "rgba(24, 24, 27, 0.92)",
  },
  {
    id: "Ali Abdaal Clean Pill",
    title: "Ali Abdaal Pill",
    desc: "Inverted clean card with yellow accent",
    specimen: "Productivity Hacks for Creators",
    badge: "Minimal Pill",
    category: "minimal",
    fontFamily: "Inter, sans-serif",
    textColor: "#FFFFFF",
    highlightColor: "#FDE047",
    backgroundColor: "rgba(15, 23, 42, 0.85)",
  },
  {
    id: "Vox Documentary",
    title: "Vox Explainer",
    desc: "Serif documentary headline captions",
    specimen: "How global economies shifted in 2026",
    badge: "Documentary",
    category: "cinematic",
    fontFamily: "Georgia, Newsreader, serif",
    textColor: "#FFFBEB",
    highlightColor: "#F59E0B",
    backgroundColor: "rgba(12, 10, 9, 0.90)",
  },
  {
    id: "MrBeast 16:9 Punch",
    title: "MrBeast Punch",
    desc: "High-impact yellow & white punch text",
    specimen: "WE SURVIVED 100 DAYS!",
    badge: "Viral Bold",
    category: "viral",
    fontFamily: "Impact, Montserrat, sans-serif",
    textColor: "#FFFFFF",
    highlightColor: "#FACC15",
    backgroundColor: "rgba(0, 0, 0, 0.70)",
  },
  {
    id: "Huberman Lab Lecture",
    title: "Huberman Science",
    desc: "Academic lecture blue glow lower-third",
    specimen: "Optimizing Focus & Neural Pathways",
    badge: "Educational",
    category: "educational",
    fontFamily: "Inter, sans-serif",
    textColor: "#F8FAFC",
    highlightColor: "#38BDF8",
    backgroundColor: "rgba(10, 10, 10, 0.92)",
  },
  {
    id: "Kurzgesagt Explainer",
    title: "Kurzgesagt Pill",
    desc: "Rounded vector science explainer card",
    specimen: "What happens inside a black hole?",
    badge: "Educational",
    category: "educational",
    fontFamily: "Poppins, sans-serif",
    textColor: "#F8FAFC",
    highlightColor: "#67E8F9",
    backgroundColor: "rgba(30, 41, 59, 0.88)",
  },
  {
    id: "Lex Fridman Minimalist",
    title: "Lex Fridman Clean",
    desc: "Understated black & white conversational text",
    specimen: "Deep dive into intelligence & ethics",
    badge: "Podcast",
    category: "podcast",
    fontFamily: "Inter, sans-serif",
    textColor: "#E2E8F0",
    highlightColor: "#FFFFFF",
    backgroundColor: "rgba(0, 0, 0, 0.80)",
  },
  {
    id: "Blue Muse",
    title: "Blue Muse Serif",
    desc: "Elegant royal blue & white serif text",
    specimen: "A timeless masterpiece of storytelling",
    badge: "Cinematic",
    category: "cinematic",
    fontFamily: "Playfair Display, serif",
    textColor: "#3B82F6",
    highlightColor: "#FFFFFF",
    backgroundColor: "rgba(0,0,0,0.85)",
  },
  {
    id: "Headliner",
    title: "Headliner Orange",
    desc: "Impactful poster style with orange punch",
    specimen: "BREAKING: REVOLUTIONARY DISCOVERY",
    badge: "Viral Bold",
    category: "viral",
    fontFamily: "Impact, sans-serif",
    textColor: "#FFFFFF",
    highlightColor: "#FF5722",
    backgroundColor: "rgba(0, 0, 0, 0.85)",
  },
  {
    id: "Chalk",
    title: "Chalk Monospace",
    desc: "Retro terminal code & chalk font",
    specimen: "console.log('Hello YouTube Studio');",
    badge: "Tech / Code",
    category: "educational",
    fontFamily: "Courier New, monospace",
    textColor: "#FFFFFF",
    highlightColor: "#FACC15",
    backgroundColor: "rgba(0, 0, 0, 0.85)",
  },
  {
    id: "Gold Centre",
    title: "Gold Centre",
    desc: "Metallic golden headlines for luxury finance",
    specimen: "BUILDING WEALTH IN THE MODERN AGE",
    badge: "Finance",
    category: "viral",
    fontFamily: "Arial Black, sans-serif",
    textColor: "#FFD700",
    highlightColor: "#FFA000",
    backgroundColor: "rgba(0, 0, 0, 0.85)",
  },
];

const AUDIO_SPOKEN_LANGUAGES = [
  { id: "auto", label: "Auto Detect (Recommended)" },
  { id: "hi", label: "Hindi / Hinglish (Spoken)" },
  { id: "en", label: "English (Global / US / UK)" },
  { id: "es", label: "Spanish (Español)" },
  { id: "fr", label: "French (Français)" },
  { id: "de", label: "German (Deutsch)" },
  { id: "pt", label: "Portuguese (Português)" },
  { id: "id", label: "Indonesian (Bahasa)" },
  { id: "ar", label: "Arabic" },
  { id: "ja", label: "Japanese" },
  { id: "ru", label: "Russian" },
];

const SUBTITLE_OUTPUT_LANGUAGES = [
  { id: "same", label: "Same as Audio (Roman Hinglish / English)" },
  { id: "en", label: "English (Latin Script)" },
  { id: "hi", label: "Hinglish (Roman Hindi - No Devanagari)" },
  { id: "es", label: "Spanish (Español)" },
  { id: "fr", label: "French (Français)" },
  { id: "de", label: "German (Deutsch)" },
  { id: "pt", label: "Portuguese (Português)" },
  { id: "id", label: "Indonesian (Bahasa)" },
];

const RENDER_STEPS = [
  {
    label: "Widescreen video received",
    detail: "Landscape/horizontal 16:9 video uploaded securely to cloud.",
    threshold: 0.08,
    icon: Upload,
  },
  {
    label: "AI transcribing voiceover",
    detail: "Groq Whisper detecting speech, word boundaries, and timing marks.",
    threshold: 0.32,
    icon: Layers3,
  },
  {
    label: "Aligning subtitle segments",
    detail: "Formatting broadcast subtitles with 14% YouTube scrubber clearance.",
    threshold: 0.62,
    icon: Sparkles,
  },
  {
    label: "Rendering 16:9 widescreen",
    detail: "Remotion engine compiling 1080p Full HD video with burnt-in tracks.",
    threshold: 0.85,
    icon: Film,
  },
  {
    label: "Ready to download",
    detail: "1080p video with burnt-in captions ready for YouTube broadcast.",
    threshold: 0.98,
    icon: Clapperboard,
  },
];

export default function YoutubeSubtitlesPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();

  // Active Media & Sample State
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [activeSampleId, setActiveSampleId] = useState<string>("podcast-interview");

  // Subtitle Style & Styling States
  const [captionStyle, setCaptionStyle] = useState<string>("BBC / Netflix Closed Captions");
  const [captionPosition, setCaptionPosition] = useState<"top" | "center" | "bottom">("bottom");
  const [captionFontSize, setCaptionFontSize] = useState<"small" | "medium" | "large" | "xlarge">("large");
  const [captionFontFamily, setCaptionFontFamily] = useState<string>("preset");
  const [captionTextColor, setCaptionTextColor] = useState<string>("#ffffff");
  const [captionHighlightColor, setCaptionHighlightColor] = useState<string>("#ffffff");
  const [captionBackgroundColor, setCaptionBackgroundColor] = useState<string>("rgba(0, 0, 0, 0.88)");
  const [spokenLanguage, setSpokenLanguage] = useState<string>("auto");
  const [captionLanguage, setCaptionLanguage] = useState<string>("same");

  // YouTube Subtitles Safe-Zone & Casing
  const [youtubeSubtitleSafeZone, setYoutubeSubtitleSafeZone] = useState<"standard" | "scrubber" | "high">("scrubber");
  const [youtubeSubtitleCase, setYoutubeSubtitleCase] = useState<"natural" | "uppercase">("natural");

  // Preset Filtering & Search States
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [presetSearch, setPresetSearch] = useState<string>("");

  // Sub-panel tabs in settings card
  const [activeSettingsTab, setActiveSettingsTab] = useState<"typography" | "safezone" | "language">("typography");

  // Media Metadata
  const [mediaDurationSeconds, setMediaDurationSeconds] = useState<number>(0);

  // Live Preview Player States
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(true);
  const [playbackTime, setPlaybackTime] = useState<number>(0);
  const [previewDuration, setPreviewDuration] = useState<number>(18);
  const previewVideoRef = useRef<HTMLVideoElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Job & Render States
  const [jobStatus, setJobStatus] = useState<JobStatus>({ state: "idle" });
  const [billingEntitlement, setBillingEntitlement] = useState<BillingEntitlement | null>(null);
  const [recentRenders, setRecentRenders] = useState<RecentRender[]>([]);

  // Transcription States
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [editedTranscript, setEditedTranscript] = useState<string>("");
  const [previewCaptions, setPreviewCaptions] = useState<Array<{ start: number; end: number; text: string }> | null>(null);

  const renderRequestInFlightRef = useRef(false);

  // Auth redirect
  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login?returnUrl=/dashboard/youtube-subtitles");
    }
  }, [user, authLoading, router]);

  // Load billing entitlement
  useEffect(() => {
    if (!user) return;
    async function fetchBilling() {
      try {
        const res = await fetch(
          `/api/billing/entitlement?userId=${encodeURIComponent(user?.id || "")}&email=${encodeURIComponent(
            user?.email || ""
          )}`
        );
        const payload = await res.json().catch(() => ({}));
        if (res.ok && payload.ok && payload.entitlement) {
          const ent = payload.entitlement;
          const limit = Math.max(0, Math.round(Number(payload.usage?.limit || ent.monthlyVideoLimit || 0)));
          const used = Math.max(0, Math.round(Number(payload.usage?.used || 0)));
          const remaining = Math.max(0, Math.round(Number(payload.usage?.remaining ?? limit - used)));
          setBillingEntitlement({
            active: Boolean(ent.active),
            planId: ent.planId || "paid",
            planName: ent.planName || "Creator",
            monthlyVideoLimit: limit,
            usage: { used, limit, remaining },
          });
        }
      } catch (err) {
        console.warn("Could not load billing entitlement:", err);
      }
    }
    fetchBilling();
  }, [user]);

  // Current active Cloudinary sample video object
  const activeSampleVideo = useMemo(() => {
    return (
      CLOUDINARY_SAMPLE_VIDEOS.find((s) => s.id === activeSampleId) ||
      CLOUDINARY_SAMPLE_VIDEOS[0]
    );
  }, [activeSampleId]);

  // Handle uploaded video metadata
  useEffect(() => {
    if (!selectedFile) {
      setMediaDurationSeconds(0);
      setEditedTranscript(activeSampleVideo.sampleTranscript);
      setPreviewCaptions(activeSampleVideo.sampleCaptions);
      setPreviewDuration(activeSampleVideo.durationSeconds);
      return;
    }

    const type = selectedFile.type || "";
    const name = selectedFile.name.toLowerCase();
    const isVideoOrAudio =
      type.startsWith("video/") ||
      type.startsWith("audio/") ||
      /\.(mp4|mov|mp3|wav|m4a|aac)$/i.test(name);

    if (isVideoOrAudio) {
      const url = URL.createObjectURL(selectedFile);
      const isAud = type.startsWith("audio/") || /\.(mp3|wav|m4a|aac)$/i.test(name);
      const element = document.createElement(isAud ? "audio" : "video");
      element.src = url;
      element.preload = "metadata";

      const handleLoadedMetadata = () => {
        // Cap at 600s strictly per Rule 4.1
        const dur = Math.min(600, Math.round(element.duration || 60));
        setMediaDurationSeconds(dur);
        setPreviewDuration(dur);
        URL.revokeObjectURL(url);
      };

      element.addEventListener("loadedmetadata", handleLoadedMetadata);
      return () => {
        element.removeEventListener("loadedmetadata", handleLoadedMetadata);
        URL.revokeObjectURL(url);
      };
    }
  }, [selectedFile, activeSampleVideo]);

  // Auto-transcribe media on file selection
  useEffect(() => {
    if (!selectedFile) return;

    async function autoTranscribe() {
      if (!selectedFile) return;
      setIsTranscribing(true);
      try {
        const contentType = selectedFile.type || "video/mp4";
        const presignRes = await fetch("/api/media/presign", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            fileName: selectedFile.name,
            contentType,
            fileSize: selectedFile.size,
            mode: "youtubeSubtitleGenerator",
            userId: user?.id || "guest_user",
          }),
        });
        const presign = await presignRes.json().catch(() => ({}));
        if (!presignRes.ok || !presign.ok || !presign.uploadUrl) {
          throw new Error(presign.error || "Could not prepare upload for transcription.");
        }

        await fetch(presign.uploadUrl, {
          method: "PUT",
          headers: { "Content-Type": contentType },
          body: selectedFile,
        });

        const transcribeRes = await fetch("/api/reels/transcribe", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            mediaKey: presign.key,
            spokenLanguage: spokenLanguage !== "auto" ? spokenLanguage : undefined,
            fileName: selectedFile.name,
          }),
        });
        const transcribeData = await transcribeRes.json().catch(() => ({}));
        if (transcribeRes.ok && transcribeData.ok) {
          if (transcribeData.transcript) {
            setEditedTranscript(transcribeData.transcript);
          }
          if (transcribeData.segments) {
            setPreviewCaptions(transcribeData.segments);
          }
        }
      } catch (err: any) {
        console.warn("Auto transcribe notice:", err?.message);
      } finally {
        setIsTranscribing(false);
      }
    }

    autoTranscribe();
  }, [selectedFile, spokenLanguage, user?.id]);

  // Active video source for 16:9 preview player
  const uploadedVideoUrl = useMemo(
    () => (selectedFile ? URL.createObjectURL(selectedFile) : null),
    [selectedFile]
  );

  const activePreviewVideoSrc = uploadedVideoUrl || activeSampleVideo.videoUrl;
  const activePreviewPoster = selectedFile ? undefined : activeSampleVideo.posterUrl;

  useEffect(() => {
    return () => {
      if (uploadedVideoUrl) URL.revokeObjectURL(uploadedVideoUrl);
    };
  }, [uploadedVideoUrl]);

  // Sync playback time loop
  useEffect(() => {
    let animId: number;
    const loop = () => {
      const v = previewVideoRef.current;
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

  const togglePlay = () => {
    const v = previewVideoRef.current;
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
    setIsMuted((prev) => {
      const next = !prev;
      if (previewVideoRef.current) {
        previewVideoRef.current.muted = next;
      }
      return next;
    });
  };

  const handleSelectPreset = (preset: (typeof BROADCAST_PRESETS)[0]) => {
    setCaptionStyle(preset.id);
    setCaptionTextColor(preset.textColor);
    setCaptionHighlightColor(preset.highlightColor);
    setCaptionBackgroundColor(preset.backgroundColor);
  };

  // Resolve current active preset configuration
  const activePresetConfig = useMemo(() => {
    const found = BROADCAST_PRESETS.find((p) => p.id === captionStyle);
    if (found) return found;
    const remotionPreset = SUBTITLE_PRESETS[captionStyle];
    if (remotionPreset) {
      return {
        id: captionStyle,
        title: remotionPreset.name,
        desc: "Broadcast Subtitle Preset",
        specimen: "Clear spoken word alignment...",
        badge: "Broadcast",
        category: "cinematic",
        fontFamily: remotionPreset.fontFamily,
        textColor: remotionPreset.textColor,
        highlightColor: remotionPreset.highlightColor,
        backgroundColor: remotionPreset.backgroundColor || "rgba(0, 0, 0, 0.88)",
      };
    }
    return BROADCAST_PRESETS[0];
  }, [captionStyle]);

  // Filtered Presets for Gallery
  const filteredPresets = useMemo(() => {
    return BROADCAST_PRESETS.filter((p) => {
      const matchesSearch =
        !presetSearch ||
        p.title.toLowerCase().includes(presetSearch.toLowerCase()) ||
        p.desc.toLowerCase().includes(presetSearch.toLowerCase()) ||
        p.specimen.toLowerCase().includes(presetSearch.toLowerCase());
      const matchesCategory =
        selectedCategory === "all" || (p as any).category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [presetSearch, selectedCategory]);

  // Current active caption text based on video playback time
  const currentActiveCaptionText = useMemo(() => {
    const caps = previewCaptions || activeSampleVideo.sampleCaptions;
    if (caps && caps.length > 0) {
      const match = caps.find(
        (c) => playbackTime >= c.start && playbackTime <= c.end
      );
      if (match) return match.text;
    }
    return activePresetConfig.specimen;
  }, [playbackTime, previewCaptions, activeSampleVideo, activePresetConfig]);

  // Rule 4.1 Pricing: 1 Min = 1 Credit (1m=1, 5m=5, 10m=10 Cr)
  const currentDurationSeconds = mediaDurationSeconds || previewDuration || 60;
  const calculatedCredits = Math.max(
    1,
    Math.min(10, Math.ceil(currentDurationSeconds / 60))
  );

  // Start Render Job
  async function handleStartRender() {
    if (!user) {
      router.push("/login?returnUrl=/dashboard/youtube-subtitles");
      return;
    }
    if (!selectedFile) {
      fileInputRef.current?.click();
      return;
    }
    if (renderRequestInFlightRef.current) return;
    renderRequestInFlightRef.current = true;

    try {
      setJobStatus({
        state: "uploading",
        message: "Uploading horizontal 16:9 video securely to cloud...",
        progress: 0.05,
      });

      const mediaKey = await uploadFileViaPresign(
        selectedFile,
        "youtubeSubtitleGenerator",
        user.id
      );

      setJobStatus({
        state: "starting",
        message: "Configuring YouTube 16:9 subtitle engines & safe-zone alignment...",
        progress: 0.22,
      });

      const plannedTitle = selectedFile.name.replace(/\.[^/.]+$/, "");
      const isAudio =
        selectedFile.type.startsWith("audio/") ||
        /\.(mp3|wav|m4a|aac)$/i.test(selectedFile.name);

      const jobResponse = await fetch("/api/reels/jobs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mediaKey,
          fileName: selectedFile.name,
          contentType: selectedFile.type || (isAudio ? "audio/mpeg" : "video/mp4"),
          mediaType: isAudio ? "audio" : "video",
          mode: "youtubeSubtitleGenerator",
          topicTitle: plannedTitle,
          userId: user.id,
          userEmail: user.email || undefined,
          captionStyle,
          captionPosition,
          captionFontSize,
          captionFontFamily:
            captionFontFamily !== "preset" ? captionFontFamily : undefined,
          captionTextColor,
          captionHighlightColor,
          captionBackgroundColor,
          captionShowBackground: captionBackgroundColor !== "",
          spokenLanguage: spokenLanguage !== "auto" ? spokenLanguage : undefined,
          captionLanguage: captionLanguage !== "same" ? captionLanguage : undefined,
          subtitleOutputLanguage: captionLanguage !== "same" ? captionLanguage : undefined,
          videoLayout: "fullscreen",
          progressStyle: "none",
          youtubeSubtitleSafeZone,
          youtubeSubtitleCase,
          wordClickSound: false,
          captionEmphasisAnimation: "none",
          durationSeconds: mediaDurationSeconds,
          sourceDurationSeconds: mediaDurationSeconds,
          mediaAspect: "landscape",
          frameRange:
            mediaDurationSeconds > 0
              ? [0, Math.min(18000, Math.round(mediaDurationSeconds * 30)) - 1]
              : undefined,
        }),
      });

      const jobPayload = await jobResponse.json().catch(() => ({}));
      if (!jobResponse.ok || !jobPayload.ok) {
        throw new Error(jobPayload.error || "Failed to start YouTube Subtitle render job.");
      }

      const jobId = jobPayload.jobId;
      const renderId = jobPayload.renderId;
      const bucketName = jobPayload.bucketName;

      setJobStatus({
        state: "rendering",
        message: "AI subtitle engine is burning 16:9 broadcast captions in 1080p Full HD...",
        progress: 0.35,
        renderId,
        bucketName,
        title: plannedTitle,
      });

      let attempts = 0;
      const MAX_ATTEMPTS = 600;

      const pollInterval = setInterval(async () => {
        attempts++;
        if (attempts > MAX_ATTEMPTS) {
          clearInterval(pollInterval);
          renderRequestInFlightRef.current = false;
          setJobStatus({
            state: "error",
            message: "Render took longer than usual. Please check your Projects tab shortly.",
          });
          return;
        }

        try {
          const statusRes = await fetch(
            `/api/reels/jobs/status?jobId=${encodeURIComponent(jobId)}&renderId=${encodeURIComponent(
              renderId
            )}&bucketName=${encodeURIComponent(bucketName || "")}&userId=${encodeURIComponent(
              user.id
            )}&title=${encodeURIComponent(plannedTitle)}&mode=youtubeSubtitleGenerator`
          );
          const statusPayload = await statusRes.json().catch(() => ({}));

          if (statusPayload.ok) {
            const serverState = statusPayload.state;
            const currentProgress =
              typeof statusPayload.progress === "number" ? statusPayload.progress : 0.45;

            const isRenderComplete =
              (serverState === "ready" || serverState === "done" || Boolean(statusPayload.done)) &&
              Boolean(statusPayload.outputFile);
            if (isRenderComplete) {
              clearInterval(pollInterval);
              renderRequestInFlightRef.current = false;

              const completedRender: RecentRender = {
                id: renderId,
                title: plannedTitle,
                mode: "youtubeSubtitleGenerator",
                outputFile: statusPayload.outputFile,
                createdAt: Date.now(),
                expiresAt: Date.now() + 48 * 60 * 60 * 1000,
              };

              setRecentRenders((prev) => {
                const next = [completedRender, ...prev.filter((r) => r.id !== renderId)];
                try {
                  localStorage.setItem(
                    "itnavideo_youtube_subtitles_projects",
                    JSON.stringify(next.slice(0, 30))
                  );
                } catch {}
                return next;
              });

              setJobStatus({
                state: "ready",
                message: "16:9 Widescreen video with burnt-in broadcast captions ready!",
                progress: 1,
                outputFile: statusPayload.outputFile,
                renderId,
                bucketName,
                title: plannedTitle,
              });

              fetch("/api/reels/history", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  userId: user.id,
                  renderId,
                  bucketName,
                  mode: "youtubeSubtitleGenerator",
                  title: plannedTitle,
                  outputFile: statusPayload.outputFile,
                  createdAt: new Date().toISOString(),
                  expiresAt: new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString(),
                }),
              }).catch((e) => console.warn("Could not save history:", e));
            } else if (serverState === "error") {
              clearInterval(pollInterval);
              renderRequestInFlightRef.current = false;
              setJobStatus({
                state: "error",
                message: statusPayload.message || "YouTube Subtitle render failed.",
                diagnostics: statusPayload.diagnostics,
              });
            } else {
              setJobStatus((prev) => ({
                ...prev,
                state: "rendering",
                message:
                  statusPayload.message ||
                  "Rendering 16:9 1080p widescreen video with safe-margin subtitles...",
                progress: Math.max(prev.progress || 0.35, currentProgress),
              }));
            }
          }
        } catch (pollErr) {
          console.warn("Polling error:", pollErr);
        }
      }, 3000);
    } catch (error: any) {
      renderRequestInFlightRef.current = false;
      setJobStatus({
        state: "error",
        message: error?.message || "An unexpected error occurred during rendering.",
      });
    }
  }

  const [downloadingUrl, setDownloadingUrl] = useState<string | null>(null);

  const downloadVideoDirectly = async (url: string, filename: string) => {
    try {
      setDownloadingUrl(url);
      const res = await fetch(url);
      const blob = await res.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = blobUrl;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(blobUrl);
    } catch {
      window.open(url, "_blank");
    } finally {
      setDownloadingUrl(null);
    }
  };

  const handleReset = () => {
    setJobStatus({ state: "idle" });
    setSelectedFile(null);
  };

  const [isExportingSubtitles, setIsExportingSubtitles] = useState<boolean>(false);

  // Download .SRT or .VTT with fallback
  async function handleExportSubtitles(format: "srt" | "vtt" = "srt") {
    if (!user) {
      router.push("/login?returnUrl=/dashboard/youtube-subtitles");
      return;
    }

    try {
      setIsExportingSubtitles(true);

      const capsToExport = previewCaptions || activeSampleVideo.sampleCaptions;
      const baseName = selectedFile
        ? selectedFile.name.replace(/\.[^/.]+$/, "")
        : `${activeSampleVideo.id}-subtitles`;

      // If user uploaded file, also upload via presign if no captions yet
      let mediaKey: string | undefined = undefined;
      if (selectedFile && (!capsToExport || capsToExport.length === 0)) {
        mediaKey = await uploadFileViaPresign(
          selectedFile,
          "youtubeSubtitleGenerator",
          user.id
        );
      }

      const res = await fetch("/api/reels/subtitles/export", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          captions: capsToExport,
          transcript: editedTranscript || activeSampleVideo.sampleTranscript,
          mediaKey,
          fileName: baseName,
          format,
          casing: youtubeSubtitleCase,
          spokenLanguage: spokenLanguage !== "auto" ? spokenLanguage : undefined,
          captionLanguage: captionLanguage !== "same" ? captionLanguage : undefined,
        }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || "Failed to generate subtitle export.");
      }

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${baseName}.${format}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (err: any) {
      alert(err?.message || "Could not export subtitles.");
    } finally {
      setIsExportingSubtitles(false);
    }
  }

  const userRemainingCredits = billingEntitlement?.active
    ? Math.round(
        billingEntitlement.usage?.remaining ?? billingEntitlement.monthlyVideoLimit ?? 0
      )
    : undefined;
  const isWorking =
    jobStatus.state === "uploading" ||
    jobStatus.state === "starting" ||
    jobStatus.state === "rendering";
  const isReady = jobStatus.state === "ready" && Boolean(jobStatus.outputFile);
  const isError = jobStatus.state === "error";

  // Estimated speech word count
  const estimatedWordCount = useMemo(() => {
    const dur = mediaDurationSeconds || previewDuration || 60;
    return Math.round((dur / 60) * 140);
  }, [mediaDurationSeconds, previewDuration]);

  // Safe margin bottom position
  const safeMarginBottomClass =
    youtubeSubtitleSafeZone === "high"
      ? "bottom-[18%]"
      : youtubeSubtitleSafeZone === "standard"
      ? "bottom-[10%]"
      : "bottom-[14%]";

  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#070B14] flex flex-col items-center justify-center text-slate-400 gap-3">
        <Loader2 className="h-8 w-8 animate-spin text-[#FF5722]" />
        <p className="text-sm font-semibold tracking-wide text-slate-200">
          Loading YouTube Subtitle Studio...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#070B14] text-white flex flex-col selection:bg-[#FF5722]/30 selection:text-[#FFA000]">
      {/* ── Top Navigation Bar ── */}
      <header className="sticky top-0 z-40 border-b border-white/10 bg-[#070B14]/90 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 sm:gap-4">
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 hover:bg-white/10 px-3 py-1.5 text-xs font-bold text-slate-300 hover:text-white transition group"
            >
              <ArrowLeft size={14} className="group-hover:-translate-x-0.5 transition-transform" />
              <span className="hidden sm:inline">All Studios</span>
            </Link>

            <div className="h-4 w-px bg-white/10" />

            <BrandLogo size="sm" showBadge={false} variant="dark" />

            <span className="hidden md:inline-flex items-center gap-1.5 rounded-full border border-[#FF5722]/30 bg-[#FF5722]/10 px-3 py-1 text-[11px] font-black text-[#FFA000]">
              <Sparkles size={11} className="text-[#FF5722]" />
              Studio #4 • 16:9 Widescreen
            </span>
          </div>

          <div className="flex items-center gap-3">
            {/* Credits Balance Badge */}
            <div className="flex items-center gap-2 rounded-full border border-white/10 bg-[#0E1526] px-3.5 py-1.5 text-xs font-bold">
              <Zap size={14} className="text-[#FF7043] fill-[#FF7043]" />
              <span className="text-slate-400">Balance:</span>
              <span className="text-white font-black">
                {billingEntitlement ? userRemainingCredits : "..."} Credits
              </span>
              <Link
                href="/pricing"
                className="ml-1 text-[11px] text-[#FFA000] hover:text-white underline font-black"
              >
                +Add
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* ── Main Canvas ── */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6 sm:space-y-8">
        {/* Header Banner & Value Proposition */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-6">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-[#FF5722]/30 bg-[#FF5722]/10 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-[#FFA000] mb-2">
              <Sparkles size={13} className="text-[#FF5722]" />
              <span>Studio #4 • YouTube Subtitle Generator</span>
            </div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-white tracking-tight">
              YouTube Subtitle{" "}
              <span className="bg-gradient-to-r from-[#FF5722] via-[#FF7043] to-[#FFA000] bg-clip-text text-transparent">
                Generator
              </span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl leading-relaxed">
              Burn responsive broadcast subtitles directly onto 16:9 widescreen videos with 14% YouTube scrubber clearance, or export millisecond-accurate .SRT / .VTT files.
            </p>
          </div>

          {/* Quick Badges Stack */}
          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <span className="rounded-full border border-white/10 bg-[#0E1526] px-3.5 py-1.5 text-xs font-bold text-slate-200 flex items-center gap-1.5">
              <Tv size={14} className="text-[#FF7043]" />
              <span>16:9 Landscape Only</span>
            </span>
            <span className="rounded-full border border-[#FF5722]/30 bg-[#FF5722]/10 px-3.5 py-1.5 text-xs font-bold text-[#FFA000] flex items-center gap-1.5">
              <Clock size={14} className="text-[#FF5722]" />
              <span>Max 10 Min (600s)</span>
            </span>
            <span className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3.5 py-1.5 text-xs font-bold text-emerald-400 flex items-center gap-1.5">
              <ShieldCheck size={14} />
              <span>1 Min = 1 Credit</span>
            </span>
          </div>
        </div>

        {/* ── In-Progress / Ready Render State ── */}
        {(isWorking || isReady || isError) ? (
          <div className="max-w-4xl mx-auto py-4">
            <InteractiveRenderEngine
              mode="youtubeSubtitles"
              status={{
                state: isReady ? "ready" : isError ? "error" : isWorking ? (jobStatus.state as any) : "idle",
                message: jobStatus.message || "Generating 16:9 subtitles...",
                progress: jobStatus.progress,
                outputFile: jobStatus.outputFile,
                title: selectedFile?.name ? selectedFile.name.replace(/\.[^/.]+$/, "") : "YouTube 16:9 Subtitles",
                error: isError ? jobStatus.message : undefined,
                diagnostics: jobStatus.diagnostics,
              }}
              title={selectedFile?.name ? selectedFile.name.replace(/\.[^/.]+$/, "") : "YouTube 16:9 Subtitles"}
              fileName={selectedFile?.name}
              onRetry={handleStartRender}
              onReset={() => {
                setSelectedFile(null);
                setEditedTranscript("");
                setPreviewCaptions([]);
                setJobStatus({ state: "idle" });
              }}
            />
          </div>
        ) : (
          /* ── Main Responsive Studio (7 cols Form & Styles / 5 cols Sticky Live Cinema Stage) ── */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Hidden File Input */}
            <input
              ref={fileInputRef}
              accept="video/*,audio/*"
              className="hidden"
              onChange={(event: ChangeEvent<HTMLInputElement>) => {
                const file = event.target.files?.[0];
                if (file) {
                  setSelectedFile(file);
                }
                event.currentTarget.value = "";
              }}
              type="file"
            />

            {/* ── LEFT COLUMN (7 Cols): Upload + Cloudinary Switcher + Styles Gallery + Alignment ── */}
            <div className="lg:col-span-7 space-y-6">
              {/* ── 1. Video & Audio Upload Dropzone + Cloudinary Sample Selector ── */}
              <div className="rounded-[28px] border border-white/10 bg-[#0E1526] p-5 sm:p-6 shadow-2xl space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-white/10">
                  <div className="flex items-center gap-3">
                    <span className="flex h-7 w-7 items-center justify-center rounded-xl bg-[#FF5722]/15 text-[#FFA000] text-xs font-black border border-[#FF5722]/30">
                      1
                    </span>
                    <div>
                      <h3 className="text-sm sm:text-base font-black text-white flex items-center gap-2">
                        <Upload size={16} className="text-[#FF7043]" />
                        <span>Upload 16:9 Video or Audio</span>
                      </h3>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        MP4, MOV, MP3, WAV — strictly up to 10 minutes (600s).
                      </p>
                    </div>
                  </div>

                  <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 rounded-full font-bold">
                    16:9 Widescreen
                  </span>
                </div>

                {/* Primary Upload Dropzone */}
                <div
                  onClick={() => fileInputRef.current?.click()}
                  onDragOver={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                  }}
                  onDrop={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                      setSelectedFile(e.dataTransfer.files[0]);
                    }
                  }}
                  className={`w-full flex items-center justify-between gap-3 rounded-2xl border-2 border-dashed p-4 transition-all cursor-pointer group ${
                    selectedFile
                      ? "border-emerald-500/50 bg-emerald-500/5"
                      : "border-white/15 hover:border-[#FF5722]/60 bg-[#070B14]"
                  }`}
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div
                      className={`flex h-11 w-11 items-center justify-center rounded-xl border group-hover:scale-105 transition-transform shrink-0 ${
                        selectedFile
                          ? "border-emerald-500/30 bg-emerald-500/20 text-emerald-400"
                          : "border-[#FF5722]/30 bg-[#FF5722]/10 text-[#FFA000]"
                      }`}
                    >
                      {selectedFile ? <CheckCircle2 size={20} /> : <Upload size={20} />}
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-xs sm:text-sm font-extrabold text-white truncate">
                          {selectedFile ? selectedFile.name : "Drop your 16:9 video or audio here"}
                        </span>
                        {selectedFile && (
                          <span className="rounded-md bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-mono font-bold px-2 py-0.5 shrink-0">
                            Loaded
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-400 truncate mt-0.5">
                        {selectedFile
                          ? `${(selectedFile.size / (1024 * 1024)).toFixed(1)} MB • ${
                              mediaDurationSeconds > 0 ? `${mediaDurationSeconds}s` : "Ready"
                            }`
                          : "Drag & drop MP4, MOV, MP3, WAV • Max 10 minutes (600s)"}
                      </p>
                    </div>
                  </div>

                  <span className="rounded-xl border border-[#FF5722]/30 bg-gradient-to-r from-[#FF5722] via-[#FF7043] to-[#FFA000] text-black font-black text-xs px-4 py-2 hover:brightness-110 shadow-md shadow-[#FF5722]/20 transition shrink-0 flex items-center gap-1.5 cursor-pointer">
                    <Upload size={13} className="text-black" />
                    <span>{selectedFile ? "Change File" : "Browse Files"}</span>
                  </span>
                </div>

                {/* Duration & Waveform Pill */}
                {selectedFile && mediaDurationSeconds > 0 && (
                  <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-2.5 text-xs flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <Activity size={15} className="text-emerald-400" />
                      <span className="text-slate-100 font-bold">
                        Duration: <NumberTicker value={Math.round(mediaDurationSeconds)} />s (~
                        <NumberTicker value={estimatedWordCount} /> words)
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      <AudioSpectrumVisualizer
                        isPlaying={Boolean(selectedFile)}
                        isTranscribing={isTranscribing}
                      />
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedFile(null);
                        }}
                        className="text-xs text-slate-400 hover:text-red-400 font-bold transition flex items-center gap-1 cursor-pointer"
                      >
                        <Trash2 size={12} />
                        <span>Remove</span>
                      </button>
                    </div>
                  </div>
                )}

                {/* ── Interactive Cloudinary Sample Videos (Instant Testing with Real Media) ── */}
                <div className="pt-2 border-t border-white/5 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-black uppercase text-slate-300 flex items-center gap-1.5">
                      <Film size={12} className="text-[#FF7043]" />
                      <span>Or Try With Sample Cloudinary Video:</span>
                    </span>
                    {selectedFile && (
                      <span className="text-[10px] text-amber-400 font-semibold">
                        (Custom video active)
                      </span>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    {CLOUDINARY_SAMPLE_VIDEOS.map((sample) => {
                      const isActive = !selectedFile && activeSampleId === sample.id;
                      return (
                        <button
                          key={sample.id}
                          type="button"
                          onClick={() => {
                            setSelectedFile(null);
                            setActiveSampleId(sample.id);
                            setPreviewDuration(sample.durationSeconds);
                            setEditedTranscript(sample.sampleTranscript);
                            setPreviewCaptions(sample.sampleCaptions);
                            if (previewVideoRef.current) {
                              previewVideoRef.current.currentTime = 0;
                            }
                          }}
                          className={`rounded-xl border p-2.5 text-left transition-all cursor-pointer flex flex-col justify-between ${
                            isActive
                              ? "border-[#FF5722] bg-[#FF5722]/15 text-white shadow-md ring-1 ring-[#FF5722]"
                              : "border-white/10 bg-[#070B14] text-slate-400 hover:text-white hover:border-white/20"
                          }`}
                        >
                          <div className="flex items-center justify-between w-full">
                            <span className="text-[10px] font-bold uppercase text-[#FFA000]">
                              {sample.category}
                            </span>
                            <span className="text-[9px] font-mono text-slate-400">
                              {sample.durationSeconds}s
                            </span>
                          </div>
                          <p className="text-xs font-bold text-white truncate mt-1">
                            {sample.name}
                          </p>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* ── 2. Spacious 16:9 Broadcast Subtitle Gallery ── */}
              <div className="rounded-[28px] border border-white/10 bg-[#0E1526] p-5 sm:p-6 shadow-2xl space-y-4 relative overflow-hidden">
                <BorderBeam size={220} duration={14} colorFrom="#FF5722" colorTo="#FFA000" />

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
                  <div className="flex items-center gap-3">
                    <span className="flex h-7 w-7 items-center justify-center rounded-xl bg-[#FF5722]/15 text-[#FFA000] text-xs font-black border border-[#FF5722]/30">
                      2
                    </span>
                    <div>
                      <h3 className="text-sm sm:text-base font-black text-white flex items-center gap-2">
                        <Film size={16} className="text-[#FF7043]" />
                        <span>16:9 Subtitle Style Gallery</span>
                      </h3>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        Select from 15 Tier-1 creator presets. Updates preview instantly.
                      </p>
                    </div>
                  </div>

                  {/* Search Input Box */}
                  <div className="relative min-w-[180px]">
                    <Search
                      size={13}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                    />
                    <input
                      type="text"
                      placeholder="Search presets..."
                      value={presetSearch}
                      onChange={(e) => setPresetSearch(e.target.value)}
                      className="w-full bg-[#070B14] text-xs text-white placeholder-slate-500 rounded-xl border border-white/15 pl-8 pr-3 py-2 focus:border-[#FF5722] focus:outline-none"
                    />
                  </div>
                </div>

                {/* Category Filter Pills */}
                <div className="flex flex-wrap items-center gap-2">
                  {[
                    { id: "all", label: "All Styles" },
                    { id: "cinematic", label: "🎬 Cinematic" },
                    { id: "viral", label: "🔥 Viral & Bold" },
                    { id: "podcast", label: "🎙️ Podcast" },
                    { id: "minimal", label: "✨ Minimal" },
                    { id: "educational", label: "🧠 Educational" },
                  ].map((cat) => {
                    const active = selectedCategory === cat.id;
                    return (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => setSelectedCategory(cat.id)}
                        className={`rounded-full px-3 py-1 text-[11px] font-black transition cursor-pointer ${
                          active
                            ? "bg-gradient-to-r from-[#FF5722] via-[#FF7043] to-[#FFA000] text-black shadow-md shadow-[#FF5722]/25"
                            : "bg-[#070B14] text-slate-400 border border-white/10 hover:text-white hover:border-white/20"
                        }`}
                      >
                        {cat.label}
                      </button>
                    );
                  })}
                </div>

                {/* Responsive 3-Column Clean Specimen Cards Grid (Zero CPU Video Lag) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 pt-1">
                  {filteredPresets.map((preset) => {
                    const active = captionStyle === preset.id;
                    return (
                      <button
                        key={preset.id}
                        type="button"
                        onClick={() => handleSelectPreset(preset)}
                        className={`rounded-2xl border p-3.5 text-left transition-all cursor-pointer relative overflow-hidden group active:scale-[0.98] ${
                          active
                            ? "border-[#FF5722] bg-[#FF5722]/15 text-white ring-2 ring-[#FF5722] shadow-xl shadow-[#FF5722]/20"
                            : "border-white/10 bg-[#070B14] text-slate-400 hover:text-white hover:border-white/20"
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1 gap-1">
                          <span
                            className={`text-xs font-black truncate ${
                              active ? "text-[#FFA000]" : "text-white"
                            }`}
                          >
                            {preset.title}
                          </span>
                          {active && (
                            <span className="flex h-4 w-4 items-center justify-center rounded-full bg-gradient-to-r from-[#FF5722] to-[#FFA000] text-black">
                              <Check size={10} strokeWidth={3} />
                            </span>
                          )}
                        </div>

                        <p className="text-[10px] text-slate-400 mb-2.5 leading-tight line-clamp-1">
                          {preset.desc}
                        </p>

                        {/* Live Stylized Specimen Box */}
                        <div className="relative w-full aspect-[16/7] rounded-xl border border-white/10 bg-[#03060C] overflow-hidden flex items-center justify-center p-2 group-hover:border-[#FF5722]/40 transition-colors">
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent pointer-events-none" />

                          <span
                            style={{
                              fontFamily: preset.fontFamily,
                              color: preset.textColor,
                              backgroundColor:
                                preset.backgroundColor !== "rgba(0, 0, 0, 0.88)"
                                  ? preset.backgroundColor
                                  : undefined,
                            }}
                            className="relative z-10 text-[10px] sm:text-[11px] font-black text-center block truncate px-2.5 py-1 rounded shadow-lg backdrop-blur-xs border border-white/10 max-w-[95%]"
                          >
                            <span style={{ color: preset.highlightColor }}>
                              {preset.specimen}
                            </span>
                          </span>

                          <span className="absolute bottom-1 right-2 text-[8px] font-mono text-slate-500 z-10">
                            {preset.badge}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* ── 3. Alignment, Safe-Zone & Custom Typography ── */}
              <div className="rounded-[28px] border border-white/10 bg-[#0E1526] p-5 sm:p-6 shadow-xl space-y-4">
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <div className="flex items-center gap-3">
                    <span className="flex h-7 w-7 items-center justify-center rounded-xl bg-[#FF5722]/15 text-[#FFA000] text-xs font-black border border-[#FF5722]/30">
                      3
                    </span>
                    <div>
                      <h3 className="text-sm sm:text-base font-black text-white flex items-center gap-2">
                        <SlidersHorizontal size={16} className="text-[#FF7043]" />
                        <span>Alignment &amp; Typography</span>
                      </h3>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        Fine-tune safe zones, languages, and typography overrides.
                      </p>
                    </div>
                  </div>

                  {/* Settings Tab Selector */}
                  <div className="flex items-center gap-1 bg-[#070B14] p-1 rounded-xl border border-white/10">
                    <button
                      type="button"
                      onClick={() => setActiveSettingsTab("typography")}
                      className={`px-2.5 py-1 rounded-lg text-[10.5px] font-bold transition cursor-pointer ${
                        activeSettingsTab === "typography"
                          ? "bg-[#FF5722] text-black font-black"
                          : "text-slate-400 hover:text-white"
                      }`}
                    >
                      Typography
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveSettingsTab("safezone")}
                      className={`px-2.5 py-1 rounded-lg text-[10.5px] font-bold transition cursor-pointer ${
                        activeSettingsTab === "safezone"
                          ? "bg-[#FF5722] text-black font-black"
                          : "text-slate-400 hover:text-white"
                      }`}
                    >
                      Safe-Zone
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveSettingsTab("language")}
                      className={`px-2.5 py-1 rounded-lg text-[10.5px] font-bold transition cursor-pointer ${
                        activeSettingsTab === "language"
                          ? "bg-[#FF5722] text-black font-black"
                          : "text-slate-400 hover:text-white"
                      }`}
                    >
                      Language
                    </button>
                  </div>
                </div>

                {/* Tab 1: Typography Controls */}
                {activeSettingsTab === "typography" && (
                  <div className="space-y-3.5 pt-1">
                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-slate-300 block">
                        Font Family Override
                      </label>
                      <select
                        className="w-full rounded-xl border border-white/10 bg-[#070B14] text-slate-100 text-xs px-3 py-2.5 focus:border-[#FF5722] focus:outline-none cursor-pointer font-bold"
                        value={captionFontFamily}
                        onChange={(e) => setCaptionFontFamily(e.target.value)}
                      >
                        <option value="preset">Preset Default Font</option>
                        <option value="Impact, sans-serif">Impact (Bold Heavy)</option>
                        <option value="Montserrat, sans-serif">Montserrat (Modern Clean)</option>
                        <option value="'Roboto Condensed', sans-serif">Roboto Condensed (Punchy)</option>
                        <option value="Poppins, sans-serif">Poppins (Smooth Geometric)</option>
                        <option value="Inter, sans-serif">Inter (Minimal Tech)</option>
                        <option value="'Bebas Neue', sans-serif">Bebas Neue (Tall Headline)</option>
                        <option value="Oswald, sans-serif">Oswald (Narrow Bold)</option>
                        <option value="Anton, sans-serif">Anton (Heavy Poster)</option>
                      </select>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="text-[11px] font-bold text-slate-300 block">Font Size</label>
                        <select
                          className="w-full rounded-xl border border-white/10 bg-[#070B14] text-slate-100 text-xs px-2.5 py-2 focus:border-[#FF5722] focus:outline-none cursor-pointer font-bold"
                          value={captionFontSize}
                          onChange={(e) => setCaptionFontSize(e.target.value as any)}
                        >
                          <option value="small">Small (28px)</option>
                          <option value="medium">Medium (34px)</option>
                          <option value="large">Large (42px — Recommended)</option>
                          <option value="xlarge">Extra Large (50px)</option>
                        </select>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[11px] font-bold text-slate-300 block">Position</label>
                        <select
                          className="w-full rounded-xl border border-white/10 bg-[#070B14] text-slate-100 text-xs px-2.5 py-2 focus:border-[#FF5722] focus:outline-none cursor-pointer font-bold"
                          value={captionPosition}
                          onChange={(e) => setCaptionPosition(e.target.value as any)}
                        >
                          <option value="bottom">Bottom (14% Safe Zone)</option>
                          <option value="center">Center Stage</option>
                          <option value="top">Top Header</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="text-[11px] font-bold text-slate-300 block">Text Color</label>
                        <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-[#070B14] p-1.5">
                          <input
                            type="color"
                            value={captionTextColor}
                            onChange={(e) => setCaptionTextColor(e.target.value)}
                            className="h-6 w-6 rounded border border-slate-700 cursor-pointer p-0 bg-transparent shrink-0"
                          />
                          <span className="font-mono text-xs font-bold text-slate-200 uppercase truncate">
                            {captionTextColor}
                          </span>
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[11px] font-bold text-slate-300 block">Highlight Color</label>
                        <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-[#070B14] p-1.5">
                          <input
                            type="color"
                            value={captionHighlightColor}
                            onChange={(e) => setCaptionHighlightColor(e.target.value)}
                            className="h-6 w-6 rounded border border-slate-700 cursor-pointer p-0 bg-transparent shrink-0"
                          />
                          <span className="font-mono text-xs font-bold text-[#FFA000] uppercase truncate">
                            {captionHighlightColor}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Tab 2: Safe-Zone & Casing */}
                {activeSettingsTab === "safezone" && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-bold text-slate-300 block">
                        YouTube Scrubber Safe-Zone
                      </label>
                      <select
                        value={youtubeSubtitleSafeZone}
                        onChange={(e) => setYoutubeSubtitleSafeZone(e.target.value as any)}
                        className="w-full bg-[#070B14] text-white text-xs font-bold rounded-xl border border-white/10 px-3 py-2.5 focus:border-[#FF5722] focus:outline-none cursor-pointer"
                      >
                        <option value="scrubber">14% Clearance (Recommended YouTube)</option>
                        <option value="standard">10% Standard Clearance</option>
                        <option value="high">18% High Clearance (Large Scrubbers)</option>
                      </select>
                      <p className="text-[10px] text-slate-400">
                        Prevents subtitles from being covered by YouTube’s bottom progress bar.
                      </p>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[11px] font-bold text-slate-300 block">Text Casing</label>
                      <select
                        value={youtubeSubtitleCase}
                        onChange={(e) => setYoutubeSubtitleCase(e.target.value as any)}
                        className="w-full bg-[#070B14] text-white text-xs font-bold rounded-xl border border-white/10 px-3 py-2.5 focus:border-[#FF5722] focus:outline-none cursor-pointer"
                      >
                        <option value="natural">Natural Case (Sentence Case)</option>
                        <option value="uppercase">ALL UPPERCASE (Punchy Headlines)</option>
                      </select>
                      <p className="text-[10px] text-slate-400">
                        Formats word typography dynamically across all frames.
                      </p>
                    </div>
                  </div>
                )}

                {/* Tab 3: Language Settings */}
                {activeSettingsTab === "language" && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-bold text-slate-300 block">Spoken Language</label>
                      <select
                        value={spokenLanguage}
                        onChange={(e) => setSpokenLanguage(e.target.value)}
                        className="w-full bg-[#070B14] text-white text-xs font-bold rounded-xl border border-white/10 px-3 py-2.5 focus:border-[#FF5722] focus:outline-none cursor-pointer"
                      >
                        {AUDIO_SPOKEN_LANGUAGES.map((l) => (
                          <option key={l.id} value={l.id} className="bg-[#070B14] text-white">
                            {l.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[11px] font-bold text-slate-300 block">Subtitle Script</label>
                      <select
                        value={captionLanguage}
                        onChange={(e) => setCaptionLanguage(e.target.value)}
                        className="w-full bg-[#070B14] text-white text-xs font-bold rounded-xl border border-white/10 px-3 py-2.5 focus:border-[#FF5722] focus:outline-none cursor-pointer"
                      >
                        {SUBTITLE_OUTPUT_LANGUAGES.map((l) => (
                          <option key={l.id} value={l.id} className="bg-[#070B14] text-white">
                            {l.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* ── RIGHT COLUMN (5 Cols, Sticky Stage): Live 16:9 Cinema Player & Dual Export Hub ── */}
            <div className="lg:col-span-5 lg:sticky lg:top-20 space-y-6">
              {/* 16:9 Broadcast Video Preview Stage */}
              <div className="rounded-[28px] border border-white/10 bg-[#0E1526] p-5 shadow-2xl space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-white/10">
                  <div className="flex items-center gap-2 min-w-0">
                    <span
                      className={`flex h-2.5 w-2.5 rounded-full shrink-0 ${
                        selectedFile ? "bg-emerald-400 animate-pulse" : "bg-[#FF5722] animate-pulse"
                      }`}
                    />
                    <span className="text-xs font-black uppercase tracking-wider text-white truncate">
                      {selectedFile
                        ? selectedFile.name
                        : `16:9 Preview • ${activePresetConfig.title}`}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span className="rounded-full bg-[#FF5722]/10 border border-[#FF5722]/30 px-2.5 py-0.5 text-[10px] font-black text-[#FFA000]">
                      1080p MP4
                    </span>
                  </div>
                </div>

                {/* 16:9 Cinema Widescreen Player Container */}
                <div className="relative w-full aspect-video rounded-2xl bg-black border border-white/10 overflow-hidden shadow-2xl flex items-center justify-center group select-none">
                  {/* Real Cloudinary 16:9 Broadcast Video or User Uploaded Video */}
                  <video
                    ref={previewVideoRef}
                    src={activePreviewVideoSrc}
                    poster={activePreviewPoster}
                    autoPlay
                    playsInline
                    loop
                    muted={isMuted}
                    preload="auto"
                    onLoadedMetadata={(e) => {
                      const d = e.currentTarget.duration;
                      if (d && !isNaN(d) && isFinite(d) && d > 0) {
                        setPreviewDuration(Math.round(d));
                      }
                    }}
                    onPlay={() => setIsPlaying(true)}
                    onPause={() => setIsPlaying(false)}
                    onClick={togglePlay}
                    className="h-full w-full object-cover cursor-pointer"
                  />

                  {/* Top Live Indicator Badge */}
                  <div className="absolute top-3 left-3 z-20 pointer-events-none">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-black/75 backdrop-blur-md border border-white/15 text-[#FFA000] text-[10px] font-extrabold uppercase px-3 py-1 tracking-wider shadow-md">
                      <Sparkles size={11} className="text-[#FF5722]" />
                      <span>{activePresetConfig.title}</span>
                    </span>
                  </div>

                  {/* Floating Mute/Unmute */}
                  <button
                    type="button"
                    onClick={toggleMute}
                    aria-label={isMuted ? "Unmute audio" : "Mute audio"}
                    className="absolute top-3 right-3 z-20 flex h-8 w-8 items-center justify-center rounded-full bg-black/80 text-white hover:bg-black transition shadow-md border border-white/15 cursor-pointer"
                  >
                    {isMuted ? <VolumeX size={14} /> : <Volume2 size={14} className="text-emerald-400" />}
                  </button>

                  {/* ── Real-Time 16:9 Burned-In Subtitle Overlay ── */}
                  <div
                    className={`pointer-events-none absolute inset-x-4 ${safeMarginBottomClass} flex justify-center text-center z-10 transition-all duration-200`}
                  >
                    <div
                      style={{
                        fontFamily:
                          captionFontFamily !== "preset"
                            ? captionFontFamily
                            : activePresetConfig.fontFamily,
                        color: captionTextColor,
                        backgroundColor:
                          captionBackgroundColor !== "" ? captionBackgroundColor : undefined,
                      }}
                      className="px-4 py-1.5 rounded-xl text-center text-xs sm:text-sm font-extrabold tracking-wide shadow-2xl backdrop-blur-xs max-w-[85%] border border-white/10"
                    >
                      <span
                        style={{ color: captionHighlightColor }}
                        className={youtubeSubtitleCase === "uppercase" ? "uppercase" : ""}
                      >
                        {currentActiveCaptionText}
                      </span>
                    </div>
                  </div>

                  {/* ── 14% YouTube Scrubber Safe-Zone Overlay Indicator ── */}
                  <div className="pointer-events-none absolute inset-x-0 bottom-[14%] border-b border-dashed border-red-500/40 z-10 flex justify-end pr-3">
                    <span className="rounded bg-black/80 border border-red-500/30 px-1.5 py-0.5 text-[8px] font-mono font-bold text-red-400 -translate-y-1/2">
                      14% YouTube Scrubber Safe Line
                    </span>
                  </div>

                  {/* Mock YouTube Red Scrubber Bar at Bottom Edge */}
                  <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1 bg-red-600/80 z-20" />

                  {/* Center Play/Pause button when paused */}
                  {!isPlaying && (
                    <button
                      type="button"
                      onClick={togglePlay}
                      aria-label="Play preview"
                      className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-[1px] transition-all cursor-pointer group z-20"
                    >
                      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-r from-[#FF5722] via-[#FF7043] to-[#FFA000] text-black shadow-2xl transition-transform group-hover:scale-110">
                        <Play size={24} className="fill-current ml-1 text-black" />
                      </div>
                    </button>
                  )}

                  {/* Bottom Video Progress Scrub Line */}
                  <div className="absolute inset-x-0 bottom-1 h-1 bg-white/20 z-20">
                    <div
                      className="h-full bg-gradient-to-r from-[#FF5722] via-[#FF7043] to-[#FFA000] transition-all duration-150"
                      style={{
                        width:
                          previewDuration > 0
                            ? `${(playbackTime / previewDuration) * 100}%`
                            : "0%",
                      }}
                    />
                  </div>
                </div>

                {/* Player Controls Bar */}
                <div className="flex items-center justify-between text-xs font-semibold text-slate-400 pt-1">
                  <button
                    type="button"
                    onClick={togglePlay}
                    className="inline-flex items-center gap-1.5 text-slate-200 hover:text-[#FFA000] transition cursor-pointer font-bold"
                  >
                    {isPlaying ? (
                      <Pause size={14} className="text-[#FF7043]" />
                    ) : (
                      <Play size={14} className="fill-current text-[#FF7043]" />
                    )}
                    <span>{isPlaying ? "Pause Preview" : "Play Preview"}</span>
                  </button>

                  <span className="text-[11px] text-slate-400 font-mono">
                    {Math.floor(playbackTime)}s / {Math.floor(previewDuration || 18)}s
                  </span>

                  <button
                    type="button"
                    onClick={toggleMute}
                    className="inline-flex items-center gap-1 text-slate-200 hover:text-[#FFA000] transition cursor-pointer"
                  >
                    {isMuted ? <VolumeX size={13} /> : <Volume2 size={13} className="text-emerald-400" />}
                    <span>{isMuted ? "Unmute Audio" : "Mute Audio"}</span>
                  </button>
                </div>
              </div>

              {/* ── Dual Export Hub & Cost Calculation ── */}
              <div className="rounded-[28px] border border-white/10 bg-[#0E1526] p-5 sm:p-6 shadow-2xl space-y-4">
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-white">
                    <FileText size={15} className="text-[#FF7043]" />
                    <span>Dual Export Hub</span>
                  </div>
                  <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20 font-bold">
                    1 Min = 1 Cr
                  </span>
                </div>

                {/* Summary Specs Table */}
                <div className="space-y-2 text-xs">
                  <div className="flex items-center justify-between text-slate-400 border-b border-white/5 pb-2">
                    <span>Duration &amp; Words</span>
                    <span className="font-mono text-white font-bold">
                      {Math.round(currentDurationSeconds)}s (~{estimatedWordCount} words)
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-slate-400 border-b border-white/5 pb-2">
                    <span>Active Subtitle Style</span>
                    <span className="font-bold text-[#FFA000]">{activePresetConfig.title}</span>
                  </div>
                  <div className="flex items-center justify-between text-slate-400 border-b border-white/5 pb-2">
                    <span>Credit Rate (Rule 4.1)</span>
                    <span className="font-mono text-emerald-400 font-bold">
                      {calculatedCredits} {calculatedCredits === 1 ? "Credit" : "Credits"} ({calculatedCredits}m duration)
                    </span>
                  </div>
                </div>

                <div className="space-y-3 pt-2">
                  {/* Primary Action Button: Render 16:9 Subtitled Video */}
                  <button
                    type="button"
                    onClick={handleStartRender}
                    disabled={isWorking || isExportingSubtitles}
                    className="w-full inline-flex min-h-[52px] items-center justify-between px-5 rounded-2xl bg-gradient-to-r from-[#FF5722] via-[#FF7043] to-[#FFA000] text-sm font-black text-black shadow-xl shadow-[#FF5722]/25 transition hover:brightness-110 active:scale-95 disabled:opacity-45 disabled:cursor-not-allowed cursor-pointer"
                  >
                    <span className="flex items-center gap-2">
                      <Sparkles size={16} className="text-black" />
                      <span>Render 16:9 Subtitled Video</span>
                    </span>
                    <span className="rounded-full bg-black/25 px-2.5 py-0.5 text-xs font-mono font-bold">
                      {calculatedCredits} {calculatedCredits === 1 ? "Credit" : "Credits"}
                    </span>
                  </button>

                  {/* Secondary Action Buttons: Download Subtitles (.SRT / .VTT) */}
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => handleExportSubtitles("srt")}
                      disabled={isWorking || isExportingSubtitles}
                      className="inline-flex min-h-[44px] items-center justify-center gap-1.5 rounded-2xl border border-white/10 bg-[#070B14] hover:bg-white/10 text-xs font-bold text-white transition disabled:opacity-45 disabled:cursor-not-allowed cursor-pointer active:scale-95"
                    >
                      {isExportingSubtitles ? (
                        <Loader2 size={13} className="animate-spin text-[#FFA000]" />
                      ) : (
                        <Download size={13} className="text-[#FF7043]" />
                      )}
                      <span>Download .SRT</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleExportSubtitles("vtt")}
                      disabled={isWorking || isExportingSubtitles}
                      className="inline-flex min-h-[44px] items-center justify-center gap-1.5 rounded-2xl border border-white/10 bg-[#070B14] hover:bg-white/10 text-xs font-bold text-white transition disabled:opacity-45 disabled:cursor-not-allowed cursor-pointer active:scale-95"
                    >
                      {isExportingSubtitles ? (
                        <Loader2 size={13} className="animate-spin text-[#FFA000]" />
                      ) : (
                        <Download size={13} className="text-[#FF7043]" />
                      )}
                      <span>Download .VTT</span>
                    </button>
                  </div>

                  {!selectedFile && (
                    <p className="text-[10px] text-center text-slate-500 font-semibold">
                      *Rendering will use your uploaded video. Or try testing presets above with Cloudinary samples!
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
