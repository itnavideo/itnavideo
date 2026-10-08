'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Sparkles,
  ArrowRight,
  Brain,
  Highlighter,
  Palette,
  Languages,
  LayoutGrid,
  Zap,
  CheckCircle2,
  Clock,
  TrendingUp,
  HelpCircle,
  Play,
  Share2,
  FileText,
  Sliders,
  Award,
} from 'lucide-react';
import { WhiteboardPreview } from '@/components/preview/WhiteboardPreview';

export default function WhiteboardVideoDetail() {
  const [selectedBoard, setSelectedBoard] = useState('corporate-luxury');

  const boards = [
    { id: 'corporate-luxury', name: 'Executive Whiteboard' },
    { id: 'classroom', name: 'Academic Clean' },
    { id: 'dark-modern', name: 'Dark Studio' },
  ];

  return (
    <main className="min-h-screen text-[#E2E8F0] bg-[#0B0F19] selection:bg-[#FF6D00] selection:text-black">
      {/* ── M3 HERO SECTION (Google Analytics Dark Theme + Orange Heading) ── */}
      <section className="relative overflow-hidden px-4 pb-12 pt-28 sm:px-6 sm:pt-32">
        {/* Ambient Google Analytics Radial Glows */}
        <div className="pointer-events-none absolute left-1/2 top-16 -translate-x-1/2 -translate-y-1/2 h-[450px] w-[700px] rounded-full bg-gradient-to-tr from-[#FF6D00]/18 via-[#EA580C]/10 to-[#1D4ED8]/15 blur-[120px]" />
        <div className="pointer-events-none absolute right-10 top-60 h-[300px] w-[300px] rounded-full bg-[#FF8F00]/10 blur-[100px]" />

        <div className="relative mx-auto max-w-5xl text-center">
          {/* M3 Assist Tonal Chip */}
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#FF6D00]/30 bg-[#151E30]/90 px-4 py-1.5 text-xs font-semibold text-[#FFB74D] backdrop-blur-md shadow-lg shadow-[#FF6D00]/10">
            <Sparkles size={14} className="text-[#FF9100] animate-pulse" />
            <span>AI Whiteboard Studio • Drawing Hands, Stylus, Blueprint &amp; Dark Glass</span>
          </div>

          {/* Heading with Google Analytics Orange Gradient */}
          <h1 className="text-3xl font-black tracking-tight text-white sm:text-5xl md:text-6xl leading-[1.12]">
            Turn Any Voiceover Into An <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-[#FF6D00] via-[#FF8F00] to-[#FFA726] bg-clip-text text-transparent drop-shadow-sm">
              Interactive Whiteboard Reel
            </span>
          </h1>

          <p className="mx-auto mt-5 max-w-2xl text-sm sm:text-base leading-relaxed text-[#94A3B8]">
            AI analyzes your transcript and renders dynamic hand-drawn bullet points, blueprint schematics, or architect dark glass presentations with customizable realistic drawing hands, modern styluses, and executive marker colors.
          </p>

          {/* M3 Actions: Filled Orange Button + Outlined Surface Button */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/dashboard?videoType=whiteboard-video"
              className="inline-flex w-full sm:w-auto items-center justify-center gap-2.5 rounded-full bg-gradient-to-r from-[#FF6D00] to-[#FF8F00] px-8 py-3.5 text-sm font-black text-black shadow-xl shadow-[#FF6D00]/25 transition-all hover:brightness-110 hover:scale-[1.02] active:scale-95"
            >
              <span>Create Whiteboard Reel</span>
              <ArrowRight size={17} />
            </Link>

            <a
              href="#benefits"
              className="inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-full border border-[#243352] bg-[#151E30] px-6 py-3.5 text-sm font-semibold text-[#E2E8F0] hover:bg-[#1C2840] hover:border-[#FF6D00]/40 transition shadow-sm"
            >
              <Sliders size={15} className="text-[#FF9100]" />
              <span>Explore Benefits</span>
            </a>
          </div>

          {/* Metrics Trust Bar (Google Analytics Micro-Stats) */}
          <div className="mt-10 grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-3xl mx-auto border-t border-[#1C2840] pt-6 text-left">
            <div className="rounded-2xl bg-[#101726]/80 p-3 border border-[#1C2840]">
              <div className="text-xl sm:text-2xl font-black text-[#FF8F00]">+85%</div>
              <div className="text-[11px] text-[#94A3B8]">Higher Watch Retention</div>
            </div>
            <div className="rounded-2xl bg-[#101726]/80 p-3 border border-[#1C2840]">
              <div className="text-xl sm:text-2xl font-black text-[#38BDF8]">35 Sec</div>
              <div className="text-[11px] text-[#94A3B8]">Fast Cloud Rendering</div>
            </div>
            <div className="rounded-2xl bg-[#101726]/80 p-3 border border-[#1C2840]">
              <div className="text-xl sm:text-2xl font-black text-[#4ADE80]">Urdu RTL</div>
              <div className="text-[11px] text-[#94A3B8]">Nastaliq &amp; Hindi Fonts</div>
            </div>
            <div className="rounded-2xl bg-[#101726]/80 p-3 border border-[#1C2840]">
              <div className="text-xl sm:text-2xl font-black text-[#F43F5E]">15+ Icons</div>
              <div className="text-[11px] text-[#94A3B8]">Vector Doodle Library</div>
            </div>
          </div>
        </div>
      </section>

      {/* ── M3 COMPACT BENEFITS BENTO (SHORT SPACE, MAXIMUM IMPACT) ── */}
      <section id="benefits" className="px-4 py-10 sm:px-6">
        <div className="mx-auto max-w-5xl">
          {/* Section Header with Orange Accent */}
          <div className="mb-6 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-2 border-b border-[#1C2840] pb-4">
            <div>
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#FF9100]">
                Key Advantages • Fayde
              </span>
              <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white mt-1">
                Whiteboard Reels Ke <span className="text-[#FF8F00]">Top 6 Faide</span>
              </h2>
            </div>
            <p className="text-xs text-[#94A3B8] max-w-xs">
              Kam jagah me maximum impact: viewer ka dhyan har second screen par bandha rehta hai.
            </p>
          </div>

          {/* Compact 6-Card M3 Bento Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {/* Benefit 1 */}
            <div className="group rounded-3xl border border-[#1C2840] bg-[#101726] p-4.5 transition-all hover:border-[#FF6D00]/40 hover:bg-[#151E30] hover:shadow-lg hover:shadow-[#FF6D00]/5">
              <div className="flex items-center justify-between mb-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#FF6D00]/15 text-[#FF8F00] border border-[#FF6D00]/25 group-hover:scale-105 transition">
                  <Brain size={20} />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/25">
                  +85% Recall
                </span>
              </div>
              <h3 className="text-base font-bold text-white group-hover:text-[#FFB74D] transition">
                Zabardast Retention &amp; Focus
              </h3>
              <p className="mt-1.5 text-xs leading-relaxed text-[#94A3B8]">
                Talking head videos ke muqable whiteboard par likhe points viewer ke zehan me 3 guna zyada der tak rehte hain.
              </p>
            </div>

            {/* Benefit 2 */}
            <div className="group rounded-3xl border border-[#1C2840] bg-[#101726] p-4.5 transition-all hover:border-[#FF6D00]/40 hover:bg-[#151E30] hover:shadow-lg hover:shadow-[#FF6D00]/5">
              <div className="flex items-center justify-between mb-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-amber-500/15 text-amber-400 border border-amber-500/25 group-hover:scale-105 transition">
                  <Highlighter size={20} />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/25">
                  Hand &amp; Stylus
                </span>
              </div>
              <h3 className="text-base font-bold text-white group-hover:text-[#FFB74D] transition">
                Realistic Drawing Hand &amp; Stylus
              </h3>
              <p className="mt-1.5 text-xs leading-relaxed text-[#94A3B8]">
                Choose between Realistic Hand sketch strokes, Modern Tablet Stylus, or Direct Line animation with real-time speech highlighter sync.
              </p>
            </div>

            {/* Benefit 3 */}
            <div className="group rounded-3xl border border-[#1C2840] bg-[#101726] p-4.5 transition-all hover:border-[#FF6D00]/40 hover:bg-[#151E30] hover:shadow-lg hover:shadow-[#FF6D00]/5">
              <div className="flex items-center justify-between mb-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-blue-500/15 text-blue-400 border border-blue-500/25 group-hover:scale-105 transition">
                  <Palette size={20} />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-300 border border-blue-500/25">
                  Studio Surfaces
                </span>
              </div>
              <h3 className="text-base font-bold text-white group-hover:text-[#FFB74D] transition">
                3 Board Surfaces &amp; Marker Palettes
              </h3>
              <p className="mt-1.5 text-xs leading-relaxed text-[#94A3B8]">
                Switch effortlessly between Classic Whiteboard, Architect Dark Glass, and Blueprint Grid with Navy Blue, Crimson, Emerald, and Gold markers.
              </p>
            </div>

            {/* Benefit 4 */}
            <div className="group rounded-3xl border border-[#1C2840] bg-[#101726] p-4.5 transition-all hover:border-[#FF6D00]/40 hover:bg-[#151E30] hover:shadow-lg hover:shadow-[#FF6D00]/5">
              <div className="flex items-center justify-between mb-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-500/15 text-emerald-400 border border-emerald-500/25 group-hover:scale-105 transition">
                  <Languages size={20} />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/25">
                  Urdu / Hindi
                </span>
              </div>
              <h3 className="text-base font-bold text-white group-hover:text-[#FFB74D] transition">
                Full Nastaliq &amp; RTL Support
              </h3>
              <p className="mt-1.5 text-xs leading-relaxed text-[#94A3B8]">
                Urdu script ke liye Noto Nastaliq font aur 2.2 line-spacing use hoti hai taake text bina kate bilkul saaf dikhe.
              </p>
            </div>

            {/* Benefit 5 */}
            <div className="group rounded-3xl border border-[#1C2840] bg-[#101726] p-4.5 transition-all hover:border-[#FF6D00]/40 hover:bg-[#151E30] hover:shadow-lg hover:shadow-[#FF6D00]/5">
              <div className="flex items-center justify-between mb-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-purple-500/15 text-purple-400 border border-purple-500/25 group-hover:scale-105 transition">
                  <LayoutGrid size={20} />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-300 border border-purple-500/25">
                  Quiz &amp; Table
                </span>
              </div>
              <h3 className="text-base font-bold text-white group-hover:text-[#FFB74D] transition">
                Dynamic 9:16 Layouts
              </h3>
              <p className="mt-1.5 text-xs leading-relaxed text-[#94A3B8]">
                Islamic Quiz countdown bar ke sath, ya Naam aur Lucky Stone ka table — AI topic samajh kar layout khud chunta hai.
              </p>
            </div>

            {/* Benefit 6 */}
            <div className="group rounded-3xl border border-[#1C2840] bg-[#101726] p-4.5 transition-all hover:border-[#FF6D00]/40 hover:bg-[#151E30] hover:shadow-lg hover:shadow-[#FF6D00]/5">
              <div className="flex items-center justify-between mb-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-rose-500/15 text-rose-400 border border-rose-500/25 group-hover:scale-105 transition">
                  <Zap size={20} />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-300 border border-rose-500/25">
                  100% Automated
                </span>
              </div>
              <h3 className="text-base font-bold text-white group-hover:text-[#FFB74D] transition">
                Zero Video Editing Skill
              </h3>
              <p className="mt-1.5 text-xs leading-relaxed text-[#94A3B8]">
                Sirf audio upload karein — keypoints extraction se lekar 1080p vertical video render tak sab cloud par hota hai.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── M3 INTERACTIVE BOARD PREVIEW & PLAYGROUND ── */}
      <section className="px-4 py-8 sm:px-6">
        <div className="mx-auto max-w-5xl rounded-3xl border border-[#1C2840] bg-[#101726]/90 p-5 sm:p-8 backdrop-blur-xl">
          <div className="flex flex-col md:flex-row items-center gap-8">
            {/* Left: Controls & Context */}
            <div className="w-full md:w-1/2">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#FF9100]">
                Live Remotion Engine
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-white mt-1">
                Executive 9:16 Canvas <span className="text-[#FF8F00]">Preview</span>
              </h2>
              <p className="mt-3 text-xs sm:text-sm text-[#94A3B8] leading-relaxed">
                Neeche switch karke dekhein ke hamara board styling aur highlight animation 9:16 mobile frame me kitna crisp dikhta hai:
              </p>

              {/* Board Style Selector Chips */}
              <div className="mt-5 flex flex-wrap gap-2">
                {boards.map((b) => (
                  <button
                    key={b.id}
                    onClick={() => setSelectedBoard(b.id)}
                    className={`rounded-full px-4 py-2 text-xs font-bold transition-all ${
                      selectedBoard === b.id
                        ? 'bg-[#FF6D00] text-black shadow-md shadow-[#FF6D00]/25'
                        : 'bg-[#151E30] text-[#94A3B8] border border-[#243352] hover:text-white hover:bg-[#1C2840]'
                    }`}
                  >
                    {b.name}
                  </button>
                ))}
              </div>

              {/* Checklist */}
              <div className="mt-6 space-y-2 text-xs text-[#94A3B8]">
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={15} className="text-[#FF8F00]" />
                  <span>Real Vector SVGs with yellow pill accent</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={15} className="text-[#FF8F00]" />
                  <span>Safe margins for TikTok &amp; Instagram UI icons</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={15} className="text-[#FF8F00]" />
                  <span>Multi-board transitions for long voiceovers</span>
                </div>
              </div>

              <div className="mt-6">
                <Link
                  href="/dashboard?videoType=whiteboard-video"
                  className="inline-flex items-center gap-2 rounded-full bg-[#151E30] border border-[#FF6D00]/40 px-5 py-2.5 text-xs font-bold text-[#FFB74D] hover:bg-[#1C2840] transition"
                >
                  <span>Launch Generator in Dashboard</span>
                  <ArrowRight size={14} />
                </Link>
              </div>
            </div>

            {/* Right: Embedded Remotion 9:16 Live Player */}
            <div className="w-full md:w-1/2 flex justify-center">
              <div className="w-full max-w-[280px]">
                <WhiteboardPreview board={selectedBoard} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 3-STEP WORKFLOW (Google Analytics Card Aesthetics) ── */}
      <section className="px-4 py-10 sm:px-6">
        <div className="mx-auto max-w-5xl">
          <div className="text-center max-w-2xl mx-auto mb-8">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#FF9100]">
              Automated Pipeline
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-white mt-1">
              3 Simple Steps Me <span className="text-[#FF8F00]">Video Ready</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="rounded-3xl border border-[#1C2840] bg-[#101726] p-6 relative">
              <div className="text-4xl font-black text-[#1C2840] mb-2 font-mono">01</div>
              <h3 className="text-lg font-bold text-white mb-2">Upload Audio / Voice</h3>
              <p className="text-xs text-[#94A3B8] leading-relaxed">
                Apna Urdu, Hindi ya English voiceover dalen. Microphone se record karein ya WhatsApp audio file upload karein.
              </p>
            </div>

            <div className="rounded-3xl border border-[#FF6D00]/30 bg-[#151E30] p-6 relative shadow-lg shadow-[#FF6D00]/5">
              <div className="text-4xl font-black text-[#FF6D00]/25 mb-2 font-mono">02</div>
              <h3 className="text-lg font-bold text-[#FFB74D] mb-2">AI Planner &amp; Icons</h3>
              <p className="text-xs text-[#94A3B8] leading-relaxed">
                AI Planner key points banata hai, vector doodle icons match karta hai aur yellow spoken timestamps set karta hai.
              </p>
            </div>

            <div className="rounded-3xl border border-[#1C2840] bg-[#101726] p-6 relative">
              <div className="text-4xl font-black text-[#1C2840] mb-2 font-mono">03</div>
              <h3 className="text-lg font-bold text-white mb-2">Download 1080p MP4</h3>
              <p className="text-xs text-[#94A3B8] leading-relaxed">
                Cloud Remotion engine 35 seconds me 9:16 vertical video render karke de deta hai, direct TikTok/Shorts par post karein.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── M3 BOTTOM CTA BANNER ── */}
      <section className="px-4 pb-20 pt-6 sm:px-6">
        <div className="mx-auto max-w-5xl rounded-3xl border border-[#FF6D00]/30 bg-gradient-to-b from-[#151E30] to-[#0B0F19] p-8 text-center relative overflow-hidden shadow-2xl shadow-[#FF6D00]/10">
          <div className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 h-48 w-96 rounded-full bg-[#FF6D00]/20 blur-3xl" />
          
          <h2 className="text-2xl sm:text-4xl font-black text-white relative">
            Start Creating <span className="text-[#FF8F00]">Whiteboard Reels Today</span>
          </h2>
          <p className="mt-3 text-xs sm:text-sm text-[#94A3B8] max-w-xl mx-auto relative">
            Kisi software ya keyframing ki zaroorat nahi. 1-click me audio se whiteboard explainer video banayein.
          </p>

          <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3 relative">
            <Link
              href="/dashboard?videoType=whiteboard-video"
              className="inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#FF6D00] to-[#FF8F00] px-8 py-3.5 text-sm font-black text-black shadow-lg shadow-[#FF6D00]/30 hover:brightness-110 transition active:scale-95"
            >
              <span>Launch Whiteboard Creator</span>
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}

