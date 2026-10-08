'use client';

import React, { useState, useRef } from 'react';
import Link from 'next/link';
import { Play, Sparkles, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';

export interface DemoVideoItem {
  id: string;
  videoUrl: string;
  posterUrl: string;
}

// ==================== 1. AUTO CAPTION & CAPTION STUDIO (9 VIDEOS) ====================
export const AUTO_CAPTION_DEMO_VIDEOS: DemoVideoItem[] = [
  {
    id: 'ac-1',
    videoUrl: 'https://res.cloudinary.com/dhouh9idx/video/upload/v1789982713/km_20260916-3_1080p_30f_20260916_232040_qtcjtv.3gp',
    posterUrl: 'https://res.cloudinary.com/dhouh9idx/video/upload/v1789982713/km_20260916-3_1080p_30f_20260916_232040_qtcjtv.jpg',
  },
];

// ==================== 2. COMPARE EXPLAINER (9 VIDEOS) ====================
export const COMPARE_EXPLAINER_DEMO_VIDEOS: DemoVideoItem[] = [
  {
    id: 'ce-1',
    videoUrl: 'https://res.cloudinary.com/dhouh9idx/video/upload/v1789985898/90_People_Confuse_These_Two_learnenglish_difference_trendingreel_english_hnepyd.mp4',
    posterUrl: 'https://res.cloudinary.com/dhouh9idx/video/upload/v1789985898/90_People_Confuse_These_Two_learnenglish_difference_trendingreel_english_hnepyd.jpg',
  },
];

// ==================== 3. KINETIC TYPOGRAPHY (9 VIDEOS) ====================
export const TYPOGRAPHY_DEMO_VIDEOS: DemoVideoItem[] = [
  {
    id: 'ty-1',
    videoUrl: 'https://res.cloudinary.com/dhouh9idx/video/upload/v1789986055/Video-98200_zwmwrf.mp4',
    posterUrl: 'https://res.cloudinary.com/dhouh9idx/video/upload/v1789986055/Video-98200_zwmwrf.jpg',
  },
];

// ==================== 4. IMAGE TO VIDEO AI (16:9 CINEMA DEMOS - 5 CLOUDINARY VIDEOS) ====================
export const IMAGE_TO_VIDEO_DEMO_VIDEOS: DemoVideoItem[] = [
  {
    id: 'itv-1',
    videoUrl: 'https://res.cloudinary.com/dhouh9idx/video/upload/v1791489914/InShot_20261009_011644112_vtrkhq.mp4',
    posterUrl: 'https://res.cloudinary.com/dhouh9idx/video/upload/so_3/v1791489914/InShot_20261009_011644112_vtrkhq.jpg',
  },
  {
    id: 'itv-2',
    videoUrl: 'https://res.cloudinary.com/dhouh9idx/video/upload/v1791489914/InShot_20261009_011245820_oqja39.mp4',
    posterUrl: 'https://res.cloudinary.com/dhouh9idx/video/upload/so_3/v1791489914/InShot_20261009_011245820_oqja39.jpg',
  },
  {
    id: 'itv-3',
    videoUrl: 'https://res.cloudinary.com/dhouh9idx/video/upload/v1791489918/InShot_20261009_011006327_vedacf.mp4',
    posterUrl: 'https://res.cloudinary.com/dhouh9idx/video/upload/so_3/v1791489918/InShot_20261009_011006327_vedacf.jpg',
  },
  {
    id: 'itv-4',
    videoUrl: 'https://res.cloudinary.com/dhouh9idx/video/upload/v1791489914/InShot_20261009_011836714_jz0sxu.mp4',
    posterUrl: 'https://res.cloudinary.com/dhouh9idx/video/upload/so_3/v1791489914/InShot_20261009_011836714_jz0sxu.jpg',
  },
  {
    id: 'itv-5',
    videoUrl: 'https://res.cloudinary.com/dhouh9idx/video/upload/v1791489916/InShot_20261009_012727569_wfvxcv.mp4',
    posterUrl: 'https://res.cloudinary.com/dhouh9idx/video/upload/so_3/v1791489916/InShot_20261009_012727569_wfvxcv.jpg',
  },
];

// ==================== 5. FACELESS VIDEO (16:9 YOUTUBE DEMOS) ====================
export const FACELESS_VIDEO_DEMO_VIDEOS: DemoVideoItem[] = [
  {
    id: 'fv-1',
    videoUrl: 'https://res.cloudinary.com/dhouh9idx/video/upload/v1789986670/km_20260917_1080p_30f_20260917_001214_xkikfu.3gp',
    posterUrl: 'https://res.cloudinary.com/dhouh9idx/video/upload/v1789986670/km_20260917_1080p_30f_20260917_001214_xkikfu.jpg',
  },
];

// ==================== CLEAN VIDEO CARD (NO TEXT OVERLAY) ====================
interface CleanVideoCardProps {
  video: DemoVideoItem;
  isPlaying: boolean;
  onPlay: (id: string) => void;
  onEnded: () => void;
  aspectRatio?: '9/16' | '16:9';
}

function CleanVideoCard({ video, isPlaying, onPlay, onEnded, aspectRatio = '9/16' }: CleanVideoCardProps) {
  const isWidescreen = aspectRatio === '16:9';
  const [imgError, setImgError] = useState(false);

  return (
    <div className={`group relative flex-none ${isWidescreen ? 'w-[300px] sm:w-[380px] md:w-[440px]' : 'w-[220px] sm:w-[250px] md:w-[270px]'} snap-start rounded-2xl overflow-hidden bg-black shadow-md transition-all duration-300 hover:shadow-xl hover:scale-[1.01] border border-white/10`}>
      <div className={`relative ${isWidescreen ? 'aspect-video' : 'aspect-[9/16]'} w-full overflow-hidden bg-black`}>
        {isPlaying ? (
          <video
            src={video.videoUrl}
            controls
            autoPlay
            playsInline
            className="h-full w-full object-cover"
            onEnded={onEnded}
          />
        ) : (
          <>
            {!imgError ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={video.posterUrl}
                alt="AI Video creation output demo preview"
                width={isWidescreen ? 440 : 270}
                height={isWidescreen ? 248 : 480}
                loading="lazy"
                decoding="async"
                onError={() => setImgError(true)}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
            ) : (
              <video
                src={video.videoUrl}
                muted
                playsInline
                preload="metadata"
                className="h-full w-full object-cover"
              />
            )}

            {/* Play Button Overlay (Click to Play) */}
            <button
              onClick={() => onPlay(video.id)}
              className="absolute inset-0 flex items-center justify-center cursor-pointer bg-black/10 hover:bg-black/30 transition"
              aria-label="Play video"
            >
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white/95 text-zinc-100 shadow-2xl backdrop-blur-sm transition-all duration-300 group-hover:scale-110 group-hover:bg-orange-500 group-hover:text-white">
                <Play size={24} className="ml-1 fill-current" />
              </div>
            </button>
          </>
        )}
      </div>
    </div>
  );
}

// ==================== SEPARATE VIDEO TYPE ROW COMPONENT ====================
export interface VideoTypeRowProps {
  badge: string;
  heading: string;
  explanation: string;
  videos: DemoVideoItem[];
  createHref: string;
  createLabel: string;
  activePlayingId: string | null;
  onPlay: (id: string) => void;
  onEnded: () => void;
  aspectRatio?: '9/16' | '16:9';
}

export function VideoTypeRow({
  badge,
  heading,
  explanation,
  videos,
  createHref,
  createLabel,
  activePlayingId,
  onPlay,
  onEnded,
  aspectRatio = '9/16',
}: VideoTypeRowProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = direction === 'left' ? -360 : 360;
      scrollContainerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <div className="py-14 border-b border-slate-200 last:border-b-0 text-[#0F172A]">
      {/* Header Info & Desktop Navigation */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-orange-500/20 bg-orange-50 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-orange-700 mb-2">
            <Sparkles size={13} className="text-orange-600 animate-pulse" />
            <span>{badge}</span>
          </div>

          <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 font-sans">
            {heading}
          </h3>

          <p className="mt-2 text-sm sm:text-base text-slate-600 leading-relaxed font-normal">
            {explanation}
          </p>
        </div>

        {/* Action Button & Desktop Arrows */}
        <div className="flex items-center gap-3 shrink-0">
          <Link
            href={createHref}
            className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 px-4 py-2.5 text-xs font-bold text-white shadow-md shadow-orange-500/20 transition active:scale-95"
          >
            <span>{createLabel}</span>
            <ArrowRight size={14} />
          </Link>

          <div className="hidden sm:flex items-center gap-1.5">
            <button
              onClick={() => scroll('left')}
              className="flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-2xs hover:bg-slate-50 hover:text-slate-900 transition active:scale-95 cursor-pointer"
              aria-label="Scroll left"
            >
              <ChevronLeft size={16} />
            </button>
            <button
              onClick={() => scroll('right')}
              className="flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-2xs hover:bg-slate-50 hover:text-slate-900 transition active:scale-95 cursor-pointer"
              aria-label="Scroll right"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Clean Horizontal Scrollable Video Row */}
      <div
        ref={scrollContainerRef}
        className="flex gap-4 sm:gap-5 overflow-x-auto pb-4 pt-1 snap-x snap-mandatory scroll-smooth no-scrollbar"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {videos.map((video) => (
          <CleanVideoCard
            key={video.id}
            video={video}
            isPlaying={activePlayingId === video.id}
            onPlay={onPlay}
            onEnded={onEnded}
            aspectRatio={aspectRatio}
          />
        ))}
      </div>
    </div>
  );
}

// ==================== DEDICATED STANDALONE COMPONENTS ====================

export function AutoCaptionDemoSection() {
  const [activePlayingId, setActivePlayingId] = useState<string | null>(null);

  return (
    <VideoTypeRow
      badge="Auto Caption Generator"
      heading="Auto Caption Generator Demos"
      explanation="Generate viral talking reels with sub-second accurate subtitles, dynamic active-word highlighting, and customizable typography themes."
      videos={AUTO_CAPTION_DEMO_VIDEOS}
      createHref="/dashboard?videoType=auto-caption-generator"
      createLabel="Generate Auto Captions"
      activePlayingId={activePlayingId}
      onPlay={(id) => setActivePlayingId((prev) => (prev === id ? null : id))}
      onEnded={() => setActivePlayingId(null)}
    />
  );
}

export function CompareExplainerDemoSection() {
  const [activePlayingId, setActivePlayingId] = useState<string | null>(null);

  return (
    <VideoTypeRow
      badge="Compare Explainer Video"
      heading="Compare Explainer Video Demos"
      explanation="Explain side-by-side differences between two products, concepts, or rules with animated stickman avatars, split layouts, and voiceover subtitles."
      videos={COMPARE_EXPLAINER_DEMO_VIDEOS}
      createHref="/dashboard?videoType=compare-explainer"
      createLabel="Create Compare Explainer"
      activePlayingId={activePlayingId}
      onPlay={(id) => setActivePlayingId((prev) => (prev === id ? null : id))}
      onEnded={() => setActivePlayingId(null)}
    />
  );
}

export function TypographyDemoSection() {
  const [activePlayingId, setActivePlayingId] = useState<string | null>(null);

  return (
    <VideoTypeRow
      badge="Kinetic Typography Video"
      heading="Kinetic Typography Video Demos"
      explanation="Transform speech, quotes, and voiceovers into high-energy kinetic text animations synced dynamically to every spoken word."
      videos={TYPOGRAPHY_DEMO_VIDEOS}
      createHref="/dashboard?videoType=typography-video"
      createLabel="Create Typography Video"
      activePlayingId={activePlayingId}
      onPlay={(id) => setActivePlayingId((prev) => (prev === id ? null : id))}
      onEnded={() => setActivePlayingId(null)}
    />
  );
}

export function FacelessVideoDemoSection() {
  const [activePlayingId, setActivePlayingId] = useState<string | null>(null);

  return (
    <VideoTypeRow
      badge="Faceless Video (16:9 YouTube)"
      heading="Faceless Video Demos (16:9 YouTube)"
      explanation="Convert long voiceovers up to 20 minutes into complete 16:9 YouTube videos with AI image storytelling, Canva background themes, and synced subtitles."
      videos={FACELESS_VIDEO_DEMO_VIDEOS}
      createHref="/dashboard?videoType=faceless-video"
      createLabel="Create Faceless Video"
      aspectRatio="16:9"
      activePlayingId={activePlayingId}
      onPlay={(id) => setActivePlayingId((prev) => (prev === id ? null : id))}
      onEnded={() => setActivePlayingId(null)}
    />
  );
}

// ==================== MASTER DEMO VIDEOS SHOWCASE ====================
export default function DemoVideosShowcase() {
  const [activePlayingId, setActivePlayingId] = useState<string | null>(null);

  const handlePlay = (id: string) => {
    setActivePlayingId((prev) => (prev === id ? null : id));
  };

  const handleEnded = () => {
    setActivePlayingId(null);
  };

  return (
    <section id="demo-videos" className="relative overflow-hidden bg-white py-20 border-t border-slate-200 text-[#0F172A]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Main Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 rounded-full border border-orange-500/20 bg-orange-50 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-orange-700 shadow-2xs">
            <Sparkles size={14} className="text-orange-600 animate-pulse" />
            <span>REAL CLOUD RENDERED DEMOS</span>
          </div>

          <h2 className="mt-4 font-sans text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl md:text-5xl">
            Watch Live <span className="bg-gradient-to-r from-[#FF6D00] via-[#FF8F00] to-[#FFA726] bg-clip-text text-transparent">AI Video Output Demos</span>
          </h2>

          <p className="mt-3 text-base sm:text-lg text-slate-600">
            Real short-form reels and explainers rendered with Itnavideo. Tap any video to play instantly.
          </p>
        </div>

        {/* 1. Image to Video AI Row (16:9 Cinema Demos) */}
        <VideoTypeRow
          badge="Image to Video AI (16:9 Cinema)"
          heading="Image to Video AI Demos"
          explanation="Transform voiceovers and photos into cinematic 16:9 widescreen videos with smooth Ken Burns camera pan/zoom, parallax subtitles, and ambient transitions."
          videos={IMAGE_TO_VIDEO_DEMO_VIDEOS}
          createHref="/dashboard/image-to-video"
          createLabel="Create Image to Video"
          aspectRatio="16:9"
          activePlayingId={activePlayingId}
          onPlay={handlePlay}
          onEnded={handleEnded}
        />

        {/* 2. Auto Caption Generator Row (9 Videos) */}
        <VideoTypeRow
          badge="Auto Caption Generator"
          heading="Auto Caption Generator Demos"
          explanation="Generate viral talking reels with sub-second accurate subtitles, dynamic active-word highlighting, and customizable typography themes."
          videos={AUTO_CAPTION_DEMO_VIDEOS}
          createHref="/dashboard/auto-caption"
          createLabel="Generate Auto Captions"
          activePlayingId={activePlayingId}
          onPlay={handlePlay}
          onEnded={handleEnded}
        />

        {/* 3. Compare Explainer Video Row (9 Videos) */}
        <VideoTypeRow
          badge="Compare Explainer Video"
          heading="Compare Explainer Video Demos"
          explanation="Explain side-by-side differences between two products, concepts, or rules with animated stickman avatars, split layouts, and voiceover subtitles."
          videos={COMPARE_EXPLAINER_DEMO_VIDEOS}
          createHref="/dashboard/compare-explainer"
          createLabel="Create Compare Explainer"
          activePlayingId={activePlayingId}
          onPlay={handlePlay}
          onEnded={handleEnded}
        />

        {/* 4. Kinetic Typography Video Row (9 Videos) */}
        <VideoTypeRow
          badge="Kinetic Typography Video"
          heading="Kinetic Typography Video Demos"
          explanation="Transform speech, quotes, and voiceovers into high-energy kinetic text animations synced dynamically to every spoken word."
          videos={TYPOGRAPHY_DEMO_VIDEOS}
          createHref="/dashboard/typography-video"
          createLabel="Create Typography Video"
          activePlayingId={activePlayingId}
          onPlay={handlePlay}
          onEnded={handleEnded}
        />

        {/* 5. Faceless Video Row (16:9 YouTube Demos) */}
        <VideoTypeRow
          badge="Faceless Video (16:9 YouTube)"
          heading="Faceless Video Demos (16:9 YouTube)"
          explanation="Convert long voiceovers up to 20 minutes into complete 16:9 YouTube videos with AI image storytelling, Canva background themes, and synced subtitles."
          videos={FACELESS_VIDEO_DEMO_VIDEOS}
          createHref="/dashboard/faceless-video"
          createLabel="Create Faceless Video"
          aspectRatio="16:9"
          activePlayingId={activePlayingId}
          onPlay={handlePlay}
          onEnded={handleEnded}
        />

        {/* Bottom Banner CTA */}
        <div className="mt-14 rounded-3xl border border-slate-200 bg-[#F8FAFC] p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left shadow-sm">
          <div className="space-y-1">
            <h3 className="text-base font-bold text-slate-900">
              Ready to generate your own high-retention videos in seconds?
            </h3>
            <p className="text-xs sm:text-sm text-slate-600">
              Upload your audio, video, or script and let Itnavideo handle captions, animations, and rendering.
            </p>
          </div>
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 px-6 py-3.5 text-sm font-black text-white shadow-lg shadow-orange-500/25 transition hover:scale-[1.02] active:scale-95 shrink-0"
          >
            <span>Launch Studio Free ⚡</span>
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  );
}
