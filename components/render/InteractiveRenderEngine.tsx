'use client';

import React, { useState, useEffect } from 'react';
import {
  AlertCircle,
  RotateCcw,
  Download,
  Copy,
  Check,
  Sparkles,
  Film,
  Info,
  Clock,
  Volume2,
  VolumeX,
  Mic,
  ChevronDown,
  ChevronUp,
  X,
  Cpu,
  Layers,
  CheckCircle2,
  Share2,
  Play,
  Zap,
  ShieldCheck,
} from 'lucide-react';
import {
  requestNotificationPermission,
  sendRenderCompleteNotification,
  playRenderSuccessSound,
  triggerAutoDownload,
} from '@/lib/renderNotifications';
import { AudioSpectrumVisualizer } from '@/components/dashboard/AudioSpectrumVisualizer';
import { BorderBeam } from '@/components/ui/BorderBeam';

export type Mode = string;

export interface JobStatus {
  state: 'idle' | 'uploading' | 'starting' | 'rendering' | 'ready' | 'error';
  message?: string;
  progress?: number;
  outputFile?: string;
  jobId?: string;
  title?: string;
  error?: string;
  diagnostics?: string[];
  startedAt?: number;
  estimatedSeconds?: number;
  clips?: Array<{
    renderId: string;
    title: string;
    status: 'rendering' | 'done' | 'failed';
    outputUrl?: string;
    error?: string;
    startSeconds?: number;
    endSeconds?: number;
    durationSeconds?: number;
    outputFile?: string;
  }>;
}

interface InteractiveRenderEngineProps {
  mode: Mode;
  status: JobStatus;
  title: string;
  fileName?: string;
  onRetry: () => void;
  onReset: () => void;
  onCancel?: () => void;
}

interface StepDef {
  shortLabel: string;
  label: string;
  detail: string;
  doneAt: number;
  icon: React.ElementType;
}

// ── MODE-SPECIFIC PIPELINE DEFINITIONS (Rule 8: Video Type Independence) ──
function getModeSteps(mode: string): StepDef[] {
  switch (mode) {
    case 'audioClean':
    case 'AI_AUDIO_CLEANER':
      return [
        { shortLabel: 'Transcribe', label: 'Transcribing speech & script', detail: 'Groq Whisper neural speech engine', doneAt: 25, icon: Mic },
        { shortLabel: 'Retakes', label: 'Detecting retakes & mistakes', detail: 'Smart speech cadence analysis', doneAt: 50, icon: Sparkles },
        { shortLabel: 'Mastering', label: 'Filtering noise & EBU R128 loudness', detail: 'Studio acoustic normalization', doneAt: 75, icon: Layers },
        { shortLabel: 'Export', label: 'Exporting studio clean master', detail: 'Crisp 320kbps MP3 output', doneAt: 100, icon: Zap },
      ];
    case 'whiteboard':
    case 'whiteboardVideo':
    case 'WHITEBOARD_VIDEO':
      return [
        { shortLabel: 'Audio', label: 'Reading your audio', detail: 'Extracting narration speech & timing', doneAt: 20, icon: Mic },
        { shortLabel: 'Story', label: 'Planning the story', detail: 'Organizing key concepts & layout', doneAt: 40, icon: Sparkles },
        { shortLabel: 'Visuals', label: 'Creating the visuals', detail: 'Syncing vector icons & illustrations', doneAt: 60, icon: Layers },
        { shortLabel: 'Drawing', label: 'Drawing your whiteboard video', detail: 'Animating handwritten marker strokes', doneAt: 85, icon: Sparkles },
        { shortLabel: 'Render', label: 'Rendering your final video', detail: 'Exporting crisp 1080p Full HD video', doneAt: 100, icon: Film },
      ];
    case 'compare':
    case 'COMPARE_EXPLAINER':
      return [
        { shortLabel: 'Audio Sync', label: 'Aligning voiceover & comparison', detail: 'Groq Whisper speech alignment', doneAt: 25, icon: Mic },
        { shortLabel: 'Dual Split', label: 'Arranging comparison cards', detail: 'Side-by-side visual balance', doneAt: 50, icon: Layers },
        { shortLabel: 'Subtitles', label: 'Styling bottom motion captions', detail: 'Kinetic typography highlights', doneAt: 75, icon: Sparkles },
        { shortLabel: 'Render', label: 'Rendering 1080p comparison reel', detail: 'AWS Lambda Remotion engine', doneAt: 100, icon: Film },
      ];
    case 'typography':
    case 'typographyVideo':
    case 'TYPOGRAPHY_VIDEO':
      return [
        { shortLabel: 'Audio Wave', label: 'Analyzing vocal rhythm & beats', detail: 'Speech cadence extraction', doneAt: 20, icon: Mic },
        { shortLabel: 'Kinetics', label: 'Arranging kinetic typography', detail: 'Dynamic word placement & zooms', doneAt: 45, icon: Sparkles },
        { shortLabel: 'Springs', label: 'Applying camera shakes & pop physics', detail: 'High-retention visual springs', doneAt: 75, icon: Layers },
        { shortLabel: 'Render', label: 'Rendering 1080p kinetic MP4', detail: 'AWS Lambda Remotion engine', doneAt: 100, icon: Film },
      ];
    case 'longVideoClips':
    case 'LONG_VIDEO_CLIPS':
      return [
        { shortLabel: 'Ingest', label: 'Chunking long video audio stream', detail: 'Parallel speech processing', doneAt: 20, icon: Mic },
        { shortLabel: 'AI Hook', label: 'Detecting viral hooks & highlights', detail: 'Audience retention scoring', doneAt: 45, icon: Sparkles },
        { shortLabel: 'Reframe', label: 'Auto-cropping to 9:16 + captions', detail: 'Center-stage subject framing', doneAt: 75, icon: Layers },
        { shortLabel: 'Export', label: 'Rendering viral 1080p shorts', detail: 'AWS Lambda batch cloud rendering', doneAt: 100, icon: Film },
      ];
    case 'imageToVideoAi':
    case 'IMAGE_TO_VIDEO_AI':
      return [
        { shortLabel: 'Audio Beat', label: 'Syncing voiceover with image scenes', detail: 'Pacing & duration alignment', doneAt: 20, icon: Mic },
        { shortLabel: 'Parallax', label: 'Generating Ken Burns 2.5D depth', detail: 'Smooth camera pans & zooms', doneAt: 50, icon: Sparkles },
        { shortLabel: 'Transitions', label: 'Applying cinematic FX & overlays', detail: 'Film grains & caption strips', doneAt: 75, icon: Layers },
        { shortLabel: 'Render', label: 'Rendering 1080p widescreen MP4', detail: 'AWS Lambda Remotion engine', doneAt: 100, icon: Film },
      ];
    case 'bookSummary':
    case 'BOOK_SUMMARY':
      return [
        { shortLabel: 'Transcribe', label: 'Transcribing spoken book summary', detail: 'Groq Whisper speech alignment', doneAt: 20, icon: Mic },
        { shortLabel: 'AI Scenes', label: 'Structuring key ideas & lesson cards', detail: 'Scene timing & quote validation', doneAt: 45, icon: Sparkles },
        { shortLabel: 'Typography', label: 'Styling lesson titles & typography', detail: 'Google Analytics Dark slate layout', doneAt: 70, icon: Layers },
        { shortLabel: 'Render', label: 'Rendering 1080p Book Summary video', detail: 'AWS Lambda Remotion engine', doneAt: 100, icon: Film },
      ];
    case 'youtubeSubtitles':
    case 'YOUTUBE_SUBTITLES':
      return [
        { shortLabel: 'Widescreen', label: 'Preparing 16:9 widescreen canvas', detail: 'Safe-zone auto alignment', doneAt: 20, icon: Film },
        { shortLabel: 'Groq Speech', label: 'Transcribing speech timestamps', detail: 'Ultra-accurate Groq Whisper engine', doneAt: 45, icon: Mic },
        { shortLabel: 'Subtitles', label: 'Applying Western typography presets', detail: 'Lower-third high contrast text', doneAt: 75, icon: Sparkles },
        { shortLabel: 'Render', label: 'Rendering 1920×1080 Full HD MP4', detail: 'AWS Lambda Remotion engine', doneAt: 100, icon: Film },
      ];
    case 'longVideoPromo':
    case 'LONG_VIDEO_PROMO':
      return [
        { shortLabel: 'Media Ingest', label: 'Ingesting teaser clip & thumbnail', detail: 'High-res asset staging', doneAt: 25, icon: Layers },
        { shortLabel: '9:16 Layout', label: 'Building teaser split composition', detail: 'Thumbnail topper & video player', doneAt: 50, icon: Sparkles },
        { shortLabel: 'Callout FX', label: 'Adding social hook callouts', detail: 'Dynamic watch prompts & arrows', doneAt: 75, icon: Zap },
        { shortLabel: 'Render', label: 'Rendering 1080p promo reel', detail: 'AWS Lambda Remotion engine', doneAt: 100, icon: Film },
      ];
    case 'facelessVideo':
    case 'FACELESS_VIDEO':
      return [
        { shortLabel: 'Script AI', label: 'Analyzing narrative & scene beats', detail: 'Gemini visual director engine', doneAt: 20, icon: Sparkles },
        { shortLabel: 'B-Roll Fit', label: 'Matching cinematic footage & SFX', detail: 'Contextual visual indexing', doneAt: 45, icon: Layers },
        { shortLabel: 'Captions', label: 'Applying kinetic typography overlays', detail: 'Bold animated subtitles', doneAt: 75, icon: Mic },
        { shortLabel: 'Render', label: 'Rendering 1080p faceless video', detail: 'AWS Lambda Remotion engine', doneAt: 100, icon: Film },
      ];
    case 'autoCaption':
    case 'AUTO_CAPTION_GENERATOR':
    default:
      return [
        { shortLabel: 'Project Prep', label: 'Parsing audio stream & safe zones', detail: 'Verifying 1080p resolution fit', doneAt: 15, icon: Film },
        { shortLabel: 'Groq Whisper', label: 'Transcribing speech timestamps', detail: 'Millisecond-precision speech engine', doneAt: 40, icon: Mic },
        { shortLabel: 'Style Captions', label: 'Applying karaoke bounce & highlights', detail: 'Active word pop & glowing shaders', doneAt: 75, icon: Sparkles },
        { shortLabel: 'Cloud Render', label: 'Rendering 1080p Full HD MP4', detail: 'AWS Lambda 30 FPS Remotion node', doneAt: 100, icon: Zap },
      ];
  }
}

const ENGINE_CREATOR_TIPS = [
  { kicker: "VIRAL RETENTION SECRET", tip: "Cutting to new B-roll every 3–4 seconds keeps viewer retention 2.4× higher than static scenes." },
  { kicker: "FIRST 3 SECONDS HOOK", tip: "80% of short-form viewers decide to keep watching in the first 3 seconds — make your opening scene punchy." },
  { kicker: "AUDIO DUCKING FORMULA", tip: "Ducking background music by -14dB while speech is active gives your voiceover crisp documentary authority." },
  { kicker: "CINEMATIC KEN BURNS MOTION", tip: "Subtle zoom drift (1.0× to 1.15×) glues audience eyes to the frame without causing visual motion fatigue." },
  { kicker: "HIGH-CONTRAST SUBTITLES", tip: "Bright yellow and orange kinetic word highlights improve mobile comprehension by 38% in silent autoplay feeds." },
  { kicker: "CLOUD SPEED ENGINE", tip: "AWS Lambda Remotion instances compose 1080p frames simultaneously across 200+ cloud cores." },
  { kicker: "BROADCAST AUDIO STANDARD", tip: "Normalizing voiceover audio to -14 LUFS (EBU R128 standard) ensures pristine vocal presence across smartphone speakers." },
];

export default function InteractiveRenderEngine({
  mode,
  status,
  title,
  fileName,
  onRetry,
  onReset,
  onCancel,
}: InteractiveRenderEngineProps) {
  const [copiedTitle, setCopiedTitle] = useState(false);
  const [copiedDesc, setCopiedDesc] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [showSpecs, setShowSpecs] = useState(false);
  const [showSocialCopy, setShowSocialCopy] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [currentTipIdx, setCurrentTipIdx] = useState(0);


  const downloadDirectly = async (url: string, filename: string) => {
    try {
      setIsDownloading(true);
      const res = await fetch(url);
      const blob = await res.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = blobUrl;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(blobUrl);
    } catch {
      window.open(url, '_blank');
    } finally {
      setIsDownloading(false);
    }
  };

  const isFailed = status.state === 'error';
  const isReady = status.state === 'ready' || Boolean(status.outputFile);

  // Raw progress calculation (handles fractional progress 0.0-1.0 and whole numbers 0-100)
  const rawProgress = isReady
    ? 100
    : typeof status.progress === 'number'
    ? (status.progress > 0 && status.progress <= 1 ? status.progress * 100 : status.progress)
    : (
      status.state === 'uploading' ? 15 :
      status.state === 'starting' ? 35 :
      status.state === 'rendering' ? 70 : 0
    );
  const percentage = Math.min(100, Math.max(0, Math.round(rawProgress)));

  const steps = getModeSteps(mode);

  // Current active step
  const activeStepIndex = isReady
    ? steps.length - 1
    : Math.min(
        steps.length - 1,
        steps.findIndex((s) => percentage < s.doneAt) !== -1
          ? steps.findIndex((s) => percentage < s.doneAt)
          : 0
      );

  // Dynamic project display title
  const displayTitle = title && title.length > 3 && title.toLowerCase() !== 'ai'
    ? title
    : fileName && fileName.length > 3
    ? fileName
    : 'Viral Reel Project';

  // Auto-generated viral description & hashtags for social posting
  const autoGeneratedDesc = `${displayTitle} 🚀 ${mode === 'audioClean' ? 'Mastered with ItnaVideo AI Studio (EBU R128 Broadcast Loudness, noise filtered).' : 'Created automatically with ItnaVideo AI Studio (1080p Full HD).'}\n\n#video #creator #reels #shorts #itnavideo`;

  // Active ticking timer for live elapsed seconds
  const [liveElapsed, setLiveElapsed] = useState(0);

  useEffect(() => {
    if (isReady || isFailed) return;
    const interval = setInterval(() => {
      if (status.startedAt) {
        setLiveElapsed(Math.max(0, Math.round((Date.now() - status.startedAt) / 1000)));
      } else {
        setLiveElapsed((prev) => prev + 1);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [status.startedAt, isReady, isFailed]);

  const formatTimer = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const s = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  useEffect(() => {
    if (isReady || isFailed) return;
    const tipInterval = setInterval(() => {
      setCurrentTipIdx((prev) => (prev + 1) % ENGINE_CREATOR_TIPS.length);
    }, 6500);
    return () => clearInterval(tipInterval);
  }, [isReady, isFailed]);

  // Estimate remaining time accurately using elapsed and estimated duration
  const isLongMode = mode === 'imageToVideoAi' || mode === 'youtubeSubtitles' || mode === 'facelessVideo' || mode === 'longVideoClips';
  const defaultEstimate = isLongMode ? 300 : 90;
  const totalEstimated = status.estimatedSeconds || defaultEstimate;
  const calculatedRemaining = Math.max(5, Math.round(totalEstimated - liveElapsed));
  const fallbackRemaining = Math.max(5, Math.round(((100 - percentage) / 100) * defaultEstimate));
  const secondsRemaining = isReady ? 0 : (status.startedAt ? calculatedRemaining : fallbackRemaining);
  const formatTimeRemaining = (secs: number) => {
    if (secs <= 5) return 'Finalizing 1080p MP4...';
    const mins = Math.floor(secs / 60);
    const s = secs % 60;
    return mins > 0 ? `~${mins}m ${s > 0 ? `${s}s` : ''}` : `~${s}s`;
  };

  const handleCopyTitle = () => {
    navigator.clipboard.writeText(displayTitle);
    setCopiedTitle(true);
    setTimeout(() => setCopiedTitle(false), 2000);
  };

  const [youtubeMetadata, setYoutubeMetadata] = useState<{
    viralTitles: string[];
    description: string;
    tags: string[];
  } | null>(null);
  const [isLoadingMetadata, setIsLoadingMetadata] = useState(false);
  const [copiedTitleIdx, setCopiedTitleIdx] = useState<number | null>(null);
  const [copiedTags, setCopiedTags] = useState(false);

  const fetchYouTubeMetadata = async () => {
    if (youtubeMetadata || isLoadingMetadata) return;
    setIsLoadingMetadata(true);
    try {
      const res = await fetch('/api/reels/generate-metadata', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topicTitle: displayTitle,
          durationSeconds: status.estimatedSeconds || 60,
          mode,
        }),
      });
      const data = await res.json();
      if (data?.ok && data?.metadata) {
        setYoutubeMetadata(data.metadata);
      }
    } catch (e) {
      console.warn('Failed to fetch YouTube metadata kit', e);
    } finally {
      setIsLoadingMetadata(false);
    }
  };

  const handleCopySpecificTitle = (titleText: string, idx: number) => {
    navigator.clipboard.writeText(titleText);
    setCopiedTitleIdx(idx);
    setTimeout(() => setCopiedTitleIdx(null), 2000);
  };

  const handleCopyTags = () => {
    if (!youtubeMetadata?.tags) return;
    navigator.clipboard.writeText(youtubeMetadata.tags.join(', '));
    setCopiedTags(true);
    setTimeout(() => setCopiedTags(false), 2000);
  };

  const hasNotifiedRef = React.useRef<string | null>(null);

  // 1. Request Web Notification permission when render starts
  useEffect(() => {
    if (status.state === 'starting' || status.state === 'rendering') {
      requestNotificationPermission().catch(() => {});
    }
  }, [status.state]);

  // 2. Trigger System Tray Notification, Audio Chime, and Auto-Download when render finishes
  useEffect(() => {
    const renderKey = status.jobId || status.outputFile || (isReady ? 'ready-render' : null);
    if (isReady && renderKey && hasNotifiedRef.current !== renderKey) {
      hasNotifiedRef.current = renderKey;

      if (soundEnabled) {
        playRenderSuccessSound();
      }

      sendRenderCompleteNotification({
        title: 'Download Complete! 🎉',
        body: `Aapki 1080p Full HD video (${displayTitle}) render ho chuki hai. Click to view & download.`,
        outputUrl: status.outputFile,
        onNotificationClick: () => {
          if (status.outputFile) {
            window.open(status.outputFile, '_blank');
          }
        },
      });

      if (status.outputFile) {
        const downloadName = `${displayTitle.toLowerCase().replace(/[^a-z0-9]/g, '-')}-1080p.mp4`;
        triggerAutoDownload(status.outputFile, downloadName).catch(() => {});
      }

      // Auto fetch YouTube Viral Metadata Kit
      fetchYouTubeMetadata().catch(() => {});
    }
  }, [isReady, status.jobId, status.outputFile, displayTitle, soundEnabled]);

  const CurrentStepIcon = steps[activeStepIndex]?.icon || Sparkles;

  return (
    <div className="relative w-full max-w-3xl mx-auto rounded-[28px] border border-white/10 bg-[#0E1526] p-6 sm:p-8 text-white shadow-2xl space-y-6 font-sans select-none backdrop-blur-xl overflow-hidden">
      
      {/* ── AMBIENT BORDER BEAM (Active Glow During Render) ── */}
      {!isFailed && !isReady && (
        <BorderBeam
          size={240}
          duration={8}
          colorFrom="#FF5722"
          colorTo="#FFA000"
          borderWidth={2}
        />
      )}

      {/* ── M3 TOP APP BAR ── */}
      <div className="flex items-center justify-between border-b border-white/10 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-[#FF5722] via-[#FF7043] to-[#FFA000] flex items-center justify-center font-black text-black text-xs shadow-lg shadow-[#FF5722]/25">
            {mode === 'audioClean' ? <Mic size={16} /> : <Film size={16} />}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-sm text-white tracking-tight">ItnaVideo Engine</span>
              <span className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${
                isReady
                  ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30'
                  : isFailed
                  ? 'text-red-400 bg-red-500/10 border-red-500/30'
                  : 'text-[#FF7043] bg-[#FF5722]/10 border-[#FF5722]/30'
              }`}>
                {isReady ? '1080p Ready ✓' : isFailed ? 'Failed' : 'Rendering · 1080p 30 FPS'}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="p-2 rounded-xl bg-[#141722] border border-white/10 hover:border-[#FF5722]/40 text-slate-400 hover:text-white transition-all cursor-pointer"
            title={soundEnabled ? 'Mute completion chime' : 'Enable completion chime'}
          >
            {soundEnabled ? <Volume2 size={15} /> : <VolumeX size={15} />}
          </button>
          <button
            onClick={onReset}
            className="p-2 rounded-xl bg-[#141722] hover:bg-[#1B202E] border border-white/10 text-slate-400 hover:text-white transition-all cursor-pointer"
            title="Close workbench"
          >
            <X size={15} />
          </button>
        </div>
      </div>

      {/* ── UNIFIED SHOWCASE CONTAINER ── */}
      <div className="relative w-full rounded-2xl bg-[#12151F]/90 border border-white/10 overflow-hidden shadow-inner">
        {isReady && status.outputFile ? (
          mode === 'audioClean' ? (
            <div className="w-full flex flex-col items-center justify-center p-8 space-y-4 bg-gradient-to-b from-[#181B26] to-[#0E1017] rounded-2xl border border-white/10 shadow-inner">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#FF5722]/20 to-[#FFA000]/20 border border-[#FF5722]/40 text-[#FFA000] flex items-center justify-center shadow-lg shadow-orange-500/20">
                <Mic size={30} />
              </div>
              <div className="text-center space-y-1">
                <p className="font-black text-base text-white">Audio Cleaned &amp; Mastered</p>
                <p className="text-xs text-slate-400">Silences trimmed • EBU R128 loudness normalized • 320kbps MP3</p>
              </div>
              <audio src={status.outputFile} controls autoPlay className="w-full max-w-md mt-2" />
            </div>
          ) : (
            <div className="p-4 sm:p-6 bg-gradient-to-b from-[#141722] to-[#0B0D13]">
              <div className={`relative w-full ${
                !['youtubeSubtitles', 'YOUTUBE_SUBTITLES', 'imageToVideoAi', 'IMAGE_TO_VIDEO_AI', 'facelessVideo', 'FACELESS_VIDEO', 'bookSummary', 'BOOK_SUMMARY'].includes(mode)
                  ? 'aspect-[9/16] max-h-[460px] max-w-[270px] mx-auto rounded-2xl border-2 border-white/15'
                  : 'aspect-video max-h-[360px] rounded-2xl border border-white/10'
              } bg-black overflow-hidden shadow-2xl flex items-center justify-center`}>
                <video
                  src={status.outputFile}
                  controls
                  autoPlay
                  playsInline
                  className="w-full h-full object-contain"
                />
              </div>
            </div>
          )
        ) : isFailed ? (
          <div className="p-6 sm:p-8 text-center space-y-4 bg-red-950/20 border border-red-500/30 rounded-2xl">
            <div className="w-14 h-14 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-400 mx-auto flex items-center justify-center shadow-lg shadow-red-500/10">
              <AlertCircle size={28} />
            </div>
            <div className="space-y-1.5 max-w-md mx-auto">
              <h3 className="text-lg font-black text-white">Rendering Connection Interrupted</h3>
              <p className="text-xs text-red-200 leading-relaxed font-medium">
                {status.error || status.message || 'Error occurred during cloud generation. Your upload is safe.'}
              </p>
            </div>

            {status.diagnostics && status.diagnostics.length > 0 ? (
              <details className="mt-2 text-left bg-[#0B0D13] rounded-xl p-3 border border-white/10 text-[10px] text-slate-400 max-w-md mx-auto">
                <summary className="cursor-pointer font-mono font-bold text-slate-300 select-none">Technical Details</summary>
                <div className="mt-1.5 space-y-1 font-mono break-all max-h-32 overflow-y-auto">
                  {status.diagnostics.map((d, i) => (
                    <div key={i}>{d}</div>
                  ))}
                </div>
              </details>
            ) : null}

            {/* Reassuring Zero-Credit Deducted Safety Badge */}
            <div className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-black/40 px-4 py-2 text-xs text-zinc-300">
              <Zap size={14} className="text-[#FFA000]" />
              <span>Zero credits deducted for interrupted or failed render attempts.</span>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={onRetry}
                className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-[#FF5722] via-[#FF7043] to-[#FFA000] hover:brightness-110 text-black rounded-xl font-black text-xs transition-all inline-flex items-center justify-center gap-2 shadow-lg shadow-orange-500/25 cursor-pointer active:scale-95"
              >
                <RotateCcw size={14} />
                <span>Retry Generation Now</span>
              </button>

              <button
                type="button"
                onClick={onReset}
                className="w-full sm:w-auto px-5 py-3 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-white font-bold text-xs transition-all inline-flex items-center justify-center gap-2 cursor-pointer active:scale-95"
              >
                <span>Edit Media &amp; Setup</span>
              </button>
            </div>
          </div>
        ) : (
          /* ── UNIFIED CINEMATIC APERTURE RING & LIVE METRICS SHOWCASE ── */
          <div className="relative rounded-2xl border border-white/[0.08] bg-[#12151F]/90 p-6 sm:p-8 space-y-6 text-center shadow-inner overflow-hidden">
            
            {/* Central Animated Aperture & Progress Ring */}
            <div className="relative mx-auto flex h-28 w-28 sm:h-32 sm:w-32 items-center justify-center">
              {/* Outer Breathing Ring */}
              <div className="absolute inset-0 rounded-full border-2 border-[#FF5722]/20 animate-ping opacity-25" />

              {/* Glowing Conic Border Halo */}
              <div
                className="absolute inset-1 rounded-full p-[2px] animate-spin"
                style={{
                  animationDuration: '6s',
                  background: 'conic-gradient(from 0deg, #FF5722, #FFA000, transparent 60%)',
                }}
              >
                <div className="h-full w-full rounded-full bg-[#12151F]" />
              </div>

              {/* Inner Dark Core */}
              <div className="relative flex h-24 w-24 sm:h-28 sm:w-28 flex-col items-center justify-center rounded-full bg-gradient-to-b from-[#181B26] to-[#0E1017] border border-white/10 shadow-2xl">
                <span className="font-mono text-2xl sm:text-3xl font-black text-white tracking-tight">
                  {percentage}%
                </span>
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#FFA000]">
                  {percentage >= 90 ? 'Finishing' : percentage >= 40 ? 'Composing' : 'Ingesting'}
                </span>
              </div>
            </div>

            {/* Current Message & Status Headline */}
            <div className="space-y-1.5 max-w-lg mx-auto">
              <h3 className="text-base sm:text-lg font-black text-white tracking-normal truncate">
                {displayTitle}
              </h3>
              <p className="text-xs sm:text-sm text-[#FF9100] font-bold">
                {status.message || steps[activeStepIndex]?.label || 'Rendering your video in cloud...'}
              </p>
              <p className="text-xs text-zinc-300 font-medium leading-relaxed">
                {steps[activeStepIndex]?.detail || 'AWS Lambda 1080p 30 FPS Remotion cluster node'}
              </p>
            </div>

            {/* Dynamic Audio Spectrum Waveform Visualizer */}
            <div className="flex items-center justify-center pt-1">
              <AudioSpectrumVisualizer isPlaying={true} isTranscribing={percentage < 50} barCount={18} />
            </div>

            {/* Dual Timing Pill & Fail-Safe Cloud Badge */}
            <div className="flex flex-wrap items-center justify-center gap-2.5 pt-1">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/40 px-3.5 py-1.5 text-[11px] font-bold text-zinc-300 shadow-sm">
                <Clock size={12} className="text-[#FF7043] animate-pulse" />
                <span>
                  Elapsed: <span className="font-mono text-white">{formatTimer(liveElapsed)}</span>
                </span>
                <span className="text-zinc-600">•</span>
                <span>
                  Est. Remaining:{' '}
                  <span className="text-[#FFA000] font-extrabold">
                    {formatTimeRemaining(secondsRemaining)}
                  </span>
                </span>
              </div>

              <div className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1.5 text-[11px] font-bold text-emerald-400">
                <ShieldCheck size={13} />
                <span>Fail-Safe Cloud Render</span>
              </div>

              {onCancel && !isReady && (
                <button
                  type="button"
                  onClick={onCancel}
                  className="px-3.5 py-1.5 rounded-full bg-red-950/80 hover:bg-red-900 border border-red-500/40 text-red-300 hover:text-white text-[11px] font-bold transition-all inline-flex items-center gap-1.5 shadow-md active:scale-95 cursor-pointer"
                  title="Cancel active generation and release resources"
                >
                  <X size={13} className="text-red-400" />
                  <span>Cancel Rendering</span>
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* ── UNIFIED LINEAR GLOWING PROGRESS TRACK ── */}
      {!isFailed && (
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-bold px-1">
            <span className="text-slate-300 flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-[#FF5722] animate-pulse" />
              <span>{isReady ? 'Render Finished ✓' : `Stage ${activeStepIndex + 1} of ${steps.length}: ${steps[activeStepIndex]?.label}`}</span>
            </span>
            <span className="font-mono text-sm font-black text-[#FFA000]">
              {percentage}%
            </span>
          </div>

          <div className="relative h-2.5 w-full overflow-hidden rounded-full bg-black/60 border border-white/10 p-0.5 shadow-inner">
            <div
              className="h-full bg-gradient-to-r from-[#FF5722] via-[#FF7043] to-[#FFA000] rounded-full transition-all duration-300 shadow-[0_0_14px_rgba(255,109,0,0.6)]"
              style={{ width: `${Math.max(4, percentage)}%` }}
            />
          </div>
        </div>
      )}

      {/* ── UNIFIED HORIZONTAL PIPELINE STEPPER CARDS ── */}
      {!isFailed && (
        <div className={`grid grid-cols-2 sm:grid-cols-4 ${steps.length === 5 ? 'lg:grid-cols-5' : ''} gap-2.5 pt-1`}>
          {steps.map((step, idx) => {
            const isCompleted = percentage >= step.doneAt || isReady;
            const isCurrent = !isCompleted && idx === activeStepIndex;
            const StepIcon = step.icon || Sparkles;

            return (
              <div
                key={idx}
                className={`flex flex-col items-center justify-center p-3 rounded-2xl border text-center transition-all ${
                  isCompleted
                    ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300 shadow-sm'
                    : isCurrent
                    ? 'bg-gradient-to-b from-orange-500/15 to-amber-500/10 border-[#FF5722] ring-2 ring-orange-500/30 text-[#FFA000] shadow-lg shadow-orange-500/15'
                    : 'bg-[#12151F]/60 border-white/5 text-slate-500'
                }`}
              >
                <div className="flex items-center gap-1.5 mb-1.5">
                  <span
                    className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black shadow-sm ${
                      isCompleted
                        ? 'bg-emerald-400 text-black'
                        : isCurrent
                        ? 'bg-gradient-to-r from-[#FF5722] to-[#FFA000] text-black animate-pulse'
                        : 'bg-[#141722] text-slate-400 border border-white/10'
                    }`}
                  >
                    {isCompleted ? <Check size={12} strokeWidth={3} /> : idx + 1}
                  </span>
                  <StepIcon size={13} className={isCompleted ? 'text-emerald-400' : isCurrent ? 'text-[#FFA000]' : 'text-slate-500'} />
                </div>
                <span className="text-[11px] font-black leading-tight truncate w-full">
                  {step.shortLabel}
                </span>
                <span className="text-[9px] text-slate-400 truncate w-full mt-0.5">
                  {isCompleted ? 'Done ✓' : isCurrent ? 'Rendering...' : 'Waiting'}
                </span>
              </div>
            );
          })}
        </div>
      )}

      {/* ── ROTATING CREATOR RETENTION SECRETS & TIPS (ANTI-BOREDOM CAROUSEL) ── */}
      {!isFailed && !isReady && (
        <div className="rounded-2xl border border-orange-500/20 bg-gradient-to-r from-orange-500/[0.08] via-amber-500/[0.04] to-transparent p-4 space-y-1.5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider text-[#FFA000]">
              <Sparkles size={12} className="text-[#FF5722]" />
              <span>{ENGINE_CREATOR_TIPS[currentTipIdx]?.kicker}</span>
            </span>
            <span className="text-[10px] font-mono font-bold text-zinc-500">
              Insight {currentTipIdx + 1}/{ENGINE_CREATOR_TIPS.length}
            </span>
          </div>
          <p className="text-xs text-zinc-200 font-medium leading-relaxed">
            "{ENGINE_CREATOR_TIPS[currentTipIdx]?.tip}"
          </p>
        </div>
      )}

      {/* ── MULTI-CLIPS GRID (WHEN MODE HAS CLIPS E.G. LONG VIDEO CLIPS) ── */}
      {status.clips && status.clips.length > 0 && (
        <div className="rounded-2xl border border-white/10 bg-[#141722]/80 p-4 space-y-3">
          <div className="flex items-center justify-between text-xs font-bold text-zinc-300">
            <span className="flex items-center gap-1.5">
              <Film size={14} className="text-[#FF7043]" />
              <span>Extracted Shorts Clips ({status.clips.length})</span>
            </span>
            <span className="text-emerald-400 font-semibold">
              {status.clips.filter((c) => c.status === 'done').length} / {status.clips.length} Ready
            </span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-56 overflow-y-auto pr-1">
            {status.clips.map((clip, idx) => (
              <div
                key={clip.renderId || idx}
                className="rounded-xl border border-white/5 bg-black/40 p-3 flex items-center justify-between gap-3 text-xs"
              >
                <div className="min-w-0">
                  <p className="font-bold text-white truncate">{clip.title || `Clip ${idx + 1}`}</p>
                  <p className="text-[10px] text-zinc-400 mt-0.5">
                    {clip.durationSeconds ? `${Math.round(clip.durationSeconds)}s` : 'Shorts Segment'}
                  </p>
                </div>
                {clip.outputFile || clip.outputUrl ? (
                  <button
                    type="button"
                    onClick={() => downloadDirectly(clip.outputFile || clip.outputUrl!, `clip-${idx + 1}.mp4`)}
                    className="px-2.5 py-1 rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 hover:bg-emerald-500/25 text-[10px] font-bold inline-flex items-center gap-1 transition"
                  >
                    <Download size={11} />
                    <span>Download</span>
                  </button>
                ) : (
                  <span className="px-2 py-0.5 rounded-full text-[9px] font-bold uppercase bg-amber-500/10 text-amber-300 border border-amber-500/30">
                    {clip.status || 'rendering'}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── M3 ACTIONS AREA (WHEN READY) ── */}
      {isReady && status.outputFile ? (
        <div className="space-y-3 pt-2 animate-in fade-in duration-300">
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              type="button"
              onClick={() => downloadDirectly(status.outputFile!, mode === 'audioClean' ? 'itnavideo-clean-studio-audio.mp3' : `itnavideo-${mode || 'reel'}-1080p.mp4`)}
              disabled={isDownloading}
              className="flex-1 py-4 rounded-2xl bg-gradient-to-r from-[#FF5722] via-[#FF7043] to-[#FFA000] hover:brightness-110 text-black font-black text-sm transition-all flex items-center justify-center gap-2 shadow-[0_0_24px_rgba(255,109,0,0.35)] cursor-pointer disabled:opacity-50 active:scale-95"
            >
              {isDownloading ? (
                <>
                  <div className="h-4 w-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                  <span>Downloading 1080p Video...</span>
                </>
              ) : (
                <>
                  <Download size={18} />
                  <span>{mode === 'audioClean' ? 'Download Studio Master (MP3)' : 'Download Ready 1080p MP4'}</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={onReset}
              className="sm:w-auto px-6 py-4 rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10 text-white font-bold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95 whitespace-nowrap"
            >
              <RotateCcw size={15} />
              <span>Create Another Video</span>
            </button>
          </div>

          {/* YouTube Viral Creator Launch Kit (Titles, Chapters Description, SEO Tags) */}
          <div className="rounded-2xl border border-white/10 bg-[#141722]/80 overflow-hidden shadow-xl">
            <button
              type="button"
              onClick={() => {
                const nextState = !showSocialCopy;
                setShowSocialCopy(nextState);
                if (nextState && !youtubeMetadata) {
                  fetchYouTubeMetadata();
                }
              }}
              className="w-full p-4 flex items-center justify-between text-xs font-bold text-slate-200 hover:bg-white/[0.03] transition-colors cursor-pointer"
            >
              <span className="flex items-center gap-2">
                <Sparkles size={16} className="text-[#FF7043]" />
                <span className="font-extrabold tracking-tight text-white">YouTube Launch Kit (Titles, Chapters &amp; Tags)</span>
              </span>
              <div className="flex items-center gap-2 text-slate-400">
                <span className="text-[10px] font-black text-amber-300 bg-amber-500/10 px-2.5 py-0.5 rounded-full border border-amber-500/30">
                  🔥 Viral CTR Ready
                </span>
                {showSocialCopy ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
              </div>
            </button>

            {showSocialCopy && (
              <div className="p-4 pt-1 space-y-4 border-t border-white/5">
                {/* 1. Viral Titles */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-[11px] font-bold text-slate-400">
                    <span className="text-zinc-300 font-extrabold flex items-center gap-1.5">
                      <span className="h-2 w-2 rounded-full bg-[#FF5722]" />
                      3 High-CTR Viral Titles (Pick Best)
                    </span>
                  </div>

                  <div className="space-y-1.5">
                    {(youtubeMetadata?.viralTitles || [displayTitle]).map((titleOpt, tIdx) => (
                      <div
                        key={tIdx}
                        className="flex items-center justify-between gap-3 bg-[#0B0E17] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white group hover:border-[#FF5722]/40 transition"
                      >
                        <span className="font-medium truncate flex-1">{titleOpt}</span>
                        <button
                          type="button"
                          onClick={() => handleCopySpecificTitle(titleOpt, tIdx)}
                          className="shrink-0 px-2.5 py-1 rounded-lg bg-white/5 hover:bg-orange-500/20 text-[#FF7043] hover:text-[#FFA000] border border-white/10 hover:border-orange-500/40 flex items-center gap-1 text-[10px] font-bold transition cursor-pointer active:scale-95"
                        >
                          {copiedTitleIdx === tIdx ? <Check size={11} /> : <Copy size={11} />}
                          <span>{copiedTitleIdx === tIdx ? 'Copied' : 'Copy'}</span>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 2. Structured Description with Chapters */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-[11px] font-bold text-slate-400">
                    <span className="text-zinc-300 font-extrabold flex items-center gap-1.5">
                      <span className="h-2 w-2 rounded-full bg-emerald-400" />
                      YouTube Description &amp; Timestamps
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        const descToCopy = youtubeMetadata?.description || autoGeneratedDesc;
                        navigator.clipboard.writeText(descToCopy);
                        setCopiedDesc(true);
                        setTimeout(() => setCopiedDesc(false), 2000);
                      }}
                      className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-emerald-500/20 text-emerald-400 border border-white/10 hover:border-emerald-500/40 flex items-center gap-1 text-[10px] font-bold transition cursor-pointer active:scale-95"
                    >
                      {copiedDesc ? <Check size={11} /> : <Copy size={11} />}
                      <span>{copiedDesc ? 'Copied Description' : 'Copy Description'}</span>
                    </button>
                  </div>
                  <div className="bg-[#0B0E17] border border-white/10 rounded-xl p-3 text-xs text-slate-300 leading-relaxed max-h-36 overflow-y-auto whitespace-pre-wrap font-sans shadow-inner">
                    {youtubeMetadata?.description || autoGeneratedDesc}
                  </div>
                </div>

                {/* 3. SEO Tags Box */}
                {youtubeMetadata?.tags && youtubeMetadata.tags.length > 0 && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-[11px] font-bold text-slate-400">
                      <span className="text-zinc-300 font-extrabold flex items-center gap-1.5">
                        <span className="h-2 w-2 rounded-full bg-cyan-400" />
                        YouTube Studio Tags ({youtubeMetadata.tags.length})
                      </span>
                      <button
                        type="button"
                        onClick={handleCopyTags}
                        className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-cyan-500/20 text-cyan-400 border border-white/10 hover:border-cyan-500/40 flex items-center gap-1 text-[10px] font-bold transition cursor-pointer active:scale-95"
                      >
                        {copiedTags ? <Check size={11} /> : <Copy size={11} />}
                        <span>{copiedTags ? 'Copied All Tags' : 'Copy All Tags'}</span>
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-1.5 bg-[#0B0E17] border border-white/10 rounded-xl p-3 text-[11px] max-h-24 overflow-y-auto">
                      {youtubeMetadata.tags.map((tag, tagIdx) => (
                        <span
                          key={tagIdx}
                          className="px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-slate-300 font-medium text-[10px]"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      ) : null}

      {/* ── OPTIONAL COLLAPSIBLE EXPORT SPECS (Clean, out of the way) ── */}
      <div className="pt-1">
        <button
          onClick={() => setShowSpecs(!showSpecs)}
          className="mx-auto flex items-center gap-1 text-[10px] font-bold text-slate-500 hover:text-slate-300 transition-colors cursor-pointer"
        >
          <Info size={11} />
          <span>{showSpecs ? 'Hide video specs' : '1080p Full HD · 30 FPS · AWS Lambda (Specs)'}</span>
          {showSpecs ? <ChevronUp size={11} /> : <ChevronDown size={11} />}
        </button>

        {showSpecs && (
          <div className="mt-2.5 p-3.5 rounded-2xl bg-[#151E30] border border-white/10 text-[11px] space-y-2">
            <div className="flex items-center justify-between text-slate-400">
              <span>Resolution</span>
              <span className="font-mono text-white font-bold">
                1080p Full HD ({['youtubeSubtitles', 'YOUTUBE_SUBTITLES', 'imageToVideoAi', 'IMAGE_TO_VIDEO_AI', 'facelessVideo', 'FACELESS_VIDEO', 'bookSummary', 'BOOK_SUMMARY'].includes(mode) ? '1920×1080 Widescreen' : '1080×1920 Vertical'})
              </span>
            </div>
            <div className="flex items-center justify-between text-slate-400">
              <span>Frame Rate</span>
              <span className="font-mono text-emerald-400 font-bold">30 FPS Progressive</span>
            </div>
            <div className="flex items-center justify-between text-slate-400">
              <span>Render Engine</span>
              <span className="font-mono text-[#FF7043] font-bold">AWS Lambda (Remotion Cloud)</span>
            </div>
            <div className="flex items-center justify-between text-slate-400">
              <span>Encoding</span>
              <span className="font-mono text-white font-bold">MP4 (H.264 FastStart AAC)</span>
            </div>
          </div>
        )}
      </div>

    </div>
  );
}
