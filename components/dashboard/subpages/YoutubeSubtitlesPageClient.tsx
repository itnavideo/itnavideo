"use client";

import React, { useState, useEffect, useRef, useMemo, ChangeEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import BrandLogo from "@/components/brand/BrandLogo";
import { useAuth } from "@/components/auth/AuthContext";
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
} from "lucide-react";
import { SUBTITLE_PRESETS } from "@/remotion/types/subtitles";
import { BorderBeam } from "@/components/magicui/BorderBeam";
import { NumberTicker } from "@/components/magicui/NumberTicker";
import { AudioSpectrumVisualizer } from "@/components/dashboard/AudioSpectrumVisualizer";

// Cloudinary-hosted 16:9 talking head broadcast preview video & poster screenshot
const CLOUDINARY_16_9_PREVIEW_VIDEO =
  "https://res.cloudinary.com/dhouh9idx/video/upload/v1790440433/itnavideo-assets/youtube-subtitles/youtube_subtitle_preview.mp4";
const CLOUDINARY_16_9_PREVIEW_POSTER =
  "https://res.cloudinary.com/dhouh9idx/video/upload/v1790440433/itnavideo-assets/youtube-subtitles/youtube_subtitle_preview.jpg";

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
const BROADCAST_PRESETS = [
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
    highlightColor: "#FF6D00",
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
    highlightColor: "#FF6D00",
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
    highlightColor: "#FFA726",
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
  { label: "Widescreen video received", detail: "Landscape/horizontal 16:9 video uploaded securely to cloud.", threshold: 0.08, icon: Upload },
  { label: "AI transcribing voiceover", detail: "Speech AI mapping vocal patterns, sentences, and timing marks.", threshold: 0.32, icon: Layers3 },
  { label: "Aligning subtitle segments", detail: "Aligning broadcast subtitles with 14% YouTube scrubber clearance.", threshold: 0.62, icon: Sparkles },
  { label: "Rendering 16:9 widescreen", detail: "Cloud render engine compiling 1080p Full HD video with burnt-in tracks.", threshold: 0.85, icon: Film },
  { label: "Ready to download", detail: "Widescreen video with burnt-in captions ready for YouTube broadcast.", threshold: 0.98, icon: Clapperboard },
];

export default function YoutubeSubtitlesPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();

  // Form states
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [captionStyle, setCaptionStyle] = useState<string>("BBC / Netflix Closed Captions");
  const [captionPosition, setCaptionPosition] = useState<"top" | "center" | "bottom">("bottom");
  const [captionFontSize, setCaptionFontSize] = useState<"small" | "medium" | "large" | "xlarge">("large");
  const [captionFontFamily, setCaptionFontFamily] = useState<string>("preset");
  const [captionTextColor, setCaptionTextColor] = useState<string>("#ffffff");
  const [captionHighlightColor, setCaptionHighlightColor] = useState<string>("#ffffff");
  const [captionBackgroundColor, setCaptionBackgroundColor] = useState<string>("rgba(0, 0, 0, 0.88)");
  const [spokenLanguage, setSpokenLanguage] = useState<string>("auto");
  const [captionLanguage, setCaptionLanguage] = useState<string>("same");

  // Preset Filtering & Search States
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [presetSearch, setPresetSearch] = useState<string>("");

  const filteredPresets = useMemo(() => {
    return BROADCAST_PRESETS.filter((p) => {
      const matchesSearch =
        !presetSearch ||
        p.title.toLowerCase().includes(presetSearch.toLowerCase()) ||
        p.desc.toLowerCase().includes(presetSearch.toLowerCase()) ||
        p.specimen.toLowerCase().includes(presetSearch.toLowerCase());
      const matchesCategory = selectedCategory === "all" || (p as any).category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [presetSearch, selectedCategory]);

  // YouTube Subtitles safe-zone & casing
  const [youtubeSubtitleSafeZone, setYoutubeSubtitleSafeZone] = useState<"standard" | "scrubber" | "high">("scrubber");
  const [youtubeSubtitleCase, setYoutubeSubtitleCase] = useState<"natural" | "uppercase">("natural");

  // Custom styling collapsible (Open by default)
  const [showAdvanced, setShowAdvanced] = useState(true);

  // Media Metadata
  const [mediaDurationSeconds, setMediaDurationSeconds] = useState<number>(0);
  const [mediaAspect, setMediaAspect] = useState<string>("landscape");

  // Live Preview Player states
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(true);
  const [playbackTime, setPlaybackTime] = useState<number>(0);
  const [previewDuration, setPreviewDuration] = useState<number>(10);
  const previewVideoRef = useRef<HTMLVideoElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Job & render states
  const [jobStatus, setJobStatus] = useState<JobStatus>({ state: "idle" });
  const [billingEntitlement, setBillingEntitlement] = useState<BillingEntitlement | null>(null);
  const [recentRenders, setRecentRenders] = useState<RecentRender[]>([]);

  // Transcription states
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
        const res = await fetch(`/api/billing/entitlement?userId=${encodeURIComponent(user?.id || "")}`);
        const payload = await res.json().catch(() => ({}));
        if (res.ok && payload.ok && payload.entitlement) {
          const ent = payload.entitlement;
          const limit = Math.max(0, Math.round(Number(payload.usage?.limit || ent.monthlyVideoLimit || 0)));
          const used = Math.max(0, Math.round(Number(payload.usage?.used || 0)));
          const remaining = Math.max(0, Math.round(Number(payload.usage?.remaining || limit - used)));
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

  // Handle uploaded video metadata
  useEffect(() => {
    if (!selectedFile) {
      setMediaDurationSeconds(0);
      setMediaAspect("landscape");
      setEditedTranscript("");
      setPreviewCaptions(null);
      return;
    }

    const type = selectedFile.type || "";
    const name = selectedFile.name.toLowerCase();
    const isVideoOrAudio = type.startsWith("video/") || type.startsWith("audio/") || /\.(mp4|mov|mp3|wav|m4a|aac)$/i.test(name);

    if (isVideoOrAudio) {
      const url = URL.createObjectURL(selectedFile);
      const isAud = type.startsWith("audio/") || /\.(mp3|wav|m4a|aac)$/i.test(name);
      const element = document.createElement(isAud ? "audio" : "video");
      element.src = url;
      element.preload = "metadata";

      const handleLoadedMetadata = () => {
        setMediaDurationSeconds(element.duration || 0);
        setMediaAspect("landscape");
        setPreviewDuration(element.duration || 10);
        URL.revokeObjectURL(url);
      };

      element.addEventListener("loadedmetadata", handleLoadedMetadata);
      return () => {
        element.removeEventListener("loadedmetadata", handleLoadedMetadata);
        URL.revokeObjectURL(url);
      };
    }
  }, [selectedFile]);

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
  const activePreviewVideoSrc = uploadedVideoUrl || CLOUDINARY_16_9_PREVIEW_VIDEO;

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
        fontFamily: remotionPreset.fontFamily,
        textColor: remotionPreset.textColor,
        highlightColor: remotionPreset.highlightColor,
        backgroundColor: remotionPreset.backgroundColor || "rgba(0, 0, 0, 0.88)",
      };
    }
    return BROADCAST_PRESETS[0];
  }, [captionStyle]);

  // Presigned uploader
  async function uploadFileViaPresign(file: File, mode: string, userId: string): Promise<string> {
    const contentType = file.type || "application/octet-stream";
    const presignRes = await fetch("/api/media/presign", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        fileName: file.name,
        contentType,
        fileSize: file.size,
        mode,
        userId,
      }),
    });
    const presign = await presignRes.json().catch(() => ({}));
    if (!presignRes.ok || !presign.ok || !presign.uploadUrl) {
      throw new Error(presign.error || `Could not prepare upload for ${file.name}`);
    }

    const uploadRes = await fetch(presign.uploadUrl, {
      method: "PUT",
      headers: { "Content-Type": contentType },
      body: file,
    });
    if (!uploadRes.ok) {
      throw new Error(`Upload failed for ${file.name}`);
    }

    return presign.key as string;
  }

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

      const mediaKey = await uploadFileViaPresign(selectedFile, "youtubeSubtitleGenerator", user.id);

      setJobStatus({
        state: "starting",
        message: "Configuring YouTube 16:9 subtitle engines & safe-zone alignment...",
        progress: 0.22,
      });

      const plannedTitle = selectedFile.name.replace(/\.[^/.]+$/, "");
      const isAudio = selectedFile.type.startsWith("audio/") || /\.(mp3|wav|m4a|aac)$/i.test(selectedFile.name);

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
          captionStyle,
          captionPosition,
          captionFontSize,
          captionFontFamily: captionFontFamily !== "preset" ? captionFontFamily : undefined,
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
              ? [0, Math.min(27000, Math.round(mediaDurationSeconds * 30)) - 1]
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
      const MAX_ATTEMPTS = 800;

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

  async function handleExportSubtitles(format: "srt" | "vtt" = "srt") {
    if (!user) {
      router.push("/login?returnUrl=/dashboard/youtube-subtitles");
      return;
    }
    if (!selectedFile) {
      fileInputRef.current?.click();
      return;
    }
    try {
      setIsExportingSubtitles(true);
      const mediaKey = await uploadFileViaPresign(selectedFile, "youtubeSubtitleGenerator", user.id);
      const res = await fetch("/api/reels/subtitles/export", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mediaKey,
          fileName: selectedFile.name,
          format,
          spokenLanguage: spokenLanguage !== "auto" ? spokenLanguage : undefined,
          captionLanguage: captionLanguage !== "same" ? captionLanguage : undefined,
          youtubeSubtitleCase,
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
      const baseName = selectedFile.name.replace(/\.[^/.]+$/, "") || "subtitles";
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
    ? Math.round(billingEntitlement.usage?.remaining ?? billingEntitlement.monthlyVideoLimit ?? 0)
    : undefined;
  const isWorking =
    jobStatus.state === "uploading" || jobStatus.state === "starting" || jobStatus.state === "rendering";
  const isReady = jobStatus.state === "ready" && Boolean(jobStatus.outputFile);
  const isError = jobStatus.state === "error";

  // Estimated speech metrics
  const estimatedWordCount = useMemo(() => {
    if (!mediaDurationSeconds || mediaDurationSeconds <= 0) return 0;
    return Math.round((mediaDurationSeconds / 60) * 140);
  }, [mediaDurationSeconds]);

  // Safe margin position percentage calculation for live preview
  const safeMarginBottomClass =
    youtubeSubtitleSafeZone === "high"
      ? "bottom-[18%]"
      : youtubeSubtitleSafeZone === "standard"
      ? "bottom-[10%]"
      : "bottom-[14%]";

  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#090A0F] flex flex-col items-center justify-center text-zinc-400 gap-3">
        <Loader2 className="h-8 w-8 animate-spin text-[#FF9100]" />
        <p className="text-sm font-semibold tracking-wide text-zinc-300">
          Loading YouTube Subtitle Studio...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#090A0F] text-white flex flex-col selection:bg-[#FF6D00]/30 selection:text-[#FFA726]">
      {/* ── Top Navigation Bar ── */}
      <header className="sticky top-0 z-40 border-b border-white/10 bg-[#090A0F]/90 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 sm:gap-4">
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 hover:bg-white/10 px-3 py-1.5 text-xs font-bold text-zinc-300 hover:text-white transition group"
            >
              <ArrowLeft size={14} className="group-hover:-translate-x-0.5 transition-transform" />
              <span className="hidden sm:inline">All Studios</span>
            </Link>

            <div className="h-4 w-px bg-white/10" />

            <BrandLogo size="sm" showBadge={false} />

            <span className="hidden md:inline-flex items-center gap-1.5 rounded-full border border-[#FF6D00]/30 bg-[#FF6D00]/10 px-2.5 py-0.5 text-[11px] font-black text-[#FF9100]">
              <Sparkles size={11} className="text-[#FF9100]" />
              Studio #8 • 16:9 Widescreen
            </span>
          </div>

          <div className="flex items-center gap-3">
            {/* Credits badge */}
            <div className="flex items-center gap-2 rounded-full border border-white/10 bg-[#111218] px-3.5 py-1.5 text-xs font-bold">
              <Zap size={14} className="text-[#FF8F00] fill-[#FF8F00]" />
              <span className="text-zinc-400">Balance:</span>
              <span className="text-white font-black">{billingEntitlement ? userRemainingCredits : "..."} Credits</span>
              <Link
                href="/pricing"
                className="ml-1 text-[11px] text-[#FF9100] hover:text-[#FFA726] underline font-black"
              >
                +Add
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* ── Main Canvas ── */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Navigation & Mode Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-[#FF6D00]/30 bg-[#FF6D00]/10 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-[#FF9100] mb-2">
              <Sparkles size={13} className="text-[#FF9100]" />
              <span>Studio #8 • YouTube Subtitle Generator</span>
            </div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-white">
              YouTube Subtitle{" "}
              <span className="bg-gradient-to-r from-[#FF6D00] via-[#FF8F00] to-[#FFA726] bg-clip-text text-transparent">
                Generator
              </span>
            </h1>
            <p className="text-xs sm:text-sm text-zinc-400 mt-1 max-w-2xl">
              Burn responsive broadcast subtitles directly onto 16:9 videos or export millisecond-accurate .SRT / .VTT files for YouTube Studio.
            </p>
          </div>

          {/* Locked 16:9 & Scrubber Margin Indicator */}
          <div className="rounded-2xl border border-white/10 bg-[#111218] px-4 py-3 flex items-center gap-3.5 shrink-0 shadow-lg">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#FF6D00]/10 border border-[#FF6D00]/30 text-[#FF9100]">
              <Tv size={20} />
            </div>
            <div>
              <p className="text-xs font-black text-white">16:9 Widescreen Cinema</p>
              <p className="text-[10px] text-emerald-400 font-bold flex items-center gap-1 mt-0.5">
                <ShieldCheck size={12} />
                <span>14% YouTube Scrubber Safe-Zone</span>
              </p>
            </div>
          </div>
        </div>

        {/* ── In-Progress / Ready Render State ── */}
        {isWorking || isReady || isError ? (
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="relative overflow-hidden rounded-[28px] border border-white/10 bg-[#111218] p-6 sm:p-8 shadow-2xl">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-6 border-b border-white/10">
                <div className="flex items-center gap-3.5">
                  <div
                    className={`flex h-12 w-12 items-center justify-center rounded-2xl border ${
                      isReady
                        ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-400"
                        : isError
                        ? "border-red-500/30 bg-red-500/10 text-red-400"
                        : "border-[#FF6D00]/30 bg-[#FF6D00]/10 text-[#FF9100] animate-pulse"
                    }`}
                  >
                    {isReady ? (
                      <CheckCircle2 size={24} />
                    ) : isError ? (
                      <AlertCircle size={24} />
                    ) : (
                      <Loader2 size={24} className="animate-spin" />
                    )}
                  </div>
                  <div>
                    <h3 className="text-base font-black text-white">
                      {isReady ? "Subtitles Complete!" : isError ? "Processing Error" : "Processing 16:9 Subtitles..."}
                    </h3>
                    <p className="text-xs text-zinc-400 mt-0.5">
                      {isReady
                        ? "Your widescreen video has been subtitled with 1080p broadcast clarity."
                        : isError
                        ? "Something went wrong during generation."
                        : "AI is aligning vocal clips and generating subtitle placements."}
                    </p>
                  </div>
                </div>

                <div className="flex gap-2">
                  {isReady && (
                    <button
                      onClick={handleReset}
                      className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10 px-4 py-2.5 text-xs font-bold text-zinc-300 hover:text-white transition cursor-pointer"
                    >
                      <RefreshCw size={13} />
                      <span>Start New Video</span>
                    </button>
                  )}
                  {isError && (
                    <button
                      onClick={handleReset}
                      className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#FF6D00] via-[#FF8F00] to-[#FFA726] px-5 py-2.5 text-xs font-black text-black shadow-lg shadow-[#FF6D00]/25 hover:brightness-110 transition cursor-pointer"
                    >
                      <span>Try Again</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Progress Monitor Slider / Details */}
              <div className="space-y-6">
                <div>
                  <div className="flex items-center justify-between text-xs font-bold mb-2">
                    <span className="text-zinc-400">{jobStatus.message || "Working..."}</span>
                    <span className="text-[#FF9100]">{Math.round((jobStatus.progress || 0) * 100)}%</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-white/5 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-[#FF6D00] via-[#FF8F00] to-[#FFA726] transition-all duration-500 rounded-full"
                      style={{ width: `${(jobStatus.progress || 0) * 100}%` }}
                    />
                  </div>
                </div>

                {/* Vertical Stepper tracker */}
                <div className="grid gap-3.5 sm:gap-4 max-w-2xl">
                  {RENDER_STEPS.map((step, idx) => {
                    const currentProgress = jobStatus.progress || 0;
                    const isActive =
                      currentProgress >= step.threshold &&
                      currentProgress < (RENDER_STEPS[idx + 1]?.threshold || 1.1);
                    const isPassed = currentProgress >= (RENDER_STEPS[idx + 1]?.threshold || 1.0) || isReady;
                    const StepIcon = step?.icon || Sparkles;

                    return (
                      <div
                        key={step.label}
                        className={`flex items-start gap-4 p-3.5 rounded-2xl border transition-all ${
                          isActive
                            ? "border-[#FF6D00]/40 bg-[#FF6D00]/10 shadow-md"
                            : isPassed
                            ? "border-emerald-500/10 bg-emerald-500/[0.01]"
                            : "border-white/5 bg-transparent opacity-45"
                        }`}
                      >
                        <div
                          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border ${
                            isActive
                              ? "border-[#FF6D00]/30 bg-[#FF6D00]/15 text-[#FF9100] animate-pulse"
                              : isPassed
                              ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-400"
                              : "border-white/10 bg-white/5 text-zinc-500"
                          }`}
                        >
                          {isPassed ? <CheckCircle2 size={18} /> : <StepIcon size={18} />}
                        </div>
                        <div>
                          <p
                            className={`text-xs font-black ${
                              isActive ? "text-white" : isPassed ? "text-zinc-300" : "text-zinc-500"
                            }`}
                          >
                            {step.label}
                          </p>
                          <p className="text-[11px] text-zinc-400 mt-0.5 leading-relaxed">{step.detail}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Ready Preview */}
                {isReady && jobStatus.outputFile && (
                  <div className="border-t border-white/10 pt-6 mt-6 max-w-2xl mx-auto space-y-5">
                    <div className="aspect-video w-full rounded-2xl bg-black overflow-hidden border border-white/10 relative shadow-xl">
                      <video src={jobStatus.outputFile} controls className="h-full w-full object-contain" />
                    </div>
                    <div className="flex flex-col sm:flex-row items-center gap-3">
                      <button
                        onClick={() =>
                          downloadVideoDirectly(
                            jobStatus.outputFile || "",
                            `itnavideo-subtitled-${jobStatus.renderId}.mp4`
                          )
                        }
                        disabled={downloadingUrl === jobStatus.outputFile}
                        className="w-full inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#FF6D00] via-[#FF8F00] to-[#FFA726] px-6 py-4 text-sm font-black text-black shadow-xl shadow-[#FF6D00]/25 hover:brightness-110 active:scale-95 transition cursor-pointer disabled:opacity-50"
                      >
                        {downloadingUrl === jobStatus.outputFile ? (
                          <>
                            <div className="h-4 w-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                            <span>Downloading...</span>
                          </>
                        ) : (
                          <>
                            <Download size={16} className="text-black" />
                            <span>Download Subtitled Widescreen MP4 (1080p)</span>
                          </>
                        )}
                      </button>
                      <a
                        href={jobStatus.outputFile}
                        download={`itnavideo-subtitled-${jobStatus.renderId}.mp4`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full sm:w-auto inline-flex items-center justify-center rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10 px-5 py-4 text-xs font-bold text-zinc-300 hover:text-white transition"
                        title="Direct Link"
                      >
                        <Download size={16} className="text-[#FF8F00]" />
                      </a>
                    </div>
                  </div>
                )}

                {/* Diagnostics on failure */}
                {isError && jobStatus.diagnostics && jobStatus.diagnostics.length > 0 && (
                  <div className="rounded-2xl border border-red-500/20 bg-red-500/5 p-4 space-y-1">
                    <span className="block text-[11px] font-black uppercase text-red-400">
                      Technical Diagnostics:
                    </span>
                    <div className="max-h-32 overflow-y-auto font-mono text-[10px] text-zinc-500 leading-normal space-y-1">
                      {jobStatus.diagnostics.map((line, idx) => (
                        <p key={idx}>{line}</p>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          /* ── Two-Column Main Studio Grid ── */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Hidden File Input */}
            <input
              ref={fileInputRef}
              accept="video/*,audio/*"
              className="hidden"
              onChange={(event: ChangeEvent<HTMLInputElement>) => {
                setSelectedFile(event.target.files?.[0] || null);
                event.currentTarget.value = "";
              }}
              type="file"
            />

            {/* ── LEFT COLUMN (7 Cols): File Dropzone, Controls & Spacious Subtitle Gallery ── */}
            <div className="lg:col-span-7 space-y-6">
              {/* ── 1. 16:9 Video & Audio Upload Dropzone ── */}
              <div className="rounded-[28px] border border-white/10 bg-[#111218] p-5 shadow-2xl space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-white/10">
                  <div className="flex items-center gap-3">
                    <span className="flex h-7 w-7 items-center justify-center rounded-xl bg-[#FF6D00]/15 text-[#FF9100] text-xs font-black border border-[#FF6D00]/30">
                      1
                    </span>
                    <div>
                      <h3 className="text-sm font-black text-white flex items-center gap-2">
                        <Upload size={16} className="text-[#FF9100]" />
                        <span>Upload 16:9 Video or Audio</span>
                      </h3>
                      <p className="text-[11px] text-zinc-400 mt-0.5">
                        Select widescreen video or voiceover track (MP4, MOV, MP3, WAV — up to 12 mins).
                      </p>
                    </div>
                  </div>
                </div>

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
                  className="w-full flex items-center justify-between gap-3 rounded-2xl border-2 border-dashed border-white/15 hover:border-[#FF6D00]/60 bg-[#090A0F] p-4 transition-all cursor-pointer group"
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-[#FF6D00]/30 bg-[#FF6D00]/10 text-[#FF9100] group-hover:scale-105 transition-transform shrink-0">
                      <Upload size={20} />
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-xs sm:text-sm font-extrabold text-zinc-100 truncate">
                          {selectedFile ? selectedFile.name : "Drop your video or audio file here"}
                        </span>
                        {selectedFile && (
                          <span className="rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-bold px-2 py-0.5 shrink-0">
                            Loaded
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-zinc-400 truncate mt-0.5">
                        {selectedFile
                          ? `${(selectedFile.size / (1024 * 1024)).toFixed(1)} MB · 16:9 Widescreen Ready`
                          : "Drag & drop MP4, MOV, MP3, WAV (Up to 12 mins)"}
                      </p>
                    </div>
                  </div>

                  <span className="rounded-xl border border-[#FF6D00]/30 bg-gradient-to-r from-[#FF6D00] to-[#FF8F00] text-black font-black text-xs px-4 py-2 hover:brightness-110 shadow-md shadow-[#FF6D00]/20 transition shrink-0 flex items-center gap-1.5">
                    <Upload size={13} className="text-black" />
                    <span>{selectedFile ? "Change File" : "Browse Media"}</span>
                  </span>
                </div>

                {/* Duration & Waveform Pill */}
                {mediaDurationSeconds > 0 && (
                  <div className="rounded-2xl border border-[#FF6D00]/30 bg-[#FF6D00]/5 px-4 py-2.5 text-xs flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <Activity size={15} className="text-[#FF8F00]" />
                      <span className="text-zinc-200 font-bold">
                        Duration: <NumberTicker value={Math.round(mediaDurationSeconds)} />s (~<NumberTicker value={estimatedWordCount} /> words)
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      <AudioSpectrumVisualizer isPlaying={Boolean(selectedFile)} isTranscribing={isTranscribing} />
                      <span className="font-black text-[#FF8F00] uppercase text-[11px] bg-[#FF6D00]/10 px-2.5 py-1 rounded-full border border-[#FF6D00]/30">
                        1080p Cinema
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* ── 2. Language & Alignment Settings ── */}
              <div className="rounded-[28px] border border-white/10 bg-[#111218] p-5 shadow-xl space-y-4">
                <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-white">
                  <Globe size={15} className="text-[#FF9100]" />
                  <span>Language &amp; Safe Zone</span>
                </div>

                {/* Spoken & Subtitle Language Selectors */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-zinc-300 block">Spoken Language</label>
                    <select
                      value={spokenLanguage}
                      onChange={(e) => setSpokenLanguage(e.target.value)}
                      className="w-full bg-[#090A0F] text-white text-xs font-bold rounded-xl border border-white/10 px-3 py-2.5 focus:border-[#FF6D00] focus:outline-none cursor-pointer"
                    >
                      {AUDIO_SPOKEN_LANGUAGES.map((l) => (
                        <option key={l.id} value={l.id} className="bg-[#090A0F] text-white">
                          {l.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-zinc-300 block">Subtitle Script</label>
                    <select
                      value={captionLanguage}
                      onChange={(e) => setCaptionLanguage(e.target.value)}
                      className="w-full bg-[#090A0F] text-white text-xs font-bold rounded-xl border border-white/10 px-3 py-2.5 focus:border-[#FF6D00] focus:outline-none cursor-pointer"
                    >
                      {SUBTITLE_OUTPUT_LANGUAGES.map((l) => (
                        <option key={l.id} value={l.id} className="bg-[#090A0F] text-white">
                          {l.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Safe-Zone Margin & Casing Controls */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-zinc-300 block">Scrubber Safe-Zone</label>
                    <select
                      value={youtubeSubtitleSafeZone}
                      onChange={(e) => setYoutubeSubtitleSafeZone(e.target.value as any)}
                      className="w-full bg-[#090A0F] text-white text-xs font-bold rounded-xl border border-white/10 px-3 py-2.5 focus:border-[#FF6D00] focus:outline-none cursor-pointer"
                    >
                      <option value="scrubber">14% Clearance (Recommended)</option>
                      <option value="standard">10% Standard Clearance</option>
                      <option value="high">18% High Clearance</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-zinc-300 block">Text Casing</label>
                    <select
                      value={youtubeSubtitleCase}
                      onChange={(e) => setYoutubeSubtitleCase(e.target.value as any)}
                      className="w-full bg-[#090A0F] text-white text-xs font-bold rounded-xl border border-white/10 px-3 py-2.5 focus:border-[#FF6D00] focus:outline-none cursor-pointer"
                    >
                      <option value="natural">Natural Case (Recommended)</option>
                      <option value="uppercase">ALL UPPERCASE</option>
                    </select>
                  </div>
                </div>

                {/* Collapsible ⚙️ Typography & Style Drawer */}
                <div className="rounded-2xl border border-white/10 bg-[#161720] overflow-hidden">
                  <button
                    type="button"
                    onClick={() => setShowAdvanced(!showAdvanced)}
                    className="w-full flex items-center justify-between p-3.5 text-left hover:bg-white/5 transition cursor-pointer"
                  >
                    <div className="flex items-center gap-2">
                      <SlidersHorizontal size={14} className="text-[#FF8F00]" />
                      <span className="text-xs font-black uppercase tracking-wider text-zinc-200">
                        ⚙️ Typography &amp; Placement
                      </span>
                    </div>
                    <ChevronDown
                      size={15}
                      className={`text-zinc-400 transition-transform ${showAdvanced ? "rotate-180" : ""}`}
                    />
                  </button>

                  {showAdvanced && (
                    <div className="p-4 pt-0 space-y-3.5 border-t border-white/10">
                      {/* Font Family */}
                      <div className="space-y-1.5 pt-2">
                        <label className="text-[11px] font-bold text-zinc-300 block">Font Family</label>
                        <select
                          className="w-full rounded-xl border border-white/10 bg-[#090A0F] text-zinc-100 text-xs px-3 py-2 focus:border-[#FF6D00] focus:outline-none cursor-pointer font-bold"
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

                      {/* Font Size & Position */}
                      <div className="grid grid-cols-2 gap-2">
                        <div className="space-y-1">
                          <label className="text-[11px] font-bold text-zinc-300 block">Font Size</label>
                          <select
                            className="w-full rounded-xl border border-white/10 bg-[#090A0F] text-zinc-100 text-xs px-2.5 py-2 focus:border-[#FF6D00] focus:outline-none cursor-pointer font-bold"
                            value={captionFontSize}
                            onChange={(e) => setCaptionFontSize(e.target.value as any)}
                          >
                            <option value="small">Small</option>
                            <option value="medium">Medium</option>
                            <option value="large">Large</option>
                            <option value="xlarge">Extra Large</option>
                          </select>
                        </div>

                        <div className="space-y-1">
                          <label className="text-[11px] font-bold text-zinc-300 block">Position</label>
                          <select
                            className="w-full rounded-xl border border-white/10 bg-[#090A0F] text-zinc-100 text-xs px-2.5 py-2 focus:border-[#FF6D00] focus:outline-none cursor-pointer font-bold"
                            value={captionPosition}
                            onChange={(e) => setCaptionPosition(e.target.value as any)}
                          >
                            <option value="bottom">Bottom (14% Safe Zone)</option>
                            <option value="center">Center</option>
                            <option value="top">Top</option>
                          </select>
                        </div>
                      </div>

                      {/* Text & Highlight Color */}
                      <div className="grid grid-cols-2 gap-2">
                        <div className="space-y-1">
                          <label className="text-[11px] font-bold text-zinc-300 block">Text Color</label>
                          <div className="flex items-center gap-1.5 rounded-xl border border-white/10 bg-[#090A0F] p-1">
                            <input
                              type="color"
                              value={captionTextColor}
                              onChange={(e) => setCaptionTextColor(e.target.value)}
                              className="h-6 w-6 rounded border border-zinc-700 cursor-pointer p-0 bg-zinc-900 shrink-0"
                            />
                            <span className="font-mono text-[10px] font-bold text-zinc-300 uppercase truncate">
                              {captionTextColor}
                            </span>
                          </div>
                        </div>

                        <div className="space-y-1">
                          <label className="text-[11px] font-bold text-zinc-300 block">Highlight Color</label>
                          <div className="flex items-center gap-1.5 rounded-xl border border-white/10 bg-[#090A0F] p-1">
                            <input
                              type="color"
                              value={captionHighlightColor}
                              onChange={(e) => setCaptionHighlightColor(e.target.value)}
                              className="h-6 w-6 rounded border border-zinc-700 cursor-pointer p-0 bg-zinc-900 shrink-0"
                            />
                            <span className="font-mono text-[10px] font-bold text-zinc-300 uppercase truncate">
                              {captionHighlightColor}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* ── 3. Spacious 16:9 Broadcast Subtitle Gallery (3 Cards Per Row) ── */}
              <div className="rounded-[28px] border border-white/10 bg-[#111218] p-5 sm:p-6 shadow-xl space-y-5 relative overflow-hidden">
                <BorderBeam size={220} duration={14} colorFrom="#FF6D00" colorTo="#FFA726" />

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
                  <div className="flex items-center gap-3">
                    <h3 className="text-sm font-black text-white flex items-center gap-2">
                      <Film size={16} className="text-[#FF9100]" />
                      <span>16:9 Subtitle Style Gallery</span>
                    </h3>
                    <span className="text-[11px] font-bold text-[#FF9100] bg-[#FF6D00]/10 px-2.5 py-0.5 rounded-full border border-[#FF6D00]/30 font-mono">
                      {filteredPresets.length} Presets
                    </span>
                  </div>

                  {/* Search Input Box */}
                  <div className="relative min-w-[200px]">
                    <input
                      type="text"
                      placeholder="Search styles 🔍..."
                      value={presetSearch}
                      onChange={(e) => setPresetSearch(e.target.value)}
                      className="w-full bg-[#090A0F] text-xs text-white placeholder-zinc-500 rounded-xl border border-white/15 px-3 py-2 focus:border-[#FF6D00] focus:outline-none"
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
                            ? "bg-gradient-to-r from-[#FF6D00] to-[#FF8F00] text-black shadow-md shadow-[#FF6D00]/25"
                            : "bg-[#161720] text-zinc-400 border border-white/10 hover:text-white hover:border-white/20"
                        }`}
                      >
                        {cat.label}
                      </button>
                    );
                  })}
                </div>

                {/* Spacious Preset Cards Grid (3 Cards Per Row for Perfect Room & Breathing Space) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-1">
                  {filteredPresets.map((preset) => {
                    const active = captionStyle === preset.id;
                    return (
                      <button
                        key={preset.id}
                        type="button"
                        onClick={() => handleSelectPreset(preset)}
                        className={`rounded-2xl border p-3.5 text-left transition-all cursor-pointer relative overflow-hidden group active:scale-[0.98] ${
                          active
                            ? "border-[#FF6D00] bg-[#FF6D00]/10 text-white ring-2 ring-[#FF6D00] shadow-xl shadow-[#FF6D00]/25"
                            : "border-white/10 bg-[#161720] text-zinc-400 hover:text-white hover:border-white/20"
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1.5 gap-1">
                          <span className={`text-xs font-extrabold truncate ${active ? "text-[#FFA726]" : "text-white"}`}>
                            {preset.title}
                          </span>
                          <span className="text-[9px] rounded-full border border-white/10 bg-black/40 px-2 py-0.5 text-zinc-400 font-mono shrink-0">
                            {preset.badge}
                          </span>
                        </div>

                        <p className="text-[10px] text-zinc-400 mb-2.5 leading-tight line-clamp-2 min-h-[26px]">
                          {preset.desc}
                        </p>

                        {/* 16:9 Cloudinary Video Preview Box */}
                        <div className="relative w-full aspect-video rounded-xl border border-white/10 bg-[#090A0F] overflow-hidden flex items-end justify-center p-2 group-hover:border-[#FF6D00]/50 transition-colors shadow-inner">
                          <video
                            src={CLOUDINARY_16_9_PREVIEW_VIDEO}
                            poster={CLOUDINARY_16_9_PREVIEW_POSTER}
                            autoPlay
                            loop
                            muted
                            playsInline
                            className="absolute inset-0 h-full w-full object-cover opacity-75 group-hover:scale-105 transition-transform duration-300 pointer-events-none"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent pointer-events-none" />

                          <span
                            style={{
                              fontFamily: preset.fontFamily,
                              color: preset.textColor,
                              backgroundColor: preset.backgroundColor !== "rgba(0, 0, 0, 0.88)" ? preset.backgroundColor : undefined,
                            }}
                            className="relative z-10 text-[10px] font-extrabold text-center block truncate px-2 py-0.5 rounded shadow-xl backdrop-blur-[1px] border border-white/10 max-w-[95%]"
                          >
                            {preset.specimen}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* ── RIGHT COLUMN (5 Cols - Sticky Preview Stage): Live Video Preview Player & Dual Export Bar ── */}
            <div className="lg:col-span-5 lg:sticky lg:top-6 space-y-6">
              {/* 16:9 Broadcast Video Preview Stage */}
              <div className="rounded-[28px] border border-white/10 bg-[#111218] p-5 shadow-2xl space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-white/10">
                  <div className="flex items-center gap-2">
                    <span
                      className={`flex h-2.5 w-2.5 rounded-full ${
                        selectedFile ? "bg-emerald-500 animate-pulse" : "bg-[#FF6D00] animate-pulse"
                      }`}
                    />
                    <span className="text-xs font-black uppercase tracking-wider text-white truncate">
                      {selectedFile
                        ? selectedFile.name
                        : `16:9 Broadcast Preview • ${activePresetConfig.title}`}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    {selectedFile && (
                      <button
                        type="button"
                        onClick={() => setSelectedFile(null)}
                        className="inline-flex items-center gap-1 rounded-xl border border-red-900/40 bg-red-950/30 px-2.5 py-1 text-[11px] font-bold text-red-400 hover:bg-red-950/60 transition cursor-pointer"
                      >
                        <Trash2 size={11} />
                        <span>Remove</span>
                      </button>
                    )}
                    <span className="rounded-full bg-[#FF6D00]/10 border border-[#FF6D00]/30 px-2.5 py-0.5 text-[10px] font-black text-[#FF9100]">
                      16:9 Full HD
                    </span>
                  </div>
                </div>

                {/* 16:9 Cinema Widescreen Player Container */}
                <div className="relative w-full aspect-video rounded-2xl bg-[#090A0F] border border-white/10 overflow-hidden shadow-2xl flex items-center justify-center group">
                  {/* Real Cloudinary 16:9 Broadcast Video or User Uploaded Video */}
                  <video
                    ref={previewVideoRef}
                    src={activePreviewVideoSrc}
                    poster={CLOUDINARY_16_9_PREVIEW_POSTER}
                    autoPlay
                    playsInline
                    loop
                    muted={isMuted}
                    preload="auto"
                    onLoadedMetadata={(e) => {
                      const d = e.currentTarget.duration;
                      if (d && !isNaN(d) && isFinite(d) && d > 0) {
                        setPreviewDuration(d);
                      }
                    }}
                    onPlay={() => setIsPlaying(true)}
                    onPause={() => setIsPlaying(false)}
                    onClick={togglePlay}
                    className="h-full w-full object-cover cursor-pointer"
                  />

                  {/* Top Live Indicator Badge */}
                  <div className="absolute top-3 left-3 z-20 pointer-events-none">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-black/70 backdrop-blur-md border border-white/15 text-[#FFA726] text-[10px] font-extrabold uppercase px-3 py-1 tracking-wider shadow-md">
                      <Sparkles size={11} className="text-[#FF9100]" />
                      <span>{activePresetConfig.title}</span>
                    </span>
                  </div>

                  {/* Floating Mute/Unmute */}
                  <button
                    type="button"
                    onClick={toggleMute}
                    aria-label={isMuted ? "Unmute audio" : "Mute audio"}
                    className="absolute top-3 right-3 z-20 flex h-8 w-8 items-center justify-center rounded-full bg-black/75 text-white hover:bg-black transition shadow-md border border-white/15 cursor-pointer"
                  >
                    {isMuted ? <VolumeX size={14} /> : <Volume2 size={14} className="text-emerald-400" />}
                  </button>

                  {/* ── Real-Time 16:9 Burned-In Subtitle Overlay ── */}
                  <div
                    className={`pointer-events-none absolute inset-x-4 ${safeMarginBottomClass} flex justify-center text-center z-10`}
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
                      className="px-4 py-1.5 rounded-xl text-center text-sm sm:text-base font-extrabold tracking-wide shadow-2xl backdrop-blur-xs max-w-[85%] border border-white/10"
                    >
                      <span
                        style={{ color: captionHighlightColor }}
                        className={youtubeSubtitleCase === "uppercase" ? "uppercase" : ""}
                      >
                        {activePresetConfig.specimen}
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
                      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-r from-[#FF6D00] to-[#FF8F00] text-black shadow-2xl transition-transform group-hover:scale-110">
                        <Play size={24} className="fill-current ml-1 text-black" />
                      </div>
                    </button>
                  )}

                  {/* Bottom Video Progress Scrub Line */}
                  <div className="absolute inset-x-0 bottom-1 h-1 bg-white/20 z-20">
                    <div
                      className="h-full bg-gradient-to-r from-[#FF6D00] via-[#FF8F00] to-[#FFA726] transition-all duration-150"
                      style={{
                        width: previewDuration > 0 ? `${(playbackTime / previewDuration) * 100}%` : "0%",
                      }}
                    />
                  </div>
                </div>

                {/* Player Controls Bar */}
                <div className="flex items-center justify-between text-xs font-semibold text-zinc-400 pt-1">
                  <button
                    type="button"
                    onClick={togglePlay}
                    className="inline-flex items-center gap-1.5 text-zinc-200 hover:text-[#FF8F00] transition cursor-pointer font-bold"
                  >
                    {isPlaying ? <Pause size={14} className="text-[#FF8F00]" /> : <Play size={14} className="fill-current text-[#FF8F00]" />}
                    <span>{isPlaying ? "Pause Preview" : "Play Preview"}</span>
                  </button>

                  <span className="text-[11px] text-zinc-400 font-mono">
                    {Math.floor(playbackTime)}s / {Math.floor(previewDuration || 10)}s
                  </span>

                  <button
                    type="button"
                    onClick={toggleMute}
                    className="inline-flex items-center gap-1 text-zinc-200 hover:text-[#FF8F00] transition cursor-pointer"
                  >
                    {isMuted ? <VolumeX size={13} /> : <Volume2 size={13} className="text-emerald-400" />}
                    <span>{isMuted ? "Unmute Audio" : "Mute Audio"}</span>
                  </button>
                </div>
              </div>

              {/* ── Dual Export Bar ── */}
              <div className="rounded-[28px] border border-white/10 bg-[#111218] p-5 sm:p-6 shadow-xl space-y-4">
                <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-white">
                  <FileText size={15} className="text-[#FF9100]" />
                  <span>Dual Export Bar</span>
                </div>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Render a 1080p Full HD video with burnt-in motion subtitles, or export millisecond-accurate subtitle files (.SRT / .VTT) for YouTube Studio.
                </p>

                <div className="space-y-3 pt-2">
                  {/* Primary Action Button: Render 16:9 Subtitled Video */}
                  <button
                    type="button"
                    onClick={handleStartRender}
                    disabled={isWorking || isExportingSubtitles}
                    className="w-full inline-flex min-h-[52px] items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#FF6D00] via-[#FF8F00] to-[#FFA726] text-sm font-black text-black shadow-xl shadow-[#FF6D00]/25 transition hover:brightness-110 active:scale-95 disabled:opacity-45 disabled:cursor-not-allowed cursor-pointer"
                  >
                    <span>Render 16:9 Subtitled Video (1080p)</span>
                    <Sparkles size={16} className="text-black" />
                  </button>

                  {/* Secondary Action Buttons: Download Subtitles (.SRT / .VTT) */}
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => handleExportSubtitles("srt")}
                      disabled={isWorking || isExportingSubtitles}
                      className="inline-flex min-h-[44px] items-center justify-center gap-1.5 rounded-2xl border border-white/10 bg-[#161720] hover:bg-white/10 text-xs font-bold text-white transition disabled:opacity-45 disabled:cursor-not-allowed cursor-pointer active:scale-95"
                    >
                      {isExportingSubtitles ? (
                        <Loader2 size={13} className="animate-spin text-[#FF9100]" />
                      ) : (
                        <Download size={13} className="text-[#FF9100]" />
                      )}
                      <span>Download .SRT</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleExportSubtitles("vtt")}
                      disabled={isWorking || isExportingSubtitles}
                      className="inline-flex min-h-[44px] items-center justify-center gap-1.5 rounded-2xl border border-white/10 bg-[#161720] hover:bg-white/10 text-xs font-bold text-white transition disabled:opacity-45 disabled:cursor-not-allowed cursor-pointer active:scale-95"
                    >
                      {isExportingSubtitles ? (
                        <Loader2 size={13} className="animate-spin text-[#FF9100]" />
                      ) : (
                        <Download size={13} className="text-[#FF9100]" />
                      )}
                      <span>Download .VTT</span>
                    </button>
                  </div>

                  {!selectedFile && (
                    <p className="text-[10px] text-center text-zinc-500 font-bold">
                      *Clicking render or export will prompt file selection
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
