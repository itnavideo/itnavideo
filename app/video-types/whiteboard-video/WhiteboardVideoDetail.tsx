'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import ExploreMoreVideoTools from '@/components/landing/ExploreMoreVideoTools';
import {
  Sparkles,
  ArrowRight,
  Brain,
  Highlighter,
  Palette,
  Zap,
  CheckCircle2,
  Clock,
  Play,
  FileText,
  Sliders,
  ChevronDown,
  BarChart3,
  ShieldCheck,
  PenTool,
  Award,
  Users,
  GraduationCap,
  Briefcase,
  Layers,
} from 'lucide-react';

export default function WhiteboardVideoDetail() {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);
  const [activeBoardStyle, setActiveBoardStyle] = useState<'executive' | 'dark' | 'blueprint'>('executive');

  const toggleFaq = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  const faqData = [
    {
      q: 'What is an AI Whiteboard Explainer Video?',
      a: 'An AI Whiteboard Explainer video transforms spoken voiceover or lesson audio into engaging hand-drawn bullet points, diagrams, and summary cards. As you speak, a realistic drawing hand or digital stylus draws text, icons, and underline highlights onto the screen in real-time, perfectly synced to your voice.',
    },
    {
      q: 'How does Itnavideo extract key bullet points automatically from voice recordings?',
      a: 'Our AI planner transcribes speech with millisecond word-level timestamps, detects core concept boundaries, distills long sentences into punchy 3-to-5 word takeaway notes, and automatically generates drawing stroke coordinates synchronized to your speech tempo.',
    },
    {
      q: 'Do I need drawing skills or complex animation software like VideoScribe or Doodly?',
      a: 'Zero drawing skills or software downloads are needed. Traditional tools force you to search for SVG icon libraries, trace lines manually, and align audio clips on multi-track timelines for 5+ hours. Itnavideo handles all drawing layout and motion automatically in the cloud.',
    },
    {
      q: 'What whiteboard board themes and marker colors are available?',
      a: 'You can choose from multiple board themes: Executive Classic Whiteboard (crisp white with marker ink), Dark Glass Studio (high-tech neon markers), and Blueprint Schematic (architectural grid). You can also toggle between a realistic human hand or a sleek digital stylus.',
    },
    {
      q: 'What is the video format, duration, and credit cost?',
      a: 'Whiteboard videos are generated in 9:16 Vertical format (1080×1920) up to 90 seconds (90s) long, ideal for Instagram Reels, YouTube Shorts, and TikTok. Each video costs strictly 1 Credit.',
    },
    {
      q: 'Why do hand-drawn whiteboard videos get higher retention?',
      a: 'Cognitive psychology shows that human attention is naturally drawn to anticipation. Watching a hand draw a line or letter keeps the viewer guessing what comes next, boosting concept recall by over 15% compared to static slides.',
    },
    {
      q: 'Can I monetize whiteboard videos on YouTube and social channels?',
      a: 'Yes! All videos generated on Itnavideo come with full commercial rights. You own the content 100% and can monetize it on YouTube, TikTok, online courses, or client projects.',
    },
    {
      q: 'How fast is the rendering process?',
      a: 'Because rendering runs on high-performance AWS cloud servers, a complete 9:16 whiteboard video renders in approximately 25 to 35 seconds—with zero laptop CPU strain.',
    },
    {
      q: 'Can I upload voiceover audio or video longer than 90 seconds?',
      a: 'Yes! In accordance with Itnavideo’s universal upload standard, recordings of any length (1 minute, 2 minutes, 3 minutes) are accepted without upload rejection. The cloud engine automatically takes the first 90 seconds (0:00 to 1:30) of your recording to generate the whiteboard animation timeline.',
    },
    {
      q: 'How does the AI determine which core words to illustrate with hand-drawn marker strokes?',
      a: 'Our AI lesson director analyzes speech emphasis, vocal pauses, and key nouns in your audio track. It filters out conversational filler and selectively highlights 3 to 5 core takeaway points per scene with animated circles, underlines, and hand-drawn checkmarks, ensuring students and viewers retain the central insight.',
    },
  ];

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqData.map((faq) => ({
      '@type': 'Question',
      name: faq.q,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.a,
      },
    })),
  };

  const softwareSchema = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'Itnavideo AI Whiteboard Explainer Studio',
    operatingSystem: 'Web-based Cloud Platform',
    applicationCategory: 'MultimediaApplication',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
    description: 'Transform speech and scripts into interactive hand-drawn whiteboard explainer videos with drawing hands, blueprint themes, and auto concept notes.',
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans antialiased selection:bg-[#FF5722]/20">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareSchema) }} />

      {/* ─── 1. HERO SECTION (NO EYEBROW PILL BADGES — CLEAN ENTERPRISE BRAND) ─── */}
      <section className="relative overflow-hidden pt-12 pb-20 sm:pt-16 sm:pb-28 border-b border-slate-100 bg-gradient-to-b from-[#FFFBF9] via-white to-white">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 text-center">
          
          {/* Main Headline */}
          <h1 className="text-4xl font-black tracking-tight text-slate-900 sm:text-6xl md:text-7xl leading-[1.12] max-w-5xl mx-auto font-sans">
            Turn Any Voiceover Into An{' '}
            <span className="bg-gradient-to-r from-[#FF5722] via-[#FF7043] to-[#FFA000] bg-clip-text text-transparent">
              Interactive Whiteboard Video
            </span>
          </h1>

          {/* Sub-headline */}
          <p className="mt-6 text-lg sm:text-xl text-slate-600 leading-relaxed font-normal max-w-3xl mx-auto">
            Stop presenting dry, static slides. AI automatically extracts key takeaways from your speech and renders dynamic hand-drawn notes, schematics, and marker highlights in real-time.
          </p>

          {/* Action Buttons */}
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/dashboard/whiteboard-video"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 rounded-2xl bg-gradient-to-r from-[#FF5722] via-[#FF7043] to-[#FFA000] px-8 py-4 text-base font-black text-white shadow-xl shadow-orange-500/25 hover:shadow-orange-500/40 hover:brightness-110 active:scale-95 transition-all duration-200"
            >
              <Sparkles size={18} className="fill-white stroke-white" />
              <span>Create Whiteboard Video Free</span>
              <ArrowRight size={18} />
            </Link>
            <Link
              href="/pricing"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-8 py-4 text-base font-bold text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition shadow-xs"
            >
              <span>View Pricing &amp; Packs</span>
            </Link>
          </div>

          {/* Trust Guarantees */}
          <div className="mt-12 flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-xs sm:text-sm font-semibold text-slate-500 border-t border-slate-100 pt-8">
            <div className="flex items-center gap-2">
              <CheckCircle2 size={16} className="text-[#FF5722]" />
              <span>9:16 Vertical Format</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 size={16} className="text-[#FF5722]" />
              <span>1 Credit / Video</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 size={16} className="text-[#FF5722]" />
              <span>Realistic Hand &amp; Stylus Motion</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 size={16} className="text-[#FF5722]" />
              <span>1080p 60 FPS Export</span>
            </div>
          </div>
        </div>
      </section>

      {/* ─── 2. INTERACTIVE WHITEBOARD PREVIEW SHOWCASE ─── */}
      <section className="py-16 sm:py-24 bg-slate-50/70 border-b border-slate-100">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
              Anticipatory Visual Learning in Action
            </h2>
            <p className="mt-3 text-base text-slate-600">
              Real-time line drawing holds viewer curiosity by continuously revealing ideas line-by-line.
            </p>
          </div>

          {/* Interactive Board Showcase Container */}
          <div className="rounded-3xl border border-slate-200/90 bg-white p-4 sm:p-8 shadow-xl shadow-slate-200/50">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              
              {/* Left Column: Style Controller */}
              <div className="lg:col-span-5 space-y-4">
                <span className="text-xs font-black uppercase tracking-wider text-slate-500 block px-1">
                  Choose Board Style
                </span>

                <button
                  type="button"
                  onClick={() => setActiveBoardStyle('executive')}
                  className={`w-full text-left p-4 rounded-2xl border transition-all cursor-pointer ${
                    activeBoardStyle === 'executive'
                      ? 'border-[#FF5722] bg-orange-50/50 shadow-sm'
                      : 'border-slate-200 bg-white hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-slate-900">1. Executive Classic Whiteboard</span>
                    <span className="text-[11px] font-black text-[#FF5722]">Popular</span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    Crisp white canvas with bold black and amber marker strokes. Clean for corporate and finance.
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveBoardStyle('dark')}
                  className={`w-full text-left p-4 rounded-2xl border transition-all cursor-pointer ${
                    activeBoardStyle === 'dark'
                      ? 'border-[#FF5722] bg-orange-50/50 shadow-sm'
                      : 'border-slate-200 bg-white hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-slate-900">2. Dark Glass Studio</span>
                    <span className="text-[11px] font-bold text-slate-400">Modern</span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    Obsidian dark backdrop with illuminated neon marker lines. High-tech for SaaS &amp; coding.
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveBoardStyle('blueprint')}
                  className={`w-full text-left p-4 rounded-2xl border transition-all cursor-pointer ${
                    activeBoardStyle === 'blueprint'
                      ? 'border-[#FF5722] bg-orange-50/50 shadow-sm'
                      : 'border-slate-200 bg-white hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-slate-900">3. Blueprint Schematic</span>
                    <span className="text-[11px] font-bold text-slate-400">Technical</span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    Cobalt blue architectural grid paper with chalk-white technical sketches.
                  </p>
                </button>
              </div>

              {/* Right Column: 9:16 Whiteboard Canvas Mockup */}
              <div className="lg:col-span-7 flex flex-col items-center justify-center p-6 bg-slate-100/80 rounded-2xl">
                <span className="text-xs font-black uppercase tracking-wider text-slate-600 mb-3">
                  📱 9:16 Vertical Explainer Preview (1080×1920)
                </span>

                {/* Vertical Phone Board */}
                <div
                  className={`w-[240px] sm:w-[260px] aspect-[9/16] rounded-2xl border-2 shadow-2xl relative overflow-hidden flex flex-col justify-between p-4 transition-all duration-300 ${
                    activeBoardStyle === 'executive'
                      ? 'bg-white border-slate-300 text-slate-900'
                      : activeBoardStyle === 'dark'
                      ? 'bg-[#0E1526] border-slate-700 text-white'
                      : 'bg-[#1E3A8A] border-blue-400 text-white'
                  }`}
                >
                  {/* Top Lesson Title */}
                  <div className="border-b border-current/10 pb-2">
                    <span className="text-[10px] font-black uppercase tracking-wider opacity-60">Lesson Concept</span>
                    <p className="text-xs font-bold leading-tight mt-0.5">How Compound Interest Works</p>
                  </div>

                  {/* Hand-Drawn Bullet Notes */}
                  <div className="my-auto space-y-3 font-mono text-[11px]">
                    <div className="flex items-start gap-1.5">
                      <span className="text-[#FF5722] font-black">✓</span>
                      <span>Principle Invested</span>
                    </div>
                    <div className="flex items-start gap-1.5">
                      <span className="text-[#FF5722] font-black">✓</span>
                      <span>Exponential Growth Curve</span>
                    </div>
                    <div className="flex items-start gap-1.5 font-bold">
                      <span className="text-[#FF5722] font-black">✓</span>
                      <span className="underline decoration-[#FF5722] decoration-wavy underline-offset-4">Time in Market &gt; Timing</span>
                    </div>

                    {/* Simulated Drawing Hand Icon */}
                    <div className="pt-2 flex items-center justify-end">
                      <div className="flex items-center gap-1.5 text-[10px] font-bold text-[#FF5722] bg-orange-50 px-2 py-1 rounded-full border border-orange-200">
                        <span>✍️</span>
                        <span>Drawing Live...</span>
                      </div>
                    </div>
                  </div>

                  {/* Bottom Audio Sync Indicator */}
                  <div className="rounded-lg bg-black/5 dark:bg-white/5 p-2 text-center text-[10px] opacity-75">
                    Synced to Voiceover Tempo • 1080p
                  </div>
                </div>

                <div className="mt-4 flex items-center gap-2 text-xs font-semibold text-slate-500">
                  <CheckCircle2 size={14} className="text-emerald-500" />
                  <span>100% Automated SVG Drawing Coordinate Paths</span>
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* ─── 3. HOW IT WORKS (3 SIMPLE STEPS) ─── */}
      <section className="py-16 sm:py-24 border-b border-slate-100">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
              How It Works in 3 Simple Steps
            </h2>
            <p className="mt-3 text-base text-slate-600">
              Go from a raw voice recording to a finished hand-drawn explainer video in seconds.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="rounded-3xl border border-slate-200/90 bg-white p-7 shadow-xs">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-50 text-[#FF5722] font-black text-lg mb-5 border border-orange-200/60">
                1
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Upload Speech Audio</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Upload your voiceover recording (MP3, WAV up to 90 seconds) or type in your explanation script.
              </p>
            </div>

            <div className="rounded-3xl border border-slate-200/90 bg-white p-7 shadow-xs">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-50 text-[#FF5722] font-black text-lg mb-5 border border-orange-200/60">
                2
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Pick Board &amp; Marker Style</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Choose Executive Whiteboard, Dark Glass Studio, or Blueprint schematic with your preferred drawing hand or stylus.
              </p>
            </div>

            <div className="rounded-3xl border border-slate-200/90 bg-white p-7 shadow-xs">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-50 text-[#FF5722] font-black text-lg mb-5 border border-orange-200/60">
                3
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Export 1080p Video</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Download a clean, high-definition 9:16 whiteboard explainer video rendered in under 35 seconds for 1 credit.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ─── 4. CORE CAPABILITIES (6 FEATURE CARDS) ─── */}
      <section className="py-16 sm:py-24 bg-slate-50/60 border-b border-slate-100">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
              Why Creators Choose Itnavideo Whiteboard
            </h2>
            <p className="mt-3 text-base text-slate-600">
              Designed to make educational and explainer content effortlessly clear and engaging.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-2xs">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-100 text-[#FF5722] mb-4">
                <Brain size={20} />
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-1.5">15%+ Higher Concept Recall</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Watching concepts drawn line-by-line locks viewer focus and increases information retention.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-2xs">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-100 text-[#FF5722] mb-4">
                <Highlighter size={20} />
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-1.5">Auto Concept Summarization</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                AI distills long dialogue into punchy 3-to-5 word takeaway notes drawing on screen.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-2xs">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-100 text-[#FF5722] mb-4">
                <Palette size={20} />
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-1.5">Executive Board Themes</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Classic Whiteboard, Dark Glass Studio, and Blueprint Schematics for professional presentations.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-2xs">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-100 text-[#FF5722] mb-4">
                <PenTool size={20} />
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-1.5">0% Manual Drawing Needed</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                No vector point tracing or pen stroke definition. AI handles all path coordinates automatically.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-2xs">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-100 text-[#FF5722] mb-4">
                <Clock size={20} />
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-1.5">35-Second Cloud Render</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                AWS cloud rendering exports full 1080p MP4 files in seconds with zero laptop heating or memory strain.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-2xs">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-100 text-[#FF5722] mb-4">
                <Zap size={20} />
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-1.5">Predictable 1 Credit / Video</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Flat 1 Credit rate for each vertical whiteboard video up to 90 seconds. Full commercial rights.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ─── 5. WHO IS IT BUILT FOR (CREATOR USE CASES) ─── */}
      <section className="py-16 sm:py-24 border-b border-slate-100">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
              Who Uses Whiteboard Explainers?
            </h2>
            <p className="mt-3 text-base text-slate-600">
              Ideal for educators, advisors, and creators breaking down complex topics.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-50 text-purple-600 mb-3">
                <GraduationCap size={20} />
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-2">Educators &amp; Teachers</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Make online lessons, science principles, and history topics visual and memorable for students.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 mb-3">
                <BarChart3 size={20} />
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-2">Finance &amp; Investing</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Explain taxes, compound interest, stock portfolios, and banking concepts with clear drawn graphs.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600 mb-3">
                <Briefcase size={20} />
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-2">Consultants &amp; Coaches</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Demonstrate client frameworks, sales roadmaps, and business strategies without dry PowerPoint slides.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-600 mb-3">
                <Users size={20} />
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-2">Social Creators</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Create viral educational Shorts and Reels that answer popular questions and build follower authority.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ─── 6. COMPARISON MATRIX (LEGACY DOODLY VS ITNAVIDEO) ─── */}
      <section className="py-16 sm:py-24 bg-slate-50/70 border-b border-slate-100">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
              Legacy Doodly / VideoScribe vs. Itnavideo AI
            </h2>
            <p className="mt-2 text-sm text-slate-600">
              Why modern creators are switching from heavy desktop software to cloud AI generation.
            </p>
          </div>

          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead className="border-b border-slate-200 bg-slate-100/70 text-slate-700">
                  <tr>
                    <th className="p-4 font-bold">Feature / Capability</th>
                    <th className="p-4 font-bold text-rose-600">Legacy Desktop Software</th>
                    <th className="p-4 font-bold text-[#FF5722]">Itnavideo Whiteboard Studio</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  <tr>
                    <td className="p-4 font-semibold text-slate-900">Script Summarization</td>
                    <td className="p-4 text-slate-500">Manual typing line-by-line</td>
                    <td className="p-4 font-bold text-emerald-600">AI auto distills core bullet takeaways</td>
                  </tr>
                  <tr>
                    <td className="p-4 font-semibold text-slate-900">Drawing Path Setup</td>
                    <td className="p-4 text-slate-500">Manual SVG vector tracing (hours)</td>
                    <td className="p-4 font-bold text-emerald-600">100% Automated drawing path generation</td>
                  </tr>
                  <tr>
                    <td className="p-4 font-semibold text-slate-900">Audio Tempo Synchronization</td>
                    <td className="p-4 text-slate-500">Manual frame-by-frame speed nudging</td>
                    <td className="p-4 font-bold text-emerald-600">Word timestamp-driven drawing speed</td>
                  </tr>
                  <tr>
                    <td className="p-4 font-semibold text-slate-900">Aesthetics &amp; Themes</td>
                    <td className="p-4 text-slate-500">Cheesy 2010 cartoon clip art</td>
                    <td className="p-4 font-bold text-emerald-600">Executive Classic, Dark Glass &amp; Blueprint</td>
                  </tr>
                  <tr>
                    <td className="p-4 font-semibold text-slate-900">Computer Performance</td>
                    <td className="p-4 text-slate-500">Heavy laptop CPU drain &amp; crashes</td>
                    <td className="p-4 font-bold text-emerald-600">100% Cloud rendering (runs in browser)</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* ─── 7. FAQ ACCORDION ─── */}
      <section className="py-16 sm:py-24 border-b border-slate-100">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="space-y-3">
            {faqData.map((faq, idx) => {
              const isOpen = openFaqIndex === idx;
              return (
                <div key={idx} className="rounded-2xl border border-slate-200/90 bg-white overflow-hidden shadow-2xs">
                  <button
                    type="button"
                    onClick={() => toggleFaq(idx)}
                    className="w-full flex items-center justify-between p-5 text-left transition cursor-pointer"
                  >
                    <span className="text-sm sm:text-base font-bold text-slate-900 pr-4">{faq.q}</span>
                    <div className={`flex h-7 w-7 items-center justify-center rounded-full bg-slate-100 text-slate-600 transition-transform ${isOpen ? 'rotate-180 bg-orange-100 text-[#FF5722]' : ''}`}>
                      <ChevronDown size={16} />
                    </div>
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-5 text-slate-600 text-xs sm:text-sm leading-relaxed border-t border-slate-100 pt-3">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─── 8. BOTTOM HIGH-IMPACT ACTION BANNER ─── */}
      <section className="py-16 sm:py-20 bg-gradient-to-r from-orange-50 via-amber-50/50 to-orange-50/80 text-center">
        <div className="mx-auto max-w-4xl px-4">
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 mb-4">
            Create Your First Whiteboard Video Free
          </h2>
          <p className="text-slate-600 text-base max-w-xl mx-auto mb-8">
            Transform dry spoken lessons into captivating hand-drawn explainer videos in under 35 seconds.
          </p>
          <Link
            href="/dashboard/whiteboard-video"
            className="inline-flex items-center gap-2.5 rounded-2xl bg-gradient-to-r from-[#FF5722] via-[#FF7043] to-[#FFA000] px-8 py-4 text-base font-black text-white shadow-xl shadow-orange-500/25 hover:shadow-orange-500/40 hover:brightness-110 active:scale-95 transition-all duration-200"
          >
            <Sparkles size={18} className="fill-white stroke-white" />
            <span>Open Whiteboard Studio Free</span>
            <ArrowRight size={18} />
          </Link>
        </div>
      </section>

      {/* EXPLORE ALL 14 OTHER VIDEO TOOLS */}
      <ExploreMoreVideoTools currentToolId="whiteboard" />
    </div>
  );
}
