'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Sparkles,
  Layers,
  Mic,
  Sliders,
  ArrowRight,
  Video,
  Film,
  Headphones,
  CheckCircle2,
  Zap,
  Play,
  Volume2,
  Flame,
} from 'lucide-react';

type StudioDockMode = '16x9' | '9x16' | 'audio';

interface StudioDockConfig {
  id: StudioDockMode;
  tabLabel: string;
  tabIcon: React.ElementType;
  badge: string;
  inputTitle: string;
  inputDescription: string;
  inputTag: string;
  outputTitle: string;
  outputDescription: string;
  outputFormat: string;
  dashboardMode: string;
  buttonLabel: string;
}

const DOCK_CONFIGS: StudioDockConfig[] = [
  {
    id: '16x9',
    tabLabel: '16:9 YouTube Cinema Studio',
    tabIcon: Video,
    badge: '16:9 Full HD',
    inputTitle: 'Raw Voiceover Audio (.mp3)',
    inputDescription: '"3 proven rules for building wealth without burning out in 2026..."',
    inputTag: '16kHz Audio Input',
    outputTitle: 'Broadcast-Ready 16:9 YouTube Explainer',
    outputDescription: 'Automated 1080p B-roll matching, chapter lower-thirds & burnt-in kinetic captions.',
    outputFormat: '1920×1080 Widescreen MP4',
    dashboardMode: 'facelessVideo',
    buttonLabel: 'Open 16:9 Cinema Studio',
  },
  {
    id: '9x16',
    tabLabel: '9:16 Viral Shorts Studio',
    tabIcon: Film,
    badge: '9:16 Vertical',
    inputTitle: 'Raw Phone Video or Voice Note',
    inputDescription: '"If you are creating content in 2026, here is the #1 mistake you must avoid..."',
    inputTag: 'Talking Clip or Audio',
    outputTitle: 'High-Retention 9:16 Vertical Reel',
    outputDescription: 'Word-by-word kinetic animated subtitles bouncing with safe-zone margin protection.',
    outputFormat: '1080×1920 Mobile MP4',
    dashboardMode: 'autoCaption',
    buttonLabel: 'Open 9:16 Shorts Studio',
  },
  {
    id: 'audio',
    tabLabel: 'AI Studio Audio Cleaner',
    tabIcon: Headphones,
    badge: 'Utility Studio',
    inputTitle: 'Home Office Audio with Echo & Noise',
    inputDescription: 'Room reverb, ceiling fan hum, and unbalanced microphone levels.',
    inputTag: 'Raw Microphone Track',
    outputTitle: 'Studio-Grade Mastered Audio Track',
    outputDescription: 'Zero background noise, de-reverbed vocal warmth, normalized to -14 LUFS.',
    outputFormat: 'Crystal-Clear WAV / MP3',
    dashboardMode: 'audioClean',
    buttonLabel: 'Open Studio Audio Cleaner',
  },
];

export default function DualFormatEngineShowcase() {
  const [activeDock, setActiveDock] = useState<StudioDockMode>('16x9');
  const current = DOCK_CONFIGS.find((d) => d.id === activeDock) || DOCK_CONFIGS[0];
  const ActiveIcon = current.tabIcon;

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-white via-[#FFFBF9] to-white pt-16 pb-20 sm:pt-20 sm:pb-28 px-4 sm:px-6 lg:px-8 border-t border-stone-200/80">
      {/* ───────────────────────────────────────────────────────────── */}
      {/* SOFT AMBIENT MESH AURA                                        */}
      {/* ───────────────────────────────────────────────────────────── */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-16 top-1/4 h-[440px] w-[520px] rounded-full opacity-55 blur-3xl"
        style={{
          backgroundImage: 'radial-gradient(circle, rgba(56, 189, 248, 0.10) 0%, rgba(99, 102, 241, 0.06) 50%, transparent 75%)',
        }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-16 top-1/3 h-[460px] w-[540px] rounded-full opacity-60 blur-3xl"
        style={{
          backgroundImage: 'radial-gradient(circle, rgba(255, 112, 67, 0.12) 0%, rgba(255, 179, 0, 0.06) 50%, transparent 75%)',
        }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-[450px] w-[800px] max-w-full opacity-65 blur-2xl"
        style={{
          backgroundImage: 'radial-gradient(ellipse 70% 55% at 50% 50%, rgba(255, 138, 101, 0.09) 0%, rgba(168, 85, 247, 0.04) 50%, transparent 75%)',
        }}
      />

      <div className="relative z-10 mx-auto max-w-6xl">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-14">
          <div className="mb-3.5 inline-flex items-center gap-2 rounded-full border border-orange-500/30 bg-orange-500/10 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-orange-700 shadow-xs">
            <Sparkles size={14} className="text-[#FF5722]" />
            <span>Dual-Format AI Video &amp; Audio Engine</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight leading-[1.15] font-sans">
            One Single Upload.{' '}
            <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-[#FF5722] via-[#FF7043] to-[#FFA000] bg-clip-text text-transparent">
              16:9 Cinema, 9:16 Shorts &amp; Studio Audio.
            </span>
          </h2>

          <p className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed font-sans font-medium">
            Feed in your voiceover audio, recorded speech, or raw video clip. Itnavideo intelligently outputs broadcast-ready 16:9 YouTube videos, 9:16 viral Reels, and crystal-clear mastered sound simultaneously.
          </p>
        </div>

        {/* ───────────────────────────────────────────────────────────── */}
        {/* INTERACTIVE "LIVE STUDIO" PREVIEW DOCK (Liinks-style)         */}
        {/* ───────────────────────────────────────────────────────────── */}
        <div className="mb-12 sm:mb-16 rounded-3xl border border-stone-200/90 bg-white/95 p-5 sm:p-8 shadow-[0_12px_36px_-6px_rgba(0,0,0,0.06)] backdrop-blur-md">
          {/* Top Interactive Dock Switcher */}
          <div className="flex items-center justify-center gap-1.5 sm:gap-3 p-1.5 bg-stone-100 rounded-2xl max-w-2xl mx-auto mb-8">
            {DOCK_CONFIGS.map((dock) => {
              const isSelected = dock.id === activeDock;
              const Icon = dock.tabIcon;
              return (
                <button
                  key={dock.id}
                  onClick={() => setActiveDock(dock.id)}
                  className={`flex-1 min-w-0 py-2 sm:py-2.5 px-2 sm:px-4 rounded-xl text-[11px] sm:text-sm font-extrabold flex items-center justify-center gap-1 sm:gap-2 transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-white text-orange-600 shadow-md ring-1 ring-orange-500/20 scale-[1.01]'
                      : 'text-slate-600 hover:text-slate-950 hover:bg-stone-200/60'
                  }`}
                >
                  <Icon size={14} className={isSelected ? 'text-[#FF5722]' : 'text-slate-400'} />
                  <span className="hidden sm:inline">{dock.tabLabel}</span>
                  <span className="sm:hidden truncate">
                    {dock.id === '16x9' ? '16:9 Cinema' : dock.id === '9x16' ? '9:16 Shorts' : 'Audio Tool'}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Interactive Live Flow: Input ➔ AWS Cloud AI Engine ➔ Output */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 items-center">
            {/* 1. INPUT CARD */}
            <div className="lg:col-span-5 rounded-2xl border border-stone-200 bg-stone-50/70 p-5 sm:p-6 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-orange-700 bg-orange-500/10 border border-orange-500/20 px-2 py-0.5 rounded-full">
                  Step 1: Your Media
                </span>
                <span className="text-xs font-bold text-slate-500">{current.inputTag}</span>
              </div>

              <div className="pt-2">
                <h4 className="text-sm sm:text-base font-extrabold text-slate-900">
                  {current.inputTitle}
                </h4>
                <p className="mt-1 text-xs sm:text-sm text-slate-600 italic bg-white border border-stone-200 rounded-xl p-3 shadow-2xs font-serif">
                  {current.inputDescription}
                </p>
              </div>

              {/* Animated audio bars simulation */}
              <div className="flex items-center gap-1.5 pt-2">
                <Volume2 size={14} className="text-orange-500 shrink-0" />
                <div className="flex items-end gap-1 h-5 flex-1">
                  <span className="w-1 bg-orange-400 h-2 rounded-full animate-pulse" />
                  <span className="w-1 bg-orange-500 h-4 rounded-full animate-pulse" />
                  <span className="w-1 bg-amber-500 h-5 rounded-full animate-pulse" />
                  <span className="w-1 bg-orange-500 h-3 rounded-full animate-pulse" />
                  <span className="w-1 bg-orange-400 h-4 rounded-full animate-pulse" />
                  <span className="w-1 bg-amber-400 h-2 rounded-full animate-pulse" />
                  <span className="w-1 bg-orange-500 h-5 rounded-full animate-pulse" />
                  <span className="w-1 bg-orange-400 h-3 rounded-full animate-pulse" />
                </div>
                <span className="text-[10px] font-mono text-slate-400">Audio Ready</span>
              </div>
            </div>

            {/* 2. CONNECTOR ARROW (AWS Cloud AI Transformation) */}
            <div className="lg:col-span-2 flex flex-col items-center justify-center text-center py-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-r from-[#FF5722] to-[#FFA000] text-white shadow-md shadow-orange-500/25">
                <Zap size={18} className="fill-white" />
              </div>
              <span className="text-[11px] font-black uppercase tracking-wider text-orange-600 mt-2">
                AWS Cloud AI
              </span>
              <span className="text-[10px] text-slate-400 font-mono">Zero Laptop Lag</span>
            </div>

            {/* 3. OUTPUT PREVIEW MOCKUP */}
            <div className="lg:col-span-5 rounded-2xl border-2 border-orange-500/30 bg-gradient-to-br from-orange-50/30 to-amber-50/20 p-5 sm:p-6 space-y-3 relative overflow-hidden">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-800 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full flex items-center gap-1">
                  <CheckCircle2 size={11} className="text-emerald-600" />
                  Step 2: Instant Output
                </span>
                <span className="text-xs font-bold text-orange-700 bg-orange-500/10 px-2 py-0.5 rounded-md">
                  {current.outputFormat}
                </span>
              </div>

              <div>
                <h4 className="text-sm sm:text-base font-extrabold text-slate-900">
                  {current.outputTitle}
                </h4>
                <p className="mt-1 text-xs text-slate-600 leading-relaxed font-medium">
                  {current.outputDescription}
                </p>
              </div>

              {/* Action Button inside Dock */}
              <div className="pt-2">
                <Link
                  href={`/dashboard?mode=${current.dashboardMode}`}
                  className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 hover:bg-orange-600 px-5 py-2.5 text-xs font-bold text-white shadow-xs transition-colors"
                >
                  <span>{current.buttonLabel}</span>
                  <ArrowRight size={13} strokeWidth={2.5} />
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Central Infographic Showcase Canvas */}
        <div className="relative mx-auto max-w-5xl w-full bg-white flex justify-center items-center py-2 sm:py-4">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="https://res.cloudinary.com/dhouh9idx/image/upload/v1792945594/file_000000001260821196142e822883f87d_zmpjdg.png"
            alt="ItnaVideo Dual-Format Engine - 16:9 Landscape and 9:16 Vertical Video Creation with Studio Audio Cleaner"
            className="w-full h-auto object-contain max-h-[600px] mx-auto select-none"
            loading="lazy"
            decoding="async"
          />
        </div>

        {/* 4 Feature Value Pillars */}
        <div className="mt-8 sm:mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          <div className="group rounded-2xl border border-stone-200/90 bg-white p-5 sm:p-6 shadow-xs hover:border-orange-500/50 hover:shadow-lg hover:shadow-orange-500/5 transition-all duration-300 hover:-translate-y-1">
            <div className="flex items-center justify-between mb-3.5">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-500/10 border border-orange-500/20 text-orange-600 shrink-0 group-hover:scale-105 transition-transform">
                <Layers size={18} />
              </div>
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-orange-700 bg-orange-500/10 border border-orange-500/20 px-2 py-0.5 rounded-full">
                16:9 &amp; 9:16
              </span>
            </div>
            <h3 className="text-sm sm:text-base font-extrabold text-slate-900 mb-1.5 group-hover:text-orange-600 transition-colors">
              Dual-Format Outputs
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed font-medium">
              Export 16:9 Widescreen (up to 5 min) for YouTube and 9:16 Vertical (up to 90s) for TikTok &amp; Reels in one seamless session.
            </p>
          </div>

          <div className="group rounded-2xl border border-stone-200/90 bg-white p-5 sm:p-6 shadow-xs hover:border-orange-500/50 hover:shadow-lg hover:shadow-orange-500/5 transition-all duration-300 hover:-translate-y-1">
            <div className="flex items-center justify-between mb-3.5">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-500/10 border border-orange-500/20 text-orange-600 shrink-0 group-hover:scale-105 transition-transform">
                <Film size={18} />
              </div>
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-orange-700 bg-orange-500/10 border border-orange-500/20 px-2 py-0.5 rounded-full">
                Audio &amp; Video
              </span>
            </div>
            <h3 className="text-sm sm:text-base font-extrabold text-slate-900 mb-1.5 group-hover:text-orange-600 transition-colors">
              Direct Media Upload
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed font-medium">
              Accepts raw voiceover audio, phone recordings, camera clips, or images. AI adapts speech and builds matching scenes.
            </p>
          </div>

          <div className="group rounded-2xl border border-stone-200/90 bg-white p-5 sm:p-6 shadow-xs hover:border-orange-500/50 hover:shadow-lg hover:shadow-orange-500/5 transition-all duration-300 hover:-translate-y-1">
            <div className="flex items-center justify-between mb-3.5">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-500/10 border border-orange-500/20 text-orange-600 shrink-0 group-hover:scale-105 transition-transform">
                <Mic size={18} />
              </div>
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-700 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">
                Studio Clean
              </span>
            </div>
            <h3 className="text-sm sm:text-base font-extrabold text-slate-900 mb-1.5 group-hover:text-orange-600 transition-colors">
              AI Audio Denoising
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed font-medium">
              Eliminates noisy fan hum, room echo, and unwanted clicks to give you rich, broadcast-grade studio acoustics automatically.
            </p>
          </div>

          <div className="group rounded-2xl border border-stone-200/90 bg-white p-5 sm:p-6 shadow-xs hover:border-orange-500/50 hover:shadow-lg hover:shadow-orange-500/5 transition-all duration-300 hover:-translate-y-1">
            <div className="flex items-center justify-between mb-3.5">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-500/10 border border-orange-500/20 text-orange-600 shrink-0 group-hover:scale-105 transition-transform">
                <Sliders size={18} />
              </div>
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-orange-700 bg-orange-500/10 border border-orange-500/20 px-2 py-0.5 rounded-full">
                Auto Mix
              </span>
            </div>
            <h3 className="text-sm sm:text-base font-extrabold text-slate-900 mb-1.5 group-hover:text-orange-600 transition-colors">
              Smart Auto-Ducking
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed font-medium">
              Background soundtrack automatically dips when your voice starts, keeping voiceovers crisp, clear, and perfectly audible.
            </p>
          </div>
        </div>

        {/* Dual Actions */}
        <div className="mt-10 sm:mt-12 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
          <Link
            href="/dashboard"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#FF5722] via-[#F4511E] to-[#E64A19] px-7 sm:px-9 py-3 sm:py-3.5 text-xs sm:text-sm font-black text-white shadow-[0_12px_28px_-6px_rgba(255,87,34,0.45)] hover:brightness-110 active:scale-95 transition-all"
          >
            <span>Start Creating in Any Format</span>
            <ArrowRight size={15} strokeWidth={2.5} />
          </Link>

          <Link
            href="/dashboard?mode=audioClean"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full border border-stone-300 bg-white px-6 sm:px-7 py-3 sm:py-3.5 text-xs sm:text-sm font-bold text-slate-700 shadow-2xs hover:bg-stone-50 transition-colors"
          >
            <Headphones size={15} className="text-[#FF5722]" />
            <span>Try AI Studio Audio Cleaner</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
