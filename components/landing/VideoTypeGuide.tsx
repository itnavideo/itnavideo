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
    aspectRatio: '9:16',
    category: 'short',
    input: 'Video file',
    desc: 'Clean, word-synced animated subtitles for 9:16 Instagram Reels, Shorts & TikTok with custom positions, sizes, and colors.',
    detailHref: '/video-types/auto-caption-reel',
    dashHref: '/dashboard?videoType=auto-caption-generator',
    accent: '#F59E0B',
    icon: Captions,
    previewGradient: 'from-amber-500/20 via-orange-500/10 to-transparent',
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
    title: 'Kinetic Motion',
    badge: 'Motion Text',
    aspectRatio: '9:16',
    category: 'short',
    input: 'Video file',
    desc: 'Dynamic animated text — 11 motion presets synced to your voice. Words slam, bounce, flip, and wave to the beat.',
    detailHref: '/video-types/typography-video',
    dashHref: '/dashboard?videoType=typography-video',
    accent: '#8B5CF6',
    icon: Wand2,
    previewGradient: 'from-purple-500/20 via-violet-500/10 to-transparent',
  },
  {
    id: 'long-video-promo',
    title: 'Long Video Promotion',
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
    accent: '#F59E0B',
    icon: Mic,
    previewGradient: 'from-amber-500/20 via-orange-500/10 to-transparent',
  },
  {
    id: 'youtube-subtitle-generator',
    title: 'YouTube Subtitle Generator',
    badge: '16:9 YouTube',
    aspectRatio: '16:9',
    category: 'long',
    input: 'Landscape Video (15m)',
    desc: 'Preserve 100% video & audio quality with clean, real-creator styled subtitles up to 15 minutes.',
    detailHref: '/youtube-subtitle-generator',
    dashHref: '/dashboard?videoType=youtube-subtitle-generator',
    accent: '#F97316',
    icon: Maximize2,
    previewGradient: 'from-orange-500/25 via-amber-500/10 to-transparent',
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
    accent: '#F59E0B',
    icon: Film,
    previewGradient: 'from-amber-500/20 via-orange-500/10 to-transparent',
  },
];

export default function VideoTypeGuide() {
  const [activeTab, setActiveTab] = useState<'all' | 'short' | 'long'>('all');

  const filteredTemplates = TEMPLATES.filter((t) => {
    if (activeTab === 'all') return true;
    return t.category === activeTab;
  });

  return (
    <section className="relative overflow-hidden bg-[#070B14] px-4 py-20 sm:px-6 sm:py-28 md:py-32 border-t border-white/10 text-white">
      {/* Background Glow */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_800px_at_50%_-100px,rgba(168,85,247,0.08),transparent_100%)]" />

      <div className="relative z-10 mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-12 text-center space-y-3 sm:space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full border border-purple-500/30 bg-purple-500/10 px-4 py-1.5 text-xs font-bold text-purple-300 backdrop-blur-md">
            <Sparkles size={13} className="text-purple-400" />
            <span>WHAT YOU CAN CREATE</span>
          </div>
          <h2 className="text-3xl font-black leading-tight text-white sm:text-4xl md:text-5xl font-sans tracking-tight px-1">
            11 AI video studios. <span className="bg-gradient-to-r from-purple-400 via-fuchsia-400 to-pink-400 bg-clip-text text-transparent">One platform.</span>
          </h2>
          <p className="mx-auto max-w-2xl text-xs sm:text-sm text-zinc-400 leading-relaxed px-2">
            Click any studio to explore its dedicated page or start creating immediately with zero editing skills required.
          </p>

          {/* Filter Pills */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-4">
            <button
              onClick={() => setActiveTab('all')}
              className={`rounded-xl border px-4 py-2 text-xs font-bold transition duration-200 ${
                activeTab === 'all'
                  ? 'border-purple-500/40 bg-purple-500/20 text-purple-300 shadow-sm'
                  : 'border-white/10 bg-[#0E1526] text-zinc-400 hover:bg-[#151E30] hover:text-white'
              }`}
            >
              All 11 Studios
            </button>
            <button
              onClick={() => setActiveTab('short')}
              className={`rounded-xl border px-4 py-2 text-xs font-bold transition duration-200 ${
                activeTab === 'short'
                  ? 'border-purple-500/40 bg-purple-500/20 text-purple-300 shadow-sm'
                  : 'border-white/10 bg-[#0E1526] text-zinc-400 hover:bg-[#151E30] hover:text-white'
              }`}
            >
              Short Reels (9:16)
            </button>
            <button
              onClick={() => setActiveTab('long')}
              className={`rounded-xl border px-4 py-2 text-xs font-bold transition duration-200 ${
                activeTab === 'long'
                  ? 'border-purple-500/40 bg-purple-500/20 text-purple-300 shadow-sm'
                  : 'border-white/10 bg-[#0E1526] text-zinc-400 hover:bg-[#151E30] hover:text-white'
              }`}
            >
              Long Form &amp; Tools (16:9 / Audio)
            </button>
          </div>
        </div>

        {/* 11 Template Cards Grid */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredTemplates.map((item) => {
            const IconComponent = item?.icon || Sparkles;

            return (
              <div
                key={item.id}
                className="group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-white/10 bg-[#0E1526] p-5 shadow-xl backdrop-blur-md transition duration-300 hover:-translate-y-1 hover:border-purple-500/50"
              >
                {/* Accent Background Gradient */}
                <div
                  className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${item.previewGradient} opacity-60 transition duration-500 group-hover:opacity-100`}
                />

                <div className="relative z-10 space-y-3.5">
                  {/* Top Bar: Icon + Aspect ratio + Badge */}
                  <div className="flex items-center justify-between gap-2">
                    <div
                      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-black/60 shadow-sm transition duration-300 group-hover:scale-105"
                      style={{ color: item.accent }}
                    >
                      <IconComponent size={18} />
                    </div>

                    <div className="flex items-center gap-1.5">
                      <span className="rounded-lg bg-white/5 px-2 py-0.5 font-mono text-[10px] font-black uppercase tracking-wider text-zinc-300 border border-white/10">
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
                      className="group/title inline-flex items-center gap-1.5 text-base font-black text-white transition hover:text-purple-300"
                    >
                      <span>{item.title}</span>
                      <ExternalLink size={12} className="opacity-0 transition duration-200 group-hover/title:opacity-100 shrink-0" />
                    </Link>
                    <p className="mt-0.5 text-[10px] font-bold uppercase tracking-wider text-zinc-400">
                      Input: {item.input}
                    </p>
                  </div>

                  {/* Description */}
                  <p className="text-xs leading-relaxed text-zinc-400 min-h-[2.5rem]">
                    {item.desc}
                  </p>
                </div>

                {/* Card Action Footer */}
                <div className="relative z-10 mt-5 pt-3.5 border-t border-white/10 flex items-center justify-between gap-2">
                  <Link
                    href={item.detailHref}
                    className="inline-flex items-center gap-1 text-[11px] font-bold text-zinc-400 transition hover:text-white hover:underline"
                  >
                    <span>Deep Dive Page</span>
                    <ArrowRight size={11} />
                  </Link>

                  <Link
                    href={item.dashHref}
                    className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-purple-600 via-fuchsia-500 to-pink-500 px-3.5 py-2 text-xs font-black text-white shadow-md transition duration-200 hover:brightness-110 hover:-translate-y-0.5"
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
            className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-[#0E1526] px-7 py-3.5 text-xs font-black text-white shadow-sm transition duration-300 hover:border-purple-500/40 hover:bg-[#151E30] hover:-translate-y-0.5"
          >
            <Compass size={15} className="text-purple-400" />
            <span>Explore Complete Video Types Directory</span>
            <ArrowRight size={14} className="text-zinc-400" />
          </Link>
        </div>
      </div>
    </section>
  );
}

