'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Sparkles,
  Play,
  ArrowRight,
  CheckCircle2,
  Video,
  Film,
  Mic,
  BookOpen,
  Scissors,
} from 'lucide-react';

interface StudioOption {
  id: string;
  name: string;
  shortLabel: string;
  buttonLabel: string;
  icon: React.ElementType;
}

const HERO_STUDIO_OPTIONS: StudioOption[] = [
  {
    id: 'facelessVideo',
    name: '16:9 YouTube Faceless Video',
    shortLabel: '16:9 YouTube',
    buttonLabel: 'Create 16:9 Video',
    icon: Video,
  },
  {
    id: 'autoCaption',
    name: '9:16 Viral Auto Caption Reel',
    shortLabel: '9:16 Viral Reel',
    buttonLabel: 'Create 9:16 Reel',
    icon: Film,
  },
  {
    id: 'bookSummary',
    name: '16:9 Book Summary Video',
    shortLabel: 'Book Summary',
    buttonLabel: 'Create Summary',
    icon: BookOpen,
  },
  {
    id: 'longVideoClips',
    name: '9:16 Long Video to Clips',
    shortLabel: 'Extract Shorts',
    buttonLabel: 'Extract Clips',
    icon: Scissors,
  },
  {
    id: 'audioClean',
    name: 'AI Studio Audio Cleaner',
    shortLabel: 'Clean Audio',
    buttonLabel: 'Clean Studio Audio',
    icon: Mic,
  },
];

export default function Hero() {
  const [selectedMode, setSelectedMode] = useState<string>('facelessVideo');
  const activeStudio = HERO_STUDIO_OPTIONS.find((s) => s.id === selectedMode) || HERO_STUDIO_OPTIONS[0];

  return (
    <section className="relative overflow-hidden border-b border-stone-200/80 bg-gradient-to-b from-[#FFFBF8] via-[#FFF9F5] to-white pt-10 pb-14 sm:pt-16 sm:pb-20 px-4 sm:px-6 lg:px-8 text-slate-900">
      
      {/* ───────────────────────────────────────────────────────────── */}
      {/* ARCHITECTURAL GRID CANVAS WITH SOFT MESH AURAS                */}
      {/* ───────────────────────────────────────────────────────────── */}
      <div
        className="pointer-events-none absolute inset-0 z-0 bg-[linear-gradient(to_right,rgba(0,0,0,0.035)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,0,0,0.035)_1px,transparent_1px)] bg-[size:48px_48px] sm:bg-[size:60px_60px]"
        style={{
          maskImage: 'radial-gradient(ellipse 95% 85% at 50% 35%, black 45%, transparent 95%)',
          WebkitMaskImage: 'radial-gradient(ellipse 95% 85% at 50% 35%, black 45%, transparent 95%)',
        }}
      />

      {/* Multi-Hue Soft Ambient Mesh Auras (Liinks.co style living atmosphere) */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-20 top-0 h-[420px] w-[500px] rounded-full opacity-60 blur-3xl"
        style={{
          backgroundImage: 'radial-gradient(circle, rgba(255, 138, 101, 0.16) 0%, rgba(255, 183, 77, 0.08) 50%, transparent 75%)',
        }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-20 top-10 h-[450px] w-[520px] rounded-full opacity-55 blur-3xl"
        style={{
          backgroundImage: 'radial-gradient(circle, rgba(168, 85, 247, 0.09) 0%, rgba(56, 189, 248, 0.07) 50%, transparent 75%)',
        }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 bottom-0 h-[380px] w-[880px] max-w-full -translate-x-1/2 opacity-75 blur-2xl"
        style={{
          backgroundImage: 'radial-gradient(ellipse 70% 60% at 50% 90%, rgba(255,87,34,0.14) 0%, rgba(255,160,0,0.07) 45%, transparent 80%)',
        }}
      />

      {/* ───────────────────────────────────────────────────────────── */}
      {/* MAIN HERO CONTENT STACK                                       */}
      {/* ───────────────────────────────────────────────────────────── */}
      <div className="relative z-10 mx-auto max-w-5xl text-center">
        
        {/* Kicker Pill - Flame Accent */}
        <div className="mb-4 sm:mb-5 inline-flex items-center gap-2 rounded-full border border-orange-500/30 bg-orange-500/10 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-orange-700 shadow-xs backdrop-blur-xs">
          <Sparkles size={14} className="text-[#FF5722]" />
          <span>10+ Purpose-Built AI Video Studios</span>
        </div>

        {/* High-Impact Headline (Bold Sans-Serif) */}
        <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-[78px] font-black tracking-[-0.03em] text-slate-950 leading-[1.08] max-w-4xl mx-auto font-sans">
          Automate Video Creation{' '}
          <br />
          <span className="bg-gradient-to-r from-[#D84315] via-[#FF5722] to-[#FFA000] bg-clip-text text-transparent">
            with Pure AI
          </span>
        </h1>

        {/* High-Contrast Readable Subtitle */}
        <p className="mx-auto mt-4 sm:mt-5 max-w-2xl text-base sm:text-lg md:text-xl font-medium leading-relaxed text-slate-700 font-sans">
          Turn your voiceovers, audio recordings, or raw video clips into broadcast-ready 16:9 YouTube explainers and viral 9:16 Shorts with automated B-roll, kinetic captions, and studio sound.
        </p>

        {/* ───────────────────────────────────────────────────────────── */}
        {/* INTERACTIVE FLOATING ACTION PILL (Liinks.co style)            */}
        {/* ───────────────────────────────────────────────────────────── */}
        <div className="mt-8 sm:mt-10 mx-auto max-w-2xl">
          <div className="rounded-full border border-stone-300/90 bg-white/95 p-1.5 sm:p-2 shadow-[0_16px_36px_-6px_rgba(255,87,34,0.22)] backdrop-blur-md flex flex-col sm:flex-row items-center gap-2 transition-all hover:border-orange-500/40">
            {/* Host prefix & dropdown */}
            <div className="flex items-center gap-2 px-3 py-1 text-slate-500 text-xs sm:text-sm font-medium w-full sm:w-auto">
              <span className="font-mono text-orange-600 font-black tracking-tight select-none">
                itnavideo.com/
              </span>
              <div className="relative flex-1 sm:flex-initial">
                <select
                  value={selectedMode}
                  onChange={(e) => setSelectedMode(e.target.value)}
                  className="w-full bg-stone-100 hover:bg-stone-200/70 border border-stone-200 text-slate-900 font-bold rounded-full px-3 py-1.5 text-xs sm:text-sm cursor-pointer outline-none focus:ring-2 focus:ring-orange-500/30 transition-colors"
                >
                  {HERO_STUDIO_OPTIONS.map((opt) => (
                    <option key={opt.id} value={opt.id}>
                      {opt.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Glowing Direct CTA Button */}
            <Link
              href={`/dashboard?mode=${selectedMode}`}
              className="w-full sm:w-auto ml-auto inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#FF5722] via-[#F4511E] to-[#E64A19] px-6 sm:px-8 py-3 text-xs sm:text-sm font-black text-white shadow-md hover:brightness-110 hover:scale-[1.02] active:scale-95 transition-all duration-200 shrink-0 cursor-pointer"
            >
              <span>{activeStudio.buttonLabel}</span>
              <ArrowRight size={15} strokeWidth={2.5} />
            </Link>
          </div>

          {/* Quick Studio Selector Chips */}
          <div className="mt-3 flex flex-wrap items-center justify-center gap-1.5 sm:gap-2">
            <span className="text-[11px] font-bold text-slate-400 mr-1 select-none">Quick Jump:</span>
            {HERO_STUDIO_OPTIONS.map((opt) => {
              const isSelected = opt.id === selectedMode;
              const OptIcon = opt.icon;
              return (
                <button
                  key={opt.id}
                  onClick={() => setSelectedMode(opt.id)}
                  className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold transition-all ${
                    isSelected
                      ? 'bg-orange-500/15 border border-orange-500/30 text-orange-700 shadow-2xs'
                      : 'bg-stone-100/80 hover:bg-stone-200/80 border border-stone-200/60 text-slate-600'
                  }`}
                >
                  <OptIcon size={12} className={isSelected ? 'text-[#FF5722]' : 'text-slate-400'} />
                  <span>{opt.shortLabel}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* High-Contrast Trust Indicators */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3 text-xs font-semibold text-slate-700">
          <div className="flex items-center gap-1">
            <span className="text-amber-500 font-black tracking-widest">★★★★★</span>
            <span className="font-extrabold text-slate-900">4.9/5</span>
          </div>
          <span className="text-stone-300">•</span>
          <span>Trusted by <strong className="text-slate-900 font-black">5,000+ Creators</strong> across YouTube &amp; Reels</span>
          <span className="text-stone-300">•</span>
          <span className="text-emerald-700 font-bold flex items-center gap-1">
            <CheckCircle2 size={13} className="text-emerald-600" />
            100% AWS Cloud Render
          </span>
        </div>

      </div>
    </section>
  );
}
