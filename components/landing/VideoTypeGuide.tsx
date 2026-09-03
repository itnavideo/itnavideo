'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  Captions,
  Clapperboard,
  Compass,
  ExternalLink,
  Film,
  GitCompare,
  Images,
  Maximize2,
  Mic,
  Play,
  Presentation,
  Scissors,
  Sparkles,
  Type,
  Wand2,
} from 'lucide-react';

type VideoTypeItem = {
  id: string;
  title: string;
  badge: string;
  aspectRatio: '9:16' | '16:9' | '9:16 & 16:9' | 'Audio';
  category: 'short' | 'long';
  input: string;
  desc: string;
  detailHref: string;
  dashHref: string;
  accent: string;
  icon: any;
  previewGradient: string;
};

const TEMPLATES: VideoTypeItem[] = [
  {
    id: 'auto-caption-generator',
    title: 'Auto Caption Generator',
    badge: 'Most Popular',
    aspectRatio: '9:16 & 16:9',
    category: 'short',
    input: 'Video file',
    desc: 'Clean, word-synced animated subtitles for Instagram Reels and landscape videos with custom positions, sizes, and colors.',
    detailHref: '/video-types/auto-caption-reel',
    dashHref: '/dashboard?videoType=auto-caption-generator',
    accent: '#2563EB',
    icon: Captions,
    previewGradient: 'from-blue-600/20 via-indigo-600/10 to-transparent',
  },
  {
    id: 'compare-explainer',
    title: 'Compare Explainer',
    badge: 'High Conversion',
    aspectRatio: '9:16',
    category: 'short',
    input: 'Audio + 2 Images',
    desc: 'Side-by-side A vs B comparison with voice narration and an animated sticker presenter.',
    detailHref: '/video-types/compare-explainer',
    dashHref: '/dashboard?videoType=compare-explainer',
    accent: '#F59E0B',
    icon: GitCompare,
    previewGradient: 'from-amber-500/20 via-orange-500/10 to-transparent',
  },
  {
    id: 'whiteboard-video',
    title: 'Whiteboard Video',
    badge: 'Educational',
    aspectRatio: '9:16',
    category: 'short',
    input: 'Audio or Video',
    desc: 'AI extracts key insights and writes them live on a corporate whiteboard synced to speech.',
    detailHref: '/video-types/whiteboard-video',
    dashHref: '/dashboard?videoType=whiteboard-video',
    accent: '#10B981',
    icon: Presentation,
    previewGradient: 'from-emerald-500/20 via-teal-500/10 to-transparent',
  },
  {
    id: 'typography-video',
    title: 'Typography Video',
    badge: 'Kinetic Text',
    aspectRatio: '9:16',
    category: 'short',
    input: 'Video file',
    desc: 'Bold, high-impact keywords pop on screen the exact millisecond you speak them.',
    detailHref: '/video-types/typography-video',
    dashHref: '/dashboard?videoType=typography-video',
    accent: '#8B5CF6',
    icon: Wand2,
    previewGradient: 'from-purple-500/20 via-violet-500/10 to-transparent',
  },
  {
    id: 'multi-images-video',
    title: 'Multi Images Video',
    badge: 'Storyteller',
    aspectRatio: '9:16',
    category: 'short',
    input: 'Video + 2-8 Images',
    desc: 'Animated image slideshow synchronized to narration, perfect for news and breakdown reels.',
    detailHref: '/video-types/multi-images-video',
    dashHref: '/dashboard?videoType=multi-images-video',
    accent: '#EC4899',
    icon: Images,
    previewGradient: 'from-pink-500/20 via-rose-500/10 to-transparent',
  },
  {
    id: 'long-video-promo',
    title: 'Long Video Promo',
    badge: 'YouTube Teaser',
    aspectRatio: '9:16',
    category: 'short',
    input: 'Video + Thumbnail',
    desc: 'Turn long-form YouTube videos into vertical teasers with a strong call-to-watch.',
    detailHref: '/video-types/long-video-promo',
    dashHref: '/dashboard?videoType=long-video-promo',
    accent: '#84CC16',
    icon: Film,
    previewGradient: 'from-lime-500/20 via-emerald-500/10 to-transparent',
  },
  {
    id: 'ai-audio-cleaner',
    title: 'AI Audio Cleaner',
    badge: 'Long Audio & Script',
    aspectRatio: '16:9',
    category: 'long',
    input: 'Long audio file',
    desc: 'Upload long audio. AI shows full script preview, cuts mistakes and awkward silences for studio sound.',
    detailHref: '/tools/ai-audio-cleaner',
    dashHref: '/dashboard?videoType=ai-audio-cleaner',
    accent: '#06B6D4',
    icon: Mic,
    previewGradient: 'from-cyan-500/20 via-blue-500/10 to-transparent',
  },
  {
    id: 'long-caption-pro',
    title: 'Long Caption Pro',
    badge: '16:9 Landscape',
    aspectRatio: '16:9',
    category: 'long',
    input: 'Landscape Video (10m)',
    desc: 'Preserve full 16:9 video quality and original audio with precision timed captions.',
    detailHref: '/long-caption-pro',
    dashHref: '/dashboard?videoType=long-caption-pro',
    accent: '#2563EB',
    icon: Maximize2,
    previewGradient: 'from-blue-600/25 via-cyan-600/10 to-transparent',
  },
  {
    id: 'long-video-clips',
    title: 'Long Video Clips',
    badge: 'Shorts Repurpose',
    aspectRatio: '9:16',
    category: 'long',
    input: 'Long Video',
    desc: 'AI picks high-energy moments from podcasts or lectures and renders captioned short clips.',
    detailHref: '/video-types/long-video-clips',
    dashHref: '/dashboard?videoType=long-video-clips',
    accent: '#14B8A6',
    icon: Scissors,
    previewGradient: 'from-teal-500/20 via-emerald-500/10 to-transparent',
  },
  {
    id: 'ai-video-generator',
    title: 'AI Video Generator (Long YT Videos)',
    badge: 'Long-Form AI Studio',
    aspectRatio: '16:9',
    category: 'long',
    input: 'Voiceover / Video / Script',
    desc: 'Turn voiceovers, videos, or scripts into complete videos with AI B-roll, music ducking, and animated subtitles.',
    detailHref: '/video-types/ai-video-generator',
    dashHref: '/dashboard?videoType=ai-video-generator',
    accent: '#38BDF8',
    icon: Film,
    previewGradient: 'from-sky-500/20 via-blue-500/10 to-transparent',
  },
];

export default function VideoTypeGuide() {
  const [activeTab, setActiveTab] = useState<'all' | 'short' | 'long'>('all');

  const filteredTemplates = TEMPLATES.filter((t) => {
    if (activeTab === 'all') return true;
    return t.category === activeTab;
  });

  return (
    <section className="relative overflow-hidden bg-background px-4 py-20 sm:px-6 sm:py-28 md:py-32 border-t border-border">
      {/* Background Glow */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_800px_at_50%_-100px,rgba(37,99,235,0.04),transparent_100%)]" />

      <div className="relative z-10 mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-12 text-center space-y-3 sm:space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/20 bg-cyan-500/[0.06] px-4 py-1.5 text-xs font-bold text-cyan-600 dark:text-cyan-300 backdrop-blur-md">
            <Sparkles size={13} className="text-cyan-500 dark:text-cyan-400" />
            <span>WHAT YOU CAN CREATE</span>
          </div>
          <h2 className="text-3xl font-black leading-tight text-foreground sm:text-4xl md:text-5xl font-sans tracking-tight px-1">
            11 video templates. <span className="text-blue-500">One platform.</span>
          </h2>
          <p className="mx-auto max-w-2xl text-xs sm:text-sm text-muted-foreground leading-relaxed px-2">
            Click any template to explore its dedicated page or start creating immediately with zero editing skills required.
          </p>

          {/* Filter Pills */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-4">
            <button
              onClick={() => setActiveTab('all')}
              className={`rounded-xl border px-4 py-2 text-xs font-bold transition duration-200 ${
                activeTab === 'all'
                  ? 'border-blue-500/40 bg-blue-500/10 text-blue-600 dark:text-blue-400 shadow-sm'
                  : 'border-border bg-card text-muted-foreground hover:bg-accent hover:text-foreground'
              }`}
            >
              All 11 Templates
            </button>
            <button
              onClick={() => setActiveTab('short')}
              className={`rounded-xl border px-4 py-2 text-xs font-bold transition duration-200 ${
                activeTab === 'short'
                  ? 'border-blue-500/40 bg-blue-500/10 text-blue-600 dark:text-blue-400 shadow-sm'
                  : 'border-border bg-card text-muted-foreground hover:bg-accent hover:text-foreground'
              }`}
            >
              Short Reels (9:16)
            </button>
            <button
              onClick={() => setActiveTab('long')}
              className={`rounded-xl border px-4 py-2 text-xs font-bold transition duration-200 ${
                activeTab === 'long'
                  ? 'border-blue-500/40 bg-blue-500/10 text-blue-600 dark:text-blue-400 shadow-sm'
                  : 'border-border bg-card text-muted-foreground hover:bg-accent hover:text-foreground'
              }`}
            >
              Long Form &amp; Tools (16:9 / Audio)
            </button>
          </div>
        </div>

        {/* 11 Template Cards Grid */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredTemplates.map((item) => {
            const IconComponent = item.icon;

            return (
              <div
                key={item.id}
                className="group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-border bg-card p-5 shadow-sm backdrop-blur-md transition duration-300 hover:-translate-y-1 hover:border-slate-400 dark:border-border dark:bg-muted/40 dark:hover:border-border"
              >
                {/* Accent Background Gradient */}
                <div
                  className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${item.previewGradient} opacity-60 transition duration-500 group-hover:opacity-100`}
                />

                <div className="relative z-10 space-y-3.5">
                  {/* Top Bar: Icon + Aspect ratio + Badge */}
                  <div className="flex items-center justify-between gap-2">
                    <div
                      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-border bg-background/80 shadow-sm transition duration-300 group-hover:scale-105"
                      style={{ color: item.accent }}
                    >
                      <IconComponent size={18} />
                    </div>

                    <div className="flex items-center gap-1.5">
                      <span className="rounded-lg bg-secondary/80 px-2 py-0.5 font-mono text-[10px] font-black uppercase tracking-wider text-secondary-foreground border border-border">
                        {item.aspectRatio}
                      </span>
                      <span
                        className="rounded-full px-2.5 py-0.5 text-[9px] font-black uppercase tracking-wider text-white shadow-xs"
                        style={{ backgroundColor: item.accent }}
                      >
                        {item.badge}
                      </span>
                    </div>
                  </div>

                  {/* Title & Input requirement */}
                  <div>
                    <Link
                      href={item.detailHref}
                      className="group/title inline-flex items-center gap-1.5 text-base font-black text-card-foreground transition hover:text-blue-600 dark:hover:text-blue-400"
                    >
                      <span>{item.title}</span>
                      <ExternalLink size={12} className="opacity-0 transition duration-200 group-hover/title:opacity-100 shrink-0" />
                    </Link>
                    <p className="mt-0.5 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                      Input: {item.input}
                    </p>
                  </div>

                  {/* Description */}
                  <p className="text-xs leading-relaxed text-muted-foreground min-h-[2.5rem]">
                    {item.desc}
                  </p>
                </div>

                {/* Card Action Footer */}
                <div className="relative z-10 mt-5 pt-3.5 border-t border-border/80 flex items-center justify-between gap-2">
                  <Link
                    href={item.detailHref}
                    className="inline-flex items-center gap-1 text-[11px] font-bold text-muted-foreground transition hover:text-foreground hover:underline"
                  >
                    <span>Deep Dive Page</span>
                    <ArrowRight size={11} />
                  </Link>

                  <Link
                    href={item.dashHref}
                    className="inline-flex items-center gap-1.5 rounded-xl bg-blue-600 px-3.5 py-2 text-xs font-black text-white shadow-md transition duration-200 hover:bg-blue-500 hover:shadow-blue-600/20 hover:-translate-y-0.5"
                  >
                    <Play size={10} fill="currentColor" />
                    <span>Use</span>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Catalog Link */}
        <div className="mt-12 text-center space-y-3">
          <Link
            href="/video-types"
            className="inline-flex items-center gap-2 rounded-2xl border border-border bg-card px-7 py-3.5 text-xs font-black text-foreground shadow-sm transition duration-300 hover:border-blue-500/40 hover:bg-accent hover:-translate-y-0.5 dark:border-border dark:bg-muted/60"
          >
            <Compass size={15} className="text-blue-500" />
            <span>Explore Complete Video Types Directory</span>
            <ArrowRight size={14} className="text-muted-foreground" />
          </Link>
        </div>
      </div>
    </section>
  );
}

