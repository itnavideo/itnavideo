'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { getOptimizedCloudinaryUrl } from '@/lib/utils';
import {
  Search,
  X,
  ArrowRight,
  BookOpen,
  Sparkles,
  Smartphone,
  Monitor,
  PenTool,
  Columns,
  LayoutGrid,
  Scissors,
  Film,
  Music2,
  Subtitles,
  UserX,
  Wand2,
  Zap,
  type LucideIcon,
} from 'lucide-react';
import FormatSelectorModal, { type UnifiedToolModalData } from '@/components/dashboard/shared/FormatSelectorModal';

export interface StudioItem {
  id: string;
  title: string;
  description: string;
  category: 'all' | 'popular' | 'shorts' | 'cinema' | 'explainers' | 'repurposing' | 'audio';
  badge?: string;
  isFree?: boolean;
  aspectRatio: '9:16' | '16:9' | '9:16 & 16:9' | 'Audio';
  imageCard: string;
  icon: LucideIcon;
  iconBgClass: string;
  iconColorClass: string;
  publicHref: string;
  singleHref?: string;
  modalData?: UnifiedToolModalData;
  keywords: string[];
}

export const ALL_15_STUDIOS: StudioItem[] = [
  // 1. Faceless Video (16:9 Cinema)
  {
    id: 'faceless-video',
    title: 'Faceless Video',
    description: 'Turn voiceovers & scripts into high-retention 16:9 YouTube videos with AI B-roll, visuals, and kinetic captions.',
    category: 'cinema',
    badge: '16:9 Cinema',
    aspectRatio: '16:9',
    imageCard: 'https://res.cloudinary.com/dhouh9idx/image/upload/v1794743849/Faceless_AI_Video_Creation_Infographic_ramnfp.png',
    icon: UserX,
    iconBgClass: 'bg-orange-500/10 border border-orange-500/20',
    iconColorClass: 'text-orange-600',
    publicHref: '/faceless-video',
    singleHref: '/dashboard/faceless-video',
    keywords: ['faceless', 'youtube', '16:9', 'voiceover', 'broll', 'cinema', 'documentary'],
  },


  // 3. YouTube Subtitles (Unified Dual Aspect: 16:9 YouTube Subtitles & 9:16 Auto Captions)
  {
    id: 'youtube-subtitles',
    title: 'YouTube Subtitles',
    description: 'Add animated word-by-word karaoke captions with 32 presets. Choose between 16:9 YouTube Subtitles or 9:16 Auto Captions.',
    category: 'cinema',
    badge: 'FREE · 5/Day',
    isFree: true,
    aspectRatio: '9:16 & 16:9',
    imageCard: 'https://res.cloudinary.com/dhouh9idx/image/upload/v1792946360/youtube_subtitles_generator_who62l.png',
    icon: Subtitles,
    iconBgClass: 'bg-emerald-500/10 border border-emerald-500/20',
    iconColorClass: 'text-emerald-600',
    publicHref: '/youtube-subtitles-generator',
    modalData: {
      id: 'youtube-subtitles',
      title: 'YouTube Subtitles & Auto Captions',
      description: 'Select your subtitle format. Both formats include 5 free renders every day with 32 presets and Groq Whisper precision.',
      categoryBadge: '100% Free Daily Tier',
      options: [
        {
          aspectRatio: '16:9',
          label: '16:9 YouTube Subtitles',
          sublabel: 'YouTube Videos · Landscape Captions',
          resolution: '1920×1080 Full HD',
          duration: 'Up to 5 Minutes',
          pricing: 'FREE · 5/Day',
          isFree: true,
          image: 'https://res.cloudinary.com/dhouh9idx/image/upload/v1792946360/youtube_subtitles_generator_who62l.png',
          href: '/dashboard/youtube-subtitles',
          features: [
            'Widescreen YouTube Subtitle Placement',
            'Burned Strips & Box Highlighting',
            'Dual-Language Subtitle Support',
            'High-Legibility Safe Zone Padding',
          ],
        },
        {
          aspectRatio: '9:16',
          label: '9:16 Vertical Captions',
          sublabel: 'Instagram Reels · Shorts · TikTok Vertical',
          resolution: '1080×1920 Full HD',
          duration: 'Up to 90 Seconds',
          pricing: 'FREE · 5/Day',
          isFree: true,
          image: 'https://res.cloudinary.com/dhouh9idx/image/upload/v1792945595/file_00000000df688211bc2231047185512d_ifk1xc.png',
          href: '/dashboard/auto-caption',
          features: [
            '32 TikTok & Reel Subtitle Presets',
            'Word-by-word Active Karaoke Glow',
            'Groq Whisper STT (±10ms sync)',
            'Custom Brand Font & Color Palettes',
          ],
        },
      ],
    },
    keywords: ['youtube', 'subtitles', 'captions', 'auto caption', 'karaoke', 'widescreen', '16:9', '9:16', 'free', 'whisper'],
  },


  // 6. Face Head Video (9:16 Vertical / AI Shorts Polisher)
  {
    id: 'ai-shorts-polisher',
    title: 'Face Head Video',
    description: 'Face-tracked smart zoom punch-ins (+12%), silence trimmer (>0.4s), and kinetic word emphasis for talking head reels.',
    category: 'shorts',
    badge: 'Face Head Video',
    aspectRatio: '9:16',
    imageCard: 'https://res.cloudinary.com/dhouh9idx/image/upload/v1794744108/Professional_Studio_Presenter_with_Dream_Plan_Grow_Decor_vooqtc.png',
    icon: Scissors,
    iconBgClass: 'bg-amber-500/10 border border-amber-500/20',
    iconColorClass: 'text-amber-600',
    publicHref: '/ai-shorts-polisher',
    singleHref: '/dashboard/ai-shorts-polisher',
    keywords: ['face head', 'face head video', 'talking head', 'shorts polisher', 'reels', 'zoom', 'silence', 'punch in'],
  },

  // 7. Whiteboard Animation (Dual Aspect)
  {
    id: 'whiteboard-video',
    title: 'Whiteboard Animation',
    description: 'Hand-drawn animated whiteboard stickman explainer videos with synchronized voiceover and doodle callouts.',
    category: 'explainers',
    badge: 'Doodle Explainer',
    aspectRatio: '9:16 & 16:9',
    imageCard: 'https://res.cloudinary.com/dhouh9idx/image/upload/v1794743849/Money_Saving_Tips_Infographic_sxwtuz.png',
    icon: PenTool,
    iconBgClass: 'bg-emerald-500/10 border border-emerald-500/20',
    iconColorClass: 'text-emerald-600',
    publicHref: '/whiteboard-video',
    singleHref: '/dashboard/whiteboard-video',
    keywords: ['whiteboard', 'animation', 'stickman', 'doodle', 'drawing', 'education', 'explainer'],
  },

  // 8. Compare Explainer Video (Dual Aspect)
  {
    id: 'compare-explainer',
    title: 'Compare Explainer Video',
    description: 'Side-by-side versus comparison showdowns with animated reaction characters, scorebars, and VS center badge.',
    category: 'explainers',
    badge: 'Versus Split',
    aspectRatio: '9:16 & 16:9',
    imageCard: 'https://res.cloudinary.com/dhouh9idx/image/upload/v1794744487/Option_A_vs_Option_B__Laptop_Comparison_tucwjk.png',
    icon: Columns,
    iconBgClass: 'bg-violet-500/10 border border-violet-500/20',
    iconColorClass: 'text-violet-600',
    publicHref: '/compare-explainer',
    singleHref: '/dashboard/compare-explainer',
    keywords: ['compare', 'versus', 'vs', 'comparison', 'breakdown', 'side by side'],
  },

  // 9. Split Screen Explainer (Dual Aspect)
  {
    id: 'split-screen-explainer',
    title: 'Split Screen Explainer',
    description: 'Creator facecam at bottom with kinetic explainer graphics and chapter progress tracker at top.',
    category: 'explainers',
    badge: 'Creator Split',
    aspectRatio: '9:16 & 16:9',
    imageCard: 'https://res.cloudinary.com/dhouh9idx/image/upload/v1794744816/Smart_Investing__Build_Wealth_Wisely_aqdjgj.png',
    icon: LayoutGrid,
    iconBgClass: 'bg-teal-500/10 border border-teal-500/20',
    iconColorClass: 'text-teal-600',
    publicHref: '/split-screen-explainer',
    singleHref: '/dashboard/split-screen-explainer',
    keywords: ['split screen', 'facecam', 'reaction', 'tutorial', 'chapters', 'pip'],
  },

  // 10. Viral Video Clips (Dual Aspect)
  {
    id: 'long-video-clips',
    title: 'Viral Video Clips',
    description: 'Turn long videos (up to 2 hours) into 60s viral Shorts in 1 click with AI hook detection scoring.',
    category: 'repurposing',
    badge: 'AI Hook Cutter',
    aspectRatio: '9:16 & 16:9',
    imageCard: 'https://res.cloudinary.com/dhouh9idx/image/upload/v1794744492/Long_Video_to_Multiple_Clips_Workflow_terxja.png',
    icon: Scissors,
    iconBgClass: 'bg-amber-500/10 border border-amber-500/20',
    iconColorClass: 'text-amber-600',
    publicHref: '/long-video-clips',
    singleHref: '/dashboard/long-video-clips',
    keywords: ['clips', 'viral', 'repurpose', 'podcast', 'hook', 'cutter', 'auto reframing'],
  },

  // 11. Long Video Promo (Dual Aspect)
  {
    id: 'long-video-promo',
    title: 'Long Video Promo',
    description: 'Turn your long video into a high-converting teaser promo reel and trailer for social media with channel CTA.',
    category: 'repurposing',
    badge: 'Teaser Promo',
    aspectRatio: '9:16 & 16:9',
    imageCard: 'https://res.cloudinary.com/dhouh9idx/image/upload/v1794745139/Promote_Your_Long_Video_w9w9ab.png',
    icon: Film,
    iconBgClass: 'bg-pink-500/10 border border-pink-500/20',
    iconColorClass: 'text-pink-600',
    publicHref: '/long-video-promo',
    singleHref: '/dashboard/long-video-promo',
    keywords: ['promo', 'trailer', 'teaser', 'youtube promo', 'social share'],
  },

  // 12. Image to Video AI (Dual Aspect)
  {
    id: 'image-to-video',
    title: 'Image to Video AI',
    description: 'Transform scripts and static photos into cinematic 3D parallax storytelling videos with motion pacing.',
    category: 'cinema',
    badge: 'Parallax Motion',
    aspectRatio: '9:16 & 16:9',
    imageCard: 'https://res.cloudinary.com/dhouh9idx/image/upload/v1792946349/imagetovideoai_w3hyci.jpg',
    icon: Sparkles,
    iconBgClass: 'bg-orange-500/10 border border-orange-500/20',
    iconColorClass: 'text-orange-600',
    publicHref: '/image-to-video-ai',
    singleHref: '/dashboard/image-to-video',
    keywords: ['image to video', 'photos', 'parallax', 'ken burns', 'storytelling'],
  },

  // 13. Book Summary Video (Dual Aspect)
  {
    id: 'book-summary',
    title: 'Book Summary Video',
    description: 'Turn book narration audio into a captivating cinematic chapter summary video with animated lessons and quotes.',
    category: 'explainers',
    badge: 'Cinema Chapters',
    aspectRatio: '9:16 & 16:9',
    imageCard: 'https://res.cloudinary.com/dhouh9idx/image/upload/v1792946358/book_summary_video_zbs4em.png',
    icon: BookOpen,
    iconBgClass: 'bg-rose-500/10 border border-rose-500/20',
    iconColorClass: 'text-rose-600',
    publicHref: '/book-summary',
    singleHref: '/dashboard/book-summary',
    keywords: ['book summary', 'audiobook', 'lessons', 'quotes', 'chapters', 'education'],
  },

  // 14. AI Video Generator (Dual Aspect)
  {
    id: 'ai-video-generator',
    title: 'AI Video Generator',
    description: 'Prompt-to-production studio: AI plans complete scenes, matches footage, records voiceover, and builds kinetic captions.',
    category: 'popular',
    badge: 'Autonomous AI',
    aspectRatio: '9:16 & 16:9',
    imageCard: 'https://res.cloudinary.com/dhouh9idx/image/upload/v1794750594/AI_Video_Generator_Studio_j1fbid.png',
    icon: Wand2,
    iconBgClass: 'bg-orange-500/10 border border-orange-500/20',
    iconColorClass: 'text-orange-500',
    publicHref: '/ai-video-generator',
    singleHref: '/dashboard/ai-video-generator',
    keywords: ['ai video generator', 'prompt to video', 'text to video', 'autonomous', 'generator'],
  },

  // 15. AI Audio Cleaner (Utility)
  {
    id: 'audio-cleaner',
    title: 'AI Audio Cleaner & Studio',
    description: 'Remove background noise, hum, and room echo to studio broadcast standard in 1 click.',
    category: 'audio',
    badge: 'Studio Master',
    aspectRatio: 'Audio',
    imageCard: 'https://res.cloudinary.com/dhouh9idx/image/upload/v1792946356/audio_cleaner_pipcxj.png',
    icon: Music2,
    iconBgClass: 'bg-teal-500/10 border border-teal-500/20',
    iconColorClass: 'text-teal-600',
    publicHref: '/ai-audio-cleaner',
    singleHref: '/dashboard/audio-cleaner',
    keywords: ['audio cleaner', 'noise removal', 'voice enhance', 'studio sound', 'podcast audio'],
  },
];

const CATEGORY_TABS = [
  { id: 'all', label: `All (${ALL_15_STUDIOS.length})`, icon: LayoutGrid, colorClass: 'text-orange-500' },
  { id: 'popular', label: 'Popular', icon: Sparkles, colorClass: 'text-amber-500' },
  { id: 'shorts', label: 'Social Shorts (9:16)', icon: Smartphone, colorClass: 'text-purple-500' },
  { id: 'cinema', label: 'YouTube & Cinema (16:9)', icon: Monitor, colorClass: 'text-orange-500' },
  { id: 'explainers', label: 'Explainers & Education', icon: PenTool, colorClass: 'text-emerald-500' },
  { id: 'repurposing', label: 'Repurposing & Clips', icon: Scissors, colorClass: 'text-pink-500' },
  { id: 'audio', label: 'Audio Studio', icon: Music2, colorClass: 'text-teal-500' },
];

export default function TenStudiosHubArchitecture() {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedToolForModal, setSelectedToolForModal] = useState<UnifiedToolModalData | null>(null);

  // Filter logic: category + search query
  const filteredStudios = useMemo(() => {
    return ALL_15_STUDIOS.filter((studio) => {
      // Category filter
      if (selectedCategory === 'popular') {
        const popularIds = ['faceless-video', 'youtube-subtitles', 'long-video-clips', 'ai-video-generator', 'ai-shorts-polisher'];
        if (!popularIds.includes(studio.id)) return false;
      } else if (selectedCategory === 'shorts') {
        if (studio.category !== 'shorts' && studio.aspectRatio !== '9:16 & 16:9') return false;
      } else if (selectedCategory === 'cinema') {
        if (studio.category !== 'cinema' && studio.aspectRatio !== '9:16 & 16:9') return false;
      } else if (selectedCategory !== 'all') {
        if (studio.category !== selectedCategory) return false;
      }

      // Search query filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const matchesTitle = studio.title.toLowerCase().includes(query);
        const matchesDesc = studio.description.toLowerCase().includes(query);
        const matchesKeywords = studio.keywords.some((kw) => kw.toLowerCase().includes(query));
        return matchesTitle || matchesDesc || matchesKeywords;
      }

      return true;
    });
  }, [selectedCategory, searchQuery]);

  const handleCardClick = (studio: StudioItem) => {
    if (studio.modalData) {
      setSelectedToolForModal(studio.modalData);
      return;
    }
    if (studio.singleHref) {
      router.push(studio.singleHref);
      return;
    }
    router.push('/dashboard');
  };

  return (
    <section
      id="video-types"
      className="relative w-full overflow-hidden bg-gradient-to-b from-white via-orange-50/25 to-white py-16 sm:py-24 text-zinc-950 border-y border-zinc-200/80"
    >
      {/* Soft Living Color Halos in Background (Apple/Stripe Style) */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-24 left-1/4 h-[420px] w-[500px] rounded-full bg-gradient-to-br from-orange-400/12 via-amber-300/10 to-transparent blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-10 right-10 h-[380px] w-[460px] rounded-full bg-gradient-to-bl from-purple-500/8 via-indigo-400/5 to-transparent blur-3xl"
      />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full space-y-10 sm:space-y-12">
        
        {/* Modern Section Header with Signature Color Gradient */}
        <div className="text-center max-w-3xl mx-auto space-y-3 px-2">
          <h2 className="text-3xl font-black tracking-tight text-zinc-950 sm:text-5xl font-sans leading-[1.15]">
            AI Video Creation{' '}
            <span className="bg-gradient-to-r from-orange-600 via-amber-500 to-orange-500 bg-clip-text text-transparent">
              Studios
            </span>
          </h2>
          <p className="text-sm sm:text-base text-zinc-600 font-normal leading-relaxed max-w-2xl mx-auto">
            Choose from 15 powerful video types and turn your ideas into stunning videos with AI.
          </p>
        </div>

        {/* Modern Search & Vibrant Category Filter Navigation */}
        <div className="space-y-5 max-w-5xl mx-auto w-full">
          
          {/* Glowing Frosted Glass Search Input Bar */}
          <div className="relative max-w-xl mx-auto w-full group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-orange-500 transition-colors">
              <Search size={18} />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for a video type, format, or use case..."
              className="w-full pl-11 pr-11 py-3 rounded-full border border-zinc-200/90 bg-white/95 backdrop-blur-md text-zinc-900 placeholder:text-zinc-400 text-sm font-medium focus:outline-none focus:ring-4 focus:ring-orange-500/15 focus:border-orange-500 transition-all shadow-[0_4px_20px_-4px_rgba(249,115,22,0.08)] group-hover:border-orange-300"
            />
            {searchQuery ? (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-zinc-400 hover:text-orange-600 cursor-pointer transition-colors"
                title="Clear search"
              >
                <X size={17} />
              </button>
            ) : (
              <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                <span className="hidden sm:inline-block px-2 py-0.5 rounded-md bg-zinc-100 border border-zinc-200 text-[10px] font-mono font-semibold text-zinc-500">
                  Ctrl+K
                </span>
              </div>
            )}
          </div>

          {/* Vibrant Category Filter Pills with Icons */}
          <div className="flex items-center justify-start sm:justify-center gap-2 overflow-x-auto pb-2 pt-1 px-1 no-scrollbar [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
            {CATEGORY_TABS.map((tab) => {
              const isActive = selectedCategory === tab.id;
              const TabIcon = tab.icon;

              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setSelectedCategory(tab.id)}
                  className={`group shrink-0 inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold transition-all duration-200 cursor-pointer select-none ${
                    isActive
                      ? 'bg-gradient-to-r from-orange-600 via-amber-600 to-orange-500 text-white shadow-md shadow-orange-500/25 scale-102 border border-orange-500'
                      : 'bg-white hover:bg-orange-50/60 text-zinc-700 hover:text-orange-700 border border-zinc-200/90 hover:border-orange-300/80 shadow-2xs hover:shadow-xs hover:-translate-y-0.5'
                  }`}
                >
                  <TabIcon
                    size={14}
                    className={`transition-colors ${
                      isActive ? 'text-white' : tab.colorClass
                    }`}
                  />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Active Search & Filter Indicator */}
          {(searchQuery || selectedCategory !== 'all') && (
            <div className="flex items-center justify-between text-xs text-zinc-600 px-3 pt-1">
              <span>
                Showing <strong className="text-zinc-950 font-bold">{filteredStudios.length}</strong> of{' '}
                <strong className="text-zinc-950 font-bold">{ALL_15_STUDIOS.length}</strong> studios
                {searchQuery && (
                  <span>
                    {' '}matching &ldquo;<span className="text-orange-600 font-semibold">{searchQuery}</span>&rdquo;
                  </span>
                )}
              </span>
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('all');
                }}
                className="text-orange-600 hover:text-orange-700 font-bold cursor-pointer underline underline-offset-2"
              >
                Reset filters
              </button>
            </div>
          )}
        </div>

        {/* 16:9 Video Studios Grid */}
        {filteredStudios.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6 sm:gap-7">
            {filteredStudios.map((studio) => {
              const Icon = studio.icon;

              return (
                <div
                  key={studio.id}
                  onClick={() => handleCardClick(studio)}
                  className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-zinc-200/90 bg-white hover:border-orange-500/40 hover:shadow-[0_20px_40px_-15px_rgba(249,115,22,0.14)] transition-all duration-300 hover:-translate-y-1.5 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.04)] cursor-pointer text-left"
                >
                  <div>
                    {/* 16:9 Curated Preview Canvas */}
                    <div className="relative aspect-[16/9] w-full overflow-hidden bg-zinc-100 border-b border-zinc-100">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={getOptimizedCloudinaryUrl(studio.imageCard, 640)}
                        alt={studio.title}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        loading="lazy"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src =
                            getOptimizedCloudinaryUrl('https://res.cloudinary.com/dhouh9idx/image/upload/v1792945592/file_000000004290821180a71f25ad75480e_nztpwe.png', 640);
                        }}
                      />

                      {/* Top Right Aspect / Feature Badge */}
                      <div className="absolute top-2.5 right-2.5 z-10 flex items-center gap-1.5">
                        <span
                          className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold backdrop-blur-md border ${
                            studio.isFree
                              ? 'bg-emerald-600/90 text-white border-emerald-400/30'
                              : 'bg-zinc-950/80 text-white border-white/10'
                          }`}
                        >
                          {studio.badge || studio.aspectRatio}
                        </span>
                      </div>

                      {/* Aspect Ratio Indicator Pill */}
                      <div className="absolute bottom-2.5 left-2.5 z-10">
                        <span className="px-2 py-0.5 rounded-full bg-zinc-950/80 text-[10px] font-mono font-medium text-white border border-white/10 backdrop-blur-md">
                          {studio.aspectRatio}
                        </span>
                      </div>

                      {/* Subtle Hover Gradient Accent */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                    </div>

                    {/* Studio Information Area */}
                    <div className="p-4 sm:p-5">
                      <div className="flex items-center gap-2.5 mb-2">
                        <div
                          className={`flex h-8 w-8 items-center justify-center rounded-lg ${studio.iconBgClass} ${studio.iconColorClass} shrink-0`}
                        >
                          <Icon size={16} />
                        </div>
                        <h3 className="text-base font-bold text-zinc-950 tracking-tight group-hover:text-orange-600 transition-colors line-clamp-1">
                          {studio.title}
                        </h3>
                      </div>

                      <p className="text-xs text-zinc-600 leading-relaxed line-clamp-2 min-h-[34px]">
                        {studio.description}
                      </p>
                    </div>
                  </div>

                  {/* Clean Bottom Bar with Micro-Action */}
                  <div
                    className="px-4 pb-4 pt-3 border-t border-zinc-100 flex items-center justify-between gap-2"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {/* What It Does (Dedicated Specification Link) */}
                    <Link
                      href={studio.publicHref}
                      title={`View ${studio.title} guide & specification`}
                      className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-zinc-600 hover:text-orange-600 transition-colors"
                    >
                      <BookOpen size={13} className="text-zinc-400 group-hover:text-orange-600" />
                      <span>What It Does</span>
                    </Link>

                    {/* Launch / Create Arrow Action */}
                    <button
                      type="button"
                      onClick={() => handleCardClick(studio)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-zinc-100 hover:bg-orange-600 text-zinc-700 hover:text-white transition-all duration-200 text-xs font-bold cursor-pointer group/btn"
                    >
                      <span>Create</span>
                      <ArrowRight size={13} className="transition-transform group-hover/btn:translate-x-0.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* Empty Search Results */
          <div className="text-center py-16 px-4 rounded-2xl border border-dashed border-zinc-200 bg-zinc-50/50 max-w-lg mx-auto space-y-3">
            <p className="text-sm font-semibold text-zinc-800">
              No studios found matching &ldquo;{searchQuery}&rdquo;
            </p>
            <p className="text-xs text-zinc-500">
              Try searching for &ldquo;faceless&rdquo;, &ldquo;captions&rdquo;, &ldquo;clips&rdquo;, or &ldquo;youtube&rdquo;.
            </p>
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
              }}
              className="mt-2 inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-zinc-950 text-white text-xs font-bold hover:bg-zinc-800 transition-colors cursor-pointer"
            >
              View All 15 Studios
            </button>
          </div>
        )}

        {/* Bottom Accent Banner (Ready to create something amazing?) */}
        <div className="relative overflow-hidden rounded-2xl border border-orange-200/80 bg-gradient-to-r from-orange-50 via-amber-50 to-orange-50/60 p-6 sm:p-8 text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-6 shadow-sm">
          <div className="space-y-1.5 max-w-2xl">
            <div className="flex items-center justify-center sm:justify-start gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-orange-600 text-white shrink-0">
                <Zap size={14} />
              </div>
              <h3 className="text-base sm:text-lg font-black text-zinc-950">
                Ready to create something amazing?
              </h3>
            </div>
            <p className="text-xs sm:text-sm text-zinc-600 leading-relaxed">
              Start with any studio above or explore all 15 specialized video creators. No video editing timeline required.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0 w-full sm:w-auto">
            <Link
              href="/dashboard"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 px-6 py-3 text-xs sm:text-sm font-bold text-white shadow-md shadow-orange-500/20 active:scale-95 transition-all text-center"
            >
              <Sparkles size={15} />
              <span>Launch Any Studio</span>
              <ArrowRight size={15} />
            </Link>

            <Link
              href="/video-types"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 rounded-full border border-zinc-300 bg-white hover:bg-zinc-50 px-5 py-3 text-xs sm:text-sm font-semibold text-zinc-700 hover:text-zinc-950 shadow-xs active:scale-95 transition-all text-center"
            >
              <BookOpen size={14} />
              <span>Explore All 15 Specs</span>
            </Link>
          </div>
        </div>

      </div>

      {/* Format Selector Modal for Dual-Aspect Studios */}
      <FormatSelectorModal
        isOpen={!!selectedToolForModal}
        onClose={() => setSelectedToolForModal(null)}
        tool={selectedToolForModal}
      />
    </section>
  );
}
