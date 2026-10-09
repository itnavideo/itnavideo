'use client';

import React from 'react';
import Link from 'next/link';
import {
  Captions,
  MonitorPlay,
  PenTool,
  FileImage,
  Mic,
  FileText,
  BookOpen,
  ChevronRight,
  ArrowRight,
  Play,
  Columns,
  Tv,
  Scissors,
  Sparkles,
  Layers,
} from 'lucide-react';

export interface VideoTypeItem {
  id: string;
  name: string;
  href: string;
  icon: React.ElementType;
  iconBgClass: string;
  iconColorClass: string;
  aspectRatio: '9:16' | '16:9';
  description?: string;
  isPopular?: boolean;
}

// ─────────────────────────────────────────────────────────────────────────────
// ACCURATE VIDEO TYPES REGISTRY (Only Active & Implemented Studios)
// ─────────────────────────────────────────────────────────────────────────────

export const VERTICAL_916_TYPES: VideoTypeItem[] = [
  {
    id: 'auto-caption',
    name: 'Auto Caption Generator',
    href: '/auto-caption-generator',
    icon: Captions,
    iconBgClass: 'bg-orange-500/15 border border-orange-500/30',
    iconColorClass: 'text-orange-400',
    aspectRatio: '9:16',
    description: 'Kinetic word-synced subtitles for Reels, Shorts & TikTok.',
    isPopular: true,
  },
  {
    id: 'compare-explainer',
    name: 'Compare Explainer',
    href: '/video-types/compare-explainer',
    icon: Columns,
    iconBgClass: 'bg-amber-500/15 border border-amber-500/30',
    iconColorClass: 'text-amber-400',
    aspectRatio: '9:16',
    description: 'Side-by-side comparison reels with narration & custom visuals.',
  },
  {
    id: 'whiteboard-video',
    name: 'Whiteboard Video',
    href: '/video-types/whiteboard-video',
    icon: PenTool,
    iconBgClass: 'bg-emerald-500/15 border border-emerald-500/30',
    iconColorClass: 'text-emerald-400',
    aspectRatio: '9:16',
    description: 'Transform spoken narration into hand-drawn whiteboard scenes.',
  },
  {
    id: 'typography-video',
    name: 'Kinetic Typography',
    href: '/video-types/typography-video',
    icon: FileText,
    iconBgClass: 'bg-teal-500/15 border border-teal-500/30',
    iconColorClass: 'text-teal-400',
    aspectRatio: '9:16',
    description: 'Kinetic speech-to-text animated motion typography.',
  },
  {
    id: 'long-video-promo',
    name: 'Long Video Promo',
    href: '/video-types/long-video-promo',
    icon: Tv,
    iconBgClass: 'bg-blue-500/15 border border-blue-500/30',
    iconColorClass: 'text-blue-400',
    aspectRatio: '9:16',
    description: 'Promote widescreen videos with thumbnail, handle & CTA layout.',
  },
  {
    id: 'long-video-clips',
    name: 'Long Video to Clips',
    href: '/video-types/long-video-clips',
    icon: Scissors,
    iconBgClass: 'bg-purple-500/15 border border-purple-500/30',
    iconColorClass: 'text-purple-400',
    aspectRatio: '9:16',
    description: 'Detect viral high-retention moments from long videos into shorts.',
    isPopular: true,
  },
];

export const HORIZONTAL_169_TYPES: VideoTypeItem[] = [
  {
    id: 'image-to-video-169',
    name: 'Image to Video AI',
    href: '/tools/image-to-video-ai',
    icon: FileImage,
    iconBgClass: 'bg-cyan-500/15 border border-cyan-500/30',
    iconColorClass: 'text-cyan-400',
    aspectRatio: '16:9',
    description: 'Cinematic widescreen storytelling with Ken Burns motion & voice sync.',
    isPopular: true,
  },
  {
    id: 'youtube-subtitle-generator',
    name: 'YouTube Subtitle Generator',
    href: '/youtube-subtitle-generator',
    icon: Captions,
    iconBgClass: 'bg-red-500/15 border border-red-500/30',
    iconColorClass: 'text-red-400',
    aspectRatio: '16:9',
    description: 'Burn clean Western-style subtitle strips into widescreen podcasts.',
  },
  {
    id: 'faceless-video-169',
    name: 'Faceless Video',
    href: '/video-types/faceless-video',
    icon: MonitorPlay,
    iconBgClass: 'bg-indigo-500/15 border border-indigo-500/30',
    iconColorClass: 'text-indigo-400',
    aspectRatio: '16:9',
    description: 'Automated 16:9 widescreen storytelling with AI voiceover & B-roll.',
    isPopular: true,
  },
  {
    id: 'book-summary',
    name: 'Book Summary Video',
    href: '/dashboard/book-summary',
    icon: BookOpen,
    iconBgClass: 'bg-rose-500/15 border border-rose-500/30',
    iconColorClass: 'text-rose-400',
    aspectRatio: '16:9',
    description: 'Turn book narration into 16:9 lesson card video explainers.',
  },
  {
    id: 'audio-cleaner',
    name: 'AI Audio Cleaner',
    href: '/tools/ai-audio-cleaner',
    icon: Mic,
    iconBgClass: 'bg-emerald-500/15 border border-emerald-500/30',
    iconColorClass: 'text-emerald-400',
    aspectRatio: '16:9',
    description: 'Detect retakes, remove background noise, and export studio audio.',
  },
];

// SVG Hand-drawn Curved Arrows for Annotations
function HandDrawnArrow916() {
  return (
    <svg width="48" height="48" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-[#FF8F00] shrink-0">
      <path
        d="M10 12 C 25 8, 48 18, 38 42 M 38 42 L 30 36 M 38 42 L 44 34"
        stroke="currentColor"
        strokeWidth="2.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function HandDrawnArrow169() {
  return (
    <svg width="48" height="48" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-[#FF8F00] shrink-0">
      <path
        d="M12 10 C 32 10, 46 22, 36 44 M 36 44 L 28 38 M 36 44 L 42 36"
        stroke="currentColor"
        strokeWidth="2.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function TenStudiosHubArchitecture() {
  return (
    <section id="video-types" className="relative w-full overflow-hidden bg-gradient-to-b from-[#070B14] via-[#0A0F1D] to-[#070B14] py-16 text-zinc-100 sm:py-24 border-b border-white/10">
      {/* Background Glows */}
      <div className="pointer-events-none absolute left-1/2 top-1/4 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-[#FF6D00]/5 blur-[160px] rounded-full" />
      <div className="pointer-events-none absolute right-0 bottom-10 w-96 h-96 bg-orange-600/5 blur-[140px] rounded-full" />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full">
        
        {/* =================================================================── */}
        {/* SECTION 1: 9:16 VIDEO TYPES                                          */}
        {/* =================================================================── */}
        <div className="mb-20 sm:mb-28">
          
          {/* Top Banner Row: Left Typography & Description | Right 9:16 Mockup */}
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-12">
            
            {/* Left Content */}
            <div className="max-w-xl text-center lg:text-left">
              {/* Handwritten Decorative Accent */}
              <div className="mb-1 inline-block">
                <span className="font-[family-name:var(--font-caveat)] text-2xl sm:text-3xl font-extrabold text-[#FF8F00] tracking-wide">
                  AI-Powered
                </span>
              </div>
              
              <h2 className="text-3xl font-black tracking-tight text-white sm:text-5xl lg:text-6xl font-sans">
                9:16 Video Types
              </h2>

              <p className="mt-3 text-sm sm:text-base md:text-lg text-zinc-400 font-normal leading-relaxed">
                Create vertical videos for Reels, Shorts and TikTok. Choose from a wide range of AI-powered video types.
              </p>
            </div>

            {/* Right Side: 9:16 Phone Mockup + Handwritten Annotation */}
            <div className="relative flex items-center justify-center shrink-0 sm:mr-32">
              
              {/* Phone Container */}
              <div className="relative group w-[170px] sm:w-[210px] aspect-[9/16] rounded-[32px] border-4 border-zinc-800 bg-zinc-950 p-1.5 shadow-2xl shadow-black/80 overflow-hidden transition-transform duration-300 hover:scale-[1.02]">
                {/* Phone Screen Mockup */}
                <div className="relative h-full w-full rounded-[24px] overflow-hidden bg-gradient-to-b from-teal-900 via-sky-900 to-slate-950 flex flex-col items-center justify-center">
                  
                  {/* Background Nature Image / Graphic */}
                  <img
                    src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=600&auto=format&fit=crop"
                    alt="9:16 Vertical Video Preview"
                    className="absolute inset-0 h-full w-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/30" />

                  {/* Kinetic Subtitle Overlay inside mockup */}
                  <div className="relative z-10 px-3 text-center mb-4">
                    <span className="font-extrabold text-white text-xl sm:text-2xl drop-shadow-[0_4px_8px_rgba(0,0,0,0.8)] font-sans italic tracking-tight">
                      Good Vibes Only
                    </span>
                  </div>

                  {/* Play Button Icon Overlay */}
                  <div className="relative z-10 flex h-12 w-12 items-center justify-center rounded-full bg-black/50 border border-white/30 backdrop-blur-md shadow-lg group-hover:bg-[#FF6D00] group-hover:border-[#FF6D00] group-hover:text-black transition-all">
                    <Play size={20} className="fill-current text-white group-hover:text-black ml-0.5" />
                  </div>
                </div>

                {/* Speaker Notch */}
                <div className="absolute top-3 left-1/2 -translate-x-1/2 h-3 w-16 bg-zinc-800 rounded-full z-20" />
              </div>

              {/* Curved Arrow Annotation */}
              <div className="absolute left-[calc(100%+6px)] top-6 hidden sm:flex items-center gap-1.5 pointer-events-none select-none">
                <HandDrawnArrow916 />
                <div className="flex flex-col text-left shrink-0">
                  <span className="font-[family-name:var(--font-caveat)] text-xl sm:text-2xl font-bold text-[#FF8F00] leading-none whitespace-nowrap">
                    9:16
                  </span>
                  <span className="font-[family-name:var(--font-caveat)] text-lg sm:text-xl font-bold text-[#FF8F00] leading-none whitespace-nowrap">
                    Vertical Video
                  </span>
                </div>
              </div>

            </div>
          </div>

          {/* 9:16 Cards Grid — 4 Columns Desktop | 2 Columns Compact Mobile */}
          <div className="mt-10 sm:mt-12 grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-3.5">
            {VERTICAL_916_TYPES.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.id}
                  href={item.href}
                  className="group relative flex items-center justify-between rounded-2xl border border-white/10 bg-[#0E1526]/90 p-2.5 sm:p-3.5 hover:border-[#FF6D00]/50 hover:bg-[#151E30] transition-all duration-200 active:scale-[0.98] shadow-sm hover:shadow-xl hover:shadow-[#FF6D00]/10"
                >
                  <div className="flex items-center gap-2.5 sm:gap-3 min-w-0 flex-1 pr-1.5">
                    {/* Icon Square Badge */}
                    <div className={`flex h-9 w-9 sm:h-10 sm:w-10 shrink-0 items-center justify-center rounded-xl ${item.iconBgClass} ${item.iconColorClass} group-hover:scale-105 transition-transform`}>
                      <Icon size={18} className="sm:w-5 sm:h-5" />
                    </div>
                    {/* Clean Title */}
                    <span className="text-xs sm:text-sm font-bold text-white tracking-tight truncate group-hover:text-[#FF9100] transition-colors">
                      {item.name}
                    </span>
                  </div>

                  {/* Right Arrow Chevron */}
                  <ChevronRight
                    size={15}
                    className="shrink-0 text-zinc-500 group-hover:text-[#FF8F00] group-hover:translate-x-0.5 transition-all"
                  />
                </Link>
              );
            })}
          </div>

          {/* View All 9:16 Button */}
          <div className="mt-8 sm:mt-10 flex justify-center">
            <Link
              href="/dashboard"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-white/10 bg-[#0E1526] px-6 py-2.5 sm:px-8 sm:py-3 text-xs sm:text-sm font-extrabold text-zinc-200 hover:border-[#FF6D00]/60 hover:bg-[#151E30] hover:text-white transition-all shadow-md active:scale-95"
            >
              <span>View All 9:16 Video Types</span>
              <ArrowRight size={15} className="text-[#FF8F00]" />
            </Link>
          </div>

        </div>


        {/* =================================================================── */}
        {/* SECTION 2: 16:9 VIDEO TYPES                                         */}
        {/* =================================================================── */}
        <div>
          
          {/* Top Banner Row: Left Typography & Description | Right 16:9 Mockup */}
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-12">
            
            {/* Left Content */}
            <div className="max-w-xl text-center lg:text-left">
              {/* Handwritten Decorative Accent */}
              <div className="mb-1 inline-block">
                <span className="font-[family-name:var(--font-caveat)] text-2xl sm:text-3xl font-extrabold text-[#FF8F00] tracking-wide">
                  Popular
                </span>
              </div>
              
              <h2 className="text-3xl font-black tracking-tight text-white sm:text-5xl lg:text-6xl font-sans">
                16:9 Video Types
              </h2>

              <p className="mt-3 text-sm sm:text-base md:text-lg text-zinc-400 font-normal leading-relaxed">
                Create horizontal videos for YouTube, presentations, explainer videos and more.
              </p>
            </div>

            {/* Right Side: 16:9 Landscape Player Mockup + Handwritten Annotation */}
            <div className="relative flex items-center justify-center shrink-0 sm:mr-32">
              
              {/* Widescreen Frame Container */}
              <div className="relative group w-[280px] sm:w-[350px] aspect-[16/9] rounded-2xl border-4 border-zinc-800 bg-zinc-950 p-1.5 shadow-2xl shadow-black/80 overflow-hidden transition-transform duration-300 hover:scale-[1.02]">
                {/* Widescreen Video Screen */}
                <div className="relative h-full w-full rounded-xl overflow-hidden bg-gradient-to-br from-amber-950 via-slate-900 to-zinc-950 flex items-center justify-center">
                  
                  {/* Scenic Cinematic Image */}
                  <img
                    src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=800&auto=format&fit=crop"
                    alt="16:9 Widescreen Video Preview"
                    className="absolute inset-0 h-full w-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30" />

                  {/* Play Button Overlay */}
                  <div className="relative z-10 flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-full bg-black/50 border border-white/30 backdrop-blur-md shadow-xl group-hover:bg-[#FF6D00] group-hover:border-[#FF6D00] group-hover:text-black transition-all">
                    <Play size={22} className="fill-current text-white group-hover:text-black ml-0.5" />
                  </div>

                  {/* Bottom Video Progress Bar Mockup */}
                  <div className="absolute bottom-2 left-3 right-3 z-10 flex items-center gap-2">
                    <div className="h-1 flex-1 rounded-full bg-white/30 overflow-hidden">
                      <div className="h-full w-2/5 bg-[#FF6D00] rounded-full" />
                    </div>
                    <span className="text-[10px] font-mono font-bold text-zinc-300">HD</span>
                  </div>
                </div>
              </div>

              {/* Curved Arrow Annotation */}
              <div className="absolute left-[calc(100%+6px)] top-6 hidden sm:flex items-center gap-1.5 pointer-events-none select-none">
                <HandDrawnArrow169 />
                <div className="flex flex-col text-left shrink-0">
                  <span className="font-[family-name:var(--font-caveat)] text-xl sm:text-2xl font-bold text-[#FF8F00] leading-none whitespace-nowrap">
                    16:9
                  </span>
                  <span className="font-[family-name:var(--font-caveat)] text-lg sm:text-xl font-bold text-[#FF8F00] leading-none whitespace-nowrap">
                    Horizontal Video
                  </span>
                </div>
              </div>

            </div>
          </div>

          {/* 16:9 Cards Grid — 4 Columns Desktop | 2 Columns Compact Mobile */}
          <div className="mt-10 sm:mt-12 grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-3.5">
            {HORIZONTAL_169_TYPES.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.id}
                  href={item.href}
                  className="group relative flex items-center justify-between rounded-2xl border border-white/10 bg-[#0E1526]/90 p-2.5 sm:p-3.5 hover:border-[#FF6D00]/50 hover:bg-[#151E30] transition-all duration-200 active:scale-[0.98] shadow-sm hover:shadow-xl hover:shadow-[#FF6D00]/10"
                >
                  <div className="flex items-center gap-2.5 sm:gap-3 min-w-0 flex-1 pr-1.5">
                    {/* Icon Square Badge */}
                    <div className={`flex h-9 w-9 sm:h-10 sm:w-10 shrink-0 items-center justify-center rounded-xl ${item.iconBgClass} ${item.iconColorClass} group-hover:scale-105 transition-transform`}>
                      <Icon size={18} className="sm:w-5 sm:h-5" />
                    </div>
                    {/* Clean Title */}
                    <span className="text-xs sm:text-sm font-bold text-white tracking-tight truncate group-hover:text-[#FF9100] transition-colors">
                      {item.name}
                    </span>
                  </div>

                  {/* Right Arrow Chevron */}
                  <ChevronRight
                    size={15}
                    className="shrink-0 text-zinc-500 group-hover:text-[#FF8F00] group-hover:translate-x-0.5 transition-all"
                  />
                </Link>
              );
            })}
          </div>

          {/* View All 16:9 Button */}
          <div className="mt-8 sm:mt-10 flex justify-center">
            <Link
              href="/dashboard"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-white/10 bg-[#0E1526] px-6 py-2.5 sm:px-8 sm:py-3 text-xs sm:text-sm font-extrabold text-zinc-200 hover:border-[#FF6D00]/60 hover:bg-[#151E30] hover:text-white transition-all shadow-md active:scale-95"
            >
              <span>View All 16:9 Video Types</span>
              <ArrowRight size={15} className="text-[#FF8F00]" />
            </Link>
          </div>

        </div>

      </div>
    </section>
  );
}
