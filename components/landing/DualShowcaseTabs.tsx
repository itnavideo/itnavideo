'use client';

import React, { useRef, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, Play, Film, Volume2, VolumeX, Captions } from 'lucide-react';
import { SUBTITLE_PRESETS } from '@/remotion/types/subtitles';
import {
  CaptionPreviewText,
  PREVIEW_CONFIG,
} from '@/components/ui/SubtitleStylePicker';
import previewTranscripts from '@/lib/cloudinary/autocaption-transcripts.json';
import {
  getPreviewCaptionAtTime,
  type SavedPreviewTranscript,
} from '@/lib/captions/previewTranscript';
import {
  getPresetVideoFilename,
  getPresetVideoUrl,
  getPresetPosterUrl,
} from '@/components/dashboard/AutoCaptionStyleCarousel';
import { HOMEPAGE_IMAGE_TO_VIDEO_ITEMS, type ImageToVideoCloudinaryItem } from './ImageToVideoHomepageShowcase';

const SHOWCASE_STYLE_KEYS = [
  'Hormozi Viral Pop',
  'Shorts Karaoke',
  'Submagic Glow',
  'MrBeast Shorts Impact',
  'Vox Documentary',
  'Crazy',
  'Ali Abdaal Clean Pill',
  'Diary of a CEO',
  'Rainbow Pop',
  'Cyber Lime Pill',
];

interface CaptionCardProps {
  presetKey: string;
}

function CaptionCard({ presetKey }: CaptionCardProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackTime, setPlaybackTime] = useState(0);

  const presetData = SUBTITLE_PRESETS[presetKey];
  const videoFilename = getPresetVideoFilename(presetKey);
  const videoUrl = getPresetVideoUrl(presetKey);
  const posterUrl = getPresetPosterUrl(presetKey);

  const savedTranscript = (previewTranscripts as Record<string, SavedPreviewTranscript>)[videoFilename];
  const caption = getPreviewCaptionAtTime(savedTranscript, playbackTime);
  const activeWordObj = caption?.words.find(
    (w) => playbackTime >= w.start && playbackTime <= w.end
  );

  const presetOption = presetData
    ? {
        key: presetKey,
        label: presetData.name,
        style: presetData.style,
        font: presetData.fontFamily,
        textColor: presetData.textColor,
        highlightColor: presetData.highlightColor,
        bgColor: presetData.backgroundColor,
      }
    : undefined;

  const previewConfig = PREVIEW_CONFIG[presetKey] || {
    sampleLines: ["VIRAL CAPTIONS", "THAT POP"],
    activeWord: "VIRAL",
  };

  const handleTogglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play().catch(() => {});
      setIsPlaying(true);
    }
  };

  return (
    <div
      onClick={handleTogglePlay}
      className="relative flex-shrink-0 w-[180px] sm:w-[210px] md:w-[230px] group cursor-pointer select-none"
    >
      <div className="relative w-full aspect-[9/16] rounded-[24px] overflow-hidden border border-slate-200/90 bg-[#090A0F] shadow-lg group-hover:border-orange-500/60 group-hover:shadow-xl group-hover:shadow-orange-500/20 transition-all duration-300 group-hover:-translate-y-1">
        <div className="absolute top-2.5 left-2.5 z-20 pointer-events-none">
          <span className="inline-flex items-center gap-1 rounded-full border border-white/15 bg-black/75 backdrop-blur-md px-2 py-0.5 text-[9px] font-black uppercase text-amber-400">
            <Sparkles size={10} className="text-[#FF5722]" />
            <span>{presetKey}</span>
          </span>
        </div>

        <video
          ref={videoRef}
          src={videoUrl}
          poster={posterUrl}
          muted
          loop
          playsInline
          preload="metadata"
          onTimeUpdate={() => {
            if (videoRef.current) {
              setPlaybackTime(videoRef.current.currentTime);
            }
          }}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          className="absolute inset-0 w-full h-full object-cover"
        />

        {presetOption && caption && (
          <>
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[48%] bg-gradient-to-t from-black/85 via-black/35 to-transparent z-10" />
            <div className="pointer-events-none absolute inset-x-2 bottom-[22%] z-20 flex justify-center px-1 text-center">
              <CaptionPreviewText
                preset={presetOption}
                config={previewConfig}
                chunk={caption}
                playbackTime={playbackTime}
                isPlaying={isPlaying}
                activeWord={activeWordObj?.word || caption.activeWord}
                currentWordObj={activeWordObj}
              />
            </div>
          </>
        )}

        {!isPlaying && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-30">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-black/60 border border-white/25 backdrop-blur-sm group-hover:bg-[#FF5722] transition-all duration-300 shadow-lg">
              <Play size={18} className="fill-white text-white ml-0.5" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function ImageCard({ item }: { item: ImageToVideoCloudinaryItem }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  const handleTogglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play().catch(() => {});
      setIsPlaying(true);
    }
  };

  return (
    <div
      onClick={handleTogglePlay}
      className="relative flex-shrink-0 w-[280px] sm:w-[340px] md:w-[380px] group cursor-pointer select-none"
    >
      <div className="relative w-full aspect-video rounded-[24px] overflow-hidden border border-slate-200/90 bg-[#090A0F] shadow-lg group-hover:border-orange-500/60 group-hover:shadow-xl group-hover:shadow-orange-500/20 transition-all duration-300 group-hover:-translate-y-1">
        <div className="absolute top-2.5 left-2.5 z-20 pointer-events-none">
          <span className="inline-flex items-center gap-1 rounded-full border border-white/15 bg-black/80 backdrop-blur-md px-2.5 py-0.5 text-[9.5px] font-black uppercase text-amber-400">
            <Sparkles size={10} className="text-[#FF5722]" />
            <span>{item.tag}</span>
          </span>
        </div>

        <video
          ref={videoRef}
          src={item.videoUrl}
          poster={item.posterUrl}
          muted={isMuted}
          loop
          playsInline
          preload="metadata"
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          className="absolute inset-0 w-full h-full object-cover"
        />

        {!isPlaying && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-30 bg-black/20 group-hover:bg-black/40 transition">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-black/70 border border-white/25 backdrop-blur-sm group-hover:bg-[#FF5722] group-hover:scale-110 transition-all duration-300 shadow-xl">
              <Play size={20} className="fill-white text-white ml-0.5" />
            </div>
          </div>
        )}

        {isPlaying && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setIsMuted(!isMuted);
            }}
            className="absolute top-2.5 right-2.5 z-30 flex h-7 w-7 items-center justify-center rounded-full bg-black/70 border border-white/20 text-white backdrop-blur-md hover:bg-black transition cursor-pointer"
          >
            {isMuted ? <VolumeX size={12} /> : <Volume2 size={12} className="text-emerald-400" />}
          </button>
        )}

        <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-black/90 via-black/40 to-transparent pointer-events-none z-20 flex items-center justify-between">
          <span className="text-xs font-black text-white truncate drop-shadow">{item.title}</span>
          <span className="text-[9px] font-mono font-bold text-amber-400 bg-black/60 px-2 py-0.5 rounded-full border border-white/10">1080p MP4</span>
        </div>
      </div>
    </div>
  );
}

export default function DualShowcaseTabs() {
  const [activeTab, setActiveTab] = useState<'captions' | 'imageToVideo'>('captions');
  const [isPaused, setIsPaused] = useState(false);

  const captionItems = [...SHOWCASE_STYLE_KEYS, ...SHOWCASE_STYLE_KEYS];
  const imageItems = [...HOMEPAGE_IMAGE_TO_VIDEO_ITEMS, ...HOMEPAGE_IMAGE_TO_VIDEO_ITEMS];

  return (
    <section className="relative w-full overflow-hidden bg-white border-b border-slate-200/80 py-14 sm:py-20 text-slate-900">
      <div className="pointer-events-none absolute left-1/2 top-0 -translate-x-1/2 w-[700px] h-[300px] bg-orange-500/10 blur-[140px] rounded-full" />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Header & Tabs */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
          <div>
            <div className="mb-2 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-orange-600">
              <Sparkles size={13} className="text-[#FF5722]" />
              <span>LIVE OUTPUT PREVIEWS</span>
            </div>
            <h2 className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-4xl font-heading">
              Studio Visuals.{' '}
              <span className="bg-gradient-to-r from-[#FF5722] via-[#FF7043] to-[#FFA000] bg-clip-text text-transparent">
                Tap to play real renders.
              </span>
            </h2>
            <p className="mt-1 text-xs sm:text-sm text-slate-600 max-w-xl">
              Inspect live word-by-word kinetic subtitle presets and 16:9 cinematic parallax video beats rendered on our cloud engine.
            </p>
          </div>

          {/* Interactive Switcher Pill */}
          <div className="flex flex-wrap items-center gap-2 bg-white p-1.5 rounded-2xl border border-slate-200 shadow-2xs shrink-0">
            <button
              type="button"
              onClick={() => setActiveTab('captions')}
              className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition cursor-pointer ${
                activeTab === 'captions'
                  ? 'bg-gradient-to-r from-[#FF5722] to-[#FFA000] text-white shadow-md'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Captions size={14} />
              <span>Kinetic Subtitles (9:16)</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('imageToVideo')}
              className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition cursor-pointer ${
                activeTab === 'imageToVideo'
                  ? 'bg-gradient-to-r from-[#FF5722] to-[#FFA000] text-white shadow-md'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Film size={14} />
              <span>Image to Video AI (16:9)</span>
            </button>
          </div>
        </div>

        {/* Carousel Container */}
        <div
          className="relative w-full overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_4%,black_96%,transparent)]"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {activeTab === 'captions' ? (
            <motion.div
              key="captions-track"
              className="flex gap-4 w-max"
              animate={isPaused ? { x: undefined } : { x: ['0%', '-50%'] }}
              transition={{
                x: {
                  repeat: Infinity,
                  repeatType: 'loop',
                  duration: 38,
                  ease: 'linear',
                },
              }}
            >
              {captionItems.map((presetKey, idx) => (
                <CaptionCard key={`${presetKey}-${idx}`} presetKey={presetKey} />
              ))}
            </motion.div>
          ) : (
            <motion.div
              key="images-track"
              className="flex gap-5 w-max"
              animate={isPaused ? { x: undefined } : { x: ['0%', '-50%'] }}
              transition={{
                x: {
                  repeat: Infinity,
                  repeatType: 'loop',
                  duration: 32,
                  ease: 'linear',
                },
              }}
            >
              {imageItems.map((item, idx) => (
                <ImageCard key={`${item.id}-${idx}`} item={item} />
              ))}
            </motion.div>
          )}
        </div>

        {/* Bottom CTA Row */}
        <div className="mt-8 flex justify-center">
          <Link
            href={activeTab === 'captions' ? '/dashboard/auto-caption' : '/dashboard/image-to-video-ai'}
            className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-6 py-2.5 text-xs font-bold text-slate-800 shadow-2xs hover:border-orange-500/50 hover:bg-orange-50/50 hover:text-orange-950 transition active:scale-95"
          >
            <span>{activeTab === 'captions' ? 'Open Auto Caption Studio →' : 'Open Image to Video Studio →'}</span>
          </Link>
        </div>

      </div>
    </section>
  );
}
