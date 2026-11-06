'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowUpRight, Sparkles } from 'lucide-react';

export interface StudioShowcaseItem {
  id: string;
  title: string;
  category: string;
  aspect: '16:9' | '9:16';
  badge: string;
  isFree?: boolean;
  imageUrl: string;
  slug: string;
}

const STUDIO_SHOWCASE_ITEMS: StudioShowcaseItem[] = [
  {
    id: 'faceless-video',
    title: 'Faceless Video',
    category: '16:9 Cinema YouTube',
    aspect: '16:9',
    badge: 'AI B-Roll & Visuals',
    imageUrl: 'https://res.cloudinary.com/dhouh9idx/image/upload/f_auto,q_auto:eco,w_500/v1792945593/file_00000000806482119547c1b937b7e386_zsrmkb.png',
    slug: '/dashboard/faceless-video',
  },
  {
    id: 'auto-caption',
    title: 'Auto Caption Generator',
    category: '9:16 Viral Shorts',
    aspect: '9:16',
    badge: 'FREE • 5 Daily',
    isFree: true,
    imageUrl: 'https://res.cloudinary.com/dhouh9idx/image/upload/f_auto,q_auto:eco,w_500/v1792945595/file_00000000df688211bc2231047185512d_ifk1xc.png',
    slug: '/dashboard/auto-caption',
  },
  {
    id: 'whiteboard-video',
    title: 'Whiteboard Explainer',
    category: '9:16 Shorts',
    aspect: '9:16',
    badge: 'Hand-Drawn Doodle',
    imageUrl: 'https://res.cloudinary.com/dhouh9idx/image/upload/f_auto,q_auto:eco,w_500/v1792950977/file_00000000a8388211b1207dad39960dc7_ahvk9g.png',
    slug: '/dashboard/whiteboard-video',
  },
  {
    id: 'compare-explainer',
    title: 'Compare Explainer',
    category: '9:16 Shorts',
    aspect: '9:16',
    badge: 'Versus Battle',
    imageUrl: 'https://res.cloudinary.com/dhouh9idx/image/upload/f_auto,q_auto:eco,w_500/v1792946197/file_0000000035a48208ab4068beb2a66a7d_kctvo9.png',
    slug: '/dashboard/compare-explainer',
  },
  {
    id: 'book-summary',
    title: 'Book Summary Video',
    category: '16:9 Cinema YouTube',
    aspect: '16:9',
    badge: 'Cinematic Chapters',
    imageUrl: 'https://res.cloudinary.com/dhouh9idx/image/upload/f_auto,q_auto:eco,w_500/v1792946359/book_summary_video_cldhsu.png',
    slug: '/dashboard/book-summary',
  },
  {
    id: 'youtube-subtitles',
    title: 'YouTube Subtitles',
    category: '16:9 YouTube Widescreen',
    aspect: '16:9',
    badge: 'FREE • 5 Daily',
    isFree: true,
    imageUrl: 'https://res.cloudinary.com/dhouh9idx/image/upload/f_auto,q_auto:eco,w_500/v1792946360/youtube_subtitles_generator_who62l.png',
    slug: '/dashboard/youtube-subtitles',
  },
  {
    id: 'image-to-video',
    title: 'Image to Video AI',
    category: '16:9 Cinema YouTube',
    aspect: '16:9',
    badge: 'Parallax Motion',
    imageUrl: 'https://res.cloudinary.com/dhouh9idx/image/upload/f_auto,q_auto:eco,w_500/v1792946358/image_to_video_ai_tq4puk.png',
    slug: '/dashboard/image-to-video',
  },
  {
    id: 'long-video-clips',
    title: 'Viral Video Clips',
    category: '9:16 Shorts',
    aspect: '9:16',
    badge: 'AI Hook Detector',
    imageUrl: 'https://res.cloudinary.com/dhouh9idx/image/upload/f_auto,q_auto:eco,w_500/v1792946357/viral_video_clips_rllgec.png',
    slug: '/dashboard/long-video-clips',
  },
  {
    id: 'split-screen-explainer',
    title: 'Split Screen Explainer',
    category: '9:16 Shorts',
    aspect: '9:16',
    badge: '50/50 Dual Zone',
    imageUrl: 'https://res.cloudinary.com/dhouh9idx/image/upload/f_auto,q_auto:eco,w_500/v1792954752/splitscreen_card_g3jpxl.png',
    slug: '/dashboard/split-screen-explainer',
  },
  {
    id: 'long-video-promo',
    title: 'Long Video Promo',
    category: '9:16 Shorts',
    aspect: '9:16',
    badge: 'Teaser Reel',
    imageUrl: 'https://res.cloudinary.com/dhouh9idx/image/upload/f_auto,q_auto:eco,w_500/v1792946358/longvideopromo_o0qheb.png',
    slug: '/dashboard/long-video-promo',
  },
];

export default function PlatformMarqueeTicker() {
  // Duplicate array once for seamless -50% CSS infinite translation
  const marqueeItems = [...STUDIO_SHOWCASE_ITEMS, ...STUDIO_SHOWCASE_ITEMS];

  return (
    <section aria-label="Video Studios Showcase Ribbon" className="relative w-full overflow-hidden bg-white py-6 sm:py-8 border-b border-slate-100">
      {/* Subtle Top Label */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 mb-3 text-center">
        <p className="text-[11px] sm:text-xs font-black uppercase tracking-wider text-slate-500 flex items-center justify-center gap-1.5">
          <Sparkles size={13} className="text-[#FF5722]" />
          <span>Explore All 14 Purpose-Built Video Studios</span>
        </p>
      </div>

      {/* Edge Gradient Masks for Smooth Seamless Fade */}
      <div className="pointer-events-none absolute left-0 top-0 z-20 h-full w-12 sm:w-32 bg-gradient-to-r from-white via-white/80 to-transparent" />
      <div className="pointer-events-none absolute right-0 top-0 z-20 h-full w-12 sm:w-32 bg-gradient-to-l from-white via-white/80 to-transparent" />

      {/* Infinite Moving Marquee Track */}
      <div className="flex w-max animate-m3-marquee gap-3.5 sm:gap-4.5 px-4 select-none">
        {marqueeItems.map((item, idx) => (
          <Link
            key={`${item.id}-${idx}`}
            href={item.slug}
            className="group relative w-[230px] sm:w-[260px] shrink-0 rounded-2xl border border-slate-200/90 bg-white p-2.5 shadow-xs hover:shadow-lg hover:border-[#FF5722]/50 hover:-translate-y-1 transition-all duration-300 cursor-pointer block"
          >
            {/* Studio Thumbnail Container */}
            <div className="relative aspect-[16/10] w-full overflow-hidden rounded-xl bg-slate-950">
              <Image
                src={item.imageUrl}
                alt={item.title}
                width={500}
                height={312}
                loading="lazy"
                className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
              />

              {/* Floating Format Pill */}
              <div className="absolute top-2 left-2 z-10">
                <span className="rounded-md bg-black/75 backdrop-blur-md px-2 py-0.5 text-[10px] font-mono font-bold text-white border border-white/10 shadow-xs">
                  {item.aspect}
                </span>
              </div>

              {/* Floating Benefit / Free Badge */}
              <div className="absolute top-2 right-2 z-10">
                <span
                  className={`rounded-md px-2 py-0.5 text-[10px] font-bold shadow-xs ${
                    item.isFree
                      ? 'bg-emerald-500 text-white font-black'
                      : 'bg-black/75 backdrop-blur-md text-amber-300 border border-white/10'
                  }`}
                >
                  {item.badge}
                </span>
              </div>
            </div>

            {/* Studio Card Meta */}
            <div className="mt-2.5 flex items-center justify-between gap-1.5 px-0.5">
              <div className="min-w-0">
                <h3 className="text-xs font-black text-slate-900 group-hover:text-[#FF5722] transition-colors truncate font-jakarta">
                  {item.title}
                </h3>
                <p className="text-[10px] text-slate-500 font-medium truncate mt-0.5">
                  {item.category}
                </p>
              </div>

              <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-500 group-hover:bg-[#FF5722] group-hover:text-white transition-all">
                <ArrowUpRight size={13} strokeWidth={2.5} />
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
