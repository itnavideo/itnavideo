'use client';

import React from 'react';
import Link from 'next/link';
import { Smartphone, Monitor, Clock, Sparkles, Zap, ArrowRight, Play } from 'lucide-react';
import { getOptimizedCloudinaryUrl } from '@/lib/utils';

export interface StudioShowcaseItem {
  id: string;
  title: string;
  aspect: '16:9' | '9:16';
  imageUrl: string;
  slug: string;
  badgeLabel?: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// ROW 1: DEDICATED 9:16 VERTICAL SHORTS CARDS
// ─────────────────────────────────────────────────────────────────────────────
const SHORTS_916_ITEMS: StudioShowcaseItem[] = [
  {
    id: 'ai-shorts-polisher',
    title: 'Face Head Video',
    aspect: '9:16',
    imageUrl: 'https://res.cloudinary.com/dhouh9idx/image/upload/v1794744108/Professional_Studio_Presenter_with_Dream_Plan_Grow_Decor_vooqtc.png',
    slug: '/dashboard/ai-shorts-polisher',
    badgeLabel: '9:16 Face Head',
  },
  {
    id: 'auto-caption',
    title: 'Auto Caption Shorts',
    aspect: '9:16',
    imageUrl: 'https://res.cloudinary.com/dhouh9idx/image/upload/v1792945595/file_00000000df688211bc2231047185512d_ifk1xc.png',
    slug: '/dashboard/auto-caption',
    badgeLabel: 'FREE · 32 Presets',
  },
  {
    id: 'faceless-shorts',
    title: 'Faceless Shorts',
    aspect: '9:16',
    imageUrl: 'https://res.cloudinary.com/dhouh9idx/image/upload/v1792945593/file_00000000806482119547c1b937b7e386_zsrmkb.png',
    slug: '/dashboard/faceless-shorts',
    badgeLabel: '9:16 Kinetic Cuts',
  },
  {
    id: 'long-video-promo',
    title: 'Long Video Promo',
    aspect: '9:16',
    imageUrl: 'https://res.cloudinary.com/dhouh9idx/image/upload/v1792946358/longvideopromo_o0qheb.png',
    slug: '/dashboard/long-video-promo',
    badgeLabel: '9:16 Teaser Reel',
  },
  {
    id: 'whiteboard-shorts',
    title: 'Whiteboard Doodle',
    aspect: '9:16',
    imageUrl: 'https://res.cloudinary.com/dhouh9idx/image/upload/v1792950977/file_00000000a8388211b1207dad39960dc7_ahvk9g.png',
    slug: '/dashboard/whiteboard-video',
    badgeLabel: '9:16 Stickman',
  },
  {
    id: 'compare-shorts',
    title: 'Compare Showdown',
    aspect: '9:16',
    imageUrl: 'https://res.cloudinary.com/dhouh9idx/image/upload/v1792946197/file_0000000035a48208ab4068beb2a66a7d_kctvo9.png',
    slug: '/dashboard/compare-explainer',
    badgeLabel: '9:16 Versus Split',
  },
  {
    id: 'split-shorts',
    title: 'Split Screen Explainer',
    aspect: '9:16',
    imageUrl: 'https://res.cloudinary.com/dhouh9idx/image/upload/v1792945581/file_0000000039948211a5955d513e5d104a_wzrget.png',
    slug: '/dashboard/split-screen-explainer',
    badgeLabel: '9:16 Creator Split',
  },
  {
    id: 'viral-clips-shorts',
    title: 'Viral Video Clips',
    aspect: '9:16',
    imageUrl: 'https://res.cloudinary.com/dhouh9idx/image/upload/v1792946357/viral_video_clips_rllgec.png',
    slug: '/dashboard/long-video-clips',
    badgeLabel: '9:16 AI Hook Cutter',
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// ROW 2: DEDICATED 16:9 WIDESCREEN CINEMA CARDS
// ─────────────────────────────────────────────────────────────────────────────
const CINEMA_169_ITEMS: StudioShowcaseItem[] = [
  {
    id: 'faceless-video',
    title: 'Faceless Video',
    aspect: '16:9',
    imageUrl: 'https://res.cloudinary.com/dhouh9idx/image/upload/v1794743849/Faceless_AI_Video_Creation_Infographic_ramnfp.png',
    slug: '/dashboard/faceless-video',
    badgeLabel: '16:9 YouTube Cinema',
  },
  {
    id: 'whiteboard-video',
    title: 'Whiteboard Animation',
    aspect: '16:9',
    imageUrl: 'https://res.cloudinary.com/dhouh9idx/image/upload/v1794743849/Money_Saving_Tips_Infographic_sxwtuz.png',
    slug: '/dashboard/whiteboard-video',
    badgeLabel: '16:9 Doodle Cinema',
  },
  {
    id: 'compare-explainer',
    title: 'Compare Explainer',
    aspect: '16:9',
    imageUrl: 'https://res.cloudinary.com/dhouh9idx/image/upload/v1794744487/Option_A_vs_Option_B__Laptop_Comparison_tucwjk.png',
    slug: '/dashboard/compare-explainer',
    badgeLabel: '16:9 VS Breakdown',
  },
  {
    id: 'split-screen-explainer',
    title: 'Split Screen Explainer',
    aspect: '16:9',
    imageUrl: 'https://res.cloudinary.com/dhouh9idx/image/upload/v1794744816/Smart_Investing__Build_Wealth_Wisely_aqdjgj.png',
    slug: '/dashboard/split-screen-explainer',
    badgeLabel: '16:9 Creator Split',
  },
  {
    id: 'long-video-clips',
    title: 'Viral Video Clips',
    aspect: '16:9',
    imageUrl: 'https://res.cloudinary.com/dhouh9idx/image/upload/v1794744492/Long_Video_to_Multiple_Clips_Workflow_terxja.png',
    slug: '/dashboard/long-video-clips',
    badgeLabel: '16:9 Hook Cutter',
  },
  {
    id: 'youtube-subtitles',
    title: 'YouTube Subtitles',
    aspect: '16:9',
    imageUrl: 'https://res.cloudinary.com/dhouh9idx/image/upload/v1792946360/youtube_subtitles_generator_who62l.png',
    slug: '/dashboard/youtube-subtitles',
    badgeLabel: 'FREE · 16:9 Strips',
  },
  {
    id: 'book-summary',
    title: 'Book Summary Video',
    aspect: '16:9',
    imageUrl: 'https://res.cloudinary.com/dhouh9idx/image/upload/v1792946358/book_summary_video_zbs4em.png',
    slug: '/dashboard/book-summary',
    badgeLabel: '16:9 Summary Cards',
  },
  {
    id: 'ai-video-generator',
    title: 'AI Video Generator',
    aspect: '16:9',
    imageUrl: 'https://res.cloudinary.com/dhouh9idx/image/upload/v1794750594/AI_Video_Generator_Studio_j1fbid.png',
    slug: '/dashboard/ai-video-generator',
    badgeLabel: 'Autonomous Studio',
  },
  {
    id: 'long-video-promo',
    title: 'Long Video Promo',
    aspect: '16:9',
    imageUrl: 'https://res.cloudinary.com/dhouh9idx/image/upload/v1794745139/Promote_Your_Long_Video_w9w9ab.png',
    slug: '/dashboard/long-video-promo',
    badgeLabel: '16:9 Teaser Promo',
  },
  {
    id: 'image-to-video',
    title: 'Image to Video AI',
    aspect: '16:9',
    imageUrl: 'https://res.cloudinary.com/dhouh9idx/image/upload/v1792946349/imagetovideoai_w3hyci.jpg',
    slug: '/dashboard/image-to-video-ai',
    badgeLabel: '16:9 3D Parallax',
  },
];

function RibbonCard({ item }: { item: StudioShowcaseItem }) {
  const is169 = item.aspect === '16:9';

  return (
    <Link
      href={item.slug}
      aria-label={item.title}
      className={`group relative shrink-0 overflow-hidden rounded-2xl sm:rounded-[22px] transition-all duration-300 cursor-pointer block bg-black ${
        is169
          ? 'h-[170px] sm:h-[195px] md:h-[215px] aspect-[16/9] border-[1.5px] border-orange-500/60 shadow-[0_4px_18px_rgba(249,115,22,0.22)] hover:border-orange-500 hover:shadow-[0_10px_32px_rgba(249,115,22,0.45)] hover:scale-[1.02]'
          : 'h-[240px] sm:h-[275px] md:h-[295px] aspect-[9/16] border-[1.5px] border-[#1D70F5]/60 shadow-[0_4px_18px_rgba(29,112,245,0.22)] hover:border-[#1D70F5] hover:shadow-[0_10px_32px_rgba(29,112,245,0.45)] hover:scale-[1.02]'
      }`}
    >
      <div className="relative h-full w-full overflow-hidden rounded-[inherit]">
        {/* Full-Bleed Clean Image */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={getOptimizedCloudinaryUrl(item.imageUrl, is169 ? 720 : 480)}
          alt={item.title}
          loading="lazy"
          decoding="async"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          onError={(e) => {
            const fallback = is169
              ? 'https://res.cloudinary.com/dhouh9idx/image/upload/v1792945592/file_000000004290821180a71f25ad75480e_nztpwe.png'
              : 'https://res.cloudinary.com/dhouh9idx/image/upload/v1792945593/file_00000000806482119547c1b937b7e386_zsrmkb.png';
            (e.target as HTMLImageElement).src = getOptimizedCloudinaryUrl(fallback, is169 ? 720 : 480);
          }}
        />

        {/* Top Floating Badge Tag */}
        {item.badgeLabel && (
          <div className="absolute top-2.5 left-2.5 z-10">
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-black/80 border border-white/20 text-white backdrop-blur-md shadow-sm">
              {item.badgeLabel}
            </span>
          </div>
        )}

        {/* Hover Center Play Button */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
          <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-white/95 text-slate-900 shadow-2xl flex items-center justify-center transform scale-90 group-hover:scale-100 transition-transform duration-300">
            <Play className="w-4 h-4 sm:w-5 sm:h-5 fill-slate-900 ml-0.5" />
          </div>
        </div>

        {/* Minimal Clean Title Overlay on Hover */}
        <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
          <span className="block text-xs font-bold text-white truncate drop-shadow-md">
            {item.title}
          </span>
        </div>
      </div>
    </Link>
  );
}

export default function PlatformMarqueeTicker() {
  // Duplicate arrays once for seamless infinite -50% CSS marquee loop
  const shortsItems = [...SHORTS_916_ITEMS, ...SHORTS_916_ITEMS];
  const cinemaItems = [...CINEMA_169_ITEMS, ...CINEMA_169_ITEMS];

  return (
    <section
      aria-label="Video Studios Showcase Ribbon"
      className="relative w-full overflow-hidden bg-[#FAFAFD] py-10 sm:py-16 border-b border-slate-200/60 space-y-5 sm:space-y-7"
    >
      {/* Edge Gradient Masks for Smooth Seamless Fade */}
      <div className="pointer-events-none absolute left-0 top-0 bottom-0 z-20 w-12 sm:w-36 bg-gradient-to-r from-[#FAFAFD] via-[#FAFAFD]/85 to-transparent" />
      <div className="pointer-events-none absolute right-0 top-0 bottom-0 z-20 w-12 sm:w-36 bg-gradient-to-l from-[#FAFAFD] via-[#FAFAFD]/85 to-transparent" />

      {/* Line 1 Modern Floating Island Header: 9:16 Shorts */}
      <div className="relative z-30 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="group relative overflow-hidden flex flex-col lg:flex-row lg:items-center justify-between gap-4 p-4 sm:px-6 sm:py-4.5 rounded-2xl sm:rounded-3xl bg-white/95 backdrop-blur-xl border border-blue-200/70 shadow-[0_4px_24px_-4px_rgba(29,112,245,0.12),0_1px_2px_rgba(0,0,0,0.04)] transition-all duration-300 hover:border-blue-400/80 hover:shadow-[0_12px_36px_-6px_rgba(29,112,245,0.22)]">
          {/* Top specular beam */}
          <div className="pointer-events-none absolute inset-x-0 top-0 h-[1.5px] bg-gradient-to-r from-transparent via-[#1D70F5]/50 to-transparent" />
          {/* Ambient radial glow bloom */}
          <div className="pointer-events-none absolute -left-12 -top-12 h-36 w-48 rounded-full bg-blue-500/10 blur-2xl" />

          {/* Left: 9:16 Aspect Pill + Title + Duration */}
          <div className="relative z-10 flex flex-wrap items-center gap-3 sm:gap-4">
            {/* 3D Modern Aspect Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-[#1D70F5] to-blue-600 text-white shadow-md shadow-[#1D70F5]/30 ring-1 ring-white/25 select-none">
              <Smartphone className="w-3.5 h-3.5 text-blue-100" />
              <span className="text-[11px] font-mono font-black uppercase tracking-wider">9:16 VERTICAL</span>
              <span className="relative flex h-2 w-2 ml-0.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-300 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-400" />
              </span>
            </div>

            {/* Title with sleek gradient accent */}
            <h2 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight font-sans flex flex-wrap items-center gap-2.5">
              <span>
                Viral Shorts{' '}
                <span className="bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-700 bg-clip-text text-transparent">
                  &amp; Reels
                </span>
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold font-sans">
                <Clock className="w-3.5 h-3.5 text-blue-700" />
                Up to 90 seconds
              </span>
            </h2>
          </div>

          {/* Right: Ecosystem Chips + Pricing + CTA */}
          <div className="relative z-10 flex flex-wrap items-center justify-between lg:justify-end gap-2.5 sm:gap-3 text-xs font-semibold">
            {/* Platform Micro-Chips */}
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-900 text-white text-[11px] font-bold shadow-2xs">
                TikTok
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-gradient-to-r from-rose-50 to-pink-50 text-rose-700 border border-rose-200/80 text-[11px] font-bold">
                Instagram Reels
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-red-50 text-red-700 border border-red-200/80 text-[11px] font-bold">
                YouTube Shorts
              </span>
            </div>

            {/* Flat Credit Pricing Tag */}
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-500/30 text-xs font-black shadow-xs">
              <Zap className="w-3.5 h-3.5 text-emerald-600 fill-emerald-600" />
              1 Credit Flat
            </span>

            {/* Interactive Link */}
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-blue-50 text-blue-700 hover:bg-blue-100 hover:text-blue-800 border border-blue-200/70 text-xs font-bold transition-all"
            >
              <span>Open Studio</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>

      {/* Row 1: Dedicated 9:16 Vertical Shorts Marquee (moving left) */}
      <div className="flex w-max animate-m3-marquee gap-3.5 sm:gap-5 px-4 select-none items-center pt-1">
        {shortsItems.map((item, idx) => (
          <RibbonCard key={`shorts-${item.id}-${idx}`} item={item} />
        ))}
      </div>

      {/* Line 2 Modern Floating Island Header: 16:9 Cinema Long Videos */}
      <div className="relative z-30 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-8 sm:pt-12">
        <div className="group relative overflow-hidden flex flex-col lg:flex-row lg:items-center justify-between gap-4 p-4 sm:px-6 sm:py-4.5 rounded-2xl sm:rounded-3xl bg-white/95 backdrop-blur-xl border border-orange-200/70 shadow-[0_4px_24px_-4px_rgba(249,115,22,0.12),0_1px_2px_rgba(0,0,0,0.04)] transition-all duration-300 hover:border-orange-400/80 hover:shadow-[0_12px_36px_-6px_rgba(249,115,22,0.22)]">
          {/* Top specular beam */}
          <div className="pointer-events-none absolute inset-x-0 top-0 h-[1.5px] bg-gradient-to-r from-transparent via-orange-500/50 to-transparent" />
          {/* Ambient radial glow bloom */}
          <div className="pointer-events-none absolute -left-12 -top-12 h-36 w-48 rounded-full bg-orange-500/10 blur-2xl" />

          {/* Left: 16:9 Aspect Pill + Title + Duration */}
          <div className="relative z-10 flex flex-wrap items-center gap-3 sm:gap-4">
            {/* 3D Modern Aspect Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-orange-600 via-amber-500 to-orange-500 text-white shadow-md shadow-orange-500/30 ring-1 ring-white/25 select-none">
              <Monitor className="w-3.5 h-3.5 text-amber-100" />
              <span className="text-[11px] font-mono font-black uppercase tracking-wider">16:9 CINEMA</span>
              <span className="relative flex h-2 w-2 ml-0.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-200 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-300" />
              </span>
            </div>

            {/* Title with sleek gradient accent */}
            <h3 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight font-sans flex flex-wrap items-center gap-2.5">
              <span>
                Long Videos{' '}
                <span className="bg-gradient-to-r from-orange-600 via-amber-500 to-orange-500 bg-clip-text text-transparent">
                  &amp; Documentaries
                </span>
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/25 text-orange-700 text-xs font-bold font-sans">
                <Clock className="w-3.5 h-3.5 text-orange-600" />
                Long videos up to 5 min
              </span>
            </h3>
          </div>

          {/* Right: Ecosystem Chips + Pricing + CTA */}
          <div className="relative z-10 flex flex-wrap items-center justify-between lg:justify-end gap-2.5 sm:gap-3 text-xs font-semibold">
            {/* Specs & Channels Micro-Chips */}
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 text-slate-800 border border-slate-300/70 text-[11px] font-mono font-bold">
                1080p Full HD
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-red-50 text-red-700 border border-red-200/80 text-[11px] font-bold">
                YouTube Channels
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-50 text-amber-800 border border-amber-300/70 text-[11px] font-bold">
                Courses &amp; Lessons
              </span>
            </div>

            {/* Credit Pricing Tag */}
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-50 text-amber-900 border border-amber-500/30 text-xs font-black shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              1 Min = 1 Credit
            </span>

            {/* Interactive Link */}
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-orange-50 text-orange-700 hover:bg-orange-100 hover:text-orange-800 border border-orange-200/70 text-xs font-bold transition-all"
            >
              <span>Open Studio</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>

      {/* Row 2: Dedicated 16:9 Widescreen Cinema Marquee (moving right) */}
      <div className="flex w-max animate-m3-marquee-reverse gap-3.5 sm:gap-5 px-4 select-none items-center pt-1">
        {cinemaItems.map((item, idx) => (
          <RibbonCard key={`cinema-${item.id}-${idx}`} item={item} />
        ))}
      </div>
    </section>
  );
}
