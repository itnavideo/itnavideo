'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { getOptimizedAvatarUrl } from '@/lib/utils';
import {
  Star,
  CheckCircle2,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Zap,
  Cpu,
  Clock,
  Sparkles,
  Quote,
} from 'lucide-react';

interface CreatorStory {
  id: string;
  name: string;
  handle: string;
  channelType: string;
  subscribers: string;
  avatarUrl: string;
  quote: string;
  keyMetric: string;
  studioName: string;
  studioHref: string;
  aspectRatio: string;
  tagColor: string;
}

const CREATOR_STORIES: CreatorStory[] = [
  {
    id: 'alex',
    name: 'Alex Miller',
    handle: '@alexmiller',
    channelType: 'YouTube Explainer Channel',
    subscribers: '180K Subs · USA',
    avatarUrl: 'https://res.cloudinary.com/dhouh9idx/image/upload/v1793018755/USA_Male_YouTube_Creator_axj5rd.jpg',
    quote:
      'I record a 3-minute voiceover on my phone, upload it, and get a complete 16:9 YouTube explainer with relevant B-roll and kinetic subtitles. My production time dropped from 6 hours to 4 minutes.',
    keyMetric: '6 Hours → 4 Minutes Production Time',
    studioName: '16:9 Faceless Video Studio',
    studioHref: '/dashboard/faceless-video',
    aspectRatio: '16:9 Widescreen',
    tagColor: 'text-orange-700 bg-orange-50 border-orange-200/80',
  },
  {
    id: 'sarah',
    name: 'Sarah Jenkins',
    handle: '@sarahclips',
    channelType: 'Short-Form Video Agency Lead',
    subscribers: '30+ Client Channels · UK',
    avatarUrl: 'https://res.cloudinary.com/dhouh9idx/image/upload/v1793018755/UK_Female_Video_Agency_Owner_adhqor.jpg',
    quote:
      'The cloud render speed is unbelievable. Zero laptop freezing, no overheating fans. We process 30+ client reels every single day entirely on AWS Lambda without a single hiccup.',
    keyMetric: '30+ Client Reels / Day on Lambda',
    studioName: 'Face Head Video Studio',
    studioHref: '/dashboard/ai-shorts-polisher',
    aspectRatio: '9:16 Vertical',
    tagColor: 'text-purple-700 bg-purple-50 border-purple-200/80',
  },
  {
    id: 'layla',
    name: 'Layla Al-Mansoor',
    handle: '@laylacreates',
    channelType: 'Lifestyle & Tech Creator',
    subscribers: '240K Followers · Riyadh',
    avatarUrl: 'https://res.cloudinary.com/dhouh9idx/image/upload/v1793018756/Saudi_Arabia_Female_Content_Creator_wycpcd.jpg',
    quote:
      'The subtitle transcription accuracy is phenomenal. It handles spoken expressions, slang, and bilingual speech effortlessly without awkward translations or manual fixes.',
    keyMetric: '±10ms Accurate Karaoke Subtitles',
    studioName: 'Auto Caption & Subtitle Studio',
    studioHref: '/dashboard/auto-caption',
    aspectRatio: '9:16 & 16:9 Dual',
    tagColor: 'text-emerald-700 bg-emerald-50 border-emerald-200/80',
  },
  {
    id: 'emily',
    name: 'Dr. Emily Watson',
    handle: '@emilywatson',
    channelType: 'Tech Educator & Researcher',
    subscribers: '95K Subs · USA',
    avatarUrl: 'https://res.cloudinary.com/dhouh9idx/image/upload/v1793018756/USA_Female_Technology_Educator_rxlo0i.jpg',
    quote:
      'The Long Video to Shorts tool extracted 5 high-hook vertical clips from our 45-minute workshop. One clip already crossed 350k views on Instagram Reels.',
    keyMetric: '350K+ Views on Viral Shorts Clip',
    studioName: 'Viral Video Clips Studio',
    studioHref: '/dashboard/long-video-clips',
    aspectRatio: '9:16 & 16:9 Dual',
    tagColor: 'text-amber-700 bg-amber-50 border-amber-200/80',
  },
  {
    id: 'tariq',
    name: 'Tariq Al-Hashimi',
    handle: '@tariqdigital',
    channelType: 'Digital Entrepreneur & Podcaster',
    subscribers: 'Top 10 Tech Podcast · Dubai',
    avatarUrl: 'https://res.cloudinary.com/dhouh9idx/image/upload/v1793018756/Dubai_Male_Digital_Entrepreneur_zqsgit.jpg',
    quote:
      'The AI Studio Audio Cleaner is pure magic. It stripped out all the echo from my office and normalized the loudness in seconds. Sounds like a $2,000 studio booth.',
    keyMetric: '$2,000 Studio Sound from Mobile Audio',
    studioName: 'AI Audio Cleaner Studio',
    studioHref: '/dashboard/audio-cleaner',
    aspectRatio: 'Broadcast Audio',
    tagColor: 'text-teal-700 bg-teal-50 border-teal-200/80',
  },
];

export default function TestimonialSection() {
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [isPaused, setIsPaused] = useState<boolean>(false);

  const activeStory = CREATOR_STORIES[activeIndex];

  const handleNext = useCallback(() => {
    setActiveIndex((prev) => (prev + 1) % CREATOR_STORIES.length);
  }, []);

  const handlePrev = useCallback(() => {
    setActiveIndex((prev) => (prev - 1 + CREATOR_STORIES.length) % CREATOR_STORIES.length);
  }, []);

  // Auto-advance every 6 seconds unless paused
  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(handleNext, 6000);
    return () => clearInterval(interval);
  }, [isPaused, handleNext]);

  return (
    <section className="relative overflow-hidden bg-white py-16 sm:py-24 border-t border-slate-100">

      {/* Soft Ambient Radial Halo */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-[600px] w-[1000px] max-w-full opacity-50 blur-3xl"
        style={{
          background:
            'radial-gradient(ellipse 70% 60% at 50% 50%, rgba(249, 115, 22, 0.08) 0%, rgba(245, 158, 11, 0.04) 50%, transparent 80%)',
        }}
      />

      <div className="relative z-10 mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 space-y-10 sm:space-y-12">

        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <h2 className="text-3xl sm:text-5xl font-black text-zinc-950 tracking-tight leading-[1.15] font-sans">
            Created in minutes,{' '}
            <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 bg-clip-text text-transparent">
              loved for years
            </span>
          </h2>

          <p className="text-sm sm:text-base text-zinc-600 leading-relaxed max-w-2xl mx-auto font-medium">
            Real video creators, podcasters, and YouTube channels scaling their content effortlessly without timeline fatigue or hardware freezes.
          </p>
        </div>

        {/* ───────────────────────────────────────────────────────────── */}
        {/* INTERACTIVE CREATOR SELECTOR TABS                             */}
        {/* ───────────────────────────────────────────────────────────── */}
        <div className="flex items-center justify-start sm:justify-center gap-2 overflow-x-auto pb-2 pt-1 px-1 no-scrollbar">
          {CREATOR_STORIES.map((story, idx) => {
            const isActive = activeIndex === idx;
            return (
              <button
                key={story.id}
                type="button"
                onClick={() => setActiveIndex(idx)}
                className={`group flex items-center gap-2.5 px-3.5 py-2 rounded-full border transition-all duration-200 cursor-pointer shrink-0 ${isActive
                    ? 'bg-zinc-950 text-white border-zinc-900 shadow-sm scale-102'
                    : 'bg-white hover:bg-zinc-50 text-zinc-700 border-zinc-200/80 hover:border-zinc-300'
                  }`}
              >
                <div className="relative h-6 w-6 rounded-full overflow-hidden border border-white/30 shrink-0">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={getOptimizedAvatarUrl(story.avatarUrl, 48)}
                    alt={story.name}
                    className="h-full w-full object-cover"
                  />
                </div>
                <span className="text-xs font-bold whitespace-nowrap">
                  {story.name}
                </span>
                {isActive && (
                  <span className="h-1.5 w-1.5 rounded-full bg-orange-500 shrink-0 animate-pulse" />
                )}
              </button>
            );
          })}
        </div>

        {/* ───────────────────────────────────────────────────────────── */}
        {/* HERO CREATOR SPOTLIGHT CARD (INTERACTIVE & RICH)              */}
        {/* ───────────────────────────────────────────────────────────── */}
        <div
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          className="relative overflow-hidden rounded-3xl border border-zinc-200/90 bg-gradient-to-br from-white via-zinc-50/40 to-orange-50/20 p-6 sm:p-10 shadow-[0_12px_40px_-15px_rgba(0,0,0,0.06)]"
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">

            {/* Left: Pull Quote & Creator Details (8 cols) */}
            <div className="lg:col-span-8 space-y-6">

              {/* Stars & Metric Badge */}
              <div className="flex flex-wrap items-center gap-3">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={16} className="fill-amber-400 text-amber-400" />
                  ))}
                </div>

                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${activeStory.tagColor}`}>
                  <Zap size={12} className="shrink-0" />
                  <span>{activeStory.keyMetric}</span>
                </span>
              </div>

              {/* Big High-Impact Quote */}
              <div className="relative">
                <Quote size={40} className="text-orange-500/15 absolute -top-4 -left-3 pointer-events-none" />
                <p className="text-lg sm:text-2xl font-bold leading-relaxed text-zinc-950 font-sans tracking-tight">
                  &ldquo;{activeStory.quote}&rdquo;
                </p>
              </div>

              {/* Creator Attribution */}
              <div className="flex items-center gap-4 pt-2">
                <div className="relative h-13 w-13 rounded-full overflow-hidden border-2 border-orange-500/40 shadow-sm shrink-0 ring-4 ring-orange-500/10">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={getOptimizedAvatarUrl(activeStory.avatarUrl, 100)}
                    alt={activeStory.name}
                    className="h-full w-full object-cover"
                  />
                </div>

                <div className="space-y-0.5">
                  <div className="flex items-center gap-1.5">
                    <h3 className="text-base sm:text-lg font-black text-zinc-950 tracking-tight">
                      {activeStory.name}
                    </h3>
                    <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
                  </div>
                  <p className="text-xs sm:text-sm font-semibold text-zinc-600">
                    {activeStory.channelType}
                  </p>
                  <p className="text-xs text-zinc-400 font-mono">
                    {activeStory.subscribers}
                  </p>
                </div>
              </div>

            </div>

            {/* Right: Studio Action Box (4 cols) */}
            <div className="lg:col-span-4 flex flex-col justify-between rounded-2xl border border-zinc-200/90 bg-white p-5 sm:p-6 shadow-xs space-y-4">
              <div className="space-y-2">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-zinc-400">
                  Studio Workflow
                </span>
                <h4 className="text-base font-extrabold text-zinc-950">
                  {activeStory.studioName}
                </h4>
                <div className="flex items-center gap-2 pt-1">
                  <span className="px-2 py-0.5 rounded-full bg-zinc-100 text-zinc-700 text-[10px] font-mono font-bold">
                    {activeStory.aspectRatio}
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold">
                    Cloud 30 FPS
                  </span>
                </div>
              </div>

              <div className="pt-2 border-t border-zinc-100">
                <Link
                  href={activeStory.studioHref}
                  className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white text-xs font-bold shadow-sm transition-all active:scale-95 text-center cursor-pointer"
                >
                  <span>Open This Studio</span>
                  <ArrowRight size={14} />
                </Link>
              </div>

              {/* Slider Navigation Controls */}
              <div className="flex items-center justify-between pt-2">
                <div className="flex items-center gap-1">
                  {CREATOR_STORIES.map((_, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setActiveIndex(i)}
                      className="h-11 min-w-[28px] px-1 flex items-center justify-center cursor-pointer group"
                      aria-label={`Go to story ${i + 1}`}
                    >
                      <span
                        className={`h-2 rounded-full transition-all duration-300 ${activeIndex === i ? 'w-6 bg-orange-600' : 'w-2 bg-zinc-300 group-hover:bg-zinc-400'
                          }`}
                      />
                    </button>
                  ))}
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={handlePrev}
                    aria-label="Previous story"
                    className="h-11 w-11 rounded-full border border-zinc-200 hover:bg-zinc-100 text-zinc-600 hover:text-zinc-900 flex items-center justify-center transition-colors cursor-pointer"
                  >
                    <ChevronLeft size={16} />
                  </button>
                  <button
                    type="button"
                    onClick={handleNext}
                    aria-label="Next story"
                    className="h-11 w-11 rounded-full border border-zinc-200 hover:bg-zinc-100 text-zinc-600 hover:text-zinc-900 flex items-center justify-center transition-colors cursor-pointer"
                  >
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>

            </div>

          </div>
        </div>

        {/* ───────────────────────────────────────────────────────────── */}
        {/* 3 DISTINCT VALUE PROOF PILLARS (ZERO DUPLICATION)             */}
        {/* ───────────────────────────────────────────────────────────── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">

          <div className="rounded-2xl border border-zinc-200/90 bg-white p-6 shadow-xs space-y-2.5 text-left">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-orange-500/10 text-orange-600 border border-orange-500/20">
              <Clock size={18} />
            </div>
            <h3 className="text-base font-bold text-zinc-950">Under 2 Minutes</h3>
            <p className="text-xs text-zinc-600 leading-relaxed font-normal">
              Distributed AWS Lambda 30fps headless cloud rendering. No laptop fan noise, zero disk paging, and zero timeline lag.
            </p>
          </div>

          <div className="rounded-2xl border border-zinc-200/90 bg-white p-6 shadow-xs space-y-2.5 text-left">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
              <Sparkles size={18} />
            </div>
            <h3 className="text-base font-bold text-zinc-950">±10ms Accurate Subtitles</h3>
            <p className="text-xs text-zinc-600 leading-relaxed font-normal">
              Groq Whisper word-level precision with 32 viral subtitle presets, automatic emoji accents, and dual language support.
            </p>
          </div>

          <div className="rounded-2xl border border-zinc-200/90 bg-white p-6 shadow-xs space-y-2.5 text-left">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-500/10 text-blue-600 border border-blue-500/20">
              <Cpu size={18} />
            </div>
            <h3 className="text-base font-bold text-zinc-950">1 Minute = 1 Credit</h3>
            <p className="text-xs text-zinc-600 leading-relaxed font-normal">
              Transparent economics with zero hidden fees. Includes 5 free renders every single day with no credit card required.
            </p>
          </div>

        </div>

        {/* Trust Summary & Bottom CTA */}
        <div className="text-center pt-2">
          <div className="inline-flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-6 rounded-2xl bg-stone-50 border border-stone-200/80 px-6 py-3.5 shadow-2xs">
            <div className="flex items-center gap-2">
              <div className="flex -space-x-2 overflow-hidden">
                {CREATOR_STORIES.slice(0, 4).map((story) => (
                  <div
                    key={story.id}
                    className="relative inline-block h-8 w-8 rounded-full ring-2 ring-white overflow-hidden shadow-2xs"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={story.avatarUrl}
                      alt={story.name}
                      className="h-full w-full object-cover"
                      loading="lazy"
                    />
                  </div>
                ))}
              </div>
              <span className="text-xs sm:text-sm font-bold text-slate-800">
                Over 5,000+ creators creating weekly
              </span>
            </div>

            <span className="hidden sm:inline text-stone-300">•</span>

            <Link
              href="/dashboard"
              className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-extrabold text-orange-600 hover:text-orange-500 transition-colors"
            >
              <span>Join them on Itnavideo</span>
              <ArrowRight size={14} strokeWidth={2.5} />
            </Link>
          </div>
        </div>

      </div>
    </section>
  );
}
