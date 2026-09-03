'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX, Sparkles, Film, Wand2, Check } from 'lucide-react';
import { getTypographyStyle, type TypographyStyle } from '@/components/typography/TypographyStylePicker';

const CREATOR_SAMPLE_VIDEO =
  'https://res.cloudinary.com/dhouh9idx/video/upload/v1788450233/professional-creator-girl-before_rwmxsd.mp4';
const CREATOR_SAMPLE_POSTER =
  'https://res.cloudinary.com/dhouh9idx/video/upload/so_1,w_600,q_auto,f_jpg/v1788450233/professional-creator-girl-before_rwmxsd.jpg';

type TestPhrase = {
  start: number;
  end: number;
  lead: string;
  hero: string;
  sub: string;
};

const TEST_PHRASES: TestPhrase[] = [
  {
    start: 0.0,
    end: 1.85,
    lead: "IF YOUR VIDEOS",
    hero: "AREN'T GETTING VIEWS",
    sub: "viewer drop-off happens fast",
  },
  {
    start: 1.85,
    end: 3.40,
    lead: "IT MIGHT NOT BE",
    hero: "YOUR CONTENT",
    sub: "it's the visual delivery",
  },
  {
    start: 3.40,
    end: 5.85,
    lead: "MOST PEOPLE",
    hero: "SCROLL AWAY",
    sub: "in the first three seconds",
  },
  {
    start: 5.85,
    end: 7.70,
    lead: "THEY CAN'T FOLLOW",
    hero: "WHAT'S BEING SAID",
    sub: "without kinetic text cues",
  },
  {
    start: 7.70,
    end: 10.05,
    lead: "POWERFUL TYPOGRAPHY",
    hero: "HOOKS VIEWERS",
    sub: "watch time and retention explode",
  },
];

export function TypographyPreview({
  typographyStyle,
  captionStyle,
  captionPosition,
  showCaptions = false,
  videoUrl,
}: {
  typographyStyle: string;
  captionStyle?: string;
  captionPosition?: 'bottom' | 'center' | 'top';
  showCaptions?: boolean;
  videoUrl?: string | null;
}) {
  const currentStyle: TypographyStyle = getTypographyStyle(typographyStyle);
  const [viewMode, setViewMode] = useState<'demo' | 'creatorTest'>('demo');
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [playbackTime, setPlaybackTime] = useState(0);
  const [duration, setDuration] = useState(5.0);

  const videoRef = useRef<HTMLVideoElement | null>(null);

  // If user uploaded their own video, prioritize their video
  const activeVideoSrc = videoUrl
    ? videoUrl
    : viewMode === 'demo'
    ? currentStyle.videoSrc
    : CREATOR_SAMPLE_VIDEO;

  const activePosterSrc = videoUrl
    ? undefined
    : viewMode === 'demo'
    ? currentStyle.posterSrc
    : CREATOR_SAMPLE_POSTER;

  // Reset video and play when style or mode changes
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play().catch(() => {});
      setIsPlaying(true);
    }
  }, [typographyStyle, viewMode, videoUrl]);

  // Keep mute state synced
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.muted = isMuted;
    }
  }, [isMuted]);

  // Track playback time
  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setPlaybackTime(videoRef.current.currentTime);
      if (videoRef.current.duration && !isNaN(videoRef.current.duration)) {
        setDuration(videoRef.current.duration);
      }
    }
  };

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play().catch(() => {});
      setIsPlaying(true);
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  // Active phrase for creator test mode
  const currentPhrase =
    TEST_PHRASES.find((p) => playbackTime >= p.start && playbackTime < p.end) || TEST_PHRASES[0];

  // Progress percentage
  const progressPercent = duration > 0 ? (playbackTime / duration) * 100 : 0;

  return (
    <div className="relative flex w-full flex-col items-center">
      {/* ── View Mode Switcher (Demo Video vs Live Creator Overlay Test) ── */}
      {!videoUrl && (
        <div className="mb-2.5 flex items-center gap-1.5 rounded-xl border border-white/10 bg-slate-900/90 p-1 text-xs shadow-lg">
          <button
            type="button"
            onClick={() => setViewMode('demo')}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 font-bold transition cursor-pointer ${
              viewMode === 'demo'
                ? 'bg-gradient-to-r from-purple-500 to-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Film size={13} />
            <span>🎬 Style Demo Video</span>
          </button>
          <button
            type="button"
            onClick={() => setViewMode('creatorTest')}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 font-bold transition cursor-pointer ${
              viewMode === 'creatorTest'
                ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Wand2 size={13} />
            <span>⚡ Live Creator Test</span>
          </button>
        </div>
      )}

      {/* ── Main 9:16 Video Player Frame ── */}
      <div
        className="group relative overflow-hidden rounded-2xl border bg-black shadow-[0_20px_50px_rgba(0,0,0,0.65)] transition-all duration-300 select-none cursor-pointer"
        style={{
          height: 'min(50vh, 440px)',
          aspectRatio: '9 / 16',
          maxWidth: '100%',
          borderColor: currentStyle.accentColor ? `${currentStyle.accentColor}55` : 'rgba(255,255,255,0.15)',
        }}
        onClick={togglePlay}
      >
        {/* Background Video */}
        <video
          ref={videoRef}
          src={activeVideoSrc}
          poster={activePosterSrc}
          autoPlay
          muted={isMuted}
          loop
          playsInline
          preload="auto"
          onTimeUpdate={handleTimeUpdate}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          className="h-full w-full object-cover"
        />

        {/* ── LIVE KINETIC TEXT OVERLAY (When in creator test mode or uploaded video) ── */}
        {(viewMode === 'creatorTest' || videoUrl) && (
          <div className="pointer-events-none absolute inset-0 z-20 flex flex-col justify-center px-4 text-center">
            <DynamicTypographyOverlay style={currentStyle} phrase={currentPhrase} />
          </div>
        )}

        {/* Top Header Floating Overlay: Style Badge & Sound Toggle */}
        <div className="absolute top-0 inset-x-0 z-30 flex items-center justify-between p-3 pointer-events-none bg-gradient-to-b from-black/80 via-black/30 to-transparent">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-black/60 px-2.5 py-1 text-[11px] font-bold text-white shadow-md backdrop-blur-md">
            <span
              className="h-2 w-2 rounded-full animate-pulse"
              style={{ backgroundColor: currentStyle.accentColor || '#38BDF8' }}
            />
            <span className="truncate max-w-[150px]">{currentStyle.name}</span>
            {viewMode === 'demo' && !videoUrl && (
              <span className="rounded bg-white/10 px-1 text-[9px] font-semibold text-slate-300">DEMO</span>
            )}
          </div>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setIsMuted(!isMuted);
            }}
            title={isMuted ? 'Unmute Audio' : 'Mute Audio'}
            className="pointer-events-auto flex h-7 w-7 items-center justify-center rounded-full border border-white/25 bg-black/70 text-white shadow-md transition hover:scale-110 hover:border-cyan-400 hover:text-cyan-300 cursor-pointer backdrop-blur-md"
          >
            {isMuted ? <VolumeX size={14} /> : <Volume2 size={14} className="text-cyan-400" />}
          </button>
        </div>

        {/* Center Play / Pause Indicator */}
        {!isPlaying && (
          <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/35 backdrop-blur-[2px]">
            <div className="flex h-14 w-14 items-center justify-center rounded-full border border-white/30 bg-black/70 text-white shadow-xl transition-transform group-hover:scale-110">
              <Play size={24} className="ml-1 fill-white" />
            </div>
          </div>
        )}

        {/* Bottom Timeline Scrubber */}
        <div className="absolute bottom-0 inset-x-0 z-30 h-1 bg-white/20 pointer-events-none">
          <div
            className="h-full transition-[width] duration-100 ease-linear"
            style={{
              width: `${Math.min(100, Math.max(0, progressPercent))}%`,
              backgroundColor: currentStyle.accentColor || '#38BDF8',
              boxShadow: `0 0 10px ${currentStyle.accentColor || '#38BDF8'}`,
            }}
          />
        </div>
      </div>

      {/* ── Informational Subtitle & Active Style Meta ── */}
      <div className="mt-2.5 flex flex-col items-center text-center max-w-sm px-2">
        <div className="flex items-center gap-1.5 text-xs font-bold text-white">
          <Sparkles size={13} className="text-purple-400" />
          <span>{currentStyle.name}</span>
          <span className="text-slate-500">·</span>
          <span className="text-slate-400 font-normal">{currentStyle.tag}</span>
        </div>
        <p className="mt-0.5 text-[11px] text-slate-400 leading-tight">
          {viewMode === 'demo' && !videoUrl
            ? 'Playing verified style demo reel. Click any card below to switch styles.'
            : 'Testing dynamic kinetic typography text on creator sample video.'}
        </p>
      </div>
    </div>
  );
}

/**
 * Renders the live kinetic typography text styled specifically to match each chosen style.
 */
function DynamicTypographyOverlay({
  style,
  phrase,
}: {
  style: TypographyStyle;
  phrase: TestPhrase;
}) {
  switch (style.id) {
    case 'dubai-gold':
      return (
        <div className="flex flex-col items-center animate-in fade-in zoom-in-95 duration-200">
          <div className="text-[11px] font-black uppercase tracking-[0.25em] text-[#FDE68A] drop-shadow-md">
            {phrase.lead}
          </div>
          <div
            className="mt-1 text-2xl font-black uppercase tracking-tight text-transparent bg-clip-text drop-shadow-[0_4px_12px_rgba(0,0,0,0.8)]"
            style={{
              fontFamily: 'serif',
              backgroundImage: 'linear-gradient(135deg, #FFF9D2 0%, #F5D061 50%, #B8860B 100%)',
              textShadow: '0 0 20px rgba(245, 208, 97, 0.5)',
            }}
          >
            {phrase.hero}
          </div>
          <div className="mt-1.5 rounded-full border border-[#F5D061]/50 bg-black/60 px-3 py-0.5 text-[10px] font-bold text-[#FDE68A] backdrop-blur-md">
            {phrase.sub}
          </div>
        </div>
      );

    case 'depth-3d-text':
      return (
        <div className="flex flex-col items-center animate-in fade-in zoom-in-95 duration-200">
          <div className="rounded-2xl border-2 border-[#FACC15] bg-black/80 px-4 py-2.5 shadow-[0_12px_32px_rgba(250,204,21,0.35)] backdrop-blur-md">
            <div className="text-[10px] font-black uppercase tracking-widest text-slate-300">
              {phrase.lead}
            </div>
            <div className="text-xl font-black uppercase tracking-tight text-[#FACC15] drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">
              {phrase.hero}
            </div>
          </div>
          <div className="mt-2 text-[10px] font-bold text-slate-200 drop-shadow-md">
            {phrase.sub}
          </div>
        </div>
      );

    case 'neon-kinetic':
      return (
        <div className="flex flex-col items-center animate-in fade-in zoom-in-95 duration-200">
          <div className="text-[11px] font-black uppercase tracking-widest text-cyan-300 drop-shadow-[0_0_10px_#22D3EE]">
            {phrase.lead}
          </div>
          <div
            className="mt-0.5 text-2xl font-black uppercase tracking-tight text-white"
            style={{
              textShadow: '0 0 10px #22D3EE, 0 0 25px #06B6D4, 0 0 45px #3B82F6',
            }}
          >
            {phrase.hero}
          </div>
          <div
            className="mt-1 rounded-md bg-fuchsia-500/20 px-2 py-0.5 text-[10px] font-black text-fuchsia-300 border border-fuchsia-400/40"
            style={{ textShadow: '0 0 8px #F43F5E' }}
          >
            {phrase.sub}
          </div>
        </div>
      );

    case 'paper-ii':
      return (
        <div className="flex flex-col items-center -rotate-1 animate-in fade-in zoom-in-95 duration-200">
          <div className="bg-[#FEF08A] text-slate-950 px-3 py-1 font-black text-xs uppercase tracking-wider shadow-lg rounded-sm border-2 border-black/80">
            {phrase.lead}
          </div>
          <div className="mt-1 bg-white text-slate-950 px-3.5 py-1.5 font-black text-lg uppercase tracking-tight shadow-xl rounded-sm border-2 border-black/80">
            {phrase.hero}
          </div>
          <div className="mt-1 bg-slate-900 text-[#FEF08A] px-2 py-0.5 text-[10px] font-bold shadow-md rounded-sm">
            {phrase.sub}
          </div>
        </div>
      );

    case 'elevate-script':
      return (
        <div className="flex flex-col items-center animate-in fade-in zoom-in-95 duration-200">
          <div className="text-[11px] font-bold uppercase tracking-[0.2em] text-slate-300 drop-shadow-md">
            {phrase.lead}
          </div>
          <div
            className="mt-0.5 text-2xl font-normal italic tracking-wide text-[#F5D061]"
            style={{ fontFamily: 'Georgia, serif', textShadow: '0 2px 14px rgba(0,0,0,0.85)' }}
          >
            {phrase.hero}
          </div>
          <div className="mt-1.5 rounded-full border border-white/20 bg-white/10 px-3 py-0.5 text-[10px] font-medium text-slate-200 backdrop-blur-md">
            {phrase.sub}
          </div>
        </div>
      );

    case 'platinum-penthouse':
      return (
        <div className="flex flex-col items-center animate-in fade-in zoom-in-95 duration-200">
          <div className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">
            {phrase.lead}
          </div>
          <div
            className="mt-1 text-xl font-bold uppercase tracking-[0.15em] text-slate-100"
            style={{ fontFamily: 'serif', textShadow: '0 4px 16px rgba(0,0,0,0.9)' }}
          >
            {phrase.hero}
          </div>
          <div className="mt-1 text-[10px] font-medium tracking-wider text-slate-400">
            {phrase.sub}
          </div>
        </div>
      );

    case 'royal-emerald':
      return (
        <div className="flex flex-col items-center animate-in fade-in zoom-in-95 duration-200">
          <div className="rounded-full border border-emerald-400/50 bg-emerald-950/80 px-3 py-0.5 text-[10px] font-black uppercase tracking-wider text-emerald-300 shadow-lg backdrop-blur-md">
            {phrase.lead}
          </div>
          <div
            className="mt-1 text-2xl font-black uppercase tracking-tight text-white"
            style={{
              textShadow: '0 0 15px rgba(16,185,129,0.7), 0 4px 10px rgba(0,0,0,0.9)',
            }}
          >
            {phrase.hero}
          </div>
          <div className="mt-1 text-[10px] font-bold text-emerald-200 drop-shadow-md">
            {phrase.sub}
          </div>
        </div>
      );

    case 'silver-chrome':
      return (
        <div className="flex flex-col items-center animate-in fade-in zoom-in-95 duration-200">
          <div className="text-[10px] font-black uppercase tracking-[0.25em] text-slate-400">
            {phrase.lead}
          </div>
          <div
            className="mt-0.5 text-2xl font-black uppercase tracking-tight text-transparent bg-clip-text"
            style={{
              backgroundImage: 'linear-gradient(180deg, #FFFFFF 0%, #CBD5E1 50%, #64748B 100%)',
              textShadow: '0 4px 20px rgba(255,255,255,0.25)',
            }}
          >
            {phrase.hero}
          </div>
          <div className="mt-1 text-[10px] font-mono text-slate-300 drop-shadow-md">
            {phrase.sub}
          </div>
        </div>
      );

    case 'prism-pro':
      return (
        <div className="flex flex-col items-center animate-in fade-in zoom-in-95 duration-200">
          <div className="rounded-lg border border-cyan-400/40 bg-black/75 px-3.5 py-1 text-[10px] font-black uppercase tracking-widest text-cyan-300 shadow-[0_0_20px_rgba(56,189,248,0.25)] backdrop-blur-md">
            {phrase.lead}
          </div>
          <div className="mt-1 text-2xl font-black uppercase tracking-tight text-white drop-shadow-[0_4px_16px_rgba(0,0,0,0.9)]">
            {phrase.hero}
          </div>
          <div className="mt-0.5 text-[10px] font-semibold text-slate-300 drop-shadow-md">
            {phrase.sub}
          </div>
        </div>
      );

    case 'dynamic-punch':
    default:
      return (
        <div className="flex flex-col items-center animate-in fade-in zoom-in-95 duration-200">
          <div className="text-xs font-black uppercase tracking-wider text-slate-200 drop-shadow-md">
            {phrase.lead}
          </div>
          <div
            className="mt-0.5 text-2xl sm:text-3xl font-black uppercase tracking-tighter text-white"
            style={{
              textShadow: '0 4px 0 #000, 0 8px 16px rgba(0,0,0,0.85), 0 0 20px rgba(56,189,248,0.4)',
            }}
          >
            {phrase.hero}
          </div>
          <div className="mt-1 rounded bg-cyan-400 px-2 py-0.5 text-[10px] font-black uppercase tracking-wide text-slate-950 shadow-md">
            {phrase.sub}
          </div>
        </div>
      );
  }
}

