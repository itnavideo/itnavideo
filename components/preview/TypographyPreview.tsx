'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX, Sparkles, Film, Wand2, Check } from 'lucide-react';
import { getTypographyStyle, type TypographyStyle } from '../typography/TypographyStylePicker';
import { FONT_FACES_CSS, FONTS } from '../../remotion/templates/TYPOGRAPHY_VIDEO/shared/fonts';

const CREATOR_SAMPLE_VIDEO =
  'https://storage.googleapis.com/itnavideo-media-assets/professional-creator-girl-before_rwmxsd.mp4';
const CREATOR_SAMPLE_POSTER =
  'https://storage.googleapis.com/itnavideo-media-assets/professional-creator-girl-before_rwmxsd.jpg';

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
      <style dangerouslySetInnerHTML={{ __html: FONT_FACES_CSS }} />
      {/* ── View Mode Switcher (Demo Video vs Live Creator Overlay Test) ── */}
      {!videoUrl && (
        <div className="mb-2.5 flex items-center gap-1.5 rounded-full border border-white/10 bg-[#0E1526] p-1 text-xs shadow-lg">
          <button
            type="button"
            onClick={() => setViewMode('demo')}
            className={`flex items-center gap-1.5 rounded-full px-3.5 py-1.5 font-bold transition cursor-pointer active:scale-95 ${
              viewMode === 'demo'
                ? 'bg-gradient-to-r from-[#FF6D00] to-[#FF8F00] text-black shadow-md font-black'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Film size={13} />
            <span>🎬 Style Demo Reel</span>
          </button>
          <button
            type="button"
            onClick={() => setViewMode('creatorTest')}
            className={`flex items-center gap-1.5 rounded-full px-3.5 py-1.5 font-bold transition cursor-pointer active:scale-95 ${
              viewMode === 'creatorTest'
                ? 'bg-gradient-to-r from-[#FF6D00] to-[#FF8F00] text-black shadow-md font-black'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Wand2 size={13} />
            <span>⚡ Live Kinetic Preview</span>
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
          <Sparkles size={13} className="text-[#FF9100]" />
          <span>{currentStyle.name}</span>
          <span className="text-slate-500">·</span>
          <span className="text-slate-400 font-normal">{currentStyle.tag}</span>
        </div>
        <p className="mt-0.5 text-[11px] text-slate-400 leading-tight">
          {viewMode === 'demo' && !videoUrl
            ? 'Playing verified kinetic style demo reel. Click any card below to switch styles.'
            : 'Testing full-screen kinetic typography on creator sample video.'}
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
    case 'vox-giant-stagger':
      return (
        <div className="flex flex-col items-center justify-center w-full px-2 animate-in fade-in zoom-in-95 duration-200">
          <div className="flex flex-col items-start w-full max-w-[280px] gap-1 text-left">
            {phrase.lead && (
              <div
                className="text-base sm:text-lg font-black uppercase text-white drop-shadow-[0_4px_12px_rgba(0,0,0,0.9)]"
                style={{ fontFamily: FONTS.archivoBlack, letterSpacing: '-0.02em' }}
              >
                {phrase.lead}
              </div>
            )}
            <div className="bg-[#FF6D00] px-3 py-1 rounded shadow-lg shadow-[#FF6D00]/40 -rotate-1 transform">
              <span
                className="text-2xl sm:text-3xl font-black uppercase text-black leading-none block"
                style={{ fontFamily: FONTS.archivoBlack, letterSpacing: '-0.03em' }}
              >
                {phrase.hero}
              </span>
            </div>
            {phrase.sub && (
              <div className="border-l-4 border-[#FF8F00] pl-2 mt-1">
                <span
                  className="text-xs sm:text-sm font-extrabold uppercase text-slate-200 block drop-shadow-md"
                  style={{ fontFamily: FONTS.inter }}
                >
                  {phrase.sub}
                </span>
              </div>
            )}
          </div>
        </div>
      );

    case 'apple-keynote-punch':
      return (
        <div className="flex flex-col items-center justify-center w-full px-2 text-center animate-in fade-in zoom-in-90 duration-200">
          {phrase.lead && (
            <div
              className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1"
              style={{ fontFamily: FONTS.inter }}
            >
              {phrase.lead}
            </div>
          )}
          <div
            className="text-3xl sm:text-4xl font-black text-white tracking-tight drop-shadow-[0_10px_30px_rgba(0,0,0,0.9)]"
            style={{ fontFamily: FONTS.inter, letterSpacing: '-0.04em' }}
          >
            {phrase.hero}
          </div>
          {phrase.sub && (
            <div className="mt-2 inline-flex items-center rounded-full bg-white/10 border border-white/20 px-3 py-0.5 backdrop-blur-md">
              <span
                className="text-[11px] font-semibold text-[#FF9100]"
                style={{ fontFamily: FONTS.inter }}
              >
                {phrase.sub}
              </span>
            </div>
          )}
        </div>
      );

    case 'kinetic-marquee-diagonal':
      return (
        <div className="flex flex-col items-center justify-center w-full overflow-hidden -rotate-6 transform scale-105 animate-in fade-in duration-200">
          <div
            className="text-xs font-black uppercase text-transparent tracking-widest whitespace-nowrap mb-1"
            style={{ WebkitTextStroke: '1px #FF8F00' }}
          >
            {phrase.lead || 'KINETIC ENERGY'} • {phrase.lead || 'KINETIC ENERGY'} •
          </div>
          <div className="bg-gradient-to-r from-[#FF6D00] to-[#FF8F00] px-4 py-1.5 rounded-xl shadow-xl shadow-[#FF6D00]/40">
            <span
              className="text-2xl sm:text-3xl font-black uppercase text-black leading-none block whitespace-nowrap"
              style={{ fontFamily: FONTS.archivoBlack }}
            >
              {phrase.hero}
            </span>
          </div>
          <div className="text-xs font-black uppercase text-white/80 tracking-widest whitespace-nowrap mt-1 drop-shadow">
            {phrase.hero} — {phrase.hero} —
          </div>
        </div>
      );

    case 'editorial-magazine-manifesto':
      return (
        <div className="flex flex-col items-start justify-center w-full px-4 text-left animate-in fade-in slide-in-from-bottom-2 duration-300">
          {phrase.lead && (
            <div
              className="text-[11px] font-medium uppercase tracking-[0.2em] text-white/70 mb-1"
              style={{ fontFamily: FONTS.tenorSans }}
            >
              — {phrase.lead}
            </div>
          )}
          <div
            className="text-3xl sm:text-4xl italic font-bold text-white tracking-tight drop-shadow-[0_4px_20px_rgba(0,0,0,0.9)]"
            style={{ fontFamily: FONTS.cormorant }}
          >
            "{phrase.hero}"
          </div>
          {phrase.sub && (
            <div
              className="text-xs font-normal text-slate-300 mt-2 max-w-[220px]"
              style={{ fontFamily: FONTS.tenorSans }}
            >
              {phrase.sub}
            </div>
          )}
        </div>
      );

    case 'glitch-cyber-rave':
      return (
        <div className="flex flex-col items-center justify-center w-full px-2 text-center animate-in fade-in zoom-in-95 duration-150">
          {phrase.lead && (
            <div className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#00E5FF] bg-[#00E5FF]/10 border border-[#00E5FF]/40 px-2 py-0.5 mb-1.5">
              {phrase.lead}
            </div>
          )}
          <div
            className="text-3xl sm:text-4xl font-black uppercase text-white tracking-tight"
            style={{
              fontFamily: FONTS.archivoBlack,
              textShadow: '3px 0 #FF6D00, -3px 0 #00E5FF, 0 0 20px rgba(0,229,255,0.4)',
            }}
          >
            {phrase.hero}
          </div>
          {phrase.sub && (
            <div className="text-xs font-mono font-bold uppercase text-[#FF8F00] mt-1.5 tracking-wider">
              // {phrase.sub}
            </div>
          )}
        </div>
      );

    case 'split-color-invert':
      return (
        <div className="relative flex flex-col items-center justify-center w-full overflow-hidden py-4 animate-in fade-in zoom-in-95 duration-200">
          <div className="absolute inset-x-0 top-0 h-1/2 bg-[#FF6D00] -z-10" />
          {phrase.lead && (
            <div
              className="text-xs font-extrabold uppercase text-black tracking-wider mb-1"
              style={{ fontFamily: FONTS.syne }}
            >
              {phrase.lead}
            </div>
          )}
          <div
            className="text-3xl sm:text-4xl font-black uppercase text-white tracking-tighter drop-shadow-[0_8px_20px_rgba(0,0,0,0.8)]"
            style={{ fontFamily: FONTS.archivoBlack }}
          >
            {phrase.hero}
          </div>
          {phrase.sub && (
            <div
              className="text-xs font-extrabold uppercase text-[#FF8F00] mt-1 tracking-wide"
              style={{ fontFamily: FONTS.syne }}
            >
              {phrase.sub}
            </div>
          )}
        </div>
      );

    case 'isometric-3d-flythrough':
      return (
        <div
          className="flex flex-col items-center justify-center w-full px-2 text-center animate-in fade-in zoom-in-90 duration-300"
          style={{ transform: 'perspective(600px) rotateX(20deg)' }}
        >
          {phrase.lead && (
            <div className="text-xs font-bold uppercase text-[#38BDF8] tracking-widest mb-1 drop-shadow">
              {phrase.lead}
            </div>
          )}
          <div
            className="text-3xl sm:text-4xl font-black uppercase text-white tracking-tight"
            style={{
              fontFamily: FONTS.archivoBlack,
              textShadow:
                '0 1px 0 #FF6D00, 0 2px 0 #FF6D00, 0 3px 0 #CC5500, 0 4px 0 #993D00, 0 10px 25px rgba(0,0,0,0.9)',
            }}
          >
            {phrase.hero}
          </div>
          {phrase.sub && (
            <div className="text-xs font-semibold uppercase text-slate-200 mt-1.5 drop-shadow">
              {phrase.sub}
            </div>
          )}
        </div>
      );


    case 'multi-line-block-slam':
    default:
      return (
        <div className="flex flex-col items-center justify-center gap-1.5 animate-in fade-in zoom-in-95 -rotate-2 duration-200">
          {phrase.lead && (
            <div className="bg-white text-black px-2.5 py-0.5 border-2 border-black font-black uppercase text-xs tracking-wider shadow-[3px_3px_0_#000]">
              {phrase.lead}
            </div>
          )}
          <div className="bg-[#FF6D00] text-black px-3.5 py-1 border-2 border-black font-black uppercase text-2xl sm:text-3xl tracking-tight shadow-[5px_5px_0_#000]">
            {phrase.hero}
          </div>
          {phrase.sub && (
            <div className="bg-[#FFD600] text-black px-2.5 py-0.5 border-2 border-black font-black uppercase text-xs tracking-wider shadow-[3px_3px_0_#000]">
              {phrase.sub}
            </div>
          )}
        </div>
      );
  }
}

