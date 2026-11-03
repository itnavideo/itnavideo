'use client';

import React from 'react';
import Link from 'next/link';
import {
  Sparkles,
  XCircle,
  Zap,
  ArrowRight,
  TrendingUp,
  Flame,
} from 'lucide-react';

export default function BeforeAfterComparison() {
  return (
    <section className="relative overflow-hidden bg-slate-50/70 py-16 sm:py-24 text-slate-900 border-b border-slate-200/80">
      {/* Ambient background glow */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-orange-500/8 blur-[100px] rounded-full" />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 rounded-full border border-orange-500/30 bg-orange-500/10 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-orange-700 shadow-xs">
            <TrendingUp size={14} className="text-[#FF5722]" />
            <span>EFFICIENCY BENCHMARK</span>
          </div>

          <h2 className="text-3xl font-black tracking-tight text-slate-900 sm:text-5xl font-sans">
            Stop Spending 5 Hours on a Single Video.{' '}
            <span className="bg-gradient-to-r from-[#FF5722] via-[#FF7043] to-[#FFA000] bg-clip-text text-transparent">
              Create in 60 Seconds.
            </span>
          </h2>

          <p className="text-sm sm:text-base text-slate-600 font-normal leading-relaxed max-w-2xl mx-auto">
            Traditional video creation requires juggling 4 different tools, timeline lag, and manual B-roll searching. Itnavideo orchestrates speech, B-roll, subtitles, and music into one seamless cloud pipeline.
          </p>
        </div>

        {/* Side-by-Side Comparison Box */}
        {/* Side-by-Side Comparison Box - Equal Heights Flex Alignment */}
        <div className="mt-12 sm:mt-16 grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 max-w-5xl mx-auto items-stretch">
          
          {/* LEFT: THE OLD WAY (Without AI / Manual Editing) - Red Background Accent */}
          <div className="relative flex flex-col justify-between rounded-[28px] border-2 border-rose-300/80 bg-gradient-to-b from-rose-50/80 via-rose-50/20 to-white p-6 sm:p-8 shadow-[0_8px_30px_rgba(244,63,94,0.08)] transition-all duration-300 hover:shadow-lg">
            {/* Top Red Split Badge */}
            <div className="absolute -top-3.5 left-6 inline-flex items-center gap-1.5 rounded-full bg-rose-600 px-3.5 py-1 text-[11px] font-black uppercase tracking-wider text-white shadow-md">
              <span>Without AI</span>
            </div>

            <div>
              <div className="flex items-center justify-between pb-5 border-b border-rose-200/70 pt-1">
                <div className="flex items-center gap-2.5">
                  <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-rose-500/15 text-rose-600 font-black">
                    <XCircle size={20} />
                  </span>
                  <div>
                    <h3 className="text-base sm:text-lg font-black text-slate-900">Without AI</h3>
                    <p className="text-xs text-rose-600 font-bold">5 Hours of Manual Editing</p>
                  </div>
                </div>
                <span className="rounded-full bg-rose-100 border border-rose-300 px-3 py-1 text-xs font-black text-rose-700">
                  ⏱️ 5+ Hours / Video
                </span>
              </div>

              {/* Friction Pain Points */}
              <ul className="mt-6 space-y-4 text-xs sm:text-[13px] text-slate-700">
                <li className="flex items-start gap-3 min-h-[40px]">
                  <span className="mt-0.5 text-rose-500 font-black shrink-0">✕</span>
                  <span><strong>Manual Timeline Slicing:</strong> Slicing dozens of B-roll clips by hand, syncing audio beats, and adjusting transitions manually.</span>
                </li>
                <li className="flex items-start gap-3 min-h-[40px]">
                  <span className="mt-0.5 text-rose-500 font-black shrink-0">✕</span>
                  <span><strong>Tedious Subtitle Typing:</strong> Typing out transcripts, fixing timestamp drift, and styling word animations one by one.</span>
                </li>
                <li className="flex items-start gap-3 min-h-[40px]">
                  <span className="mt-0.5 text-rose-500 font-black shrink-0">✕</span>
                  <span><strong>Searching Stock Sites:</strong> Browsing multiple stock libraries for hours to find matching footage and license rights.</span>
                </li>
                <li className="flex items-start gap-3 min-h-[40px]">
                  <span className="mt-0.5 text-rose-500 font-black shrink-0">✕</span>
                  <span><strong>Laptop Render Thrashing:</strong> 45-minute export times, loud laptop fan noise, disk thrashing, and render crashes.</span>
                </li>
                <li className="flex items-start gap-3 min-h-[40px]">
                  <span className="mt-0.5 text-rose-500 font-black shrink-0">✕</span>
                  <span><strong>Expensive Tool Stack:</strong> Paying $70+/month for 3 separate software subscriptions for editing, assets, and audio.</span>
                </li>
              </ul>
            </div>

            <div className="mt-8 pt-5 border-t border-rose-200/70 flex items-center justify-between text-xs font-bold text-rose-700 h-12">
              <span>Creator Output:</span>
              <span className="rounded-md bg-rose-100 border border-rose-200 px-2.5 py-1 text-rose-900 font-black">Slow Growth (1-2 videos / week)</span>
            </div>
          </div>

          {/* RIGHT: THE ITNAVIDEO WAY - Vibrant Orange/Emerald Accent */}
          <div className="relative flex flex-col justify-between rounded-[28px] border-2 border-orange-500 bg-gradient-to-b from-orange-500/[0.07] via-white to-white p-6 sm:p-8 shadow-[0_16px_45px_-6px_rgba(255,87,34,0.22)] ring-4 ring-orange-500/10">
            {/* Top Recommended Badge */}
            <div className="absolute -top-3.5 right-6 inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-[#FF5722] to-[#FFA000] px-3.5 py-1 text-[11px] font-black uppercase tracking-wider text-white shadow-md">
              <Flame size={12} className="fill-white" />
              <span>With Itnavideo</span>
            </div>

            <div>
              <div className="flex items-center justify-between pb-5 border-b border-orange-100 pt-1">
                <div className="flex items-center gap-2.5">
                  <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-orange-500/15 text-[#FF5722] font-black">
                    <Zap size={20} />
                  </span>
                  <div>
                    <h3 className="text-base sm:text-lg font-black text-slate-900">With Itnavideo</h3>
                    <p className="text-xs text-orange-600 font-bold">Autonomous Cloud Studio</p>
                  </div>
                </div>
                <span className="rounded-full bg-orange-500/15 border border-orange-500/30 px-3 py-1 text-xs font-black text-orange-800">
                  ⚡ 60 Seconds / Video
                </span>
              </div>

              {/* Value Advantages */}
              <ul className="mt-6 space-y-4 text-xs sm:text-[13px] text-slate-800">
                <li className="flex items-start gap-3 min-h-[40px]">
                  <span className="mt-0.5 text-emerald-500 font-black shrink-0">✓</span>
                  <span><strong>1-Click Media Ingest:</strong> Drop your narration audio or script — neural AI aligns speech in seconds.</span>
                </li>
                <li className="flex items-start gap-3 min-h-[40px]">
                  <span className="mt-0.5 text-emerald-500 font-black shrink-0">✓</span>
                  <span><strong>Automated Kinetic Subtitles:</strong> Word-by-word precision captions synced automatically with active highlighting.</span>
                </li>
                <li className="flex items-start gap-3 min-h-[40px]">
                  <span className="mt-0.5 text-emerald-500 font-black shrink-0">✓</span>
                  <span><strong>AI B-Roll &amp; SFX Matching:</strong> Neural Director pairs every spoken beat with relevant visuals and beat-matched audio.</span>
                </li>
                <li className="flex items-start gap-3 min-h-[40px]">
                  <span className="mt-0.5 text-emerald-500 font-black shrink-0">✓</span>
                  <span><strong>AWS Lambda Cloud Rendering:</strong> Zero laptop heat or disk paging — rendered on AWS Lambda 1080p cluster.</span>
                </li>
                <li className="flex items-start gap-3 min-h-[40px]">
                  <span className="mt-0.5 text-emerald-500 font-black shrink-0">✓</span>
                  <span><strong>All 14 Video Studios:</strong> 16:9 Faceless YouTube, 9:16 Shorts, Book Summaries &amp; Clips all in one platform.</span>
                </li>
              </ul>
            </div>

            <div className="mt-8 pt-5 border-t border-orange-100 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex flex-col items-start gap-2 text-xs font-bold text-orange-900 sm:flex-row sm:items-center">
                <span>Creator Output:</span>
                <span className="rounded-md bg-emerald-500/15 border border-emerald-500/30 px-2 py-1 text-emerald-800 font-black">10+ Videos / Day (10x Reach)</span>
              </div>
              <Link
                href="/dashboard"
                className="inline-flex min-h-10 items-center justify-center gap-1.5 self-stretch rounded-xl border border-orange-200 px-3 text-xs font-black text-[#FF5722] hover:text-orange-700 transition group sm:self-auto sm:border-0 sm:px-0"
              >
                <span>Try It Free</span>
                <ArrowRight size={13} className="group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
