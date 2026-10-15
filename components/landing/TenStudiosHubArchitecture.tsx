'use client';

import React, { useState } from 'react';
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
} from 'lucide-react';

export interface VideoTypeItem {
  id: string;
  name: string;
  href: string;
  icon: React.ElementType;
  iconBgClass: string;
  iconColorClass: string;
  aspectRatio: '9:16' | '16:9' | 'Audio';
  description?: string;
  isPopular?: boolean;
  imagePreview?: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// ACCURATE UNIFIED VIDEO TYPES REGISTRY (10 Active Studios + 1 Audio Utility)
// ─────────────────────────────────────────────────────────────────────────────

export const WIDESCREEN_169_STUDIOS: VideoTypeItem[] = [
  {
    id: 'faceless-video',
    name: 'Faceless Video',
    href: '/dashboard/faceless-video',
    icon: Tv,
    iconBgClass: 'bg-orange-500/15 border border-orange-500/30',
    iconColorClass: 'text-orange-600',
    aspectRatio: '16:9',
    description: 'Turn voiceovers & scripts into 16:9 YouTube explainers with AI B-roll & visuals.',
    isPopular: true,
    imagePreview: 'https://res.cloudinary.com/dhouh9idx/image/upload/v1791892533/faceless_video_ytyxdo.png',
  },
  {
    id: 'book-summary',
    name: 'Book Summary Video',
    href: '/dashboard/book-summary',
    icon: BookOpen,
    iconBgClass: 'bg-amber-500/15 border border-amber-500/30',
    iconColorClass: 'text-amber-600',
    aspectRatio: '16:9',
    description: 'Turn book narration into cinematic lesson card video explainers.',
    imagePreview: 'https://res.cloudinary.com/dhouh9idx/image/upload/v1791892528/book_summary_video_xjvjuf.png',
  },
  {
    id: 'image-to-video-ai',
    name: 'Image to Video AI',
    href: '/dashboard/image-to-video-ai',
    icon: Film,
    iconBgClass: 'bg-orange-500/15 border border-orange-500/30',
    iconColorClass: 'text-orange-600',
    aspectRatio: '16:9',
    description: 'Transform images & audio into 16:9 cinematic videos with Ken Burns camera motion.',
    isPopular: true,
    imagePreview: 'https://res.cloudinary.com/dhouh9idx/image/upload/v1791892532/image_to_video_ai_h2f54a.png',
  },
  {
    id: 'youtube-subtitle-generator',
    name: 'YouTube Subtitle Generator',
    href: '/dashboard/youtube-subtitles',
    icon: Captions,
    iconBgClass: 'bg-amber-500/15 border border-amber-500/30',
    iconColorClass: 'text-amber-600',
    aspectRatio: '16:9',
    description: 'Burn clean Western-style subtitle strips into widescreen podcasts.',
    imagePreview: 'https://res.cloudinary.com/dhouh9idx/image/upload/v1791892530/youtube_subtitles_generator_nrgxle.png',
  },
];

export const VERTICAL_916_STUDIOS: VideoTypeItem[] = [
  {
    id: 'auto-caption',
    name: 'Auto Caption Generator',
    href: '/dashboard/auto-caption',
    icon: Captions,
    iconBgClass: 'bg-orange-500/15 border border-orange-500/30',
    iconColorClass: 'text-orange-600',
    aspectRatio: '9:16',
    description: 'Kinetic word-synced subtitles for Reels, Shorts, TikTok & YouTube.',
    isPopular: true,
    imagePreview: 'https://res.cloudinary.com/dhouh9idx/image/upload/v1791892531/auto_captions_x9khtt.png',
  },
  {
    id: 'typography-video',
    name: 'Kinetic Typography',
    href: '/dashboard/typography-video',
    icon: FileText,
    iconBgClass: 'bg-amber-500/15 border border-amber-500/30',
    iconColorClass: 'text-amber-600',
    aspectRatio: '9:16',
    description: 'Kinetic speech-to-text animated motion typography.',
    imagePreview: 'https://res.cloudinary.com/dhouh9idx/image/upload/v1791892516/typography_kinetic_motion_lrpawu.png',
  },
  {
    id: 'whiteboard-video',
    name: 'Whiteboard Video',
    href: '/dashboard/whiteboard-video',
    icon: PenTool,
    iconBgClass: 'bg-orange-500/15 border border-orange-500/30',
    iconColorClass: 'text-orange-600',
    aspectRatio: '9:16',
    description: 'Transform spoken narration into hand-drawn whiteboard scenes.',
    imagePreview: 'https://res.cloudinary.com/dhouh9idx/image/upload/v1791892527/whiteboard_video_wamtgr.png',
  },
  {
    id: 'compare-explainer',
    name: 'Compare Explainer',
    href: '/dashboard/compare-explainer',
    icon: Columns,
    iconBgClass: 'bg-amber-500/15 border border-amber-500/30',
    iconColorClass: 'text-amber-600',
    aspectRatio: '9:16',
    description: 'Side-by-side comparison videos with narration & custom visuals.',
    imagePreview: 'https://res.cloudinary.com/dhouh9idx/image/upload/v1791892515/compare_explainer_wheox5.png',
  },
  {
    id: 'long-video-clips',
    name: 'Long Video to Clips',
    href: '/dashboard/long-video-clips',
    icon: Scissors,
    iconBgClass: 'bg-orange-500/15 border border-orange-500/30',
    iconColorClass: 'text-orange-600',
    aspectRatio: '9:16',
    description: 'Detect viral high-retention moments from long videos into shorts.',
    isPopular: true,
    imagePreview: 'https://res.cloudinary.com/dhouh9idx/image/upload/v1791892526/viral_video_clips_hnlav3.png',
  },
  {
    id: 'long-video-promo',
    name: 'Long Video Promo',
    href: '/dashboard/long-video-promo',
    icon: Tv,
    iconBgClass: 'bg-orange-500/15 border border-orange-500/30',
    iconColorClass: 'text-orange-600',
    aspectRatio: '9:16',
    description: 'Promote widescreen videos with thumbnail, handle & CTA layout.',
    imagePreview: 'https://res.cloudinary.com/dhouh9idx/image/upload/v1791892524/longvideopromo_sq4ank.png',
  },
];

export const UTILITY_STUDIOS: VideoTypeItem[] = [
  {
    id: 'audio-cleaner',
    name: 'AI Audio Cleaner',
    href: '/dashboard/audio-cleaner',
    icon: Mic,
    iconBgClass: 'bg-emerald-500/15 border border-emerald-500/30',
    iconColorClass: 'text-emerald-600',
    aspectRatio: 'Audio',
    description: 'Detect retakes, remove background noise, and export studio master audio.',
    imagePreview: 'https://res.cloudinary.com/dhouh9idx/image/upload/v1791892521/audio_cleaner_tzshum.png',
  },
];

export const ALL_VIDEO_TYPES: VideoTypeItem[] = [
  ...WIDESCREEN_169_STUDIOS,
  ...VERTICAL_916_STUDIOS,
  ...UTILITY_STUDIOS,
];

type StudioTab = 'all' | '169' | '916' | 'utility';

export default function TenStudiosHubArchitecture() {
  const [activeTab, setActiveTab] = useState<StudioTab>('all');

  const show169 = activeTab === 'all' || activeTab === '169';
  const show916 = activeTab === 'all' || activeTab === '916';
  const showUtility = activeTab === 'all' || activeTab === 'utility';

  return (
    <section id="video-types" className="relative w-full overflow-hidden bg-[#FAFAFA] py-16 text-slate-900 sm:py-24 border-b border-slate-200/80">
      {/* Background Ambient Glows */}
      <div className="pointer-events-none absolute left-1/2 top-1/3 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-orange-500/10 blur-[160px] rounded-full" />
      <div className="pointer-events-none absolute right-0 bottom-10 w-96 h-96 bg-amber-500/10 blur-[140px] rounded-full" />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full space-y-10">
        
        {/* Top Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 rounded-full border border-orange-500/30 bg-orange-500/10 px-4 py-1.5 text-xs font-bold text-orange-700 shadow-xs">
            <Sparkles size={14} className="text-[#FF5722]" />
            <span>ALL-IN-ONE VIDEO CREATION PLATFORM</span>
          </div>
          
          <h2 className="text-3xl font-black tracking-tight text-slate-900 sm:text-5xl font-sans">
            AI Video Studios{' '}
            <span className="bg-gradient-to-r from-[#FF5722] via-[#FF7043] to-[#FFA000] bg-clip-text text-transparent">
              &amp; Workflows
            </span>
          </h2>

          <p className="text-sm sm:text-base text-slate-600 font-normal leading-relaxed">
            Select any dedicated studio below to start creating 1080p Full HD video instantly. Each studio has specialized AI planners, timing logic, and motion presets.
          </p>

          {/* Interactive Filter Tabs */}
          <div className="pt-3 flex flex-wrap items-center justify-center gap-2">
            <button
              type="button"
              onClick={() => setActiveTab('all')}
              className={`rounded-full px-4 py-2 text-xs font-bold transition cursor-pointer ${
                activeTab === 'all'
                  ? 'bg-slate-900 text-white shadow-md'
                  : 'bg-white text-slate-600 border border-slate-200 hover:border-orange-500/40 hover:text-slate-900'
              }`}
            >
              All Studios (11)
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('169')}
              className={`rounded-full px-4 py-2 text-xs font-bold transition cursor-pointer ${
                activeTab === '169'
                  ? 'bg-gradient-to-r from-[#FF5722] to-[#FFA000] text-white shadow-md'
                  : 'bg-white text-slate-600 border border-slate-200 hover:border-orange-500/40 hover:text-slate-900'
              }`}
            >
              🖥️ 16:9 Widescreen (4)
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('916')}
              className={`rounded-full px-4 py-2 text-xs font-bold transition cursor-pointer ${
                activeTab === '916'
                  ? 'bg-gradient-to-r from-[#FF5722] to-[#FFA000] text-white shadow-md'
                  : 'bg-white text-slate-600 border border-slate-200 hover:border-orange-500/40 hover:text-slate-900'
              }`}
            >
              📱 9:16 Shorts &amp; Reels (6)
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('utility')}
              className={`rounded-full px-4 py-2 text-xs font-bold transition cursor-pointer ${
                activeTab === 'utility'
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'bg-white text-slate-600 border border-slate-200 hover:border-emerald-500/40 hover:text-slate-900'
              }`}
            >
              🎙️ Audio Utility (1)
            </button>
          </div>
        </div>

        {/* ───────────────────────────────────────────────────────────── */}
        {/* 1. 16:9 WIDESCREEN CINEMA & LONG-FORM STUDIOS                */}
        {/* ───────────────────────────────────────────────────────────── */}
        {show169 && (
          <div className="rounded-[32px] border border-slate-200/90 bg-white p-6 sm:p-8 backdrop-blur-2xl shadow-xl ring-1 ring-slate-100">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-6 border-b border-slate-100">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full bg-orange-500/10 border border-orange-500/30 px-3 py-1 text-[11px] font-mono font-bold text-[#FF5722] uppercase tracking-wider mb-2">
                  🖥️ 16:9 Widescreen Cinema
                </div>
                <h3 className="text-2xl font-black text-slate-900 tracking-tight">
                  16:9 Long-Form &amp; Cinema Studios
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
                  Full 16:9 widescreen format for YouTube, presentations, summaries, and podcasts up to 10 minutes.
                </p>
              </div>
              <div className="flex items-center gap-2 text-xs font-mono font-bold shrink-0">
                <span className="text-orange-700 px-2.5 py-1 rounded-md bg-orange-500/10 border border-orange-500/30">1 Min = 1 Cr</span>
                <span className="text-slate-400">•</span>
                <span className="text-slate-700 px-2.5 py-1 rounded-md bg-slate-100 border border-slate-200">1920×1080 Full HD</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pt-6">
              {WIDESCREEN_169_STUDIOS.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.id}
                    href={item.href}
                    className="group relative flex flex-col justify-between overflow-hidden rounded-[24px] border border-slate-200/90 bg-white hover:border-orange-500/50 hover:bg-white transition-all duration-300 active:scale-[0.98] shadow-sm hover:shadow-xl hover:shadow-orange-500/10"
                  >
                    <div>
                      {/* Top 16:9 Image Preview Stage */}
                      {item.imagePreview && (
                        <div className="relative aspect-[16/9] w-full overflow-hidden bg-slate-900 border-b border-slate-100">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={item.imagePreview}
                            alt={item.name}
                            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                            loading="lazy"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent opacity-80 group-hover:opacity-60 transition-opacity" />

                          {/* Top Badges on Image */}
                          <div className="absolute top-2.5 right-2.5 flex items-center gap-1.5">
                            {item.isPopular && (
                              <span className="rounded-full bg-gradient-to-r from-[#FF5722] to-[#FFA000] px-2.5 py-0.5 text-[9px] font-black text-white uppercase tracking-wider shadow-md">
                                Popular
                              </span>
                            )}
                          </div>

                          {/* Floating 16:9 Format Badge Bottom Left */}
                          <div className="absolute bottom-2.5 left-2.5 flex items-center gap-2">
                            <span className="px-2 py-0.5 rounded-full bg-black/80 text-[10px] font-bold text-white border border-white/20 backdrop-blur-md">
                              🖥️ 16:9
                            </span>
                          </div>
                        </div>
                      )}

                      {/* Card Content Body */}
                      <div className="p-4 sm:p-5">
                        <div className="flex items-center gap-2 mb-2">
                          <div className={`flex h-7 w-7 items-center justify-center rounded-lg ${item.iconBgClass} ${item.iconColorClass}`}>
                            <Icon size={14} />
                          </div>
                          <h4 className="text-base font-extrabold text-slate-900 tracking-tight group-hover:text-orange-600 transition-colors line-clamp-1">
                            {item.name}
                          </h4>
                        </div>

                        <p className="text-xs text-slate-500 leading-relaxed line-clamp-2 min-h-[32px]">
                          {item.description}
                        </p>
                      </div>
                    </div>

                    {/* Footer Link CTA */}
                    <div className="px-4 pb-4 sm:px-5 sm:pb-5 pt-0 flex items-center justify-between text-xs font-bold text-orange-600 group-hover:text-orange-700 transition-colors">
                      <span>Open Studio</span>
                      <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        )}

        {/* ───────────────────────────────────────────────────────────── */}
        {/* 2. 9:16 VERTICAL SHORTS & REELS STUDIOS                       */}
        {/* ───────────────────────────────────────────────────────────── */}
        {show916 && (
          <div className="rounded-[32px] border border-slate-200/90 bg-white p-6 sm:p-8 backdrop-blur-2xl shadow-xl ring-1 ring-slate-100">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-6 border-b border-slate-100">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full bg-orange-500/10 border border-orange-500/30 px-3 py-1 text-[11px] font-mono font-bold text-[#FF5722] uppercase tracking-wider mb-2">
                  📱 9:16 Vertical Shorts
                </div>
                <h3 className="text-2xl font-black text-slate-900 tracking-tight">
                  9:16 Shorts, Reels &amp; TikTok Studios
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
                  Full 9:16 vertical smartphone format with auto-captions, kinetic text, whiteboard, and viral clips up to 90 seconds.
                </p>
              </div>
              <div className="flex items-center gap-2 text-xs font-mono font-bold shrink-0">
                <span className="text-emerald-700 px-2.5 py-1 rounded-md bg-emerald-500/10 border border-emerald-500/30">1 Credit / Video</span>
                <span className="text-slate-400">•</span>
                <span className="text-slate-700 px-2.5 py-1 rounded-md bg-slate-100 border border-slate-200">1080×1920 Full HD</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4 sm:gap-5 pt-6">
              {VERTICAL_916_STUDIOS.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.id}
                    href={item.href}
                    className="group relative flex flex-col justify-between overflow-hidden rounded-[24px] border border-slate-200/90 bg-white hover:border-orange-500/50 hover:bg-white transition-all duration-300 active:scale-[0.98] shadow-sm hover:shadow-xl hover:shadow-orange-500/10"
                  >
                    <div>
                      {/* Top 9:16 Vertical Image Preview Stage */}
                      {item.imagePreview && (
                        <div className="relative aspect-[9/16] w-full overflow-hidden bg-slate-900 border-b border-slate-100">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={item.imagePreview}
                            alt={item.name}
                            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                            loading="lazy"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent opacity-85 group-hover:opacity-60 transition-opacity" />

                          {/* Top Badges on Image */}
                          <div className="absolute top-2.5 right-2.5 flex items-center gap-1.5">
                            {item.isPopular && (
                              <span className="rounded-full bg-gradient-to-r from-[#FF5722] to-[#FFA000] px-2 py-0.5 text-[8px] font-black text-white uppercase tracking-wider shadow-md">
                                Popular
                              </span>
                            )}
                          </div>

                          {/* Floating 9:16 Format Badge Bottom Left */}
                          <div className="absolute bottom-2.5 left-2.5 flex items-center gap-2">
                            <span className="px-2 py-0.5 rounded-full bg-black/80 text-[9px] font-bold text-white border border-white/20 backdrop-blur-md">
                              📱 9:16
                            </span>
                          </div>
                        </div>
                      )}

                      {/* Card Content Body */}
                      <div className="p-3.5 sm:p-4">
                        <div className="flex items-center gap-1.5 mb-1.5">
                          <div className={`flex h-6 w-6 items-center justify-center rounded-md ${item.iconBgClass} ${item.iconColorClass}`}>
                            <Icon size={12} />
                          </div>
                          <h4 className="text-sm font-extrabold text-slate-900 tracking-tight group-hover:text-orange-600 transition-colors line-clamp-1">
                            {item.name}
                          </h4>
                        </div>

                        <p className="text-[11px] text-slate-500 leading-relaxed line-clamp-2 min-h-[30px]">
                          {item.description}
                        </p>
                      </div>
                    </div>

                    {/* Footer Link CTA */}
                    <div className="px-3.5 pb-3.5 sm:px-4 sm:pb-4 pt-0 flex items-center justify-between text-[11px] font-bold text-orange-600 group-hover:text-orange-700 transition-colors">
                      <span>Open</span>
                      <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        )}

        {/* ───────────────────────────────────────────────────────────── */}
        {/* 3. STUDIO UTILITIES (AI AUDIO CLEANER)                       */}
        {/* ───────────────────────────────────────────────────────────── */}
        {showUtility && (
          <div className="rounded-[32px] border border-slate-200/90 bg-white p-6 sm:p-8 backdrop-blur-2xl shadow-xl ring-1 ring-slate-100">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-6 border-b border-slate-100">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full bg-emerald-500/10 border border-emerald-500/30 px-3 py-1 text-[11px] font-mono font-bold text-emerald-600 uppercase tracking-wider mb-2">
                  🎙️ Studio Audio Utility
                </div>
                <h3 className="text-2xl font-black text-slate-900 tracking-tight">
                  AI Studio Audio Cleaner &amp; Mastering
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
                  Clean voiceovers, detect retakes, remove background room noise, and export studio master audio.
                </p>
              </div>
              <div className="flex items-center gap-2 text-xs font-mono font-bold shrink-0">
                <span className="text-emerald-700 px-2.5 py-1 rounded-md bg-emerald-500/10 border border-emerald-500/30">1 Credit / File</span>
                <span className="text-slate-400">•</span>
                <span className="text-slate-700 px-2.5 py-1 rounded-md bg-slate-100 border border-slate-200">Studio MP3/WAV</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pt-6">
              {UTILITY_STUDIOS.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.id}
                    href={item.href}
                    className="group relative flex flex-col justify-between overflow-hidden rounded-[24px] border border-slate-200/90 bg-white hover:border-emerald-500/50 hover:bg-white transition-all duration-300 active:scale-[0.98] shadow-sm hover:shadow-xl hover:shadow-emerald-500/10"
                  >
                    <div>
                      {item.imagePreview && (
                        <div className="relative aspect-[16/9] w-full overflow-hidden bg-slate-900 border-b border-slate-100">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={item.imagePreview}
                            alt={item.name}
                            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                            loading="lazy"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent opacity-80 group-hover:opacity-60 transition-opacity" />
                          <div className="absolute bottom-2.5 left-2.5 flex items-center gap-2">
                            <span className="px-2 py-0.5 rounded-full bg-black/80 text-[10px] font-bold text-emerald-400 border border-emerald-400/30 backdrop-blur-md">
                              🎙️ Master Audio
                            </span>
                          </div>
                        </div>
                      )}

                      <div className="p-4 sm:p-5">
                        <div className="flex items-center gap-2 mb-2">
                          <div className={`flex h-7 w-7 items-center justify-center rounded-lg ${item.iconBgClass} ${item.iconColorClass}`}>
                            <Icon size={14} />
                          </div>
                          <h4 className="text-base font-extrabold text-slate-900 tracking-tight group-hover:text-emerald-600 transition-colors line-clamp-1">
                            {item.name}
                          </h4>
                        </div>
                        <p className="text-xs text-slate-500 leading-relaxed line-clamp-2 min-h-[32px]">
                          {item.description}
                        </p>
                      </div>
                    </div>

                    <div className="px-4 pb-4 sm:px-5 sm:pb-5 pt-0 flex items-center justify-between text-xs font-bold text-emerald-600 group-hover:text-emerald-700 transition-colors">
                      <span>Open Audio Cleaner</span>
                      <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        )}

        {/* View All Studios Dashboard Button CTA */}
        <div className="flex justify-center pt-4">
          <Link
            href="/dashboard"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#FF5722] via-[#FF7043] to-[#FFA000] px-8 py-3.5 text-sm font-black text-white shadow-lg shadow-orange-500/25 transition-all hover:brightness-110 active:scale-95"
          >
            <span>Open All Studios in Studio Dashboard</span>
            <ArrowRight size={16} />
          </Link>
        </div>

      </div>
    </section>
  );
}
