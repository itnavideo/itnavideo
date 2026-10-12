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
  Wand2,
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
// ACCURATE UNIFIED VIDEO TYPES REGISTRY (All Active & Implemented Studios)
// ─────────────────────────────────────────────────────────────────────────────

export const ALL_VIDEO_TYPES: VideoTypeItem[] = [
  {
    id: 'faceless-video-169',
    name: 'Faceless Video — 16:9 Widescreen',
    href: '/dashboard/faceless-video',
    icon: Tv,
    iconBgClass: 'bg-purple-500/20 border border-purple-500/50',
    iconColorClass: 'text-purple-300',
    aspectRatio: '16:9',
    description: 'Primary Focus: YouTube Explainers, Book Summaries & Voiceover stories.',
    isPopular: true,
  },
  {
    id: 'faceless-video-916',
    name: 'Faceless Video — 9:16 Shorts',
    href: '/dashboard/faceless-video?ratio=9:16',
    icon: MonitorPlay,
    iconBgClass: 'bg-fuchsia-500/20 border border-fuchsia-500/40',
    iconColorClass: 'text-fuchsia-300',
    aspectRatio: '9:16',
    description: 'Short-form storytelling for TikTok, Instagram Reels & YouTube Shorts.',
    isPopular: true,
  },
  {
    id: 'auto-caption',
    name: 'Auto Caption Generator',
    href: '/auto-caption-generator',
    icon: Captions,
    iconBgClass: 'bg-purple-500/15 border border-purple-500/30',
    iconColorClass: 'text-purple-400',
    aspectRatio: '9:16',
    description: 'Kinetic word-synced subtitles for Reels, Shorts, TikTok & YouTube.',
  },
  {
    id: 'compare-explainer',
    name: 'Compare Explainer',
    href: '/video-types/compare-explainer',
    icon: Columns,
    iconBgClass: 'bg-purple-500/15 border border-purple-500/30',
    iconColorClass: 'text-purple-400',
    aspectRatio: '9:16',
    description: 'Side-by-side comparison videos with narration & custom visuals.',
  },
  {
    id: 'whiteboard-video',
    name: 'Whiteboard Video',
    href: '/video-types/whiteboard-video',
    icon: PenTool,
    iconBgClass: 'bg-pink-500/15 border border-pink-500/30',
    iconColorClass: 'text-pink-400',
    aspectRatio: '9:16',
    description: 'Transform spoken narration into hand-drawn whiteboard scenes.',
  },
  {
    id: 'typography-video',
    name: 'Kinetic Typography',
    href: '/video-types/typography-video',
    icon: FileText,
    iconBgClass: 'bg-fuchsia-500/15 border border-fuchsia-500/30',
    iconColorClass: 'text-fuchsia-400',
    aspectRatio: '9:16',
    description: 'Kinetic speech-to-text animated motion typography.',
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
  {
    id: 'youtube-subtitle-generator',
    name: 'YouTube Subtitle Generator',
    href: '/youtube-subtitle-generator',
    icon: Captions,
    iconBgClass: 'bg-pink-500/15 border border-pink-500/30',
    iconColorClass: 'text-pink-400',
    aspectRatio: '16:9',
    description: 'Burn clean Western-style subtitle strips into widescreen podcasts.',
  },
  {
    id: 'long-video-promo',
    name: 'Long Video Promo',
    href: '/video-types/long-video-promo',
    icon: Tv,
    iconBgClass: 'bg-fuchsia-500/15 border border-fuchsia-500/30',
    iconColorClass: 'text-fuchsia-400',
    aspectRatio: '9:16',
    description: 'Promote widescreen videos with thumbnail, handle & CTA layout.',
  },
  {
    id: 'book-summary',
    name: 'Book Summary Video',
    href: '/dashboard/book-summary',
    icon: BookOpen,
    iconBgClass: 'bg-purple-500/15 border border-purple-500/30',
    iconColorClass: 'text-purple-400',
    aspectRatio: '9:16',
    description: 'Turn book narration into cinematic lesson card video explainers.',
  },
  {
    id: 'audio-cleaner',
    name: 'AI Audio Cleaner',
    href: '/tools/ai-audio-cleaner',
    icon: Mic,
    iconBgClass: 'bg-pink-500/15 border border-pink-500/30',
    iconColorClass: 'text-pink-400',
    aspectRatio: '9:16',
    description: 'Detect retakes, remove background noise, and export studio audio.',
  },
];

export default function TenStudiosHubArchitecture() {
  return (
    <section id="video-types" className="relative w-full overflow-hidden bg-[#070B14] py-16 text-zinc-100 sm:py-24 border-b border-white/10">
      {/* Background Ambient Glows */}
      <div className="pointer-events-none absolute left-1/2 top-1/3 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-purple-600/10 blur-[160px] rounded-full" />
      <div className="pointer-events-none absolute right-0 bottom-10 w-96 h-96 bg-pink-600/10 blur-[140px] rounded-full" />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full">
        
        {/* Top Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
          <div className="inline-flex items-center gap-2 rounded-full border border-purple-500/30 bg-purple-500/10 px-4 py-1.5 text-xs font-bold text-purple-300 backdrop-blur-md">
            <Sparkles size={14} className="text-purple-400 animate-pulse" />
            <span>ALL-IN-ONE VIDEO CREATION PLATFORM</span>
          </div>
          
          <h2 className="text-3xl font-black tracking-tight text-white sm:text-5xl font-sans">
            AI Video Studios{' '}
            <span className="bg-gradient-to-r from-purple-400 via-fuchsia-400 to-pink-400 bg-clip-text text-transparent">
              &amp; Workflows
            </span>
          </h2>

          <p className="text-sm sm:text-base text-zinc-400 font-normal leading-relaxed">
            Every studio natively supports both <strong className="text-white font-bold">16:9 Widescreen</strong> and <strong className="text-white font-bold">9:16 Vertical Shorts/Reels</strong>. Select any studio below to start creating 1080p Full HD video instantly.
          </p>
        </div>

        {/* Unified 11 Video Studios Grid — 4 Columns Desktop | 2 Columns Compact Mobile */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {ALL_VIDEO_TYPES.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.id}
                href={item.href}
                className="group relative flex flex-col justify-between rounded-2xl border border-white/10 bg-[#0E1526] p-4 sm:p-5 hover:border-purple-500/50 hover:bg-[#151E30] transition-all duration-300 active:scale-[0.98] shadow-lg hover:shadow-2xl hover:shadow-purple-500/15"
              >
                <div>
                  {/* Top Bar: Icon + Popular Badge */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${item.iconBgClass} ${item.iconColorClass} group-hover:scale-105 transition-transform`}>
                      <Icon size={20} />
                    </div>

                    <div className="flex items-center gap-1.5">
                      <span className="rounded-full border border-purple-500/30 bg-purple-500/10 px-2.5 py-0.5 text-[10px] font-black text-purple-300">
                        16:9 &amp; 9:16
                      </span>
                      {item.isPopular && (
                        <span className="rounded-full bg-gradient-to-r from-purple-600 to-pink-500 px-2.5 py-0.5 text-[9px] font-black text-white uppercase tracking-wider">
                          Popular
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Title */}
                  <h3 className="text-base font-extrabold text-white tracking-tight group-hover:text-purple-300 transition-colors">
                    {item.name}
                  </h3>

                  {/* Description */}
                  <p className="mt-1.5 text-xs text-zinc-400 leading-relaxed min-h-[32px]">
                    {item.description}
                  </p>
                </div>

                {/* Footer Link CTA */}
                <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-xs font-bold text-purple-400 group-hover:text-pink-400 transition-colors">
                  <span>Open Studio</span>
                  <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            );
          })}
        </div>

        {/* View All Studios Dashboard Button CTA */}
        <div className="mt-10 flex justify-center">
          <Link
            href="/dashboard"
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-purple-600 via-fuchsia-500 to-pink-500 px-8 py-3.5 text-sm font-black text-white shadow-lg shadow-purple-500/25 transition-all hover:brightness-110 active:scale-95"
          >
            <span>Open All Studios in Studio Dashboard</span>
            <ArrowRight size={16} />
          </Link>
        </div>

      </div>
    </section>
  );
}
