'use client';

import {
  ArrowRight,
  CheckCircle2,
  ShieldCheck,
  Sparkles,
  Zap,
} from 'lucide-react';
import Link from 'next/link';

export default function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-slate-200/80 bg-gradient-to-b from-[#FFF9F6] via-white to-white px-4 pb-14 pt-8 text-slate-900 sm:px-6 sm:pb-20 sm:pt-12">
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

        {/* Hero Subtitle focused on Faceless Video */}
        <p className="mx-auto mt-4 max-w-2xl text-base font-normal leading-relaxed text-slate-700 sm:text-lg font-sans tracking-tight antialiased">
          The #1 <span className="font-bold text-slate-900">Faceless Video Engine</span> for YouTubers &amp; creators. Turn voiceovers and scripts into high-retention <span className="font-semibold text-orange-600">16:9 YouTube videos</span> &amp; <span className="font-semibold text-amber-600">9:16 Shorts</span> with automated B-roll, subtitles, and music.
        </p>

        {/* High-Conversion CTAs */}
        <div className="mt-7 flex flex-wrap items-center justify-center gap-3.5">
          <Link
            href="/dashboard/faceless-video"
            className="group inline-flex items-center justify-center gap-2.5 rounded-full bg-gradient-to-r from-[#FF5722] via-[#FF7043] to-[#FFA000] px-8 py-4 text-base sm:text-lg font-black text-white shadow-xl shadow-orange-500/25 transition duration-200 hover:brightness-110 hover:scale-[1.02] active:scale-95"
          >
            <Sparkles size={20} className="text-white" />
            <span>Create Faceless Video Free</span>
            <ArrowRight size={20} className="transition group-hover:translate-x-1" />
          </Link>
          <Link
            href="#video-types"
            className="inline-flex items-center justify-center gap-2 rounded-full border border-slate-200 bg-white px-7 py-4 text-base font-bold text-slate-800 shadow-2xs transition duration-200 hover:border-orange-500/40 hover:bg-orange-50/30 hover:text-orange-950 active:scale-95"
          >
            <span>Explore All 10 Studios</span>
          </Link>
        </div>

        {/* Trust Badges in Refined Capsule */}
        <div className="mt-6 inline-flex flex-wrap items-center justify-center gap-x-6 gap-y-2 rounded-full border border-slate-200 bg-white px-5 py-2 text-xs font-semibold text-slate-700 shadow-xs backdrop-blur-md">
          <span className="inline-flex items-center gap-1.5">
            <CheckCircle2 size={15} className="text-emerald-500" /> 1 free 9:16 video on signup
          </span>
          <span className="inline-flex items-center gap-1.5">
            <ShieldCheck size={15} className="text-orange-500" /> No credit card required
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Zap size={15} className="text-amber-500" /> Instant 1080p Cloud Export
          </span>
        </div>

        {/* Compact 4-Studio Feature Highlight Strip */}
        <div className="mt-7 flex flex-wrap items-center justify-center gap-2 max-w-3xl mx-auto">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-orange-500/25 bg-orange-500/10 px-3 py-1 text-[11px] font-bold text-orange-800">
            🎬 16:9 Widescreen Faceless
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/25 bg-amber-500/10 px-3 py-1 text-[11px] font-bold text-amber-800">
            📱 9:16 Shorts &amp; Reels
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-orange-500/25 bg-orange-500/10 px-3 py-1 text-[11px] font-bold text-orange-800">
            📝 Kinetic Auto Subtitles
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/25 bg-emerald-500/10 px-3 py-1 text-[11px] font-bold text-emerald-800">
            ⚡ Instant Cloud Render
          </span>
        </div>

      </div>
    </section>
  );
}
