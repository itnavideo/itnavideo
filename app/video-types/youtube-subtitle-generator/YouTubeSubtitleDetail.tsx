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
  Type,
  ShieldCheck,
  Award,
  Layers,
  Smartphone,
  Eye,
  Check,
  X,
} from 'lucide-react';

export default function YouTubeSubtitleDetail() {
  const [activePreset, setActivePreset] = useState<'ali' | 'vox' | 'diary' | 'huberman'>('ali');
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const toggleFaq = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  const faqData = [
    {
      q: "What is the YouTube Subtitle Generator (16:9 Landscape Subtitles)?",
      a: "The YouTube Subtitle Generator burns broadcast-grade 16:9 horizontal subtitles directly into your YouTube videos, podcasts, and video essays. It includes signature Western creator typography presets (Ali Abdaal, Vox Documentary, Diary of a CEO, Huberman Lab) designed with calculated player scrubber safe margins."
    },
    {
      q: "Why are burned-in styled subtitles better than YouTube's default CC button?",
      a: "YouTube's default CC button is disabled by default for most viewers, looks generic, and frequently collides with the progress scrubber, video controls, or channel popups. Burned-in subtitles ensure 100% of viewers see high-contrast, branded captions regardless of their playback device or player settings."
    },
    {
      q: "What are YouTube Player Scrubber Safe Zones?",
      a: "Player Safe Zones are calibrated bottom margins (84px on web, 120px on smart TVs) that guarantee subtitle lines never collide with YouTube's red progress scrubber, volume slider, or video title overlay."
    },
    {
      q: "How many credits does a YouTube Subtitle Generator video cost?",
      a: "Every YouTube Subtitles video costs a flat 2 Credits per video, whether your video is 1 minute or up to 5 full minutes (300 seconds). Rendered in pristine 1080p 16:9 widescreen MP4."
    },
    {
      q: "Do I need to upload manual SRT subtitle files?",
      a: "No SRT files are required. Simply upload your 16:9 horizontal MP4 or MOV video. Our speech engine automatically transcribes the dialogue with word-level timestamp accuracy in seconds."
    },
    {
      q: "Does this support Indian English and conversational accents?",
      a: "Yes. Our speech model accurately transcribes conversational speech, technical terminology, and regional accents without phonetic errors."
    },
    {
      q: "Can I customize the subtitle font sizes and highlight colors?",
      a: "Yes. You can customize font size, active-word highlight color (yellow, cyan, lime green, white), pill background opacity, and vertical offset above the player scrubber."
    },
    {
      q: "What video length and resolution are exported?",
      a: "Videos are exported in full 1080p Full HD Widescreen (1920x1080 at 30 FPS MP4) optimized for YouTube, supporting durations up to 5 minutes (300 seconds)."
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
    name: 'Itnavideo YouTube Subtitle Generator',
    operatingSystem: 'Web-based App',
    applicationCategory: 'MultimediaApplication',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
    description: 'Add broadcast-quality 16:9 landscape subtitles to YouTube videos with Western creator styles and UI safe zones.',
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-blue-100 selection:text-blue-900">
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
            Broadcast-Quality 16:9 Subtitles for YouTube &amp; Widescreen Videos
          </h1>

          <p className="mt-6 text-lg sm:text-xl text-slate-600 leading-relaxed font-normal max-w-3xl mx-auto">
            Upgrade your landscape YouTube videos with signature creator typography (Ali Abdaal, Vox Documentary, Diary of a CEO, Huberman Lab) complete with UI scrubber safe-zone margins and sub-second speech synchronization.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/dashboard?videoType=youtube-subtitle-generator"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 rounded-xl bg-slate-900 px-8 py-4 text-base font-semibold text-white shadow-xl shadow-slate-900/10 hover:bg-slate-800 transition active:scale-95"
            >
              <Play size={18} className="fill-white" />
              <span>Generate 16:9 Subtitles Free</span>
            </Link>
            <a
              href="#subtitle-studio"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-8 py-4 text-base font-semibold text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition"
            >
              <Type size={18} className="text-blue-600" />
              <span>Explore Creator Presets</span>
            </a>
          </div>

          {/* Quick trust metrics */}
          <div className="mt-12 flex flex-wrap items-center justify-center gap-8 text-xs sm:text-sm font-medium text-slate-500 border-t border-slate-100 pt-8">
            <div className="flex items-center gap-2">
              <CheckCircle2 size={16} className="text-emerald-600" />
              <span>Western Creator Presets</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 size={16} className="text-emerald-600" />
              <span>YouTube Scrubber Safe Margins</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 size={16} className="text-emerald-600" />
              <span>100% Native 16:9 Landscape</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 size={16} className="text-emerald-600" />
              <span>Flat 2 Credits / Video (Up to 5m)</span>
            </div>
          </div>
        </div>
      </section>

      {/* SUBTITLE STUDIO INTERACTIVE */}
      <section id="subtitle-studio" className="py-20 bg-slate-50/50 border-b border-slate-100">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900">
              Interactive 16:9 Subtitle Style Studio
            </h2>
            <p className="mt-3 text-slate-600 text-base">
              Test signature creator presets and see how calculated bottom margins float subtitles safely above YouTube player controls.
            </p>
          </div>

          <div className="max-w-4xl mx-auto rounded-3xl border border-slate-200 bg-white p-6 sm:p-10 shadow-xl shadow-slate-200/50">
            {/* Style Selector Tabs */}
            <div className="flex flex-wrap justify-center gap-2 sm:gap-3 mb-8">
              {[
                { id: 'ali', label: 'Ali Abdaal Clean Pill', desc: 'Dark rounded pill backdrop' },
                { id: 'vox', label: 'Vox Documentary Punch', desc: 'Yellow italic emphasis' },
                { id: 'diary', label: 'Diary of a CEO Minimal', desc: 'Elegant lower-third' },
                { id: 'huberman', label: 'Huberman Lab Focus', desc: 'Monospaced scientific uppercase' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActivePreset(tab.id as any)}
                  className={`px-4 py-2.5 rounded-xl font-semibold text-xs sm:text-sm transition ${
                    activePreset === tab.id
                      ? 'bg-slate-900 text-white shadow-md'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* 16:9 Widescreen Video Player Mockup */}
            <div className="relative aspect-video w-full rounded-2xl bg-slate-950 overflow-hidden border border-slate-800 shadow-2xl flex flex-col justify-between p-6 sm:p-8 text-white">
              {/* Subtle cinema backdrop */}
              <div className="absolute inset-0 bg-gradient-to-tr from-slate-950 via-slate-900 to-slate-950 opacity-90" />

              {/* Top video info */}
              <div className="relative z-10 flex items-center justify-between text-xs text-slate-400">
                <span className="font-semibold text-white">How High Performers Structure Their Day</span>
                <span className="rounded bg-white/10 px-2 py-0.5 text-[10px] font-mono">1080p HD</span>
              </div>

              {/* Subtitle Display Area */}
              <div className="relative z-10 my-auto text-center">
                {activePreset === 'ali' && (
                  <div className="inline-block rounded-2xl bg-black/85 backdrop-blur-md px-6 py-3 border border-white/15 shadow-2xl">
                    <p className="text-base sm:text-2xl font-bold text-white tracking-wide">
                      "If you prioritize everything, you prioritize <span className="text-amber-400">nothing at all</span>."
                    </p>
                  </div>
                )}

                {activePreset === 'vox' && (
                  <div className="inline-block max-w-xl text-center">
                    <p className="text-lg sm:text-3xl font-black uppercase tracking-tight text-white drop-shadow-[0_4px_12px_rgba(0,0,0,0.9)]">
                      The Hidden Cost of <span className="bg-amber-400 text-slate-950 px-2 py-0.5 rounded italic">Context Switching</span>
                    </p>
                  </div>
                )}

                {activePreset === 'diary' && (
                  <div className="inline-block border-b-2 border-white/40 pb-2">
                    <p className="text-base sm:text-2xl font-serif text-slate-200 italic tracking-wider">
                      The most dangerous risk is spending your life not doing what you want.
                    </p>
                  </div>
                )}

                {activePreset === 'huberman' && (
                  <div className="inline-block rounded-xl bg-slate-900/90 border border-cyan-500/30 px-6 py-2.5 shadow-2xl">
                    <p className="text-xs sm:text-lg font-mono font-bold uppercase tracking-widest text-cyan-300">
                      PROTOCOL: VIEW MORNING SUNLIGHT WITHIN 30 MINS OF WAKING
                    </p>
                  </div>
                )}
              </div>

              {/* YouTube Scrubber Safe Zone Simulation */}
              <div className="relative z-10 border-t border-red-500/30 pt-3">
                <div className="flex items-center justify-between text-[11px] text-slate-400 mb-2">
                  <div className="flex items-center gap-1.5 text-emerald-400 font-semibold">
                    <ShieldCheck size={14} />
                    <span>84px Scrubber Safe Zone (Captions never collide)</span>
                  </div>
                  <span className="font-mono text-slate-400">03:42 / 05:00</span>
                </div>
                {/* Red YouTube Scrubber Bar */}
                <div className="relative h-1 w-full bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-red-600 rounded-full" style={{ width: '74%' }} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 1: WHY STYLED 16:9 SUBTITLES MATTER */}
      <section className="py-20 border-b border-slate-100">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-7 space-y-6">
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 leading-tight">
                Why Top YouTubers Rely on Burned-In Widescreen Subtitles
              </h2>
              <p className="text-slate-600 text-base sm:text-lg leading-relaxed">
                Over 70% of YouTube long-form content is consumed on mobile phones, tablets, and smart TVs in noisy environments. When viewers encounter uncaptioned speech, retention drops dramatically within the first 60 seconds.
              </p>
              <p className="text-slate-600 text-base sm:text-lg leading-relaxed">
                While YouTube offers an automated closed captioning (CC) button, default captions look unstyled, often fail to load on embedded players, and frequently overlap with YouTube's progress bar scrubber and channel branding buttons.
              </p>
              <p className="text-slate-600 text-base sm:text-lg leading-relaxed">
                The <strong className="text-blue-600 font-semibold">Itnavideo YouTube Subtitle Generator</strong> burns high-contrast, beautifully styled typography directly into your 1920x1080 landscape video file—ensuring every viewer experiences broadcast-quality subtitles.
              </p>
            </div>

            <div className="lg:col-span-5 space-y-4">
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-2">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600 border border-blue-100">
                    <BarChart3 size={20} />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900">40%+ Higher Watch Time</h3>
                </div>
                <p className="text-sm text-slate-600 leading-relaxed">
                  High-contrast typography keeps viewer eyes focused on the screen, increasing average view duration and algorithmic reach.
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-2">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100">
                    <ShieldCheck size={20} />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900">Player Control Protection</h3>
                </div>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Calculated bottom margin safe zones guarantee captions never obscure the red YouTube scrubber or player controls.
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-2">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-100">
                    <Zap size={20} />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900">Flat 2 Credits / Video</h3>
                </div>
                <p className="text-sm text-slate-600 leading-relaxed">
                  No per-minute fee. Render 1 to 5 minutes of 1080p landscape subtitles for a flat 2 credits per video.
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
              6 Built-In 16:9 Subtitle Capabilities
            </h2>
            <p className="mt-4 text-slate-600 text-base sm:text-lg">
              Everything needed to burn broadcast-grade typography into widescreen videos.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600 border border-blue-100 mb-5">
                <Type size={24} />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Western Creator Presets</h3>
              <p className="text-slate-600 text-sm leading-relaxed mb-4">
                Signature presets inspired by Ali Abdaal, Vox, Diary of a CEO, and Huberman Lab make your videos feel instantly recognizable.
              </p>
              <div className="rounded-lg bg-slate-50 border border-slate-200 p-2.5 text-xs font-medium text-slate-700">
                <strong className="text-slate-900">Itnavideo Engine:</strong> One-click signature typography.
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100 mb-5">
                <ShieldCheck size={24} />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Scrubber Safe Bounds</h3>
              <p className="text-slate-600 text-sm leading-relaxed mb-4">
                Engine automatically adds 84px to 120px bottom margins so subtitles never collide with YouTube's progress timeline.
              </p>
              <div className="rounded-lg bg-slate-50 border border-slate-200 p-2.5 text-xs font-medium text-slate-700">
                <strong className="text-slate-900">Itnavideo Engine:</strong> 100% unobstructed readability.
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-50 text-purple-600 border border-purple-100 mb-5">
                <Clock size={24} />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Sub-Second Word Sync</h3>
              <p className="text-slate-600 text-sm leading-relaxed mb-4">
                Groq Whisper cloud transcription timestamps each spoken word to the exact millisecond for crisp karaoke active-word highlights.
              </p>
              <div className="rounded-lg bg-slate-50 border border-slate-200 p-2.5 text-xs font-medium text-slate-700">
                <strong className="text-slate-900">Itnavideo Engine:</strong> Zero manual sync delay.
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-50 text-amber-600 border border-amber-100 mb-5">
                <Tv size={24} />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">16:9 Landscape Native</h3>
              <p className="text-slate-600 text-sm leading-relaxed mb-4">
                Built specifically for 1920x1080 widescreen formats—not cramped vertical phone layouts awkwardly stretched sideways.
              </p>
              <div className="rounded-lg bg-slate-50 border border-slate-200 p-2.5 text-xs font-medium text-slate-700">
                <strong className="text-slate-900">Itnavideo Engine:</strong> Perfect desktop &amp; TV framing.
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-rose-50 text-rose-600 border border-rose-100 mb-5">
                <Eye size={24} />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">100% Burned-In Visibility</h3>
              <p className="text-slate-600 text-sm leading-relaxed mb-4">
                Never worry if a viewer has CC turned on. Subtitles are burnt into the video pixels, guaranteeing visibility on all devices.
              </p>
              <div className="rounded-lg bg-slate-50 border border-slate-200 p-2.5 text-xs font-medium text-slate-700">
                <strong className="text-slate-900">Itnavideo Engine:</strong> Works on social embeds &amp; web players.
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-100 mb-5">
                <Zap size={24} />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Flat 2 Credits / Video</h3>
              <p className="text-slate-600 text-sm leading-relaxed mb-4">
                Render up to 5 full minutes (300 seconds) of 1080p widescreen video with burned-in subtitles for strictly 2 credits.
              </p>
              <div className="rounded-lg bg-slate-50 border border-slate-200 p-2.5 text-xs font-medium text-slate-700">
                <strong className="text-slate-900">Itnavideo Engine:</strong> Unmatched creator value.
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
              How It Works in 3 Simple Steps
            </h2>
            <p className="mt-4 text-slate-600 text-base sm:text-lg">
              Add signature widescreen subtitles to your videos in under a minute.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="rounded-2xl border border-slate-200 bg-white p-8 flex flex-col justify-between shadow-sm">
              <div>
                <span className="text-3xl font-extrabold text-blue-600 block mb-3">01</span>
                <h3 className="text-xl font-bold text-slate-900 mb-2">Upload 16:9 Video</h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  Drop your widescreen MP4 or MOV recording. Groq Whisper transcribes every spoken word with sub-second accuracy.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-100 text-xs text-slate-500 font-medium">
                ✓ Auto speech-to-text transcription
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-8 flex flex-col justify-between shadow-sm">
              <div>
                <span className="text-3xl font-extrabold text-indigo-600 block mb-3">02</span>
                <h3 className="text-xl font-bold text-slate-900 mb-2">Choose Creator Preset</h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  Pick from Ali Abdaal Clean Pill, Vox Punch, Diary of a CEO, or Huberman Focus with calibrated scrubber safe margins.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-100 text-xs text-slate-500 font-medium">
                ✓ 9 western creator typography styles
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-8 flex flex-col justify-between shadow-sm">
              <div>
                <span className="text-3xl font-extrabold text-emerald-600 block mb-3">03</span>
                <h3 className="text-xl font-bold text-slate-900 mb-2">Export 1080p Video</h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  Download a broadcast-grade 1080p widescreen MP4 with burned-in subtitles, ready to publish directly on YouTube.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-100 text-xs text-slate-500 font-medium">
                ✓ Flat 2 Credits • Cloud Render in ~45s
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
              YouTube Default CC vs. Itnavideo 16:9 Subtitles
            </h2>
            <p className="mt-3 text-slate-600 text-base">
              Why professional creators burn subtitles into their video renders.
            </p>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50">
                  <th className="p-5 text-xs font-bold uppercase text-slate-600">Feature</th>
                  <th className="p-5 text-xs font-bold uppercase text-rose-600">YouTube Default CC</th>
                  <th className="p-5 text-xs font-bold uppercase text-emerald-700 bg-emerald-50/60">Itnavideo 16:9 Subtitle Generator</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                <tr>
                  <td className="p-5 font-semibold text-slate-900">Viewer Activation</td>
                  <td className="p-5 text-slate-600">Off by default (requires viewer click)</td>
                  <td className="p-5 font-bold text-emerald-700 bg-emerald-50/30">100% visible on all screens automatically</td>
                </tr>
                <tr>
                  <td className="p-5 font-semibold text-slate-900">Player Scrubber Safe Margins</td>
                  <td className="p-5 text-slate-600">Frequently covered by red progress bar</td>
                  <td className="p-5 font-bold text-emerald-700 bg-emerald-50/30">84px to 120px bottom safe zone guaranteed</td>
                </tr>
                <tr>
                  <td className="p-5 font-semibold text-slate-900">Creator Typography Styles</td>
                  <td className="p-5 text-slate-600">Plain white monospace block text</td>
                  <td className="p-5 font-bold text-emerald-700 bg-emerald-50/30">9 Western creator presets (Ali Abdaal, Vox, etc.)</td>
                </tr>
                <tr>
                  <td className="p-5 font-semibold text-slate-900">Third-Party Embed Reliability</td>
                  <td className="p-5 text-slate-600">Often disabled or broken on blogs &amp; apps</td>
                  <td className="p-5 font-bold text-emerald-700 bg-emerald-50/30">Burned into video pixels permanently</td>
                </tr>
                <tr>
                  <td className="p-5 font-semibold text-slate-900">Credit Cost</td>
                  <td className="p-5 text-slate-600">Free, but low retention &amp; unstyled</td>
                  <td className="p-5 font-bold text-emerald-700 bg-emerald-50/30">Flat 2 Credits / Video (Up to 5m)</td>
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
            <p className="mt-3 text-slate-600 text-base">Everything you need to know about 16:9 YouTube subtitles.</p>
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
            Add 16:9 Subtitles to Your YouTube Video Today
          </h2>
          <p className="text-slate-300 text-base sm:text-lg mb-8 max-w-2xl mx-auto">
            Join thousands of creators delivering broadcast-quality landscape captions in seconds for a flat 2 credits per video.
          </p>
          <Link
            href="/dashboard?videoType=youtube-subtitle-generator"
            className="inline-flex items-center gap-2.5 rounded-xl bg-white px-8 py-4 text-base font-bold text-slate-900 shadow-xl hover:bg-slate-100 transition active:scale-95"
          >
            <Sparkles size={18} className="text-blue-600" />
            <span>Generate 16:9 Subtitles Free</span>
          </Link>
          <div className="mt-4 text-xs text-slate-400">
            Flat 2 Credits / Video (Up to 5m) • No Credit Card Required
          </div>
        </div>
      </section>
    </div>
  );
}