'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Upload,
  Sparkles,
  Type,
  Download,
  Play,
  Pause,
  CheckCircle2,
  Film,
  Zap,
  Layers,
  ArrowRight,
  Clock,
  Volume2,
  Sliders,
  Check,
} from 'lucide-react';

const PIPELINE_STEPS = [
  {
    id: 1,
    number: '01',
    title: 'Smart Ingest',
    subtitle: 'Upload Audio or Note',
    icon: Upload,
    badge: 'Step 1',
  },
  {
    id: 2,
    number: '02',
    title: 'AI Scene Director',
    subtitle: 'Semantic B-Roll Matching',
    icon: Sparkles,
    badge: 'Step 2',
  },
  {
    id: 3,
    number: '03',
    title: 'Kinetic Typography',
    subtitle: 'Word-Sync Karaoke',
    icon: Type,
    badge: 'Step 3',
  },
  {
    id: 4,
    number: '04',
    title: '1080p Cloud Export',
    subtitle: '30 FPS Serverless Render',
    icon: Download,
    badge: 'Step 4',
  },
];

export default function InteractiveStudioPipeline() {
  const [activeStep, setActiveStep] = useState<number>(1);
  const [isAutoPlaying, setIsAutoPlaying] = useState<boolean>(true);
  const [waveformPlaying, setWaveformPlaying] = useState<boolean>(true);
  const [activeWordIndex, setActiveWordIndex] = useState<number>(2);

  // Auto-advance loop (pauses if user clicked a step)
  useEffect(() => {
    if (!isAutoPlaying) return;
    const interval = setInterval(() => {
      setActiveStep((prev) => (prev % 4) + 1);
    }, 6000);
    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  // Word-level karaoke cycle for Step 3
  useEffect(() => {
    if (activeStep !== 3) return;
    const interval = setInterval(() => {
      setActiveWordIndex((prev) => (prev + 1) % 7);
    }, 550);
    return () => clearInterval(interval);
  }, [activeStep]);

  const handleStepClick = (stepId: number) => {
    setActiveStep(stepId);
    setIsAutoPlaying(false);
  };

  return (
    <section className="relative border-b border-stone-200/80 bg-white px-4 py-16 sm:px-6 sm:py-24 overflow-hidden text-slate-900">
      {/* Subtle Studio Ambient Aura */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/3 -translate-x-1/2 -translate-y-1/2 h-[500px] w-[950px] rounded-full opacity-40 blur-3xl"
        style={{
          background:
            'radial-gradient(ellipse 60% 50% at 50% 50%, rgba(249, 115, 22, 0.12) 0%, rgba(217, 119, 6, 0.05) 45%, transparent 75%)',
        }}
      />

      <div className="relative z-10 mx-auto max-w-7xl">
        {/* Confident Section Title (Zero Eyebrow Pill Badge per Rule 9.2) */}
        <div className="mx-auto max-w-3xl text-center space-y-3">
          <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-slate-900 font-sans">
            Simple 4-Step Creation.{' '}
            <span className="bg-gradient-to-r from-orange-600 via-amber-600 to-orange-500 bg-clip-text text-transparent">
              Zero Timeline Lag.
            </span>
          </h2>
          <p className="text-sm sm:text-base leading-relaxed text-slate-600 max-w-2xl mx-auto">
            Click any stage below to inspect how Itnavideo transforms raw voice recordings into studio-quality 1080p videos in under 2 minutes.
          </p>
        </div>

        {/* ───────────────────────────────────────────────────────────── */}
        {/* THE INTERACTIVE 4-STAGE PIPELINE TRACK                        */}
        {/* ───────────────────────────────────────────────────────────── */}
        <div className="mt-10 sm:mt-14 max-w-5xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 sm:gap-4 p-1.5 sm:p-2 rounded-2xl sm:rounded-3xl bg-slate-100/90 border border-slate-200 shadow-inner">
            {PIPELINE_STEPS.map((step) => {
              const isActive = activeStep === step.id;
              const Icon = step.icon;

              return (
                <button
                  key={step.id}
                  type="button"
                  onClick={() => handleStepClick(step.id)}
                  className={`group relative text-left rounded-xl sm:rounded-2xl p-3 sm:p-4.5 transition-all duration-200 cursor-pointer flex flex-col justify-between ${
                    isActive
                      ? 'bg-white text-slate-900 shadow-md ring-2 ring-orange-500/20'
                      : 'hover:bg-white/70 text-slate-600'
                  }`}
                >
                  <div className="flex items-center justify-between w-full mb-2 sm:mb-3">
                    <div
                      className={`flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-xl border transition-colors ${
                        isActive
                          ? 'bg-orange-500 text-white border-orange-500 shadow-sm'
                          : 'bg-white border-slate-200 text-slate-500 group-hover:border-orange-300'
                      }`}
                    >
                      <Icon size={16} strokeWidth={2.2} />
                    </div>
                    <span
                      className={`font-mono text-[10px] sm:text-xs font-black px-2 py-0.5 rounded-full ${
                        isActive ? 'bg-orange-50 text-orange-600 border border-orange-200' : 'text-slate-400'
                      }`}
                    >
                      {step.number}
                    </span>
                  </div>

                  <div>
                    <h3 className={`text-xs sm:text-sm font-black transition-colors ${
                      isActive ? 'text-slate-950' : 'text-slate-800'
                    }`}>
                      {step.title}
                    </h3>
                    <p className="text-[11px] text-slate-400 hidden sm:block truncate mt-0.5">
                      {step.subtitle}
                    </p>
                  </div>

                  {/* Active bottom neon bar */}
                  {isActive && (
                    <div className="absolute -bottom-1 left-4 right-4 h-0.5 rounded-full bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 shadow-[0_0_8px_rgba(249,115,22,0.8)]" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* ───────────────────────────────────────────────────────────── */}
        {/* DYNAMIC LIVE INTERACTIVE CONSOLE STAGE                        */}
        {/* ───────────────────────────────────────────────────────────── */}
        <div className="mt-6 sm:mt-8 max-w-5xl mx-auto">
          <div className="rounded-3xl border border-slate-200/90 bg-white shadow-xl shadow-slate-200/50 overflow-hidden">
            
            {/* Top Chrome Toolbar */}
            <div className="flex items-center justify-between px-4 sm:px-6 py-3 border-b border-slate-100 bg-slate-50/70 text-xs text-slate-500">
              <div className="flex items-center gap-2">
                <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="font-mono font-bold text-slate-700 uppercase tracking-wider text-[11px]">
                  Stage {activeStep} of 4 &bull; {PIPELINE_STEPS[activeStep - 1].title}
                </span>
              </div>

              <div className="flex items-center gap-2 sm:gap-4 font-mono text-[11px] text-slate-400">
                <span className="hidden sm:inline">Engine: AWS Lambda + Groq</span>
                <span className="text-orange-600 font-bold bg-orange-50 px-2 py-0.5 rounded border border-orange-200">
                  30 FPS Full HD
                </span>
              </div>
            </div>

            {/* ── STAGE 1: SMART INGEST (Waveform & File Dropzone) ── */}
            {activeStep === 1 && (
              <div className="p-6 sm:p-10 space-y-6 animate-in fade-in duration-200">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-wider text-orange-600 bg-orange-50 px-2 py-0.5 rounded-full border border-orange-200">
                      Step 1 &bull; Audio Ingest
                    </span>
                    <h3 className="text-xl sm:text-2xl font-black text-slate-900 mt-1">
                      Upload Any Voiceover, Podcast or Audio Note
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-500 mt-1">
                      MP3, WAV, M4A up to 5 minutes. Speech is transcribed with millisecond accuracy via Groq Whisper.
                    </p>
                  </div>

                  <div className="flex items-center gap-2 self-start sm:self-auto">
                    <span className="text-xs font-mono font-bold text-slate-600 bg-slate-100 px-3 py-1.5 rounded-xl border border-slate-200">
                      02:45 / 300s Max
                    </span>
                  </div>
                </div>

                {/* Animated Waveform Visualizer Console */}
                <div className="rounded-2xl border border-slate-200 bg-slate-900 p-5 sm:p-6 text-white space-y-4 shadow-inner">
                  <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setWaveformPlaying(!waveformPlaying)}
                        className="h-7 w-7 rounded-lg bg-orange-500 hover:bg-orange-600 text-white flex items-center justify-center transition"
                      >
                        {waveformPlaying ? <Pause size={13} /> : <Play size={13} className="ml-0.5" />}
                      </button>
                      <span className="font-bold text-white">founder_voiceover_raw.mp3</span>
                      <span className="text-slate-500 hidden sm:inline">&bull; 48 kHz PCM Stereo</span>
                    </div>

                    <span className="text-amber-400 font-black">01:14 / 02:45</span>
                  </div>

                  {/* 36 Dynamic Frequency Bars */}
                  <div className="h-16 flex items-center justify-between gap-1 sm:gap-1.5 px-2">
                    {[
                      35, 65, 85, 45, 95, 30, 75, 60, 90, 100, 50, 70, 85, 40, 95, 60,
                      80, 55, 90, 75, 35, 60, 85, 50, 95, 70, 40, 65, 80, 55, 90, 45,
                      70, 85, 35, 60
                    ].map((height, i) => (
                      <div
                        key={i}
                        className={`w-full rounded-full transition-all duration-300 ${
                          i < 18 ? 'bg-gradient-to-t from-orange-600 to-amber-400' : 'bg-slate-700/80'
                        }`}
                        style={{
                          height: waveformPlaying ? `${height}%` : '20%',
                          opacity: i < 18 ? 1 : 0.45,
                        }}
                      />
                    ))}
                  </div>

                  {/* Audio Processing Safeguards */}
                  <div className="flex flex-wrap items-center gap-2 sm:gap-3 pt-2 border-t border-slate-800 text-[11px] text-slate-400 font-medium">
                    <span className="flex items-center gap-1 text-emerald-400 font-bold">
                      <Check size={13} strokeWidth={3} /> Silences &gt; 0.4s Trimmed
                    </span>
                    <span className="text-slate-600">&bull;</span>
                    <span className="flex items-center gap-1 text-emerald-400 font-bold">
                      <Check size={13} strokeWidth={3} /> Retakes Removed
                    </span>
                    <span className="text-slate-600">&bull;</span>
                    <span className="flex items-center gap-1 text-emerald-400 font-bold">
                      <Check size={13} strokeWidth={3} /> -14 LUFS Broadcast Level
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* ── STAGE 2: AI SCENE DIRECTOR (Multi-Scene Storyboard) ── */}
            {activeStep === 2 && (
              <div className="p-6 sm:p-10 space-y-6 animate-in fade-in duration-200">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-wider text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                      Step 2 &bull; Scene Direction
                    </span>
                    <h3 className="text-xl sm:text-2xl font-black text-slate-900 mt-1">
                      Autonomous Semantic Storyboarding &amp; B-Roll
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-500 mt-1">
                      Our AI understands sentence intent, planning cuts every 3.5 to 5.5 seconds with zero frozen frames.
                    </p>
                  </div>

                  <div className="flex items-center gap-2 self-start sm:self-auto">
                    <span className="text-xs font-mono font-bold text-amber-700 bg-amber-50 px-3 py-1.5 rounded-xl border border-amber-200">
                      3.8s Avg Scene Cut
                    </span>
                  </div>
                </div>

                {/* 3 Storyboard Scene Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Scene 1 */}
                  <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4 space-y-3 shadow-xs">
                    <div className="flex items-center justify-between text-[11px] font-bold text-slate-400 font-mono">
                      <span className="text-orange-600 bg-orange-50 px-2 py-0.5 rounded border border-orange-200">
                        Scene 01
                      </span>
                      <span>0.0s &ndash; 3.8s</span>
                    </div>
                    <div className="h-28 rounded-xl bg-slate-900 flex flex-col items-center justify-center p-3 text-center text-white relative overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                      <span className="relative text-xs font-black uppercase text-amber-400 tracking-wider">
                        Growth Metric Callout
                      </span>
                      <span className="relative text-[10px] text-slate-300 mt-1 line-clamp-2">
                        &ldquo;Most founders struggle with consistency...&rdquo;
                      </span>
                      <span className="relative mt-2 text-[9px] font-mono bg-white/20 px-2 py-0.5 rounded text-white">
                        +15% Saturation B-Roll
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-600 font-medium">
                      Matched to animated metric chart &amp; camera zoom punch.
                    </p>
                  </div>

                  {/* Scene 2 */}
                  <div className="rounded-2xl border border-orange-500/40 bg-orange-50/20 p-4 space-y-3 shadow-xs ring-1 ring-orange-500/20">
                    <div className="flex items-center justify-between text-[11px] font-bold text-slate-400 font-mono">
                      <span className="text-orange-600 bg-orange-50 px-2 py-0.5 rounded border border-orange-200">
                        Scene 02 (Active)
                      </span>
                      <span>3.8s &ndash; 7.6s</span>
                    </div>
                    <div className="h-28 rounded-xl bg-slate-900 flex flex-col items-center justify-center p-3 text-center text-white relative overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                      <span className="relative text-xs font-black uppercase text-orange-400 tracking-wider">
                        Executive UI Walkthrough
                      </span>
                      <span className="relative text-[10px] text-slate-300 mt-1 line-clamp-2">
                        &ldquo;Spend 10 minutes creating instead of editing...&rdquo;
                      </span>
                      <span className="relative mt-2 text-[9px] font-mono bg-orange-500/40 border border-orange-400/50 px-2 py-0.5 rounded text-white">
                        78% Frame Ken Burns
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-700 font-bold">
                      Continuous 5% slow zoom-in to prevent canvas freeze.
                    </p>
                  </div>

                  {/* Scene 3 */}
                  <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4 space-y-3 shadow-xs">
                    <div className="flex items-center justify-between text-[11px] font-bold text-slate-400 font-mono">
                      <span className="text-orange-600 bg-orange-50 px-2 py-0.5 rounded border border-orange-200">
                        Scene 03
                      </span>
                      <span>7.6s &ndash; 11.4s</span>
                    </div>
                    <div className="h-28 rounded-xl bg-slate-900 flex flex-col items-center justify-center p-3 text-center text-white relative overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                      <span className="relative text-xs font-black uppercase text-emerald-400 tracking-wider">
                        Core Thesis Punch
                      </span>
                      <span className="relative text-[10px] text-slate-300 mt-1 line-clamp-2">
                        &ldquo;Studio-ready 1080p video ready to publish.&rdquo;
                      </span>
                      <span className="relative mt-2 text-[9px] font-mono bg-white/20 px-2 py-0.5 rounded text-white">
                        Swoosh Transition SFX
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-600 font-medium">
                      Acoustic J-cut overlap with ducked background music.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* ── STAGE 3: KINETIC TYPOGRAPHY (Word-Sync Subtitles) ── */}
            {activeStep === 3 && (
              <div className="p-6 sm:p-10 space-y-6 animate-in fade-in duration-200">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-wider text-orange-600 bg-orange-50 px-2 py-0.5 rounded-full border border-orange-200">
                      Step 3 &bull; Kinetic Typography
                    </span>
                    <h3 className="text-xl sm:text-2xl font-black text-slate-900 mt-1">
                      Word-by-Word Karaoke Synchronization
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-500 mt-1">
                      Words light up on spoken audio peaks. Dual-font system pairs bold hooks with crystal-clear reading.
                    </p>
                  </div>

                  <div className="flex items-center gap-2 self-start sm:self-auto">
                    <span className="text-xs font-mono font-bold text-orange-700 bg-orange-50 px-3 py-1.5 rounded-xl border border-orange-200">
                      32 Caption Themes
                    </span>
                  </div>
                </div>

                {/* Live Kinetic Word Simulator Strip */}
                <div className="rounded-2xl border border-slate-200 bg-slate-950 p-8 sm:p-12 text-center text-white space-y-6 shadow-inner">
                  <div className="text-[11px] font-mono font-bold text-slate-400 uppercase tracking-widest">
                    LIVE KARAOKE PREVIEW &bull; GLOW VIRAL THEME
                  </div>

                  {/* Cycling Words */}
                  <div className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-snug flex flex-wrap items-center justify-center gap-3 sm:gap-4 max-w-3xl mx-auto font-sans">
                    {[
                      'Create',
                      'High-Retention',
                      'Videos',
                      'Without',
                      'Showing',
                      'Your',
                      'Face',
                    ].map((word, idx) => {
                      const isCurrent = idx === activeWordIndex;
                      return (
                        <span
                          key={word}
                          className={`transition-all duration-200 ${
                            isCurrent
                              ? 'text-amber-300 scale-110 drop-shadow-[0_0_20px_rgba(252,211,77,0.9)] bg-amber-400/20 px-2 py-0.5 rounded-lg'
                              : idx < activeWordIndex
                              ? 'text-white'
                              : 'text-slate-500 opacity-60'
                          }`}
                        >
                          {word}
                        </span>
                      );
                    })}
                  </div>

                  {/* Typography Details */}
                  <div className="flex flex-wrap items-center justify-center gap-3 pt-4 border-t border-slate-800 text-xs font-mono text-slate-400">
                    <span>Font 1: <strong className="text-white">Montserrat Bold</strong></span>
                    <span>&bull;</span>
                    <span>Font 2: <strong className="text-white">Plus Jakarta Sans</strong></span>
                    <span>&bull;</span>
                    <span className="text-emerald-400">Title-Safe 96px Inset Enforced</span>
                  </div>
                </div>
              </div>
            )}

            {/* ── STAGE 4: 1080P CLOUD EXPORT (Download & Share) ── */}
            {activeStep === 4 && (
              <div className="p-6 sm:p-10 space-y-6 animate-in fade-in duration-200">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-wider text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                      Step 4 &bull; Cloud Render
                    </span>
                    <h3 className="text-xl sm:text-2xl font-black text-slate-900 mt-1">
                      1080p Master MP4 Exported on AWS Lambda
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-500 mt-1">
                      Parallel headless Chromium workers render 30 FPS progressive video in under 90 seconds. Zero laptop heating.
                    </p>
                  </div>

                  <div className="flex items-center gap-2 self-start sm:self-auto">
                    <span className="text-xs font-mono font-bold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200 flex items-center gap-1.5">
                      <CheckCircle2 size={13} />
                      Render Complete &bull; 84s
                    </span>
                  </div>
                </div>

                {/* Master Render Specs Dashboard */}
                <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-6 space-y-5">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                    <div className="bg-white p-3 rounded-xl border border-slate-200/80 shadow-xs">
                      <p className="text-[11px] font-bold text-slate-400 font-mono">RESOLUTION</p>
                      <p className="text-sm sm:text-base font-black text-slate-900 mt-0.5">1920 &times; 1080</p>
                    </div>
                    <div className="bg-white p-3 rounded-xl border border-slate-200/80 shadow-xs">
                      <p className="text-[11px] font-bold text-slate-400 font-mono">FRAME RATE</p>
                      <p className="text-sm sm:text-base font-black text-slate-900 mt-0.5">30 FPS Progressive</p>
                    </div>
                    <div className="bg-white p-3 rounded-xl border border-slate-200/80 shadow-xs">
                      <p className="text-[11px] font-bold text-slate-400 font-mono">AUDIO CODEC</p>
                      <p className="text-sm sm:text-base font-black text-slate-900 mt-0.5">AAC 192 kbps</p>
                    </div>
                    <div className="bg-white p-3 rounded-xl border border-slate-200/80 shadow-xs">
                      <p className="text-[11px] font-bold text-slate-400 font-mono">CLOUD SPEED</p>
                      <p className="text-sm sm:text-base font-black text-emerald-600 mt-0.5">84 Seconds</p>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-200">
                    <div className="flex items-center gap-2 text-xs font-medium text-slate-600">
                      <Clock size={14} className="text-orange-500" />
                      <span>Secure 48-Hour Download Vault with S3 Presigned URL</span>
                    </div>

                    <Link
                      href="/dashboard"
                      className="inline-flex items-center justify-center gap-2 rounded-xl bg-orange-600 hover:bg-orange-700 px-6 py-2.5 text-xs sm:text-sm font-bold text-white shadow-sm transition cursor-pointer w-full sm:w-auto"
                    >
                      <Download size={15} />
                      <span>Create &amp; Download Free</span>
                    </Link>
                  </div>
                </div>
              </div>
            )}

          </div>
        </div>

        {/* Bottom Fast Action Prompt */}
        <div className="mt-8 text-center">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-orange-600 hover:text-orange-700 transition group cursor-pointer"
          >
            <span>Ready to experience the 4-step workflow live?</span>
            <span className="underline decoration-orange-500 decoration-2 underline-offset-4">Open Studio Free</span>
            <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </section>
  );
}

