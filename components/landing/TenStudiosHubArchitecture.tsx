'use client';

import React, { useState } from 'react';
import { getOptimizedCloudinaryUrl } from '@/lib/utils';
import Link from 'next/link';
import {
  Captions,
  Film,
  Mic,
  FileText,
  BookOpen,
  ChevronRight,
  ArrowRight,
  Columns,
  Tv,
  Scissors,
  Sparkles,
  PenTool,
  UserX,
  Smartphone,
  Layers,
  Wand2,
  CheckCircle2,
} from 'lucide-react';

import { STUDIO_COUNTS } from '@/constants/studios';

export interface VideoTypeItem {
  id: string;
  name: string;
  href: string;
  publicHref: string;
  icon: React.ElementType;
  iconBgClass: string;
  iconColorClass: string;
  aspectRatio: '9:16' | '16:9' | 'Audio';
  description?: string;
  isPopular?: boolean;
  imagePreview?: string;
  badgeLabel?: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// ACCURATE UNIFIED VIDEO TYPES REGISTRY (11 Active Studios + 1 Audio Utility)
// ─────────────────────────────────────────────────────────────────────────────

export const WIDESCREEN_169_STUDIOS: VideoTypeItem[] = [
  {
    id: 'ai-video-generator',
    name: 'AI Video Generator',
    href: '/dashboard/ai-video-generator',
    publicHref: '/ai-video-generator',
    icon: Sparkles,
    iconBgClass: 'bg-orange-500/15 border border-orange-500/30',
    iconColorClass: 'text-orange-500',
    aspectRatio: '16:9',
    description: 'Prompt-to-production studio: AI Creative Director, multitrack timeline editor & 1080p cloud render.',
    badgeLabel: 'Coming Soon',
    imagePreview: 'https://res.cloudinary.com/dhouh9idx/image/upload/v1794147192/AI_Video_Generator_Marketing_Banner_yf2djz.png',
  },
  {
    id: 'ai-video-polisher',
    name: 'AI YouTube Video Polisher',
    href: '/dashboard/ai-video-polisher',
    publicHref: '/dashboard/ai-video-polisher',
    icon: Sparkles,
    iconBgClass: 'bg-orange-500/15 border border-orange-500/30',
    iconColorClass: 'text-orange-500',
    aspectRatio: '16:9',
    description: 'Auto silence jump-cuts, dynamic camera zoom punch-ins (+12%) & PIP overlay layers.',
    badgeLabel: 'Auto Editor',
    imagePreview: 'https://res.cloudinary.com/dhouh9idx/image/upload/v1793737269/Movies_Money_and_Big_Growth_ucpt53.png',
  },
  {
    id: 'faceless-video',
    name: 'Faceless Video',
    href: '/dashboard/faceless-video',
    publicHref: '/faceless-video',
    icon: Tv,
    iconBgClass: 'bg-orange-500/15 border border-orange-500/30',
    iconColorClass: 'text-orange-500',
    aspectRatio: '16:9',
    description: 'Turn voiceovers & audio recordings into 16:9 YouTube explainers with AI B-roll & visuals.',
    isPopular: true,
    badgeLabel: 'YouTube Cinema',
    imagePreview: 'https://res.cloudinary.com/dhouh9idx/image/upload/v1792945592/file_000000004290821180a71f25ad75480e_nztpwe.png',
  },
  {
    id: 'book-summary',
    name: 'Book Summary Video',
    href: '/dashboard/book-summary',
    publicHref: '/video-types/book-summary',
    icon: BookOpen,
    iconBgClass: 'bg-amber-500/15 border border-amber-500/30',
    iconColorClass: 'text-amber-500',
    aspectRatio: '16:9',
    description: 'Turn book narration into cinematic lesson card video explainers.',
    badgeLabel: 'Summary Cards',
    imagePreview: 'https://res.cloudinary.com/dhouh9idx/image/upload/v1792946358/book_summary_video_zbs4em.png',
  },
  {
    id: 'image-to-video-ai',
    name: 'Image to Video AI',
    href: '/dashboard/image-to-video-ai',
    publicHref: '/tools/image-to-video-ai',
    icon: Film,
    iconBgClass: 'bg-orange-500/15 border border-orange-500/30',
    iconColorClass: 'text-orange-500',
    aspectRatio: '16:9',
    description: 'Transform images & audio into 16:9 cinematic videos with Ken Burns camera motion.',
    isPopular: true,
    badgeLabel: '3D Parallax',
    imagePreview: 'https://res.cloudinary.com/dhouh9idx/image/upload/v1792946349/imagetovideoai_w3hyci.jpg',
  },
  {
    id: 'youtube-subtitle-generator',
    name: 'YouTube Subtitle Generator',
    href: '/dashboard/youtube-subtitles',
    publicHref: '/video-types/youtube-subtitle-generator',
    icon: Captions,
    iconBgClass: 'bg-sky-500/15 border border-sky-500/30',
    iconColorClass: 'text-sky-400',
    aspectRatio: '16:9',
    description: 'Burn clean Western-style subtitle strips into widescreen podcasts.',
    badgeLabel: 'Burned Strips',
    imagePreview: 'https://res.cloudinary.com/dhouh9idx/image/upload/v1792946360/youtube_subtitles_generator_who62l.png',
  },
];

export const VERTICAL_916_STUDIOS: VideoTypeItem[] = [
  {
    id: 'ai-shorts-polisher',
    name: 'AI Shorts Polisher',
    href: '/dashboard/ai-shorts-polisher',
    publicHref: '/dashboard/ai-shorts-polisher',
    icon: Smartphone,
    iconBgClass: 'bg-orange-500/15 border border-orange-500/30',
    iconColorClass: 'text-orange-500',
    aspectRatio: '9:16',
    description: 'Auto silence jump-cuts, dynamic camera zoom punch-ins (+12%) & PIP overlay layers.',
    badgeLabel: 'Reels Co-Pilot',
    imagePreview: 'https://res.cloudinary.com/dhouh9idx/image/upload/v1793737273/Enthusiastic_Creator_Explaining_Ideas_nvg1do.png',
  },
  {
    id: 'faceless-shorts',
    name: 'Faceless Shorts',
    href: '/dashboard/faceless-shorts',
    publicHref: '/faceless-shorts',
    icon: UserX,
    iconBgClass: 'bg-purple-500/15 border border-purple-500/30',
    iconColorClass: 'text-purple-400',
    aspectRatio: '9:16',
    description: 'Turn voiceovers & scripts into high-retention 9:16 vertical shorts with AI B-roll visuals.',
    isPopular: true,
    badgeLabel: 'AI Faceless Shorts',
    imagePreview: 'https://res.cloudinary.com/dhouh9idx/image/upload/v1792945593/file_00000000806482119547c1b937b7e386_zsrmkb.png',
  },
  {
    id: 'auto-caption',
    name: 'Auto Caption Generator',
    href: '/dashboard/auto-caption',
    publicHref: '/auto-caption-generator',
    icon: Captions,
    iconBgClass: 'bg-orange-500/15 border border-orange-500/30',
    iconColorClass: 'text-orange-500',
    aspectRatio: '9:16',
    description: 'Kinetic word-synced subtitles for Reels, Shorts, TikTok & YouTube.',
    isPopular: true,
    badgeLabel: 'Kinetic Words',
    imagePreview: 'https://res.cloudinary.com/dhouh9idx/image/upload/v1792945595/file_00000000df688211bc2231047185512d_ifk1xc.png',
  },
  {
    id: 'whiteboard-video',
    name: 'Whiteboard Animation',
    href: '/dashboard/whiteboard-video',
    publicHref: '/video-types/whiteboard-video',
    icon: PenTool,
    iconBgClass: 'bg-emerald-500/15 border border-emerald-500/30',
    iconColorClass: 'text-emerald-400',
    aspectRatio: '9:16',
    description: 'Transform spoken narration into hand-drawn whiteboard stickman scenes.',
    badgeLabel: 'Stickman Explainer',
    imagePreview: 'https://res.cloudinary.com/dhouh9idx/image/upload/v1792950977/file_00000000a8388211b1207dad39960dc7_ahvk9g.png',
  },
  {
    id: 'compare-explainer',
    name: 'Compare Explainer',
    href: '/dashboard/compare-explainer',
    publicHref: '/video-types/compare-explainer',
    icon: Columns,
    iconBgClass: 'bg-sky-500/15 border border-sky-500/30',
    iconColorClass: 'text-sky-400',
    aspectRatio: '9:16',
    description: 'Side-by-side comparison videos with narration & custom dual visuals.',
    badgeLabel: 'VS Breakdown',
    imagePreview: 'https://res.cloudinary.com/dhouh9idx/image/upload/v1792946197/file_0000000035a48208ab4068beb2a66a7d_kctvo9.png',
  },
  {
    id: 'long-video-clips',
    name: 'Long Video to Clips',
    href: '/dashboard/long-video-clips',
    publicHref: '/video-types/long-video-clips',
    icon: Scissors,
    iconBgClass: 'bg-orange-500/15 border border-orange-500/30',
    iconColorClass: 'text-orange-500',
    aspectRatio: '9:16',
    description: 'Detect viral high-retention moments from long videos into shorts (1 Credit / Clip).',
    isPopular: true,
    badgeLabel: 'AI Hook Cutter',
    imagePreview: 'https://res.cloudinary.com/dhouh9idx/image/upload/v1792946357/viral_video_clips_rllgec.png',
  },
  {
    id: 'long-video-promo',
    name: 'Long Video Promo',
    href: '/dashboard/long-video-promo',
    publicHref: '/video-types/long-video-promo',
    icon: Tv,
    iconBgClass: 'bg-rose-500/15 border border-rose-500/30',
    iconColorClass: 'text-rose-400',
    aspectRatio: '9:16',
    description: 'Promote widescreen videos with thumbnail, handle & CTA layout.',
    badgeLabel: 'YouTube Teaser',
    imagePreview: 'https://res.cloudinary.com/dhouh9idx/image/upload/v1792946358/longvideopromo_o0qheb.png',
  },
  {
    id: 'split-screen-explainer',
    name: 'Split Screen Explainer',
    href: '/dashboard/split-screen-explainer',
    publicHref: '/video-types/compare-explainer',
    icon: Layers,
    iconBgClass: 'bg-teal-500/15 border border-teal-500/30',
    iconColorClass: 'text-teal-400',
    aspectRatio: '9:16',
    description: 'Creator facecam at bottom with kinetic explainer graphics & chapter tracker at top.',
    badgeLabel: 'Creator Split',
    imagePreview: 'https://res.cloudinary.com/dhouh9idx/image/upload/v1792945581/file_0000000039948211a5955d513e5d104a_wzrget.png',
  },
];

export const UTILITY_STUDIOS: VideoTypeItem[] = [
  {
    id: 'audio-cleaner',
    name: 'AI Audio Cleaner',
    href: '/dashboard/audio-cleaner',
    publicHref: '/tools/ai-audio-cleaner',
    icon: Mic,
    iconBgClass: 'bg-emerald-500/15 border border-emerald-500/30',
    iconColorClass: 'text-emerald-400',
    aspectRatio: 'Audio',
    description: 'Detect retakes, remove background room noise, and export studio master audio.',
    badgeLabel: 'Studio Master',
    imagePreview: 'https://res.cloudinary.com/dhouh9idx/image/upload/v1792946356/audio_cleaner_pipcxj.png',
  },
];

type StudioTab = '916' | '169' | 'utility' | 'all';

interface TabDefinition {
  id: StudioTab;
  title: string;
  mobileLabel: string;
  mobileSub: string;
  mobileBadge: string;
  count: number;
  icon: React.ElementType;
  color: string;
  activeBg: string;
  activeBorder: string;
  activeGlow: string;
  accentText: string;
  iconBg: string;
}

const TAB_CONFIGS: TabDefinition[] = [
  {
    id: '916',
    title: '9:16 Shorts & Reels',
    mobileLabel: '9:16 Shorts',
    mobileSub: 'TikTok & Reels',
    mobileBadge: `${VERTICAL_916_STUDIOS.length} Studios`,
    count: VERTICAL_916_STUDIOS.length,
    icon: Smartphone,
    color: '#EA580C',
    activeBg: 'from-orange-600 to-amber-500',
    activeBorder: 'border-orange-500/90',
    activeGlow: 'rgba(249, 115, 22, 0.45)',
    accentText: 'text-white',
    iconBg: 'bg-white/20 border-white/30 text-white',
  },
  {
    id: '169',
    title: '16:9 YouTube Cinema',
    mobileLabel: '16:9 Cinema',
    mobileSub: 'YouTube & Long-form',
    mobileBadge: `${WIDESCREEN_169_STUDIOS.length} Studios`,
    count: WIDESCREEN_169_STUDIOS.length,
    icon: Tv,
    color: '#EA580C',
    activeBg: 'from-orange-600 to-amber-500',
    activeBorder: 'border-orange-500/90',
    activeGlow: 'rgba(249, 115, 22, 0.45)',
    accentText: 'text-white',
    iconBg: 'bg-white/20 border-white/30 text-white',
  },
  {
    id: 'utility',
    title: 'Studio Audio Cleaner',
    mobileLabel: 'Audio Tool',
    mobileSub: 'Retakes & Studio Mic',
    mobileBadge: `${UTILITY_STUDIOS.length} Studio`,
    count: UTILITY_STUDIOS.length,
    icon: Mic,
    color: '#EA580C',
    activeBg: 'from-orange-600 to-amber-500',
    activeBorder: 'border-orange-500/90',
    activeGlow: 'rgba(249, 115, 22, 0.45)',
    accentText: 'text-white',
    iconBg: 'bg-white/20 border-white/30 text-white',
  },
  {
    id: 'all',
    title: 'All Studios',
    mobileLabel: 'All Studios',
    mobileSub: 'Complete Video Suite',
    mobileBadge: `${VERTICAL_916_STUDIOS.length + WIDESCREEN_169_STUDIOS.length + UTILITY_STUDIOS.length} Total`,
    count: VERTICAL_916_STUDIOS.length + WIDESCREEN_169_STUDIOS.length + UTILITY_STUDIOS.length,
    icon: Sparkles,
    color: '#EA580C',
    activeBg: 'from-orange-600 to-amber-500',
    activeBorder: 'border-orange-500/90',
    activeGlow: 'rgba(249, 115, 22, 0.45)',
    accentText: 'text-white',
    iconBg: 'bg-white/20 border-white/30 text-white',
  },
];

export default function TenStudiosHubArchitecture() {
  const [activeTab, setActiveTab] = useState<StudioTab>('916');

  const show169 = activeTab === 'all' || activeTab === '169';
  const show916 = activeTab === 'all' || activeTab === '916';
  const showUtility = activeTab === 'all' || activeTab === 'utility';

  return (
    <section
      id="video-types"
      className="relative w-full overflow-hidden bg-white py-14 text-zinc-950 sm:py-24 border-y border-zinc-200/80"
    >
      <div className="relative z-10 mx-auto max-w-7xl px-3 sm:px-6 lg:px-8 w-full space-y-8 sm:space-y-10">
        
        {/* Top Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3 px-1 sm:px-2">
          <h2 className="text-3xl font-black tracking-tight text-zinc-950 sm:text-5xl font-sans">
            AI Video Studios{' '}
            <span className="bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 bg-clip-text text-transparent">
              &amp; Workflows
            </span>
          </h2>

          <p className="text-xs sm:text-sm md:text-base text-zinc-600 font-normal leading-relaxed max-w-2xl mx-auto px-2">
            Pick your format below. Each studio is purpose-built with dedicated AI planners, cloud rendering, and word-synced motion presets.
          </p>

          {/* ───────────────────────────────────────────────────────────── */}
          {/* HIGH-END UNIFIED FORMAT CAPSULE BAR (Mobile & Desktop)         */}
          {/* ───────────────────────────────────────────────────────────── */}
          <div className="pt-3 sm:pt-6 flex justify-center w-full px-1" suppressHydrationWarning>
            <div className="inline-flex items-center gap-1 sm:gap-2 p-1.5 rounded-full bg-zinc-100 border border-zinc-200/90 shadow-xs max-w-full overflow-x-auto no-scrollbar">
              {TAB_CONFIGS.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;

                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTab(tab.id)}
                    className={`group relative flex items-center gap-1.5 sm:gap-2.5 rounded-full px-3.5 sm:px-5 py-2 sm:py-2.5 text-xs font-bold transition-all duration-200 cursor-pointer border whitespace-nowrap shrink-0 ${
                      isActive
                        ? 'border-zinc-950 bg-zinc-950 text-white shadow-md shadow-zinc-950/20'
                        : 'border-transparent text-zinc-600 hover:text-zinc-950 hover:bg-zinc-200/60'
                    }`}
                  >
                    <div
                      className={`flex h-6 w-6 items-center justify-center rounded-lg transition-transform duration-200 group-hover:scale-105 ${
                        isActive
                          ? 'bg-white/20 text-white'
                          : 'bg-zinc-200/70 text-zinc-600 group-hover:text-zinc-950'
                      }`}
                    >
                      <Icon size={14} className={isActive ? 'text-white' : 'text-zinc-600'} />
                    </div>

                    <span className="font-extrabold tracking-tight hidden sm:inline">
                      {tab.title}
                    </span>
                    <span className="font-extrabold tracking-tight sm:hidden text-[11px]">
                      {tab.mobileLabel}
                    </span>

                    <span
                      className={`flex h-5 min-w-[20px] items-center justify-center rounded-full px-1.5 text-[10px] font-mono font-black ${
                        isActive
                          ? 'bg-white text-zinc-950 shadow-xs'
                          : 'bg-zinc-200 text-zinc-700'
                      }`}
                    >
                      {tab.count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* ───────────────────────────────────────────────────────────── */}
        {/* 1. 9:16 VERTICAL SHORTS & REELS STUDIOS                       */}
        {/* ───────────────────────────────────────────────────────────── */}
        {show916 && (
          <div className="rounded-3xl sm:rounded-[32px] border border-zinc-200/80 bg-zinc-50/60 p-4 sm:p-6 md:p-8 shadow-xs transition-all duration-300">
            {/* Stage Header Banner */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-5 sm:pb-6 border-b border-zinc-200">
              <div>
                <div className="inline-flex items-center gap-1.5 rounded-full bg-zinc-200/70 border border-zinc-300/80 px-3 py-1 text-[11px] font-mono font-bold text-zinc-900 uppercase tracking-wider mb-2">
                  <Smartphone size={12} />
                  <span>9:16 Vertical Smartphone Format</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-black text-zinc-950 tracking-tight">
                  9:16 Shorts, Reels &amp; TikTok Studios
                </h3>
                <p className="text-xs sm:text-sm text-zinc-600 mt-0.5">
                  High-retention mobile vertical video up to 90 seconds. Word-synced kinetic captions, AI hooks, whiteboard, and clips.
                </p>
              </div>

              {/* Format Metadata Pills */}
              <div className="flex flex-wrap items-center gap-2 text-xs font-mono font-bold shrink-0">
                <Link
                  href="/video-types"
                  className="inline-flex items-center gap-1 text-[11px] font-sans font-bold text-zinc-700 hover:text-zinc-950 transition-colors mr-1"
                >
                  <BookOpen size={13} />
                  <span>View Dedicated Guides</span>
                  <ChevronRight size={13} />
                </Link>
                <span className="text-emerald-700 px-2.5 py-1 rounded-md bg-emerald-50 border border-emerald-200">
                  1 Credit / Video (1 Cr / Clip)
                </span>
                <span className="text-zinc-400 hidden sm:inline">•</span>
                <span className="text-zinc-700 px-2.5 py-1 rounded-md bg-white border border-zinc-200 shadow-2xs">
                  1080×1920 Full HD
                </span>
              </div>
            </div>

            {/* 
              Balanced Responsive Grid:
              - Mobile: 2 columns (clean smartphone feed ratio)
              - Tablet: 3 columns
              - Desktop: 4 columns
            */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-5 pt-5 sm:pt-6">
              {VERTICAL_916_STUDIOS.map((item) => {
                const Icon = item.icon;
                return (
                  <div
                    key={item.id}
                    className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-zinc-200/90 bg-white hover:border-orange-500/50 hover:shadow-[0_16px_36px_-10px_rgba(249,115,22,0.16)] transition-all duration-300 hover:-translate-y-1.5 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)]"
                  >
                    <div>
                      {/* Top 9:16 Vertical Image Preview Stage */}
                      {item.imagePreview && (
                        <Link
                          href={item.href}
                          className="block relative aspect-[9/16] w-full overflow-hidden bg-zinc-100 border-b border-zinc-100 group/media"
                          title={`Open ${item.name} Studio`}
                        >
                          {/* Full Uncropped Foreground Image */}
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={getOptimizedCloudinaryUrl(item.imagePreview, 540)}
                            alt={item.name}
                            className="relative z-10 h-full w-full object-contain object-center transition-transform duration-500 group-hover:scale-105"
                            loading="lazy"
                            decoding="async"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src =
                                getOptimizedCloudinaryUrl('https://res.cloudinary.com/dhouh9idx/image/upload/v1792945595/file_00000000df688211bc2231047185512d_ifk1xc.png', 540);
                            }}
                          />

                          {/* Top Badges */}
                          <div className="absolute top-2 right-2 sm:top-2.5 sm:right-2.5 z-20 flex items-center gap-1.5">
                            {item.isPopular && (
                              <span className="rounded-full bg-gradient-to-r from-orange-600 to-amber-500 px-2.5 py-0.5 text-[8px] font-black text-white uppercase tracking-wider shadow-sm">
                                Popular
                              </span>
                            )}
                          </div>

                          {/* Floating 9:16 Format Tag Bottom Left */}
                          <div className="absolute bottom-2 left-2 sm:bottom-2.5 sm:left-2.5 z-20 flex items-center gap-1.5">
                            <span className="px-2 py-0.5 rounded-full bg-zinc-950/80 text-[9px] font-mono font-bold text-white border border-white/10 backdrop-blur-md">
                              9:16
                            </span>
                            {item.badgeLabel && (
                              <span className="hidden sm:inline px-1.5 py-0.5 rounded-full bg-zinc-800/80 text-[8px] font-bold text-zinc-200 border border-white/10 backdrop-blur-md">
                                {item.badgeLabel}
                              </span>
                            )}
                          </div>
                        </Link>
                      )}

                      {/* Card Content Body */}
                      <div className="p-3 sm:p-4">
                        <Link href={item.href} className="block group/title mb-1.5" title={`Open ${item.name} Studio`}>
                          <div className="flex items-center gap-2">
                            <div className={`flex h-6 w-6 items-center justify-center rounded-md ${item.iconBgClass} ${item.iconColorClass} shrink-0`}>
                              <Icon size={13} />
                            </div>
                            <h4 className="text-xs sm:text-sm font-extrabold text-zinc-950 tracking-tight group-hover/title:text-zinc-700 transition-colors line-clamp-1">
                              {item.name}
                            </h4>
                          </div>
                        </Link>

                        <p className="text-[11px] sm:text-xs text-zinc-600 leading-relaxed line-clamp-2 min-h-[30px] sm:min-h-[32px]">
                          {item.description}
                        </p>
                      </div>
                    </div>

                    {/* Dual Action Links Footer */}
                    <div className="px-2 pb-2.5 sm:px-3 sm:pb-3.5 pt-2.5 border-t border-zinc-100 grid grid-cols-2 gap-1.5">
                      <Link
                        href={item.publicHref}
                        title={`See what ${item.name} does`}
                        className="inline-flex items-center justify-center gap-1 rounded-lg border border-zinc-200 bg-zinc-50 px-1.5 py-1.5 text-[10px] sm:text-[11px] font-semibold text-zinc-700 hover:bg-zinc-100 hover:text-zinc-950 transition-all text-center"
                      >
                        <BookOpen size={11} className="text-zinc-500 shrink-0" />
                        <span className="truncate">What It Does</span>
                      </Link>
                      <Link
                        href={item.href}
                        title={`Create video with ${item.name}`}
                        className="inline-flex items-center justify-center gap-1 rounded-lg bg-zinc-950 hover:bg-zinc-800 px-1.5 py-1.5 text-[10px] sm:text-[11px] font-bold text-white shadow-xs transition-all active:scale-95 text-center"
                      >
                        <span className="truncate">{item.badgeLabel === 'Coming Soon' ? 'Coming Soon' : 'Create Video'}</span>
                        <ArrowRight size={11} className="shrink-0" />
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ───────────────────────────────────────────────────────────── */}
        {/* 2. 16:9 WIDESCREEN CINEMA & LONG-FORM STUDIOS                */}
        {/* ───────────────────────────────────────────────────────────── */}
        {show169 && (
          <div className="rounded-3xl sm:rounded-[32px] border border-zinc-200/80 bg-zinc-50/60 p-4 sm:p-6 md:p-8 shadow-xs transition-all duration-300">
            {/* Stage Header Banner */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-5 sm:pb-6 border-b border-zinc-200">
              <div>
                <div className="inline-flex items-center gap-1.5 rounded-full bg-zinc-200/70 border border-zinc-300/80 px-3 py-1 text-[11px] font-mono font-bold text-zinc-900 uppercase tracking-wider mb-2">
                  <Tv size={12} />
                  <span>16:9 Widescreen Cinema Format</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-black text-zinc-950 tracking-tight">
                  16:9 Long-Form &amp; Cinema Studios
                </h3>
                <p className="text-xs sm:text-sm text-zinc-600 mt-0.5">
                  Full 16:9 widescreen format for YouTube, presentations, summaries, and podcasts up to 5 minutes.
                </p>
              </div>

              {/* Format Metadata Pills */}
              <div className="flex flex-wrap items-center gap-2 text-xs font-mono font-bold shrink-0">
                <Link
                  href="/video-types"
                  className="inline-flex items-center gap-1 text-[11px] font-sans font-bold text-zinc-700 hover:text-zinc-950 transition-colors mr-1"
                >
                  <BookOpen size={13} />
                  <span>View Dedicated Guides</span>
                  <ChevronRight size={13} />
                </Link>
                <span className="text-zinc-950 px-2.5 py-1 rounded-md bg-zinc-200/80 border border-zinc-300/80">
                  1 Min = 1 Cr (Max 5m)
                </span>
                <span className="text-zinc-400 hidden sm:inline">•</span>
                <span className="text-zinc-700 px-2.5 py-1 rounded-md bg-white border border-zinc-200 shadow-2xs">
                  1920×1080 Full HD
                </span>
              </div>
            </div>

            {/* Perfect 4-Column Grid on Desktop, 2 on Tablet, 1 on Mobile */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 pt-5 sm:pt-6">
              {WIDESCREEN_169_STUDIOS.map((item) => {
                const Icon = item.icon;
                return (
                  <div
                    key={item.id}
                    className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-zinc-200/90 bg-white hover:border-orange-500/50 hover:shadow-[0_16px_36px_-10px_rgba(249,115,22,0.16)] transition-all duration-300 hover:-translate-y-1.5 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)]"
                  >
                    <div>
                      {/* Top 16:9 Image Preview Stage */}
                      {item.imagePreview && (
                        <Link
                          href={item.href}
                          className="block relative aspect-[16/9] w-full overflow-hidden bg-zinc-100 border-b border-zinc-100 group/media"
                          title={`Open ${item.name} Cinema Studio`}
                        >
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={getOptimizedCloudinaryUrl(item.imagePreview, 640)}
                            alt={item.name}
                            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                            loading="lazy"
                            decoding="async"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src =
                                getOptimizedCloudinaryUrl('https://res.cloudinary.com/dhouh9idx/image/upload/v1792945592/file_000000004290821180a71f25ad75480e_nztpwe.png', 640);
                            }}
                          />

                          {/* Top Badges */}
                          <div className="absolute top-2.5 right-2.5 z-10 flex items-center gap-1.5">
                            {item.badgeLabel === 'Coming Soon' ? (
                              <span className="rounded-full bg-gradient-to-r from-amber-500 to-orange-500 px-2.5 py-0.5 text-[9px] font-black text-white uppercase tracking-wider shadow-sm flex items-center gap-1">
                                <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                                Coming Soon
                              </span>
                            ) : item.isPopular ? (
                              <span className="rounded-full bg-gradient-to-r from-orange-600 via-amber-600 to-orange-500 px-2.5 py-0.5 text-[8px] font-black text-white uppercase tracking-wider shadow-sm">
                                Popular
                              </span>
                            ) : null}
                          </div>

                          {/* Format Pill Bottom Left */}
                          <div className="absolute bottom-2.5 left-2.5 z-10 flex items-center gap-2">
                            <span className="px-2 py-0.5 rounded-full bg-zinc-950/80 text-[9px] font-mono font-bold text-white border border-white/10 backdrop-blur-md">
                              16:9
                            </span>
                            {item.badgeLabel && (
                              <span className="px-2 py-0.5 rounded-full bg-zinc-800/80 text-[9px] font-bold text-zinc-200 border border-white/10 backdrop-blur-md">
                                {item.badgeLabel}
                              </span>
                            )}
                          </div>
                        </Link>
                      )}

                      {/* Card Content Body */}
                      <div className="p-4 sm:p-5">
                        <Link href={item.href} className="block group/title mb-2" title={`Open ${item.name} Cinema Studio`}>
                          <div className="flex items-center gap-2">
                            <div className={`flex h-7 w-7 items-center justify-center rounded-lg ${item.iconBgClass} ${item.iconColorClass}`}>
                              <Icon size={14} />
                            </div>
                            <h4 className="text-sm sm:text-base font-extrabold text-zinc-950 tracking-tight group-hover/title:text-zinc-700 transition-colors line-clamp-1">
                              {item.name}
                            </h4>
                          </div>
                        </Link>

                        <p className="text-xs text-zinc-600 leading-relaxed line-clamp-2 min-h-[32px]">
                          {item.description}
                        </p>
                      </div>
                    </div>

                    {/* Dual Action Links Footer */}
                    <div className="px-3 pb-3.5 sm:px-4 sm:pb-4 pt-3 border-t border-zinc-100 grid grid-cols-2 gap-2">
                      <Link
                        href={item.publicHref}
                        title={`See what ${item.name} does`}
                        className="inline-flex items-center justify-center gap-1 rounded-lg border border-zinc-200 bg-zinc-50 px-2 py-2 text-[11px] font-semibold text-zinc-700 hover:bg-zinc-100 hover:text-zinc-950 transition-all text-center"
                      >
                        <BookOpen size={12} className="text-zinc-500 shrink-0" />
                        <span className="truncate">What It Does</span>
                      </Link>
                      <Link
                        href={item.href}
                        title={`Create video with ${item.name}`}
                        className="inline-flex items-center justify-center gap-1 rounded-lg bg-zinc-950 hover:bg-zinc-800 px-2 py-2 text-[11px] font-bold text-white shadow-xs transition-all active:scale-95 text-center"
                      >
                        <span className="truncate">{item.badgeLabel === 'Coming Soon' ? 'Coming Soon' : 'Create Video'}</span>
                        <ArrowRight size={12} className="shrink-0" />
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ───────────────────────────────────────────────────────────── */}
        {/* 3. STUDIO UTILITIES (AI AUDIO CLEANER)                       */}
        {/* ───────────────────────────────────────────────────────────── */}
        {showUtility && (
          <div className="rounded-3xl sm:rounded-[32px] border border-zinc-200/80 bg-zinc-50/60 p-4 sm:p-6 md:p-8 shadow-xs transition-all duration-300">
            {/* Stage Header Banner */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-5 sm:pb-6 border-b border-zinc-200">
              <div>
                <div className="inline-flex items-center gap-1.5 rounded-full bg-zinc-200/70 border border-zinc-300/80 px-3 py-1 text-[11px] font-mono font-bold text-zinc-900 uppercase tracking-wider mb-2">
                  <Mic size={12} />
                  <span>Studio Audio Utility</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-black text-zinc-950 tracking-tight">
                  AI Studio Audio Cleaner &amp; Mastering
                </h3>
                <p className="text-xs sm:text-sm text-zinc-600 mt-0.5">
                  Clean voiceovers, detect retakes, remove background room noise, and export studio master audio.
                </p>
              </div>

              {/* Format Metadata Pills */}
              <div className="flex flex-wrap items-center gap-2 text-xs font-mono font-bold shrink-0">
                <span className="text-emerald-700 px-2.5 py-1 rounded-md bg-emerald-50 border border-emerald-200">
                  1 Credit / File
                </span>
                <span className="text-zinc-400 hidden sm:inline">•</span>
                <span className="text-zinc-700 px-2.5 py-1 rounded-md bg-white border border-zinc-200 shadow-2xs">
                  Studio MP3/WAV
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-5 sm:pt-6">
              {UTILITY_STUDIOS.map((item) => {
                const Icon = item.icon;
                return (
                  <div
                    key={item.id}
                    className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-zinc-200/90 bg-white hover:border-zinc-400 hover:shadow-md transition-all duration-300 hover:-translate-y-1 shadow-xs"
                  >
                    <div>
                      {item.imagePreview && (
                        <Link
                          href={item.href}
                          className="block relative aspect-[16/9] w-full overflow-hidden bg-zinc-100 border-b border-zinc-100 group/media"
                          title={`Open ${item.name}`}
                        >
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={getOptimizedCloudinaryUrl(item.imagePreview, 640)}
                            alt={item.name}
                            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                            loading="lazy"
                            decoding="async"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src =
                                getOptimizedCloudinaryUrl('https://res.cloudinary.com/dhouh9idx/image/upload/v1792946356/audio_cleaner_pipcxj.png', 640);
                            }}
                          />
                          <div className="absolute bottom-3 left-3 z-10 flex items-center gap-2">
                            <span className="px-2.5 py-1 rounded-full bg-zinc-950/80 text-[10px] font-bold text-white border border-white/10 backdrop-blur-md shadow-md">
                              Master Audio
                            </span>
                          </div>
                        </Link>
                      )}

                      <div className="p-4 sm:p-5">
                        <Link href={item.href} className="block group/title mb-2" title={`Open ${item.name}`}>
                          <div className="flex items-center gap-2">
                            <div className={`flex h-7 w-7 items-center justify-center rounded-lg ${item.iconBgClass} ${item.iconColorClass}`}>
                              <Icon size={14} />
                            </div>
                            <h4 className="text-base font-extrabold text-zinc-950 tracking-tight group-hover/title:text-zinc-700 transition-colors line-clamp-1">
                              {item.name}
                            </h4>
                          </div>
                        </Link>
                        <p className="text-xs text-zinc-600 leading-relaxed line-clamp-2 min-h-[32px]">
                          {item.description}
                        </p>
                      </div>
                    </div>

                    {/* Dual Action Links Footer */}
                    <div className="px-3.5 pb-4 sm:px-4 sm:pb-4 pt-3 border-t border-zinc-100 grid grid-cols-2 gap-2">
                      <Link
                        href={item.publicHref}
                        title={`See what ${item.name} does`}
                        className="inline-flex items-center justify-center gap-1 rounded-lg border border-zinc-200 bg-zinc-50 px-2 py-2 text-[11px] font-semibold text-zinc-700 hover:bg-zinc-100 hover:text-zinc-950 transition-all text-center"
                      >
                        <BookOpen size={12} className="text-zinc-500 shrink-0" />
                        <span className="truncate">What It Does</span>
                      </Link>
                      <Link
                        href={item.href}
                        title={`Open ${item.name} Studio`}
                        className="inline-flex items-center justify-center gap-1 rounded-lg bg-zinc-950 hover:bg-zinc-800 px-2 py-2 text-[11px] font-bold text-white shadow-xs transition-all active:scale-95 text-center"
                      >
                        <span className="truncate">Clean Audio</span>
                        <ArrowRight size={12} className="shrink-0" />
                      </Link>
                    </div>
                  </div>
                );
              })}

              {/* Audio Cleaner Feature Highlights Card */}
              <div className="rounded-2xl border border-zinc-200/90 bg-white p-5 sm:p-6 flex flex-col justify-between shadow-xs">
                <div>
                  <h4 className="text-sm font-extrabold text-zinc-950 uppercase tracking-wider flex items-center gap-2">
                    <CheckCircle2 size={16} className="text-emerald-600" />
                    <span>Instant Studio Mastering Features</span>
                  </h4>
                  <ul className="mt-4 space-y-2.5 text-xs text-zinc-700 font-medium">
                    <li className="flex items-center gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-600" />
                      <span>Automatic retake and mistake removal via speech analysis</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-600" />
                      <span>De-reverb &amp; ambient room noise cancellation</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-600" />
                      <span>Broadcast loudness leveling (-14 LUFS standard)</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-600" />
                      <span>Export clean 48kHz WAV or 320kbps MP3</span>
                    </li>
                  </ul>
                </div>

                <Link
                  href="/dashboard/audio-cleaner"
                  className="mt-6 inline-flex items-center justify-center gap-2 rounded-xl bg-zinc-950 hover:bg-zinc-800 px-4 py-2.5 text-xs font-bold text-white shadow-xs transition-all"
                >
                  <span>Clean Your Audio Now</span>
                  <ArrowRight size={14} />
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* View All Studios Dashboard Button CTA */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4 pb-2">
          <Link
            href="/dashboard"
            className="inline-flex items-center justify-center gap-2.5 rounded-full bg-zinc-950 hover:bg-zinc-800 px-8 sm:px-9 py-3.5 sm:py-4 text-xs sm:text-sm font-bold text-white shadow-md active:scale-95 transition-all duration-200"
          >
            <Sparkles size={16} className="text-zinc-300" />
            <span>Launch Any Studio Now</span>
            <ArrowRight size={16} />
          </Link>

          <Link
            href="/video-types"
            className="inline-flex items-center justify-center gap-2 rounded-full border border-zinc-300 bg-white hover:bg-zinc-50 px-7 sm:px-8 py-3.5 sm:py-4 text-xs sm:text-sm font-bold text-zinc-800 hover:text-zinc-950 transition-all duration-200 shadow-xs active:scale-95"
          >
            <BookOpen size={15} className="text-zinc-700" />
            <span>Explore All 10 Dedicated Pages &amp; Specs</span>
            <ChevronRight size={15} className="text-zinc-400" />
          </Link>
        </div>

      </div>
    </section>
  );
}
