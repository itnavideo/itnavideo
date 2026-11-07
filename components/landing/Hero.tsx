'use client';

import React from 'react';
import Link from 'next/link';
import {
  Sparkles,
  ArrowRight,
  CheckCircle2,
} from 'lucide-react';

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-white pt-12 pb-12 sm:pt-18 sm:pb-16 px-4 sm:px-6 lg:px-8 text-zinc-950 border-b border-zinc-200/80">

      {/* ───────────────────────────────────────────────────────────── */}
      {/* ATMOSPHERIC STUDIO LIGHTING & WARM AMBER-ORANGE AURAS         */}
      {/* ───────────────────────────────────────────────────────────── */}
      {/* Subtle Dot-Matrix Grid with Center Radial Vignette */}
      <div
        className="pointer-events-none absolute inset-0 z-0 bg-[radial-gradient(#CBD5E1_1px,transparent_1px)] [background-size:28px_28px] opacity-60"
        style={{
          maskImage: 'radial-gradient(ellipse 90% 70% at 50% 25%, black 40%, transparent 90%)',
          WebkitMaskImage: 'radial-gradient(ellipse 90% 70% at 50% 25%, black 40%, transparent 90%)',
        }}
      />

      {/* Luminous Warm Orange Studio Halo (Hero Glow) */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 -top-28 h-[460px] sm:h-[560px] w-[750px] sm:w-[1000px] -translate-x-1/2 rounded-full opacity-70 blur-3xl"
        style={{
          background: 'radial-gradient(ellipse 65% 45% at 50% 35%, rgba(249, 115, 22, 0.09) 0%, rgba(234, 88, 12, 0.04) 40%, transparent 75%)',
        }}
      />

      {/* ───────────────────────────────────────────────────────────── */}
      {/* MAIN HERO CONTENT STACK                                       */}
      {/* ───────────────────────────────────────────────────────────── */}
      <div className="relative z-10 mx-auto max-w-5xl text-center">

        {/* High-Impact Executive Headline with Radiant Sunset Orange Accent */}
        <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-[80px] font-black tracking-[-0.04em] text-zinc-950 leading-[1.08] sm:leading-[1.04] max-w-4xl mx-auto font-sans">
          Don&apos;t edit,{' '}
          <br className="hidden sm:inline" />
          <span className="bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 bg-clip-text text-transparent">
            just speak.
          </span>
        </h1>

        {/* Sophisticated Editorial Subtitle */}
        <p className="mx-auto mt-4 sm:mt-5 max-w-2xl text-base sm:text-xl font-normal leading-relaxed text-zinc-600 font-sans px-3">
          Upload audio or video. Get a complete, studio-quality video in minutes with AI.
        </p>

        {/* ───────────────────────────────────────────────────────────── */}
        {/* PRIMARY CALL TO ACTION BUTTON                                 */}
        {/* ───────────────────────────────────────────────────────────── */}
        <div className="mt-8 sm:mt-9 flex items-center justify-center">
          <Link
            href="/dashboard"
            className="group inline-flex items-center justify-center gap-2.5 rounded-full bg-zinc-950 hover:bg-zinc-900 px-8 sm:px-10 py-3.5 sm:py-4 text-sm sm:text-base font-extrabold text-white shadow-[0_16px_36px_-8px_rgba(249,115,22,0.35),0_4px_16px_rgba(0,0,0,0.08)] hover:shadow-[0_20px_44px_-8px_rgba(249,115,22,0.45)] hover:scale-[1.02] active:scale-95 transition-all duration-200 cursor-pointer"
          >
            <Sparkles size={18} className="text-amber-400 group-hover:rotate-12 transition-transform" />
            <span>Start Creating Free</span>
            <ArrowRight size={17} strokeWidth={2.5} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* ───────────────────────────────────────────────────────────── */}
        {/* STREAMLINED SOCIAL PROOF & TRUST STRIP                        */}
        {/* ───────────────────────────────────────────────────────────── */}
        <div className="mt-6 sm:mt-7 flex items-center justify-center">
          <div className="inline-flex flex-wrap items-center justify-center gap-2 sm:gap-3.5 rounded-full border border-zinc-200/80 bg-white/90 px-4 sm:px-5 py-2 text-xs font-medium text-zinc-600 shadow-xs backdrop-blur-sm">
            <div className="flex items-center gap-1 shrink-0">
              <span className="text-amber-400 font-bold tracking-widest text-xs">★★★★★</span>
              <span className="font-extrabold text-zinc-950 ml-0.5">4.9 / 5.0</span>
            </div>
            <span className="text-zinc-300">•</span>
            <span className="text-zinc-900 font-semibold shrink-0">
              5 Free Videos Daily
            </span>
            <span className="text-zinc-300">•</span>
            <span className="text-zinc-600 shrink-0">
              No Credit Card Required
            </span>
            <span className="text-zinc-300 hidden md:inline">•</span>
            <span className="hidden md:inline-flex items-center gap-1 text-emerald-700 font-semibold shrink-0">
              <CheckCircle2 size={13} className="text-emerald-600" />
              Zero Watermark
            </span>
          </div>
        </div>

      </div>
    </section>
  );
}
