'use client';

import React, { useState, useEffect } from 'react';
import PhoneQrDownloadModal from '@/components/media/PhoneQrDownloadModal';
import {
  AlertCircle,
  RotateCcw,
  Download,
  Copy,
  Check,
  Sparkles,
  Film,
  Clock,
  Volume2,
  VolumeX,
  Mic,
  ChevronDown,
  ChevronUp,
  X,
  Layers,
  Zap,
  ArrowLeft,
  ArrowRight,
  Smartphone,
  MessageSquareHeart,
} from 'lucide-react';
import { useAuth } from '@/components/auth/AuthContext';
import { trackEvent } from '@/components/analytics/PostHogProvider';
import { PLATFORM_MODE_CONFIG } from '@/lib/config/platformMode';
import { PostDownloadFeedbackModal } from '@/components/feedback/PostDownloadFeedbackModal';
import {
  requestNotificationPermission,
  sendRenderCompleteNotification,
  playRenderSuccessSound,
  triggerAutoDownload,
} from '@/lib/renderNotifications';

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
    case 'aiVideoPolisher':
    case 'AI_VIDEO_POLISHER':
      return [
        { shortLabel: 'Media Sync', label: 'Preparing your video & overlay layers', detail: 'Aligning widescreen canvas', doneAt: 20, icon: Film },
        { shortLabel: 'Speech Sync', label: 'Analyzing speech & detecting pauses', detail: 'Word-level timing alignment', doneAt: 45, icon: Mic },
        { shortLabel: 'Jump-Cuts & Zoom', label: 'Cutting silences & adding dynamic zoom', detail: 'Smart pacing & motion', doneAt: 75, icon: Sparkles },
        { shortLabel: 'Final Export', label: 'Rendering your polished video', detail: 'Assembling final frames', doneAt: 100, icon: Zap },
      ];
    case 'aiShortsPolisher':
    case 'AI_SHORTS_POLISHER':
      return [
        { shortLabel: 'Media Sync', label: 'Preparing vertical video & layers', detail: 'Aligning vertical frame', doneAt: 20, icon: Film },
        { shortLabel: 'Speech Sync', label: 'Analyzing speech & detecting gaps', detail: 'Word-level timing alignment', doneAt: 45, icon: Mic },
        { shortLabel: 'Jump-Cuts & Zoom', label: 'Cutting silences & adding dynamic zoom', detail: 'Smart pacing & motion', doneAt: 75, icon: Sparkles },
        { shortLabel: 'Final Export', label: 'Rendering your polished short', detail: 'Assembling final frames', doneAt: 100, icon: Zap },
      ];

    case 'audioClean':
    case 'AI_AUDIO_CLEANER':
      return [
        { shortLabel: 'Speech Sync', label: 'Analyzing speech & pacing', detail: 'Precision voice mapping', doneAt: 25, icon: Mic },
        { shortLabel: 'Retakes', label: 'Detecting retakes & pauses', detail: 'Smart speech cleanup', doneAt: 50, icon: Sparkles },
        { shortLabel: 'Mastering', label: 'Filtering noise & balancing loudness', detail: 'Studio acoustic mastering', doneAt: 75, icon: Layers },
        { shortLabel: 'Export', label: 'Exporting studio clean audio', detail: 'High-clarity audio output', doneAt: 100, icon: Zap },
      ];
    case 'whiteboard':
    case 'whiteboardVideo':
    case 'WHITEBOARD_VIDEO':
      return [
        { shortLabel: 'Audio', label: 'Reading your audio', detail: 'Extracting narration & timing', doneAt: 20, icon: Mic },
        { shortLabel: 'Story', label: 'Planning the story', detail: 'Organizing key concepts & layout', doneAt: 40, icon: Sparkles },
        { shortLabel: 'Visuals', label: 'Creating the visuals', detail: 'Syncing icons & illustrations', doneAt: 60, icon: Layers },
        { shortLabel: 'Drawing', label: 'Drawing your whiteboard animation', detail: 'Animating hand-drawn strokes', doneAt: 85, icon: Sparkles },
        { shortLabel: 'Final Export', label: 'Exporting your final video', detail: 'Assembling final frames', doneAt: 100, icon: Film },
      ];
    case 'compare':
    case 'COMPARE_EXPLAINER':
      return [
        { shortLabel: 'Audio Sync', label: 'Aligning voiceover & comparison', detail: 'Precision speech alignment', doneAt: 25, icon: Mic },
        { shortLabel: 'Dual Split', label: 'Arranging comparison cards', detail: 'Side-by-side visual balance', doneAt: 50, icon: Layers },
        { shortLabel: 'Subtitles', label: 'Styling motion captions', detail: 'Kinetic typography highlights', doneAt: 75, icon: Sparkles },
        { shortLabel: 'Final Export', label: 'Rendering comparison video', detail: 'Assembling final frames', doneAt: 100, icon: Film },
      ];
    case 'longVideoClips':
    case 'LONG_VIDEO_CLIPS':
      return [
        { shortLabel: 'Ingest', label: 'Analyzing long video stream', detail: 'Fast speech processing', doneAt: 20, icon: Mic },
        { shortLabel: 'Hook Finder', label: 'Detecting viral hooks & highlights', detail: 'Retention-first moment scoring', doneAt: 45, icon: Sparkles },
        { shortLabel: 'Reframe', label: 'Cropping to vertical + captions', detail: 'Center-stage subject framing', doneAt: 75, icon: Layers },
        { shortLabel: 'Final Export', label: 'Rendering your short clips', detail: 'Assembling final frames', doneAt: 100, icon: Film },
      ];
    case 'imageToVideoAi':
    case 'IMAGE_TO_VIDEO_AI':
      return [
        { shortLabel: 'Audio Beat', label: 'Syncing voiceover with scenes', detail: 'Pacing & duration alignment', doneAt: 20, icon: Mic },
        { shortLabel: 'Motion', label: 'Generating smooth camera depth', detail: 'Cinematic pans & zooms', doneAt: 50, icon: Sparkles },
        { shortLabel: 'Transitions', label: 'Applying visual FX & overlays', detail: 'Seamless scene transitions', doneAt: 75, icon: Layers },
        { shortLabel: 'Final Export', label: 'Rendering your final video', detail: 'Assembling final frames', doneAt: 100, icon: Film },
      ];
    case 'bookSummary':
    case 'BOOK_SUMMARY':
      return [
        { shortLabel: 'Speech Sync', label: 'Aligning spoken book summary', detail: 'Precision speech timing', doneAt: 20, icon: Mic },
        { shortLabel: 'Chapters', label: 'Structuring key ideas & lesson cards', detail: 'Scene pacing & quote layout', doneAt: 45, icon: Sparkles },
        { shortLabel: 'Typography', label: 'Styling lesson titles & typography', detail: 'Editorial layout composition', doneAt: 70, icon: Layers },
        { shortLabel: 'Final Export', label: 'Rendering Book Summary video', detail: 'Assembling final frames', doneAt: 100, icon: Film },
      ];
    case 'youtubeSubtitles':
    case 'YOUTUBE_SUBTITLES':
      return [
        { shortLabel: 'Canvas', label: 'Preparing widescreen canvas', detail: 'Safe-zone auto alignment', doneAt: 20, icon: Film },
        { shortLabel: 'Speech Sync', label: 'Mapping speech timestamps', detail: 'Millisecond word alignment', doneAt: 45, icon: Mic },
        { shortLabel: 'Subtitles', label: 'Applying typography presets', detail: 'High-contrast lower-third text', doneAt: 75, icon: Sparkles },
        { shortLabel: 'Final Export', label: 'Rendering your subtitled video', detail: 'Assembling final frames', doneAt: 100, icon: Film },
      ];
    case 'longVideoPromo':
    case 'LONG_VIDEO_PROMO':
      return [
        { shortLabel: 'Media Prep', label: 'Preparing teaser clip & thumbnail', detail: 'High-res asset staging', doneAt: 25, icon: Layers },
        { shortLabel: 'Layout', label: 'Building teaser split composition', detail: 'Thumbnail topper & video frame', doneAt: 50, icon: Sparkles },
        { shortLabel: 'Callouts', label: 'Adding social hook callouts', detail: 'Dynamic watch prompts & arrows', doneAt: 75, icon: Zap },
        { shortLabel: 'Final Export', label: 'Rendering your promo reel', detail: 'Assembling final frames', doneAt: 100, icon: Film },
      ];
    case 'facelessShorts':
    case 'FACELESS_SHORTS':
      return [
        { shortLabel: 'Story AI', label: 'Analyzing audio & script', detail: 'Scene direction & timing', doneAt: 20, icon: Mic },
        { shortLabel: 'Visuals', label: 'Matching visuals & media assets', detail: 'Curating vertical scenes', doneAt: 45, icon: Layers },
        { shortLabel: 'Captions', label: 'Applying kinetic typography', detail: 'Bold animated subtitles', doneAt: 75, icon: Sparkles },
        { shortLabel: 'Final Export', label: 'Rendering your short video', detail: 'Assembling final frames', doneAt: 100, icon: Film },
      ];
    case 'facelessVideo':
    case 'FACELESS_VIDEO':
      return [
        { shortLabel: 'Story AI', label: 'Analyzing narrative & scene beats', detail: 'Visual scene planning', doneAt: 20, icon: Sparkles },
        { shortLabel: 'Visual Fit', label: 'Matching visuals & sound design', detail: 'Contextual scene curation', doneAt: 45, icon: Layers },
        { shortLabel: 'Captions', label: 'Applying kinetic typography overlays', detail: 'Bold animated subtitles', doneAt: 75, icon: Mic },
        { shortLabel: 'Final Export', label: 'Rendering your faceless video', detail: 'Assembling final frames', doneAt: 100, icon: Film },
      ];
    case 'splitScreenExplainer':
    case 'SPLIT_SCREEN_EXPLAINER':
      return [
        { shortLabel: 'Media Sync', label: 'Aligning creator video & slides', detail: 'Dual canvas safe zones', doneAt: 20, icon: Film },
        { shortLabel: 'Speech Sync', label: 'Mapping speech & script timing', detail: 'Word-level precision', doneAt: 45, icon: Mic },
        { shortLabel: 'Captions & SFX', label: 'Styling captions & audio balance', detail: 'Balanced music & transitions', doneAt: 75, icon: Sparkles },
        { shortLabel: 'Final Export', label: 'Rendering split-screen explainer', detail: 'Assembling final frames', doneAt: 100, icon: Film },
      ];
    case 'autoCaption':
    case 'AUTO_CAPTION_GENERATOR':
    default:
      return [
        { shortLabel: 'Project Prep', label: 'Preparing audio stream & layout', detail: 'Framing & safe-zone setup', doneAt: 15, icon: Film },
        { shortLabel: 'Speech Sync', label: 'Mapping speech timestamps', detail: 'Millisecond word alignment', doneAt: 40, icon: Mic },
        { shortLabel: 'Style Captions', label: 'Applying kinetic bounce & highlights', detail: 'Active word emphasis', doneAt: 75, icon: Sparkles },
        { shortLabel: 'Final Export', label: 'Rendering your final video', detail: 'Assembling final frames', doneAt: 100, icon: Zap },
      ];
  }
}

export const getRenderStepDefinitions = getModeSteps;

const ENGINE_CREATOR_TIPS = [
  { kicker: "VIRAL RETENTION SECRET", tip: "Cutting to new visuals every 3–4 seconds keeps viewer retention 2.4× higher than static scenes." },
  { kicker: "FIRST 3 SECONDS HOOK", tip: "80% of viewers decide to keep watching in the first 3 seconds — make your opening scene punchy." },
  { kicker: "AUDIO DUCKING FORMULA", tip: "Lowering background music while speech is active gives your voiceover crisp documentary authority." },
  { kicker: "CINEMATIC MOTION", tip: "Subtle zoom drift (1.0× to 1.15×) keeps eyes glued to the frame without causing visual fatigue." },
  { kicker: "HIGH-CONTRAST SUBTITLES", tip: "Warm orange and amber kinetic word highlights improve mobile comprehension by 38% in silent feeds." },
  { kicker: "PARALLEL RENDERING", tip: "Every scene is composed in parallel across high-speed cloud workers for fast, consistent delivery." },
  { kicker: "BROADCAST AUDIO BALANCE", tip: "Balanced voiceover loudness ensures crisp vocal presence across phone speakers and headphones." },
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
  const [showQrModal, setShowQrModal] = useState(false);
  const [selectedClipQrUrl, setSelectedClipQrUrl] = useState<string | null>(null);

  const { user } = useAuth();
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [limitExceededModal, setLimitExceededModal] = useState<{ resetsIn: string } | null>(null);

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

  const handleClaimDownload = async (url: string, filename: string) => {
    // If not temporary free access, trigger direct download
    if (!PLATFORM_MODE_CONFIG.TEMPORARY_FREE_ACCESS) {
      // 1. Direct download (paid / non-free-access mode)
      await downloadDirectly(url, filename);
      trackEvent('video_downloaded', { mode: mode || 'generic', jobId: status.jobId });
      return;
    }

    if (!user) {
      alert('Please log in with Google or Email to download your video.');
      return;
    }

    try {
      setIsDownloading(true);
      const videoKey = status.jobId || status.outputFile || filename;

      // 1. Claim download against daily free limit
      const claimRes = await fetch('/api/downloads/claim', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id || user.uid,
          videoId: videoKey,
          videoType: mode || 'generic',
          outputUrl: url,
          fileName: filename,
        }),
      });

      const claimData = await claimRes.json();

      if (!claimRes.ok || !claimData.ok) {
        if (claimData.reason === 'DAILY_LIMIT_EXCEEDED') {
          setLimitExceededModal({ resetsIn: claimData.resetsInFormatted || '12:00 AM IST' });
          return;
        }
        throw new Error(claimData.error || 'Failed to claim download.');
      }

      // 2. Dispatch event to update DailyDownloadBadge across the app in real time
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('download-claimed', { detail: claimData }));
      }

      // 3. Trigger actual binary file download
      await downloadDirectly(url, filename);
      trackEvent('video_downloaded', { mode: mode || 'generic', jobId: status.jobId });

      // 4. Trigger contextual post-download feedback modal
      if (PLATFORM_MODE_CONFIG.ENABLE_POST_DOWNLOAD_FEEDBACK) {
        setShowFeedbackModal(true);
      }
    } catch (err: any) {
      console.error('Download error:', err);
      // Fallback: trigger download directly so user is never stranded
      await downloadDirectly(url, filename);
    } finally {
      setIsDownloading(false);
    }
  };

  const [copiedLink, setCopiedLink] = useState(false);

  const isFailed = status.state === 'error';
  const isReady = status.state === 'ready' || Boolean(status.outputFile);
  const isVerticalMode = [
    'aiShortsPolisher', 'autoCaption', 'whiteboardVideo', 'longVideoClips', 'compare',
    'longVideoPromo', 'splitScreenExplainer', 'facelessShorts', 'AI_SHORTS_POLISHER',
    'AUTO_CAPTION_GENERATOR', 'WHITEBOARD_VIDEO', 'LONG_VIDEO_CLIPS', 'COMPARE_EXPLAINER',
    'LONG_VIDEO_PROMO', 'SPLIT_SCREEN_EXPLAINER', 'FACELESS_SHORTS'
  ].includes(mode);

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
  const autoGeneratedDesc = `${displayTitle} 🚀 ${mode === 'audioClean' ? 'Mastered with ItnaVideo Studio.' : 'Created with ItnaVideo Studio.'}\n\n#video #creator #reels #shorts #itnavideo`;

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
  const isLongMode = mode === 'imageToVideoAi' || mode === 'youtubeSubtitles' || mode === 'facelessVideo' || mode === 'longVideoClips' || mode === 'aiVideoPolisher';
  const defaultEstimate = isLongMode ? 300 : 90;
  const totalEstimated = status.estimatedSeconds || defaultEstimate;
  const calculatedRemaining = Math.max(5, Math.round(totalEstimated - liveElapsed));
  const fallbackRemaining = Math.max(5, Math.round(((100 - percentage) / 100) * defaultEstimate));
  const secondsRemaining = isReady ? 0 : (status.startedAt ? calculatedRemaining : fallbackRemaining);
  const formatTimeRemaining = (secs: number) => {
    if (secs <= 5) return 'Finalizing video...';
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
  const hasTrackedErrorRef = React.useRef<string | null>(null);
  const hasTrackedStartRef = React.useRef<string | null>(null);

  useEffect(() => {
    if (status.state === 'uploading' || status.state === 'starting' || status.state === 'rendering') {
      const startKey = status.jobId || `${mode}-${status.startedAt || 'active'}`;
      if (hasTrackedStartRef.current !== startKey) {
        hasTrackedStartRef.current = startKey;
        trackEvent('video_render_started', {
          mode,
          title: displayTitle,
          jobId: status.jobId,
        });
      }
    }
  }, [status.state, status.jobId, status.startedAt, mode, displayTitle]);

  useEffect(() => {
    if (isFailed) {
      const errKey = status.jobId || status.error || 'render-error';
      if (hasTrackedErrorRef.current !== errKey) {
        hasTrackedErrorRef.current = errKey;
        trackEvent('video_render_failed', {
          mode,
          title: displayTitle,
          error: status.error || status.message || 'Unknown error',
        });
      }
    }
  }, [isFailed, mode, displayTitle, status.jobId, status.error, status.message]);

  // Smooth scroll to top when render engine mounts on mobile or desktop
  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, []);

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
      trackEvent('video_render_completed', {
        mode,
        title: displayTitle,
        jobId: status.jobId,
      });

      sendRenderCompleteNotification({
        title: 'Your Video is Ready!',
        body: `Your video (${displayTitle}) has finished rendering. Click to view & download.`,
        outputUrl: status.outputFile,
        onNotificationClick: () => {
          if (status.outputFile) {
            window.open(status.outputFile, '_blank');
          }
        },
      });

      if (status.outputFile && !PLATFORM_MODE_CONFIG.TEMPORARY_FREE_ACCESS) {
        const downloadName = `${displayTitle.toLowerCase().replace(/[^a-z0-9]/g, '-')}.mp4`;
        triggerAutoDownload(status.outputFile, downloadName).catch(() => {});
      }

      // Auto fetch YouTube Viral Metadata Kit
      fetchYouTubeMetadata().catch(() => {});
    }
  }, [isReady, status.jobId, status.outputFile, displayTitle, soundEnabled]);

  const CurrentStepIcon = steps[activeStepIndex]?.icon || Sparkles;

  const ringRadius = 86;
  const ringCircumference = 2 * Math.PI * ringRadius;
  const ringOffset = ringCircumference - (percentage / 100) * ringCircumference;
  const handwrittenPhase =
    percentage >= 85
      ? 'Putting on the final polish...'
      : percentage >= 45
      ? 'Bringing your scenes to life...'
      : 'Crafting your story...';

  return (
    <div
      style={{ backgroundColor: '#09090B', color: '#FFFFFF' }}
      className="relative w-full max-w-6xl mx-auto rounded-3xl border border-zinc-800 bg-zinc-950 p-6 sm:p-8 lg:p-10 text-white shadow-2xl space-y-7 font-sans select-none overflow-hidden"
    >
      {/* Rich Dual-Tone Ambient Studio Glow */}
      {!isFailed && !isReady && (
        <>
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -top-32 left-1/4 -translate-x-1/2 w-[560px] h-[260px] rounded-full opacity-25 blur-3xl"
            style={{
              background: 'radial-gradient(circle, rgba(234,88,12,0.65) 0%, transparent 70%)',
            }}
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-32 right-1/4 translate-x-1/2 w-[480px] h-[240px] rounded-full opacity-20 blur-3xl"
            style={{
              background: 'radial-gradient(circle, rgba(139,92,246,0.5) 0%, transparent 70%)',
            }}
          />
        </>
      )}

      {/* ── CLEAN STUDIO HEADER ── */}
      <div className="relative z-10 flex items-center justify-between gap-4 border-b border-zinc-800/90 pb-5">
        <div className="flex items-center gap-4 min-w-0">
          <div className="w-11 h-11 shrink-0 rounded-2xl bg-gradient-to-br from-orange-500 via-amber-500 to-rose-500 flex items-center justify-center text-white shadow-lg shadow-orange-500/25">
            {mode === 'audioClean' ? <Mic size={20} /> : <Film size={20} />}
          </div>
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-3">
              <h2 className="font-bold text-lg sm:text-2xl text-white tracking-tight truncate">
                {displayTitle}
              </h2>
              <span
                className={`shrink-0 inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full border ${
                  isReady
                    ? 'text-emerald-300 bg-emerald-500/15 border-emerald-500/30'
                    : isFailed
                    ? 'text-red-300 bg-red-500/15 border-red-500/30'
                    : 'text-orange-300 bg-orange-500/15 border-orange-500/35'
                }`}
              >
                {!isReady && !isFailed && (
                  <span className="h-2 w-2 rounded-full bg-orange-400 animate-pulse" />
                )}
                {isReady ? 'Ready' : isFailed ? 'Interrupted' : 'Rendering'}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="p-2.5 rounded-xl bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-zinc-400 hover:text-white transition-colors cursor-pointer"
            title={soundEnabled ? 'Mute completion chime' : 'Enable completion chime'}
          >
            {soundEnabled ? <Volume2 size={17} /> : <VolumeX size={17} />}
          </button>
          <button
            type="button"
            onClick={onReset}
            className="p-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-400 hover:text-white transition-colors cursor-pointer"
            title="Close"
          >
            <X size={17} />
          </button>
        </div>
      </div>

      {/* ── MAIN CONTENT AREA ── */}
      {isReady && status.outputFile ? (
        <div className="relative z-10 space-y-6">
          {/* Player Showcase */}
          <div className="rounded-2xl bg-[#11141C] border border-zinc-800 overflow-hidden">
            {mode === 'audioClean' ? (
              <div className="w-full flex flex-col items-center justify-center p-10 space-y-4">
                <div className="w-16 h-16 rounded-2xl bg-orange-500/15 border border-orange-500/30 text-orange-400 flex items-center justify-center">
                  <Mic size={28} />
                </div>
                <div className="text-center space-y-1">
                  <p className="font-bold text-lg text-white">Audio Cleaned &amp; Mastered</p>
                  <p className="text-xs text-zinc-400">Your studio audio is ready to download</p>
                </div>
                <audio src={status.outputFile} controls autoPlay className="w-full max-w-md mt-2" />
              </div>
            ) : (
              <div className="p-4 sm:p-6 flex items-center justify-center bg-black/40">
                <div
                  className={`relative w-full ${
                    isVerticalMode
                      ? 'aspect-[9/16] max-h-[500px] max-w-[280px] rounded-2xl border border-white/15'
                      : 'aspect-video max-h-[460px] rounded-2xl border border-white/10'
                  } bg-black overflow-hidden shadow-2xl flex items-center justify-center`}
                >
                  <video
                    src={status.outputFile}
                    controls
                    autoPlay
                    playsInline
                    className="w-full h-full object-contain"
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      ) : isFailed ? (
        <div className="relative z-10 p-8 sm:p-12 text-center space-y-5 bg-red-950/15 border border-red-500/25 rounded-2xl">
          <div className="w-14 h-14 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-400 mx-auto flex items-center justify-center">
            <AlertCircle size={26} />
          </div>
          <div className="space-y-2 max-w-md mx-auto">
            <h3 className="text-xl font-bold text-white tracking-tight">Rendering Interrupted</h3>
            <p className="text-sm text-zinc-300 leading-relaxed">
              {status.error || status.message || 'An error occurred during generation. Your upload is safe.'}
            </p>
          </div>

          {status.diagnostics && status.diagnostics.length > 0 ? (
            <details className="mt-2 text-left bg-[#080A0F] rounded-xl p-3 border border-white/10 text-[11px] text-zinc-400 max-w-md mx-auto">
              <summary className="cursor-pointer font-mono font-semibold text-zinc-300 select-none">
                Details
              </summary>
              <div className="mt-2 space-y-1 font-mono break-all max-h-32 overflow-y-auto">
                {status.diagnostics.map((d, i) => (
                  <div key={i}>{d}</div>
                ))}
              </div>
            </details>
          ) : null}

          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-1.5 text-xs text-zinc-300">
            <Zap size={13} className="text-amber-400" />
            <span>Zero credits deducted for interrupted attempts</span>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <button
              type="button"
              onClick={onReset}
              className="w-full sm:w-auto px-6 py-3 bg-orange-600 hover:bg-orange-500 text-white rounded-xl font-semibold text-sm transition-colors inline-flex items-center justify-center gap-2 cursor-pointer"
            >
              <ArrowLeft size={15} />
              <span>Back to Editor</span>
            </button>

            <button
              type="button"
              onClick={() => {
                if (typeof window !== 'undefined') window.location.reload();
              }}
              className="w-full sm:w-auto px-5 py-3 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-white font-semibold text-sm transition-colors inline-flex items-center justify-center gap-2 cursor-pointer"
            >
              <RotateCcw size={15} />
              <span>Refresh Page</span>
            </button>
          </div>
        </div>
      ) : (
        /* ── MODERN LARGE-SCREEN VISUAL PIPELINE & HERO STUDIO ── */
        <div className="relative z-10 space-y-6">
          {/* 1. Horizontal Visual Flow Bar with Directional Arrows */}
          <div
            style={{ backgroundColor: '#11131A' }}
            className="rounded-2xl border border-zinc-800 bg-zinc-900 p-4 sm:p-5"
          >
            <div className="flex items-center justify-between mb-3.5 px-1">
              <span
                style={{ fontFamily: 'var(--font-handwritten), Caveat, cursive' }}
                className="text-xl sm:text-2xl text-amber-300 tracking-wide leading-none"
              >
                Your creation workflow &rarr;
              </span>
              <span className="text-xs font-medium text-zinc-400">
                Step {activeStepIndex + 1} of {steps.length}
              </span>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-1.5">
              {steps.map((step, idx) => {
                const isCompleted = percentage >= step.doneAt || isReady;
                const isCurrent = !isCompleted && idx === activeStepIndex;
                const StepIcon = step.icon || Sparkles;

                return (
                  <React.Fragment key={idx}>
                    <div
                      className={`flex-1 flex items-center gap-3 rounded-xl px-3.5 py-3 border transition-all duration-300 ${
                        isCompleted
                          ? 'bg-emerald-500/10 border-emerald-500/35 text-emerald-300'
                          : isCurrent
                          ? 'bg-gradient-to-r from-orange-500/20 via-amber-500/10 to-transparent border-orange-500/70 text-white shadow-md shadow-orange-500/10'
                          : 'bg-zinc-950/70 border-zinc-800/80 text-zinc-500'
                      }`}
                    >
                      <div
                        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border ${
                          isCompleted
                            ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-400'
                            : isCurrent
                            ? 'bg-orange-500 text-white border-orange-400 shadow-sm shadow-orange-500/40'
                            : 'bg-zinc-900 border-zinc-800 text-zinc-500'
                        }`}
                      >
                        {isCompleted ? <Check size={15} strokeWidth={2.5} /> : <StepIcon size={15} />}
                      </div>

                      <div className="min-w-0">
                        <p className={`text-xs sm:text-sm font-semibold truncate ${isCurrent ? 'text-white' : ''}`}>
                          {step.shortLabel}
                        </p>
                        <p className="text-[11px] opacity-75 truncate">
                          {isCompleted ? 'Completed' : isCurrent ? 'Active' : 'Queued'}
                        </p>
                      </div>
                    </div>

                    {/* Directional Arrow Connector Between Stages */}
                    {idx < steps.length - 1 && (
                      <div className="hidden sm:flex items-center justify-center px-1 shrink-0">
                        <div
                          className={`flex items-center justify-center w-7 h-7 rounded-full border transition-colors ${
                            isCompleted
                              ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-400'
                              : isCurrent
                              ? 'bg-orange-500/15 border-orange-500/50 text-orange-400 animate-pulse'
                              : 'bg-zinc-950 border-zinc-800 text-zinc-600'
                          }`}
                        >
                          <ArrowRight size={14} strokeWidth={2.25} />
                        </div>
                      </div>
                    )}
                  </React.Fragment>
                );
              })}
            </div>
          </div>

          {/* 2. Spacious 2-Column Main Stage */}
          <div className="grid grid-cols-1 lg:grid-cols-[1.15fr_0.85fr] gap-6 items-stretch">
            {/* Left Column: Hero Progress Gauge */}
            <div
              style={{ backgroundColor: '#11131A' }}
              className="rounded-2xl border border-zinc-800 bg-zinc-900 p-7 sm:p-9 flex flex-col justify-between gap-8"
            >
              <div className="flex flex-col items-center justify-center text-center my-auto space-y-5">
                {/* Large SVG Radial Progress Gauge */}
                <div className="relative flex items-center justify-center w-52 h-52 sm:w-56 sm:h-56">
                  <svg className="w-full h-full -rotate-90" viewBox="0 0 200 200">
                    <defs>
                      <linearGradient id="renderProgressGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#F97316" />
                        <stop offset="55%" stopColor="#F59E0B" />
                        <stop offset="100%" stopColor="#FB7185" />
                      </linearGradient>
                    </defs>
                    <circle
                      cx="100"
                      cy="100"
                      r={ringRadius}
                      fill="none"
                      stroke="rgba(255,255,255,0.07)"
                      strokeWidth="10"
                    />
                    <circle
                      cx="100"
                      cy="100"
                      r={ringRadius}
                      fill="none"
                      stroke="url(#renderProgressGrad)"
                      strokeWidth="10"
                      strokeLinecap="round"
                      strokeDasharray={ringCircumference}
                      strokeDashoffset={ringOffset}
                      className="transition-[stroke-dashoffset] duration-500 ease-out"
                    />
                  </svg>

                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-5xl sm:text-6xl font-extrabold tracking-tight tabular-nums text-white">
                      {percentage}%
                    </span>
                    <span
                      style={{ fontFamily: 'var(--font-handwritten), Caveat, cursive' }}
                      className="text-xl sm:text-2xl text-amber-300 mt-0.5 leading-none"
                    >
                      {percentage >= 90 ? 'Almost ready!' : percentage >= 40 ? 'Composing...' : 'Starting up'}
                    </span>
                  </div>
                </div>

                {/* Handwritten + Crisp Headline */}
                <div className="space-y-2 max-w-lg">
                  <p
                    style={{ fontFamily: 'var(--font-handwritten), Caveat, cursive' }}
                    className="text-2xl sm:text-3xl text-orange-400 leading-none"
                  >
                    {handwrittenPhase}
                  </p>
                  <p className="text-lg sm:text-xl font-semibold text-white">
                    {status.message || steps[activeStepIndex]?.label || 'Creating your video...'}
                  </p>
                  <p className="text-xs sm:text-sm text-zinc-400">
                    {steps[activeStepIndex]?.detail || 'Preparing your scenes'}
                  </p>
                </div>
              </div>

              {/* Linear Progress Track + Timing & Cancel */}
              <div className="space-y-4">
                <div className="relative h-2.5 w-full overflow-hidden rounded-full bg-zinc-800">
                  <div
                    className="h-full bg-gradient-to-r from-orange-500 via-amber-500 to-rose-500 rounded-full transition-[width] duration-500 ease-out"
                    style={{ width: `${Math.max(4, percentage)}%` }}
                  />
                </div>

                <div className="flex flex-wrap items-center justify-between gap-3 text-xs sm:text-sm text-zinc-400">
                  <div className="flex items-center gap-2.5">
                    <Clock size={14} className="text-orange-400" />
                    <span>
                      Elapsed <span className="font-mono text-zinc-100 font-medium">{formatTimer(liveElapsed)}</span>
                    </span>
                    <span className="text-zinc-600">·</span>
                    <span>
                      Est. <span className="text-zinc-100 font-medium">{formatTimeRemaining(secondsRemaining)}</span>
                    </span>
                  </div>

                  {onCancel && !isReady && (
                    <button
                      type="button"
                      onClick={onCancel}
                      className="px-3 py-1 rounded-lg border border-zinc-800 hover:border-red-500/40 text-xs font-medium text-zinc-400 hover:text-red-400 transition-colors cursor-pointer"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Right Column: Detailed Stage Flow + Creator Note */}
            <div className="flex flex-col justify-between gap-5">
              {/* Vertical Stage Breakdown with Arrow Connectors */}
              <div
                style={{ backgroundColor: '#11131A' }}
                className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6 flex-1"
              >
                <div className="flex items-center justify-between mb-4">
                  <p className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
                    Live Breakdown
                  </p>
                  <span
                    style={{ fontFamily: 'var(--font-handwritten), Caveat, cursive' }}
                    className="text-lg text-zinc-400 leading-none"
                  >
                    real-time progress
                  </span>
                </div>

                <div className="space-y-2">
                  {steps.map((step, idx) => {
                    const isCompleted = percentage >= step.doneAt || isReady;
                    const isCurrent = !isCompleted && idx === activeStepIndex;
                    const StepIcon = step.icon || Sparkles;

                    return (
                      <React.Fragment key={idx}>
                        <div
                          className={`flex items-center gap-3.5 rounded-xl p-3 border transition-colors ${
                            isCompleted
                              ? 'bg-emerald-500/[0.06] border-emerald-500/20'
                              : isCurrent
                              ? 'bg-orange-500/10 border-orange-500/40'
                              : 'bg-zinc-950/50 border-zinc-800/60'
                          }`}
                        >
                          <div
                            className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border ${
                              isCompleted
                                ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-400'
                                : isCurrent
                                ? 'bg-orange-500/20 border-orange-500 text-orange-400'
                                : 'bg-zinc-900 border-zinc-800 text-zinc-500'
                            }`}
                          >
                            {isCompleted ? <Check size={15} strokeWidth={2.5} /> : <StepIcon size={15} />}
                          </div>

                          <div className="min-w-0 flex-1">
                            <div className="flex items-center justify-between gap-2">
                              <span
                                className={`text-sm font-semibold ${
                                  isCompleted
                                    ? 'text-zinc-200'
                                    : isCurrent
                                    ? 'text-white'
                                    : 'text-zinc-500'
                                }`}
                              >
                                {step.shortLabel}
                              </span>
                              <span
                                className={`text-xs font-medium ${
                                  isCompleted
                                    ? 'text-emerald-400'
                                    : isCurrent
                                    ? 'text-orange-400'
                                    : 'text-zinc-600'
                                }`}
                              >
                                {isCompleted ? 'Done' : isCurrent ? 'In progress' : 'Pending'}
                              </span>
                            </div>
                            <p className="text-xs text-zinc-400 mt-0.5 truncate">
                              {step.label}
                            </p>
                          </div>
                        </div>

                        {idx < steps.length - 1 && (
                          <div className="flex justify-center py-0.5">
                            <ChevronDown
                              size={14}
                              className={
                                isCompleted
                                  ? 'text-emerald-400'
                                  : isCurrent
                                  ? 'text-orange-400 animate-bounce'
                                  : 'text-zinc-700'
                              }
                            />
                          </div>
                        )}
                      </React.Fragment>
                    );
                  })}
                </div>
              </div>

              {/* Creator Tip Card with Handwritten Accent */}
              <div
                style={{ backgroundColor: '#11131A' }}
                className="rounded-2xl border border-zinc-800 bg-zinc-900 p-5 space-y-2"
              >
                <div className="flex items-center justify-between">
                  <span
                    style={{ fontFamily: 'var(--font-handwritten), Caveat, cursive' }}
                    className="inline-flex items-center gap-1.5 text-xl text-amber-300 leading-none"
                  >
                    <Sparkles size={14} className="text-orange-400" />
                    <span>Creator Tip · {ENGINE_CREATOR_TIPS[currentTipIdx]?.kicker.toLowerCase()}</span>
                  </span>
                  <span className="text-xs font-mono text-zinc-500">
                    {currentTipIdx + 1}/{ENGINE_CREATOR_TIPS.length}
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
                  &ldquo;{ENGINE_CREATOR_TIPS[currentTipIdx]?.tip}&rdquo;
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── MULTI-CLIPS GRID (WHEN MODE HAS CLIPS E.G. LONG VIDEO CLIPS) ── */}
      {status.clips && status.clips.length > 0 && (
        <div className="relative z-10 rounded-2xl border border-white/[0.08] bg-[#11141C] p-5 space-y-3">
          <div className="flex items-center justify-between text-xs font-semibold text-zinc-300">
            <span className="flex items-center gap-2">
              <Film size={14} className="text-orange-400" />
              <span>Extracted Clips ({status.clips.length})</span>
            </span>
            <span className="text-emerald-400">
              {status.clips.filter((c) => c.status === 'done').length} / {status.clips.length} Ready
            </span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 max-h-56 overflow-y-auto pr-1">
            {status.clips.map((clip, idx) => (
              <div
                key={clip.renderId || idx}
                className="rounded-xl border border-white/[0.06] bg-black/30 p-3 flex items-center justify-between gap-3 text-xs"
              >
                <div className="min-w-0">
                  <p className="font-semibold text-white truncate">{clip.title || `Clip ${idx + 1}`}</p>
                  <p className="text-[11px] text-zinc-400 mt-0.5">
                    {clip.durationSeconds ? `${Math.round(clip.durationSeconds)}s` : 'Clip'}
                  </p>
                </div>
                {clip.outputFile || clip.outputUrl ? (
                  <button
                    type="button"
                    onClick={() => handleClaimDownload(clip.outputFile || clip.outputUrl!, `clip-${idx + 1}.mp4`)}
                    disabled={isDownloading}
                    className="px-3 py-1.5 rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 hover:bg-emerald-500/25 text-[11px] font-semibold inline-flex items-center gap-1 transition disabled:opacity-50 cursor-pointer"
                  >
                    <Download size={12} />
                    <span>Download</span>
                  </button>
                ) : (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-amber-500/10 text-amber-300 border border-amber-500/30">
                    {clip.status || 'rendering'}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── ACTIONS AREA (WHEN READY) ── */}
      {isReady && status.outputFile ? (
        <div className="relative z-10 space-y-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              type="button"
              onClick={() =>
                handleClaimDownload(
                  status.outputFile!,
                  mode === 'audioClean' ? 'itnavideo-clean-studio-audio.mp3' : `itnavideo-${mode || 'video'}.mp4`
                )
              }
              disabled={isDownloading}
              className="flex-1 py-3.5 rounded-2xl bg-orange-600 hover:bg-orange-500 text-white font-semibold text-sm transition-colors flex items-center justify-center gap-2 shadow-lg shadow-orange-600/25 cursor-pointer disabled:opacity-50"
            >
              {isDownloading ? (
                <>
                  <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Downloading...</span>
                </>
              ) : (
                <>
                  <Download size={17} />
                  <span>{mode === 'audioClean' ? 'Download Audio' : 'Download Video'}</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={() => {
                if (status.outputFile) {
                  navigator.clipboard.writeText(status.outputFile);
                  setCopiedLink(true);
                  setTimeout(() => setCopiedLink(false), 2500);
                }
              }}
              className="sm:w-auto px-5 py-3.5 rounded-2xl border border-white/10 bg-white/[0.04] hover:bg-white/[0.08] text-zinc-200 font-semibold text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer whitespace-nowrap"
            >
              {copiedLink ? <Check size={15} className="text-emerald-400" /> : <Copy size={15} />}
              <span>{copiedLink ? 'Link Copied' : 'Copy Link'}</span>
            </button>

            <button
              type="button"
              onClick={() => setShowQrModal(true)}
              className="sm:w-auto px-5 py-3.5 rounded-2xl border border-white/10 bg-white/[0.04] hover:bg-white/[0.08] text-zinc-200 font-semibold text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer whitespace-nowrap"
              title="Scan QR code to download on mobile"
            >
              <Smartphone size={15} className="text-orange-400" />
              <span>Send to Phone</span>
            </button>

            <button
              type="button"
              onClick={() => setShowFeedbackModal(true)}
              className="sm:w-auto px-5 py-3.5 rounded-2xl border border-white/10 bg-white/[0.04] hover:bg-white/[0.08] text-zinc-200 font-semibold text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer whitespace-nowrap"
            >
              <MessageSquareHeart size={15} className="text-orange-400" />
              <span>Feedback</span>
            </button>

            <button
              type="button"
              onClick={onReset}
              className="sm:w-auto px-5 py-3.5 rounded-2xl border border-white/10 bg-white/[0.04] hover:bg-white/[0.08] text-white font-semibold text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer whitespace-nowrap"
            >
              <RotateCcw size={14} />
              <span>Create Another</span>
            </button>
          </div>

          {/* YouTube Launch Kit (Titles, Chapters Description, SEO Tags) */}
          <div className="rounded-2xl border border-white/[0.08] bg-[#11141C] overflow-hidden">
            <button
              type="button"
              onClick={() => {
                const nextState = !showSocialCopy;
                setShowSocialCopy(nextState);
                if (nextState && !youtubeMetadata) {
                  fetchYouTubeMetadata();
                }
              }}
              className="w-full p-4 flex items-center justify-between text-xs font-semibold text-zinc-200 hover:bg-white/[0.03] transition-colors cursor-pointer"
            >
              <span className="flex items-center gap-2">
                <Sparkles size={15} className="text-orange-400" />
                <span className="font-semibold text-white">YouTube Launch Kit (Titles, Chapters &amp; Tags)</span>
              </span>
              <div className="flex items-center gap-2 text-zinc-400">
                {showSocialCopy ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
              </div>
            </button>

            {showSocialCopy && (
              <div className="p-4 pt-1 space-y-4 border-t border-white/[0.06]">
                {/* 1. Viral Titles */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-[11px] font-semibold text-zinc-400">
                    <span className="text-zinc-300 flex items-center gap-1.5">
                      <span className="h-2 w-2 rounded-full bg-orange-500" />
                      Suggested Titles
                    </span>
                  </div>

                  <div className="space-y-1.5">
                    {(youtubeMetadata?.viralTitles || [displayTitle]).map((titleOpt, tIdx) => (
                      <div
                        key={tIdx}
                        className="flex items-center justify-between gap-3 bg-[#080A0F] border border-white/[0.08] rounded-xl px-3.5 py-2.5 text-xs text-white"
                      >
                        <span className="font-medium truncate flex-1">{titleOpt}</span>
                        <button
                          type="button"
                          onClick={() => handleCopySpecificTitle(titleOpt, tIdx)}
                          className="shrink-0 px-2.5 py-1 rounded-lg bg-white/5 hover:bg-orange-500/20 text-orange-400 border border-white/10 flex items-center gap-1 text-[10px] font-semibold transition cursor-pointer"
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
                  <div className="flex items-center justify-between text-[11px] font-semibold text-zinc-400">
                    <span className="text-zinc-300 flex items-center gap-1.5">
                      <span className="h-2 w-2 rounded-full bg-emerald-400" />
                      Description &amp; Timestamps
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        const descToCopy = youtubeMetadata?.description || autoGeneratedDesc;
                        navigator.clipboard.writeText(descToCopy);
                        setCopiedDesc(true);
                        setTimeout(() => setCopiedDesc(false), 2000);
                      }}
                      className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-emerald-500/20 text-emerald-400 border border-white/10 flex items-center gap-1 text-[10px] font-semibold transition cursor-pointer"
                    >
                      {copiedDesc ? <Check size={11} /> : <Copy size={11} />}
                      <span>{copiedDesc ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>
                  <div className="bg-[#080A0F] border border-white/[0.08] rounded-xl p-3 text-xs text-zinc-300 leading-relaxed max-h-36 overflow-y-auto whitespace-pre-wrap font-sans">
                    {youtubeMetadata?.description || autoGeneratedDesc}
                  </div>
                </div>

                {/* 3. SEO Tags Box */}
                {youtubeMetadata?.tags && youtubeMetadata.tags.length > 0 && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-[11px] font-semibold text-zinc-400">
                      <span className="text-zinc-300 flex items-center gap-1.5">
                        <span className="h-2 w-2 rounded-full bg-sky-400" />
                        Tags ({youtubeMetadata.tags.length})
                      </span>
                      <button
                        type="button"
                        onClick={handleCopyTags}
                        className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-sky-500/20 text-sky-400 border border-white/10 flex items-center gap-1 text-[10px] font-semibold transition cursor-pointer"
                      >
                        {copiedTags ? <Check size={11} /> : <Copy size={11} />}
                        <span>{copiedTags ? 'Copied' : 'Copy All'}</span>
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-1.5 bg-[#080A0F] border border-white/[0.08] rounded-xl p-3 text-[11px] max-h-24 overflow-y-auto">
                      {youtubeMetadata.tags.map((tag, tagIdx) => (
                        <span
                          key={tagIdx}
                          className="px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-zinc-300 font-medium text-[10px]"
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

      {/* 📲 PHONE QR CODE DOWNLOAD MODAL */}
      <PhoneQrDownloadModal
        isOpen={showQrModal}
        onClose={() => {
          setShowQrModal(false);
          setSelectedClipQrUrl(null);
        }}
        videoUrl={selectedClipQrUrl || status.outputFile || ''}
        title={status.title || 'Itnavideo Render'}
        aspectRatio={isVerticalMode ? '9:16' : '16:9'}
      />

      {/* 💬 POST-DOWNLOAD CONTEXTUAL FEEDBACK MODAL */}
      <PostDownloadFeedbackModal
        isOpen={showFeedbackModal}
        onClose={() => setShowFeedbackModal(false)}
        videoId={status.jobId || status.outputFile || 'rendered-video'}
        videoType={mode || 'generic'}
        aspectRatio={isVerticalMode ? '9:16' : '16:9'}
        durationSeconds={status.durationInSeconds}
      />

      {/* 🛑 DAILY FREE DOWNLOAD LIMIT REACHED MODAL */}
      {limitExceededModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-md rounded-2xl bg-zinc-900 border border-amber-500/30 p-6 text-white shadow-2xl space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-400">
                <AlertCircle size={24} />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Daily Free Limit Reached (0/2)</h3>
                <p className="text-xs text-zinc-400">All 2 free video downloads used for today</p>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-zinc-950/70 border border-white/5 space-y-2 text-xs text-zinc-300">
              <p>
                To maintain studio GPU capacity and collect quality feedback, each creator receives <span className="text-amber-400 font-semibold">2 free downloads every day</span>.
              </p>
              <div className="flex items-center justify-between pt-1 border-t border-white/5 font-mono text-[11px]">
                <span className="text-zinc-400">Next Reset:</span>
                <span className="text-emerald-400 font-bold">{limitExceededModal.resetsIn} (12:00 AM IST)</span>
              </div>
            </div>

            <p className="text-xs text-zinc-400">
              ✨ <strong className="text-zinc-200">Unlimited Studio Generation:</strong> You can continue generating, editing, and previewing videos in any studio without consuming your daily allowance.
            </p>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => {
                  setLimitExceededModal(null);
                  setShowFeedbackModal(true);
                }}
                className="flex-1 py-2.5 px-3 rounded-xl border border-white/10 hover:bg-white/5 text-xs font-semibold text-zinc-300 transition-colors"
              >
                Share Feedback
              </button>
              <button
                type="button"
                onClick={() => setLimitExceededModal(null)}
                className="flex-1 py-2.5 px-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-black font-bold text-xs hover:brightness-110 transition-all"
              >
                Got It
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}