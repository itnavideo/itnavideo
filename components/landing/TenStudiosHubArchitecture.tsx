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
    id: 'ai-video-polisher',
    name: 'AI YouTube Video Polisher',
    href: '/dashboard/ai-video-polisher',
    publicHref: '/dashboard/ai-video-polisher',
    icon: Sparkles,
    iconBgClass: 'bg-blue-500/15 border border-blue-500/30',
    iconColorClass: 'text-blue-500',
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
    mobileBadge: '8 Studios',
    count: 8,
    icon: Smartphone,
    color: '#FF5722',
    activeBg: 'from-[#FF5722] to-[#E64A19]',
    activeBorder: 'border-orange-500/90',
    activeGlow: 'rgba(255, 87, 34, 0.45)',
    accentText: 'text-white',
    iconBg: 'bg-white/20 border-white/30 text-white',
  },
  {
    id: '169',
    title: '16:9 YouTube Cinema',
    mobileLabel: '16:9 Cinema',
    mobileSub: 'YouTube & Long-form',
    mobileBadge: '5 Studios',
    count: 5,
    icon: Tv,
    color: '#FF5722',
    activeBg: 'from-[#FF5722] to-[#E64A19]',
    activeBorder: 'border-orange-500/90',
    activeGlow: 'rgba(255, 87, 34, 0.45)',
    accentText: 'text-white',
    iconBg: 'bg-white/20 border-white/30 text-white',
  },
  {
    id: 'utility',
    title: 'Studio Audio Cleaner',
    mobileLabel: 'Audio Tool',
    mobileSub: 'Retakes & Studio Mic',
    mobileBadge: '1 Studio',
    count: 1,
    icon: Mic,
    color: '#FF5722',
    activeBg: 'from-[#FF5722] to-[#E64A19]',
    activeBorder: 'border-orange-500/90',
    activeGlow: 'rgba(255, 87, 34, 0.45)',
    accentText: 'text-white',
    iconBg: 'bg-white/20 border-white/30 text-white',
  },
  {
    id: 'all',
    title: 'All Studios',
    mobileLabel: 'All Studios',
    mobileSub: 'Complete Video Suite',
    mobileBadge: '14 Total',
    count: 14,
    icon: Sparkles,
    color: '#FF5722',
    activeBg: 'from-[#FF5722] to-[#E64A19]',
    activeBorder: 'border-orange-500/90',
    activeGlow: 'rgba(255, 87, 34, 0.45)',
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
      className="relative w-full overflow-hidden bg-[#0c0a09] py-14 text-white sm:py-24 border-y border-[#2a211c] shadow-[0_0_60px_rgba(0,0,0,0.6)]"
      style={{ backgroundColor: '#0c0a09', color: '#ffffff' }}
    >
      {/* Top and Bottom Cinema Transition Rims */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-0 left-0 right-0 h-12 bg-gradient-to-b from-black/50 to-transparent z-10"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-black/50 to-transparent z-10"
      />

      {/* Background Ambient Flame Orange & Sunset Amber Glows */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/4 h-[450px] w-[900px] -translate-x-1/2 -translate-y-1/2 opacity-35 blur-3xl"
        style={{ background: 'radial-gradient(ellipse, rgba(255,87,34,0.15) 0%, rgba(255,112,67,0.06) 40%, transparent 70%)' }}
      />

      <div className="relative z-10 mx-auto max-w-7xl px-3 sm:px-6 lg:px-8 w-full space-y-8 sm:space-y-10">
        
        {/* Top Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3 px-1 sm:px-2">
          <div className="inline-flex items-center gap-2 rounded-full border border-orange-500/40 bg-orange-500/15 px-3.5 py-1 text-[11px] sm:text-xs font-bold text-orange-400 shadow-xs">
            <Sparkles size={13} className="text-[#FF5722]" />
            <span className="tracking-wide">STUDIO SUITE • ALL-IN-ONE VIDEO PLATFORM</span>
          </div>
          
          <h2 className="text-2xl font-normal tracking-tight text-white sm:text-5xl font-serif" style={{ color: '#ffffff' }}>
            AI Video Studios{' '}
            <span className="italic bg-gradient-to-r from-[#FF5722] via-[#FF7043] to-[#FFA000] bg-clip-text text-transparent font-normal">
              &amp; Workflows
            </span>
          </h2>

          <p className="text-xs sm:text-sm md:text-base text-stone-300 font-normal leading-relaxed max-w-2xl mx-auto px-2">
            Pick your format below. Each studio is purpose-built with dedicated AI planners, cloud rendering, and word-synced motion presets.
          </p>

          {/* ───────────────────────────────────────────────────────────── */}
          {/* HIGH-END UNIFIED FORMAT CAPSULE BAR (Mobile & Desktop)         */}
          {/* ───────────────────────────────────────────────────────────── */}
          <div className="pt-3 sm:pt-6 flex justify-center w-full px-1" suppressHydrationWarning>
            <div className="inline-flex items-center gap-1 sm:gap-2 p-1.5 rounded-full bg-zinc-950/95 border border-white/10 backdrop-blur-2xl shadow-2xl max-w-full overflow-x-auto no-scrollbar">
              {TAB_CONFIGS.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;

                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTab(tab.id)}
                    className={`group relative flex items-center gap-1.5 sm:gap-2.5 rounded-full px-3.5 sm:px-5 py-2 sm:py-2.5 text-xs font-bold transition-all duration-300 cursor-pointer border whitespace-nowrap shrink-0 ${
                      isActive
                        ? 'border-orange-500/90 bg-gradient-to-r from-[#FF5722] to-[#E64A19] text-white shadow-lg shadow-[#FF5722]/35'
                        : 'border-transparent text-zinc-400 hover:text-white hover:bg-white/5'
                    }`}
                    style={
                      isActive
                        ? {
                            boxShadow: '0 8px 24px -4px rgba(255, 87, 34, 0.45), inset 0 1px 0 0 rgba(255, 255, 255, 0.3)',
                          }
                        : undefined
                    }
                  >
                    <div
                      className={`flex h-6 w-6 items-center justify-center rounded-lg transition-transform duration-300 group-hover:scale-110 ${
                        isActive
                          ? 'bg-white/20 text-white shadow-xs'
                          : 'bg-white/5 text-zinc-400 group-hover:text-white'
                      }`}
                    >
                      <Icon size={14} className={isActive ? 'text-white' : 'text-zinc-400'} />
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
                          : 'bg-white/10 text-zinc-400 group-hover:bg-white/20 group-hover:text-white'
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
          <div
            className="rounded-3xl sm:rounded-[32px] border border-stone-800/90 bg-[#120F0D] p-4 sm:p-6 md:p-8 shadow-2xl ring-1 ring-white/[0.04] transition-all duration-300"
            style={{
              backgroundColor: '#120F0D',
              boxShadow: 'inset 0 1px 0 0 rgba(255, 255, 255, 0.08), 0 20px 40px -15px rgba(0, 0, 0, 0.7)',
            }}
          >
            {/* Stage Header Banner */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-5 sm:pb-6 border-b border-stone-800/80">
              <div>
                <div className="inline-flex items-center gap-1.5 rounded-full bg-orange-500/15 border border-orange-500/30 px-3 py-1 text-[11px] font-mono font-bold text-orange-400 uppercase tracking-wider mb-2">
                  <Smartphone size={12} />
                  <span>9:16 Vertical Smartphone Format</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                  9:16 Shorts, Reels &amp; TikTok Studios
                </h3>
                <p className="text-xs sm:text-sm text-stone-400 mt-0.5">
                  High-retention mobile vertical video up to 90 seconds. Word-synced kinetic captions, AI hooks, whiteboard, and clips.
                </p>
              </div>

              {/* Format Metadata Pills */}
              <div className="flex flex-wrap items-center gap-2 text-xs font-mono font-bold shrink-0">
                <Link
                  href="/video-types"
                  className="inline-flex items-center gap-1 text-[11px] font-sans font-bold text-orange-400 hover:text-orange-300 transition-colors mr-1"
                >
                  <BookOpen size={13} />
                  <span>View Dedicated Guides</span>
                  <ChevronRight size={13} />
                </Link>
                <span className="text-emerald-400 px-2.5 py-1 rounded-md bg-emerald-500/15 border border-emerald-500/30">
                  1 Credit / Video (1 Cr / Clip)
                </span>
                <span className="text-stone-600 hidden sm:inline">•</span>
                <span className="text-stone-300 px-2.5 py-1 rounded-md bg-white/5 border border-white/10">
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
                    className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-stone-800/90 bg-[#191412] hover:border-orange-500/50 hover:bg-[#201916] transition-all duration-300 hover:-translate-y-1.5 shadow-sm hover:shadow-xl hover:shadow-orange-500/10"
                    style={{ backgroundColor: '#191412' }}
                  >
                    <div>
                      {/* Top 9:16 Vertical Image Preview Stage */}
                      {item.imagePreview && (
                        <Link
                          href={item.href}
                          className="block relative aspect-[9/16] w-full overflow-hidden bg-[#0a0807] border-b border-stone-800/80 group/media"
                          title={`Open ${item.name} Studio`}
                        >
                          {/* Ambient Blurred Background Glow Layer */}
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={getOptimizedCloudinaryUrl(item.imagePreview, 100)}
                            alt=""
                            aria-hidden="true"
                            className="absolute inset-0 h-full w-full object-cover scale-125 blur-xl opacity-20 pointer-events-none"
                          />

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
                              <span className="rounded-full bg-gradient-to-r from-[#FF5722] to-[#FFA000] px-2 py-0.5 text-[8px] font-black text-white uppercase tracking-wider shadow-sm ring-1 ring-white/20">
                                Popular
                              </span>
                            )}
                          </div>

                          {/* Floating 9:16 Format Tag Bottom Left */}
                          <div className="absolute bottom-2 left-2 sm:bottom-2.5 sm:left-2.5 z-20 flex items-center gap-1.5">
                            <span className="px-2 py-0.5 rounded-full bg-black/80 text-[9px] font-mono font-bold text-stone-200 border border-white/10 backdrop-blur-md">
                              9:16
                            </span>
                            {item.badgeLabel && (
                              <span className="hidden sm:inline px-1.5 py-0.5 rounded-full bg-orange-500/20 text-[8px] font-bold text-orange-300 border border-orange-500/30 backdrop-blur-md">
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
                            <h4 className="text-xs sm:text-sm font-extrabold text-white tracking-tight group-hover/title:text-orange-400 transition-colors line-clamp-1">
                              {item.name}
                            </h4>
                          </div>
                        </Link>

                        <p className="text-[11px] sm:text-xs text-stone-400 leading-relaxed line-clamp-2 min-h-[30px] sm:min-h-[32px]">
                          {item.description}
                        </p>
                      </div>
                    </div>

                    {/* Dual Action Links Footer */}
                    <div className="px-2 pb-2.5 sm:px-3 sm:pb-3.5 pt-2.5 border-t border-stone-800/80 grid grid-cols-2 gap-1.5">
                      <Link
                        href={item.publicHref}
                        title={`See what ${item.name} does`}
                        className="inline-flex items-center justify-center gap-1 rounded-lg border border-white/10 bg-white/[0.04] px-1.5 py-1.5 text-[10px] sm:text-[11px] font-semibold text-stone-300 hover:border-white/25 hover:bg-white/[0.08] hover:text-white transition-all text-center"
                      >
                        <BookOpen size={11} className="text-stone-400 shrink-0" />
                        <span className="truncate">What It Does</span>
                      </Link>
                      <Link
                        href={item.href}
                        title={`Create video with ${item.name}`}
                        className="inline-flex items-center justify-center gap-1 rounded-lg bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-400 hover:to-amber-400 px-1.5 py-1.5 text-[10px] sm:text-[11px] font-bold text-white shadow-xs transition-all hover:brightness-110 active:scale-95 text-center"
                      >
                        <span className="truncate">Create Video</span>
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
          <div
            className="rounded-3xl sm:rounded-[32px] border border-stone-800/90 bg-[#120F0D] p-4 sm:p-6 md:p-8 shadow-2xl ring-1 ring-white/[0.04] transition-all duration-300"
            style={{
              backgroundColor: '#120F0D',
              boxShadow: 'inset 0 1px 0 0 rgba(255, 255, 255, 0.08), 0 20px 40px -15px rgba(0, 0, 0, 0.7)',
            }}
          >
            {/* Stage Header Banner */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-5 sm:pb-6 border-b border-stone-800/80">
              <div>
                <div className="inline-flex items-center gap-1.5 rounded-full bg-sky-500/15 border border-sky-500/30 px-3 py-1 text-[11px] font-mono font-bold text-sky-400 uppercase tracking-wider mb-2">
                  <Tv size={12} />
                  <span>16:9 Widescreen Cinema Format</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                  16:9 Long-Form &amp; Cinema Studios
                </h3>
                <p className="text-xs sm:text-sm text-stone-400 mt-0.5">
                  Full 16:9 widescreen format for YouTube, presentations, summaries, and podcasts up to 5 minutes.
                </p>
              </div>

              {/* Format Metadata Pills */}
              <div className="flex flex-wrap items-center gap-2 text-xs font-mono font-bold shrink-0">
                <Link
                  href="/video-types"
                  className="inline-flex items-center gap-1 text-[11px] font-sans font-bold text-sky-400 hover:text-sky-300 transition-colors mr-1"
                >
                  <BookOpen size={13} />
                  <span>View Dedicated Guides</span>
                  <ChevronRight size={13} />
                </Link>
                <span className="text-sky-400 px-2.5 py-1 rounded-md bg-sky-500/15 border border-sky-500/30">
                  1 Min = 1 Cr (Max 5m)
                </span>
                <span className="text-stone-600 hidden sm:inline">•</span>
                <span className="text-stone-300 px-2.5 py-1 rounded-md bg-white/5 border border-white/10">
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
                    className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-stone-800/90 bg-[#191412] hover:border-sky-500/50 hover:bg-[#201916] transition-all duration-300 hover:-translate-y-1.5 shadow-sm hover:shadow-xl hover:shadow-sky-500/10"
                    style={{ backgroundColor: '#191412' }}
                  >
                    <div>
                      {/* Top 16:9 Image Preview Stage */}
                      {item.imagePreview && (
                        <Link
                          href={item.href}
                          className="block relative aspect-[16/9] w-full overflow-hidden bg-[#0a0807] border-b border-stone-800/80 group/media"
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
                          <div className="absolute inset-0 bg-gradient-to-t from-[#120F0D]/90 via-transparent to-transparent opacity-65 group-hover:opacity-30 transition-opacity" />

                          {/* Top Badges */}
                          <div className="absolute top-2.5 right-2.5 z-10 flex items-center gap-1.5">
                            {item.isPopular && (
                              <span className="rounded-full bg-gradient-to-r from-sky-500 to-indigo-500 px-2.5 py-0.5 text-[8px] font-black text-white uppercase tracking-wider shadow-sm ring-1 ring-white/20">
                                Popular
                              </span>
                            )}
                          </div>

                          {/* Format Pill Bottom Left */}
                          <div className="absolute bottom-2.5 left-2.5 z-10 flex items-center gap-2">
                            <span className="px-2 py-0.5 rounded-full bg-black/80 text-[9px] font-mono font-bold text-stone-200 border border-white/10 backdrop-blur-md">
                              16:9
                            </span>
                            {item.badgeLabel && (
                              <span className="px-2 py-0.5 rounded-full bg-sky-500/20 text-[9px] font-bold text-sky-300 border border-sky-500/30 backdrop-blur-md">
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
                            <h4 className="text-sm sm:text-base font-extrabold text-white tracking-tight group-hover/title:text-sky-400 transition-colors line-clamp-1">
                              {item.name}
                            </h4>
                          </div>
                        </Link>

                        <p className="text-xs text-stone-400 leading-relaxed line-clamp-2 min-h-[32px]">
                          {item.description}
                        </p>
                      </div>
                    </div>

                    {/* Dual Action Links Footer */}
                    <div className="px-3 pb-3.5 sm:px-4 sm:pb-4 pt-3 border-t border-stone-800/80 grid grid-cols-2 gap-2">
                      <Link
                        href={item.publicHref}
                        title={`See what ${item.name} does`}
                        className="inline-flex items-center justify-center gap-1 rounded-lg border border-white/10 bg-white/[0.04] px-2 py-2 text-[11px] font-semibold text-stone-300 hover:border-white/25 hover:bg-white/[0.08] hover:text-white transition-all text-center"
                      >
                        <BookOpen size={12} className="text-stone-400 shrink-0" />
                        <span className="truncate">What It Does</span>
                      </Link>
                      <Link
                        href={item.href}
                        title={`Create video with ${item.name}`}
                        className="inline-flex items-center justify-center gap-1 rounded-lg bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 px-2 py-2 text-[11px] font-bold text-white shadow-xs transition-all hover:brightness-110 active:scale-95 text-center"
                      >
                        <span className="truncate">Create Video</span>
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
          <div
            className="rounded-3xl sm:rounded-[32px] border border-stone-800/90 bg-[#120F0D] p-4 sm:p-6 md:p-8 shadow-2xl ring-1 ring-white/[0.04] transition-all duration-300"
            style={{
              backgroundColor: '#120F0D',
              boxShadow: 'inset 0 1px 0 0 rgba(255, 255, 255, 0.08), 0 20px 40px -15px rgba(0, 0, 0, 0.7)',
            }}
          >
            {/* Stage Header Banner */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-5 sm:pb-6 border-b border-stone-800/80">
              <div>
                <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 px-3 py-1 text-[11px] font-mono font-bold text-emerald-400 uppercase tracking-wider mb-2">
                  <Mic size={12} />
                  <span>Studio Audio Utility</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                  AI Studio Audio Cleaner &amp; Mastering
                </h3>
                <p className="text-xs sm:text-sm text-stone-400 mt-0.5">
                  Clean voiceovers, detect retakes, remove background room noise, and export studio master audio.
                </p>
              </div>

              {/* Format Metadata Pills */}
              <div className="flex flex-wrap items-center gap-2 text-xs font-mono font-bold shrink-0">
                <span className="text-emerald-400 px-2.5 py-1 rounded-md bg-emerald-500/15 border border-emerald-500/30">
                  1 Credit / File
                </span>
                <span className="text-stone-600 hidden sm:inline">•</span>
                <span className="text-stone-300 px-2.5 py-1 rounded-md bg-white/5 border border-white/10">
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
                    className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-stone-800/90 bg-[#191412] hover:border-emerald-500/50 hover:bg-[#211a17] transition-all duration-300 hover:-translate-y-1.5 shadow-sm hover:shadow-xl hover:shadow-emerald-500/10"
                    style={{ backgroundColor: '#191412' }}
                  >
                    <div>
                      {item.imagePreview && (
                        <Link
                          href={item.href}
                          className="block relative aspect-[16/9] w-full overflow-hidden bg-[#0a0807] border-b border-stone-800/80 group/media"
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
                          <div className="absolute inset-0 bg-gradient-to-t from-[#120F0D]/90 via-transparent to-transparent opacity-65 group-hover:opacity-30 transition-opacity" />
                          <div className="absolute bottom-3 left-3 z-10 flex items-center gap-2">
                            <span className="px-2.5 py-1 rounded-full bg-black/80 text-[10px] font-bold text-emerald-400 border border-emerald-400/30 backdrop-blur-md shadow-md">
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
                            <h4 className="text-base font-extrabold text-white tracking-tight group-hover/title:text-emerald-400 transition-colors line-clamp-1">
                              {item.name}
                            </h4>
                          </div>
                        </Link>
                        <p className="text-xs text-stone-400 leading-relaxed line-clamp-2 min-h-[32px]">
                          {item.description}
                        </p>
                      </div>
                    </div>

                    {/* Dual Action Links Footer */}
                    <div className="px-3.5 pb-4 sm:px-4 sm:pb-4 pt-3 border-t border-stone-800/80 grid grid-cols-2 gap-2">
                      <Link
                        href={item.publicHref}
                        title={`See what ${item.name} does`}
                        className="inline-flex items-center justify-center gap-1 rounded-lg border border-white/10 bg-white/[0.04] px-2 py-2 text-[11px] font-semibold text-stone-300 hover:border-white/25 hover:bg-white/[0.08] hover:text-white transition-all text-center"
                      >
                        <BookOpen size={12} className="text-stone-400 shrink-0" />
                        <span className="truncate">What It Does</span>
                      </Link>
                      <Link
                        href={item.href}
                        title={`Open ${item.name} Studio`}
                        className="inline-flex items-center justify-center gap-1 rounded-lg bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 px-2 py-2 text-[11px] font-bold text-white shadow-xs transition-all hover:brightness-110 active:scale-95 text-center"
                      >
                        <span className="truncate">Clean Audio</span>
                        <ArrowRight size={12} className="shrink-0" />
                      </Link>
                    </div>
                  </div>
                );
              })}

              {/* Audio Cleaner Feature Highlights Card */}
              <div className="rounded-2xl border border-stone-800/90 bg-[#15110F] p-5 sm:p-6 flex flex-col justify-between">
                <div>
                  <h4 className="text-sm font-extrabold text-emerald-400 uppercase tracking-wider flex items-center gap-2">
                    <CheckCircle2 size={16} />
                    <span>Instant Studio Mastering Features</span>
                  </h4>
                  <ul className="mt-4 space-y-2.5 text-xs text-stone-300 font-medium">
                    <li className="flex items-center gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                      <span>Automatic retake and mistake removal via speech analysis</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                      <span>De-reverb &amp; ambient room noise cancellation</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                      <span>Broadcast loudness leveling (-14 LUFS standard)</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                      <span>Export clean 48kHz WAV or 320kbps MP3</span>
                    </li>
                  </ul>
                </div>

                <Link
                  href="/dashboard/audio-cleaner"
                  className="mt-6 inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-500/15 border border-emerald-500/30 px-4 py-2.5 text-xs font-bold text-emerald-300 hover:bg-emerald-500/25 transition-all"
                >
                  <span>Clean Your Audio Now</span>
                  <ArrowRight size={14} />
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* View All Studios Dashboard Button CTA with Ambient Glowing Halo */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4 pb-2">
          <div className="relative group">
            {/* Ambient Pulsing Glow Halo */}
            <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-[#FF5722] via-[#FF7043] to-[#FFA000] opacity-40 blur-lg transition duration-500 group-hover:opacity-75 group-hover:blur-xl" />
            
            <Link
              href="/dashboard"
              className="relative inline-flex items-center justify-center gap-2.5 rounded-full bg-gradient-to-r from-[#FF5722] via-[#FF7043] to-[#FFA000] px-8 sm:px-9 py-3.5 sm:py-4 text-xs sm:text-sm font-bold text-white shadow-lg shadow-orange-500/25 hover:shadow-orange-500/40 transition-all duration-200 hover:brightness-110 active:scale-95"
            >
              <Sparkles size={16} className="text-white fill-white" />
              <span>Launch Any Studio Now</span>
              <ArrowRight size={16} />
            </Link>
          </div>

          <Link
            href="/video-types"
            className="inline-flex items-center justify-center gap-2 rounded-full border border-stone-800 bg-[#171210] hover:bg-stone-800 hover:border-stone-700 px-7 sm:px-8 py-3.5 sm:py-4 text-xs sm:text-sm font-bold text-stone-200 hover:text-white transition-all duration-200 shadow-md active:scale-95"
          >
            <BookOpen size={15} className="text-orange-400" />
            <span>Explore All 10 Dedicated Pages &amp; Specs</span>
            <ChevronRight size={15} className="text-stone-400" />
          </Link>
        </div>

      </div>
    </section>
  );
}
