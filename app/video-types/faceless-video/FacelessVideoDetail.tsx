'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import ExploreMoreVideoTools from '@/components/landing/ExploreMoreVideoTools';
import {
  Sparkles,
  ArrowRight,
  Clock,
  ShieldCheck,
  Zap,
  BarChart3,
  Users,
  FileText,
  Music,
  CheckCircle2,
  ChevronDown,
  Monitor,
  Film,
  Tv,
  Briefcase,
  Play,
} from 'lucide-react';

export default function FacelessVideoDetail() {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const toggleFaq = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  const faqData = [
    {
      q: 'What is an AI Faceless Video, and how does it help creators grow channels?',
      a: 'A faceless video is a high-production video where the creator does not appear on camera. Instead of relying on a talking head, the video engages viewers through voiceover narration, curated stock B-roll, dynamic vector drawings, studio vignette backgrounds, and word-synced animated subtitles. It allows creators to build monetized YouTube channels without camera anxiety or expensive gear.',
    },
    {
      q: 'How does Itnavideo generate a 16:9 widescreen video from audio or a script?',
      a: 'You simply upload your voiceover recording (MP3, WAV, M4A) or paste your script. Itnavideo transcribes the speech with millisecond accuracy, detects key story beats, matches relevant cinematic visuals from our high-definition asset library, adds subtle Ken Burns camera motion, ducks background music automatically, and renders a 1080p Full HD widescreen MP4.',
    },
    {
      q: 'Do I need complex video editing software like Premiere Pro or DaVinci Resolve?',
      a: 'No editing software is required. Traditional video editing takes 8 to 15 hours per 10-minute video—searching for B-roll, cutting clips, and keyframing subtitles. Itnavideo automates the entire process in the cloud in under 2 minutes.',
    },
    {
      q: 'What is the credit pricing for Faceless Videos?',
      a: '16:9 Faceless Videos follow our predictable 1 Min = 1 Credit standard (1 min = 1 credit, 2 min = 2 credits, 3 min = 3 credits, 4 min = 4 credits, up to 5 minutes = 5 credits max).',
    },
    {
      q: 'Can I monetize faceless videos on YouTube and social platforms?',
      a: 'Yes! All videos rendered on Itnavideo include full commercial licensing. You own your content 100% and can monetize your videos through YouTube AdSense, sponsorships, affiliate links, or client deliverables.',
    },
    {
      q: 'Can I customize background themes, font highlights, and music?',
      a: 'Yes. You have full control over background styles (clean studio white, dark obsidian, midnight slate, or brand vignettes), kinetic typography fonts, font color accents, background music volume, and sound effects.',
    },
    {
      q: 'What aspect ratios and resolutions are supported?',
      a: 'Faceless Video is optimized for 16:9 Full HD Widescreen (1920×1080 at 30 FPS) for YouTube long-form, desktop presentations, and web streaming.',
    },
    {
      q: 'How does the AI match English stock B-roll to Hindi or regional language audio?',
      a: 'Our transcription engine transcribes your speech via Groq Whisper and semantically translates key story concepts into curated English visual keywords. This allows the system to seamlessly pull contextually relevant, ultra-high-definition stock footage from international media libraries while simultaneously displaying clean Roman Hinglish subtitles on screen.',
    },
    {
      q: 'What makes faceless channels built with Itnavideo stand out from generic automated slideshows?',
      a: 'Generic automated tools stitch together low-quality AI images with robotic robotic voices that viewers immediately swipe away. Itnavideo applies documentary-grade storytelling techniques: dynamic Ken Burns camera easing, calculated scene pacing, audio auto-ducking that breathes with your voiceover, and word-synced typography modeled after high-retention creator formats.',
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
    name: 'Itnavideo AI Faceless Video Generator',
    operatingSystem: 'Web-based Cloud Platform',
    applicationCategory: 'MultimediaApplication',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
    description: 'Transform voiceovers and scripts into 1080p 16:9 widescreen YouTube videos with curated stock B-roll, studio backgrounds, and karaoke subtitles.',
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
            Create High-Yield YouTube Videos{' '}
            <span className="bg-gradient-to-r from-[#FF5722] via-[#FF7043] to-[#FFA000] bg-clip-text text-transparent">
              Without Showing Your Face
            </span>
          </h1>

          {/* Sub-headline */}
          <p className="mt-6 text-lg sm:text-xl text-slate-600 leading-relaxed font-normal max-w-3xl mx-auto">
            Turn voiceovers, podcast audio, or raw scripts into complete, documentary-grade 1080p widescreen YouTube videos in under 2 minutes. No cameras, studio lighting, or video editing experience required.
          </p>

          {/* Action Buttons */}
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/dashboard/faceless-video"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 rounded-2xl bg-gradient-to-r from-[#FF5722] via-[#FF7043] to-[#FFA000] px-8 py-4 text-base font-black text-white shadow-xl shadow-orange-500/25 hover:shadow-orange-500/40 hover:brightness-110 active:scale-95 transition-all duration-200"
            >
              <Sparkles size={18} className="fill-white stroke-white" />
              <span>Create Faceless Video Free</span>
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
              <span>16:9 Widescreen Only</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 size={16} className="text-[#FF5722]" />
              <span>1 Min = 1 Credit</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 size={16} className="text-[#FF5722]" />
              <span>Curated Stock B-Roll &amp; SFX</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 size={16} className="text-[#FF5722]" />
              <span>1080p 60 FPS Export</span>
            </div>
          </div>
        </div>
      </section>

      {/* ─── 2. 16:9 VISUAL STUDIO SHOWCASE (INTERACTIVE MOCKUP) ─── */}
      <section className="py-16 sm:py-24 bg-slate-50/70 border-b border-slate-100">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
              The Automated Vox-Style Documentary Pipeline
            </h2>
            <p className="mt-3 text-base text-slate-600">
              Transform plain voice narration into rich 16:9 widescreen scenes with automatic visual pacing and animated captions.
            </p>
          </div>

          {/* 16:9 Video Canvas Mockup */}
          <div className="relative mx-auto max-w-5xl rounded-3xl border border-slate-200/90 bg-white p-3 sm:p-5 shadow-xl shadow-slate-200/50">
            <div className="relative aspect-video w-full overflow-hidden rounded-2xl bg-slate-950 border border-slate-800">
              
              {/* Mockup Header bar */}
              <div className="absolute top-0 inset-x-0 z-20 flex items-center justify-between px-5 py-3 bg-gradient-to-b from-black/80 to-transparent">
                <div className="flex items-center gap-2">
                  <span className="h-3 w-3 rounded-full bg-red-500/80" />
                  <span className="h-3 w-3 rounded-full bg-amber-500/80" />
                  <span className="h-3 w-3 rounded-full bg-emerald-500/80" />
                  <span className="ml-2 text-xs font-mono font-bold text-slate-300">1920×1080 • 16:9 Cinema Widescreen</span>
                </div>
                <div className="inline-flex items-center gap-1.5 rounded-full bg-[#FF5722]/20 px-3 py-1 text-[11px] font-bold text-orange-300 border border-[#FF5722]/30">
                  <Monitor size={12} />
                  <span>1080p Full HD</span>
                </div>
              </div>

              {/* Dynamic Poster Image */}
              <Image
                src="https://res.cloudinary.com/dhouh9idx/image/upload/v1792945592/file_000000004290821180a71f25ad75480e_nztpwe.png"
                alt="AI Faceless Video Generator 16:9 YouTube Widescreen Studio Preview"
                width={1920}
                height={1080}
                className="h-full w-full object-cover"
                priority
              />

              {/* Overlay Play Button */}
              <div className="absolute inset-0 flex items-center justify-center bg-black/30 backdrop-blur-[2px] group">
                <Link
                  href="/dashboard/faceless-video"
                  className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-r from-[#FF5722] via-[#FF7043] to-[#FFA000] text-white shadow-2xl shadow-orange-500/50 group-hover:scale-110 transition-transform"
                >
                  <Play size={32} className="ml-1 fill-white" />
                </Link>
              </div>

              {/* Mock Subtitle Strip */}
              <div className="absolute bottom-6 inset-x-0 z-20 flex justify-center px-6">
                <div className="rounded-xl bg-black/85 border border-white/10 px-6 py-2.5 text-center text-xs sm:text-sm font-extrabold text-white shadow-2xl backdrop-blur-md">
                  <span className="text-yellow-400">AUTOMATED STORYTELLING:</span> AI matches scenes, B-roll, and music in seconds.
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
              Produce documentary-grade 16:9 YouTube videos without timelines, keyframing, or render crashes.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="rounded-3xl border border-slate-200/90 bg-white p-7 shadow-xs">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-50 text-[#FF5722] font-black text-lg mb-5 border border-orange-200/60">
                1
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Upload Voiceover or Script</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Upload your recorded audio file (MP3, WAV, M4A up to 5 minutes) or paste your script. Groq Whisper transcribes speech with word-level precision.
              </p>
            </div>

            <div className="rounded-3xl border border-slate-200/90 bg-white p-7 shadow-xs">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-50 text-[#FF5722] font-black text-lg mb-5 border border-orange-200/60">
                2
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">AI Scene &amp; Visual Choreography</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                The director engine analyzes story beats, selects matching high-definition stock B-roll, applies Ken Burns motion, and ducks background music.
              </p>
            </div>

            <div className="rounded-3xl border border-slate-200/90 bg-white p-7 shadow-xs">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-50 text-[#FF5722] font-black text-lg mb-5 border border-orange-200/60">
                3
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Instant Cloud Render &amp; Export</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Download a clean, 1080p Full HD MP4 video ready to upload to YouTube, monetized with zero watermarks on paid plans.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ─── 4. THE 6 MAJOR BOTTLENECKS SOLVED ─── */}
      <section className="py-16 sm:py-24 bg-slate-50/60 border-b border-slate-100">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
              The 6 Production Bottlenecks Itnavideo Solves
            </h2>
            <p className="mt-3 text-base text-slate-600">
              How our automated cloud pipeline replaces 10+ hours of tedious manual timeline editing.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-2xs">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-100 text-[#FF5722] mb-4">
                <Clock size={20} />
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-1.5">10+ Hours Saved per Video</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Eliminates manual timeline cutting, keyframe zooming, and audio waveform matching.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-2xs">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-100 text-[#FF5722] mb-4">
                <Film size={20} />
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-1.5">Auto Stock B-Roll Matching</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Semantic AI matches relevant visuals based on your spoken keywords and scene context.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-2xs">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-100 text-[#FF5722] mb-4">
                <Tv size={20} />
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-1.5">$0 Camera &amp; Studio Gear</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                No expensive 4K cameras, ring lights, or green screens. High-retention visual storytelling.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-2xs">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-100 text-[#FF5722] mb-4">
                <FileText size={20} />
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-1.5">Word-Synced Subtitles</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Word-synced subtitles with active word highlights rendered in real-time.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-2xs">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-100 text-[#FF5722] mb-4">
                <Music size={20} />
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-1.5">Automated Audio Ducking</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Background music lowers automatically during speech and swells smoothly during pauses.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-2xs">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-100 text-[#FF5722] mb-4">
                <Briefcase size={20} />
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-1.5">Publish Without Burnout</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Record narration on your phone, upload to Itnavideo, and publish multiple videos weekly.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ─── 5. WHO IS IT BUILT FOR (CREATOR & BUSINESS USE CASES) ─── */}
      <section className="py-16 sm:py-24 border-b border-slate-100">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
              Popular Channels Built With Faceless Videos
            </h2>
            <p className="mt-3 text-base text-slate-600">
              Explore how creators across popular categories build audience trust and long-term brand equity.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
              <h3 className="text-base font-bold text-slate-900 mb-2">History &amp; Documentaries</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Cover historical events and deep-dive documentaries with archival B-roll, vignette backgrounds, and dramatic narration.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
              <h3 className="text-base font-bold text-slate-900 mb-2">Finance &amp; Personal Investing</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Explain stock market trends, banking updates, real estate strategies, and economic news using clean stat cards.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
              <h3 className="text-base font-bold text-slate-900 mb-2">Tech Explainers &amp; AI</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Break down artificial intelligence tools, software updates, and hardware breakdowns with modern tech overlays.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
              <h3 className="text-base font-bold text-slate-900 mb-2">Book Summaries &amp; Lessons</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Distill best-selling non-fiction books, psychology insights, and philosophy into digestible chapter-based visual guides.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
              <h3 className="text-base font-bold text-slate-900 mb-2">True Crime &amp; Mystery</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Narrate real-life mysteries, investigative cases, and suspense stories using atmosphere-rich visual pacing.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
              <h3 className="text-base font-bold text-slate-900 mb-2">Corporate Training</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Convert internal company policy documentation, training handbooks, and client onboarding decks into standardized video lessons.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ─── 6. PRODUCTION COMPARISON TABLE ─── */}
      <section className="py-16 sm:py-24 bg-slate-50/70 border-b border-slate-100">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
              Traditional Video Editing vs. Itnavideo AI
            </h2>
            <p className="mt-2 text-sm text-slate-600">
              Compare manual editing workflows against automated AI cloud rendering.
            </p>
          </div>

          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead className="border-b border-slate-200 bg-slate-100/70 text-slate-700">
                  <tr>
                    <th className="p-4 font-bold">Production Metric</th>
                    <th className="p-4 font-bold text-rose-600">Traditional Editing Software</th>
                    <th className="p-4 font-bold text-[#FF5722]">Itnavideo AI Faceless Studio</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  <tr>
                    <td className="p-4 font-semibold text-slate-900">Editing Time (5m Video)</td>
                    <td className="p-4 text-slate-500">6 to 12 hours of timeline work</td>
                    <td className="p-4 font-bold text-emerald-600">Under 2 minutes total</td>
                  </tr>
                  <tr>
                    <td className="p-4 font-semibold text-slate-900">Technical Skill Required</td>
                    <td className="p-4 text-slate-500">High (Keyframing, cuts, audio mixing)</td>
                    <td className="p-4 font-bold text-emerald-600">Zero (Click &amp; generate)</td>
                  </tr>
                  <tr>
                    <td className="p-4 font-semibold text-slate-900">Stock Asset Sourcing</td>
                    <td className="p-4 text-slate-500">Manual search &amp; paid subscriptions</td>
                    <td className="p-4 font-bold text-emerald-600">Automated AI stock matching</td>
                  </tr>
                  <tr>
                    <td className="p-4 font-semibold text-slate-900">Subtitles &amp; Captions</td>
                    <td className="p-4 text-slate-500">Manual typing or separate plugins</td>
                    <td className="p-4 font-bold text-emerald-600">Word-synced karaoke highlights built-in</td>
                  </tr>
                  <tr>
                    <td className="p-4 font-semibold text-slate-900">Hardware Requirements</td>
                    <td className="p-4 text-slate-500">Expensive editing PC with GPU</td>
                    <td className="p-4 font-bold text-emerald-600">100% Web-based (Runs in browser)</td>
                  </tr>
                  <tr>
                    <td className="p-4 font-semibold text-slate-900">Cost Policy</td>
                    <td className="p-4 text-slate-500">$200 – $500 per video</td>
                    <td className="p-4 font-bold text-emerald-600">1 Min = 1 Credit</td>
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
            Start Turning Your Ideas into HD YouTube Videos
          </h2>
          <p className="text-slate-600 text-base max-w-xl mx-auto mb-8">
            Create high-retention 16:9 widescreen videos without camera gear or complex editing software.
          </p>
          <Link
            href="/dashboard/faceless-video"
            className="inline-flex items-center gap-2.5 rounded-2xl bg-gradient-to-r from-[#FF5722] via-[#FF7043] to-[#FFA000] px-8 py-4 text-base font-black text-white shadow-xl shadow-orange-500/25 hover:shadow-orange-500/40 hover:brightness-110 active:scale-95 transition-all duration-200"
          >
            <Sparkles size={18} className="fill-white stroke-white" />
            <span>Open Faceless Video Studio Free</span>
            <ArrowRight size={18} />
          </Link>
        </div>
      </section>

      {/* EXPLORE ALL 14 OTHER VIDEO TOOLS */}
      <ExploreMoreVideoTools currentToolId="facelessVideo" />
    </div>
  );
}
