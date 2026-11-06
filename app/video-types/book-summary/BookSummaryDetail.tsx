'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Sparkles,
  ArrowRight,
  BookOpen,
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
  Tv,
  Volume2,
  Layers,
  Quote,
  TrendingUp,
  BookmarkCheck,
  Headphones,
  Check,
  X,
} from 'lucide-react';

export default function BookSummaryDetail() {
  const [activeTab, setActiveTab] = useState<'cover' | 'chapter' | 'quote' | 'audio'>('cover');
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const toggleFaq = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  const faqData = [
    {
      q: "What is an AI Book Summary Video Generator?",
      a: "An AI Book Summary Video Generator transforms book review audio and cover images into cinematic 16:9 widescreen YouTube videos complete with 3D book cover tilt reveals, animated chapter cards, kinetic quote highlights, and focus background music in seconds."
    },
    {
      q: "How does Itnavideo structure book summaries into chapters automatically?",
      a: "Our speech engine transcribes your voiceover, recognizes chapter cues (e.g., 'Chapter 1: The Cue', 'Principle 2: The Craving', 'Key Lesson 3'), and automatically cuts smooth chapter transition cards and visual breaks synced to your narration."
    },
    {
      q: "What is the credit pricing for Book Summary videos?",
      a: "Book Summary videos follow our transparent long-form rate: strictly 1 Min = 1 Credit (1 min = 1 credit, 2 min = 2 credits, 3 min = 3 credits, 4 min = 4 credits, up to 5 minutes maximum = 5 credits). Rendered in pristine 1080p 16:9 widescreen MP4."
    },
    {
      q: "Do I need 3D software or graphic design skills for the book cover?",
      a: "No 3D modeling skills are required. Simply upload any standard flat book cover image (JPG or PNG). The rendering engine automatically constructs a 3D book jacket with realistic depth, lighting shimmers, and gentle camera perspective sweeps."
    },
    {
      q: "What background music styles are included?",
      a: "You get access to curated royalty-free lo-fi focus beats, acoustic piano progressions, ambient minimalism, and warm vinyl textures that automatically duck under your spoken narration."
    },
    {
      q: "Why are book summary YouTube channels so lucrative?",
      a: "Non-fiction book reviews in personal finance, productivity, and entrepreneurship attract high-intent, affluent audiences. As a result, they command higher YouTube CPM rates ($10-$30+ CPM) and generate evergreen search traffic for years without going obsolete."
    },
    {
      q: "Can I customize the colors, font styles, and quote cards?",
      a: "Yes. You can customize the studio background tone, highlight accent colors, kinetic subtitle formatting, and chapter card typography to match your channel branding."
    },
    {
      q: "What video length and aspect ratio are supported?",
      a: "Book Summary videos are produced in 16:9 Widescreen (1920x1080 at 30 FPS MP4) optimized for YouTube, supporting voiceover durations from 30 seconds up to 5 full minutes (300 seconds)."
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
    name: 'Itnavideo Book Summary Video Generator',
    operatingSystem: 'Web-based App',
    applicationCategory: 'MultimediaApplication',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
    description: 'Transform book review audio into cinematic 16:9 widescreen videos with 3D book covers, chapter cards, and kinetic notes.',
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
            Turn Book Summaries &amp; Voiceovers Into Cinematic 16:9 Widescreen Videos
          </h1>

          <p className="mt-6 text-lg sm:text-xl text-slate-600 leading-relaxed font-normal max-w-3xl mx-auto">
            Run a profitable book review YouTube channel without spending 40 hours per video. Upload your voiceover and book cover to generate 3D book tilt animations, chapter transition cards, quote callouts, and lo-fi focus BGM automatically.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/dashboard?videoType=book-summary"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 rounded-xl bg-slate-900 px-8 py-4 text-base font-semibold text-white shadow-xl shadow-slate-900/10 hover:bg-slate-800 transition active:scale-95"
            >
              <Play size={18} className="fill-white" />
              <span>Create Book Summary Free</span>
            </Link>
            <a
              href="#cinema-preview"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-8 py-4 text-base font-semibold text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition"
            >
              <BookOpen size={18} className="text-indigo-600" />
              <span>Explore Cinema Preview</span>
            </a>
          </div>

          {/* Quick trust metrics */}
          <div className="mt-12 flex flex-wrap items-center justify-center gap-8 text-xs sm:text-sm font-medium text-slate-500 border-t border-slate-100 pt-8">
            <div className="flex items-center gap-2">
              <CheckCircle2 size={16} className="text-emerald-600" />
              <span>3D Book Cover Reveal Engine</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 size={16} className="text-emerald-600" />
              <span>Animated Chapter Transition Cards</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 size={16} className="text-emerald-600" />
              <span>Kinetic Quote Highlight Overlays</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 size={16} className="text-emerald-600" />
              <span>1 Min = 1 Credit (16:9 Up to 5m)</span>
            </div>
          </div>
        </div>
      </section>

      {/* CINEMA PREVIEW INTERACTIVE SECTION */}
      <section id="cinema-preview" className="py-20 bg-slate-50/50 border-b border-slate-100">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900">
              Interactive 16:9 Cinema Studio Preview
            </h2>
            <p className="mt-3 text-slate-600 text-base">
              Switch between preview modes to see how 3D covers, chapter cards, and key quotes are formatted for 1080p YouTube playback.
            </p>
          </div>

          <div className="max-w-4xl mx-auto rounded-3xl border border-slate-200 bg-white p-6 sm:p-10 shadow-xl shadow-slate-200/50">
            {/* View Mode Selector Tabs */}
            <div className="flex flex-wrap justify-center gap-2 sm:gap-3 mb-8">
              {[
                { id: 'cover', label: '📖 3D Book Reveal', desc: 'Perspective tilt & lighting sheen' },
                { id: 'chapter', label: '📑 Chapter Card', desc: 'Timestamped section divider' },
                { id: 'quote', label: '💡 Kinetic Key Quote', desc: 'Highlighted core takeaways' },
                { id: 'audio', label: '🎵 Focus Lo-Fi BGM', desc: 'Auto-ducked atmospheric audio' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`px-4 py-2.5 rounded-xl font-semibold text-xs sm:text-sm transition ${
                    activeTab === tab.id
                      ? 'bg-slate-900 text-white shadow-md'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* 16:9 Video Canvas Mockup */}
            <div className="relative aspect-video w-full rounded-2xl bg-slate-950 overflow-hidden border border-slate-800 shadow-2xl flex items-center justify-center p-6 sm:p-12 text-white">
              {/* Subtle background glow */}
              <div className="absolute inset-0 bg-gradient-to-tr from-indigo-950/60 via-slate-900 to-slate-950 opacity-90" />

              {/* View 1: 3D Book Cover Reveal */}
              {activeTab === 'cover' && (
                <div className="relative z-10 flex flex-col sm:flex-row items-center justify-center gap-8 text-center sm:text-left">
                  {/* 3D Book Mockup */}
                  <div className="relative w-36 sm:w-44 h-52 sm:h-60 rounded-r-lg bg-gradient-to-r from-amber-600 via-amber-500 to-amber-400 p-4 shadow-[15px_15px_30px_rgba(0,0,0,0.8),inset_-5px_0_10px_rgba(0,0,0,0.4)] border-l-4 border-amber-800 transform -rotate-6 hover:rotate-0 transition-transform duration-500 flex flex-col justify-between">
                    <div className="text-[10px] uppercase tracking-widest font-bold text-amber-950/80">#1 NYT Bestseller</div>
                    <div>
                      <div className="text-lg sm:text-xl font-black text-slate-950 leading-tight">ATOMIC HABITS</div>
                      <div className="text-[11px] font-semibold text-amber-950 mt-1">James Clear</div>
                    </div>
                    <div className="text-[9px] text-amber-950/70 border-t border-amber-950/20 pt-1">An Easy &amp; Proven Way to Build Good Habits</div>
                  </div>

                  <div className="max-w-xs space-y-3">
                    <span className="inline-block rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 px-3 py-1 text-xs font-semibold">
                      Intro Scene • 0:00 - 0:45
                    </span>
                    <h3 className="text-xl sm:text-2xl font-bold text-white">Atomic Habits</h3>
                    <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                      "Tiny Changes, Remarkable Results: Why tiny 1% daily compounding decisions shape who you become."
                    </p>
                  </div>
                </div>
              )}

              {/* View 2: Animated Chapter Card */}
              {activeTab === 'chapter' && (
                <div className="relative z-10 max-w-lg text-center space-y-4">
                  <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3.5 py-1 text-xs font-semibold text-amber-400 border border-white/10">
                    <BookmarkCheck size={14} />
                    <span>Chapter 02 of 05</span>
                  </div>
                  <h3 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white">
                    The 4 Laws of Behavior Change
                  </h3>
                  <div className="w-24 h-1 bg-amber-400 mx-auto rounded-full" />
                  <p className="text-sm text-slate-300">
                    How cue, craving, response, and reward dictate automatic habit loops in your brain.
                  </p>
                  <div className="pt-2 flex justify-center gap-2 text-xs text-slate-400 font-mono">
                    <span>Timestamp: 01:24</span>
                    <span>•</span>
                    <span>Pacing: 1.0x</span>
                  </div>
                </div>
              )}

              {/* View 3: Kinetic Key Quote */}
              {activeTab === 'quote' && (
                <div className="relative z-10 max-w-md bg-white/5 backdrop-blur-md rounded-2xl border border-white/15 p-6 sm:p-8 text-center space-y-4 shadow-xl">
                  <Quote size={28} className="text-amber-400 mx-auto opacity-80" />
                  <blockquote className="text-base sm:text-xl font-bold text-white leading-relaxed">
                    "You do not rise to the level of your goals. You fall to the level of your systems."
                  </blockquote>
                  <div className="text-xs font-semibold text-amber-300">
                    — James Clear, Author
                  </div>
                </div>
              )}

              {/* View 4: Focus Lo-Fi BGM Visualizer */}
              {activeTab === 'audio' && (
                <div className="relative z-10 text-center space-y-5">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 mx-auto">
                    <Headphones size={28} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">Focus Lo-Fi &amp; Vinyl Ambient Beats</h3>
                    <p className="text-xs text-slate-300 mt-1">Automatic volume ducking (-14dB) beneath voiceover narration</p>
                  </div>
                  {/* Waveform graphic */}
                  <div className="flex items-center justify-center gap-1.5 h-12">
                    {[35, 60, 85, 45, 95, 70, 50, 90, 65, 40, 80, 55, 100, 75, 45, 85, 60].map((h, i) => (
                      <div
                        key={i}
                        className="w-1.5 bg-gradient-to-t from-indigo-500 to-amber-400 rounded-full animate-pulse"
                        style={{ height: `${h}%`, animationDelay: `${i * 70}ms` }}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Bottom 16:9 Cinema Player Bar */}
              <div className="absolute bottom-3 inset-x-4 flex items-center justify-between text-[11px] text-slate-400 border-t border-white/10 pt-2">
                <div className="flex items-center gap-2">
                  <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
                  <span>1080p Widescreen YouTube Ready</span>
                </div>
                <span>16:9 Canvas</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 1: THE EVERGREEN NICHE */}
      <section className="py-20 border-b border-slate-100">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-7 space-y-6">
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 leading-tight">
                Why Non-Fiction Book Summaries Generate High CPM &amp; Lifetime Views
              </h2>
              <p className="text-slate-600 text-base sm:text-lg leading-relaxed">
                Book summaries for titles like <strong className="text-slate-900 font-semibold">"Atomic Habits"</strong>, <strong className="text-slate-900 font-semibold">"Psychology of Money"</strong>, or <strong className="text-slate-900 font-semibold">"Deep Work"</strong> attract educated, ambitious audiences who want knowledge fast.
              </p>
              <p className="text-slate-600 text-base sm:text-lg leading-relaxed">
                Because these titles are timeless classics, a book summary published today will continue getting hundreds of search clicks every week for years. YouTube channels in this niche enjoy exceptional advertiser CPM rates ($10 to $30+) from SaaS, fintech, and education sponsors.
              </p>
              <p className="text-slate-600 text-base sm:text-lg leading-relaxed">
                Instead of spending days manually designing chapter slates in After Effects or hiring freelance motion editors, Itnavideo lets you produce cinematic 16:9 summaries in minutes.
              </p>
            </div>

            <div className="lg:col-span-5 space-y-4">
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-2">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-100">
                    <BarChart3 size={20} />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900">Premium Advertiser CPM</h3>
                </div>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Audiences looking for book summaries hold high purchasing power, commanding $10 to $30+ CPMs on YouTube.
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-2">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100">
                    <TrendingUp size={20} />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900">Evergreen Search Traffic</h3>
                </div>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Unlike trending news that expires in 48 hours, non-fiction reviews generate passive views and affiliate book sales for years.
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-2">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-600 border border-amber-100">
                    <Clock size={20} />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900">1 Min = 1 Credit</h3>
                </div>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Transparent long-form pricing. A 3-minute book summary costs exactly 3 credits, rendered in 1080p widescreen.
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
              6 Built-In Book Summary Video Capabilities
            </h2>
            <p className="mt-4 text-slate-600 text-base sm:text-lg">
              Everything needed to publish studio-quality book reviews without manual keyframe editing.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-100 mb-5">
                <BookOpen size={24} />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">3D Book Cover Physics</h3>
              <p className="text-slate-600 text-sm leading-relaxed mb-4">
                Upload any flat 2D book cover image. The engine renders a 3D book jacket with realistic depth, tilt perspective, and lighting shimmers.
              </p>
              <div className="rounded-lg bg-slate-50 border border-slate-200 p-2.5 text-xs font-medium text-slate-700">
                <strong className="text-slate-900">Itnavideo Engine:</strong> Zero 3D Blender modeling required.
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-50 text-amber-600 border border-amber-100 mb-5">
                <BookmarkCheck size={24} />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Auto Chapter Detection</h3>
              <p className="text-slate-600 text-sm leading-relaxed mb-4">
                Audio transcript analysis automatically locates chapter transitions, placing clean chapter cards and numbered section dividers.
              </p>
              <div className="rounded-lg bg-slate-50 border border-slate-200 p-2.5 text-xs font-medium text-slate-700">
                <strong className="text-slate-900">Itnavideo Engine:</strong> Structured chapters keep viewers retention high.
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100 mb-5">
                <Quote size={24} />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Kinetic Quote Callouts</h3>
              <p className="text-slate-600 text-sm leading-relaxed mb-4">
                Display iconic quotes from the author in formatted quotation cards with smooth entrance springs and high-contrast typography.
              </p>
              <div className="rounded-lg bg-slate-50 border border-slate-200 p-2.5 text-xs font-medium text-slate-700">
                <strong className="text-slate-900">Itnavideo Engine:</strong> Highlight key concepts visually.
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-rose-50 text-rose-600 border border-rose-100 mb-5">
                <Volume2 size={24} />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Lo-Fi &amp; Vinyl Ambient BGM</h3>
              <p className="text-slate-600 text-sm leading-relaxed mb-4">
                Curated royalty-free lo-fi study tracks, warm acoustic guitar, and vinyl textures that automatically duck under voice narration.
              </p>
              <div className="rounded-lg bg-slate-50 border border-slate-200 p-2.5 text-xs font-medium text-slate-700">
                <strong className="text-slate-900">Itnavideo Engine:</strong> Perfect intellectual focus atmosphere.
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600 border border-blue-100 mb-5">
                <Tv size={24} />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">16:9 Cinema 1080p Layout</h3>
              <p className="text-slate-600 text-sm leading-relaxed mb-4">
                Widescreen 1920x1080 canvas with safe zones for YouTube timestamps, progress scrubbers, and end-screen cards.
              </p>
              <div className="rounded-lg bg-slate-50 border border-slate-200 p-2.5 text-xs font-medium text-slate-700">
                <strong className="text-slate-900">Itnavideo Engine:</strong> Clean, high-prestige YouTube aesthetic.
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-violet-50 text-violet-600 border border-violet-100 mb-5">
                <Layers size={24} />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Up to 5 Minutes (300s)</h3>
              <p className="text-slate-600 text-sm leading-relaxed mb-4">
                Ample video length to thoroughly cover core book insights, chapter summaries, and author takeaways in full depth.
              </p>
              <div className="rounded-lg bg-slate-50 border border-slate-200 p-2.5 text-xs font-medium text-slate-700">
                <strong className="text-slate-900">Itnavideo Engine:</strong> 1 Min = 1 Credit rate.
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
              How to Create a Book Summary in 3 Steps
            </h2>
            <p className="mt-4 text-slate-600 text-base sm:text-lg">
              From voiceover recording to publishing on YouTube in under a minute.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="rounded-2xl border border-slate-200 bg-white p-8 flex flex-col justify-between shadow-sm">
              <div>
                <span className="text-3xl font-extrabold text-indigo-600 block mb-3">01</span>
                <h3 className="text-xl font-bold text-slate-900 mb-2">Upload Voiceover Audio</h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  Record your review or upload an existing MP3/WAV file. The engine transcribes speech and detects chapter cues automatically.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-100 text-xs text-slate-500 font-medium">
                ✓ Groq Whisper transcription
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-8 flex flex-col justify-between shadow-sm">
              <div>
                <span className="text-3xl font-extrabold text-amber-600 block mb-3">02</span>
                <h3 className="text-xl font-bold text-slate-900 mb-2">Upload Book Cover</h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  Drop a flat front cover image (JPG or PNG). The system auto-generates a realistic 3D book spine, shadows, and perspective tilt.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-100 text-xs text-slate-500 font-medium">
                ✓ 3D perspective construction
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-8 flex flex-col justify-between shadow-sm">
              <div>
                <span className="text-3xl font-extrabold text-emerald-600 block mb-3">03</span>
                <h3 className="text-xl font-bold text-slate-900 mb-2">Export 1080p 16:9 Video</h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  Download a crisp 1080p widescreen MP4 with lo-fi soundtrack and chapter markers, ready for YouTube.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-100 text-xs text-slate-500 font-medium">
                ✓ 1 Min = 1 Credit • Cloud Render in ~45s
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
              Manual Timeline Editing vs. Itnavideo Book Summary AI
            </h2>
            <p className="mt-3 text-slate-600 text-base">
              Why top book creators switch to our automated 16:9 cinema workflow.
            </p>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50">
                  <th className="p-5 text-xs font-bold uppercase text-slate-600">Production Feature</th>
                  <th className="p-5 text-xs font-bold uppercase text-rose-600">Manual Video Editing</th>
                  <th className="p-5 text-xs font-bold uppercase text-emerald-700 bg-emerald-50/60">Itnavideo Book Summary AI</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                <tr>
                  <td className="p-5 font-semibold text-slate-900">Production Time per Video</td>
                  <td className="p-5 text-slate-600">8 to 15 hours per review</td>
                  <td className="p-5 font-bold text-emerald-700 bg-emerald-50/30">Under 60 seconds</td>
                </tr>
                <tr>
                  <td className="p-5 font-semibold text-slate-900">3D Book Cover Animation</td>
                  <td className="p-5 text-slate-600">Requires 3D Blender rigging or Cinema 4D</td>
                  <td className="p-5 font-bold text-emerald-700 bg-emerald-50/30">Auto 3D perspective construction from 2D image</td>
                </tr>
                <tr>
                  <td className="p-5 font-semibold text-slate-900">Chapter Transition Cards</td>
                  <td className="p-5 text-slate-600">Manual typography and slide alignment</td>
                  <td className="p-5 font-bold text-emerald-700 bg-emerald-50/30">Auto chapter detection &amp; animated dividers</td>
                </tr>
                <tr>
                  <td className="p-5 font-semibold text-slate-900">Background Music Balancing</td>
                  <td className="p-5 text-slate-600">Manual volume keyframing &amp; audio ducking</td>
                  <td className="p-5 font-bold text-emerald-700 bg-emerald-50/30">Built-in lo-fi beats with auto -14dB ducking</td>
                </tr>
                <tr>
                  <td className="p-5 font-semibold text-slate-900">Cost per Video</td>
                  <td className="p-5 text-slate-600">$100 – $300 editor fee</td>
                  <td className="p-5 font-bold text-emerald-700 bg-emerald-50/30">1 Min = 1 Credit (e.g. 3m = 3 Credits)</td>
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
            <p className="mt-3 text-slate-600 text-base">Everything you need to know about creating Book Summary videos.</p>
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
            Start Your Book Summary Channel Today
          </h2>
          <p className="text-slate-300 text-base sm:text-lg mb-8 max-w-2xl mx-auto">
            Upload your audio review and book cover to publish cinematic 16:9 widescreen videos in minutes.
          </p>
          <Link
            href="/dashboard?videoType=book-summary"
            className="inline-flex items-center gap-2.5 rounded-xl bg-white px-8 py-4 text-base font-bold text-slate-900 shadow-xl hover:bg-slate-100 transition active:scale-95"
          >
            <Sparkles size={18} className="text-indigo-600" />
            <span>Create Book Summary Free</span>
          </Link>
          <div className="mt-4 text-xs text-slate-400">
            1 Min = 1 Credit (16:9 Up to 5m) • No Credit Card Required
          </div>
        </div>
      </section>
    </div>
  );
}