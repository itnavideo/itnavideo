'use client';

import {
  ArrowRight,
  CheckCircle2,
  ShieldCheck,
  Sparkles,
  Zap,
  Play,
} from 'lucide-react';
import Link from 'next/link';

export default function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-slate-200/80 bg-gradient-to-b from-[#FFF9F6] via-white to-white px-4 pb-8 pt-6 text-slate-900 sm:px-6 sm:pb-12 sm:pt-10">
      {/* Calm Architectural Box Grid */}
      <div
        className="pointer-events-none absolute inset-0 z-0 bg-[linear-gradient(to_right,rgba(0,0,0,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,0,0,0.03)_1px,transparent_1px)] bg-[size:54px_54px]"
        style={{
          maskImage: 'radial-gradient(ellipse 85% 70% at 50% 30%, black 40%, transparent 95%)',
          WebkitMaskImage: 'radial-gradient(ellipse 85% 70% at 50% 30%, black 40%, transparent 95%)',
        }}
      />

      {/* Pure Warm Flame Ambient Glows */}
      <div className="pointer-events-none absolute left-1/2 top-4 -translate-x-1/2 h-[400px] w-[800px] max-w-full rounded-full bg-gradient-to-tr from-orange-500/15 via-amber-400/10 to-rose-400/5 blur-[160px]" />
      <div className="pointer-events-none absolute -right-20 top-16 h-72 w-72 rounded-full bg-orange-400/10 blur-[140px]" />
      <div className="pointer-events-none absolute -left-20 bottom-10 h-72 w-72 rounded-full bg-amber-400/10 blur-[140px]" />

      <div className="relative z-10 mx-auto max-w-6xl text-center">

        {/* Kicker Badge - Flame Orange */}
        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-orange-500/30 bg-orange-500/10 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-orange-700 shadow-xs">
          <Sparkles size={14} className="text-[#FF5722]" />
          <span>More Than AI — Your Personal Editor</span>
        </div>

        {/* Main Hero Headline - Flame Orange Energy */}
        <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-[76px] font-extrabold tracking-[-0.03em] text-slate-900 leading-[1.08] max-w-5xl mx-auto font-sans">
          The Free{' '}
          <span className="bg-gradient-to-r from-[#FF5722] via-[#FF7043] to-[#FFA000] bg-clip-text text-transparent">
            AI Video Generator
          </span>
          <br />
          <span className="text-slate-900">For Creators &amp; Brands</span>
        </h1>

        {/* Hero Subtitle - Concise 2 Lines */}
        <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-slate-600 sm:text-lg font-sans">
          The #1 AI video generator for YouTubers &amp; short-form creators.<br className="hidden sm:inline" />
          Turn voiceovers &amp; scripts into 1080p videos with auto B-roll, subtitles, and music.
        </p>

        {/* High-Conversion CTAs */}
        <div className="mt-7 flex flex-col sm:flex-row items-center justify-center gap-3.5">
          <Link
            href="/dashboard/faceless-video"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 rounded-2xl bg-gradient-to-r from-[#FF5722] via-[#FF7043] to-[#FFA000] px-8 py-4 text-base sm:text-lg font-black text-white shadow-lg shadow-orange-500/25 hover:shadow-orange-500/40 hover:brightness-110 hover:-translate-y-0.5 active:scale-95 transition-all duration-200"
          >
            <Sparkles size={20} className="text-white" />
            <span>Start Creating Free →</span>
          </Link>
          <a
            href="#faceless-video-flagship"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 rounded-2xl border border-slate-300 bg-white px-7 py-4 text-base font-bold text-slate-800 shadow-sm transition duration-200 hover:bg-slate-50 hover:border-slate-400 active:scale-95"
          >
            <Play size={18} className="text-[#FF5722] fill-[#FF5722]" />
            <span>Watch 1-Min Demo</span>
          </a>
        </div>

        {/* Social Proof Trust Bar - Positioned Directly Below CTA */}
        <div className="mt-4 flex flex-wrap items-center justify-center gap-2.5 sm:gap-3.5 text-xs text-slate-600">
          <div className="flex items-center -space-x-2">
            <div className="h-6 w-6 rounded-full bg-gradient-to-tr from-orange-400 to-amber-300 border-2 border-white flex items-center justify-center text-[9px] font-black text-white shadow-xs">AK</div>
            <div className="h-6 w-6 rounded-full bg-gradient-to-tr from-purple-500 to-indigo-400 border-2 border-white flex items-center justify-center text-[9px] font-black text-white shadow-xs">RT</div>
            <div className="h-6 w-6 rounded-full bg-gradient-to-tr from-emerald-500 to-teal-400 border-2 border-white flex items-center justify-center text-[9px] font-black text-white shadow-xs">SK</div>
            <div className="h-6 w-6 rounded-full bg-gradient-to-tr from-blue-500 to-cyan-400 border-2 border-white flex items-center justify-center text-[9px] font-black text-white shadow-xs">MJ</div>
          </div>
          <div className="flex items-center gap-1">
            <div className="flex text-amber-400 text-sm leading-none">★★★★★</div>
            <span className="font-extrabold text-slate-900">4.9/5</span>
          </div>
          <span className="text-slate-300">•</span>
          <span className="font-semibold text-slate-700">
            Trusted by <strong className="font-black text-slate-900">5,000+ Creators</strong> on YouTube &amp; TikTok
          </span>
        </div>

        {/* 3 Core Value Props - Clean & De-cluttered */}
        <div className="mt-4 inline-flex flex-wrap items-center justify-center gap-x-5 gap-y-1.5 text-xs font-bold text-slate-600">
          <span className="inline-flex items-center gap-1.5">
            <Zap size={14} className="text-amber-500 fill-amber-500" /> 60s Cloud Rendering
          </span>
          <span className="text-slate-300 hidden sm:inline">•</span>
          <span className="inline-flex items-center gap-1.5">
            <ShieldCheck size={14} className="text-emerald-500" /> Zero Watermark
          </span>
          <span className="text-slate-300 hidden sm:inline">•</span>
          <span className="inline-flex items-center gap-1.5">
            <CheckCircle2 size={14} className="text-orange-500" /> 1080p Full HD Export
          </span>
        </div>

        {/* Micro-Copy */}
        <p className="mt-2.5 text-[11px] font-semibold text-slate-400">
          ⚡ No Credit Card Required • Instant 1 Free Video Credit
        </p>

        {/* Large Feature Showcase Banner: 3D AI Video Engine Visual (Image 1) */}
        <div className="mt-6 sm:mt-8 w-full max-w-5xl mx-auto">
          <div className="group relative overflow-hidden rounded-2xl sm:rounded-3xl border border-slate-200/90 bg-gradient-to-b from-white via-white/95 to-orange-50/20 p-2 sm:p-4 shadow-[0_20px_50px_rgba(0,0,0,0.06)] drop-shadow-xl transition-all duration-300 hover:shadow-[0_25px_60px_rgba(0,0,0,0.10)]">
            {/* Top SaaS Window Bar */}
            <div className="flex items-center justify-between px-3 py-1.5 text-[11px] font-bold text-slate-500 border-b border-slate-100/90 mb-2 sm:mb-2.5">
              <div className="flex items-center gap-2">
                <span className="flex h-2.5 w-2.5 rounded-full bg-red-500/80" />
                <span className="flex h-2.5 w-2.5 rounded-full bg-amber-500/80" />
                <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-500/80" />
                <span className="ml-2 uppercase tracking-wider font-extrabold text-orange-700">
                  3D AI Video Engine Canvas
                </span>
              </div>
              <span className="text-slate-400 font-semibold hidden sm:inline text-[11px]">
                Script &amp; Voiceover → Auto B-Roll Matching → Word-Synced Timing
              </span>
            </div>

            {/* Crisp 3D Illustration */}
            <div className="relative overflow-hidden rounded-xl sm:rounded-2xl bg-white/60 p-1 sm:p-2">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="https://res.cloudinary.com/dhouh9idx/image/upload/v1792056190/Hero_Section_Feature_Illustration_3D_AI_Video_Engine_Visual_simsct.png"
                alt="Itnavideo 3D AI Video Engine Architecture"
                className="w-full h-auto object-contain rounded-lg sm:rounded-xl drop-shadow-sm transition-transform duration-500 group-hover:scale-[1.01]"
              />
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
