'use client';

import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Clock,
  Loader2,
  CheckCircle2,
  AlertCircle,
  RotateCcw,
  X,
  ChevronRight,
  Film,
  Upload,
  Mic,
  Layers,
  Clapperboard,
  Zap,
  ShieldCheck,
  Tv,
  ArrowRight,
} from 'lucide-react';

export interface RenderStepItem {
  label: string;
  detail: string;
  threshold?: number;
  icon?: React.ElementType;
}

export interface CinematicRenderProgressProps {
  title: string;
  subtitle?: string;
  modeLabel?: string;
  progress?: number; // 0 to 1, or 0 to 100
  isIndeterminate?: boolean;
  statusMessage?: string;
  elapsedSeconds?: number;
  estimatedRemainingSeconds?: number | null;
  steps: RenderStepItem[];
  activeStepIndex?: number;
  isError?: boolean;
  errorMessage?: string;
  onRetry?: () => void;
  onReset?: () => void;
  onCancel?: () => void;
  cancelLabel?: string;
  showTipsCarousel?: boolean;
}

// ─── HIGH-VALUE CREATOR RETENTION SECRETS & TIPS ─────────────────────────────
const CREATOR_TIPS = [
  {
    kicker: 'YOUTUBE RETENTION SECRET',
    tip: 'Cutting to new B-roll every 3–4 seconds keeps viewer retention 2.4× higher than static scenes.',
    author: 'YouTube Algorithm Insight',
  },
  {
    kicker: 'AUDIO DUCKING FORMULA',
    tip: 'Ducking background music by -14dB while speech is active gives your voiceover crisp documentary authority.',
    author: 'Audio Mastering Standard',
  },
  {
    kicker: 'FIRST 3 SECONDS HOOK',
    tip: '80% of viewers decide to keep watching in the first 3 seconds. Match your on-screen title directly with your opening sentence.',
    author: 'Viral Short-Form Benchmark',
  },
  {
    kicker: 'CINEMATIC KEN BURNS MOTION',
    tip: 'Subtle zoom drift (1.0× to 1.15×) glues audience eyes to the frame without causing visual motion fatigue.',
    author: 'Documentary Pacing Rule',
  },
  {
    kicker: 'CLOUD RENDERING SPEED',
    tip: 'Our AWS Lambda Remotion cluster renders 1080p 30 FPS frames in parallel — 6× faster than local laptop rendering.',
    author: 'Itnavideo Cloud Engine',
  },
  {
    kicker: 'HIGH-CONTRAST SUBTITLES',
    tip: 'Bright yellow kinetic word highlights improve mobile comprehension by 38% in silent autoplay feeds.',
    author: 'Social Media Engagement Metric',
  },
  {
    kicker: 'LOUDNESS NORMALIZATION',
    tip: 'Normalizing voiceover audio to -14 LUFS (EBU R128) guarantees maximum vocal clarity across smartphone speakers.',
    author: 'Broadcast Studio Standards',
  },
];

export default function CinematicRenderProgress({
  title,
  subtitle,
  modeLabel = '16:9 Faceless Video',
  progress,
  isIndeterminate = false,
  statusMessage,
  elapsedSeconds = 0,
  estimatedRemainingSeconds,
  steps,
  activeStepIndex,
  isError = false,
  errorMessage,
  onRetry,
  onReset,
  onCancel,
  cancelLabel = 'Cancel Render',
  showTipsCarousel = true,
}: CinematicRenderProgressProps) {
  // Normalize progress to 0-100 integer
  const normalizedProgress = React.useMemo(() => {
    if (progress === undefined || progress === null) return 0;
    if (progress > 0 && progress <= 1) return Math.min(100, Math.round(progress * 100));
    return Math.min(100, Math.max(0, Math.round(progress)));
  }, [progress]);

  // Active step index calculation
  const computedActiveStepIndex = React.useMemo(() => {
    if (activeStepIndex !== undefined) return activeStepIndex;
    if (steps.length === 0) return 0;
    const progFrac = normalizedProgress / 100;
    const foundIndex = steps.findIndex((s) => (s.threshold !== undefined ? progFrac < s.threshold : false));
    return foundIndex === -1 ? steps.length - 1 : foundIndex;
  }, [activeStepIndex, steps, normalizedProgress]);

  // Creator tips rotation timer (every 6.5 seconds)
  const [currentTipIndex, setCurrentTipIndex] = useState(0);

  useEffect(() => {
    if (!showTipsCarousel || isError) return;
    const timer = setInterval(() => {
      setCurrentTipIndex((prev) => (prev + 1) % CREATOR_TIPS.length);
    }, 6500);
    return () => clearInterval(timer);
  }, [showTipsCarousel, isError]);

  const currentTip = CREATOR_TIPS[currentTipIndex];

  // Format mm:ss timer
  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const rem = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${rem.toString().padStart(2, '0')}`;
  };

  return (
    <div className="relative w-full max-w-3xl mx-auto rounded-[32px] border border-white/10 bg-[#0B0D13] p-5 sm:p-8 text-white shadow-2xl space-y-7 font-sans select-none overflow-hidden backdrop-blur-2xl">
      {/* ── TOP AMBIENT WARM RADIAL GLOW (PURE ORANGE / AMBER, STRICT ZERO BLUE) ── */}
      <div
        className="pointer-events-none absolute -top-32 inset-x-0 h-64 opacity-50 blur-3xl"
        style={{
          background: 'radial-gradient(ellipse at 50% 0%, rgba(255, 87, 34, 0.35), rgba(255, 160, 0, 0.15), transparent 75%)',
        }}
      />

      {/* ── HEADER ROW: BADGES & CANCEL / RESET ── */}
      <div className="relative flex items-center justify-between gap-3 border-b border-white/[0.08] pb-4">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[#FF5722] via-[#FF7043] to-[#FFA000] text-black font-black shadow-md shadow-[#FF5722]/30">
            <Film size={17} />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-black text-white tracking-tight truncate">{modeLabel}</span>
              <span
                className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider border ${
                  isError
                    ? 'bg-red-500/10 border-red-500/30 text-red-400'
                    : 'bg-[#FF5722]/10 border-[#FF5722]/30 text-[#FFA000]'
                }`}
              >
                {!isError && <Loader2 size={10} className="animate-spin text-[#FF5722]" />}
                <span>{isError ? 'Interrupted' : 'Cloud Production Active'}</span>
              </span>
            </div>
            <p className="text-[11px] text-zinc-400 truncate mt-0.5">
              1080p Full HD · 30 FPS · AWS Lambda Cloud Node
            </p>
          </div>
        </div>

        {/* Action button: Cancel or Reset */}
        <div className="shrink-0 flex items-center gap-2">
          {!isError && onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="text-xs font-semibold text-zinc-400 hover:text-red-400 transition border border-white/10 hover:border-red-500/30 rounded-xl px-3 py-1.5 cursor-pointer bg-white/[0.03] active:scale-95"
            >
              {cancelLabel}
            </button>
          )}

          {isError && onReset && (
            <button
              type="button"
              onClick={onReset}
              className="inline-flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 px-3 py-1.5 text-xs font-bold text-zinc-300 hover:text-white transition cursor-pointer active:scale-95"
            >
              <RotateCcw size={12} />
              <span>Reset Studio</span>
            </button>
          )}
        </div>
      </div>

      {/* ── MAIN SHOWCASE: GLOWING APERTURE RING & LIVE METRICS ── */}
      {!isError ? (
        <div className="relative rounded-2xl border border-white/[0.08] bg-[#12151F]/70 p-5 sm:p-7 space-y-6 text-center shadow-inner overflow-hidden">
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
            <div className="relative flex h-24 w-24 sm:h-28 sm:w-28 flex-col items-center justify-center rounded-full bg-gradient-to-b from-[#181B26] to-[#0E1017] border border-white/10 shadow-xl">
              <span className="font-mono text-2xl sm:text-3xl font-black text-white tracking-tight">
                {isIndeterminate ? (
                  <Loader2 size={26} className="animate-spin text-[#FF7043]" />
                ) : (
                  `${normalizedProgress}%`
                )}
              </span>
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#FFA000]">
                {normalizedProgress >= 90 ? 'Finishing' : normalizedProgress >= 40 ? 'Composing' : 'Ingesting'}
              </span>
            </div>
          </div>

          {/* Current Message & Status Headline */}
          <div className="space-y-1.5 max-w-lg mx-auto">
            <h3 className="text-base sm:text-lg font-black text-white tracking-normal">
              {title || 'Rendering Your Faceless Video'}
            </h3>
            <p className="text-xs sm:text-sm text-zinc-300 font-medium leading-relaxed">
              {statusMessage || subtitle || 'Our cloud engine is aligning scene beats, pairing cinematic visuals, and mastering audio.'}
            </p>
          </div>

          {/* Dynamic Audio Waveform Equalizer (16 Flame Orange / Amber Bars) */}
          <div className="flex items-center justify-center gap-1.5 h-8 py-1">
            {[45, 80, 60, 95, 30, 75, 100, 50, 85, 40, 90, 65, 35, 70, 90, 55].map((heightPct, idx) => (
              <span
                key={idx}
                className="w-1 sm:w-1.5 rounded-full bg-gradient-to-t from-[#FF5722] to-[#FFA000] shadow-[0_0_8px_rgba(255,87,34,0.4)]"
                style={{
                  height: `${Math.max(6, Math.round((heightPct / 100) * 28))}px`,
                  animation: `bounceEqualizer 1.2s ease-in-out infinite alternate`,
                  animationDelay: `${idx * 0.08}s`,
                }}
              />
            ))}
          </div>

          {/* Dual Timing Pill: Elapsed + Estimated Remaining */}
          <div className="flex flex-wrap items-center justify-center gap-2.5 pt-1">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/40 px-3.5 py-1.5 text-[11px] font-bold text-zinc-300 shadow-sm">
              <Clock size={12} className="text-[#FF7043] animate-pulse" />
              <span>
                Elapsed: <span className="font-mono text-white">{formatTime(elapsedSeconds)}</span>
              </span>
              <span className="text-zinc-600">•</span>
              <span>
                Est. Remaining:{' '}
                <span className="text-[#FFA000] font-extrabold">
                  {estimatedRemainingSeconds !== null && estimatedRemainingSeconds !== undefined
                    ? `~${estimatedRemainingSeconds}s`
                    : 'Calculating...'}
                </span>
              </span>
            </div>

            <div className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1.5 text-[11px] font-bold text-emerald-400">
              <ShieldCheck size={13} />
              <span>Fail-Safe Cloud Render</span>
            </div>
          </div>
        </div>
      ) : (
        /* ── INTERRUPTED ERROR RECOVERY CONTAINER ── */
        <div className="relative rounded-2xl border border-red-500/30 bg-red-950/20 p-5 sm:p-7 space-y-5 text-center shadow-inner">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-red-500/30 bg-red-500/10 text-red-400 shadow-lg shadow-red-500/10">
            <AlertCircle size={28} />
          </div>

          <div className="space-y-1.5 max-w-md mx-auto">
            <h3 className="text-lg font-black text-white">Rendering Connection Interrupted</h3>
            <p className="text-xs text-red-200 leading-relaxed font-medium">
              {errorMessage || statusMessage || 'Failed to complete cloud rendering. Your original upload is safe and no credits were consumed.'}
            </p>
          </div>

          {/* Reassuring Safety Banner */}
          <div className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-black/40 px-4 py-2 text-xs text-zinc-300">
            <Zap size={14} className="text-[#FFA000]" />
            <span>Zero credits deducted for interrupted or failed render attempts.</span>
          </div>

          {/* Action Buttons: Retry vs Return */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            {onRetry && (
              <button
                type="button"
                onClick={onRetry}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#FF5722] via-[#FF7043] to-[#FFA000] px-6 py-3 text-xs font-black text-black shadow-lg shadow-orange-500/25 transition hover:brightness-110 active:scale-95 cursor-pointer"
              >
                <RotateCcw size={14} />
                <span>Retry Generation Now</span>
              </button>
            )}

            {onReset && (
              <button
                type="button"
                onClick={onReset}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 px-5 py-3 text-xs font-bold text-zinc-200 transition cursor-pointer active:scale-95"
              >
                <span>Edit Media &amp; Storyboard</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* ── LINEAR PROGRESS TRACK ── */}
      {!isError && (
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-bold px-0.5">
            <span className="flex items-center gap-2 text-zinc-300">
              <span className="h-2 w-2 rounded-full bg-[#FF5722] animate-pulse" />
              <span>
                Stage {computedActiveStepIndex + 1} of {steps.length}:{' '}
                <span className="text-white font-black">{steps[computedActiveStepIndex]?.label}</span>
              </span>
            </span>
            <span className="font-mono text-sm font-black text-[#FFA000]">
              {normalizedProgress}%
            </span>
          </div>

          <div className="relative h-2.5 w-full overflow-hidden rounded-full bg-black/60 border border-white/10">
            {isIndeterminate ? (
              <div className="h-full w-1/3 bg-gradient-to-r from-[#FF5722] via-[#FF7043] to-[#FFA000] rounded-full animate-[indeterminate_1.5s_infinite_linear]" />
            ) : (
              <div
                className="h-full bg-gradient-to-r from-[#FF5722] via-[#FF7043] to-[#FFA000] rounded-full transition-all duration-500 shadow-[0_0_12px_rgba(255,87,34,0.6)]"
                style={{ width: `${Math.max(4, normalizedProgress)}%` }}
              />
            )}
          </div>
        </div>
      )}

      {/* ── CINEMATIC 4-STAGE PIPELINE TRACKER ── */}
      <div className="space-y-3 pt-1 border-t border-white/[0.08]">
        <div className="flex items-center justify-between text-xs font-black uppercase tracking-wider text-zinc-400">
          <span>Production Pipeline</span>
          <span className="text-[11px] font-bold text-[#FFA000]">
            {isError ? 'Paused' : `${computedActiveStepIndex + 1}/${steps.length} Steps Active`}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {steps.map((step, idx) => {
            const isCompleted = !isError && (computedActiveStepIndex > idx || normalizedProgress >= (step.threshold ? step.threshold * 100 : 98));
            const isActive = !isError && computedActiveStepIndex === idx && !isCompleted;
            const Icon = step.icon || (idx === 0 ? Upload : idx === 1 ? Mic : idx === 2 ? Layers : Film);

            return (
              <div
                key={step.label}
                className={`flex items-center justify-between rounded-2xl p-3.5 border transition-all ${
                  isCompleted
                    ? 'border-emerald-500/25 bg-emerald-500/[0.06] text-zinc-200'
                    : isActive
                    ? 'border-[#FF5722]/50 bg-[#FF5722]/10 text-white shadow-md shadow-[#FF5722]/10 ring-1 ring-[#FF5722]/20'
                    : 'border-white/[0.06] bg-[#141722]/40 text-zinc-500'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border ${
                      isCompleted
                        ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400'
                        : isActive
                        ? 'border-[#FF5722]/40 bg-[#FF5722]/20 text-[#FFA000]'
                        : 'border-white/5 bg-white/[0.02] text-zinc-500'
                    }`}
                  >
                    {isCompleted ? (
                      <CheckCircle2 size={16} />
                    ) : isActive ? (
                      <Loader2 size={15} className="animate-spin text-[#FF5722]" />
                    ) : (
                      <Icon size={14} />
                    )}
                  </div>
                  <div className="min-w-0">
                    <p
                      className={`text-xs font-bold truncate ${
                        isActive ? 'text-white font-extrabold' : isCompleted ? 'text-zinc-200' : 'text-zinc-400'
                      }`}
                    >
                      {step.label}
                    </p>
                    <p className="text-[10px] text-zinc-400 truncate mt-0.5">{step.detail}</p>
                  </div>
                </div>

                <span
                  className={`text-[9px] font-black uppercase tracking-wider shrink-0 ml-2 px-2 py-0.5 rounded-full border ${
                    isCompleted
                      ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                      : isActive
                      ? 'bg-[#FF5722]/20 border-[#FF5722]/40 text-[#FFA000]'
                      : 'bg-white/[0.03] border-white/5 text-zinc-500'
                  }`}
                >
                  {isCompleted ? 'Done' : isActive ? 'Active' : 'Queued'}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── ROTATING CREATOR TIPS & YOUTUBE RETENTION INSIGHTS CAROUSEL ── */}
      {showTipsCarousel && !isError && (
        <div className="rounded-2xl border border-orange-500/20 bg-gradient-to-r from-orange-500/[0.08] via-amber-500/[0.04] to-transparent p-4 space-y-2">
          <div className="flex items-center justify-between">
            <div className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider text-[#FFA000]">
              <Sparkles size={12} className="text-[#FF5722]" />
              <span>{currentTip.kicker}</span>
            </div>
            <button
              type="button"
              onClick={() => setCurrentTipIndex((prev) => (prev + 1) % CREATOR_TIPS.length)}
              className="text-[10px] font-bold text-zinc-400 hover:text-white transition cursor-pointer flex items-center gap-1"
            >
              <span>Next Tip</span>
              <ChevronRight size={12} />
            </button>
          </div>

          <p className="text-xs text-zinc-200 leading-relaxed font-medium transition-all duration-300">
            "{currentTip.tip}"
          </p>

          <div className="flex items-center justify-between pt-1">
            <span className="text-[10px] font-bold text-zinc-400">{currentTip.author}</span>
            <div className="flex items-center gap-1">
              {CREATOR_TIPS.map((_, i) => (
                <span
                  key={i}
                  className={`h-1 rounded-full transition-all ${
                    i === currentTipIndex ? 'w-4 bg-[#FF5722]' : 'w-1 bg-white/20'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
