'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import {
  Sparkles,
  ArrowRight,
  BookOpen,
  ChevronLeft,
  ChevronRight,
  Tv,
  Smartphone,
  Mic,
  MonitorPlay,
  Captions,
  PenTool,
  FileText,
  Scissors,
  Columns,
  CheckCircle2,
  ExternalLink,
  Info,
  Clock,
} from 'lucide-react';

export type StudioCategory = 'all' | 'widescreen' | 'vertical' | 'audio' | 'upcoming';

export interface StudioGuideItem {
  id: string;
  title: string;
  tagline: string;
  category: 'widescreen' | 'vertical' | 'audio' | 'upcoming';
  categoryLabel: string;
  aspectRatio: '16:9' | '9:16' | 'Multi' | 'Audio';
  aspectBadge: string;
  accentColor: string;
  accentBg: string;
  accentBorder: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  guideHref: string;
  previewImage: string;
  readingTime: string;
  featurePills: string[];
  specs: {
    input: string;
    output: string;
    bestFor: string;
  };
  isUpcoming?: boolean;
}

const STUDIOS_DATA: StudioGuideItem[] = [
  {
    id: 'youtube-subtitle-generator',
    title: 'YouTube Subtitle Generator',
    tagline: 'Broadcast-grade word-synced subtitles for 16:9 horizontal YouTube videos & podcasts with Ali Abdaal, Vox & CEO presets.',
    category: 'widescreen',
    categoryLabel: '16:9 Widescreen',
    aspectRatio: '16:9',
    aspectBadge: '16:9 Landscape',
    accentColor: '#FF6D00',
    accentBg: 'rgba(255, 109, 0, 0.12)',
    accentBorder: 'rgba(255, 109, 0, 0.35)',
    icon: Captions,
    guideHref: '/youtube-subtitle-generator',
    previewImage: 'https://res.cloudinary.com/dhouh9idx/video/upload/v1789985982/km_20260917-1_720p_30f_20260917_003316_gsjtqa.jpg',
    readingTime: '3 min read',
    featurePills: ['9 Western Presets', 'TV & Scrubber Safe Zones', 'UPPERCASE & Natural Casing'],
    specs: {
      input: '16:9 Video (.mp4/.mov)',
      output: '1080p Subtitled MP4',
      bestFor: 'Long YouTube, Podcasts & Tutorials',
    },
  },
  {
    id: 'auto-caption-generator',
    title: 'Auto Caption Generator',
    tagline: 'Sub-second accurate animated word captions for Instagram Reels, Shorts & TikTok with pop sound effects & custom fonts.',
    category: 'vertical',
    categoryLabel: '9:16 Shorts',
    aspectRatio: '9:16',
    aspectBadge: '9:16 Vertical Reel',
    accentColor: '#FF8F00',
    accentBg: 'rgba(255, 143, 0, 0.12)',
    accentBorder: 'rgba(255, 143, 0, 0.35)',
    icon: Smartphone,
    guideHref: '/auto-captions',
    previewImage: 'https://res.cloudinary.com/dhouh9idx/video/upload/v1789982713/km_20260916-3_1080p_30f_20260916_232040_qtcjtv.jpg',
    readingTime: '2 min read',
    featurePills: ['Word Bounce & Glow', 'Interactive Pop SFX', '6 Brand Color Swatches'],
    specs: {
      input: 'Talking Video / Audio',
      output: 'Captioned 9:16 Reel',
      bestFor: 'Instagram Reels, Shorts & TikTok',
    },
  },
  {
    id: 'compare-explainer',
    title: 'Compare Explainer Video',
    tagline: 'Dual-image split comparison reels with animated sticker presenter, custom narration pacing, tension beats & winner reveals.',
    category: 'vertical',
    categoryLabel: '9:16 Shorts',
    aspectRatio: '9:16',
    aspectBadge: '9:16 Split Reel',
    accentColor: '#FFA726',
    accentBg: 'rgba(255, 167, 38, 0.12)',
    accentBorder: 'rgba(255, 167, 38, 0.35)',
    icon: Columns,
    guideHref: '/compare-explainer',
    previewImage: 'https://res.cloudinary.com/dhouh9idx/video/upload/v1789985898/90_People_Confuse_These_Two_learnenglish_difference_trendingreel_english_hnepyd.jpg',
    readingTime: '3 min read',
    featurePills: ['1.0x - 1.25x Pacing', '🥊 Tension BGM Beat', '👑 Winner Trophy Reveal'],
    specs: {
      input: 'Audio + 2 Subject Images',
      output: 'Side-by-Side Comparison Reel',
      bestFor: 'Product vs Product, Tech & Education',
    },
  },
  {
    id: 'whiteboard-video',
    title: 'Whiteboard Explainer Studio',
    tagline: 'AI extracts structured key takeaways from speech and writes them onto digital boards with animated drawing hands & styluses.',
    category: 'vertical',
    categoryLabel: '9:16 Shorts',
    aspectRatio: '9:16',
    aspectBadge: '9:16 Explainer',
    accentColor: '#FF6D00',
    accentBg: 'rgba(255, 109, 0, 0.12)',
    accentBorder: 'rgba(255, 109, 0, 0.35)',
    icon: PenTool,
    guideHref: '/whiteboard-video',
    previewImage: 'https://res.cloudinary.com/dhouh9idx/video/upload/v1789986107/km_20260916-2_1080p_30f_20260916_223430_ex3ire.jpg',
    readingTime: '3 min read',
    featurePills: ['🎨 Blueprint & Dark Glass', '✍️ Hand & Stylus Modes', 'Executive Marker Palettes'],
    specs: {
      input: 'Audio Lecture or Video',
      output: 'Interactive Whiteboard Reel',
      bestFor: 'Teachers, Coaches & Summaries',
    },
  },
  {
    id: 'typography-video',
    title: 'Kinetic Typography Video',
    tagline: 'High-energy punch text overlays popping to speech rhythm with intense SFX sound bites, blitz pacing & casing control.',
    category: 'vertical',
    categoryLabel: '9:16 Shorts',
    aspectRatio: '9:16',
    aspectBadge: '9:16 Kinetic Reel',
    accentColor: '#FF8F00',
    accentBg: 'rgba(255, 143, 0, 0.12)',
    accentBorder: 'rgba(255, 143, 0, 0.35)',
    icon: FileText,
    guideHref: '/typography-video',
    previewImage: 'https://res.cloudinary.com/dhouh9idx/video/upload/v1789986055/Video-98200_zwmwrf.jpg',
    readingTime: '2 min read',
    featurePills: ['💥 Punch SFX Intensity', '⚡ Viral Blitz Pacing', 'Speech Beat Emphasis'],
    specs: {
      input: 'Talking Video (.mp4)',
      output: 'Kinetic Typography Reel',
      bestFor: 'Quotes, Motivation & Podcasters',
    },
  },
  {
    id: 'long-video-promo',
    title: 'Long Video Promo',
    tagline: 'Converts long YouTube videos into high-converting vertical trailer teasers with thumbnail callouts, @channel tag & CTAs.',
    category: 'vertical',
    categoryLabel: '9:16 Shorts',
    aspectRatio: '9:16',
    aspectBadge: '9:16 Teaser Trailer',
    accentColor: '#FFA726',
    accentBg: 'rgba(255, 167, 38, 0.12)',
    accentBorder: 'rgba(255, 167, 38, 0.35)',
    icon: Tv,
    guideHref: '/long-video-promo',
    previewImage: 'https://res.cloudinary.com/dhouh9idx/video/upload/v1789982674/km_20260916-2_1080p_30f_20260916_223051_qp1ftb.jpg',
    readingTime: '2 min read',
    featurePills: ['@Channel Tag Watermark', '4 High-Converting CTAs', 'Ambient Canvas Blur'],
    specs: {
      input: '16:9 Clip + Thumbnail',
      output: 'Vertical YouTube Teaser Reel',
      bestFor: 'YouTubers Driving Traffic to Long Videos',
    },
  },
  {
    id: 'long-video-clips',
    title: 'Long Video Clips',
    tagline: 'AI identifies highest-energy viral hooks and auto-cuts captioned clips across 9:16, 16:9, or 1:1 with top teaser hook banners.',
    category: 'widescreen',
    categoryLabel: '16:9 & Multi-Aspect',
    aspectRatio: 'Multi',
    aspectBadge: '16:9, 9:16 & 1:1 Framing',
    accentColor: '#FF6D00',
    accentBg: 'rgba(255, 109, 0, 0.12)',
    accentBorder: 'rgba(255, 109, 0, 0.35)',
    icon: Scissors,
    guideHref: '/long-video-clips',
    previewImage: 'https://res.cloudinary.com/dhouh9idx/image/upload/v1789987070/17eef38923ec6228237c8ff8ae527ace_pwpva9.jpg',
    readingTime: '3 min read',
    featurePills: ['🔥 AI Viral Hook Detection', 'Top Teaser Banners', 'Multi-Aspect Ratio Crops'],
    specs: {
      input: 'Long Video File or URL',
      output: 'Multiple Captioned Short Clips',
      bestFor: 'Podcasts, Webinars & Interviews',
    },
  },
  {
    id: 'faceless-video',
    title: 'Faceless Video',
    tagline: 'Convert voiceover narration up to 20 minutes into complete 16:9 widescreen YouTube videos with kinetic pan/zoom & lo-fi BGM.',
    category: 'widescreen',
    categoryLabel: '16:9 Widescreen',
    aspectRatio: '16:9',
    aspectBadge: '16:9 Full YouTube Video',
    accentColor: '#FF8F00',
    accentBg: 'rgba(255, 143, 0, 0.12)',
    accentBorder: 'rgba(255, 143, 0, 0.35)',
    icon: MonitorPlay,
    guideHref: '/faceless-video',
    previewImage: '/assets/workflows/faceless.png',
    readingTime: '4 min read',
    featurePills: ['⚡ Kinetic Pan & Zoom', '☕ Lo-Fi & Tech Soundtracks', 'Up to 20 Minutes Audio'],
    specs: {
      input: 'Voiceover (Up to 20 Min)',
      output: '1080p 16:9 Widescreen Video',
      bestFor: 'Faceless YouTube Channels & History/Documentaries',
    },
  },
  {
    id: 'ai-audio-cleaner',
    title: 'AI Audio Cleaner',
    tagline: 'Upload raw voiceovers. AI cuts recording mistakes, room echo & silences, displaying the full script with 24-bit studio WAV export.',
    category: 'audio',
    categoryLabel: 'Studio Audio',
    aspectRatio: 'Audio',
    aspectBadge: 'Lossless Audio Studio',
    accentColor: '#FFA726',
    accentBg: 'rgba(255, 167, 38, 0.12)',
    accentBorder: 'rgba(255, 167, 38, 0.35)',
    icon: Mic,
    guideHref: '/tools/ai-audio-cleaner',
    previewImage: 'https://res.cloudinary.com/dhouh9idx/image/upload/v1789987047/7f2568f18035c129ed5bfd767a95dcbb_dr0qk5.jpg',
    readingTime: '3 min read',
    featurePills: ['24-bit WAV & 320k MP3', '🎙️ Podcast Warmth EQ Curve', '31+ Retakes Cut Automatically'],
    specs: {
      input: 'Raw Audio (MP3/WAV/M4A)',
      output: 'Studio Master Audio + Full Script',
      bestFor: 'Voice Actors, Podcasters & Creators',
    },
  },
  {
    id: 'image-to-video-ai',
    title: 'Image to Video AI',
    tagline: 'Transform narration and photos into cinematic 16:9 widescreen videos with Ken Burns camera motion, whip pans & 2.5D parallax.',
    category: 'widescreen',
    categoryLabel: '16:9 Widescreen',
    aspectRatio: '16:9',
    aspectBadge: '16:9 Cinematic Video',
    accentColor: '#FF6D00',
    accentBg: 'rgba(255, 109, 0, 0.12)',
    accentBorder: 'rgba(255, 109, 0, 0.35)',
    icon: MonitorPlay,
    guideHref: '/tools/image-to-video-ai',
    previewImage: 'https://res.cloudinary.com/dhouh9idx/video/upload/v1789982691/km_20260916-1_1080p_30f_20260916_222115_bw9ait.jpg',
    readingTime: '3 min read',
    featurePills: ['🎬 Ken Burns Camera Pacing', 'Whip Pan & Crossfades', '2.5D Parallax Subtitles'],
    specs: {
      input: 'Voiceover + Photo Batch',
      output: '1080p 30 FPS Cinematic MP4',
      bestFor: 'Documentaries, Visual Stories & Real Estate',
    },
  },
  {
    id: 'ai-voice-cloning-dubbing',
    title: 'AI Multi-Language Dubbing & Lip Sync',
    tagline: 'Translate and dub video voiceovers into 28+ international and regional languages while preserving natural vocal timbre & timing.',
    category: 'upcoming',
    categoryLabel: 'In Lab',
    aspectRatio: 'Multi',
    aspectBadge: 'Future Studio Teaser',
    accentColor: '#FF8F00',
    accentBg: 'rgba(255, 143, 0, 0.12)',
    accentBorder: 'rgba(255, 143, 0, 0.35)',
    icon: Sparkles,
    guideHref: '/video-types',
    previewImage: '/og-image.png',
    readingTime: 'Preview',
    featurePills: ['28+ Language Dubs', 'Voice Timbre Cloning', 'Accurate Lip-Sync Mesh'],
    specs: {
      input: 'Any Finished Video',
      output: 'Multi-Lingual Dubbed Video',
      bestFor: 'Global Channel Expansion',
    },
    isUpcoming: true,
  },
];

const CATEGORY_TABS: { id: StudioCategory; label: string; count: number }[] = [
  { id: 'all', label: 'All 11 Studios', count: 11 },
  { id: 'widescreen', label: '16:9 Landscape', count: 4 },
  { id: 'vertical', label: '9:16 Shorts & Reels', count: 4 },
  { id: 'audio', label: 'Audio & Cleaner', count: 1 },
  { id: 'upcoming', label: 'Upcoming Lab', count: 1 },
];

export default function DedicatedStudiosHubM3() {
  const [selectedCategory, setSelectedCategory] = useState<StudioCategory>('all');
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const filteredStudios = STUDIOS_DATA.filter((item) => {
    if (selectedCategory === 'all') return !item.isUpcoming;
    if (selectedCategory === 'upcoming') return item.isUpcoming;
    return item.category === selectedCategory && !item.isUpcoming;
  });

  const updateScrollButtons = () => {
    if (!scrollContainerRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
    setCanScrollLeft(scrollLeft > 20);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 20);
  };

  useEffect(() => {
    updateScrollButtons();
  }, [filteredStudios]);

  const handleScroll = (direction: 'left' | 'right') => {
    if (!scrollContainerRef.current) return;
    const scrollAmount = 380;
    scrollContainerRef.current.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth',
    });
  };

  return (
    <section
      id="studio-guides"
      aria-label="Dedicated Studio Guides & Deep Dives"
      className="relative overflow-hidden bg-[#070B14] py-16 sm:py-24 border-b border-white/10"
    >
      {/* ── M3 Mesh Aurora Background Moving Motion ── */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-32 -left-32 h-[500px] w-[500px] rounded-full bg-gradient-to-tr from-[#FF6D00]/15 via-[#FF8F00]/10 to-transparent blur-[120px] animate-pulse" />
        <div className="absolute top-1/2 -right-32 h-[450px] w-[450px] rounded-full bg-gradient-to-bl from-amber-500/15 via-orange-600/10 to-transparent blur-[120px]" />
        <div className="absolute -bottom-32 left-1/3 h-[400px] w-[400px] rounded-full bg-gradient-to-t from-emerald-500/10 to-transparent blur-[100px]" />
        {/* Subtle M3 Grid Overlay */}
        <div className="absolute inset-0 bg-[radial-gradient(#ffffff0a_1px,transparent_1px)] [background-size:28px_28px] opacity-80" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* ── Header Area ── */}
        <div className="flex flex-col items-center text-center">
          {/* Eyebrow Pill */}
          <div className="inline-flex items-center gap-2 rounded-full border border-[#FF6D00]/30 bg-[#FF6D00]/10 px-4 py-1.5 text-xs font-black uppercase tracking-wider text-[#FF9100] shadow-sm backdrop-blur-md">
            <BookOpen size={14} className="text-[#FF8F00]" />
            <span>Dedicated Studio Knowledge Hub</span>
          </div>

          {/* Headline with Google Analytics Orange Gradient */}
          <h2 className="mt-4 text-3xl font-black tracking-tight text-white sm:text-5xl lg:text-6xl font-sans">
            Explore AI Video Studios &amp;{' '}
            <span className="bg-gradient-to-r from-[#FF6D00] via-[#FF8F00] to-[#FFA726] bg-clip-text text-transparent">
              In-Depth Guides
            </span>
          </h2>

          {/* Subtitle with Explicit "No Dashboard Redirect" Clarity */}
          <p className="mt-3 max-w-3xl text-sm sm:text-base leading-relaxed text-zinc-300 font-medium">
            Each video type has a full dedicated information page with workflow breakdowns, sample renders, video rules, and formatting specs.
          </p>

          {/* Clear Distinction Banner */}
          <div className="mt-4 inline-flex items-center gap-2 rounded-2xl border border-[#FF6D00]/25 bg-[#0E1526]/90 px-4 py-2 text-xs font-semibold text-slate-200 backdrop-blur-sm shadow-inner">
            <Info size={15} className="shrink-0 text-[#FF8F00]" />
            <span>
              <strong>Note:</strong> Clicking below opens that studio&apos;s <strong>dedicated detail page</strong> to read more (does <em>not</em> redirect to the studio dashboard).
            </span>
          </div>
        </div>

        {/* ── M3 Segmented Category Filter Chips ── */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-2">
          {CATEGORY_TABS.map((tab) => {
            const isActive = selectedCategory === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setSelectedCategory(tab.id)}
                type="button"
                className={`group relative inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-bold transition-all duration-200 cursor-pointer active:scale-95 ${
                  isActive
                    ? 'bg-gradient-to-r from-[#FF6D00] to-[#FF8F00] text-black font-black shadow-lg shadow-[#FF6D00]/25'
                    : 'bg-[#0E1526] text-zinc-300 border border-white/10 hover:border-[#FF6D00]/40 hover:bg-[#131926] hover:text-white'
                }`}
              >
                <span>{tab.label}</span>
                <span
                  className={`rounded-full px-1.5 py-0.2 text-[10px] font-black transition-colors ${
                    isActive ? 'bg-black/20 text-black' : 'bg-white/10 text-zinc-400 group-hover:text-zinc-200'
                  }`}
                >
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* ── Carousel Controls & Count Indicator ── */}
        <div className="mt-6 flex items-center justify-between px-1">
          <div className="flex items-center gap-2 text-xs font-semibold text-zinc-400">
            <Sparkles size={14} className="text-[#FF8F00]" />
            <span>Showing {filteredStudios.length} Dedicated Studios</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => handleScroll('left')}
              disabled={!canScrollLeft}
              type="button"
              aria-label="Scroll left"
              className={`flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white backdrop-blur-md transition cursor-pointer active:scale-90 ${
                canScrollLeft ? 'hover:bg-white/15 text-white' : 'opacity-30 cursor-not-allowed'
              }`}
            >
              <ChevronLeft size={18} />
            </button>
            <button
              onClick={() => handleScroll('right')}
              disabled={!canScrollRight}
              type="button"
              aria-label="Scroll right"
              className={`flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white backdrop-blur-md transition cursor-pointer active:scale-90 ${
                canScrollRight ? 'hover:bg-white/15 text-white' : 'opacity-30 cursor-not-allowed'
              }`}
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>

        {/* ── M3 Kinetic Horizontal Carousel Track ── */}
        <div
          ref={scrollContainerRef}
          onScroll={updateScrollButtons}
          className="mt-5 flex gap-5 overflow-x-auto pb-6 pt-2 scroll-smooth no-scrollbar snap-x snap-mandatory"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {filteredStudios.map((studio) => {
            const StudioIcon = studio?.icon || Sparkles;
            return (
              <div
                key={studio.id}
                className="group relative flex w-[320px] sm:w-[360px] shrink-0 snap-start flex-col overflow-hidden rounded-[28px] border border-white/10 bg-[#0E1526]/90 p-5 shadow-xl backdrop-blur-xl transition-all duration-300 hover:-translate-y-1.5 hover:border-[#FF6D00]/50 hover:shadow-2xl hover:shadow-[#FF6D00]/15"
              >
                {/* Top Subtle Light Sheen Effect on Hover */}
                <div className="pointer-events-none absolute -inset-full bg-gradient-to-r from-transparent via-white/[0.04] to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100 group-hover:animate-pulse" />

                {/* 1. Header with Icon, Category & Aspect Ratio Pill */}
                <div className="flex items-start justify-between gap-3">
                  <div
                    className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border shadow-inner transition-transform duration-300 group-hover:scale-110"
                    style={{
                      backgroundColor: studio.accentBg,
                      borderColor: studio.accentBorder,
                      color: studio.accentColor,
                    }}
                  >
                    <StudioIcon size={24} />
                  </div>

                  <div className="flex flex-col items-end gap-1">
                    <span className="rounded-full bg-white/10 border border-white/15 px-2.5 py-0.5 text-[11px] font-bold text-white shadow-xs">
                      {studio.aspectBadge}
                    </span>
                    <span className="text-[10px] font-semibold text-zinc-400">
                      {studio.categoryLabel}
                    </span>
                  </div>
                </div>

                {/* 2. Title & Read Time */}
                <div className="mt-4">
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-black text-white group-hover:text-[#FFA726] transition-colors">
                      {studio.title}
                    </h3>
                  </div>
                  <p className="mt-2 text-xs leading-relaxed text-zinc-300 line-clamp-2">
                    {studio.tagline}
                  </p>
                </div>

                {/* 3. Feature Highlights Chips */}
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {studio.featurePills.map((pill) => (
                    <span
                      key={pill}
                      className="inline-flex items-center gap-1 rounded-lg bg-white/[0.04] border border-white/5 px-2 py-1 text-[10px] font-semibold text-zinc-300"
                    >
                      <CheckCircle2 size={11} className="text-emerald-400 shrink-0" />
                      <span>{pill}</span>
                    </span>
                  ))}
                </div>

                {/* 4. Specifications Box */}
                <div className="mt-4 rounded-xl border border-white/5 bg-black/30 p-3 space-y-1.5 text-[11px]">
                  <div className="flex items-center justify-between text-zinc-400">
                    <span>Input:</span>
                    <span className="font-semibold text-zinc-200">{studio.specs.input}</span>
                  </div>
                  <div className="flex items-center justify-between text-zinc-400 border-t border-white/5 pt-1.5">
                    <span>Output:</span>
                    <span className="font-semibold text-emerald-400">{studio.specs.output}</span>
                  </div>
                  <div className="flex items-center justify-between text-zinc-400 border-t border-white/5 pt-1.5">
                    <span>Best For:</span>
                    <span className="font-semibold text-zinc-300 truncate max-w-[190px]">{studio.specs.bestFor}</span>
                  </div>
                </div>

                {/* 5. Primary Action Button: Read Full Guide & Specs (Dedicated Page) */}
                <div className="mt-5 pt-3 border-t border-white/10 flex flex-col gap-2">
                  <Link
                    href={studio.guideHref}
                    className="group/btn relative inline-flex items-center justify-between rounded-xl px-4 py-3 text-xs font-black text-black shadow-lg shadow-[#FF6D00]/25 transition-all duration-200 hover:brightness-110 active:scale-95"
                    style={{
                      background: 'linear-gradient(135deg, #FF6D00, #FF8F00)',
                    }}
                  >
                    <div className="flex items-center gap-2">
                      <BookOpen size={15} className="shrink-0 text-black" />
                      <span>{studio.isUpcoming ? 'View All Studios Roadmap' : 'Read Full Guide & Specs'}</span>
                    </div>
                    <ArrowRight
                      size={15}
                      className="transition-transform duration-200 group-hover/btn:translate-x-1 shrink-0 text-black"
                    />
                  </Link>

                  <div className="flex items-center justify-between px-1 text-[10px] font-bold text-zinc-400">
                    <span className="inline-flex items-center gap-1 text-[#FF8F00]">
                      <ExternalLink size={10} />
                      <span>Dedicated Detail Page</span>
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <Clock size={10} />
                      <span>{studio.readingTime}</span>
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* ── Footer Link to All Video Types Directory ── */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 rounded-2xl border border-white/10 bg-white/[0.02] p-4 text-center sm:text-left">
          <div className="space-y-0.5">
            <p className="text-sm font-bold text-white">
              Want a comprehensive matrix comparison of all 11 formats?
            </p>
            <p className="text-xs text-zinc-400">
              Compare render speeds, input specifications, and aspect ratios side-by-side.
            </p>
          </div>
          <Link
            href="/video-types"
            className="inline-flex items-center gap-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 px-5 py-2.5 text-xs font-bold text-white transition active:scale-95 shrink-0"
          >
            <span>View All Video Types Matrix</span>
            <ArrowRight size={14} />
          </Link>
        </div>

      </div>
    </section>
  );
}
