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
  message: string;
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

  const handleCopyDesc = () => {
    navigator.clipboard.writeText(autoGeneratedDesc);
    setCopiedDesc(true);
    setTimeout(() => setCopiedDesc(false), 2000);
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
    }
  }, [isReady, status.jobId, status.outputFile, displayTitle, soundEnabled]);

  const CurrentStepIcon = steps[activeStepIndex]?.icon || Sparkles;

  return (
    <div className="relative w-full max-w-2xl mx-auto rounded-[28px] border border-white/10 bg-[#0E1526]/95 p-5 sm:p-7 text-white shadow-2xl space-y-5 font-sans select-none backdrop-blur-xl overflow-hidden">
      
      {/* ── AMBIENT BORDER BEAM (Active Glow During Render) ── */}
      {!isFailed && !isReady && (
        <BorderBeam
          size={240}
          duration={8}
          colorFrom="#FF6D00"
          colorTo="#FFA726"
          borderWidth={2}
        />
      )}

      {/* ── M3 TOP APP BAR ── */}
      <div className="flex items-center justify-between border-b border-white/10 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-[#FF6D00] via-[#FF8F00] to-[#FFA726] flex items-center justify-center font-black text-black text-xs shadow-lg shadow-[#FF6D00]/25">
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
                  : 'text-[#FF8F00] bg-[#FF6D00]/10 border-[#FF6D00]/30'
              }`}>
                {isReady ? '1080p Ready ✓' : isFailed ? 'Failed' : 'Rendering · 1080p 30 FPS'}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="p-2 rounded-xl bg-[#151E30] border border-white/10 hover:border-[#FF6D00]/40 text-slate-400 hover:text-white transition-all cursor-pointer"
            title={soundEnabled ? 'Mute completion chime' : 'Enable completion chime'}
          >
            {soundEnabled ? <Volume2 size={15} /> : <VolumeX size={15} />}
          </button>
          <button
            onClick={onReset}
            className="p-2 rounded-xl bg-[#151E30] hover:bg-[#1C2840] border border-white/10 text-slate-400 hover:text-white transition-all cursor-pointer"
            title="Close workbench"
          >
            <X size={15} />
          </button>
        </div>
      </div>

      {/* ── M3 PREVIEW & STATUS CONTAINER ── */}
      <div className="relative w-full rounded-2xl bg-[#151E30]/80 border border-white/10 overflow-hidden shadow-inner">
        {isReady && status.outputFile ? (
          mode === 'audioClean' ? (
            <div className="w-full flex flex-col items-center justify-center p-6 space-y-4 bg-gradient-to-b from-[#151E30] to-[#070B14]">
              <div className="w-14 h-14 rounded-2xl bg-[#FF6D00]/10 border border-[#FF6D00]/30 text-[#FF8F00] flex items-center justify-center shadow-lg shadow-[#FF6D00]/20">
                <Mic size={26} />
              </div>
              <div className="text-center space-y-1">
                <p className="font-black text-sm text-white">Audio Cleaned &amp; Mastered</p>
                <p className="text-xs text-slate-400">Silences trimmed • EBU R128 loudness normalized</p>
              </div>
              <audio src={status.outputFile} controls autoPlay className="w-full max-w-md mt-2" />
            </div>
          ) : (
            <div className="relative w-full aspect-video max-h-[320px] bg-black flex items-center justify-center">
              <video
                src={status.outputFile}
                controls
                autoPlay
                playsInline
                className="w-full h-full object-contain"
              />
            </div>
          )
        ) : isFailed ? (
          <div className="p-6 text-center space-y-3.5">
            <div className="w-12 h-12 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-400 mx-auto flex items-center justify-center">
              <AlertCircle size={24} />
            </div>
            <div>
              <p className="font-extrabold text-sm text-red-400">Render Interrupted</p>
              <div className="mt-2 p-3 rounded-xl bg-red-950/80 border border-red-500/40 text-xs text-red-200 font-mono break-words max-w-md mx-auto shadow-inner">
                {status.error || status.message || 'Error occurred during generation.'}
              </div>
            </div>
            {status.diagnostics && status.diagnostics.length > 0 ? (
              <details className="mt-2 text-left bg-[#070B14] rounded-xl p-3 border border-white/10 text-[10px] text-slate-400 max-w-md mx-auto">
                <summary className="cursor-pointer font-mono font-bold text-slate-300 select-none">Technical Details</summary>
                <div className="mt-1.5 space-y-1 font-mono break-all max-h-32 overflow-y-auto">
                  {status.diagnostics.map((d, i) => (
                    <div key={i}>{d}</div>
                  ))}
                </div>
              </details>
            ) : null}
            <button
              onClick={onRetry}
              className="px-6 py-2.5 bg-gradient-to-r from-red-600 to-red-500 hover:brightness-110 text-white rounded-2xl font-black text-xs transition-all inline-flex items-center gap-2 shadow-lg shadow-red-600/30 cursor-pointer active:scale-95"
            >
              <RotateCcw size={14} />
              <span>Retry Render</span>
            </button>
          </div>
        ) : (mode === 'whiteboard' || mode === 'whiteboardVideo' || mode === 'WHITEBOARD_VIDEO') ? (
          /* Light Corporate Whiteboard Canvas Loader Theme */
          <div className="p-6 sm:p-8 flex flex-col items-center justify-center text-center space-y-4 bg-[#F8FAFC] border-2 border-slate-300/80 rounded-xl shadow-inner text-slate-900 relative overflow-hidden">
            {/* Subtle Titanium Board Border Accent */}
            <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-slate-400 via-slate-300 to-slate-400" />

            {/* Central Animated Whiteboard Marker Centerpiece */}
            <div className="relative">
              <div className="w-20 h-20 rounded-2xl bg-white border-2 border-slate-200 flex items-center justify-center text-[#1E3A8A] shadow-md relative">
                <span className="text-3xl animate-bounce">✍️</span>
              </div>
              <span className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-[#1E3A8A] text-[10px] font-black text-white shadow-md">
                {activeStepIndex + 1}
              </span>
            </div>

            <div className="space-y-1 max-w-sm">
              <p className="text-sm font-black text-slate-900 tracking-wide truncate">{displayTitle}</p>
              <p className="text-xs text-[#1E3A8A] font-extrabold">
                {status.message || steps[activeStepIndex]?.label || 'Drawing your whiteboard video...'}
              </p>
              <p className="text-[11px] text-slate-600 font-medium">
                {steps[activeStepIndex]?.detail || 'Creating handwritten visual concepts'}
              </p>
            </div>

            {/* Light Canvas Timer Pill & Progress */}
            <div className="flex flex-wrap items-center justify-center gap-2.5 pt-1">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-slate-300 text-[11px] font-bold text-slate-700 shadow-sm">
                <Clock size={12} className="text-[#1E3A8A] animate-pulse" />
                <span>Elapsed: <span className="font-mono text-slate-900">{formatTimer(liveElapsed)}</span></span>
                <span className="text-slate-300">•</span>
                <span>Est: <span className="text-[#1E3A8A] font-semibold">{formatTimeRemaining(secondsRemaining)}</span></span>
              </div>

              {onCancel && (status.state === 'idle' || status.state === 'error') && (
                <button
                  type="button"
                  onClick={onCancel}
                  className="px-3.5 py-1.5 rounded-full bg-red-50 hover:bg-red-100 border border-red-200 text-red-700 text-[11px] font-bold transition-all inline-flex items-center gap-1.5 shadow-sm active:scale-95 cursor-pointer"
                  title="Cancel active generation"
                >
                  <X size={13} className="text-red-600" />
                  <span>Cancel / Stop</span>
                </button>
              )}
            </div>
          </div>
        ) : (
          /* M3 Waiting & Rendering State (Warm Orange + Waveform Equalizer) */
          <div className="p-6 sm:p-8 flex flex-col items-center justify-center text-center space-y-4 bg-gradient-to-b from-[#151E30]/90 via-[#151E30]/50 to-[#070B14]">
            
            {/* Shimmering Ambient Glow Pulse & Central Animated Stage Icon */}
            <div className="relative">
              <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-[#FF6D00]/20 via-[#FF8F00]/20 to-[#FFA726]/20 border border-[#FF6D00]/40 flex items-center justify-center text-[#FF8F00] shadow-[0_0_35px_rgba(255,109,0,0.25)]">
                <CurrentStepIcon size={32} className="animate-pulse" />
              </div>
              <span className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-r from-[#FF6D00] to-[#FF8F00] text-[10px] font-black text-black shadow-md">
                {activeStepIndex + 1}
              </span>
            </div>

            <div className="space-y-1 max-w-sm">
              <p className="text-sm font-black text-white tracking-wide truncate">{displayTitle}</p>
              <p className="text-xs text-[#FF9100] font-bold">
                {status.message || steps[activeStepIndex]?.label || 'Processing video scenes...'}
              </p>
              <p className="text-[11px] text-slate-400">
                {steps[activeStepIndex]?.detail || 'AWS Lambda 1080p Cloud Node'}
              </p>
            </div>

            {/* Audio Spectrum Wave & Live Timer Pill */}
            <div className="flex flex-wrap items-center justify-center gap-2.5 pt-1">
              <AudioSpectrumVisualizer isPlaying={true} isTranscribing={percentage < 50} barCount={14} />
              
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#070B14] border border-[#FF6D00]/30 text-[11px] font-bold text-slate-300 shadow-lg">
                <Clock size={12} className="text-[#FF8F00] animate-pulse" />
                <span>Elapsed: <span className="font-mono text-white">{formatTimer(liveElapsed)}</span></span>
                <span className="text-slate-600">•</span>
                <span>Est: <span className="text-[#FFA726]">{formatTimeRemaining(secondsRemaining)}</span></span>
              </div>

              {onCancel && (status.state === 'idle' || status.state === 'error') && (
                <button
                  type="button"
                  onClick={onCancel}
                  className="px-3.5 py-1.5 rounded-full bg-red-950/80 hover:bg-red-900 border border-red-500/40 text-red-300 hover:text-white text-[11px] font-bold transition-all inline-flex items-center gap-1.5 shadow-md active:scale-95 cursor-pointer"
                  title="Cancel active generation and release resources"
                >
                  <X size={13} className="text-red-400" />
                  <span>Cancel / Stop Process</span>
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* ── M3 LINEAR PROGRESS BAR ── */}
      {!isFailed && (
        <div className="space-y-2">
          <div className="flex items-center justify-between text-[11px] font-bold px-1">
            <span className="text-slate-300 flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-[#FF6D00] animate-pulse" />
              <span>{isReady ? 'Render Finished ✓' : `Step ${activeStepIndex + 1} of ${steps.length}: ${steps[activeStepIndex]?.label}`}</span>
            </span>
            <span className="font-mono text-xs font-black text-[#FF9100]">
              {percentage}%
            </span>
          </div>

          <div className="w-full h-2.5 bg-[#070B14] rounded-full overflow-hidden border border-white/10 p-0.5 shadow-inner">
            <div
              className="h-full bg-gradient-to-r from-[#FF6D00] via-[#FF8F00] to-[#FFA726] rounded-full transition-all duration-300 shadow-[0_0_14px_rgba(255,109,0,0.5)]"
              style={{ width: `${Math.max(4, percentage)}%` }}
            />
          </div>
        </div>
      )}

      {/* ── M3 COMPACT 4-STEP HORIZONTAL STEPPER (With Warm Glow & Crisp Icons) ── */}
      {!isFailed && (
        <div className="grid grid-cols-4 gap-2 pt-1">
          {steps.map((step, idx) => {
            const isCompleted = percentage >= step.doneAt || isReady;
            const isCurrent = !isCompleted && idx === activeStepIndex;
            const StepIcon = step.icon;

            return (
              <div
                key={idx}
                className={`flex flex-col items-center justify-center p-2.5 rounded-2xl border text-center transition-all ${
                  isCompleted
                    ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300 shadow-sm'
                    : isCurrent
                    ? 'bg-[#FF6D00]/15 border-[#FF6D00]/60 text-[#FFA726] ring-1 ring-[#FF6D00]/30 shadow-md shadow-[#FF6D00]/10'
                    : 'bg-[#151E30]/40 border-white/5 text-slate-500'
                }`}
              >
                <div className="flex items-center gap-1 mb-1">
                  <span
                    className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black ${
                      isCompleted
                        ? 'bg-emerald-400 text-black'
                        : isCurrent
                        ? 'bg-gradient-to-r from-[#FF6D00] to-[#FF8F00] text-black animate-pulse'
                        : 'bg-[#151E30] text-slate-400 border border-white/10'
                    }`}
                  >
                    {isCompleted ? <Check size={11} strokeWidth={3} /> : idx + 1}
                  </span>
                </div>
                <span className="text-[10px] font-black leading-tight truncate w-full">
                  {step.shortLabel}
                </span>
              </div>
            );
          })}
        </div>
      )}

      {/* ── M3 ACTIONS AREA (WHEN READY) ── */}
      {isReady && status.outputFile ? (
        <div className="space-y-3 pt-2 animate-in fade-in duration-300">
          <button
            type="button"
            onClick={() => downloadDirectly(status.outputFile!, mode === 'audioClean' ? 'itnavideo-clean-studio-audio.mp3' : `itnavideo-${mode || 'reel'}-1080p.mp4`)}
            disabled={isDownloading}
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-[#FF6D00] via-[#FF8F00] to-[#FFA726] hover:brightness-110 text-black font-black text-sm transition-all flex items-center justify-center gap-2 shadow-[0_0_24px_rgba(255,109,0,0.35)] cursor-pointer disabled:opacity-50 active:scale-95"
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

          {/* Collapsible Social Title & Caption Accordion */}
          <div className="rounded-2xl border border-white/10 bg-[#151E30]/60 overflow-hidden">
            <button
              onClick={() => setShowSocialCopy(!showSocialCopy)}
              className="w-full p-3.5 flex items-center justify-between text-xs font-bold text-slate-300 hover:bg-white/[0.02] transition-colors cursor-pointer"
            >
              <span className="flex items-center gap-2">
                <Sparkles size={14} className="text-[#FF8F00]" />
                Social Title &amp; Description
              </span>
              <div className="flex items-center gap-1.5 text-slate-400">
                <span className="text-[10px] font-black text-[#FF8F00] bg-[#FF6D00]/10 px-2 py-0.5 rounded-full border border-[#FF6D00]/30">Ready to post</span>
                {showSocialCopy ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
              </div>
            </button>

            {showSocialCopy && (
              <div className="p-3.5 pt-0 space-y-3 border-t border-white/5">
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-[11px] font-bold text-slate-400">
                    <span>Title</span>
                    <button
                      onClick={handleCopyTitle}
                      className="text-[#FF8F00] hover:text-[#FFA726] flex items-center gap-1 text-[10px] font-bold cursor-pointer"
                    >
                      {copiedTitle ? <Check size={11} /> : <Copy size={11} />}
                      <span>{copiedTitle ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>
                  <div className="bg-[#070B14] border border-white/10 rounded-xl p-2.5 text-xs text-white font-medium truncate">
                    {displayTitle}
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center justify-between text-[11px] font-bold text-slate-400">
                    <span>Caption &amp; Hashtags</span>
                    <button
                      onClick={handleCopyDesc}
                      className="text-[#FF8F00] hover:text-[#FFA726] flex items-center gap-1 text-[10px] font-bold cursor-pointer"
                    >
                      {copiedDesc ? <Check size={11} /> : <Copy size={11} />}
                      <span>{copiedDesc ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>
                  <div className="bg-[#070B14] border border-white/10 rounded-xl p-2.5 text-xs text-slate-300 leading-relaxed max-h-24 overflow-y-auto whitespace-pre-wrap font-sans">
                    {autoGeneratedDesc}
                  </div>
                </div>
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
              <span className="font-mono text-white font-bold">1080p Full HD ({mode === 'youtubeSubtitles' || mode === 'imageToVideoAi' ? '1920×1080' : '1080×1920'})</span>
            </div>
            <div className="flex items-center justify-between text-slate-400">
              <span>Frame Rate</span>
              <span className="font-mono text-emerald-400 font-bold">30 FPS Progressive</span>
            </div>
            <div className="flex items-center justify-between text-slate-400">
              <span>Render Engine</span>
              <span className="font-mono text-[#FF8F00] font-bold">AWS Lambda (Remotion Cloud)</span>
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
