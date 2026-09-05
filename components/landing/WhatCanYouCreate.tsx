'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { 
  Sparkles, 
  ArrowRight, 
  Video, 
  Music, 
  Columns, 
  MonitorPlay, 
  PenTool, 
  FileText, 
  Layers, 
  Scissors,
  CheckCircle2,
  Tv,
  Smartphone
} from 'lucide-react';

export interface WorkflowTemplate {
  id: string;
  name: string;
  category: 'vertical' | 'widescreen' | 'audio';
  categoryLabel: string;
  description: string;
  inputs: string;
  aspectRatio: '9:16' | '16:9' | 'Audio';
  aspectRatioBadge: string;
  imageSrc: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  href: string;
  popular?: boolean;
}

const ACTIVE_TEMPLATES: WorkflowTemplate[] = [
  {
    id: 'ai-video-generator',
    name: 'AI Video Generator',
    category: 'widescreen',
    categoryLabel: 'YouTube & Long-form',
    description: 'Turn voiceovers, videos, or scripts into fully produced 16:9 YouTube videos with AI B-roll, music, motion graphics & captions.',
    inputs: 'Voiceover / Video / Script',
    aspectRatio: '16:9',
    aspectRatioBadge: '16:9 Widescreen',
    imageSrc: 'https://res.cloudinary.com/dhouh9idx/image/upload/v1788190063/file_0000000089c48211b67c16fe3c2636a2_prirg0.png',
    icon: MonitorPlay,
    href: '/dashboard?videoType=ai-video-generator',
    popular: true,
  },
  {
    id: 'auto-caption-generator',
    name: 'Auto Caption Generator',
    category: 'vertical',
    categoryLabel: 'Reels & Shorts',
    description: 'Generate viral Instagram Reels, YouTube Shorts, and TikToks with sub-second accurate animated kinetic captions.',
    inputs: 'Talking Video (.mp4 / .mov)',
    aspectRatio: '9:16',
    aspectRatioBadge: '9:16 & 16:9',
    imageSrc: 'https://res.cloudinary.com/dhouh9idx/image/upload/v1788190064/file_000000005540821181b6095da390b68b_qumuqg.png',
    icon: Video,
    href: '/dashboard?videoType=auto-caption-generator',
    popular: true,
  },
  {
    id: 'compare-explainer',
    name: 'Compare Explainer Video',
    category: 'vertical',
    categoryLabel: 'Reels & Shorts',
    description: 'Left vs Right side-by-side comparison reel with animated presenter, voiceover subtitle sync, and winner highlight.',
    inputs: 'Audio + 2 Images',
    aspectRatio: '9:16',
    aspectRatioBadge: '9:16 Reel',
    imageSrc: 'https://res.cloudinary.com/dhouh9idx/image/upload/v1788093814/teacher-welcome_ouesss.png',
    icon: Columns,
    href: '/dashboard?videoType=compare-explainer',
  },
  {
    id: 'long-video-clips',
    name: 'Long Video Clips',
    category: 'vertical',
    categoryLabel: 'Reels & Shorts',
    description: 'Turn long YouTube podcasts and webinars into bite-sized viral shorts with automatic highlight detection and captions.',
    inputs: 'Long-form Video (.mp4)',
    aspectRatio: '9:16',
    aspectRatioBadge: '9:16 Short',
    imageSrc: 'https://res.cloudinary.com/dhouh9idx/image/upload/v1788190063/file_000000002af082088dc89d221c90dc80_tmf4h8.png',
    icon: Scissors,
    href: '/dashboard?videoType=long-video-clips',
  },
  {
    id: 'ai-audio-cleaner',
    name: 'AI Audio Cleaner',
    category: 'audio',
    categoryLabel: 'Audio Studio',
    description: 'Upload audio or podcasts. AI cleans filler words, silences, and background noise to output studio-grade audio.',
    inputs: 'Audio Recording (.mp3 / .wav)',
    aspectRatio: 'Audio',
    aspectRatioBadge: 'Audio Tool',
    imageSrc: 'https://res.cloudinary.com/dhouh9idx/image/upload/v1788190064/file_0000000084e482119c5951ac67c32219_lncnaa.png',
    icon: Music,
    href: '/tools/ai-audio-cleaner',
  },
  {
    id: 'whiteboard-video',
    name: 'Whiteboard Video',
    category: 'vertical',
    categoryLabel: 'Reels & Shorts',
    description: 'AI writes structured key points on a corporate board synced in real-time to your speech cadence.',
    inputs: 'Audio Voiceover or Video',
    aspectRatio: '9:16',
    aspectRatioBadge: '9:16 Reel',
    imageSrc: 'https://res.cloudinary.com/dhouh9idx/image/upload/v1788190745/file_000000003c2882118520991dc7d2d827_alfyoc.png',
    icon: PenTool,
    href: '/dashboard?videoType=whiteboard-video',
  },
  {
    id: 'typography-video',
    name: 'Typography Video',
    category: 'vertical',
    categoryLabel: 'Reels & Shorts',
    description: 'Big, high-energy kinetic text animations synced dynamically to important keywords in your speech.',
    inputs: 'Talking Video (.mp4)',
    aspectRatio: '9:16',
    aspectRatioBadge: '9:16 Reel',
    imageSrc: 'https://res.cloudinary.com/dhouh9idx/image/upload/v1788094218/Typography_Video_sitlxz.png',
    icon: FileText,
    href: '/dashboard?videoType=typography-video',
  },
  {
    id: 'multi-images-video',
    name: 'Multi Images Video',
    category: 'vertical',
    categoryLabel: 'Reels & Shorts',
    description: 'Combine video footage, titles, and dynamic slideshow visuals for breaking news, stories, and facts.',
    inputs: 'Video + Multiple Images',
    aspectRatio: '9:16',
    aspectRatioBadge: '9:16 Reel',
    imageSrc: 'https://res.cloudinary.com/dhouh9idx/image/upload/v1788202087/file_00000000ce648211b220fc406885b264_k6snxz.png',
    icon: Layers,
    href: '/dashboard?videoType=multi-images-video',
  },
  {
    id: 'long-video-promo',
    name: 'Long Video Promo',
    category: 'vertical',
    categoryLabel: 'Reels & Shorts',
    description: 'Promote your widescreen YouTube video on Instagram and Shorts with an animated thumbnail card and teaser hook.',
    inputs: '16:9 Clip + Thumbnail Image',
    aspectRatio: '9:16',
    aspectRatioBadge: '9:16 Promo Reel',
    imageSrc: 'https://res.cloudinary.com/dhouh9idx/image/upload/v1788190063/file_000000002d508209b398a35503a053e1_uiytox.png',
    icon: Tv,
    href: '/dashboard?videoType=long-video-promo',
  },
];

const CATEGORIES = [
  { id: 'all', label: 'All Workflows', icon: Sparkles },
  { id: 'vertical', label: 'Shorts & Reels (9:16)', icon: Smartphone },
  { id: 'widescreen', label: 'YouTube & Widescreen (16:9)', icon: Tv },
  { id: 'audio', label: 'Audio Tools', icon: Music },
] as const;

export default function WhatCanYouCreate() {
  const [activeCategory, setActiveCategory] = useState<string>('all');

  const filteredTemplates = activeCategory === 'all'
    ? ACTIVE_TEMPLATES
    : ACTIVE_TEMPLATES.filter((t) => t.category === activeCategory);

  return (
    <section id="video-types" className="relative px-4 py-16 sm:px-6 sm:py-24 bg-white border-b border-slate-200">
      <div className="relative z-10 mx-auto max-w-7xl">
        
        {/* Header — Clean, Evergreen, No Hardcoded Numbers */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-14">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-amber-200 bg-amber-50/80 px-4 py-1 text-xs font-bold uppercase tracking-wider text-amber-800 shadow-2xs mb-3">
            <Sparkles size={14} className="text-amber-500" />
            <span>AI Video Creation Workflows</span>
          </div>
          <h2 className="text-3xl font-black text-slate-900 sm:text-5xl font-sans tracking-tight">
            AI Video Maker &amp; <span className="bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 bg-clip-text text-transparent">Generator Workflows</span>
          </h2>
          <p className="mt-3 text-sm sm:text-base text-slate-600 font-normal max-w-2xl mx-auto">
            Turn speech, video clips, and scripts into publish-ready content. Choose an AI workflow below to create vertical reels, widescreen videos, or clean studio audio.
          </p>

          {/* Quick Category Filter Bar */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-2">
            {CATEGORIES.map((cat) => {
              const Icon = cat.icon;
              const isActive = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-md shadow-orange-500/20 scale-[1.02]'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200/80 border border-slate-200/60'
                  }`}
                >
                  <Icon size={15} className={isActive ? 'text-white' : 'text-slate-500'} />
                  <span>{cat.label}</span>
                  <span className={`rounded-full px-1.5 py-0.2 text-[10px] ${
                    isActive ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-600'
                  }`}>
                    {cat.id === 'all' ? ACTIVE_TEMPLATES.length : ACTIVE_TEMPLATES.filter((t) => t.category === cat.id).length}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* =========================================================================
            MOBILE VIEW: Fast-to-Scan, Ultra-Intuitive Cards (Hidden on md and up)
            ========================================================================= */}
        <div className="grid grid-cols-1 gap-5 md:hidden">
          {filteredTemplates.map((template) => {
            const Icon = template.icon;
            return (
              <div
                key={`mobile-${template.id}`}
                className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:border-amber-300 hover:shadow-md"
              >
                {/* Visual Thumbnail Banner */}
                <div className={`relative overflow-hidden rounded-xl border border-slate-100 bg-slate-900 mb-3.5 ${
                  template.aspectRatio === '16:9' ? 'aspect-video w-full' : template.aspectRatio === 'Audio' ? 'h-36 w-full' : 'aspect-[16/10] w-full'
                }`}>
                  <Image
                    src={template.imageSrc}
                    alt={template.name}
                    fill
                    className="object-cover object-top transition duration-300 group-hover:scale-105"
                    sizes="100vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                  
                  {/* Aspect Ratio Badge */}
                  <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5 rounded-md bg-black/80 backdrop-blur-xs px-2.5 py-1 text-[10px] font-bold text-white border border-white/20">
                    <Icon size={12} className="text-amber-400" />
                    <span>{template.aspectRatioBadge}</span>
                  </div>

                  {template.popular && (
                    <div className="absolute top-2.5 right-2.5 rounded-md bg-gradient-to-r from-amber-500 to-orange-500 px-2 py-0.5 text-[10px] font-extrabold text-white shadow-xs">
                      POPULAR
                    </div>
                  )}

                  {/* Input Requirement Overlay on Image Bottom */}
                  <div className="absolute bottom-2 left-2 right-2 flex items-center gap-1.5 rounded-lg bg-black/75 backdrop-blur-xs px-2.5 py-1.5 text-[11px] text-slate-200 border border-white/10">
                    <span className="font-bold text-amber-300">Input:</span>
                    <span className="truncate font-medium text-white">{template.inputs}</span>
                  </div>
                </div>

                {/* Card Body */}
                <div className="space-y-2">
                  <h3 className="text-lg font-bold text-slate-900 font-sans tracking-tight">
                    {template.name}
                  </h3>

                  <p className="text-xs text-slate-600 leading-relaxed line-clamp-2">
                    {template.description}
                  </p>

                  <Link
                    href={template.href}
                    className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 py-3 text-xs font-bold text-white shadow-xs transition active:scale-98 hover:bg-gradient-to-r hover:from-amber-500 hover:to-orange-500"
                  >
                    <span>Create {template.name}</span>
                    <ArrowRight size={14} />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        {/* =========================================================================
            DESKTOP & TABLET VIEW: High-Impact Structured Showcase (Hidden on mobile)
            ========================================================================= */}
        <div className="hidden md:block space-y-16 lg:space-y-20">
          {filteredTemplates.map((template, index) => {
            const isReversed = index % 2 !== 0;
            const Icon = template.icon;
            return (
              <div 
                key={`desktop-${template.id}`} 
                className={`flex flex-col gap-8 lg:gap-14 lg:items-center ${isReversed ? "lg:flex-row-reverse" : "lg:flex-row"}`}
              >
                {/* Visual / Image Showcase */}
                <div className="w-full lg:w-1/2 shrink-0">
                  <div className={`group relative overflow-hidden rounded-2xl border border-slate-200 bg-slate-900 shadow-sm transition hover:shadow-lg ${
                    template.aspectRatio === "16:9" 
                      ? "aspect-video w-full" 
                      : template.aspectRatio === "Audio"
                        ? "aspect-video w-full max-w-[420px] mx-auto"
                        : "aspect-[9/16] w-full max-w-[280px] lg:max-w-[320px] mx-auto"
                  }`}>
                    <Image
                      src={template.imageSrc}
                      alt={template.name}
                      fill
                      className="object-cover object-top transition duration-500 group-hover:scale-102"
                      sizes="(max-width: 1024px) 100vw, 50vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition duration-300" />
                  </div>
                </div>

                {/* Text & Action Column */}
                <div className="w-full lg:w-1/2 flex flex-col justify-center">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-slate-100 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-slate-700">
                      <Icon size={14} className="text-amber-600" />
                      <span>{template.aspectRatioBadge}</span>
                    </div>
                    {template.popular && (
                      <span className="rounded-full bg-amber-100 text-amber-800 border border-amber-200 px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider">
                        ★ POPULAR
                      </span>
                    )}
                  </div>
                  
                  <h3 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight mb-3 font-sans">
                    {template.name}
                  </h3>
                  
                  <p className="text-sm sm:text-base text-slate-600 mb-6 leading-relaxed font-normal">
                    {template.description}
                  </p>
                  
                  {/* Required Input Box */}
                  <div className="rounded-xl border border-slate-200 bg-slate-50/80 p-4 mb-6 w-full max-w-md">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-1">
                      Required Input To Render
                    </p>
                    <p className="text-xs sm:text-sm font-bold text-slate-800 flex items-center gap-1.5">
                      <CheckCircle2 size={14} className="text-amber-600 shrink-0" />
                      <span>{template.inputs}</span>
                    </p>
                  </div>
                  
                  <Link 
                    href={template.href}
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 px-7 py-3.5 text-sm font-bold text-white shadow-md shadow-orange-500/20 transition-all hover:from-amber-600 hover:to-orange-700 hover:scale-[1.02] active:scale-100 w-fit"
                  >
                    <span>Try {template.name}</span>
                    <ArrowRight size={16} />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}






