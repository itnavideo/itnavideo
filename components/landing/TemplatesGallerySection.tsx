'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Sparkles, ArrowRight } from 'lucide-react';

type TemplateItem = {
  id: string;
  title: string;
  category: 'Social' | 'YouTube' | 'Education' | 'Business' | 'Product';
  image: string;
  aspect: string;
  badge: string;
  href: string;
};

const TEMPLATE_GALLERY: TemplateItem[] = [
  {
    id: 't-1',
    title: 'Auto Caption Generator',
    category: 'Social',
    image: 'https://res.cloudinary.com/dhouh9idx/image/upload/v1788190064/file_000000005540821181b6095da390b68b_qumuqg.png',
    aspect: '9:16',
    badge: 'Reels / Shorts',
    href: '/dashboard?videoType=auto-caption-generator',
  },
  {
    id: 't-2',
    title: 'Compare Explainer',
    category: 'Education',
    image: '/preview/Compare Explainer.png',
    aspect: '9:16',
    badge: 'Explainer',
    href: '/dashboard?videoType=compare-explainer',
  },
  {
    id: 't-3',
    title: 'Whiteboard Video',
    category: 'Business',
    image: 'https://res.cloudinary.com/dhouh9idx/image/upload/v1788190745/file_000000003c2882118520991dc7d2d827_alfyoc.png',
    aspect: '9:16',
    badge: 'Corporate',
    href: '/dashboard?videoType=whiteboard-video',
  },
  {
    id: 't-4',
    title: 'Typography Video',
    category: 'Social',
    image: 'https://res.cloudinary.com/dhouh9idx/image/upload/v1788094218/Typography_Video_sitlxz.png',
    aspect: '9:16',
    badge: 'Kinetic',
    href: '/dashboard?videoType=typography-video',
  },
  {
    id: 't-5',
    title: 'Long Video Promo',
    category: 'YouTube',
    image: 'https://res.cloudinary.com/dhouh9idx/image/upload/v1788190063/file_000000002d508209b398a35503a053e1_uiytox.png',
    aspect: '9:16',
    badge: 'YouTube Teaser',
    href: '/dashboard?videoType=long-video-promo',
  },
  {
    id: 't-6',
    title: 'Multi Images Video',
    category: 'Product',
    image: '/preview/Multi Images Video.png',
    aspect: '9:16',
    badge: 'Product Story',
    href: '/dashboard?videoType=multi-images-video',
  },
  {
    id: 't-7',
    title: 'Long Caption Pro',
    category: 'YouTube',
    image: '/visuals/previews/long-caption-pro.png',
    aspect: '16:9',
    badge: '10 Min Widescreen',
    href: '/dashboard?videoType=long-caption-pro',
  },
  {
    id: 't-8',
    title: 'Long Video Clips',
    category: 'YouTube',
    image: 'https://res.cloudinary.com/dhouh9idx/image/upload/v1788190063/file_000000002af082088dc89d221c90dc80_tmf4h8.png',
    aspect: '9:16',
    badge: 'Viral Highlights',
    href: '/dashboard?videoType=long-video-clips',
  },
  {
    id: 't-9',
    title: 'AI Video Generator',
    category: 'YouTube',
    image: 'https://res.cloudinary.com/dhouh9idx/image/upload/v1788190063/file_0000000089c48211b67c16fe3c2636a2_prirg0.png',
    aspect: '16:9',
    badge: 'Long YT Videos',
    href: '/dashboard?videoType=ai-video-generator',
  },
  {
    id: 't-10',
    title: 'AI Audio Cleaner',
    category: 'YouTube',
    image: 'https://res.cloudinary.com/dhouh9idx/image/upload/v1788190064/file_0000000084e482119c5951ac67c32219_lncnaa.png',
    aspect: '16:9',
    badge: 'Script & Audio Polish',
    href: '/dashboard?videoType=ai-audio-cleaner',
  },
];

export default function TemplatesGallerySection() {
  const [activeCategory, setActiveCategory] = useState<string>('All');

  const filtered = TEMPLATE_GALLERY.filter((t) => {
    if (activeCategory === 'All') return true;
    return t.category === activeCategory;
  });

  return (
    <section className="relative px-4 py-20 sm:px-6 sm:py-28 bg-white border-b border-slate-200">
      <div className="relative z-10 mx-auto max-w-7xl">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <p className="text-xs font-bold uppercase tracking-widest text-amber-600 mb-2 flex items-center justify-center gap-1.5">
            <Sparkles size={14} />
            <span>Best AI Video Generators &amp; Presets</span>
          </p>
          <h2 className="text-3xl font-extrabold text-slate-900 sm:text-5xl font-sans tracking-tight">
            AI Video Maker &amp; <span className="bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 bg-clip-text text-transparent">Creator Templates</span>
          </h2>
          <p className="mt-4 text-sm sm:text-base text-slate-600">
            Choose from the best AI video generators optimized for social reels, text to video conversion, YouTube promos, and high-retention explainers.
          </p>

          {/* Category Tabs */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-2">
            {['All', 'Social', 'YouTube', 'Education', 'Business', 'Product'].map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`rounded-full px-4 py-2 text-xs font-bold transition duration-150 ${
                  activeCategory === cat
                    ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Video Types Grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {filtered.map((item) => (
            <div
              key={item.id}
              className="group relative flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xs transition duration-200 hover:border-amber-300 hover:shadow-md"
            >
              <div className="relative aspect-[16/10] w-full overflow-hidden bg-muted">
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />

                <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between">
                  <span className="rounded-md bg-white/90 backdrop-blur-md px-2 py-0.5 text-[10px] font-bold text-slate-800 shadow-xs">
                    {item.aspect}
                  </span>
                  <span className="rounded-md bg-gradient-to-r from-amber-500 to-orange-500 px-2 py-0.5 text-[10px] font-bold text-white shadow-xs">
                    {item.badge}
                  </span>
                </div>
              </div>

              <div className="p-4 flex flex-col flex-1 justify-between">
                <h3 className="text-base font-bold text-slate-900 font-sans">{item.title}</h3>

                <Link
                  href={item.href}
                  className="mt-4 inline-flex items-center justify-between rounded-xl bg-slate-100 hover:bg-gradient-to-r hover:from-amber-500 hover:to-orange-500 px-4 py-2 text-xs font-bold text-slate-700 hover:text-white transition duration-150 group/btn"
                >
                  <span>Create Video</span>
                  <ArrowRight size={14} className="transition-transform group-hover/btn:translate-x-1" />
                </Link>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}

