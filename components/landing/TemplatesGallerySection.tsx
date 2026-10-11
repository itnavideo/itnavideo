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
    image: 'https://res.cloudinary.com/dhouh9idx/video/upload/v1789982713/km_20260916-3_1080p_30f_20260916_232040_qtcjtv.jpg',
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
    image: 'https://res.cloudinary.com/dhouh9idx/video/upload/v1789982713/km_20260916-3_1080p_30f_20260916_232040_qtcjtv.jpg',
    aspect: '9:16',
    badge: 'Corporate',
    href: '/dashboard?videoType=whiteboard-video',
  },
  {
    id: 't-4',
    title: 'Kinetic Motion',
    category: 'Social',
    image: 'https://res.cloudinary.com/dhouh9idx/video/upload/v1789982713/km_20260916-3_1080p_30f_20260916_232040_qtcjtv.jpg',
    aspect: '9:16',
    badge: 'Kinetic',
    href: '/dashboard?videoType=typography-video',
  },
  {
    id: 't-5',
    title: 'Long Video Promo',
    category: 'YouTube',
    image: 'https://res.cloudinary.com/dhouh9idx/video/upload/v1789982713/km_20260916-3_1080p_30f_20260916_232040_qtcjtv.jpg',
    aspect: '9:16',
    badge: 'YouTube Teaser',
    href: '/dashboard?videoType=long-video-promo',
  },
  {
    id: 't-7',
    title: 'YouTube Subtitle Generator',
    category: 'YouTube',
    image: '/visuals/previews/long-caption-pro.png',
    aspect: '16:9',
    badge: '15 Min Widescreen',
    href: '/dashboard?videoType=youtube-subtitle-generator',
  },
  {
    id: 't-8',
    title: 'Long Video Clips',
    category: 'YouTube',
    image: 'https://res.cloudinary.com/dhouh9idx/video/upload/v1789982713/km_20260916-3_1080p_30f_20260916_232040_qtcjtv.jpg',
    aspect: '9:16',
    badge: 'Viral Highlights',
    href: '/dashboard?videoType=long-video-clips',
  },
  {
    id: 't-9',
    title: 'AI Video Generator',
    category: 'YouTube',
    image: 'https://res.cloudinary.com/dhouh9idx/video/upload/v1789982713/km_20260916-3_1080p_30f_20260916_232040_qtcjtv.jpg',
    aspect: '16:9',
    badge: 'Long YT Videos',
    href: '/dashboard?videoType=ai-video-generator',
  },
  {
    id: 't-10',
    title: 'AI Audio Cleaner',
    category: 'YouTube',
    image: 'https://res.cloudinary.com/dhouh9idx/video/upload/v1789982713/km_20260916-3_1080p_30f_20260916_232040_qtcjtv.jpg',
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
    <section className="relative px-4 py-20 sm:px-6 sm:py-28 bg-[#070B14] border-b border-white/10 text-white">
      <div className="relative z-10 mx-auto max-w-7xl">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <p className="text-xs font-bold uppercase tracking-widest text-purple-300 mb-2 flex items-center justify-center gap-1.5">
            <Sparkles size={14} className="text-purple-400" />
            <span>Best AI Video Generators &amp; Presets</span>
          </p>
          <h2 className="text-3xl font-extrabold text-white sm:text-5xl font-sans tracking-tight">
            AI Video Maker &amp; <span className="bg-gradient-to-r from-purple-400 via-fuchsia-400 to-pink-400 bg-clip-text text-transparent">Creator Templates</span>
          </h2>
          <p className="mt-4 text-sm sm:text-base text-zinc-400">
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
                    ? 'bg-gradient-to-r from-purple-600 via-fuchsia-500 to-pink-500 text-white shadow-lg shadow-purple-500/20'
                    : 'bg-[#0E1526] text-zinc-400 hover:bg-[#151E30] hover:text-white border border-white/10'
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
              className="group relative flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#0E1526] shadow-xl transition duration-200 hover:border-purple-500/50 hover:shadow-2xl hover:shadow-purple-500/10"
            >
              <div className="relative aspect-[16/10] w-full overflow-hidden bg-black">
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105 opacity-90"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0E1526] via-transparent to-transparent" />

                <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between">
                  <span className="rounded-md bg-black/80 backdrop-blur-md px-2 py-0.5 text-[10px] font-bold text-zinc-200 border border-white/10">
                    {item.aspect}
                  </span>
                  <span className="rounded-md bg-gradient-to-r from-purple-600 to-pink-500 px-2 py-0.5 text-[10px] font-bold text-white shadow-xs">
                    {item.badge}
                  </span>
                </div>
              </div>

              <div className="p-4 flex flex-col flex-1 justify-between">
                <h3 className="text-base font-bold text-white font-sans">{item.title}</h3>

                <Link
                  href={item.href}
                  className="mt-4 inline-flex items-center justify-between rounded-xl bg-[#151E30] hover:bg-gradient-to-r hover:from-purple-600 hover:to-pink-500 px-4 py-2 text-xs font-bold text-zinc-300 hover:text-white transition duration-150 group/btn border border-white/10 hover:border-transparent"
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

