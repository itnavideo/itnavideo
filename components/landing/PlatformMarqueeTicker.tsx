'use client';

import React from 'react';
import Link from 'next/link';
import { getOptimizedCloudinaryUrl } from '@/lib/utils';

export interface StudioShowcaseItem {
  id: string;
  title: string;
  aspect: '16:9' | '9:16';
  imageUrl: string;
  slug: string;
  badgeLabel?: string;
}

const STUDIO_SHOWCASE_ITEMS: StudioShowcaseItem[] = [
  {
    id: 'ai-video-generator',
    title: 'AI Video Generator (16:9)',
    aspect: '16:9',
    imageUrl: 'https://res.cloudinary.com/dhouh9idx/image/upload/v1794147192/AI_Video_Generator_Marketing_Banner_yf2djz.png',
    slug: '/dashboard/ai-video-generator',
    badgeLabel: 'Coming Soon',
  },
  {
    id: 'faceless-video',
    title: 'Faceless Video (16:9)',
    aspect: '16:9',
    imageUrl: 'https://res.cloudinary.com/dhouh9idx/image/upload/v1792945592/file_000000004290821180a71f25ad75480e_nztpwe.png',
    slug: '/dashboard/faceless-video',
    badgeLabel: '16:9 YouTube Cinema',
  },
  {
    id: 'faceless-shorts',
    title: 'Faceless Shorts (9:16)',
    aspect: '9:16',
    imageUrl: 'https://res.cloudinary.com/dhouh9idx/image/upload/v1792945593/file_00000000806482119547c1b937b7e386_zsrmkb.png',
    slug: '/dashboard/faceless-shorts',
    badgeLabel: '9:16 Faceless Shorts',
  },
  {
    id: 'auto-caption',
    title: 'Auto Caption Generator (9:16)',
    aspect: '9:16',
    imageUrl: 'https://res.cloudinary.com/dhouh9idx/image/upload/v1792945595/file_00000000df688211bc2231047185512d_ifk1xc.png',
    slug: '/dashboard/auto-caption',
    badgeLabel: '9:16 Kinetic Words',
  },
  {
    id: 'whiteboard-video',
    title: 'Whiteboard Explainer (9:16)',
    aspect: '9:16',
    imageUrl: 'https://res.cloudinary.com/dhouh9idx/image/upload/v1792950977/file_00000000a8388211b1207dad39960dc7_ahvk9g.png',
    slug: '/dashboard/whiteboard-video',
    badgeLabel: '9:16 Stickman Explainer',
  },
  {
    id: 'book-summary',
    title: 'Book Summary Video (16:9)',
    aspect: '16:9',
    imageUrl: 'https://res.cloudinary.com/dhouh9idx/image/upload/v1792946358/book_summary_video_zbs4em.png',
    slug: '/dashboard/book-summary',
    badgeLabel: '16:9 Summary Cards',
  },
  {
    id: 'youtube-subtitles',
    title: 'YouTube Subtitles (16:9)',
    aspect: '16:9',
    imageUrl: 'https://res.cloudinary.com/dhouh9idx/image/upload/v1792946360/youtube_subtitles_generator_who62l.png',
    slug: '/dashboard/youtube-subtitles',
    badgeLabel: '16:9 Subtitle Strips',
  },
  {
    id: 'image-to-video',
    title: 'Image to Video AI (16:9)',
    aspect: '16:9',
    imageUrl: 'https://res.cloudinary.com/dhouh9idx/image/upload/v1792946349/imagetovideoai_w3hyci.jpg',
    slug: '/dashboard/image-to-video-ai',
    badgeLabel: '16:9 3D Parallax',
  },
  {
    id: 'compare-explainer',
    title: 'Compare Explainer (9:16)',
    aspect: '9:16',
    imageUrl: 'https://res.cloudinary.com/dhouh9idx/image/upload/v1792946197/file_0000000035a48208ab4068beb2a66a7d_kctvo9.png',
    slug: '/dashboard/compare-explainer',
    badgeLabel: '9:16 VS Breakdown',
  },
  {
    id: 'long-video-clips',
    title: 'Viral Video Clips (9:16)',
    aspect: '9:16',
    imageUrl: 'https://res.cloudinary.com/dhouh9idx/image/upload/v1792946357/viral_video_clips_rllgec.png',
    slug: '/dashboard/long-video-clips',
    badgeLabel: '9:16 AI Hook Cutter',
  },
  {
    id: 'split-screen-explainer',
    title: 'Split Screen Explainer (9:16)',
    aspect: '9:16',
    imageUrl: 'https://res.cloudinary.com/dhouh9idx/image/upload/v1792945581/file_0000000039948211a5955d513e5d104a_wzrget.png',
    slug: '/dashboard/split-screen-explainer',
    badgeLabel: '9:16 Creator Split',
  },
  {
    id: 'long-video-promo',
    title: 'Long Video Promo (9:16)',
    aspect: '9:16',
    imageUrl: 'https://res.cloudinary.com/dhouh9idx/image/upload/v1792946358/longvideopromo_o0qheb.png',
    slug: '/dashboard/long-video-promo',
    badgeLabel: '9:16 YouTube Teaser',
  },
  {
    id: 'ai-video-polisher',
    title: 'AI YouTube Video Polisher (16:9)',
    aspect: '16:9',
    imageUrl: 'https://res.cloudinary.com/dhouh9idx/image/upload/v1793737269/Movies_Money_and_Big_Growth_ucpt53.png',
    slug: '/dashboard/ai-video-polisher',
    badgeLabel: '16:9 Auto Editor',
  },
  {
    id: 'ai-shorts-polisher',
    title: 'AI Shorts Polisher (9:16)',
    aspect: '9:16',
    imageUrl: 'https://res.cloudinary.com/dhouh9idx/image/upload/v1793737273/Enthusiastic_Creator_Explaining_Ideas_nvg1do.png',
    slug: '/dashboard/ai-shorts-polisher',
    badgeLabel: '9:16 Reels Co-Pilot',
  },
];

export default function PlatformMarqueeTicker() {
  // Duplicate array once for seamless -50% CSS infinite translation
  const marqueeItems = [...STUDIO_SHOWCASE_ITEMS, ...STUDIO_SHOWCASE_ITEMS];

  return (
    <section aria-label="Video Studios Showcase Ribbon" className="relative w-full overflow-hidden bg-[#FAFAFD] py-6 sm:py-10 border-b border-slate-200/60">
      {/* Edge Gradient Masks for Smooth Seamless Fade */}
      <div className="pointer-events-none absolute left-0 top-0 z-20 h-full w-12 sm:w-36 bg-gradient-to-r from-[#FAFAFD] via-[#FAFAFD]/85 to-transparent" />
      <div className="pointer-events-none absolute right-0 top-0 z-20 h-full w-12 sm:w-36 bg-gradient-to-l from-[#FAFAFD] via-[#FAFAFD]/85 to-transparent" />

      {/* Infinite Moving Marquee Track */}
      <div className="flex w-max animate-m3-marquee gap-4 sm:gap-6 px-4 select-none items-center">
        {marqueeItems.map((item, idx) => {
          const is169 = item.aspect === '16:9';
          return (
            <Link
              key={`${item.id}-${idx}`}
              href={item.slug}
              aria-label={item.title}
              className={`group relative shrink-0 overflow-hidden rounded-2xl sm:rounded-3xl shadow-sm hover:shadow-[0_20px_45px_-12px_rgba(249,115,22,0.35)] hover:-translate-y-1.5 transition-all duration-300 cursor-pointer block bg-slate-950 border border-slate-800/80 hover:border-orange-500/60 ${is169
                  ? 'h-[280px] sm:h-[340px] md:h-[380px] aspect-[16/9]'
                  : 'h-[280px] sm:h-[340px] md:h-[380px] aspect-[9/16]'
                }`}
            >
              {/* Pure Studio Image Showcase: 16:9 in full 16:9, 9:16 in full 9:16 */}
              <div className="relative h-full w-full overflow-hidden bg-slate-950 flex items-center justify-center">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={getOptimizedCloudinaryUrl(item.imageUrl, is169 ? 900 : 540)}
                  alt={item.title}
                  loading="lazy"
                  decoding="async"
                  className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                  onError={(e) => {
                    const fallback = is169
                      ? 'https://res.cloudinary.com/dhouh9idx/image/upload/v1792945592/file_000000004290821180a71f25ad75480e_nztpwe.png'
                      : 'https://res.cloudinary.com/dhouh9idx/image/upload/v1792945593/file_00000000806482119547c1b937b7e386_zsrmkb.png';
                    (e.target as HTMLImageElement).src = getOptimizedCloudinaryUrl(fallback, is169 ? 900 : 540);
                  }}
                />

                {/* Subtle dark bottom gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-85 group-hover:opacity-40 transition-opacity pointer-events-none" />

                {/* Top Badge: Format & Label */}
                <div className="absolute top-2.5 left-2.5 sm:top-3 sm:left-3 z-10 flex items-center gap-1.5 pointer-events-none">
                  <span className="px-2.5 py-0.5 rounded-full bg-black/80 text-[10px] font-mono font-bold text-white border border-white/20 backdrop-blur-md shadow-xs">
                    {item.aspect}
                  </span>
                  {item.badgeLabel && (
                    <span className="hidden sm:inline-block px-2.5 py-0.5 rounded-full bg-orange-600/90 text-[10px] font-bold text-white backdrop-blur-md shadow-xs border border-orange-400/30">
                      {item.badgeLabel}
                    </span>
                  )}
                </div>

                {/* Bottom Title Bar */}
                <div className="absolute bottom-2.5 inset-x-2.5 sm:bottom-3 sm:inset-x-3 z-10 pointer-events-none">
                  <span className="block text-xs sm:text-sm font-bold text-white truncate drop-shadow-md group-hover:text-orange-300 transition-colors">
                    {item.title}
                  </span>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
