'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Sparkles,
  Check,
  X,
  ArrowRight,
  Zap,
  Cpu,
  MonitorPlay,
  Coins,
  Languages,
  Mic,
  SlidersHorizontal,
  Trophy,
} from 'lucide-react';

interface VisualComparisonRow {
  title: string;
  category: string;
  icon: React.ElementType;
  itnavideo: {
    highlight: string;
    badge: string;
    subtext: string;
  };
  capcut: {
    status: 'no' | 'warning';
    badge: string;
    subtext: string;
  };
  competitors: {
    status: 'no' | 'warning';
    badge: string;
    subtext: string;
  };
}

const COMPARISON_ROWS: VisualComparisonRow[] = [
  {
    title: 'Hardware Load',
    category: 'AWS Cloud Engine',
    icon: Cpu,
    itnavideo: {
      highlight: 'Zero Laptop Freeze',
      badge: '100% AWS Cloud',
      subtext: 'Runs smooth on 4GB RAM',
    },
    capcut: {
      status: 'no',
      badge: 'Heavy Local Render',
      subtext: 'Fans blast, laptops heat up',
    },
    competitors: {
      status: 'warning',
      badge: 'Heavy Web Browser',
      subtext: 'Opus/InVideo tab lag',
    },
  },
  {
    title: '16:9 & 9:16 Formats',
    category: 'Dual-Format Video',
    icon: MonitorPlay,
    itnavideo: {
      highlight: 'Both Formats Native',
      badge: '16:9 + 9:16 Shorts',
      subtext: 'YouTube up to 5 min & Reels',
    },
    capcut: {
      status: 'warning',
      badge: 'Manual Re-editing',
      subtext: 'Must resize every layer',
    },
    competitors: {
      status: 'no',
      badge: 'Shorts Only',
      subtext: 'Opus has no 16:9 YouTube',
    },
  },
  {
    title: 'Credit Pricing',
    category: 'Simple Billing',
    icon: Coins,
    itnavideo: {
      highlight: '1 Min = 1 Credit',
      badge: '100% Transparent',
      subtext: 'Zero hidden token math',
    },
    capcut: {
      status: 'no',
      badge: 'Monthly Lockout',
      subtext: 'Pro features locked behind paywall',
    },
    competitors: {
      status: 'no',
      badge: '$15–$30/mo Minimum',
      subtext: 'Expensive expiring credits',
    },
  },
  {
    title: 'Dialects & Accents',
    category: 'Speech Engine',
    icon: Languages,
    itnavideo: {
      highlight: 'Global & Bilingual Dialects',
      badge: 'Groq Whisper Cloud',
      subtext: 'Flawless slang & accent sync',
    },
    capcut: {
      status: 'warning',
      badge: 'Basic Auto Captions',
      subtext: 'Errors on colloquial speech',
    },
    competitors: {
      status: 'warning',
      badge: 'Rigid Dictionaries',
      subtext: 'Struggles with regional accents',
    },
  },
  {
    title: 'Studio Audio Cleaner',
    category: 'Audio Utility',
    icon: Mic,
    itnavideo: {
      highlight: 'One-Click Studio Sound',
      badge: 'Built-in Cleaner',
      subtext: 'Removes echo & AC noise',
    },
    capcut: {
      status: 'warning',
      badge: 'Basic Noise Gate',
      subtext: 'Muffles vocal frequencies',
    },
    competitors: {
      status: 'no',
      badge: 'Not Included',
      subtext: 'Requires separate third-party app',
    },
  },
  {
    title: 'Editing Effort',
    category: 'Workflow Speed',
    icon: SlidersHorizontal,
    itnavideo: {
      highlight: 'Zero Timeline Splicing',
      badge: 'Phone Audio ➔ Video',
      subtext: 'AI auto-plans B-roll & scenes',
    },
    capcut: {
      status: 'no',
      badge: '3–6 Hours Manual',
      subtext: 'Keyframes, tracks & cuts',
    },
    competitors: {
      status: 'warning',
      badge: 'Repurposing Only',
      subtext: 'Cannot create from voiceover',
    },
  },
];

export default function ComparisonSection() {
  const [selectedMobileCompetitor, setSelectedMobileCompetitor] = useState<'capcut' | 'competitors'>('capcut');

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-white via-[#FFFBF9] to-white pt-10 pb-12 sm:pt-12 sm:pb-14 px-4 sm:px-6 lg:px-8 border-t border-stone-200/80">
      {/* ───────────────────────────────────────────────────────────── */}
      {/* SOFT AMBIENT MESH AURA                                        */}
      {/* ───────────────────────────────────────────────────────────── */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/3 -translate-x-1/2 -translate-y-1/2 h-[500px] w-[950px] max-w-full opacity-60 blur-3xl"
        style={{
          backgroundImage:
            'radial-gradient(ellipse 70% 60% at 50% 50%, rgba(255, 138, 101, 0.14) 0%, rgba(255, 183, 77, 0.08) 50%, transparent 80%)',
        }}
      />

      <div className="relative z-10 mx-auto max-w-6xl">
        {/* Section Header with Bold Font & Trophy Pill */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-14">
          <div className="mb-3.5 inline-flex items-center gap-2 rounded-full border border-orange-500/30 bg-orange-500/10 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-orange-700 shadow-xs">
            <Trophy size={14} className="text-[#FF5722]" />
            <span>Honest Creator Benchmark</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight leading-[1.15] font-sans">
            How Itnavideo Compares{' '}
            <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-[#FF5722] via-[#FF7043] to-[#FFA000] bg-clip-text text-transparent">
              to Legacy Video Tools
            </span>
          </h2>

          {/* Punchy Visual Benefit Strips instead of dense text */}
          <div className="mt-5 flex flex-wrap items-center justify-center gap-2 sm:gap-3 text-xs sm:text-sm font-bold text-slate-700">
            <span className="inline-flex items-center gap-1.5 bg-emerald-500/10 text-emerald-800 border border-emerald-500/20 px-3 py-1 rounded-full">
              <Zap size={13} className="text-emerald-600" />
              Zero Laptop Lag
            </span>
            <span className="text-stone-300">•</span>
            <span className="inline-flex items-center gap-1.5 bg-orange-500/10 text-orange-800 border border-orange-500/20 px-3 py-1 rounded-full">
              <Coins size={13} className="text-[#FF5722]" />
              1 Min = 1 Credit
            </span>
            <span className="text-stone-300">•</span>
            <span className="inline-flex items-center gap-1.5 bg-blue-500/10 text-blue-800 border border-blue-500/20 px-3 py-1 rounded-full">
              <Languages size={13} className="text-blue-600" />
              Global Accents & Dialects
            </span>
          </div>
        </div>

        {/* ───────────────────────────────────────────────────────────── */}
        {/* DESKTOP COMPARISON MATRIX (Visual, SVG & Arrow Driven)       */}
        {/* ───────────────────────────────────────────────────────────── */}
        <div className="hidden lg:block overflow-hidden rounded-3xl border border-stone-200/90 bg-white shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
          {/* Header Row */}
          <div className="grid grid-cols-[1.2fr_1.4fr_1.1fr_1.1fr] border-b border-stone-200 bg-stone-50/80 text-left">
            <div className="p-5 font-black text-slate-900 text-sm flex items-center gap-2">
              <span>Capability</span>
            </div>

            {/* Itnavideo Column Header (Dominant Champion Look) */}
            <div className="p-5 bg-gradient-to-b from-orange-500/[0.12] to-orange-500/[0.05] border-x border-orange-500/25 relative flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-[#FF5722] to-[#FFA000] text-white shadow-xs">
                  <Zap size={15} className="fill-white" />
                </div>
                <div>
                  <div className="text-sm font-black text-slate-900 leading-tight">Itnavideo</div>
                  <div className="text-[11px] font-bold text-orange-600">Cloud AI Video Engine</div>
                </div>
              </div>
              <span className="rounded-full bg-gradient-to-r from-orange-600 to-amber-500 text-white px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider shadow-xs">
                Winner
              </span>
            </div>

            {/* CapCut Column Header */}
            <div className="p-5 text-left border-r border-stone-200/80">
              <div className="text-sm font-extrabold text-slate-900 leading-tight">CapCut / Desktop</div>
              <div className="text-[11px] font-medium text-slate-500">Heavy Local Timeline</div>
            </div>

            {/* Opus Clip / InVideo Header */}
            <div className="p-5 text-left">
              <div className="text-sm font-extrabold text-slate-900 leading-tight">Opus Clip &amp; InVideo</div>
              <div className="text-[11px] font-medium text-slate-500">Niche Repurposers</div>
            </div>
          </div>

          {/* Matrix Body Rows */}
          <div className="divide-y divide-stone-100">
            {COMPARISON_ROWS.map((row) => {
              const RowIcon = row.icon;
              return (
                <div
                  key={row.title}
                  className="grid grid-cols-[1.2fr_1.4fr_1.1fr_1.1fr] hover:bg-stone-50/40 transition-colors items-center"
                >
                  {/* Feature Title + SVG Icon */}
                  <div className="p-5 flex items-center gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-stone-100 border border-stone-200/80 text-slate-700">
                      <RowIcon size={17} />
                    </div>
                    <div>
                      <div className="text-sm font-extrabold text-slate-900">{row.title}</div>
                      <div className="text-[11px] font-mono font-medium text-slate-400 uppercase tracking-wider">
                        {row.category}
                      </div>
                    </div>
                  </div>

                  {/* Itnavideo (Champion Cell) with Glowing Badge & Arrow */}
                  <div className="p-5 bg-orange-500/[0.04] border-x border-orange-500/25 h-full flex flex-col justify-center">
                    <div className="flex items-center gap-2">
                      <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-500 text-white shadow-xs">
                        <Check size={12} strokeWidth={3} />
                      </div>
                      <span className="text-xs sm:text-sm font-extrabold text-slate-900">
                        {row.itnavideo.highlight}
                      </span>
                    </div>

                    <div className="mt-1.5 flex items-center gap-1.5 pl-7">
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-orange-700 bg-orange-500/15 border border-orange-500/25 px-2 py-0.5 rounded-md">
                        {row.itnavideo.badge}
                      </span>
                      <span className="text-[11px] text-slate-500 font-medium">
                        • {row.itnavideo.subtext}
                      </span>
                    </div>
                  </div>

                  {/* CapCut Cell (Clear Red Cross / Amber Warning + Punchy Tag) */}
                  <div className="p-5 border-r border-stone-200/80 h-full flex flex-col justify-center">
                    <div className="flex items-center gap-2">
                      {row.capcut.status === 'no' ? (
                        <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-rose-100 text-rose-600">
                          <X size={12} strokeWidth={3} />
                        </div>
                      ) : (
                        <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-amber-100 text-amber-600">
                          <span className="text-[11px] font-black">~</span>
                        </div>
                      )}
                      <span className="text-xs sm:text-[13px] font-bold text-slate-800">
                        {row.capcut.badge}
                      </span>
                    </div>
                    <p className="mt-1 pl-7 text-[11px] text-slate-500 font-medium">
                      {row.capcut.subtext}
                    </p>
                  </div>

                  {/* Opus Clip / InVideo Cell */}
                  <div className="p-5 h-full flex flex-col justify-center">
                    <div className="flex items-center gap-2">
                      {row.competitors.status === 'no' ? (
                        <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-rose-100 text-rose-600">
                          <X size={12} strokeWidth={3} />
                        </div>
                      ) : (
                        <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-amber-100 text-amber-600">
                          <span className="text-[11px] font-black">~</span>
                        </div>
                      )}
                      <span className="text-xs sm:text-[13px] font-bold text-slate-800">
                        {row.competitors.badge}
                      </span>
                    </div>
                    <p className="mt-1 pl-7 text-[11px] text-slate-500 font-medium">
                      {row.competitors.subtext}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ───────────────────────────────────────────────────────────── */}
        {/* MOBILE RESPONSIVE CARDS (Visual & Fast to Scan)              */}
        {/* ───────────────────────────────────────────────────────────── */}
        <div className="block lg:hidden space-y-4">
          {/* Mobile Switch Tabs */}
          <div className="flex items-center justify-center gap-2 p-1.5 bg-stone-100 rounded-full max-w-xs mx-auto mb-5">
            <button
              onClick={() => setSelectedMobileCompetitor('capcut')}
              className={`flex-1 py-1.5 px-3 rounded-full text-xs font-bold transition-all ${
                selectedMobileCompetitor === 'capcut'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-500'
              }`}
            >
              vs CapCut
            </button>
            <button
              onClick={() => setSelectedMobileCompetitor('competitors')}
              className={`flex-1 py-1.5 px-3 rounded-full text-xs font-bold transition-all ${
                selectedMobileCompetitor === 'competitors'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-500'
              }`}
            >
              vs Opus &amp; InVideo
            </button>
          </div>

          <div className="space-y-3">
            {COMPARISON_ROWS.map((row) => {
              const comp = row[selectedMobileCompetitor];
              const RowIcon = row.icon;
              return (
                <div
                  key={row.title}
                  className="rounded-2xl border border-stone-200/90 bg-white p-4 shadow-xs space-y-3"
                >
                  <div className="flex items-center gap-2.5 pb-2 border-b border-stone-100">
                    <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-orange-500/10 text-orange-600">
                      <RowIcon size={14} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-bold text-slate-900 truncate">{row.title}</h4>
                      <p className="text-[10px] font-mono text-slate-400 uppercase">{row.category}</p>
                    </div>
                  </div>

                  {/* Itnavideo Winner Pill */}
                  <div className="rounded-xl bg-orange-500/[0.06] border border-orange-500/25 p-3 flex items-start gap-2.5">
                    <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-500 text-white mt-0.5">
                      <Check size={12} strokeWidth={3} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-extrabold text-slate-900">
                          {row.itnavideo.highlight}
                        </span>
                        <span className="rounded bg-orange-500/15 text-orange-700 px-1.5 py-0.2 text-[9px] font-bold">
                          {row.itnavideo.badge}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-600 mt-0.5 font-medium">
                        {row.itnavideo.subtext}
                      </p>
                    </div>
                  </div>

                  {/* Competitor Pill */}
                  <div className="rounded-xl bg-stone-50 border border-stone-200/80 p-3 flex items-start gap-2.5">
                    {comp.status === 'no' ? (
                      <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-rose-100 text-rose-600 mt-0.5">
                        <X size={12} strokeWidth={3} />
                      </div>
                    ) : (
                      <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-amber-100 text-amber-600 mt-0.5">
                        <span className="text-[11px] font-bold">~</span>
                      </div>
                    )}
                    <div>
                      <span className="text-xs font-bold text-slate-800 block">
                        {comp.badge}
                      </span>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        {comp.subtext}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ───────────────────────────────────────────────────────────── */}
        {/* BOTTOM ACTION BANNER WITH ARROWS & GLOW                      */}
        {/* ───────────────────────────────────────────────────────────── */}
        <div className="mt-10 sm:mt-14 rounded-3xl bg-gradient-to-r from-[#FF5722] via-[#F4511E] to-[#FFA000] p-6 sm:p-8 text-white shadow-[0_16px_36px_-6px_rgba(255,87,34,0.4)] flex flex-col sm:flex-row items-center justify-between gap-5 text-center sm:text-left relative overflow-hidden">
          {/* Subtle background glow circle */}
          <div className="absolute right-0 top-0 h-64 w-64 bg-white/10 rounded-full blur-2xl pointer-events-none" />

          <div className="space-y-1.5 max-w-xl relative z-10">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-white/20 backdrop-blur-xs px-3 py-0.5 text-[11px] font-bold text-white mb-1">
              <Sparkles size={12} />
              <span>Cloud Rendering • Zero Laptop Burnout</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black leading-tight">
              Switch from laggy timelines to pure cloud speed.
            </h3>
            <p className="text-xs sm:text-sm text-orange-100 font-medium">
              Record audio on your phone ➔ Itnavideo creates the full video in seconds.
            </p>
          </div>

          <Link
            href="/dashboard"
            className="relative z-10 inline-flex items-center gap-2 rounded-full bg-white px-7 sm:px-9 py-3 sm:py-3.5 text-xs sm:text-sm font-black text-orange-600 hover:bg-orange-50 hover:scale-105 active:scale-95 transition-all shadow-md shrink-0 cursor-pointer"
          >
            <span>Start Creating Now</span>
            <ArrowRight size={15} strokeWidth={2.5} />
          </Link>
        </div>
      </div>
    </section>
  );
}
