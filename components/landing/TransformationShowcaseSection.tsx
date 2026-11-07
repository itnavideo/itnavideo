'use client';

import React from 'react';
import { getOptimizedCloudinaryUrl } from '@/lib/utils';
import Link from 'next/link';
import { Sparkles, CheckCircle2, ArrowRight, Zap, UploadCloud } from 'lucide-react';

export default function TransformationShowcaseSection() {
  return (
    <section className="relative overflow-hidden bg-white pt-12 pb-16 sm:pt-16 sm:pb-24 px-4 sm:px-6 lg:px-8 border-b border-slate-100">
      {/* Soft Multi-Hue Ambient Mesh Auras */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-10 top-1/4 h-[420px] w-[500px] rounded-full opacity-50 blur-3xl"
        style={{
          background: 'radial-gradient(circle, rgba(0, 102, 255, 0.10) 0%, rgba(59, 130, 246, 0.05) 50%, transparent 75%)',
        }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-10 top-1/3 h-[450px] w-[520px] rounded-full opacity-50 blur-3xl"
        style={{
          background: 'radial-gradient(circle, rgba(168, 85, 247, 0.07) 0%, rgba(56, 189, 248, 0.06) 50%, transparent 75%)',
        }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-[450px] w-[750px] max-w-full opacity-60 blur-2xl"
        style={{
          background: 'radial-gradient(ellipse 65% 55% at 50% 50%, rgba(0, 102, 255, 0.08) 0%, rgba(37, 99, 235, 0.04) 45%, transparent 75%)',
        }}
      />

      <div className="relative z-10 mx-auto max-w-6xl">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-12">
          <h2 className="text-3xl sm:text-5xl font-black text-zinc-950 tracking-[-0.03em] leading-[1.12] font-sans">
            From Video Editing Frustration{' '}
            <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 bg-clip-text text-transparent">
              to Instant AI Creation
            </span>
          </h2>

          <p className="mt-3 sm:mt-5 text-sm sm:text-lg text-slate-600 leading-relaxed font-sans font-medium">
            <span className="hidden sm:inline">
              No complex timelines, no bloated plugins, and zero video editing skills needed.
              Just upload your voiceover audio or raw video recording—our AI handles all the scene planning, B-roll matching, kinetic subtitles, and sound.
            </span>
            <span className="sm:hidden text-xs leading-snug">
              Zero complex timelines. Just upload audio or video—AI handles scene planning, B-roll visuals, and kinetic subtitles.
            </span>
          </p>
        </div>

        {/* Hero Transformation Illustration Stage - Seamless White Native Blend (No Border, No Shadow) */}
        <div className="relative mx-auto max-w-5xl w-full bg-white flex justify-center items-center py-2 sm:py-4">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={getOptimizedCloudinaryUrl('https://res.cloudinary.com/dhouh9idx/image/upload/v1792945906/file_00000000e0588211aef29aa7dc03025e_e09msx.png', 1100)}
            alt="ItnaVideo - Create stunning videos with AI. No editing needed."
            className="w-full h-auto object-contain max-h-[580px] mx-auto select-none"
            loading="lazy"
            decoding="async"
            width={1100}
            height={580}
          />
        </div>

        {/* 3 Core Value Pillars */}
        <div className="mt-8 sm:mt-12 grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
          <div className="group rounded-2xl sm:rounded-3xl border border-slate-200/90 bg-white/95 p-6 shadow-xs hover:border-orange-500/50 hover:shadow-[0_16px_36px_-10px_rgba(249,115,22,0.18)] transition-all duration-300 hover:-translate-y-1 backdrop-blur-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-orange-500/10 border border-orange-500/20 text-orange-600 shrink-0 group-hover:scale-105 transition-transform shadow-xs">
                <UploadCloud size={20} />
              </div>
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-orange-700 bg-orange-500/10 border border-orange-500/20 px-2.5 py-1 rounded-full">
                Step 1: Upload
              </span>
            </div>
            <h3 className="text-base font-bold text-slate-950 mb-2 group-hover:text-orange-600 transition-colors">
              Audio or Video Upload Only
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
              No manual script typing or timeline keyframing. Just upload any spoken voiceover, phone recording, or talking video file.
            </p>
          </div>

          <div className="group rounded-2xl sm:rounded-3xl border border-slate-200/90 bg-white/95 p-6 shadow-xs hover:border-orange-500/50 hover:shadow-[0_16px_36px_-10px_rgba(249,115,22,0.18)] transition-all duration-300 hover:-translate-y-1 backdrop-blur-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-600 shrink-0 group-hover:scale-105 transition-transform shadow-xs">
                <Sparkles size={20} />
              </div>
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-amber-700 bg-amber-500/10 border border-amber-500/20 px-2.5 py-1 rounded-full">
                Step 2: AI Planning
              </span>
            </div>
            <h3 className="text-base font-bold text-slate-950 mb-2 group-hover:text-orange-600 transition-colors">
              Speech-Driven Scene Assembly
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
              AI transcribes speech with millisecond precision, pairing every phrase with matching B-roll footage, stickers, and kinetic captions.
            </p>
          </div>

          <div className="group rounded-2xl sm:rounded-3xl border border-slate-200/90 bg-white/95 p-6 shadow-xs hover:border-orange-500/50 hover:shadow-[0_16px_36px_-10px_rgba(249,115,22,0.18)] transition-all duration-300 hover:-translate-y-1 backdrop-blur-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 shrink-0 group-hover:scale-105 transition-transform shadow-xs">
                <CheckCircle2 size={20} />
              </div>
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-700 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-full">
                Step 3: Instant Export
              </span>
            </div>
            <h3 className="text-base font-bold text-slate-950 mb-2 group-hover:text-orange-600 transition-colors">
              1080p Cloud Renders
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
              Render pristine 16:9 widescreen YouTube videos and 9:16 viral Shorts in under 60 seconds with zero watermarks on cloud servers.
            </p>
          </div>
        </div>

        {/* Section Action Bridge to Studios */}
        <div className="mt-10 sm:mt-12 text-center flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
          <a
            href="#video-types"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-zinc-950 hover:bg-zinc-800 px-6 sm:px-7 py-3 text-xs sm:text-sm font-bold text-white shadow-sm hover:scale-[1.02] active:scale-95 transition-all"
          >
            <span className="hidden sm:inline">Explore All 14 Purpose-Built AI Video Studios Below</span>
            <span className="sm:hidden">Explore All 14 Video Studios</span>
            <ArrowRight size={14} />
          </a>
          <span className="text-slate-300 hidden sm:inline">•</span>
          <Link
            href="/video-types"
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-slate-600 hover:text-slate-950 transition-colors"
          >
            <span className="hidden sm:inline">Or browse all dedicated pages &amp; specs</span>
            <span className="sm:hidden">Browse all specs</span>
            <ArrowRight size={13} />
          </Link>
        </div>
      </div>
    </section>
  );
}
