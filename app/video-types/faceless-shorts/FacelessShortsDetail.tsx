'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Sparkles,
  ArrowRight,
  Tv,
  Zap,
  CheckCircle2,
  Clock,
  Play,
  FileText,
  Sliders,
  ChevronDown,
  BarChart3,
  Flame,
  Award,
  Layers,
  Smartphone,
  TrendingUp,
  MessageSquare,
  Wand2,
  ShieldCheck,
  Check,
  X,
} from 'lucide-react';

export default function FacelessShortsDetail() {
  const [activeScene, setActiveScene] = useState<'chart' | 'typography' | 'svg' | 'social'>('chart');
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const toggleFaq = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  const faqData = [
    {
      q: "What is the Faceless Shorts AI Generator?",
      a: "The Faceless Shorts AI Generator transforms voiceover recordings and scripts into viral 9:16 vertical short-form videos. Our story-first AI engine analyzes your narration to dynamically deploy animated data charts, scalable SVG illustrations, and kinetic typography—keeping viewers hooked without requiring you to appear on camera."
    },
    {
      q: "How does this differ from generic AI video generators?",
      a: "Generic AI tools simply slap random stock video footage over subtitles. Our engine uses semantic visual intelligence: if you mention financial growth, it animates a rising line graph; if you explain a numbered sequence, it creates structured cards; if you mention technical ideas, it draws clean vector diagrams."
    },
    {
      q: "How many credits does a Faceless Short cost?",
      a: "Every 9:16 vertical Faceless Short (up to 90 seconds, 1080x1920 30 FPS MP4) costs strictly 1 credit. There are zero extra charges for motion graphics or 1080p cloud rendering."
    },
    {
      q: "Do I need video editing or motion graphics skills?",
      a: "Zero editing experience is required. Creating custom animated charts, vector graphics, and kinetic typography in Adobe After Effects takes 4 to 6 hours per short. Itnavideo builds and renders the entire short in under 30 seconds."
    },
    {
      q: "Are the graphics safe from TikTok and Instagram UI overlays?",
      a: "Yes. All animations, data charts, and kinetic subtitles are calculated inside 9:16 mobile safe zones, ensuring TikTok, Reels, and Shorts interface icons never cover critical visuals or words."
    },
    {
      q: "What niches perform best with Faceless Shorts?",
      a: "Personal finance and investing, psychology and stoicism, business case studies, technology breakdowns, and historical facts consistently achieve massive organic reach and viral retention rates."
    },
    {
      q: "Can I customize the colors and font styles?",
      a: "Yes. You can customize the color palette, typography font, subtitle highlight colors (yellow, green, cyan), and motion speed in the studio before rendering."
    },
    {
      q: "What video length and resolution are exported?",
      a: "Videos are exported in full 1080p HD (1080x1920 at 30 FPS MP4) optimized for Instagram Reels, YouTube Shorts, and TikTok, supporting durations up to 90 seconds."
    }
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
    name: 'Itnavideo Faceless Shorts AI Generator',
    operatingSystem: 'Web-based App',
    applicationCategory: 'MultimediaApplication',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
    description: 'Transform voiceovers into viral 9:16 vertical short-form videos with animated charts, clean SVGs, and kinetic typography.',
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-indigo-100 selection:text-indigo-900">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareSchema) }}
      />

      {/* HERO SECTION */}
      <section className="relative overflow-hidden pt-16 pb-20 lg:pt-24 lg:pb-28 border-b border-slate-100 bg-gradient-to-b from-slate-50/70 via-white to-white">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-6xl lg:text-7xl leading-[1.1] max-w-5xl mx-auto">
            Generate Viral Faceless Shorts with Story-First Motion Graphics
          </h1>

          <p className="mt-6 text-lg sm:text-xl text-slate-600 leading-relaxed font-normal max-w-3xl mx-auto">
            Transform voiceovers into high-retention 9:16 vertical reels. The AI engine dynamically animates upward data charts, scalable vector graphics, and kinetic typography to keep viewers hooked for up to 90 seconds without showing your face.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/dashboard?mode=facelessShorts"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 rounded-xl bg-slate-900 px-8 py-4 text-base font-semibold text-white shadow-xl shadow-slate-900/10 hover:bg-slate-800 transition active:scale-95"
            >
              <Play size={18} className="fill-white" />
              <span>Create Faceless Shorts Free</span>
            </Link>
            <a
              href="#shorts-studio"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-8 py-4 text-base font-semibold text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition"
            >
              <Smartphone size={18} className="text-indigo-600" />
              <span>Explore Motion Graphics Studio</span>
            </a>
          </div>

          {/* Quick trust metrics */}
          <div className="mt-12 flex flex-wrap items-center justify-center gap-8 text-xs sm:text-sm font-medium text-slate-500 border-t border-slate-100 pt-8">
            <div className="flex items-center gap-2">
              <CheckCircle2 size={16} className="text-emerald-600" />
              <span>Dynamic Animated Data Charts</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 size={16} className="text-emerald-600" />
              <span>Clean Scalable Vector Graphics</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 size={16} className="text-emerald-600" />
              <span>Kinetic Word-Sync Typography</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 size={16} className="text-emerald-600" />
              <span>Strictly 1 Credit (1080p 9:16)</span>
            </div>
          </div>
        </div>
      </section>

      {/* SHORTS STUDIO INTERACTIVE */}
      <section id="shorts-studio" className="py-20 bg-slate-50/50 border-b border-slate-100">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900">
              Interactive 9:16 Visual Intelligence Studio
            </h2>
            <p className="mt-3 text-slate-600 text-base">
              See how our story planner pairs spoken narration with context-aware data charts, vector art, and kinetic text.
            </p>
          </div>

          <div className="max-w-4xl mx-auto rounded-3xl border border-slate-200 bg-white p-6 sm:p-10 shadow-xl shadow-slate-200/50">
            {/* Scene Selector Tabs */}
            <div className="flex flex-wrap justify-center gap-2 sm:gap-3 mb-8">
              {[
                { id: 'chart', label: '📈 Animated Growth Chart', desc: 'Financial & stat peaks' },
                { id: 'typography', label: '⚡ Kinetic Typography', desc: 'Karaoke word highlights' },
                { id: 'svg', label: '🎨 Vector Concept Art', desc: 'Scalable line drawings' },
                { id: 'social', label: '💬 Social Dialogue UI', desc: 'Engaging chat beats' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveScene(tab.id as any)}
                  className={`px-4 py-2.5 rounded-xl font-semibold text-xs sm:text-sm transition ${
                    activeScene === tab.id
                      ? 'bg-slate-900 text-white shadow-md'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* 9:16 Phone Mockup */}
            <div className="max-w-xs mx-auto aspect-[9/16] rounded-3xl bg-slate-950 border-4 border-slate-800 shadow-2xl overflow-hidden flex flex-col justify-between p-5 relative text-white">
              {/* Subtle ambient lighting */}
              <div className="absolute inset-0 bg-gradient-to-b from-indigo-950/40 via-slate-950 to-slate-950" />

              {/* Top Reel Meta */}
              <div className="relative z-10 flex items-center justify-between text-[11px] text-slate-400">
                <span className="font-semibold text-indigo-400">#NicheStrategy</span>
                <span className="font-mono">1080×1920</span>
              </div>

              {/* Dynamic Center Visual Stage */}
              <div className="relative z-10 my-auto text-center space-y-4">
                {/* 1. Animated Growth Chart */}
                {activeScene === 'chart' && (
                  <div className="space-y-3">
                    <span className="inline-block rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-3 py-1 text-xs font-semibold">
                      Metric: Revenue Growth
                    </span>
                    <div className="h-40 rounded-2xl bg-slate-900 border border-slate-800 p-4 flex flex-col justify-between shadow-2xl">
                      <div className="flex justify-between text-xs text-slate-400 font-mono">
                        <span>Q1: $12K</span>
                        <span className="text-emerald-400 font-bold">Q4: $148K (+1,133%)</span>
                      </div>
                      {/* Animated SVG Curve */}
                      <svg className="w-full h-24 overflow-visible" viewBox="0 0 100 50">
                        <path
                          d="M 5 45 Q 30 40, 50 25 T 95 5"
                          fill="none"
                          stroke="#10b981"
                          strokeWidth="4"
                          strokeLinecap="round"
                        />
                        <circle cx="95" cy="5" r="4" fill="#34d399" />
                      </svg>
                    </div>
                    <p className="text-xs text-slate-300">
                      "By month four, inbound client leads exploded exponentially."
                    </p>
                  </div>
                )}

                {/* 2. Kinetic Typography */}
                {activeScene === 'typography' && (
                  <div className="space-y-4">
                    <span className="inline-block rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 px-3 py-1 text-xs font-semibold">
                      Word-Level Karaoke Timing
                    </span>
                    <div className="rounded-2xl bg-slate-900/90 border border-white/10 p-5 shadow-2xl">
                      <p className="text-2xl font-black uppercase tracking-tight text-white leading-tight">
                        STOP TRADING <span className="bg-amber-400 text-slate-950 px-2 py-0.5 rounded">TIME</span> FOR MONEY
                      </p>
                    </div>
                    <p className="text-xs text-slate-300">
                      High-contrast active word highlights hold attention during silent playback.
                    </p>
                  </div>
                )}

                {/* 3. Vector Concept Art */}
                {activeScene === 'svg' && (
                  <div className="space-y-4">
                    <span className="inline-block rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 px-3 py-1 text-xs font-semibold">
                      Concept: System Architecture
                    </span>
                    <div className="h-40 rounded-2xl bg-slate-900 border border-slate-800 p-4 flex items-center justify-center shadow-2xl">
                      <div className="grid grid-cols-3 gap-3 items-center">
                        <div className="h-10 w-10 rounded-lg bg-indigo-500/20 border border-indigo-400/40 flex items-center justify-center text-xs">⚙️</div>
                        <span className="text-indigo-400 font-bold">➔</span>
                        <div className="h-10 w-10 rounded-lg bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-xs">🚀</div>
                      </div>
                    </div>
                    <p className="text-xs text-slate-300">
                      Clean vector diagrams make complex business concepts instantly intuitive.
                    </p>
                  </div>
                )}

                {/* 4. Social Dialogue UI */}
                {activeScene === 'social' && (
                  <div className="space-y-3">
                    <span className="inline-block rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30 px-3 py-1 text-xs font-semibold">
                      Format: Chat Storytelling
                    </span>
                    <div className="space-y-2 text-left text-xs">
                      <div className="rounded-2xl rounded-tl-sm bg-slate-800 p-3 max-w-[85%] text-slate-200">
                        "Wait, how did you acquire 10,000 users with zero ad spend?"
                      </div>
                      <div className="rounded-2xl rounded-tr-sm bg-indigo-600 p-3 max-w-[85%] ml-auto text-white font-medium">
                        "We built high-retention short-form video loops."
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Bottom Reel Caption & Safe Zone */}
              <div className="relative z-10 border-t border-white/10 pt-3 flex items-center justify-between text-[10px] text-slate-400">
                <span className="font-semibold text-white">Full HD 1080×1920</span>
                <span>Strictly 1 Credit</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 1: THE STORY-FIRST ADVANTAGE */}
      <section className="py-20 border-b border-slate-100">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-7 space-y-6">
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 leading-tight">
                Why Generic Stock Footage Fails on Shorts (And Story Graphics Win)
              </h2>
              <p className="text-slate-600 text-base sm:text-lg leading-relaxed">
                Short-form viewers on TikTok, Reels, and YouTube Shorts swipe away within 1.5 seconds if a video looks like generic, recycled stock footage. They crave dynamic visual pacing that teaches them something concrete.
              </p>
              <p className="text-slate-600 text-base sm:text-lg leading-relaxed">
                By deploying <strong className="text-slate-900 font-semibold">animated data charts</strong>, <strong className="text-slate-900 font-semibold">scalable vector illustrations</strong>, and <strong className="text-slate-900 font-semibold">kinetic karaoke typography</strong> synced directly to your narration beats, your shorts hold audience curiosity until the very last frame.
              </p>
              <p className="text-slate-600 text-base sm:text-lg leading-relaxed">
                With Itnavideo, you produce broadcast-grade vertical shorts without spending hundreds of dollars on freelance motion designers or hours inside After Effects.
              </p>
            </div>

            <div className="lg:col-span-5 space-y-4">
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-2">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-100">
                    <TrendingUp size={20} />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900">80%+ Retention Rates</h3>
                </div>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Fast-paced vector animations and visual charts keep eyes fixed on the screen, signaling algorithms to boost your reach.
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-2">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100">
                    <Smartphone size={20} />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900">100% Native 9:16 Mobile</h3>
                </div>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Never cropped awkwardly from 16:9. Designed specifically for vertical full-screen smartphone viewing.
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-2">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-600 border border-amber-100">
                    <Zap size={20} />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900">Strictly 1 Credit</h3>
                </div>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Produce up to 90 seconds of motion-rich vertical video in 1080p full HD for strictly 1 credit.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2: 6 CORE CAPABILITIES */}
      <section className="py-20 bg-slate-50/50 border-b border-slate-100">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900">
              6 Built-In Faceless Short Capabilities
            </h2>
            <p className="mt-4 text-slate-600 text-base sm:text-lg">
              Everything needed to generate viral vertical shorts without filming yourself.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-100 mb-5">
                <TrendingUp size={24} />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Animated Data Charts</h3>
              <p className="text-slate-600 text-sm leading-relaxed mb-4">
                Automatically draws rising trend curves, bar graphs, and stat callouts when your script mentions numbers or percentages.
              </p>
              <div className="rounded-lg bg-slate-50 border border-slate-200 p-2.5 text-xs font-medium text-slate-700">
                <strong className="text-slate-900">Itnavideo Engine:</strong> Visual proof that holds authority.
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-50 text-amber-600 border border-amber-100 mb-5">
                <Zap size={24} />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Kinetic Typography</h3>
              <p className="text-slate-600 text-sm leading-relaxed mb-4">
                Sub-second speech synchronization highlights active words with bold yellow or cyan karaoke emphasis.
              </p>
              <div className="rounded-lg bg-slate-50 border border-slate-200 p-2.5 text-xs font-medium text-slate-700">
                <strong className="text-slate-900">Itnavideo Engine:</strong> 100% readable on mute.
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100 mb-5">
                <Layers size={24} />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Scalable Vector Graphics</h3>
              <p className="text-slate-600 text-sm leading-relaxed mb-4">
                Draws clean, modern vector icons and illustrations that clarify abstract ideas without visual clutter.
              </p>
              <div className="rounded-lg bg-slate-50 border border-slate-200 p-2.5 text-xs font-medium text-slate-700">
                <strong className="text-slate-900">Itnavideo Engine:</strong> Crisp 1080p SVG rendering.
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-50 text-purple-600 border border-purple-100 mb-5">
                <MessageSquare size={24} />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Social UI Dialogue Mockups</h3>
              <p className="text-slate-600 text-sm leading-relaxed mb-4">
                Integrates simulated message bubbles, tweets, and notifications for narrative storytelling that feels relatable.
              </p>
              <div className="rounded-lg bg-slate-50 border border-slate-200 p-2.5 text-xs font-medium text-slate-700">
                <strong className="text-slate-900">Itnavideo Engine:</strong> Modern conversational formats.
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600 border border-blue-100 mb-5">
                <ShieldCheck size={24} />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Platform Safe Zones</h3>
              <p className="text-slate-600 text-sm leading-relaxed mb-4">
                Every title, button, and chart is calibrated so TikTok, Reels, and Shorts interface icons never cover critical elements.
              </p>
              <div className="rounded-lg bg-slate-50 border border-slate-200 p-2.5 text-xs font-medium text-slate-700">
                <strong className="text-slate-900">Itnavideo Engine:</strong> Flawless mobile presentation.
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-rose-50 text-rose-600 border border-rose-100 mb-5">
                <Clock size={24} />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Strictly 1 Credit</h3>
              <p className="text-slate-600 text-sm leading-relaxed mb-4">
                Generate complete 9:16 vertical shorts (up to 90 seconds) in 1080p full HD for strictly 1 credit.
              </p>
              <div className="rounded-lg bg-slate-50 border border-slate-200 p-2.5 text-xs font-medium text-slate-700">
                <strong className="text-slate-900">Itnavideo Engine:</strong> Fast 30s cloud render.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3: STEP BY STEP WORKFLOW */}
      <section className="py-20 border-b border-slate-100">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900">
              How to Create Faceless Shorts in 3 Steps
            </h2>
            <p className="mt-4 text-slate-600 text-base sm:text-lg">
              Produce viral vertical shorts from voiceover to video in under 30 seconds.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="rounded-2xl border border-slate-200 bg-white p-8 flex flex-col justify-between shadow-sm">
              <div>
                <span className="text-3xl font-extrabold text-indigo-600 block mb-3">01</span>
                <h3 className="text-xl font-bold text-slate-900 mb-2">Upload Voiceover Audio</h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  Record your voice or upload an MP3/WAV file. Groq Whisper transcribes every word with sub-second timestamps.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-100 text-xs text-slate-500 font-medium">
                ✓ Auto transcription &amp; beat analysis
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-8 flex flex-col justify-between shadow-sm">
              <div>
                <span className="text-3xl font-extrabold text-amber-600 block mb-3">02</span>
                <h3 className="text-xl font-bold text-slate-900 mb-2">AI Builds Visual Story</h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  The engine matches spoken lines to animated charts, clean SVGs, split screens, and kinetic karaoke typography.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-100 text-xs text-slate-500 font-medium">
                ✓ Context-aware motion graphics
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-8 flex flex-col justify-between shadow-sm">
              <div>
                <span className="text-3xl font-extrabold text-emerald-600 block mb-3">03</span>
                <h3 className="text-xl font-bold text-slate-900 mb-2">Export 1080p 9:16 Video</h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  Download a crisp 1080p vertical reel, perfectly formatted and ready to post on YouTube Shorts, TikTok, and Reels.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-100 text-xs text-slate-500 font-medium">
                ✓ Strictly 1 Credit • Cloud Render in ~30s
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 4: COMPARISON TABLE */}
      <section className="py-20 bg-slate-50/50 border-b border-slate-100">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900">
              Generic Stock B-Roll vs. Itnavideo Faceless Shorts
            </h2>
            <p className="mt-3 text-slate-600 text-base">
              Why top creators switch from boring stock loops to dynamic story graphics.
            </p>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50">
                  <th className="p-5 text-xs font-bold uppercase text-slate-600">Feature</th>
                  <th className="p-5 text-xs font-bold uppercase text-rose-600">Generic Stock Video Tools</th>
                  <th className="p-5 text-xs font-bold uppercase text-emerald-700 bg-emerald-50/60">Itnavideo Faceless Shorts</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                <tr>
                  <td className="p-5 font-semibold text-slate-900">Visual Variety per Video</td>
                  <td className="p-5 text-slate-600">Random recycled B-roll clips</td>
                  <td className="p-5 font-bold text-emerald-700 bg-emerald-50/30">Data charts, SVGs, split screens, &amp; typography</td>
                </tr>
                <tr>
                  <td className="p-5 font-semibold text-slate-900">Semantic Relevance</td>
                  <td className="p-5 text-slate-600">Keyword guessing often fails completely</td>
                  <td className="p-5 font-bold text-emerald-700 bg-emerald-50/30">AI understands context to draw relevant graphs</td>
                </tr>
                <tr>
                  <td className="p-5 font-semibold text-slate-900">Viewer Retention Rates</td>
                  <td className="p-5 text-slate-600">High drop-off within 2 seconds</td>
                  <td className="p-5 font-bold text-emerald-700 bg-emerald-50/30">80%+ completion rate driven by visual changes</td>
                </tr>
                <tr>
                  <td className="p-5 font-semibold text-slate-900">Production Time</td>
                  <td className="p-5 text-slate-600">Requires manual clip swapping</td>
                  <td className="p-5 font-bold text-emerald-700 bg-emerald-50/30">Fully automated in under 30 seconds</td>
                </tr>
                <tr>
                  <td className="p-5 font-semibold text-slate-900">Cost per Video</td>
                  <td className="p-5 text-slate-600">$30 – $80 expensive monthly tiers</td>
                  <td className="p-5 font-bold text-emerald-700 bg-emerald-50/30">Strictly 1 Credit per video</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* SECTION 5: FAQ ACCORDION */}
      <section className="py-20 border-b border-slate-100">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-5xl font-extrabold text-slate-900">Frequently Asked Questions</h2>
            <p className="mt-3 text-slate-600 text-base">Everything you need to know about Faceless Shorts.</p>
          </div>

          <div className="space-y-3">
            {faqData.map((faq, idx) => {
              const isOpen = openFaqIndex === idx;
              return (
                <div key={idx} className="rounded-xl border border-slate-200 bg-white overflow-hidden shadow-sm">
                  <button
                    onClick={() => toggleFaq(idx)}
                    className="w-full flex items-center justify-between p-5 text-left focus:outline-none"
                  >
                    <span className="text-base font-bold text-slate-900 pr-4">{faq.q}</span>
                    <div className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-600 transition-transform ${isOpen ? 'rotate-180 bg-slate-900 text-white' : ''}`}>
                      <ChevronDown size={16} />
                    </div>
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-5 text-slate-600 text-sm leading-relaxed border-t border-slate-100 pt-3">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* BOTTOM ACTION CTA */}
      <section className="py-20 bg-slate-900 text-center text-white">
        <div className="mx-auto max-w-4xl px-4">
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight mb-4">
            Start Scaling Your Faceless Shorts Channel Today
          </h2>
          <p className="text-slate-300 text-base sm:text-lg mb-8 max-w-2xl mx-auto">
            Upload your voiceover to generate viral 9:16 vertical videos with animated charts and kinetic typography in seconds.
          </p>
          <Link
            href="/dashboard?mode=facelessShorts"
            className="inline-flex items-center gap-2.5 rounded-xl bg-white px-8 py-4 text-base font-bold text-slate-900 shadow-xl hover:bg-slate-100 transition active:scale-95"
          >
            <Sparkles size={18} className="text-indigo-600" />
            <span>Create Faceless Shorts Free</span>
          </Link>
          <div className="mt-4 text-xs text-slate-400">
            Strictly 1 Credit per Video • No Credit Card Required
          </div>
        </div>
      </section>
    </div>
  );
}