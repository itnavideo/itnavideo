'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

export interface StudioShowcaseItem {
  id: string;
  title: string;
  aspect: '16:9' | '9:16';
  imageUrl: string;
  slug: string;
}

const STUDIO_SHOWCASE_ITEMS: StudioShowcaseItem[] = [
  {
    id: 'faceless-video',
    title: 'Faceless Video (16:9)',
    aspect: '16:9',
    imageUrl: 'https://res.cloudinary.com/dhouh9idx/image/upload/f_auto,q_auto:eco,w_900/v1792945593/file_00000000806482119547c1b937b7e386_zsrmkb.png',
    slug: '/dashboard/faceless-video',
  },
  {
    id: 'auto-caption',
    title: 'Auto Caption Generator (9:16)',
    aspect: '9:16',
    imageUrl: 'https://res.cloudinary.com/dhouh9idx/image/upload/f_auto,q_auto:eco,w_600/v1792945595/file_00000000df688211bc2231047185512d_ifk1xc.png',
    slug: '/dashboard/auto-caption',
  },
  {
    id: 'whiteboard-video',
    title: 'Whiteboard Explainer (9:16)',
    aspect: '9:16',
    imageUrl: 'https://res.cloudinary.com/dhouh9idx/image/upload/f_auto,q_auto:eco,w_600/v1792950977/file_00000000a8388211b1207dad39960dc7_ahvk9g.png',
    slug: '/dashboard/whiteboard-video',
  },
  {
    id: 'compare-explainer',
    title: 'Compare Explainer (9:16)',
    aspect: '9:16',
    imageUrl: 'https://res.cloudinary.com/dhouh9idx/image/upload/f_auto,q_auto:eco,w_600/v1792946197/file_0000000035a48208ab4068beb2a66a7d_kctvo9.png',
    slug: '/dashboard/compare-explainer',
  },
  {
    id: 'book-summary',
    title: 'Book Summary Video (16:9)',
    aspect: '16:9',
    imageUrl: 'https://res.cloudinary.com/dhouh9idx/image/upload/f_auto,q_auto:eco,w_900/v1792946358/book_summary_video_zbs4em.png',
    slug: '/dashboard/book-summary',
  },
  {
    id: 'youtube-subtitles',
    title: 'YouTube Subtitles (16:9)',
    aspect: '16:9',
    imageUrl: 'https://res.cloudinary.com/dhouh9idx/image/upload/f_auto,q_auto:eco,w_900/v1792946360/youtube_subtitles_generator_who62l.png',
    slug: '/dashboard/youtube-subtitles',
  },
  {
    id: 'image-to-video',
    title: 'Image to Video AI (16:9)',
    aspect: '16:9',
    imageUrl: 'https://res.cloudinary.com/dhouh9idx/image/upload/f_auto,q_auto:eco,w_900/v1792946358/image_to_video_ai_tq4puk.png',
    slug: '/dashboard/image-to-video',
  },
  {
    id: 'long-video-clips',
    title: 'Viral Video Clips (9:16)',
    aspect: '9:16',
    imageUrl: 'https://res.cloudinary.com/dhouh9idx/image/upload/f_auto,q_auto:eco,w_600/v1792946357/viral_video_clips_rllgec.png',
    slug: '/dashboard/long-video-clips',
  },
  {
    id: 'split-screen-explainer',
    title: 'Split Screen Explainer (9:16)',
    aspect: '9:16',
    imageUrl: 'https://res.cloudinary.com/dhouh9idx/image/upload/f_auto,q_auto:eco,w_600/v1792954752/splitscreen_card_g3jpxl.png',
    slug: '/dashboard/split-screen-explainer',
  },
  {
    id: 'long-video-promo',
    title: 'Long Video Promo (9:16)',
    aspect: '9:16',
    imageUrl: 'https://res.cloudinary.com/dhouh9idx/image/upload/f_auto,q_auto:eco,w_600/v1792945592/file_000000004290821180a71f25ad75480e_nztpwe.png',
    slug: '/dashboard/long-video-promo',
  },
];

export default function PlatformMarqueeTicker() {
  // Duplicate array once for seamless -50% CSS infinite translation
  const marqueeItems = [...STUDIO_SHOWCASE_ITEMS, ...STUDIO_SHOWCASE_ITEMS];

  return (
    <section aria-label="Video Studios Showcase Ribbon" className="relative w-full overflow-hidden bg-white py-6 sm:py-10 border-b border-slate-100">
      {/* Edge Gradient Masks for Smooth Seamless Fade */}
      <div className="pointer-events-none absolute left-0 top-0 z-20 h-full w-12 sm:w-32 bg-gradient-to-r from-white via-white/80 to-transparent" />
      <div className="pointer-events-none absolute right-0 top-0 z-20 h-full w-12 sm:w-32 bg-gradient-to-l from-white via-white/80 to-transparent" />

      {/* Infinite Moving Marquee Track */}
      <div className="flex w-max animate-m3-marquee gap-4 sm:gap-6 px-4 select-none items-center">
        {marqueeItems.map((item, idx) => {
          const is169 = item.aspect === '16:9';
          return (
            <Link
              key={`${item.id}-${idx}`}
              href={item.slug}
              aria-label={item.title}
              className={`group relative shrink-0 overflow-hidden rounded-2xl sm:rounded-3xl shadow-sm hover:shadow-2xl hover:-translate-y-1.5 transition-all duration-300 cursor-pointer block bg-slate-900 border border-slate-200/60 ${
                is169
                  ? 'h-[230px] sm:h-[270px] aspect-[16/9]'
                  : 'h-[230px] sm:h-[270px] aspect-[9/16]'
              }`}
            >
              {/* Pure Studio Image Showcase: 16:9 in full 16:9, 9:16 in full 9:16 (Zero image cropping) */}
              <div className="relative h-full w-full overflow-hidden">
                <Image
                  src={item.imageUrl}
                  alt={item.title}
                  width={is169 ? 900 : 500}
                  height={is169 ? 506 : 888}
                  loading="lazy"
                  className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
