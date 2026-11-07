'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { getOptimizedCloudinaryUrl } from '@/lib/utils';
import {
  Sparkles,
  Play,
  ArrowRight,
  CheckCircle2,
  Tv,
  Volume2,
} from 'lucide-react';

export default function Hero() {
  const [previewFormat, setPreviewFormat] = useState<'16:9' | '9:16'>('16:9');

  return (
    <section className="relative overflow-hidden border-b border-slate-100 bg-white pt-8 pb-12 sm:pt-16 sm:pb-20 px-3.5 sm:px-6 lg:px-8 text-slate-900">

      {/* ───────────────────────────────────────────────────────────── */}
      {/* ARCHITECTURAL GRID CANVAS WITH SOFT MESH AURAS                */}
      {/* ───────────────────────────────────────────────────────────── */}
      <div
        className="pointer-events-none absolute inset-0 z-0 bg-[linear-gradient(to_right,rgba(0,0,0,0.035)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,0,0,0.035)_1px,transparent_1px)] bg-[size:40px_40px] sm:bg-[size:60px_60px]"
        style={{
          maskImage: 'radial-gradient(ellipse 95% 85% at 50% 35%, black 45%, transparent 95%)',
          WebkitMaskImage: 'radial-gradient(ellipse 95% 85% at 50% 35%, black 45%, transparent 95%)',
        }}
      />

      {/* Multi-Hue Soft Ambient Mesh Auras */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-20 top-0 h-[360px] sm:h-[420px] w-[420px] sm:w-[500px] rounded-full opacity-50 blur-3xl"
        style={{
          backgroundImage: 'radial-gradient(circle, rgba(0, 102, 255, 0.12) 0%, rgba(59, 130, 246, 0.06) 50%, transparent 75%)',
        }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-20 top-10 h-[380px] sm:h-[450px] w-[440px] sm:w-[520px] rounded-full opacity-50 blur-3xl"
        style={{
          backgroundImage: 'radial-gradient(circle, rgba(168, 85, 247, 0.08) 0%, rgba(56, 189, 248, 0.08) 50%, transparent 75%)',
        }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 bottom-0 h-[320px] sm:h-[380px] w-[880px] max-w-full -translate-x-1/2 opacity-70 blur-2xl"
        style={{
          backgroundImage: 'radial-gradient(ellipse 70% 60% at 50% 90%, rgba(0, 102, 255, 0.10) 0%, rgba(37, 99, 235, 0.05) 45%, transparent 80%)',
        }}
      />

      {/* ───────────────────────────────────────────────────────────── */}
      {/* MAIN HERO CONTENT STACK                                       */}
      {/* ───────────────────────────────────────────────────────────── */}
      <div className="relative z-10 mx-auto max-w-5xl text-center">
        {/* High-Impact Headline */}
        <h1 className="text-3xl sm:text-6xl md:text-7xl lg:text-[76px] font-black tracking-tight sm:tracking-[-0.03em] text-slate-950 leading-[1.12] sm:leading-[1.08] max-w-4xl mx-auto font-sans">
          Don&apos;t edit,{' '}
          <br className="hidden sm:inline" />
          <span className="bg-gradient-to-r from-[#0052CC] via-[#0066FF] to-[#3B82F6] bg-clip-text text-transparent">
            just speak.
          </span>
        </h1>

        {/* Crisp, Readable Subtitle */}
        <p className="mx-auto mt-3 sm:mt-5 max-w-2xl text-sm sm:text-lg md:text-xl font-medium leading-relaxed text-slate-700 font-sans px-2">
          Upload audio or video. Get a complete ready-to-publish video in minutes with AI.
        </p>

        {/* ───────────────────────────────────────────────────────────── */}
        {/* ONE PROMINENT CALL-TO-ACTION (SIMPLIFIED & UNCLUTTERED)       */}
        {/* ───────────────────────────────────────────────────────────── */}
        <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row items-center justify-center gap-2.5 sm:gap-4 max-w-md mx-auto px-2">
          <Link
            href="/dashboard"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-2xl sm:rounded-full bg-gradient-to-r from-[#0052CC] via-[#0066FF] to-[#2563EB] px-7 sm:px-9 py-3.5 sm:py-4 text-sm sm:text-base font-black text-white shadow-[0_12px_28px_-6px_rgba(0,102,255,0.35)] hover:shadow-[0_16px_36px_-6px_rgba(0,102,255,0.45)] hover:scale-[1.02] active:scale-95 transition-all duration-200 cursor-pointer"
          >
            <Sparkles size={16} className="text-white" />
            <span>Start Creating Video Free</span>
            <ArrowRight size={16} strokeWidth={2.5} />
          </Link>

          <a
            href="#video-types"
            className="inline-flex items-center gap-1 text-xs sm:text-sm font-bold text-slate-600 hover:text-slate-950 py-1.5 px-3 transition-colors"
          >
            <span>Explore All 14 Studios</span>
            <ArrowRight size={13} />
          </a>
        </div>

        {/* Free Creator Trust Pill */}
        <div className="mt-3.5 flex flex-wrap items-center justify-center gap-x-3 gap-y-1.5 text-xs text-slate-600 font-medium px-2">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 border border-emerald-200/90 px-3 py-1 font-bold text-emerald-800 shadow-2xs">
            <CheckCircle2 size={13} className="text-emerald-600 shrink-0" />
            <span>5 Free Videos Every Day (= 150 Free Videos/Month!)</span>
          </span>
          <span className="inline-flex items-center gap-1 text-slate-700 font-semibold">
            <CheckCircle2 size={13} className="text-emerald-600 shrink-0" />
            <span>No Credit Card Required</span>
          </span>
        </div>

        {/* ───────────────────────────────────────────────────────────── */}
        {/* INTERACTIVE AI VIDEO SHOWCASE PREVIEW CARD                    */}
        {/* ───────────────────────────────────────────────────────────── */}
        <div className="mt-6 sm:mt-10 mx-auto max-w-4xl px-1 sm:px-4">
          <div className="group relative rounded-2xl sm:rounded-3xl border border-stone-300/80 bg-white/95 p-2.5 sm:p-4 shadow-[0_16px_40px_-10px_rgba(0,0,0,0.08)] backdrop-blur-md transition-all hover:border-blue-500/40">

            {/* Top Showcase Toolbar */}
            <div className="flex items-center justify-between px-2 sm:px-3 py-1.5 mb-2 border-b border-stone-100 text-xs">
              <div className="flex items-center gap-2">
                <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
                <span className="font-extrabold text-slate-900 text-[11px] sm:text-xs">
                  AI Generation Live Preview
                </span>
                <span className="hidden sm:inline-block rounded-full bg-blue-500/10 border border-blue-500/20 px-2 py-0.5 text-[10px] font-bold text-blue-700">
                  {previewFormat === '16:9' ? '16:9 Widescreen (1080p)' : '9:16 Vertical (1080×1920)'}
                </span>
              </div>

              {/* Format Toggle Buttons */}
              <div className="flex items-center gap-1 bg-stone-100 p-0.5 rounded-lg">
                <button
                  type="button"
                  onClick={() => setPreviewFormat('16:9')}
                  className={`px-2.5 py-1 rounded-md text-[10px] sm:text-[11px] font-extrabold transition-all cursor-pointer ${previewFormat === '16:9'
                      ? 'bg-white text-slate-950 shadow-2xs'
                      : 'text-slate-500 hover:text-slate-900'
                    }`}
                >
                  16:9 Cinema
                </button>
                <button
                  type="button"
                  onClick={() => setPreviewFormat('9:16')}
                  className={`px-2.5 py-1 rounded-md text-[10px] sm:text-[11px] font-extrabold transition-all cursor-pointer ${previewFormat === '9:16'
                      ? 'bg-white text-slate-950 shadow-2xs'
                      : 'text-slate-500 hover:text-slate-900'
                    }`}
                >
                  9:16 Shorts
                </button>
              </div>
            </div>

            {/* Video Frame Display */}
            <div className="relative overflow-hidden rounded-xl sm:rounded-2xl bg-slate-950 aspect-[16/9] max-h-[360px] sm:max-h-[460px] flex items-center justify-center shadow-inner">

              {/* Background Video Mock Image */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={getOptimizedCloudinaryUrl(
                  previewFormat === '16:9'
                    ? 'https://res.cloudinary.com/dhouh9idx/image/upload/v1792945592/file_000000004290821180a71f25ad75480e_nztpwe.png'
                    : 'https://res.cloudinary.com/dhouh9idx/image/upload/v1792945593/file_00000000806482119547c1b937b7e386_zsrmkb.png',
                  960
                )}
                alt={previewFormat === '16:9' ? '16:9 YouTube Faceless Video' : '9:16 Auto Caption Reel'}
                className="w-full h-full object-cover opacity-90 transition-all duration-500 select-none"
                width={960}
                height={540}
                fetchPriority="high"
                decoding="async"
              />

              {/* Dark Gradient Overlay for Contrast */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/30 pointer-events-none" />

              {/* Top Video Tags */}
              <div className="absolute top-2.5 sm:top-4 inset-x-2.5 sm:inset-x-4 flex items-center justify-between text-white pointer-events-none">
                <span className="inline-flex items-center gap-1 rounded-md bg-black/60 backdrop-blur-md px-2 py-0.5 text-[10px] sm:text-xs font-mono font-bold border border-white/10">
                  <Tv size={11} className="text-orange-400" />
                  {previewFormat === '16:9' ? 'YouTube 1080p' : 'Reels 60 FPS'}
                </span>
                <span className="rounded-md bg-blue-600 px-2 py-0.5 text-[10px] sm:text-xs font-mono font-bold text-white shadow-xs">
                  {previewFormat === '16:9' ? '3:45 Duration' : '0:42 Reel'}
                </span>
              </div>

              {/* Center Play Button Overlay */}
              <Link
                href={previewFormat === '16:9' ? '/dashboard/faceless-video' : '/dashboard/auto-caption'}
                className="group/play absolute z-10 flex h-12 w-12 sm:h-16 sm:w-16 items-center justify-center rounded-full bg-white/95 text-[#0066FF] shadow-[0_8px_30px_rgba(0,102,255,0.40)] hover:scale-110 active:scale-95 transition-all duration-300"
                title="Launch in studio"
              >
                <Play size={22} className="ml-1 fill-[#0066FF] sm:scale-110" />
              </Link>

              {/* Bottom Interactive Subtitle Strip & Waveform */}
              <div className="absolute bottom-2.5 sm:bottom-4 inset-x-2.5 sm:inset-x-4 flex flex-col items-center gap-1.5 sm:gap-2 pointer-events-none">
                {/* Word Highlighted Subtitle */}
                <div className="rounded-lg sm:rounded-xl bg-black/75 backdrop-blur-md border border-white/15 px-3 py-1.5 text-center max-w-lg shadow-lg">
                  <p className="text-xs sm:text-sm md:text-base font-black text-white tracking-wide">
                    {previewFormat === '16:9' ? (
                      <>
                        &ldquo;Rule #1: Never risk capital on{' '}
                        <span className="text-blue-400 bg-blue-500/20 px-1 rounded border border-blue-400/30">
                          untested assets
                        </span>
                        ...&rdquo;
                      </>
                    ) : (
                      <>
                        &ldquo;STOP wasting hours! This{' '}
                        <span className="text-[#0066FF] bg-blue-500/20 px-1 rounded border border-blue-500/30">
                          AI CREATES
                        </span>{' '}
                        viral reels...&rdquo;
                      </>
                    )}
                  </p>
                </div>

                {/* Animated Audio Waveform */}
                <div className="flex items-center gap-1 text-[10px] sm:text-xs font-mono text-white/90 bg-black/50 backdrop-blur-md px-2.5 py-0.5 rounded-full border border-white/10">
                  <Volume2 size={12} className="text-blue-400 shrink-0" />
                  <div className="flex items-end gap-0.5 h-3">
                    <span className="w-0.5 bg-blue-400 h-1.5 rounded-full animate-pulse" />
                    <span className="w-0.5 bg-blue-500 h-3 rounded-full animate-pulse" />
                    <span className="w-0.5 bg-sky-400 h-2 rounded-full animate-pulse" />
                    <span className="w-0.5 bg-blue-400 h-2.5 rounded-full animate-pulse" />
                    <span className="w-0.5 bg-white h-1.5 rounded-full animate-pulse" />
                  </div>
                  <span className="text-[10px] text-zinc-300">Speech Synced</span>
                </div>
              </div>
            </div>

            {/* Bottom Caption Pill */}
            <div className="mt-2.5 flex items-center justify-between px-1 text-[11px] sm:text-xs text-slate-500 font-medium">
              <span>Automated B-roll Visuals • Subtitles &bull; Sound Effects</span>
              <Link
                href={previewFormat === '16:9' ? '/dashboard/faceless-video' : '/dashboard/auto-caption'}
                className="font-bold text-blue-600 hover:text-blue-700 inline-flex items-center gap-1"
              >
                <span>Launch this Studio</span>
                <ArrowRight size={12} />
              </Link>
            </div>

          </div>
        </div>

        {/* Clean, Non-wrapping Trust Indicators */}
        <div className="mt-5 sm:mt-8 flex items-center justify-center">
          <div className="inline-flex flex-wrap items-center justify-center gap-2 sm:gap-3 rounded-full border border-stone-200/90 bg-white/90 px-3.5 sm:px-5 py-1.5 text-[11px] sm:text-xs font-semibold text-slate-700 shadow-2xs">
            <div className="flex items-center gap-1">
              <span className="text-amber-500 font-black tracking-widest text-[12px]">★★★★★</span>
              <span className="font-extrabold text-slate-900">4.9/5</span>
            </div>
            <span className="text-stone-300">•</span>
            <span>
              <strong className="text-slate-900 font-black">5,000+</strong> Creators
            </span>
            <span className="text-stone-300">•</span>
            <span className="text-emerald-700 font-bold flex items-center gap-1">
              <CheckCircle2 size={12} className="text-emerald-600" />
              100% Cloud Render
            </span>
          </div>
        </div>

      </div>
    </section>
  );
}
