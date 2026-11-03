'use client';

import React from 'react';
import { getOptimizedCloudinaryUrl } from '@/lib/utils';
import Link from 'next/link';
import { Sparkles, CheckCircle2, ArrowRight, Zap, UploadCloud } from 'lucide-react';

export default function TransformationShowcaseSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-white via-[#FFFBF9] to-white pt-12 pb-16 sm:pt-16 sm:pb-24 px-4 sm:px-6 lg:px-8 border-b border-stone-200/80">
      {/* Soft Multi-Hue Ambient Mesh Auras (Liinks.co style living atmosphere) */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-10 top-1/4 h-[420px] w-[500px] rounded-full opacity-60 blur-3xl"
        style={{
          background: 'radial-gradient(circle, rgba(255, 138, 101, 0.15) 0%, rgba(255, 183, 77, 0.08) 50%, transparent 75%)',
        }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-10 top-1/3 h-[450px] w-[520px] rounded-full opacity-50 blur-3xl"
        style={{
          background: 'radial-gradient(circle, rgba(168, 85, 247, 0.08) 0%, rgba(56, 189, 248, 0.06) 50%, transparent 75%)',
        }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-[450px] w-[750px] max-w-full opacity-70 blur-2xl"
        style={{
          background: 'radial-gradient(ellipse 65% 55% at 50% 50%, rgba(255, 112, 67, 0.11) 0%, rgba(255, 179, 0, 0.05) 45%, transparent 75%)',
        }}
      />

      <div className="relative z-10 mx-auto max-w-6xl">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-12">
          <div className="mb-3.5 inline-flex items-center gap-2 rounded-full border border-orange-500/30 bg-orange-500/10 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-orange-700 shadow-xs">
            <Sparkles size={14} className="text-[#FF5722]" />
            <span>The No-Code Video Transformation</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight leading-[1.15] font-sans">
            From Video Editing Frustration{' '}
            <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-[#FF5722] via-[#FF7043] to-[#FFA000] bg-clip-text text-transparent">
              to Instant AI Creation
            </span>
          </h2>

          <p className="mt-3 sm:mt-4 text-sm sm:text-lg text-slate-600 leading-relaxed font-sans font-medium">
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
          <div className="group rounded-2xl border border-stone-200/90 bg-white p-5 sm:p-6 shadow-xs hover:border-orange-500/50 hover:shadow-lg hover:shadow-orange-500/5 transition-all duration-300 hover:-translate-y-1">
            <div className="flex items-center justify-between mb-3.5">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-500/10 border border-orange-500/20 text-orange-600 shrink-0 group-hover:scale-105 transition-transform">
                <UploadCloud size={18} />
              </div>
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-orange-700 bg-orange-500/10 border border-orange-500/20 px-2 py-0.5 rounded-full">
                Step 1: Upload
              </span>
            </div>
            <h3 className="text-sm sm:text-base font-extrabold text-slate-900 mb-1.5 group-hover:text-orange-600 transition-colors">
              Audio or Video Upload Only
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed font-medium">
              No manual script typing or timeline keyframing. Just upload any spoken voiceover, phone recording, or talking video file.
            </p>
          </div>

          <div className="group rounded-2xl border border-stone-200/90 bg-white p-5 sm:p-6 shadow-xs hover:border-orange-500/50 hover:shadow-lg hover:shadow-orange-500/5 transition-all duration-300 hover:-translate-y-1">
            <div className="flex items-center justify-between mb-3.5">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-500/10 border border-orange-500/20 text-orange-600 shrink-0 group-hover:scale-105 transition-transform">
                <Sparkles size={18} />
              </div>
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-orange-700 bg-orange-500/10 border border-orange-500/20 px-2 py-0.5 rounded-full">
                Step 2: AI Planning
              </span>
            </div>
            <h3 className="text-sm sm:text-base font-extrabold text-slate-900 mb-1.5 group-hover:text-orange-600 transition-colors">
              Speech-Driven Scene Assembly
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed font-medium">
              AI transcribes speech with millisecond precision, pairing every phrase with matching B-roll footage, stickers, and kinetic captions.
            </p>
          </div>

          <div className="group rounded-2xl border border-stone-200/90 bg-white p-5 sm:p-6 shadow-xs hover:border-orange-500/50 hover:shadow-lg hover:shadow-orange-500/5 transition-all duration-300 hover:-translate-y-1">
            <div className="flex items-center justify-between mb-3.5">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-500/10 border border-orange-500/20 text-orange-600 shrink-0 group-hover:scale-105 transition-transform">
                <CheckCircle2 size={18} />
              </div>
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-700 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">
                Step 3: Instant Export
              </span>
            </div>
            <h3 className="text-sm sm:text-base font-extrabold text-slate-900 mb-1.5 group-hover:text-orange-600 transition-colors">
              1080p Cloud Renders
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed font-medium">
              Render pristine 16:9 widescreen YouTube videos and 9:16 viral Shorts in under 60 seconds with zero watermarks on cloud servers.
            </p>
          </div>
        </div>

        {/* Section Action Bridge to Studios */}
        <div className="mt-10 text-center flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
          <a
            href="#video-types"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#FF5722] via-[#FF7043] to-[#FFA000] px-5 sm:px-6 py-2.5 text-xs sm:text-sm font-bold text-white shadow-md shadow-orange-500/20 hover:shadow-orange-500/30 hover:brightness-105 transition-all active:scale-95"
          >
            <span className="hidden sm:inline">Explore All 14 Purpose-Built AI Video Studios Below</span>
            <span className="sm:hidden">Explore All 14 Video Studios</span>
            <ArrowRight size={14} />
          </a>
          <span className="text-slate-300 hidden sm:inline">•</span>
          <Link
            href="/video-types"
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors"
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
