'use client';

import React from 'react';
import Link from 'next/link';
import {
  Captions,
  MonitorPlay,
  PenTool,
  Mic,
  FileText,
  BookOpen,
  ChevronRight,
  ArrowRight,
  Columns,
  Tv,
  Scissors,
  Sparkles,
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

export const ALL_VIDEO_TYPES: VideoTypeItem[] = [
  {
    id: 'faceless-video-169',
    name: 'Faceless Video — 16:9',
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
    name: 'Faceless Video — 9:16',
    href: '/dashboard/faceless-video?ratio=9:16',
    icon: MonitorPlay,
    iconBgClass: 'bg-purple-500/20 border border-purple-500/40',
    iconColorClass: 'text-purple-300',
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
    iconBgClass: 'bg-purple-500/15 border border-purple-500/30',
    iconColorClass: 'text-purple-400',
    aspectRatio: '9:16',
    description: 'Transform spoken narration into hand-drawn whiteboard scenes.',
  },
  {
    id: 'typography-video',
    name: 'Kinetic Typography',
    href: '/video-types/typography-video',
    icon: FileText,
    iconBgClass: 'bg-purple-500/15 border border-purple-500/30',
    iconColorClass: 'text-purple-400',
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
    iconBgClass: 'bg-purple-500/15 border border-purple-500/30',
    iconColorClass: 'text-purple-400',
    aspectRatio: '16:9',
    description: 'Burn clean Western-style subtitle strips into widescreen podcasts.',
  },
  {
    id: 'long-video-promo',
    name: 'Long Video Promo',
    href: '/video-types/long-video-promo',
    icon: Tv,
    iconBgClass: 'bg-purple-500/15 border border-purple-500/30',
    iconColorClass: 'text-purple-400',
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
    iconBgClass: 'bg-purple-500/15 border border-purple-500/30',
    iconColorClass: 'text-purple-400',
    aspectRatio: '9:16',
    description: 'Detect retakes, remove background noise, and export studio audio.',
  },
];

export default function TenStudiosHubArchitecture() {
  return (
    <section id="video-types" className="relative w-full overflow-hidden bg-[#070B14] py-14 text-zinc-100 sm:py-20 border-b border-white/10">
      {/* Background Ambient Glows */}
      <div className="pointer-events-none absolute left-1/2 top-1/3 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-purple-600/10 blur-[160px] rounded-full" />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full">
        
        {/* Top Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 space-y-3">
          <div className="inline-flex items-center gap-2 rounded-full border border-purple-500/30 bg-purple-500/10 px-4 py-1.5 text-xs font-bold text-purple-300 backdrop-blur-md">
            <Sparkles size={14} className="text-purple-400" />
            <span>ALL-IN-ONE VIDEO CREATION PLATFORM</span>
          </div>
          
          <h2 className="text-3xl font-black tracking-tight text-white sm:text-5xl font-sans">
            AI Video Studios{' '}
            <span className="text-purple-300">
              &amp; Workflows
            </span>
          </h2>

          <p className="text-xs sm:text-base text-zinc-400 font-normal leading-relaxed">
            Natively supports both <strong className="text-white font-bold">16:9 Widescreen</strong> and <strong className="text-white font-bold">9:16 Vertical Shorts</strong>. Click any studio to start creating in 1080p Full HD.
          </p>
        </div>

        {/* Studio Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {ALL_VIDEO_TYPES.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.id}
                href={item.href}
                className="group relative flex flex-col justify-between rounded-2xl border border-white/10 bg-[#0E1526] p-5 hover:border-purple-500/50 hover:bg-[#131C32] transition-all duration-200 active:scale-[0.98] shadow-md hover:shadow-xl hover:shadow-purple-500/10"
              >
                <div>
                  {/* Top Header: Icon + Arrow */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${item.iconBgClass} ${item.iconColorClass} group-hover:scale-105 transition-transform`}>
                      <Icon size={20} />
                    </div>

                    <div className="flex items-center gap-1.5">
                      {item.isPopular && (
                        <span className="rounded-full bg-purple-600 px-2.5 py-0.5 text-[9px] font-black text-white uppercase tracking-wider">
                          Popular
                        </span>
                      )}
                      <ChevronRight size={18} className="text-zinc-500 group-hover:text-purple-400 group-hover:translate-x-0.5 transition-all" />
                    </div>
                  </div>

                  {/* Title */}
                  <h3 className="text-base font-extrabold text-white tracking-tight group-hover:text-purple-300 transition-colors">
                    {item.name}
                  </h3>

                  {/* Description */}
                  <p className="mt-1.5 text-xs text-zinc-400 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Single Bottom CTA */}
        <div className="mt-8 flex justify-center">
          <Link
            href="/dashboard"
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-purple-600 hover:bg-purple-500 px-7 py-3.5 text-sm font-black text-white shadow-lg shadow-purple-600/20 transition active:scale-95 w-full sm:w-auto text-center"
          >
            <span>Explore All Studios in Dashboard</span>
            <ArrowRight size={16} />
          </Link>
        </div>

      </div>
    </section>
  );
}
